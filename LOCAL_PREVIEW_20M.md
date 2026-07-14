# 20分钟三板块 · 本地预览说明

> **尚未推送 Git** — 请本地确认样式后再上线。

## 结构（9章 · 28幕 · 20:00）

| 板块 | 章 | 幕 | 内容 |
|------|-----|-----|------|
| **1** | 使用AI的趋势 | 2 | 沙漏视频 + 上下概括 · 第2幕线框标签与 ↓ 箭头 |
| **2** | 引语→统一行动 | 21 | 原决赛 6 页 21 幕（不变） |
| **3a** | AI心得 | 4 | 工具/思维 50/80/20 切换 → **第4幕飞书多维表全屏图** |
| **3b** | 提问交互 | 1 | 居中「提问交互」（无副标题） |

沙漏模块说明见 [HOURGLASS_MODULE.md](HOURGLASS_MODULE.md)。

## 本地启动

```bash
cd ai-final-presentation
python3 -m http.server 8777
```

### 投屏（建议加 `?led=1` 模拟 LED 字号）
```
https://5211273081mcm-glitch.github.io/ai-final-presentation/index-20m.html?led=1&v=20m-evo4
```

### 讲者台（可编辑提词稿）
```
https://5211273081mcm-glitch.github.io/ai-final-presentation/presenter-20m.html?led=1&v=20m-evo4
```

投屏页按 **S** 也可打开讲者台（20m 模式自动打开 `presenter-20m.html`）。

## 提词稿 · 编辑与保存

| 项 | 说明 |
|----|------|
| 默认稿 | `data/speaker-beats-20m.json` |
| 本机保存 | 浏览器 `localStorage`（键 `ai-final-presentation-speaker-notes-20m`），编辑后约 1 秒自动保存 |
| 手动保存 | 讲者台「保存」按钮 |
| 恢复原稿 | 「恢复本步原稿」回退到 JSON 默认 |
| 导出发布 | 「导出编辑稿」→ `speaker-beats-20m-edited.json`，放入 `data/` 并推送后各设备自动拉取 |

## 操作

| 键 | 功能 |
|----|------|
| 空格 / → | 下一幕 |
| ← | 上一幕 |
| 1–9 | 跳章（1=趋势，2–7=核心链路，8=AI心得，9=提问） |
| L | LED 投屏增权切换 |
| S | 打开讲者台（投屏页） |

## 修改后重新打包

```bash
node scripts/bundle-presentation.mjs 20m
```

改 `final-show.js` 或 JSON 后需执行；仅改 `speaker-beats-20m.json` 或 `presenter.js` 时刷新即可。

## 原版 10 分钟（未改动）

```
index.html?led=1&v=syncfix5
presenter.html?led=1&v=syncfix5
```
