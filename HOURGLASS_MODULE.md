# 沙漏模块 · 文件位置与数据说明

> 20 分钟路演首章「**使用AI的趋势**」沙漏效果。10 分钟决赛版（`index.html`）不含此模块。

## 在演示中的位置

| 项 | 值 |
|----|-----|
| 章节索引 | 20m 模式第 **0 章** |
| 导航名 | 使用AI的趋势 |
| 幕数 | 2（beat 0 / beat 1） |
| 时长 | 120 秒 |
| 入口 | `index-20m.html` |

```
index-20m.html
  ├── css/split-stage.css      ← 玻璃/布局样式
  ├── js/hourglass-sand.js     ← 粒子沙引擎（须先加载）
  └── js/presentation-20m.all.js ← 打包后的 final-show + 数据
```

---

## 1. 文案 / 配置数据

### 页面标题与副标题

**文件：** `data/presentation-content-20m.json` → `splitStages.vs`

```json
"vs": {
  "topTitle": "任务提效",
  "bottomTitle": "流程重构",
  "topSub": "用AI干活",
  "bottomSub": "用AI改变干活的方法"
}
```

- `topTitle` / `bottomTitle`：上下腔体大标题
- `topSub` / `bottomSub`：第 2 幕副标题（beat 1 时 CSS 淡入）

读取方式：`final-show.js` 中 `splitCfg().vs` → `buildVsSplitPage()`。

### 导航名、时长、幕数

**文件：** `data/presentation-config-20m.json` → `pages[0]`

```json
{ "tag": "使用AI的趋势", "durationSec": 120, "beats": 2 }
```

### 讲者逐字稿

**文件：** `data/speaker-beats-20m.json` → `pages[0].beats`（2 条）

讲者台加载：`presenter-20m.html` → `js/presenter.js`（`SPEAKER_URL = data/speaker-beats-20m.json`）。

---

## 2. 页面结构与玻璃 SVG

**源文件：** `js/final-show.js`（改这里，不要直接改 bundle）

| 符号 | 行号（约） | 作用 |
|------|-----------|------|
| `HG_GLASS_SVG` | 127 | 沙漏玻璃外框 SVG（path、渐变、高光、口径） |
| `buildVsSplitPage()` | 166 | 生成 HTML：canvas + 玻璃层 + 暗角 + 上下标题 |
| `applyVsSplitBeat()` | 187 | 设置 `data-beat`，调用 `HourglassSand.setBeat` |
| `mountHourglass()` | 155 | 挂载 Canvas 引擎 |
| `unmountHourglass()` | 162 | 销毁引擎 |
| `syncHourglass()` | 1034 | 在 `render()` 各路径中统一挂载/卸载 |
| `init20MinPages()` | 908 | `PAGES[0] = { beats: 2, build: buildVsSplitPage, apply: applyVsSplitBeat }` |
| `getNavPages()` | 946 | 首项 `{ tag: '使用AI的趋势' }` |

**打包产物（自动生成）：** `js/presentation-20m.all.js`

```bash
node scripts/bundle-presentation.mjs 20m
```

---

## 3. 沙子粒子 / 3D 渲染

**构建产物：** `js/hourglass-sand.js`（含 Three.js，约 1.2MB）

**源码：**

| 文件 | 作用 |
|------|------|
| `js/src/hourglass-entry.mjs` | 挂载 `window.HourglassSand` |
| `js/src/hourglass-3d.mjs` | WebGL 引擎 + 2D 降级 |
| `js/src/hourglass-profile.mjs` | 单一 Lathe 轮廓数据 |
| `scripts/build-hourglass.mjs` | esbuild 打包 |

```bash
npm run build:hourglass   # 仅沙漏
npm run build:20m         # 沙漏 + presentation-20m.all.js
```

WebGL 可用时：`stage` 添加 `hg-webgl-active`，隐藏 SVG 降级层。  
WebGL 不可用时：`hg-fallback-active`，Canvas 2D 静态轮廓（无蓝色液体）。

---

## 4. 样式

**文件：** `css/split-stage.css`（约 109–217 行，`/* ── 全屏液体玻璃沙漏 ── */` 段）

| 选择器 | 作用 |
|--------|------|
| `.split-hourglass-stage` | 整页背景 |
| `.hg-sand-canvas` | 全屏 Canvas（z-index 1） |
| `.hg-glass-layer` / `.hg-glass-svg` | 玻璃 SVG，当前约 82vw × 92vh |
| `.hg-vignette` | 腔体光晕 + 边缘暗角 |
| `.hg-label-top` / `.hg-label-bottom` | 标题位置 |
| `[data-beat="1"] .split-sub-title` | 第 2 幕副标题显现 |
| `body.led-projection .split-hourglass-*` | `?led=1` 投屏字号 |

CSS 独立引入，**不**打进 JS bundle；改 CSS 刷新即可，无需打包。

---

## 5. 修改对照表

| 想改什么 | 改哪个文件 |
|----------|------------|
| 上下标题 / 副标题文案 | `data/presentation-content-20m.json` → `splitStages.vs` |
| 讲者口播 | `data/speaker-beats-20m.json` → `pages[0]` |
| 导航名 / 时长 | `data/presentation-config-20m.json` → `pages[0]` |
| 玻璃外形、高光 SVG | `js/final-show.js` → `HG_GLASS_SVG` |
| 页面 DOM 结构 | `js/final-show.js` → `buildVsSplitPage()` |
| 沙粒颜色、流速、物理 | `js/hourglass-sand.js` |
| 玻璃大小、标题位置、LED 字号 | `css/split-stage.css` → `.hg-*` |
| 第 2 幕沙流加速 | `hourglass-sand.js` `setBeat` + `final-show.js` `applyVsSplitBeat` |

---

## 6. 预览

```bash
cd ai-final-presentation
node scripts/bundle-presentation.mjs 20m   # 若改了 final-show.js 或 JSON
python3 -m http.server 8765
```

```
http://localhost:8765/index-20m.html?led=1&v=20m-local3
http://localhost:8765/presenter-20m.html?led=1&v=20m-local3
```

改 `hourglass-sand.js` 或 `split-stage.css` 后刷新即可；改 `final-show.js` 或 `data/*-20m.json` 后须重新打包并更新 `?v=` 缓存参数。

---

## 7. 架构说明

- **玻璃层：** SVG 2D 路径 + 半透明填充（`HG_GLASS_SVG`）
- **沙子层：** Canvas 2D 粒子（`hourglass-sand.js`）
- **轮廓同步：** SVG 路径与 `chamberHalfWidth()` / `clipGlass()` 是两套数据，改外形需两处一起改

升级「液体玻璃 + 真实沙感」时，通常增强 `hourglass-sand.js`（更密粒子 / WebGL）并在 SVG 上叠加多层 filter 或玻璃纹理资源。
