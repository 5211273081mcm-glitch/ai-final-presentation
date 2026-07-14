import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  HG_HEIGHT,
  HG_WAIST_Y,
  RADIAL_SEGMENTS,
  buildGlassShellPoints,
  sandRadiusAt,
  topSandBounds,
  bottomSandBounds
} from './hourglass-profile.mjs';

var SAND_MAIN = 0x711a35;
var SAND_BRIGHT = 0xa33a58;
var SAND_DARK = 0x3b0919;
var FLOW_BASE = 0.000032;
var STREAM_COUNT = 780;
var TARGET_FILL = 0.62;

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function makeSandGrainTexture() {
  var c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  var ctx = c.getContext('2d');
  ctx.fillStyle = '#5a1528';
  ctx.fillRect(0, 0, 128, 128);
  for (var i = 0; i < 3000; i++) {
    var g = 50 + Math.random() * 60;
    ctx.fillStyle = 'rgb(' + g + ',' + Math.floor(g * 0.35) + ',' + Math.floor(g * 0.42) + ')';
    ctx.fillRect(Math.random() * 128, Math.random() * 128, 1, 1);
  }
  var tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}

function makeStreamTexture() {
  var c = document.createElement('canvas');
  c.width = 32;
  c.height = 32;
  var ctx = c.getContext('2d');
  var g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(163,58,88,0.95)');
  g.addColorStop(0.45, 'rgba(113,26,53,0.75)');
  g.addColorStop(1, 'rgba(59,9,25,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(c);
}

function fitCameraToObject(camera, object, aspect, margin) {
  margin = margin == null ? 1.14 : margin;
  var box = new THREE.Box3().setFromObject(object);
  var size = box.getSize(new THREE.Vector3());
  var center = box.getCenter(new THREE.Vector3());
  var vFov = camera.fov * Math.PI / 180;
  var hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
  var distV = (size.y * 0.5) / (Math.tan(vFov / 2) * TARGET_FILL);
  var distH = (size.x * 0.5) / (Math.tan(hFov / 2) * TARGET_FILL);
  var dist = Math.max(distV, distH) * margin;
  camera.position.set(center.x, center.y, center.z + dist);
  camera.lookAt(center);
  camera.near = Math.max(0.05, dist / 80);
  camera.far = dist * 20;
  camera.updateProjectionMatrix();
  return { center: center, dist: dist, size: size };
}

export function HourglassEngine3D(canvas, stage, generation, onReady, onFail) {
  this.canvas = canvas;
  this.stage = stage;
  this.generation = generation;
  this.onReady = onReady;
  this.onFail = onFail;
  this.running = false;
  this._raf = null;
  this._clock = new THREE.Clock(false);
  this._ready = false;
  this.elapsed = 0;
  this.topSand = 0.58;
  this.bottomSand = 0.22;
  this.flowTarget = 0.55;
  this.flowCurrent = 0.55;
  this.beat = 0;
  this.tiltX = 0;
  this.tiltY = 0;
  this.targetTiltX = 0;
  this.targetTiltY = 0;
  this.glintPhase = 0;
  this._disposables = [];
  this._dead = false;

  if (!this._initWebGL()) {
    this.webgl = false;
    if (this.onFail) this.onFail();
    return;
  }
  this.webgl = true;
  this._buildScene();
  this._bindEvents();
  this.resize();
}

HourglassEngine3D.prototype._alive = function () {
  return !this._dead && this.generation != null;
};

HourglassEngine3D.prototype._initWebGL = function () {
  try {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.canvas.style.background = 'transparent';
    this.canvas.style.display = 'block';
    return true;
  } catch (err) {
    return false;
  }
};

HourglassEngine3D.prototype._buildScene = function () {
  var self = this;
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(32, 1, 0.05, 80);

  this.root = new THREE.Group();
  this.scene.add(this.root);

  var pmrem = new THREE.PMREMGenerator(this.renderer);
  this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  this._disposables.push(this.scene.environment);

  var key = new THREE.DirectionalLight(0xe8f4ff, 1.1);
  key.position.set(-2.2, 3.8, 2.5);
  this.scene.add(key);
  var fill = new THREE.DirectionalLight(0xffffff, 0.22);
  fill.position.set(1.5, 1.2, 3);
  this.scene.add(fill);
  var rim = new THREE.DirectionalLight(0x6a2030, 0.12);
  rim.position.set(1.8, -0.5, -2.5);
  this.scene.add(rim);

  this.sandTex = makeSandGrainTexture();
  this._disposables.push(this.sandTex);

  this._buildGlass();
  this._buildSandMeshes();
  this._buildStream();
  this._buildStreamCore();

  this._fitCamera();

  this._onCtxLost = function (e) {
    e.preventDefault();
    self.stop();
    if (self.onFail) self.onFail();
  };
  this._onCtxRestored = function () {
    if (!self._alive()) return;
    self._buildScene();
    self.start();
  };
  this.canvas.addEventListener('webglcontextlost', this._onCtxLost, false);
  this.canvas.addEventListener('webglcontextrestored', this._onCtxRestored, false);

  this._ro = new ResizeObserver(function () {
    if (self._alive()) self.resize();
  });
  if (this.canvas.parentElement) this._ro.observe(this.canvas.parentElement);
};

HourglassEngine3D.prototype._fitCamera = function () {
  var aspect = this.camera.aspect || 16 / 9;
  var info = fitCameraToObject(this.camera, this.glassMesh, aspect, 1.48);
  this._camCenter = info.center;
  this._camDist = info.dist;
};

HourglassEngine3D.prototype._buildGlass = function () {
  var shellPts = buildGlassShellPoints(THREE);
  var geo = new THREE.LatheGeometry(shellPts, RADIAL_SEGMENTS);
  geo.computeVertexNormals();

  var mat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.05,
    transmission: 1,
    thickness: 0.42,
    ior: 1.48,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    envMapIntensity: 0.85,
    attenuationColor: new THREE.Color(0xf8fbff),
    attenuationDistance: 12,
    transparent: false,
    side: THREE.FrontSide,
    depthWrite: false
  });

  this.glassMesh = new THREE.Mesh(geo, mat);
  this.glassMesh.renderOrder = 10;
  this.root.add(this.glassMesh);
  this._disposables.push(geo, mat);
};

HourglassEngine3D.prototype._sandMaterial = function () {
  return new THREE.MeshStandardMaterial({
    color: SAND_MAIN,
    map: this.sandTex,
    roughness: 0.94,
    metalness: 0,
    flatShading: false
  });
};

HourglassEngine3D.prototype._buildSandMeshes = function () {
  this.topSandMesh = new THREE.Mesh(new THREE.BufferGeometry(), this._sandMaterial());
  this.bottomSandMesh = new THREE.Mesh(new THREE.BufferGeometry(), this._sandMaterial());
  this.topSandMesh.renderOrder = 2;
  this.bottomSandMesh.renderOrder = 2;
  this.root.add(this.topSandMesh);
  this.root.add(this.bottomSandMesh);
  this._rebuildTopSand();
  this._rebuildBottomSand();
};

HourglassEngine3D.prototype._buildTopSandGeometry = function (level) {
  var b = topSandBounds(level);
  var yMin = b.yMin;
  var yMax = b.yMax;
  var nyMax = yMax / HG_HEIGHT;
  var nyMin = yMin / HG_HEIGHT;
  var rSurf = sandRadiusAt(nyMax) * HG_HEIGHT * 0.78;
  var rNeck = sandRadiusAt(nyMin) * HG_HEIGHT * 0.38;
  var yDip = yMax - (yMax - yMin) * 0.05;
  var pts = [
    new THREE.Vector2(0, yMin),
    new THREE.Vector2(rNeck, yMin),
    new THREE.Vector2(rSurf, yMax),
    new THREE.Vector2(0, yDip)
  ];
  var geo = new THREE.LatheGeometry(pts, 96);
  geo.computeVertexNormals();
  return geo;
};

HourglassEngine3D.prototype._buildBottomSandGeometry = function (level) {
  var b = bottomSandBounds(level);
  var yBase = b.yBase;
  var yPeak = b.yPeak;
  if (yPeak <= yBase + 0.002) {
    yPeak = yBase + 0.002;
  }
  var nyBase = yBase / HG_HEIGHT;
  var rBase = sandRadiusAt(nyBase) * HG_HEIGHT * (0.14 + 0.86 * Math.pow(level, 0.7));
  var pts = [
    new THREE.Vector2(0, yBase),
    new THREE.Vector2(rBase, yBase),
    new THREE.Vector2(0, yPeak)
  ];
  var geo = new THREE.LatheGeometry(pts, 96);
  geo.computeVertexNormals();
  return geo;
};

HourglassEngine3D.prototype._rebuildTopSand = function () {
  if (this.topSandMesh.geometry) this.topSandMesh.geometry.dispose();
  this.topSandMesh.geometry = this._buildTopSandGeometry(this.topSand);
};

HourglassEngine3D.prototype._rebuildBottomSand = function () {
  if (this.bottomSandMesh.geometry) this.bottomSandMesh.geometry.dispose();
  this.bottomSandMesh.geometry = this._buildBottomSandGeometry(this.bottomSand);
};

HourglassEngine3D.prototype._buildStream = function () {
  var tex = makeStreamTexture();
  this._disposables.push(tex);
  var positions = new Float32Array(STREAM_COUNT * 3);
  this.streamData = [];
  for (var i = 0; i < STREAM_COUNT; i++) {
    this.streamData.push({
      phase: Math.random(),
      speed: 0.85 + Math.random() * 0.35,
      jitter: (Math.random() - 0.5) * 0.0004
    });
  }
  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var mat = new THREE.PointsMaterial({
    color: SAND_BRIGHT,
    map: tex,
    size: 0.0042,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
    blending: THREE.NormalBlending
  });
  this.stream = new THREE.Points(geo, mat);
  this.stream.renderOrder = 5;
  this.root.add(this.stream);
  this._disposables.push(geo, mat);
};

HourglassEngine3D.prototype._buildStreamCore = function () {
  var geo = new THREE.CylinderGeometry(0.0032, 0.0048, 0.55, 8, 1, true);
  geo.translate(0, -0.12, 0);
  var mat = new THREE.MeshBasicMaterial({
    color: SAND_DARK,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  this.streamCore = new THREE.Mesh(geo, mat);
  this.streamCore.position.y = HG_WAIST_Y * HG_HEIGHT;
  this.streamCore.renderOrder = 4;
  this.root.add(this.streamCore);
  this._disposables.push(geo, mat);
};

HourglassEngine3D.prototype._updateStream = function (dt, flow) {
  var pos = this.stream.geometry.attributes.position.array;
  var yNeckTop = (HG_WAIST_Y + 0.008) * HG_HEIGHT;
  var yNeckBot = (HG_WAIST_Y - 0.008) * HG_HEIGHT;
  var b = bottomSandBounds(this.bottomSand);
  var yTarget = b.yPeak;
  for (var i = 0; i < STREAM_COUNT; i++) {
    var p = this.streamData[i];
    p.phase += dt * flow * p.speed * 1.65;
    if (p.phase > 1) p.phase -= 1;
    var y;
    if (p.phase < 0.06) {
      y = lerp(yNeckTop, yNeckBot, p.phase / 0.06);
    } else {
      var t2 = (p.phase - 0.06) / 0.94;
      y = lerp(yNeckBot, yTarget, t2 * t2);
    }
    var spread = p.phase > 0.88 ? (p.phase - 0.88) * 0.012 : 0;
    pos[i * 3] = p.jitter + (Math.random() - 0.5) * spread;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = p.jitter * 0.6 + (Math.random() - 0.5) * spread;
  }
  this.stream.geometry.attributes.position.needsUpdate = true;
  if (this.streamCore) {
    var span = Math.max(0.1, yTarget - yNeckBot);
    this.streamCore.scale.y = span / 0.55;
    this.streamCore.position.y = yNeckBot + span * 0.5;
  }
};

HourglassEngine3D.prototype._bindEvents = function () {
  var self = this;
  this._onPointerMove = function (e) {
    if (!self._alive()) return;
    var rect = self.stage.getBoundingClientRect();
    var nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    var ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    self.targetTiltY = clamp(nx * 2.5 * Math.PI / 180, -5 * Math.PI / 180, 5 * Math.PI / 180);
    self.targetTiltX = clamp(-ny * 1.5 * Math.PI / 180, -3 * Math.PI / 180, 3 * Math.PI / 180);
  };
  this._onPointerLeave = function () {
    self.targetTiltX = 0;
    self.targetTiltY = 0;
  };
  this.stage.addEventListener('pointermove', this._onPointerMove, { passive: true });
  this.stage.addEventListener('pointerleave', this._onPointerLeave);
};

HourglassEngine3D.prototype.resize = function () {
  if (!this.webgl || !this.canvas.parentElement) return;
  var w = Math.max(320, this.canvas.parentElement.clientWidth);
  var h = Math.max(240, this.canvas.parentElement.clientHeight);
  this.renderer.setSize(w, h, false);
  this.camera.aspect = w / h;
  this._fitCamera();
};

HourglassEngine3D.prototype.setBeat = function (beat) {
  this.beat = beat;
  this.flowTarget = beat >= 1 ? 0.82 : 0.55;
};

HourglassEngine3D.prototype._updateSandLevels = function (dt) {
  this.flowCurrent = lerp(this.flowCurrent, this.flowTarget, Math.min(1, dt * 1.5));
  var drain = FLOW_BASE * this.flowCurrent * dt;
  if (this.topSand > 0.28) {
    this.topSand = Math.max(0.28, this.topSand - drain);
    this.bottomSand = Math.min(0.78, this.bottomSand + drain * 0.96);
  }
  this._sandRebuildAcc = (this._sandRebuildAcc || 0) + dt;
  if (this._sandRebuildAcc > 0.15) {
    this._sandRebuildAcc = 0;
    this._rebuildTopSand();
    this._rebuildBottomSand();
  }
};

HourglassEngine3D.prototype._frame = function () {
  if (!this.running || !this._alive()) return;
  var dt = Math.min(this._clock.getDelta(), 0.05);
  this.elapsed += dt;
  this._updateSandLevels(dt);
  this._updateStream(dt, this.flowCurrent);

  this.tiltX = lerp(this.tiltX, this.targetTiltX, 0.06);
  this.tiltY = lerp(this.tiltY, this.targetTiltY, 0.06);
  this.glintPhase += dt * 0.18;
  this.root.rotation.x = this.tiltX + Math.sin(this.elapsed * 0.4) * 0.003;
  this.root.rotation.y = this.tiltY;
  this.root.position.y = Math.sin(this.elapsed * 0.32) * 0.004;

  this.renderer.render(this.scene, this.camera);

  if (!this._ready) {
    this._ready = true;
    if (this.onReady) this.onReady();
  }
  this._raf = requestAnimationFrame(this._frame.bind(this));
};

HourglassEngine3D.prototype.start = function () {
  if (!this.webgl || this.running) return;
  this.running = true;
  this._clock.start();
  this._frame();
};

HourglassEngine3D.prototype.stop = function () {
  this.running = false;
  if (this._raf) cancelAnimationFrame(this._raf);
  this._raf = null;
  this._clock.stop();
};

HourglassEngine3D.prototype.destroy = function () {
  this._dead = true;
  this.stop();
  if (this._ro) this._ro.disconnect();
  if (this.canvas) {
    this.canvas.removeEventListener('webglcontextlost', this._onCtxLost);
    this.canvas.removeEventListener('webglcontextrestored', this._onCtxRestored);
  }
  if (this.stage) {
    this.stage.removeEventListener('pointermove', this._onPointerMove);
    this.stage.removeEventListener('pointerleave', this._onPointerLeave);
  }
  this._disposables.forEach(function (d) {
    if (d && d.dispose) d.dispose();
  });
  if (this.topSandMesh && this.topSandMesh.geometry) this.topSandMesh.geometry.dispose();
  if (this.bottomSandMesh && this.bottomSandMesh.geometry) this.bottomSandMesh.geometry.dispose();
  if (this.renderer) {
    this.renderer.dispose();
  }
  this.scene = null;
  this.renderer = null;
};

/** SVG 降级 — 内联绘制，无 img */
export function FallbackSVG(stage) {
  this.stage = stage;
}

FallbackSVG.prototype.setBeat = function () {};

FallbackSVG.prototype.start = function () {};

FallbackSVG.prototype.stop = function () {};

FallbackSVG.prototype.destroy = function () {};

export function createHourglassApi(global) {
  var active = null;
  var mountGen = 0;

  function setState(stage, state) {
    stage.classList.remove('hg-webgl-pending', 'hg-webgl-active', 'hg-webgl-failed');
    if (state) stage.classList.add(state);
  }

  function freshCanvas(canvas, stage) {
    try {
      var test = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (test && test.isContextLost && test.isContextLost()) {
        var next = document.createElement('canvas');
        next.className = canvas.className;
        next.setAttribute('aria-hidden', canvas.getAttribute('aria-hidden') || 'true');
        canvas.replaceWith(next);
        return next;
      }
    } catch (err) { /* ignore */ }
    return canvas;
  }

  return {
    mount: function (canvas, stage) {
      global.HourglassSand.destroy();
      if (!canvas || !stage || !stage.isConnected) return;

      canvas = freshCanvas(canvas, stage);
      if (!canvas.isConnected) return;

      var gen = ++mountGen;
      setState(stage, 'hg-webgl-pending');

      var engine;
      try {
        engine = new HourglassEngine3D(canvas, stage, gen, function () {
          if (gen !== mountGen || !canvas.isConnected) return;
          setState(stage, 'hg-webgl-active');
        }, function () {
          if (gen !== mountGen || !canvas.isConnected) return;
          setState(stage, 'hg-webgl-failed');
        });
      } catch (err) {
        console.error('[HourglassSand] init failed', err);
        setState(stage, 'hg-webgl-failed');
        active = new FallbackSVG(stage);
        return;
      }

      if (!engine.webgl) {
        setState(stage, 'hg-webgl-failed');
        active = new FallbackSVG(stage);
        return;
      }

      active = engine;
      var beat = +(stage.getAttribute('data-beat') || 0);
      active.setBeat(beat);
      active.start();
    },
    setBeat: function (beat) {
      if (active && active.setBeat) active.setBeat(beat);
    },
    destroy: function () {
      mountGen++;
      if (active) {
        var st = active.stage;
        active.destroy();
        active = null;
        if (st) setState(st, 'hg-webgl-pending');
      }
    }
  };
}
