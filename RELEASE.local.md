# 决赛 LED 投屏 · 线上发布链接

> **版本 ID：** `final-led-20260706`  
> **Git Tag：** `final-led-20260706`  
> **Commit：** `644a216`（完整：`644a21610aee923ade647edeff6601c7da9d9772`）  
> **与本地 file:// 一一对应**

## 本地（与线上同路径）

| 用途 | 链接 |
|------|------|
| **投屏（LED）** | `file:///Users/Lin/Desktop/Codex/AI比赛/AI/ai-final-presentation/index.html?led=1` |
| **讲者控制台（逐字稿右下角 · 原版布局）** | `file:///Users/Lin/Desktop/Codex/AI比赛/AI/ai-final-presentation/presenter.html?led=1` |

控制台点「打开 LED 投屏窗」→ 自动打开 `index.html?led=1`，与投屏页同步。

## GitHub Pages（上传 main 后）

将 `1154ad4` 替换为 `data/release.json` 中的 `commitShort`。

### 投屏（观众大屏）

```
https://5211273081mcm-glitch.github.io/ai-final-presentation/index.html?led=1&v=1154ad4
```

### 讲者控制台（右下角逐字稿 · 与原版 presenter.html 相同）

```
https://5211273081mcm-glitch.github.io/ai-final-presentation/presenter.html?led=1&v=1154ad4
```

> 逐字稿来源：`data/speaker-beats-v8.json`（与线上一致，支持本地编辑后导出同步）。

## 备用入口

| 入口 | 说明 |
|------|------|
| `index-led.html` | 自动跳转到 `index.html?led=1` |
| `presenter-led.html` | 与 `presenter.html?led=1` 等效（旧快捷文件） |
| `presenter.html` | 标准控制台（投屏窗不带 `?led=1`） |

## 上传

```bash
git push origin main
git push origin final-led-20260706
```
