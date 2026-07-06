/**
 * 讲者控制台 — 四宫格双屏
 * 投屏：index.html（观众） · 控制：presenter.html（讲者）
 * 通过 BroadcastChannel 同步 chapter/beat，iframe 预览用 ?preview=1
 */
(function () {
  'use strict';

  var CHANNEL = 'ai-final-presentation-v1';
  var STORAGE_KEY = 'ai-final-presentation-speaker-notes-v8';
  var EDITED_URL = 'data/speaker-beats-v8-edited.json';
  var ACTION_KEY = 'ai-final-presentation-audience-action';
  var SERVER_POLL_MS = 30000;
  var BEATS_PER_PAGE = [2, 5, 4, 5, 2, 3];
  var TARGET_SEC = 600;

  var state = {
    chapter: 0,
    beat: 0,
    startTime: Date.now(),
    pageStartTime: Date.now()
  };
  var notes = null;
  var baseNotes = null;
  var manifestMap = {};
  var audienceWin = null;
  var interactEnabled = false;
  var saveTimer = null;
  var lastSyncedKey = '';
  var evidenceState = { ids: [], idx: 0 };
  var iframeCur = document.getElementById('pv-iframe-cur');
  var iframeNext = document.getElementById('pv-iframe-next');
  var scriptBox = document.getElementById('pv-script-text');
  var scriptStatus = document.getElementById('pv-script-status');
  var interactBtn = document.getElementById('pv-toggle-interact');
  var frameHint = document.getElementById('pv-frame-hint');
  var frameWrap = iframeCur.parentElement;
  var pvOverlay = document.getElementById('pv-evidence-overlay');
  var pvImg = document.getElementById('pv-evidence-img');
  var pvCap = document.getElementById('pv-evidence-cap');
  var pvSource = document.getElementById('pv-evidence-source');
  var channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL) : null;

  function fmt(sec) {
    var neg = sec < 0;
    sec = Math.abs(Math.floor(sec));
    return (neg ? '-' : '') + String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
  }

  function pageBeats(ch) { return BEATS_PER_PAGE[ch] || 1; }
  function curKey(ch, beat) { return ch + ':' + beat; }

  function clone(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function nextState(ch, beat) {
    if (beat < pageBeats(ch) - 1) return { chapter: ch, beat: beat + 1 };
    if (ch < BEATS_PER_PAGE.length - 1) return { chapter: ch + 1, beat: 0 };
    return null;
  }

  function prevState(ch, beat) {
    if (beat > 0) return { chapter: ch, beat: beat - 1 };
    if (ch > 0) {
      var pc = ch - 1;
      return { chapter: pc, beat: pageBeats(pc) - 1 };
    }
    return null;
  }

  var navLeadUntil = 0;

  function touchNavLead() {
    navLeadUntil = Date.now() + 700;
  }

  function advanceLocal() {
    var ch = state.chapter;
    var beat = state.beat;
    if (beat < pageBeats(ch) - 1) {
      state.beat = beat + 1;
    } else if (ch < BEATS_PER_PAGE.length - 1) {
      state.chapter = ch + 1;
      state.beat = 0;
      state.pageStartTime = Date.now();
    } else return;
    touchNavLead();
    updateUI();
    send({ type: 'advance' });
  }

  function retreatLocal() {
    var ch = state.chapter;
    var beat = state.beat;
    if (beat > 0) {
      state.beat = beat - 1;
    } else if (ch > 0) {
      var pc = ch - 1;
      state.chapter = pc;
      state.beat = pageBeats(pc) - 1;
      state.pageStartTime = Date.now();
    } else return;
    touchNavLead();
    updateUI();
    send({ type: 'retreat' });
  }

  function goLocal(ch, beat) {
    ch = Math.max(0, Math.min(BEATS_PER_PAGE.length - 1, ch));
    beat = Math.max(0, Math.min(pageBeats(ch) - 1, beat || 0));
    if (ch === state.chapter && beat === state.beat) return;
    state.chapter = ch;
    state.beat = beat;
    state.pageStartTime = Date.now();
    touchNavLead();
    updateUI();
    send({ type: 'go', chapter: ch, beat: beat });
  }

  function previewUrl(ch, beat) {
    return 'index.html?preview=1&ch=' + ch + '&beat=' + beat;
  }

  function postGoto(iframe, ch, beat) {
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage({ type: 'preview-goto', chapter: ch, beat: beat }, '*');
  }

  function ensureIframes() {
    if (!iframeCur.src || iframeCur.src === 'about:blank') {
      iframeCur.src = previewUrl(0, 0);
    }
    if (!iframeNext.src || iframeNext.src === 'about:blank') {
      var n = nextState(0, 0);
      iframeNext.src = n ? previewUrl(n.chapter, n.beat) : previewUrl(0, 0);
    }
  }

  function label(ch, beat) {
    if (!notes || !notes.pages[ch]) return 'P' + (ch + 1) + ' · Beat ' + (beat + 1);
    var p = notes.pages[ch];
    return p.code + ' ' + p.tag + ' · ' + (beat + 1) + '/' + p.beats.length;
  }

  function getAsset(id) {
    return manifestMap[id] || null;
  }

  function scriptText(ch, beat) {
    if (!notes || !notes.pages[ch]) return '';
    var beats = notes.pages[ch].beats;
    return beats[beat] || '';
  }

  function setStatus(text, cls) {
    scriptStatus.textContent = text;
    scriptStatus.className = 'pv-script-status' + (cls ? ' ' + cls : '');
  }

  function evidenceHint(text) {
    var m = text.match(/Evidence[「]([^」]+)[」]/g);
    if (!m || !m.length) return '';
    return '本步 Evidence 建议：' + m.map(function (s) {
      return s.replace(/Evidence[「]/, '').replace(/[」]/g, '');
    }).join(' · ');
  }

  function notesSavedAt(obj) {
    return (obj && obj.savedAt) ? +obj.savedAt : 0;
  }

  function withSavedAt(obj) {
    var copy = clone(obj);
    copy.savedAt = Date.now();
    copy.source = 'presenter';
    return copy;
  }

  function mergeNotes(base, local, server) {
    var winner = clone(base);
    var localAt = notesSavedAt(local);
    var serverAt = notesSavedAt(server);
    if (server && server.pages && serverAt >= localAt && serverAt > 0) winner = clone(server);
    else if (local && local.pages) winner = clone(local);
    if (localAt > serverAt && local && local.pages) winner = clone(local);
    if (!winner.savedAt) winner.savedAt = Math.max(localAt, serverAt) || Date.now();
    return winner;
  }

  function fetchEditedNotes() {
    return fetch(EDITED_URL + '?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  function persistNotes(statusText, skipServerHint) {
    if (!notes) return;
    notes = withSavedAt(notes);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      var msg = statusText || '已保存到本机；各设备将自动拉取线上最新稿（若已发布）。';
      if (!skipServerHint) msg += ' 导出后可放入 data/speaker-beats-v8-edited.json 推送全站。';
      setStatus(msg, 'is-saved');
    } catch (err) {
      setStatus('保存失败：浏览器本地存储不可用，请先导出备份。');
    }
  }

  function flushPendingSave() {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
      saveCurrentBeat('离开前已自动保存逐字稿。', true);
    }
  }

  function applyServerNotesIfNewer(server) {
    if (!server || !server.pages || !notes) return false;
    if (notesSavedAt(server) <= notesSavedAt(notes)) return false;
    notes = clone(server);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch (err) {}
    syncEditorFromState(true);
    setStatus('已同步线上最新逐字稿（' + new Date(notes.savedAt).toLocaleString() + '）。', 'is-saved');
    return true;
  }

  function syncEditorFromState(force) {
    var key = curKey(state.chapter, state.beat);
    if (!force && lastSyncedKey === key && document.activeElement === scriptBox) return;
    scriptBox.value = scriptText(state.chapter, state.beat) || '';
    lastSyncedKey = key;
    setStatus('可直接在线编辑；点“保存”立即固化到本机，或自动保存。');
  }

  function saveCurrentBeat(statusText, skipServerHint) {
    if (!notes || !notes.pages[state.chapter]) return;
    notes.pages[state.chapter].beats[state.beat] = scriptBox.value;
    persistNotes(statusText || '本步逐字稿已保存。', skipServerHint);
  }

  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    setStatus('检测到修改，1 秒后自动保存…', 'is-dirty');
    saveTimer = setTimeout(function () {
      saveCurrentBeat('已自动保存到本机浏览器。', true);
    }, 1000);
  }

  function updateUI() {
    var ch = state.chapter;
    var beat = state.beat;
    var next = nextState(ch, beat);

    closeEvidenceOverlay();
    evidenceState.ids = [];
    evidenceState.idx = 0;

    document.getElementById('pv-cur-label').textContent = label(ch, beat);
    document.getElementById('pv-next-label').textContent = next ? label(next.chapter, next.beat) : '（终场）';
    document.getElementById('pv-script-label').textContent = label(ch, beat);
    syncEditorFromState(true);

    var hint = evidenceHint(scriptText(ch, beat));
    var hintEl = document.getElementById('pv-ev-hint');
    if (hint) {
      hintEl.textContent = hint;
      hintEl.hidden = false;
    } else {
      hintEl.hidden = true;
    }

    postGoto(iframeCur, ch, beat);
    if (next) postGoto(iframeNext, next.chapter, next.beat);

    var totalBeats = 0;
    var doneBeats = 0;
    BEATS_PER_PAGE.forEach(function (n, i) {
      totalBeats += n;
      if (i < ch) doneBeats += n;
      else if (i === ch) doneBeats += beat + 1;
    });
    document.getElementById('pv-beat-meta').textContent =
      '全局进度 ' + doneBeats + ' / ' + totalBeats + ' 幕 · 第 ' + (ch + 1) + ' 页第 ' + (beat + 1) + ' 幕';
    document.getElementById('pv-progress-fill').style.width = (doneBeats / totalBeats * 100) + '%';
  }

  function updateTimers() {
    var now = Date.now();
    var totalElapsed = (now - state.startTime) / 1000;
    var pageElapsed = (now - state.pageStartTime) / 1000;
    var pageBudget = (notes && notes.pages[state.chapter]) ? notes.pages[state.chapter].durationSec : 60;
    var totalRemain = TARGET_SEC - totalElapsed;
    var pageRemain = pageBudget - pageElapsed;

    document.getElementById('pv-total').textContent = fmt(totalElapsed);
    var remainTotal = document.getElementById('pv-remain-total');
    remainTotal.textContent = '剩余 ' + fmt(totalRemain);
    remainTotal.className = 'pv-clock sub' + (totalRemain < 60 ? ' warn' : '') + (totalRemain < 0 ? ' over' : '');

    document.getElementById('pv-page-elapsed').textContent = '本页 ' + fmt(pageElapsed);
    var pageRemainEl = document.getElementById('pv-page-remain');
    pageRemainEl.textContent = '本页剩余 ' + fmt(pageRemain);
    pageRemainEl.className = 'pv-clock sub' + (pageRemain < 15 ? ' warn' : '') + (pageRemain < 0 ? ' over' : '');
  }

  function applyRemote(msg) {
    if (!msg || msg.type !== 'state') return;
    if (Date.now() < navLeadUntil &&
        (msg.chapter !== state.chapter || msg.beat !== state.beat)) {
      if (msg.startTime) state.startTime = msg.startTime;
      return;
    }
    var chChanged = state.chapter !== msg.chapter;
    state.chapter = msg.chapter;
    state.beat = msg.beat;
    if (msg.startTime) state.startTime = msg.startTime;
    if (chChanged || msg.pageStartTime) state.pageStartTime = msg.pageStartTime || Date.now();
    updateUI();
  }

  function send(cmd) {
    if (channel) channel.postMessage(cmd);
  }

  function getAudienceWindow() {
    if (!audienceWin || audienceWin.closed) return null;
    try {
      var href = audienceWin.location.href || '';
      if (!href || href === 'about:blank') return null;
    } catch (err) {
      return audienceWin;
    }
    return audienceWin;
  }

  function broadcastAudienceAction(action, payload) {
    try {
      localStorage.setItem(ACTION_KEY, JSON.stringify({
        action: action,
        payload: payload || {},
        at: Date.now()
      }));
    } catch (err) {}
  }

  function controlAudience(action, payload) {
    payload = payload || {};
    try {
      var win = getAudienceWindow();
      if (win && !win.closed && win.document) {
        if (action === 'close-evidence') {
          var lb = win.document.getElementById('lightbox');
          if (lb) lb.classList.remove('open');
          if (win.APP) win.APP.lbOpen = false;
          return true;
        }
        if (action === 'move-evidence') {
          var btn = win.document.getElementById(payload.dir < 0 ? 'lb-prev' : 'lb-next');
          if (btn) {
            btn.click();
            return true;
          }
        }
      }
    } catch (err) {}
    return false;
  }

  function syncAudienceEvidence(action, payload) {
    payload = payload || {};
    if (action === 'close-evidence') {
      controlAudience('close-evidence');
      send({ type: 'close-evidence' });
      broadcastAudienceAction('close-evidence');
      return;
    }
    if (action === 'move-evidence') {
      send({ type: 'move-evidence', dir: payload.dir || 1 });
      return;
    }
    if (action === 'open-evidence') {
      send({ type: 'open-evidence', ids: payload.ids || [], idx: payload.idx || 0 });
    }
  }

  function renderEvidenceOverlay() {
    var id = evidenceState.ids[evidenceState.idx];
    var a = getAsset(id);
    if (!a) return;
    pvImg.src = a.path;
    pvImg.alt = a.title || '';
    pvCap.textContent = (a.title || '') + (a.description ? ' - ' + a.description : '');
    if (a.sourceUrl) {
      pvSource.hidden = false;
      pvSource.href = a.sourceUrl;
      pvSource.textContent = (a.sourceLabel || '打开来源') + ' ↗';
    } else {
      pvSource.hidden = true;
      pvSource.removeAttribute('href');
    }
    pvOverlay.hidden = false;
  }

  function openEvidenceOverlay(ids, idx) {
    evidenceState.ids = (ids || []).slice();
    evidenceState.idx = Math.max(0, Math.min(evidenceState.ids.length - 1, idx || 0));
    renderEvidenceOverlay();
  }

  function moveEvidenceOverlay(dir) {
    if (!evidenceState.ids.length) return;
    evidenceState.idx = (evidenceState.idx + dir + evidenceState.ids.length) % evidenceState.ids.length;
    renderEvidenceOverlay();
  }

  function closeEvidenceOverlay() {
    pvOverlay.hidden = true;
  }

  function openAudience() {
    var url = 'index.html';
    var win = getAudienceWindow();
    if (win) {
      audienceWin = win;
      audienceWin.focus();
      try {
        if (win.location.href === 'about:blank' || !/\/index\.html/.test(win.location.pathname + win.location.href)) {
          win.location.href = url;
        }
      } catch (err) {}
    } else {
      audienceWin = window.open(url, 'ai-final-audience');
    }
    setTimeout(function () { send({ type: 'request-sync' }); }, 800);
  }

  function setInteractMode(on) {
    interactEnabled = !!on;
    iframeCur.classList.toggle('is-interactive', interactEnabled);
    interactBtn.classList.toggle('is-on', interactEnabled);
    interactBtn.textContent = interactEnabled ? '关闭点击' : '启用点击';
    frameHint.textContent = interactEnabled ? '点击模式：可点 Evidence，画面略缩小以露出底部按钮' : '悬停可轻量放大';
    frameHint.classList.toggle('is-visible', true);
    frameWrap.classList.remove('zoom-on');
  }

  function exportNotes() {
    if (!notes) return;
    notes = withSavedAt(notes);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch (err) {}
    var blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'speaker-beats-v8-edited.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus('已导出 speaker-beats-v8-edited.json；放入 data/ 并推送后，各设备将自动同步。', 'is-saved');
  }

  function bindKeys() {
    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Escape' && !pvOverlay.hidden) {
        e.preventDefault();
        closeEvidenceOverlay();
        syncAudienceEvidence('close-evidence');
        return;
      }
      switch (e.key) {
        case ' ':
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          advanceLocal();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          retreatLocal();
          break;
        default:
          if (e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            goLocal(+e.key - 1, 0);
          }
      }
    });
  }

  if (channel) {
    channel.onmessage = function (ev) {
      var msg = ev.data;
      if (!msg) return;
      if (msg.type === 'state') applyRemote(msg);
      if (msg.type === 'presenter-refocus') window.focus();
    };
  }

  window.addEventListener('message', function (e) {
    var msg = e.data;
    if (!msg) return;
    if (msg.type === 'presenter-open-evidence') {
      openEvidenceOverlay(msg.ids || [], msg.idx || 0);
      syncAudienceEvidence('open-evidence', { ids: msg.ids || [], idx: msg.idx || 0 });
      return;
    }
    if (msg.type !== 'presenter-audience-action') return;
    if (msg.action === 'close-evidence') {
      closeEvidenceOverlay();
      syncAudienceEvidence('close-evidence');
      return;
    }
    if (msg.action === 'move-evidence') {
      moveEvidenceOverlay(msg.dir || 1);
      send({ type: 'move-evidence', dir: msg.dir || 1 });
    }
  });

  document.getElementById('pv-open-audience').onclick = openAudience;
  document.getElementById('pv-reset-timer').onclick = function () {
    state.startTime = Date.now();
    state.pageStartTime = Date.now();
    send({ type: 'reset-timer' });
  };
  document.getElementById('pv-save-script').onclick = function () {
    saveCurrentBeat('已手动保存当前逐字稿。');
  };
  document.getElementById('pv-close-evidence').onclick = function () {
    closeEvidenceOverlay();
    syncAudienceEvidence('close-evidence');
  };
  document.getElementById('pv-reset-beat').onclick = function () {
    if (!baseNotes || !baseNotes.pages[state.chapter]) return;
    notes.pages[state.chapter].beats[state.beat] = baseNotes.pages[state.chapter].beats[state.beat] || '';
    syncEditorFromState(true);
    persistNotes('已恢复本步原稿，并保存到本机。');
  };
  document.getElementById('pv-export-script').onclick = exportNotes;
  interactBtn.onclick = function () { setInteractMode(!interactEnabled); };
  document.getElementById('pv-evidence-close').onclick = function () {
    closeEvidenceOverlay();
    syncAudienceEvidence('close-evidence');
  };
  document.getElementById('pv-evidence-prev').onclick = function () {
    moveEvidenceOverlay(-1);
    syncAudienceEvidence('move-evidence', { dir: -1 });
  };
  document.getElementById('pv-evidence-next').onclick = function () {
    moveEvidenceOverlay(1);
    syncAudienceEvidence('move-evidence', { dir: 1 });
  };
  scriptBox.addEventListener('input', function () {
    if (!notes || !notes.pages[state.chapter]) return;
    notes.pages[state.chapter].beats[state.beat] = scriptBox.value;
    scheduleSave();
  });

  iframeCur.onload = function () { postGoto(iframeCur, state.chapter, state.beat); };
  iframeNext.onload = function () {
    var n = nextState(state.chapter, state.beat);
    if (n) postGoto(iframeNext, n.chapter, n.beat);
  };

  Promise.all([
    fetch('data/speaker-beats-v8.json?t=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.json(); }),
    fetch('data/asset-manifest.json?t=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.json(); }),
    fetchEditedNotes()
  ])
    .then(function (res) {
      var data = res[0];
      var manifest = res[1];
      var serverEdited = res[2];
      var localSaved = null;
      try { localSaved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (err) {}
      baseNotes = clone(data);
      notes = mergeNotes(data, localSaved, serverEdited);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch (err) {}
      if (notes.targetTotalSec) TARGET_SEC = notes.targetTotalSec;
      (manifest.assets || []).forEach(function (a) { manifestMap[a.id] = a; });
      ensureIframes();
      updateUI();
      send({ type: 'request-sync' });
      var src = notesSavedAt(serverEdited) >= notesSavedAt(localSaved) && notesSavedAt(serverEdited) > 0
        ? '线上稿'
        : (notesSavedAt(localSaved) > 0 ? '本机稿' : '默认稿');
      setStatus('逐字稿已加载（' + src + '）。编辑后自动保存；导出可发布全站。');
    })
    .catch(function () {
      setStatus('逐字稿加载失败，请检查 data/speaker-beats-v8.json');
      ensureIframes();
    });

  bindKeys();
  setInteractMode(false);
  frameWrap.addEventListener('mouseenter', function () {
    frameHint.classList.add('is-visible');
  });
  frameWrap.addEventListener('mouseleave', function () {
    frameWrap.classList.remove('zoom-on');
    if (!interactEnabled) frameHint.classList.remove('is-visible');
  });
  frameWrap.addEventListener('mousemove', function (e) {
    if (interactEnabled || !pvOverlay.hidden) return;
    var rect = frameWrap.getBoundingClientRect();
    var x = ((e.clientX - rect.left) / rect.width) * 100;
    var y = ((e.clientY - rect.top) / rect.height) * 100;
    var originY = y > 50 ? Math.min(94, y + 10) : y;
    var scale = y > 50 ? 1.08 : 1.12;
    iframeCur.style.setProperty('--zoom-x', x.toFixed(2) + '%');
    iframeCur.style.setProperty('--zoom-y', originY.toFixed(2) + '%');
    iframeCur.style.setProperty('--zoom-scale', String(scale));
    frameWrap.classList.add('zoom-on');
  });
  window.addEventListener('beforeunload', flushPendingSave);
  window.addEventListener('pagehide', flushPendingSave);
  setInterval(function () {
    fetchEditedNotes().then(applyServerNotesIfNewer);
  }, SERVER_POLL_MS);
  setInterval(updateTimers, 500);
  updateTimers();

  /* 首次打开自动尝试拉起投屏窗（可被浏览器拦截，需手动点按钮） */
  setTimeout(openAudience, 400);
})();
