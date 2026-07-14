/**
 * AI趋势 · 沙漏主视觉 · 双 video 交叉淡化循环
 * 章节级单例：生命周期以 page/chapter 0 为界，不以 beat 为界。
 */
(function (global) {
  var FADE_MS = 650;
  var PRE_ROLL_SEC = 0.65;
  var ASSET_BASE = 'assets/video/';

  /** @type {null | {
   *   stage: Element,
   *   videoA: HTMLVideoElement,
   *   videoB: HTMLVideoElement,
   *   activeKey: 'a'|'b',
   *   crossfading: boolean,
   *   fallbackLoop: boolean,
   *   paused: boolean,
   *   ready: boolean,
   *   onTimeA: (e: Event) => void,
   *   onTimeB: (e: Event) => void,
   *   loopCount: number
   * }} */
  var ctrl = null;

  /** @type {null | {
   *   activeKey: 'a'|'b',
   *   videoATime: number,
   *   videoBTime: number,
   *   ready: boolean,
   *   fallbackLoop: boolean,
   *   loopCount: number,
   *   visibleA: boolean,
   *   visibleB: boolean
   * }} */
  var savedSession = null;

  function activeVideo(c) {
    return c.activeKey === 'a' ? c.videoA : c.videoB;
  }

  function inactiveVideo(c) {
    return c.activeKey === 'a' ? c.videoB : c.videoA;
  }

  function setLayerVisible(video, visible) {
    video.classList.toggle('hg-video-visible', visible);
  }

  function markReady(c) {
    c.ready = true;
    c.stage.classList.remove('hg-video-pending');
    c.stage.classList.add('hg-video-ready');
    var poster = c.stage.querySelector('.hg-video-poster');
    if (poster) poster.classList.add('hg-video-poster-hidden');
  }

  function waitFirstFrame(video, cb) {
    if (typeof video.requestVideoFrameCallback === 'function') {
      video.requestVideoFrameCallback(function () { cb(); });
      return;
    }
    if (video.readyState >= 2) {
      cb();
      return;
    }
    video.addEventListener('loadeddata', function onLoaded() {
      video.removeEventListener('loadeddata', onLoaded);
      cb();
    });
  }

  function attachListeners(c) {
    c.onTimeA = onTimeUpdate;
    c.onTimeB = onTimeUpdate;
    c.videoA.addEventListener('timeupdate', c.onTimeA);
    c.videoB.addEventListener('timeupdate', c.onTimeB);
  }

  function detachListeners(c) {
    c.videoA.removeEventListener('timeupdate', c.onTimeA);
    c.videoB.removeEventListener('timeupdate', c.onTimeB);
  }

  function onTimeUpdate(e) {
    if (!ctrl || ctrl.paused || ctrl.crossfading || ctrl.fallbackLoop) return;
    if (e.target !== activeVideo(ctrl)) return;
    var v = e.target;
    var dur = v.duration;
    if (!dur || !isFinite(dur)) return;
    if (dur - v.currentTime <= PRE_ROLL_SEC) beginCrossfade();
  }

  function beginCrossfade() {
    if (!ctrl || ctrl.paused || ctrl.crossfading || ctrl.fallbackLoop) return;
    var c = ctrl;
    var from = activeVideo(c);
    var to = inactiveVideo(c);
    c.crossfading = true;

    to.currentTime = 0;
    var playPromise = to.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {
        enableFallback();
      });
    }

    setLayerVisible(to, true);
    setLayerVisible(from, false);

    global.setTimeout(function () {
      if (!ctrl || ctrl !== c) return;
      from.pause();
      try { from.currentTime = 0; } catch (err) { /* ignore */ }
      setLayerVisible(from, false);
      setLayerVisible(to, true);
      c.activeKey = c.activeKey === 'a' ? 'b' : 'a';
      c.crossfading = false;
      c.loopCount += 1;
    }, FADE_MS);
  }

  function enableFallback() {
    if (!ctrl) return;
    var c = ctrl;
    c.fallbackLoop = true;
    c.crossfading = false;
    c.stage.classList.add('hg-video-fallback');
    c.videoB.pause();
    c.videoB.classList.add('hg-video-hidden');
    c.videoA.loop = true;
    setLayerVisible(c.videoA, true);
    setLayerVisible(c.videoB, false);
    c.activeKey = 'a';
    c.videoA.play().catch(function () { /* autoplay blocked */ });
    markReady(c);
  }

  function snapshot(c) {
    return {
      activeKey: c.activeKey,
      videoATime: c.videoA.currentTime,
      videoBTime: c.videoB.currentTime,
      ready: c.ready,
      fallbackLoop: c.fallbackLoop,
      loopCount: c.loopCount,
      visibleA: c.videoA.classList.contains('hg-video-visible'),
      visibleB: c.videoB.classList.contains('hg-video-visible')
    };
  }

  function applySnapshot(c, state) {
    c.activeKey = state.activeKey;
    c.fallbackLoop = state.fallbackLoop;
    c.loopCount = state.loopCount || 0;
    c.ready = state.ready;

    c.videoA.loop = c.fallbackLoop;
    c.videoB.loop = false;
    c.videoB.classList.toggle('hg-video-hidden', c.fallbackLoop);

    try {
      c.videoA.currentTime = state.videoATime;
      c.videoB.currentTime = state.videoBTime;
    } catch (err) { /* ignore */ }

    setLayerVisible(c.videoA, state.visibleA);
    setLayerVisible(c.videoB, state.visibleB);

    if (c.ready) {
      c.stage.classList.remove('hg-video-pending');
      c.stage.classList.add('hg-video-ready');
      var poster = c.stage.querySelector('.hg-video-poster');
      if (poster) poster.classList.add('hg-video-poster-hidden');
    }
  }

  function bindStage(stage) {
    var videoA = stage.querySelector('.hg-video-a');
    var videoB = stage.querySelector('.hg-video-b');
    if (!videoA || !videoB) return null;

    return {
      stage: stage,
      videoA: videoA,
      videoB: videoB,
      activeKey: 'a',
      crossfading: false,
      fallbackLoop: false,
      paused: false,
      ready: false,
      onTimeA: onTimeUpdate,
      onTimeB: onTimeUpdate,
      loopCount: 0
    };
  }

  function startFresh(c) {
    c.stage.classList.add('hg-video-pending');
    c.stage.classList.remove('hg-video-ready', 'hg-video-fallback');
    var poster = c.stage.querySelector('.hg-video-poster');
    if (poster) poster.classList.remove('hg-video-poster-hidden');

    c.videoA.loop = false;
    c.videoB.loop = false;
    c.videoB.classList.remove('hg-video-hidden');
    setLayerVisible(c.videoA, false);
    setLayerVisible(c.videoB, false);
    c.videoA.currentTime = 0;
    c.videoB.currentTime = 0;
    c.activeKey = 'a';
    c.ready = false;
    c.fallbackLoop = false;
    c.loopCount = 0;

    attachListeners(c);

    waitFirstFrame(c.videoA, function () {
      if (!ctrl || ctrl !== c || c.paused) return;
      setLayerVisible(c.videoA, true);
      markReady(c);
      c.videoA.play().catch(function () {
        enableFallback();
      });
    });
  }

  function resumePlayback(c) {
    attachListeners(c);
    c.paused = false;
    if (!c.ready) {
      startFresh(c);
      return;
    }
    markReady(c);
    var v = activeVideo(c);
    v.play().catch(function () { /* autoplay blocked */ });
  }

  global.HourglassHeroVideo = {
    assetBase: ASSET_BASE,

    isMountedOn: function (stage) {
      return !!(ctrl && ctrl.stage === stage && document.contains(stage) && !ctrl.paused);
    },

    isBoundTo: function (stage) {
      return !!(ctrl && ctrl.stage === stage && document.contains(stage));
    },

    getDebugState: function () {
      if (!ctrl) return null;
      var v = activeVideo(ctrl);
      return {
        activeKey: ctrl.activeKey,
        activeVideoClass: v.className,
        currentTime: v.currentTime,
        videoA: ctrl.videoA,
        videoB: ctrl.videoB,
        videoARef: ctrl.videoA,
        videoBRef: ctrl.videoB,
        ready: ctrl.ready,
        paused: ctrl.paused,
        loopCount: ctrl.loopCount,
        posterHidden: !!(ctrl.stage.querySelector('.hg-video-poster') &&
          ctrl.stage.querySelector('.hg-video-poster').classList.contains('hg-video-poster-hidden')),
        stageReady: ctrl.stage.classList.contains('hg-video-ready')
      };
    },

    mount: function (stage) {
      if (!stage) return ctrl;

      if (ctrl && ctrl.stage === stage && document.contains(stage)) {
        if (ctrl.paused) resumePlayback(ctrl);
        return ctrl;
      }

      if (ctrl) {
        savedSession = snapshot(ctrl);
        detachListeners(ctrl);
        ctrl.videoA.pause();
        ctrl.videoB.pause();
        ctrl.paused = true;
      }

      var next = bindStage(stage);
      if (!next) return ctrl;

      ctrl = next;

      if (savedSession && savedSession.ready) {
        applySnapshot(ctrl, savedSession);
        attachListeners(ctrl);
        ctrl.paused = false;
        activeVideo(ctrl).play().catch(function () { /* autoplay blocked */ });
      } else {
        startFresh(ctrl);
      }

      return ctrl;
    },

    pause: function () {
      if (!ctrl) return;
      savedSession = snapshot(ctrl);
      detachListeners(ctrl);
      ctrl.videoA.pause();
      ctrl.videoB.pause();
      ctrl.paused = true;
    },

    destroy: function () {
      if (!ctrl) return;
      detachListeners(ctrl);
      ctrl.videoA.pause();
      ctrl.videoB.pause();
      ctrl = null;
      savedSession = null;
    }
  };
})(window);
