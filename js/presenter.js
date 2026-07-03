/**
 * 讲者控制台 — 四宫格双屏
 * 投屏：index.html（观众） · 控制：presenter.html（讲者）
 * 通过 BroadcastChannel 同步 chapter/beat，iframe 预览用 ?preview=1
 */
(function () {
  'use strict';

  var CHANNEL = 'ai-final-presentation-v1';
  var BEATS_PER_PAGE = [2, 5, 4, 5, 2, 3];
  var TARGET_SEC = 600;

  var state = {
    chapter: 0,
    beat: 0,
    startTime: Date.now(),
    pageStartTime: Date.now()
  };
  var notes = null;
  var audienceWin = null;
  var iframeCur = document.getElementById('pv-iframe-cur');
  var iframeNext = document.getElementById('pv-iframe-next');
  var channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL) : null;

  function fmt(sec) {
    sec = Math.max(0, Math.floor(sec));
    return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
  }

  function pageBeats(ch) { return BEATS_PER_PAGE[ch] || 1; }

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

  function evidenceHint(text) {
    var m = text.match(/Evidence[「]([^」]+)[」]/g);
    if (!m || !m.length) return '';
    return '本步 Evidence 建议：' + m.map(function (s) {
      return s.replace(/Evidence[「]/, '').replace(/[」]/g, '');
    }).join(' · ');
  }

  function updateUI() {
    var ch = state.chapter;
    var beat = state.beat;
    var next = nextState(ch, beat);

    document.getElementById('pv-cur-label').textContent = label(ch, beat);
    document.getElementById('pv-next-label').textContent = next ? label(next.chapter, next.beat) : '（终场）';
    document.getElementById('pv-script-label').textContent = label(ch, beat);
    document.getElementById('pv-script-text').textContent = scriptText(ch, beat) || '（本步无逐字稿）';

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
    };
  }

  document.getElementById('pv-open-audience').onclick = openAudience;
  document.getElementById('pv-reset-timer').onclick = function () {
    state.startTime = Date.now();
    state.pageStartTime = Date.now();
    send({ type: 'reset-timer' });
  };

  iframeCur.onload = function () { postGoto(iframeCur, state.chapter, state.beat); };
  iframeNext.onload = function () {
    var n = nextState(state.chapter, state.beat);
    if (n) postGoto(iframeNext, n.chapter, n.beat);
  };

  fetch('data/speaker-beats-v8.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      notes = data;
      if (data.targetTotalSec) TARGET_SEC = data.targetTotalSec;
      ensureIframes();
      updateUI();
      send({ type: 'request-sync' });
    })
    .catch(function () {
      document.getElementById('pv-script-text').textContent = '逐字稿加载失败，请检查 data/speaker-beats-v8.json';
      ensureIframes();
    });

  bindKeys();
  setInterval(updateTimers, 500);
  updateTimers();

  /* 首次打开自动尝试拉起投屏窗（可被浏览器拦截，需手动点按钮） */
  setTimeout(openAudience, 400);
})();
