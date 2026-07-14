/**
 * 跨设备投屏同步 — EMQX MQTT (主) + ntfy HTTP 轮询 (备)
 * URL 参数 ?room=XXXX 加入同一房间；讲者台无 room 时自动生成
 */
(function (global) {
  'use strict';

  var MQTT_CDN = 'https://unpkg.com/mqtt@5.3.5/dist/mqtt.min.js';
  var MQTT_BROKERS = [
    'wss://broker.emqx.io:8084/mqtt',
    'wss://broker.hivemq.com:8884/mqtt'
  ];
  var NTFY_BASE = 'https://ntfy.sh';
  var TOPIC_PREFIX = 'aifp';

  var roomId = null;
  var role = 'audience';
  var deckMode = '20m';
  var onNav = null;
  var onAction = null;
  var onConnect = null;
  var onError = null;
  var onReady = null;
  var connected = false;
  var mqttClient = null;
  var mqttReady = false;
  var brokerIdx = 0;
  var pollTimer = null;
  var lastNavAt = 0;
  var pendingNav = null;
  var pendingActions = [];

  function parseRoom() {
    try {
      var q = new URLSearchParams(window.location.search).get('room');
      return q ? String(q).trim().toUpperCase() : null;
    } catch (err) {
      return null;
    }
  }

  function genRoom() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var s = '';
    for (var i = 0; i < 6; i++) {
      s += chars[Math.floor(Math.random() * chars.length)];
    }
    return s;
  }

  function getDeckMode() {
    if (global.PRESENTER_20M) return '20m';
    try {
      var path = (window.location.pathname || '').toLowerCase();
      if (path.indexOf('-20m') >= 0 || path.indexOf('20m') >= 0) return '20m';
      if (path.indexOf('roadshow') >= 0) return 'roadshow';
      var q = new URLSearchParams(window.location.search);
      if (q.get('mode') === '20m') return '20m';
      if (q.get('roadshow') === '1') return 'roadshow';
    } catch (err) {}
    return 'default';
  }

  function mqttTopic(suffix) {
    return TOPIC_PREFIX + '/' + deckMode + '/' + roomId.toLowerCase() + '/' + suffix;
  }

  function ntfyTopic(suffix) {
    return TOPIC_PREFIX + '-' + deckMode + '-' + roomId.toLowerCase() + '-' + suffix;
  }

  function ntfyUrl(suffix, asJson) {
    return NTFY_BASE + '/' + ntfyTopic(suffix) + (asJson ? '/json' : '');
  }

  function ensureMqtt(cb) {
    if (typeof mqtt !== 'undefined') {
      cb();
      return;
    }
    var s = document.createElement('script');
    s.src = MQTT_CDN;
    s.onload = cb;
    s.onerror = function () {
      console.warn('[remote-sync] MQTT 库加载失败，使用 HTTP 备通道');
      cb();
    };
    document.head.appendChild(s);
  }

  function dispatchNav(msg) {
    if (!msg || !msg.at || msg.at <= lastNavAt) return;
    lastNavAt = msg.at;
    if (onNav) onNav(msg);
  }

  function dispatchAction(msg) {
    if (!msg || !msg.action) return;
    if (onAction) onAction(msg);
  }

  function parsePayload(buf) {
    try {
      var raw = typeof buf === 'string' ? buf : String(buf);
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function markConnected() {
    if (connected) return;
    connected = true;
    if (onConnect) onConnect(roomId);
  }

  function publishMqtt(suffix, data, retain) {
    if (!mqttClient || !mqttReady) return false;
    try {
      mqttClient.publish(mqttTopic(suffix), JSON.stringify(data), { qos: 0, retain: !!retain });
      return true;
    } catch (err) {
      return false;
    }
  }

  function publishNtfy(suffix, data) {
    return fetch(ntfyUrl(suffix, false), {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json', 'Title': 'sync' }
    }).then(function (res) { return res.ok; }).catch(function () { return false; });
  }

  function publishNavPayload(data) {
    var okMqtt = publishMqtt('nav', data, true);
    publishNtfy('nav', data);
    return okMqtt;
  }

  function flushPending() {
    if (pendingNav) {
      publishNavPayload(pendingNav);
      pendingNav = null;
    }
    pendingActions.forEach(function (item) {
      publishMqtt('action', item, false);
      publishNtfy('action', item);
    });
    pendingActions = [];
  }

  function connectMqtt() {
    if (typeof mqtt === 'undefined') {
      startHttpFallback();
      return;
    }
    if (mqttClient) {
      try { mqttClient.end(true); } catch (err) {}
      mqttClient = null;
      mqttReady = false;
    }
    var broker = MQTT_BROKERS[brokerIdx] || MQTT_BROKERS[0];
    mqttClient = mqtt.connect(broker, {
      clientId: 'aifp-' + role + '-' + roomId + '-' + Math.random().toString(36).slice(2, 9),
      clean: true,
      reconnectPeriod: 4000,
      connectTimeout: 8000
    });

    mqttClient.on('connect', function () {
      mqttReady = true;
      markConnected();
      if (role === 'audience') {
        mqttClient.subscribe(mqttTopic('nav'));
        mqttClient.subscribe(mqttTopic('action'));
      }
      flushPending();
      if (onReady) onReady('mqtt');
    });

    mqttClient.on('message', function (topic, buf) {
      var msg = parsePayload(buf);
      if (!msg) return;
      if (topic === mqttTopic('nav')) dispatchNav(msg);
      if (topic === mqttTopic('action')) dispatchAction(msg);
    });

    mqttClient.on('error', function () {
      if (onError) onError('MQTT 连接异常，尝试备通道…');
    });

    mqttClient.on('close', function () {
      mqttReady = false;
    });

    mqttClient.on('offline', function () {
      mqttReady = false;
      if (role === 'audience' && onError) onError('MQTT 离线，HTTP 轮询继续…');
    });
  }

  function normalizePollRows(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return [data];
  }

  function pollNtfyNav() {
    return fetch(ntfyUrl('nav', true) + '?poll=1', { mode: 'cors', cache: 'no-store' })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        var rows = normalizePollRows(data);
        if (!rows.length) return false;
        markConnected();
        var latest = rows[rows.length - 1];
        var msg = parsePayload(latest.message || latest.body || '{}');
        if (msg) dispatchNav(msg);
        return true;
      })
      .catch(function () { return false; });
  }

  function startHttpFallback() {
    if (role !== 'audience') return;
    if (pollTimer) return;
    pollNtfyNav();
    pollTimer = setInterval(pollNtfyNav, 600);
  }

  function connect(opts) {
    opts = opts || {};
    roomId = (opts.room || parseRoom() || '').toUpperCase();
    if (!roomId) return null;

    role = opts.role || 'audience';
    deckMode = opts.mode || getDeckMode();
    onNav = opts.onNav || null;
    onAction = opts.onAction || null;
    onConnect = opts.onConnect || null;
    onError = opts.onError || null;
    onReady = opts.onReady || null;
    lastNavAt = 0;
    connected = false;

    ensureMqtt(function () {
      connectMqtt();
      if (role === 'audience') startHttpFallback();
      if (role === 'presenter') {
        markConnected();
        flushPending();
      }
    });

    return { roomId: roomId, role: role, deckMode: deckMode };
  }

  function publishNav(payload) {
    if (role !== 'presenter' || !roomId) return Promise.resolve(false);
    var p = payload || {};
    p.at = p.at || Date.now();
    if (!mqttReady) pendingNav = p;
    var mqttOk = publishMqtt('nav', p, true);
    return publishNtfy('nav', p).then(function (ntfyOk) {
      var ok = mqttOk || ntfyOk;
      if (!ok && onError) onError('发布失败：MQTT 与 HTTP 均不可用');
      return ok;
    });
  }

  function publishAction(action, payload) {
    if (role !== 'presenter' || !roomId) return;
    var data = { action: action, payload: payload || {}, at: Date.now() };
    if (!mqttReady) pendingActions.push(data);
    publishMqtt('action', data, false);
    publishNtfy('action', data);
  }

  function ensurePresenterRoom() {
    roomId = parseRoom();
    if (!roomId) {
      roomId = genRoom();
      try {
        var u = new URL(window.location.href);
        u.searchParams.set('room', roomId);
        window.history.replaceState({}, '', u.toString());
      } catch (err) {}
    }
    return roomId;
  }

  function appendRoom(url) {
    if (!roomId) return url;
    try {
      var u = new URL(url, window.location.href);
      u.searchParams.set('room', roomId);
      if (deckMode === '20m' && !u.searchParams.get('mode')) {
        u.searchParams.set('mode', '20m');
      }
      return u.pathname + u.search + u.hash;
    } catch (err) {
      var sep = url.indexOf('?') >= 0 ? '&' : '?';
      var out = url + sep + 'room=' + encodeURIComponent(roomId);
      if (deckMode === '20m' && url.indexOf('mode=20m') < 0) out += '&mode=20m';
      return out;
    }
  }

  function testPublish() {
    if (role !== 'presenter' || !roomId) return Promise.resolve(false);
    return publishNav({
      type: 'go',
      chapter: 0,
      beat: 0,
      at: Date.now(),
      ping: true
    });
  }

  global.RemoteSync = {
    connect: connect,
    ensurePresenterRoom: ensurePresenterRoom,
    publishNav: publishNav,
    publishAction: publishAction,
    appendRoom: appendRoom,
    testPublish: testPublish,
    isEnabled: function () { return !!(roomId || parseRoom()); },
    isConnected: function () { return connected; },
    isMqttReady: function () { return mqttReady; },
    getRoomId: function () { return roomId || parseRoom(); },
    getRole: function () { return role; },
    getDeckMode: function () { return deckMode; }
  };
})(window);
