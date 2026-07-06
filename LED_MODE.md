# 投屏增权模式（黑底 · 本地）

> **基线 `3332384`** · **未推送线上**

## 原则

- **黑底科技风不变**
- **布局、字号、元素位置不变**（避免重叠）
- 只增：**对比度 · 字重 · 线宽 · 边框 · 非聚焦列最低亮度**
- 删除白底版 / 无脑放大版

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
