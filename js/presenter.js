/**
 * 讲者控制台 — 四宫格双屏
 * 投屏：index.html（观众） · 控制：presenter.html（讲者）
 * 通过 BroadcastChannel 同步 chapter/beat，iframe 预览用 ?preview=1
 */
(function () {
  'use strict';

  var CHANNEL = 'ai-final-presentation-v1';
  var STORAGE_KEY = 'ai-final-presentation-speaker-notes-v8';
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
  var audienceWin = null;
  var interactEnabled = false;
  var saveTimer = null;
  var lastSyncedKey = '';
  var iframeCur = document.getElementById('pv-iframe-cur');
  var iframeNext = document.getElementById('pv-iframe-next');
  var scriptBox = document.getElementById('pv-script-text');
  var scriptStatus = document.getElementById('pv-script-status');
  var interactBtn = document.getElementById('pv-toggle-interact');
  var frameHint = document.getElementById('pv-frame-hint');
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

  function loadSavedNotes(data) {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (err) {}
    if (!saved || !saved.pages || !Array.isArray(saved.pages)) return data;
    return saved;
  }

  function persistNotes(statusText) {
    if (!notes) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      setStatus(statusText || '已保存到本机浏览器，下次打开仍会使用这一版逐字稿。', 'is-saved');
    } catch (err) {
      setStatus('保存失败：浏览器本地存储不可用，请先导出备份。');
    }
  }

  function syncEditorFromState(force) {
    var key = curKey(state.chapter, state.beat);
    if (!force && lastSyncedKey === key && document.activeElement === scriptBox) return;
    scriptBox.value = scriptText(state.chapter, state.beat) || '';
    lastSyncedKey = key;
    setStatus('可直接在线编辑；点“保存”立即固化到本机，或自动保存。');
  }

  function saveCurrentBeat(statusText) {
    if (!notes || !notes.pages[state.chapter]) return;
    notes.pages[state.chapter].beats[state.beat] = scriptBox.value;
    persistNotes(statusText || '本步逐字稿已保存。');
  }

  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    setStatus('检测到修改，1 秒后自动保存…', 'is-dirty');
    saveTimer = setTimeout(function () {
      saveCurrentBeat('已自动保存到本机浏览器。');
    }, 1000);
  }

  function updateUI() {
    var ch = state.chapter;
    var beat = state.beat;
    var next = nextState(ch, beat);

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

  function openAudience() {
    var url = 'index.html';
    if (audienceWin && !audienceWin.closed) {
      audienceWin.focus();
      audienceWin.location.href = url;
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
    frameHint.textContent = interactEnabled
      ? '点击模式开启：可直接点当前页 Evidence。点击后会同步到投屏窗，并自动把焦点拉回控制台。'
      : '点击模式关闭：避免误触翻页。需要点 Evidence 时先开启。';
  }

  function exportNotes() {
    var blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'speaker-beats-v8-edited.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus('已导出当前编辑稿 JSON，可备份或继续交给我同步回项目文件。', 'is-saved');
  }

  function bindKeys() {
    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      switch (e.key) {
        case ' ':
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          send({ type: 'advance' });
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          send({ type: 'retreat' });
          break;
        default:
          if (e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            send({ type: 'go', chapter: +e.key - 1, beat: 0 });
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

  document.getElementById('pv-open-audience').onclick = openAudience;
  document.getElementById('pv-reset-timer').onclick = function () {
    state.startTime = Date.now();
    state.pageStartTime = Date.now();
    send({ type: 'reset-timer' });
  };
  document.getElementById('pv-save-script').onclick = function () {
    saveCurrentBeat('已手动保存当前逐字稿。');
  };
  document.getElementById('pv-reset-beat').onclick = function () {
    if (!baseNotes || !baseNotes.pages[state.chapter]) return;
    notes.pages[state.chapter].beats[state.beat] = baseNotes.pages[state.chapter].beats[state.beat] || '';
    syncEditorFromState(true);
    persistNotes('已恢复本步原稿，并保存到本机。');
  };
  document.getElementById('pv-export-script').onclick = exportNotes;
  interactBtn.onclick = function () { setInteractMode(!interactEnabled); };
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

  fetch('data/speaker-beats-v8.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      baseNotes = clone(data);
      notes = loadSavedNotes(clone(data));
      if (notes.targetTotalSec) TARGET_SEC = notes.targetTotalSec;
      ensureIframes();
      updateUI();
      send({ type: 'request-sync' });
    })
    .catch(function () {
      setStatus('逐字稿加载失败，请检查 data/speaker-beats-v8.json');
      ensureIframes();
    });

  bindKeys();
  setInteractMode(false);
  setInterval(updateTimers, 500);
  updateTimers();

  /* 首次打开自动尝试拉起投屏窗（可被浏览器拦截，需手动点按钮） */
  setTimeout(openAudience, 400);
})();
