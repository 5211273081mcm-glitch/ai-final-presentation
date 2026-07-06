# 投屏增权模式（黑底 · 本地）

> **基线 `3332384`** · **未推送线上**

## 增权 v2（LED 珠屏）

- **整画布等比 1.45×**（JS `PROJECTION_ZOOM`）：文字/线框/元素同步放大，相对位置不变，边缘少量裁切
- **对比 + 线宽 + 字重** 约 2–3×：路径 7px、卡片边框 3–4px、标题 800
- 黑底不变 · 未 push 线上

若仍不够：可改 `js/final-show.js` 中 `PROJECTION_ZOOM`（建议 1.35–1.55）

## 打开

| 方式 | 操作 |
|---|---|
| `index-led.html` | → `index.html?led=1` |
| 快捷键 | **L** |
| 原视觉 | `index.html`（无参数） |

```bash
python3 -m http.server 8080
# 增权：http://localhost:8080/index-led.html
# 原版：http://localhost:8080/index.html
```

## 文件

- `css/projection-boost.css` — 增权样式（无字号/布局改动）
- `js/final-show.js` — 仅 `?led=1` 开关 + L 键（约 15 行）

回退：`git checkout main`
