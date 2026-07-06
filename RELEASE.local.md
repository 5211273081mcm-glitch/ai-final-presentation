# 决赛投屏 · 最终本地版

> **版本 ID：** `final-local-20260706`  
> **分支：** `feature/led-mode-local`  
> **Commit：** `1a42fa2`（完整：`1a42fa22aec9b6c16d6d2b869f1ced3e674005db`）  
> **Git Tag：** `final-local-20260706`  
> **线上基线（main）：** `3332384`

## 本地预览

```bash
cd ai-final-presentation && python3 -m http.server 8080
```

| 用途 | 本地链接 |
|------|----------|
| 投屏（LED 增权） | http://localhost:8080/index.html?led=1 |
| 投屏快捷入口 | http://localhost:8080/index-led.html |
| 讲者控制台（LED 预览） | http://localhost:8080/presenter-led.html |
| 讲者控制台（标准） | http://localhost:8080/presenter.html |

## 上传 GitHub 后 · GitHub Pages 链接

推送 **`feature/led-mode-local`** 合并到 **`main`** 并部署 Pages 后，使用下列链接：

### 投屏（观众屏 · LED）

```
https://5211273081mcm-glitch.github.io/ai-final-presentation/index.html?led=1&v=1a42fa2
```

快捷入口：

```
https://5211273081mcm-glitch.github.io/ai-final-presentation/index-led.html?v=1a42fa2
```

### 讲者控制台

LED 预览（iframe 同步 `?led=1`）：

```
https://5211273081mcm-glitch.github.io/ai-final-presentation/presenter-led.html?v=1a42fa2
```

标准控制台：

```
https://5211273081mcm-glitch.github.io/ai-final-presentation/presenter.html?v=1a42fa2
```

## Commit 锁定预览（推送后即时可用 · 无需等 Pages 更新）

jsDelivr 按 commit 拉取静态文件（适合核对某一版是否与本地一致）：

```
https://cdn.jsdelivr.net/gh/5211273081mcm-glitch/ai-final-presentation@1a42fa22aec9b6c16d6d2b869f1ced3e674005db/index.html?led=1
https://cdn.jsdelivr.net/gh/5211273081mcm-glitch/ai-final-presentation@1a42fa22aec9b6c16d6d2b869f1ced3e674005db/presenter-led.html
```

## 上传步骤

```bash
git checkout feature/led-mode-local
git push -u origin feature/led-mode-local
# 合并到 main 后
git checkout main && git merge feature/led-mode-local && git push origin main
```

## 本版变更摘要

- 投屏增权（黑底 / fit / token 提权 / 顶栏与导航）
- 第 3–5 页标题结构调整；第 6 页星球光晕回退未点亮态
- 聚合事件卡（7.6 新）；影响范围去掉「路人用户」
- 导航：引语 / 发光白框进度 / 去掉 01–06 编号
- 顶栏：项目名 + 章节导航 + 10:00 倒计时
