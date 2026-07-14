/**
 * 单一沙漏轮廓 — 玻璃封闭壳体 / 沙堆边界 / 粒子约束共用
 * y: 0=底端 … 1=顶端（归一化），r: 半径（× HG_HEIGHT 为 world 单位）
 */

export var HG_HEIGHT = 1.65;
export var HG_WAIST_Y = 0.5;
export var GLASS_WALL = 0.016;
export var RADIAL_SEGMENTS = 128;

/** 外壁 meridian [r, y] 自底→顶 */
export var OUTER_PROFILE = [
  [0.004, 0.0],
  [0.34, 0.02],
  [0.39, 0.08],
  [0.40, 0.16],
  [0.385, 0.26],
  [0.32, 0.36],
  [0.20, 0.43],
  [0.10, 0.47],
  [0.048, 0.485],
  [0.036, 0.5],
  [0.048, 0.515],
  [0.10, 0.53],
  [0.20, 0.57],
  [0.32, 0.64],
  [0.385, 0.74],
  [0.40, 0.84],
  [0.39, 0.92],
  [0.34, 0.98],
  [0.004, 1.0]
];

export function innerProfile(outer, inset) {
  inset = inset == null ? GLASS_WALL : inset;
  return outer.map(function (p, i) {
    var r = Math.max(0.003, p[0] - inset);
    if (i === 0 || i === outer.length - 1) r = Math.max(0.003, p[0] - inset * 0.45);
    return [r, p[1]];
  });
}

function interpProfile(prof, y) {
  if (y <= prof[0][1]) return prof[0][0];
  if (y >= prof[prof.length - 1][1]) return prof[prof.length - 1][0];
  for (var i = 0; i < prof.length - 1; i++) {
    var a = prof[i];
    var b = prof[i + 1];
    if (y >= a[1] && y <= b[1]) {
      var t = (y - a[1]) / (b[1] - a[1]);
      return a[0] + (b[0] - a[0]) * t;
    }
  }
  return 0.03;
}

export function innerRadiusAt(y, inset) {
  return interpProfile(innerProfile(OUTER_PROFILE, inset), y);
}

export function sandRadiusAt(y) {
  return Math.max(0.006, innerRadiusAt(y, GLASS_WALL + 0.014) * 0.9);
}

/** 封闭玻璃壳体 Lathe 截面：外壁↑ + 内壁↓ */
export function buildGlassShellPoints(THREE) {
  var outer = OUTER_PROFILE;
  var inner = innerProfile(outer, GLASS_WALL);
  var pts = [];
  var i;
  for (i = 0; i < outer.length; i++) {
    pts.push(new THREE.Vector2(outer[i][0], outer[i][1] * HG_HEIGHT));
  }
  for (i = inner.length - 1; i >= 0; i--) {
    pts.push(new THREE.Vector2(inner[i][0], inner[i][1] * HG_HEIGHT));
  }
  return pts;
}

/** 上腔沙：yNeck..ySurface，level 0.28~0.88 */
export function topSandBounds(level) {
  var lv = Math.max(0.28, Math.min(0.88, level));
  return {
    yMin: (HG_WAIST_Y + 0.018) * HG_HEIGHT,
    yMax: (HG_WAIST_Y + 0.022 + lv * 0.16) * HG_HEIGHT
  };
}

/** 下腔沙：自底向上，level 0.08~0.78 */
export function bottomSandBounds(level) {
  var lv = Math.max(0.08, Math.min(0.78, level));
  return {
    yBase: 0.025 * HG_HEIGHT,
    yPeak: (0.08 + lv * 0.34) * HG_HEIGHT
  };
}
