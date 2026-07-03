# 用AI重构舆情工作范式 — 决赛演示 v5

面向公司 AI 课代表决赛的 **6 页叙事型** HTML 演示，围绕 **「舆情工作链总图」** 展开，演讲者键盘完全掌控节奏。

## 本地启动

```bash
cd ai-final-presentation
python3 -m http.server 8080
# 或双击 index.html / 打开演示.command
```

已打包 `js/presentation.all.js`，支持 **离线双击**（`file://`）。

## 结构概览（v5）

| 页 | 标签 | 总图 | 核心 |
|----|------|------|------|
| 1 | 总结构 | 完整总图 | 三段工作链问题逐段点亮 |
| 2 | 现实断层 | 完整+断点 | 姜添/萨满案例暴露三段断层 |
| 3 | 舆情解析 | 迷你高亮 | 人工拼图 → 多源聚合 |
| 4 | 舆情处置 | 迷你高亮 | 九叔哈哈统一事件卡演示 ★ |
| 5 | 舆情回溯 | 迷你高亮 | 纠错闭环 + 3D球体 |
| 6 | 统一行动 | 完整全亮 | 组织价值与收束 |

## 键盘

| 键 | 功能 |
|----|------|
| 空格 / → | 下一 beat |
| ← | 上一 beat |
| 1–6 | 跳页 |
| E | 证据抽屉 |
| F | 全屏 |
| H | 控制提示 |

## 修改文案

**主文案：** `data/presentation-content.json`（六页标题、三段名称、痛点、Page4 字段等）

**技术配置：** `data/presentation-config.json`（姓名脱敏、球体 URL、证据映射）

**仿真数据：** `data/demo-messages.json` · `data/demo-event.json`

修改 JSON 后重新打包：

```bash
python3 -c "
import json; from pathlib import Path; r=Path('.')
d={'config':json.loads((r/'data/presentation-config.json').read_text()),
   'content':json.loads((r/'data/presentation-content.json').read_text()),
   'manifest':json.loads((r/'data/asset-manifest.json').read_text()),
   'demoMessages':json.loads((r/'data/demo-messages.json').read_text()),
   'demoAnalysis':json.loads((r/'data/demo-analysis.json').read_text()),
   'demoEvent':json.loads((r/'data/demo-event.json').read_text())}
(r/'js/presentation.all.js').write_text('window.__PRESENTATION_DATA__ = '+json.dumps(d,ensure_ascii=False)+';\\n\\n'+(r/'js/final-show.js').read_text())
"
```

## 回退旧版

v4 备份：`_backup_v4_pre_restructure/` 或 `backup-v4-pre-restructure/`

## 部署 GitHub Pages

推送仓库，Settings → Pages → 选分支与目录。根目录含 `.nojekyll`。

## 演讲备注

详见 **`SPEAKER_NOTES.md`**（含每页 beat、口述、证据时机，目标 ~10 分钟）。
