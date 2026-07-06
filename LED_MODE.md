# LED 大屏高可读模式 · 本地验证指南

> **未推送线上。** 线上投屏与讲者控制台链接仍为 commit `3332384`，行为不变。

## 安全备份

| 项 | 路径 |
|---|---|
| 文件备份 | `_backup_v8_pre_led_mode/` |
| Git 分支 | `feature/led-mode-local`（基于 `main` / `3332384`） |
| 回退原视觉 | `git checkout main` 或去掉 `?led=1` / 按 **L** 关闭 |

## 如何打开 LED Mode

| 方式 | 说明 |
|---|---|
| **URL 参数** | `index.html?led=1` |
| **本地快捷入口** | `index-led.html`（自动跳转带 `?led=1`） |
| **快捷键** | **L** 切换开/关（Evidence 打开时不切换） |
| **讲者 LED 预览** | `presenter-led.html`（iframe 与投屏窗均带 `?led=1`） |

默认线上链接 **不带** `?led=1`，仍为原黑底科技风。

## 本地预览地址

```bash
cd ai-final-presentation
python3 -m http.server 8080
```

| 用途 | 地址 |
|---|---|
| LED 投屏 | http://localhost:8080/index-led.html |
| LED 投屏（直链） | http://localhost:8080/index.html?led=1 |
| 原视觉投屏 | http://localhost:8080/index.html |
| LED 讲者控制台 | http://localhost:8080/presenter-led.html |
| 原讲者控制台 | http://localhost:8080/presenter.html |

**建议：** 浏览器 **100% 缩放**；LED 现场按 **1920×1080** 或 **3840×2160** 输出，勿再浏览器缩小。

## 修改文件

| 文件 | 变更 |
|---|---|
| `css/led-mode.css` | **新增** — 全部 LED 视觉覆盖（仅 `body.led-mode`） |
| `js/final-show.js` | LED 初始化、L 键、风险词高亮、Evidence 文案 |
| `js/presentation.all.js` | 本地重打包（含上述 JS） |
| `index.html` | 引入 `led-mode.css`（无 class 时不生效） |
| `index-led.html` | **新增** — 本地 LED 入口 |
| `presenter-led.html` | **新增** — 讲者 LED 预览入口 |
| `js/presenter.js` | `PRESENTER_LED_PREVIEW` 时 iframe/投屏带 `&led=1` |

## LED 专用 CSS 变量

```css
--led-title-size
--led-section-title-size
--led-subtitle-size
--led-body-size
--led-small-size
--led-label-size
--led-button-size
--led-conclusion-size
```

## 各页增强摘要

| 页 | 增强 |
|---|---|
| **P1 总结构** | 主标题/副标题放大提亮 |
| **P2 总纲** | 星球 +25%、链路 40px+、路径 5.5px、隐藏次要解释行、结论底条 |
| **P3 解析** | 三卡放大、聚焦 100% / 非聚焦 45%、Evidence ≥52px |
| **P4 处置** | 焦点式 flex 布局、当前列 ~38%、事件卡字段精简、风险词高亮 |
| **P5 回溯** | 闭环卡放大、3D 球体区放大、场景码/标题强化 |
| **P6 统一行动** | 岗位卡放大、愿景结论 ≥38px 底条 |
| **Evidence** | 全屏 92×82vw/vh、标题 36px、说明 28px、按钮 52px |

## 保留的交互

空格/方向键推进 · Esc 关 Evidence · E 开证据 · F 全屏 · L 切 LED · 讲者控制台四宫格/计时/逐字稿逻辑不变 · 6 页 21 幕结构不变

## 验收状态

- [x] 本地分支 + 备份目录
- [x] 未 push 到 GitHub / 未触发 Pages
- [x] 原模式可一键回退（main 分支 / 无 `?led=1`）
- [ ] 建议你在 LED 屏上逐页走查 21 幕重叠与字号（需现场硬件）
