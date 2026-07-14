/**
 * 跨设备投屏同步 — 讲者台通过 ntfy.sh (HTTP/SSE) 控制各端投屏进度
 * URL 参数 ?room=XXXX 加入同一房间；讲者台无 room 时自动生成
 */
(function (global) {
  'use strict';

  var NTFY_BASE = 'https://ntfy.sh';
  var TOPIC_PREFIX = 'aifp';

  var roomId = null;
  var role = 'audience';
  var deckMode = '20m';
  var onNav = null;
  var onAction = null;
  var onConnect = null;
  var onError = null;
  var connected = false;
  var navSource = null;
  var actionSource = null;
  var pollTimer = null;
  var lastNavAt = 0;
  var pendingNav = null;

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

  function topic(suffix) {
    return TOPIC_PREFIX + '-' + deckMode + '-' + roomId.toLowerCase() + '-' + suffix;
  }

  function ntfyUrl(suffix, asJson) {
    return NTFY_BASE + '/' + topic(suffix) + (asJson ? '/json' : '');
  }

  function publishRaw(suffix, data) {
    if (!roomId) return Promise.resolve(false);
    return fetch(ntfyUrl(suffix, false), {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Title': 'sync',
        'Priority': '2'
      }
    }).then(function (res) {
      return res.ok;
    }).catch(function (err) {
      console.warn('[remote-sync] publish failed', suffix, err);
      return false;
    });
  }

  function parseNtfyMessage(ev) {
    try {
      var wrap = JSON.parse(ev.data);
      var raw = wrap.message || wrap.body || wrap;
      if (typeof raw === 'string') return JSON.parse(raw);
      return raw;
    } catch (err) {
      return null;
    }
  }

  function closeSources() {
    if (navSource) {
      navSource.close();
      navSource = null;
    }
    if (actionSource) {
      actionSource.close();
      actionSource = null;
    }
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
    connected = false;
  }

  function normalizePollRows(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return [data];
  }

  function pollLatestNav() {
    return fetch(ntfyUrl('nav', true) + '?poll=1', { mode: 'cors', cache: 'no-store' })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        var rows = normalizePollRows(data);
        if (!rows.length) return;
        if (!connected && role === 'audience') {
          connected = true;
          if (onConnect) onConnect(roomId);
        }
        var latest = rows[rows.length - 1];
        var msg;
        try {
          msg = JSON.parse(latest.message || latest.body || '{}');
        } catch (err) { return; }
        if (msg && msg.at && msg.at > lastNavAt && onNav) {
          lastNavAt = msg.at;
          onNav(msg);
        }
      })
      .catch(function () {});
  }

  function subscribeAudience() {
    closeSources();
    pollLatestNav();
    pollTimer = setInterval(pollLatestNav, 800);

    try {
      navSource = new EventSource(ntfyUrl('nav', true));
      actionSource = new EventSource(ntfyUrl('action', true));
    } catch (err) {
      if (onError) onError('SSE 不可用，已切换轮询模式');
      return;
    }

    navSource.onopen = function () {
      connected = true;
      if (onConnect) onConnect(roomId);
      pollLatestNav();
    };
    navSource.onerror = function () {
      connected = false;
      if (onError) onError('连接中断，正在重试…');
    };
    navSource.onmessage = function (ev) {
      var msg = parseNtfyMessage(ev);
      if (!msg || !msg.at || msg.at <= lastNavAt) return;
      lastNavAt = msg.at;
      if (onNav) onNav(msg);
    };

    actionSource.onmessage = function (ev) {
      var msg = parseNtfyMessage(ev);
      if (!msg || !msg.action || !onAction) return;
      onAction(msg);
    };
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
    lastNavAt = 0;

    if (role === 'audience') {
      subscribeAudience();
    } else {
      connected = true;
      if (pendingNav) {
        publishRaw('nav', pendingNav);
        pendingNav = null;
      }
      if (onConnect) onConnect(roomId);
    }

    return { roomId: roomId, role: role, deckMode: deckMode };
  }

  function publishNav(payload) {
    if (role !== 'presenter' || !roomId) return;
    var p = payload || {};
    p.at = p.at || Date.now();
    if (!connected) {
      pendingNav = p;
    }
    publishRaw('nav', p).then(function (ok) {
      if (!ok && onError) onError('发布失败，请检查网络能否访问 ntfy.sh');
    });
  }

  function publishAction(action, payload) {
    if (role !== 'presenter' || !roomId) return;
    publishRaw('action', {
      action: action,
      payload: payload || {},
      at: Date.now()
    });
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

  function isEnabled() {
    return !!(roomId || parseRoom());
  }

  function isConnected() {
    return connected;
  }

  global.RemoteSync = {
    connect: connect,
    ensurePresenterRoom: ensurePresenterRoom,
    publishNav: publishNav,
    publishAction: publishAction,
    appendRoom: appendRoom,
    isEnabled: isEnabled,
    isConnected: isConnected,
    getRoomId: function () { return roomId || parseRoom(); },
    getRole: function () { return role; },
    getDeckMode: function () { return deckMode; }
  };
})(window);
