# 投屏清晰模式 · Apple 文档风（本地验证）

> **基线：** `3332384` · **未推送线上**

## 变更说明

已回退上一版「无脑放大 + 深底」的 `led-mode.css`，改为 **Apple 文档风** 的 `projection-mode.css`：

- 白底 `#F5F5F7` + 黑字 `#1D1D1F`，高对比
- **保留原 1920×1080 布局网格**，不 flex 改列宽
- 字号**克制调整**（正文 20px，标题 46px），非聚焦列反而略缩小
- **隐藏次要信息**防重叠（副路径说明、会话统计、部分事件卡字段等）
- 聚焦列用蓝色/橙色边框区分，不靠放大

## 打开方式

| 方式 | 操作 |
|---|---|
| 本地入口 | `index-led.html` → `index.html?led=1` |
| URL | `index.html?led=1` |
| 快捷键 | **L** 切换 |
| 讲者预览 | `presenter-led.html` |
| 原视觉 | `index.html`（无参数） |

## 本地预览

```bash
cd ai-final-presentation && python3 -m http.server 8080
```

| 用途 | 地址 |
|---|---|
| 清晰投屏 | http://localhost:8080/index-led.html |
| 原投屏 | http://localhost:8080/index.html |
| 清晰讲者台 | http://localhost:8080/presenter-led.html |

## 回退

```bash
git checkout main          # 回到 3332384 原视觉
# 或去掉 ?led=1 / 按 L 关闭清晰模式
```

## 文件

- `css/projection-mode.css` — 新增（替代已删除的 `led-mode.css`）
- `js/final-show.js` — 仅 `initProjectionMode` + L 键（约 20 行）
- `index.html` — 多引一行 CSS（无 class 时不生效）

_backup_v8_pre_led_mode/ 仍保留第一次 LED 实验前的文件快照。
