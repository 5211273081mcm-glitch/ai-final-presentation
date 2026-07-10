window.__PRESENTATION_DATA__ = {"config":{"projectTitle":"用AI重构舆情工作范式","targetTotalSec":600,"subtitle":"AI重构舆情的本质，是缩短从发现信号到统一行动的距离","useAnonymizedNames":false,"names":{"real":{"hostA":"九叔","hostB":"哈哈"},"anon":{"hostA":"主播A","hostB":"主播B"}},"opsSystemUrl":"http://localhost:5173/","sphere":{"url":"https://5211273081mcm-glitch.github.io/tcg-scene-library-v41/#s-univ","fallbackImage":"assets/evidence/3D场景球体截图.webp","loadTimeoutMs":8000,"currentScene":{"code":"R-087","name":"主播言行引发健康高敏争议","category":"医疗高敏","triggers":["ICU","昏迷","药物中毒","停播诉求"],"weight":0.92,"alertLevel":"P1","roles":["大秘书","主播管理","舆情公关","法务"],"relatedEvent":"九叔—哈哈解绑及健康高敏争议","sop":"高敏医疗类事件SOP v2.1"}},"evidenceMapping":{"signals":["douban-crawler","douban-monitor-jiang","secretary-raw","douban-alert-1"],"demo":["secretary-raw","secretary-ai-1","secretary-ocr","event-card-old","douban-alert-2"],"loop":["monthly-june","sphere-screenshot","event-card-old","douban-slang-1"]},"stats":{"categories":17,"scenes":204},"pages":[{"id":1,"tag":"引语","durationSec":50,"beats":5},{"id":2,"tag":"现实断层","durationSec":50,"beats":5,"hasEvidence":true},{"id":3,"tag":"舆情解析","durationSec":90,"beats":4},{"id":4,"tag":"舆情处置","durationSec":180,"beats":8,"hasEvidence":true},{"id":5,"tag":"舆情回溯","durationSec":125,"beats":6,"hasEvidence":true},{"id":6,"tag":"统一行动","durationSec":105,"beats":4}]},"content":{"projectTitle":"用AI重构舆情工作范式","coreProposition":"AI重构的本质，是缩短从发现信号到统一行动的距离","corePropositionHtml":"AI重构的本质，是 <em>缩短</em> 从发现信号到统一行动的 <em>距离</em>","humanBoundary":"AI不代替公司作决策，AI让所有人先基于同一份事实行动。","masterMap":{"kicker":"总纲 · 主脉络","title":"用AI重构舆情工作范式","subtitle":"核心目标：把分散信号，变成统一行动","note":"AI不是替代判断，而是重构从发现、解析、处置到闭环的协同链路。","leftTitle":"发现信号","leftDesc":"来自豆瓣、评论、私信、投诉和业务反馈的分散风险线索","leftTexture":"assets/generated/planet-signal-red.webp","leftCaption":"更少人力 · 更快 · 更准 · 更精 · 更专","rightTitle":"统一行动","rightDesc":"基于客观事实、统一口径与责任共识后的组织行动","rightTexture":"assets/generated/planet-action-blue.webp","rightCaption":"更全面 · 有事实 · 有依据 · 有建议","signalTags":["豆瓣","评论","私信","投诉","业务反馈"]},"stages":[{"id":"parse","num":"01","name":"舆情解析","capsuleDesc":"主体识别 / 问题提炼 / 事件聚合","currentPain":"信源分散 / 人工提炼","aiPath":"智能感知 / 事件聚合"},{"id":"handle","num":"02","name":"舆情处置","capsuleDesc":"风险分级 / 责任分发 / 动作建议","currentPain":"层层转述 / 人力协同","aiPath":"统一事件 / 自动分发"},{"id":"loop","num":"03","name":"舆情闭环","capsuleDesc":"结果追踪 / 风险沉淀 / 经验复用","currentPain":"解释回应 / 容易复发","aiPath":"风险沉淀 / 纠错闭环"}],"replication":[{"role":"大秘书 / 小秘书","desc":"同一事件卡驱动回复口径与介入跟踪","note":"后续将打通全部小秘书私信接入，100% 实现投诉自动化。"},{"role":"粉丝运营","desc":"风险信号与处置状态同步可见","note":"粉丝投诉自动化后，长期协同看清粉丝诉求，更好维护管理粉丝。"},{"role":"内容策划","desc":"基于历史场景规避同类内容风险","note":"评论区、大字报、社媒负面爬虫抓取，快速看清内容创意的问题。"},{"role":"主播管理 / 法务","desc":"责任清单与待核验事项自动分发","note":"舆情整合系统（建设中），舆情从发酵初期，关键人员全链路提前感知，提升处置时效。"}],"closing":{"copyLines":["过去上述需求需要等待程序和数据团队排期","现在，舆情团队逐步掌握自己开发常用技术接口的能力","我们计划将舆情转化为可检索、可关联、可复用的组织风险资产"]},"pages":[{"id":1,"code":"01","tag":"引语","title":"舆情真正的难点，不是信息不足\n而是信息无法及时形成统一判断和行动","subtitle":"我们最需要重构的，不是单点工具，而是从「发现信号」到「统一行动」的整条链路。","conclusion":"接下来，先看这条链路的全貌。"},{"id":2,"code":"02","tag":"总纲","title":"用AI重构舆情工作范式","subtitle":"核心目标：把分散信号，变成统一行动"},{"id":3,"code":"03","tag":"舆情解析","title":"第一段升级：舆情解析","subtitle":"信号很分散，但每一类都已经有解法","conclusion":"接入的问题已逐步解决，真正的难点在于把它们拼成同一件事。","sourceColumns":[{"name":"豆瓣讨论","items":["异常讨论升温 · 关联主播话题","黑话与别称需人工识别","趋势变化依赖人工盯盘"],"evidence":[{"id":"douban-crawler","label":"数据爬虫"},{"id":"douban-slang","label":"黑话解析"},{"id":"douban-monitor-saman","label":"实时监测"},{"id":"douban-alert-4","label":"群预警推送"},{"id":"douban-dashboard","label":"豆瓣看板"},{"id":"douban-daily-analysis","label":"每日豆瓣分析"}]},{"name":"大秘书私信 / 投诉","items":["用户诉求碎片化","图片 / 链接需 OCR 解析","多条会话是否同一事件需人工判断"],"evidence":[{"id":"secretary-cookie-import","label":"私信cookie导入"},{"id":"secretary-ai-1","label":"AI字段解析"},{"id":"secretary-ocr","label":"图片OCR解析"}]},{"name":"业务反馈 / 社媒评论","items":["业务上报与社媒评论渠道分散","海量评论为非结构化文本，人工难以逐条研判","口径不统一，难以与外部舆情自动关联"],"evidence":[{"id":"social-crawler","label":"社媒发文爬虫"},{"id":"crawler-aggregate","label":"评论聚合分析"}]}]},{"id":4,"code":"04","tag":"舆情处置","title":"第二段升级：舆情处置","subtitle":"从0到1：一条投诉如何在同一屏内长成事件卡并触发预警","conclusion":"同一件事，从投诉到事件卡、预警，第一次被组织用同一个视角看见。","aiBoundary":{"not":"AI 不判断主播是否应对病情负责。","does":["事件聚合","风险识别","责任建议","介入触发"]},"handleColumns":[{"name":"原始投诉","kicker":"01 · 信号涌入","evidence":[{"id":"secretary-raw-quote","label":"原声私信/投诉"}]},{"name":"风险标签识别","kicker":"02 · AI结构化","evidence":[{"id":"host-tag-library","label":"主播标签库"},{"id":"secretary-inbox","label":"事件入库解析"},{"id":"secretary-multiformat","label":"图文链接解析"},{"id":"secretary-judgement","label":"结构性研判"}]},{"name":"舆情事件卡","kicker":"03 · 统一事件卡","evidence":[{"id":"event-card-new","label":"聚合事件卡参考"}]},{"name":"预警触发","kicker":"04 · 自动触达","evidence":[{"id":"secretary-bot-alert","label":"群机器人预警"}]}]},{"id":5,"code":"05","tag":"舆情回溯","title":"第三段升级：舆情闭环","subtitle":"预警不是终点，闭环才是价值","conclusion":"事件结束以后，它应该成为下一次判断可以调用的组织资产。"},{"id":6,"code":"06","tag":"统一行动","title":"回到总纲 · 闭环完成","subtitle":"一条已跑通的路径，可复制到更多业务岗位"}]},"manifest":{"generatedAt":"2026-06-30","assets":[{"id":"sphere-screenshot","originalFilename":"3D场景球体截图.png","path":"assets/evidence/3D场景球体截图.webp","width":2874,"height":1550,"category":"3D球体截图","suggestedPage":"page5","usageTier":"main","title":"3D风险知识宇宙","description":"17类目、204个风险场景构成的组织知识资产视图"},{"id":"secretary-ai-1","originalFilename":"【大秘书】AI解析后的字段结果1.png","path":"assets/evidence/【大秘书】AI解析后的字段结果1.webp","width":2934,"height":1588,"category":"大秘书-AI解析","suggestedPage":"page4","usageTier":"main","title":"AI结构化解析结果","description":"AI将非结构化私信解析为结构化风险字段，证明解析能力已运行","sourceUrl":"https://dztkd8r9io.feishu.cn/base/JZ4sb28ySaqGaHsRbc7cpKgsnxe?table=tble8dXup2Jvbski","sourceLabel":"至大秘书多维表"},{"id":"secretary-cookie-import","originalFilename":"【大秘书】原始私信内容.png","path":"assets/evidence/【大秘书】原始私信内容.webp","width":2940,"height":1588,"category":"大秘书-Cookie导入","suggestedPage":"page3","usageTier":"main","title":"私信Cookie导入","description":"通过Cookie免登录方式批量导入大秘书私信原始内容，减少人工搬运","sourceUrl":"https://dztkd8r9io.feishu.cn/base/JZ4sb28ySaqGaHsRbc7cpKgsnxe?table=tblpHL5KHeE1Tx3m&view=vew5eTtgBK","sourceLabel":"至大秘书多维表"},{"id":"secretary-ai-2","originalFilename":"【大秘书】AI解析后的字段结果2 补充解析维度.png","path":"assets/evidence/【大秘书】AI解析后的字段结果2 补充解析维度.webp","width":2940,"height":1590,"category":"大秘书-AI解析","suggestedPage":"page4","usageTier":"main","title":"补充解析维度","description":"场景编号、风险类目、预警等级等补充研判维度"},{"id":"secretary-raw","originalFilename":"【大秘书】原始私信内容.png","path":"assets/evidence/【大秘书】原始私信内容.webp","width":2940,"height":1588,"category":"大秘书-原始私信","suggestedPage":"page4","usageTier":"main","title":"大秘书原始私信","description":"大秘书渠道真实私信原始内容，证明投诉接入已运行"},{"id":"secretary-ocr","originalFilename":"【大秘书】私信图片OCR 私信链接解析.png","path":"assets/evidence/【大秘书】私信图片OCR 私信链接解析.webp","width":2934,"height":1586,"category":"大秘书-OCR","suggestedPage":"page4","usageTier":"main","title":"私信图片OCR与链接解析","description":"私信中的图片与链接可被自动解析，补充证据链"},{"id":"monthly-june","originalFilename":"【月报】2026年6月舆情大盘图.png","path":"assets/evidence/【月报】2026年6月舆情大盘图.webp","width":1672,"height":941,"category":"月报","suggestedPage":"page5","usageTier":"main","title":"2026年6月舆情大盘","description":"月度风险趋势汇总，证明事件可沉淀为管理视图"},{"id":"crawler-aggregate","originalFilename":"【爬虫分析】聚合.png","path":"assets/evidence/【爬虫分析】聚合.webp","width":1672,"height":941,"category":"爬虫分析","suggestedPage":"page6","usageTier":"evidence","title":"评论抓取与聚合分析","description":"批量评论正负向分析与主题聚合，可复制至内容策划","sourceUrl":"https://chatgpt.com/canvas/shared/69c2737b3de48191b08821d22ef29dff","sourceLabel":"至数据分析报告"},{"id":"social-crawler","originalFilename":"【社媒】数据爬虫.png","path":"assets/evidence/【社媒】数据爬虫.webp","width":2938,"height":1458,"category":"社媒-爬虫","suggestedPage":"page3","usageTier":"main","title":"社媒发文爬虫","description":"持续抓取微博/抖音/小红书发文与评论数据，统一汇入社媒数据源","sourceUrl":"https://dztkd8r9io.feishu.cn/base/ZmAkbKvIQahKA5spsNacKrOxnOh?table=tblauCuEs5imAE0z&view=vewDsAkt4c","sourceLabel":"至社媒多维表"},{"id":"douban-trend-jiang","originalFilename":"【豆瓣】大盘视图（姜添）.png","path":"assets/evidence/【豆瓣】大盘视图（姜添）.webp","width":2796,"height":1752,"category":"豆瓣-大盘","suggestedPage":"page2","usageTier":"main","title":"姜添相关讨论趋势","description":"将零散转发内容转化为可比较的长期讨论量级"},{"id":"douban-trend-saman","originalFilename":"【豆瓣】大盘视图（萨满）.png","path":"assets/evidence/【豆瓣】大盘视图（萨满）.webp","width":2796,"height":1752,"category":"豆瓣-大盘","suggestedPage":"page2","usageTier":"main","title":"萨满相关讨论趋势","description":"多主播风险传导的可视化趋势证据"},{"id":"douban-monitor-jiang","originalFilename":"【豆瓣】实时讨论监测+沉淀（1月底姜添）.png","path":"assets/evidence/【豆瓣】实时讨论监测+沉淀（1月底姜添）.webp","width":2936,"height":1586,"category":"豆瓣-监测","suggestedPage":"page2","usageTier":"main","title":"姜添事件实时监测","description":"姜添相关讨论实时采集与内容沉淀"},{"id":"douban-monitor-saman","originalFilename":"【豆瓣】实时讨论监测+沉淀（1月底萨满）.png","path":"assets/evidence/【豆瓣】实时讨论监测+沉淀（1月底萨满）.webp","width":2940,"height":1588,"category":"豆瓣-监测","suggestedPage":"page2","usageTier":"main","title":"萨满事件实时监测","description":"萨满相关讨论实时采集与内容沉淀","sourceUrl":"https://dztkd8r9io.feishu.cn/wiki/A1wkwBrHriJQARkph8rcZqhgnvc?table=tbl5aU2LIEKRDWLK&view=vewpjmF9HB","sourceLabel":"至豆瓣多维表"},{"id":"douban-alert-1","originalFilename":"【豆瓣】异常讨论群预警1.png","path":"assets/evidence/【豆瓣】异常讨论群预警1.webp","width":1890,"height":1422,"category":"豆瓣-群预警","suggestedPage":"page2","usageTier":"main","title":"群机器人阈值预警","description":"单位时间新增讨论命中阈值，自动向舆情群发出提醒"},{"id":"douban-alert-2","originalFilename":"【豆瓣】异常讨论群预警2.png","path":"assets/evidence/【豆瓣】异常讨论群预警2.webp","width":1894,"height":1152,"category":"豆瓣-群预警","suggestedPage":"page2","usageTier":"main","title":"异常讨论群预警（二）","description":"不同类型异常讨论的预警推送示例"},{"id":"douban-crawler","originalFilename":"【豆瓣】数据爬虫.png","path":"assets/evidence/【豆瓣】数据爬虫.webp","width":2878,"height":1548,"category":"豆瓣-爬虫","suggestedPage":"page2","usageTier":"main","title":"豆瓣数据爬虫","description":"持续抓取指定豆瓣小组与话题内容，并同步进入内部表格","sourceUrl":"http://mcm521127.natapp1.cc/module/douban","sourceLabel":"至舆情采集平台"},{"id":"event-card-old","originalFilename":"聚合事件卡（旧版）.png","path":"assets/evidence/聚合事件卡（旧版）.webp","width":1370,"height":1462,"category":"聚合事件卡","suggestedPage":"page5","usageTier":"main","title":"聚合事件卡（旧版参考）","description":"多条消息聚合为统一事件卡的产品形态参考"},{"id":"douban-slang-1","originalFilename":"【豆瓣】黑话解析1.png","path":"assets/evidence/【豆瓣】黑话解析1.webp","width":2434,"height":848,"category":"豆瓣-黑话","suggestedPage":"optional","usageTier":"optional","title":"黑话解析查询","description":"粉圈黑话词典辅助理解，暂不入主舞台"},{"id":"douban-slang","originalFilename":"【豆瓣】黑话解析.png","path":"assets/evidence/【豆瓣】黑话解析.webp","width":1442,"height":714,"category":"豆瓣-黑话","suggestedPage":"page3","usageTier":"main","title":"豆瓣黑话智能解析","description":"自动识别粉圈黑话与暗语并转译为标准语义，无需人工逐词查词典","sourceUrl":"https://dztkd8r9io.feishu.cn/share/base/query/shrcnwtiabhIYFO02EiA1p4SK5c","sourceLabel":"至豆瓣黑话破解工具"},{"id":"douban-alert-4","originalFilename":"【豆瓣】异常讨论群预警4.png","path":"assets/evidence/【豆瓣】异常讨论群预警4.webp","width":1874,"height":1142,"category":"豆瓣-群预警","suggestedPage":"page3","usageTier":"main","title":"群机器人实时预警推送","description":"命中阈值后自动推送到舆情协同群，替代人工反复刷新盯盘"},{"id":"secretary-inbox","originalFilename":"【大秘书】事件入库+解析.png","path":"assets/evidence/【大秘书】事件入库+解析.webp","width":2938,"height":1460,"category":"大秘书-事件入库","suggestedPage":"page4","usageTier":"main","title":"事件自动入库与解析","description":"私信投诉进入系统后自动完成事件入库与结构化解析，无需人工建档"},{"id":"secretary-multiformat","originalFilename":"【大秘书】将文字图片链接一并解析.png","path":"assets/evidence/【大秘书】将文字图片链接一并解析.webp","width":2938,"height":1466,"category":"大秘书-多模态解析","suggestedPage":"page4","usageTier":"main","title":"文字/图片/链接一并解析","description":"文字、截图与外部链接混合出现时也能一次性解析，不遗漏证据"},{"id":"secretary-judgement","originalFilename":"【大秘书】舆情结构性研判.png","path":"assets/evidence/【大秘书】舆情结构性研判.webp","width":2934,"height":1456,"category":"大秘书-结构性研判","suggestedPage":"page4","usageTier":"main","title":"舆情结构性研判","description":"AI 输出问题标题、主体、风险等级与研判结论，形成统一事件卡雏形"},{"id":"secretary-bot-alert","originalFilename":"【大秘书】群机器人预警.png","path":"assets/evidence/【大秘书】群机器人预警.webp","width":1672,"height":941,"category":"大秘书-群预警","suggestedPage":"page4","usageTier":"main","title":"群机器人数量型预警","description":"新增投诉命中阈值后自动推送预警到协同群，附带一键查看入口"},{"id":"douban-dashboard","originalFilename":"【豆瓣大盘】.png","path":"assets/evidence/【豆瓣大盘】.webp","width":2796,"height":1752,"category":"豆瓣-大盘","suggestedPage":"page3","usageTier":"main","title":"豆瓣看板","description":"分主播/分小组的讨论量与关联转发实时统计，替代人工逐条计数盯盘","sourceUrl":"https://dztkd8r9io.feishu.cn/app/IreEbYpqoaMsfWsNLyhc6FFjnlb?pageId=pgefOh2lxC2iwcid","sourceLabel":"至豆瓣看板"},{"id":"douban-daily-analysis","originalFilename":"【豆瓣】每日分析.png","path":"assets/evidence/【豆瓣】每日分析.webp","width":1672,"height":941,"category":"豆瓣-每日分析","suggestedPage":"page3","usageTier":"main","title":"每日豆瓣分析","description":"每日定时输出豆瓣线索概览：总讨论量、活跃话题、舆情提炼与主播相关动态，替代人工日报盘点"},{"id":"secretary-raw-quote","originalFilename":"【大秘书】原声私信:投诉.png","path":"assets/evidence/【大秘书】原声私信:投诉.webp","width":2876,"height":1422,"category":"大秘书-原声投诉","suggestedPage":"page4","usageTier":"main","title":"大秘书原声私信/投诉","description":"投诉原声内容真实留存，作为风险标签识别与事件卡生成的原始输入","sourceUrl":"https://dztkd8r9io.feishu.cn/base/JZ4sb28ySaqGaHsRbc7cpKgsnxe?table=tblpHL5KHeE1Tx3m&view=vewHxrSeR5","sourceLabel":"至大秘书多维表"},{"id":"host-tag-library","originalFilename":"【主播标签库】.png","path":"assets/evidence/【主播标签库】.webp","width":2876,"height":1420,"category":"主播标签库","suggestedPage":"page4","usageTier":"main","title":"主播标签库","description":"主播人设、运营归属、厅归属等标签的统一维护列表，供风险标签识别环节匹配调用","sourceUrl":"https://dztkd8r9io.feishu.cn/base/KLA9bnknXaxeGPsJgjacxkHOnp8?table=tbl6qxeGJiuNXH7Y&view=vewwqS7YSZ","sourceLabel":"至主播概览列表"},{"id":"event-card-new","originalFilename":"聚合事件卡（7.6新）.png","path":"assets/evidence/聚合事件卡（7.6新）.webp","width":1672,"height":941,"category":"聚合事件卡","suggestedPage":"page4","usageTier":"main","title":"聚合事件卡（新版参考）","description":"事件全维度信息在同一张卡片内呈现：风险评分、处置阶段、认领状态、涉及主体与下一步行动"},{"id":"situation-review","originalFilename":"【舆情态势复盘】.png","path":"assets/evidence/【舆情态势复盘】.webp","width":1672,"height":941,"category":"舆情态势复盘","suggestedPage":"page5","usageTier":"main","title":"舆情态势复盘图","description":"围绕事件焦点还原发展脉络、核心风险与后续工作重点，形成可复盘的组织经验"}],"unused":[{"originalFilename":"【豆瓣】异常讨论群预警3.png","reason":"与预警1/2/4功能重复，保留最清晰三张"},{"originalFilename":"【豆瓣】黑话解析2.png","reason":"与黑话解析.png功能重复，保留最清晰一张"},{"originalFilename":"【豆瓣】黑话解析3.png","reason":"与黑话解析.png功能重复，保留最清晰一张"}]},"demoMessages":{"messages":[{"id":"msg-001","source":"大秘书","time":"2026-03-12 09:14","sessionId":"S-7f2a","content":"用户投诉九叔长期语言刺激哈哈，要求公司调查","hasAttachment":false,"status":"待处理","sensitive":false,"tags":["主播言行","CP争议"]},{"id":"msg-002","source":"大秘书","time":"2026-03-12 11:32","sessionId":"S-7f2a","content":"用户要求公司暂停九叔直播，认为言行不当","hasAttachment":false,"status":"待处理","sensitive":false,"tags":["停播诉求"]},{"id":"msg-003","source":"大秘书","time":"2026-03-12 14:08","sessionId":"S-8b1c","content":"用户质疑公司为什么没有及时介入双方矛盾","hasAttachment":false,"status":"处理中","sensitive":false,"tags":["公司治理"]},{"id":"msg-004","source":"大秘书","time":"2026-03-13 08:45","sessionId":"S-9c3d","content":"用户咨询哈哈当前病情，提及ICU与昏迷","hasAttachment":true,"status":"待处理","sensitive":true,"tags":["ICU","昏迷","医疗高敏"]},{"id":"msg-005","source":"大秘书","time":"2026-03-13 16:22","sessionId":"S-9c3d","content":"用户要求发布官方处理结果，追问停播性质","hasAttachment":false,"status":"待处理","sensitive":false,"tags":["公告诉求","停播性质"]},{"id":"msg-006","source":"大秘书","time":"2026-03-14 10:11","sessionId":"S-a4e5","content":"用户投诉公开讨论病情隐私，涉及药物中毒传言","hasAttachment":true,"status":"待处理","sensitive":true,"tags":["隐私泄露","药物中毒","医疗高敏"]},{"id":"msg-007","source":"大秘书","time":"2026-03-15 19:47","sessionId":"S-b5f6","content":"用户追问停播属于主动停播还是公司处罚","hasAttachment":false,"status":"待处理","sensitive":false,"tags":["停播性质","处罚"]},{"id":"msg-008","source":"大秘书","time":"2026-03-16 21:03","sessionId":"S-c6g7","content":"用户要求公司核验双方真实关系与责任，提及法律责任","hasAttachment":false,"status":"待处理","sensitive":true,"tags":["法律责任","责任认定"]}],"quantityThreshold":5,"natureTriggers":["ICU","昏迷","药物中毒","法律责任","未成年人","诈骗","隐私泄露","监管"]},"demoAnalysis":{"complaintTarget":"T.九叔","relatedSubject":"T.哈哈","problemTypes":["主播言行","CP解绑","医疗高敏"],"coreDemands":["调查","停播","公告","处罚"],"riskTags":["ICU","昏迷","药物中毒","法律责任"],"firstMessageTime":"2026-03-12 09:14","lastMessageTime":"2026-03-16 21:03","sessionSpan":"5天","messageCount":23,"sessionCount":8,"interventionStatus":"大秘书已部分回复，待跨部门协同","secretaryReply":"已回复2条，其余待统一口径","evidence":{"works":2,"images":3,"voice":1},"latestSummary":"用户集中投诉九叔言行与哈哈健康状况的关联，要求停播、公告与责任认定，涉及医疗高敏与隐私争议","latestConclusion":"事件已从普通CP争议升级为涉及医疗、人身安全、主播管理和公司治理的高敏风险","latestScene":"主播言行引发健康高敏争议","latestCategory":"医疗高敏 / 主播行为 / 粉丝关系","alertLevel":"P1立即关注","aiBoundary":"AI识别的是风险升级信号，不判断谁应对病情负责"},"demoEvent":{"id":"EVT-2026-0147","name":"九叔—哈哈解绑及健康高敏争议","riskLevel":"高敏复核","priority":"P1立即关注","stage":"持续追问","duration":"6天","heating":true,"facts":{"mainSubjects":["T.九叔","T.哈哈"],"relatedSubjects":["粉丝群体","CP粉圈"],"firstSeen":"2026-03-12 09:14","lastUpdate":"2026-03-16 21:03","sessionCount":8,"messageCount":23,"sources":["大秘书","豆瓣","社交媒体"]},"aiInsights":{"topDemands":["要求调查九叔言行","要求暂停直播","要求发布官方公告"],"riskTags":["ICU","昏迷","药物中毒","隐私泄露","法律责任"],"frequentExpressions":["为什么不处理","病情真假","停播还是处罚","公司责任"],"sentiment":"焦虑、追问、对立","trend":"持续新增"},"pendingVerification":["哈哈病情的真实信息来源","主播言行与病情之间的直接因果","九叔停播属于主动行为还是公司处理","双方管理及粉丝是否继续对线"],"complaintCloud":[{"text":"哈哈昏迷未醒、病危或进入ICU","weight":45},{"text":"九叔明知哈哈患有抑郁症仍反复刺激","weight":43},{"text":"九叔单方面解除搭档关系刺激哈哈病情","weight":43},{"text":"九叔言行被指导致哈哈精神崩溃及药物中毒","weight":40},{"text":"粉丝要求公司发布公告并公开道歉","weight":37},{"text":"九叔被投诉长期语言刺激及精神打压哈哈","weight":36},{"text":"粉丝要求公司开除九叔或永久清退","weight":35},{"text":"公司被质疑管理失职、包庇纵容九叔","weight":34},{"text":"九叔事后仍被允许正常开播排挡","weight":33},{"text":"粉丝要求公司整顿主播及艺人风气","weight":33},{"text":"粉丝质疑公司迟迟未公布处理结果","weight":18},{"text":"粉丝要求公司尽快处理并给出交代","weight":17},{"text":"粉丝要求公司通报哈哈真实病情","weight":16},{"text":"九叔被指事后态度冷漠、不知悔改","weight":12},{"text":"九叔被投诉辱骂粉丝并煽动对立","weight":11},{"text":"九叔被质疑涉嫌故意伤害及承担法律责任","weight":9},{"text":"九叔被投诉公开哈哈病历、泄露隐私","weight":7},{"text":"粉丝要求公司严惩九叔并追究责任","weight":7},{"text":"哈哈因药物中毒接受血液透析治疗","weight":6},{"text":"九叔被指持续骚扰哈哈并反复电话轰炸","weight":5},{"text":"粉丝认为公司对九叔处罚过轻","weight":4},{"text":"粉丝质疑公司偏袒九叔","weight":4},{"text":"哈哈粉丝被指遭受网暴及恶意攻击","weight":4},{"text":"粉丝要求公司保护哈哈生命及身心安全","weight":3}],"suggestedRoles":["大秘书","主播管理","舆情公关","法务"],"cardDimensions":{"riskScore":1536,"riskScoreLevel":"高风险","org":"哈哈","department":"事业二部","category":"01 | CP引战/粉圈对立","categoryScene":"01-08 | CP人设与现实矛盾","impactScope":["粉丝群体","平台舆论"],"claimStage":"待大秘书回复","nextActionShort":"归类信源，指派主责同事","stageTrack":["常规投诉","单点事件","多点风险","预警與情","危机公关"],"currentStageIndex":3},"nextActions":["统一回复口径","核实停播及内部处理情况","监测社交平台扩散","避免对直接因果作未经核验的判断"],"footer":{"relatedHistory":["2025-11 CP解绑争议","2026-01 粉丝对立事件"],"sceneCode":"R-087","inMonthlyReport":true,"inKnowledgeBase":true},"alertCard":{"title":"高敏风险预警","event":"九叔—哈哈健康与解绑争议","triggerReason":"医疗高敏词 + 投诉持续增长","sessions":8,"messages":23,"demands":["调查","停播","公告","处罚"],"trend":"持续新增","deadline":"立即","prototype":true}}};

/**
 * 决赛演讲板 v8 — 状态渲染重构版
 * DOM 只创建一次，Space 只改变 stage/beat 值，不追加/不覆盖。
 */
(function () {
  'use strict';

  var APP = {
    config: null,
    content: null,
    manifest: null,
    demoMessages: null,
    demoEvent: null,
    chapter: 0,
    beat: 0,
    lastChapter: -1,
    prevChapter: -1,
    pageStartTime: 0,
    isPreview: false,
    busy: false,
    lbOpen: false,
    lbIdx: 0,
    lbImages: [],
    drawerOpen: false,
    startTime: Date.now(),
    targetSec: 600
  };
  window.APP = APP;

  function $(id) { return document.getElementById(id); }
  function C() { return APP.content; }
  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function names() {
    return APP.config.useAnonymizedNames ? APP.config.names.anon : APP.config.names.real;
  }
  function desensitizeRules() {
    var n = names();
    var d = (APP.config && APP.config.desensitize) || {};
    return [
      [/九叔/g, n.hostA || '主播A'],
      [/哈哈/g, n.hostB || '主播B'],
      [/姜添/g, n.hostC || '主播C'],
      [/萨满/g, n.hostD || '主播D'],
      [/事业二部/g, d.department || '运营一部'],
      [/听潮阁/g, '示例厅'],
      [/水都/g, '示例厅'],
      [/豆瓣/g, '社区讨论'],
      [/EVT-2026-\d+/g, (d.eventIdPrefix || 'EVT-DEMO') + '-0147'],
      [/R-087/g, d.sceneCode || 'R-D087'],
      [/CP解绑/g, '搭档变动'],
      [/CP引战/g, '粉圈对立'],
      [/CP粉圈/g, '粉圈讨论'],
      [/CP争议/g, '搭档争议'],
      [/九叔—哈哈/g, (n.hostA || '主播A') + '—' + (n.hostB || '主播B')],
      [/九叔-哈哈/g, (n.hostA || '主播A') + '—' + (n.hostB || '主播B')]
    ];
  }
  function swap(text, n) {
    var out = String(text || '');
    if (!APP.config.useAnonymizedNames) return out;
    desensitizeRules().forEach(function (rule) {
      out = out.replace(rule[0], rule[1]);
    });
    return out;
  }
  function isRoadshowMode() {
    return !!(APP.config && (APP.config.presentationMode === 'roadshow' || APP.config.useAnonymizedNames));
  }
  function asset(id) {
    var a = APP.manifest.assets.find(function (x) { return x.id === id; });
    if (!a) return null;
    if (a.roadshowHidden && isRoadshowMode()) return null;
    var exclude = (APP.config.desensitize && APP.config.desensitize.excludeEvidenceIds) || [];
    if (isRoadshowMode() && exclude.indexOf(id) >= 0) return null;
    return a;
  }
  function rv(html, step, extra) {
    return '<div class="reveal ' + (extra || '') + '" data-step="' + step + '">' + html + '</div>';
  }
  function tier(step, beat) {
    return step <= beat ? 'is-primary' : '';
  }

  function initData() {
    var d = window.__PRESENTATION_DATA__;
    if (!d) throw new Error('数据未加载');
    APP.config = d.config;
    APP.content = d.content;
    APP.manifest = d.manifest;
    APP.demoMessages = d.demoMessages;
    APP.demoEvent = d.demoEvent;
    initRoadshowPages();
  }

  var EVIDENCE = {
    loop: ['monthly-june', 'situation-review']
  };

  /* 舆情解析页三类信源的证据按「如何解决」逐列组织，来自 content.sourceColumns[].evidence */
  function parseEvidenceIds() {
    var ids = [];
    (C().pages[2].sourceColumns || []).forEach(function (col) {
      (col.evidence || []).forEach(function (e) { ids.push(e.id); });
    });
    return ids;
  }

  /* 舆情处置页四分栏证据，来自 content.handleColumns[].evidence */
  function handleEvidenceIds() {
    var ids = [];
    (C().pages[3].handleColumns || []).forEach(function (col) {
      (col.evidence || []).forEach(function (e) { ids.push(e.id); });
    });
    return ids;
  }

  function evChips(evList) {
    var list = (evList || []).filter(function (e) { return asset(e.id); });
    if (!list.length) return '';
    var groupAttr = list.map(function (e) { return e.id; }).join(',');
    var chips = list.map(function (e, idx) {
      return '<button class="ev-chip" data-ev-id="' + esc(e.id) + '" data-ev-group="' + esc(groupAttr) + '" data-ev-idx="' + idx + '">' + esc(e.label) + '</button>';
    }).join('');
    return '<div class="col-evidence"><span class="col-evidence-label">如何解决 · 已接入证据</span><div class="ev-chip-row">' + chips + '</div></div>';
  }

  /* 原声投诉静态列表：按权重从高到低自然排列，权重越高字号越大、颜色越醒目，
     左侧做轻微交错缩进，呈现"自然堆叠"的观感而非规整的表格 */
  function buildComplaintList(words, count) {
    var list = (words || []).slice(0, count || 10);
    if (!list.length) return '';
    var maxW = Math.max.apply(null, list.map(function (w) { return w.weight; }));
    var minW = Math.min.apply(null, list.map(function (w) { return w.weight; }));
    var indents = [0, 18, 6, 26, 2, 20, 10, 30, 4, 16];
    var lines = list.map(function (w, i) {
      var ratio = maxW === minW ? 1 : (w.weight - minW) / (maxW - minW);
      var fontSize = (13.5 + ratio * 6.5).toFixed(1);
      var hot = ratio > 0.55;
      var opacity = (0.55 + ratio * 0.45).toFixed(2);
      var indent = indents[i % indents.length];
      return '<p class="complaint-line' + (hot ? ' hot' : '') + '" style="font-size:' + fontSize + 'px;opacity:' + opacity + ';margin-left:' + indent + 'px;">' + esc(swap(w.text, names())) + '</p>';
    }).join('');
    return '<div class="complaint-list">' + lines + '</div>';
  }

  /* ═══════════════════════════════════════════════════════════
     总纲页（Page 2）— 唯一状态入口 setMasterStage
     ═══════════════════════════════════════════════════════════ */
  var mapAnimTimers = [];
  function clearMapAnimTimers() {
    mapAnimTimers.forEach(clearTimeout);
    mapAnimTimers = [];
  }

  function splitCopy(text) {
    var parts = String(text || '').split(' / ');
    return { line1: parts[0] || '', line2: parts[1] || '' };
  }

  function buildPlanetNode(side, title, texture) {
    return '<div class="planet-node ' + side + '" data-qa-id="planet-' + side + '">' +
      '<div class="planet-wrap">' +
        '<svg class="saturn-ring saturn-ring-back" viewBox="0 0 560 98" aria-hidden="true"><ellipse cx="280" cy="52" rx="248" ry="38"></ellipse></svg>' +
        '<div class="planet-sphere">' +
          (texture ? '<img class="planet-texture" src="' + esc(texture) + '" alt="">' : '') +
          '<span class="planet-core-title">' + esc(title) + '</span>' +
        '</div>' +
        '<svg class="saturn-ring saturn-ring-front" viewBox="0 0 560 98" aria-hidden="true"><ellipse cx="280" cy="52" rx="248" ry="38"></ellipse></svg>' +
        (side === 'right' ? '<div class="impact-ring" aria-hidden="true"></div>' : '') +
      '</div>' +
    '</div>';
  }

  /* 当前痛点：单条连续曲线，与 AI_ROUTE 关于中轴线（y=565 主干线）严格镜像对称，
     保证粗细、弧度、箭头细节与上方 AI 曲线完全呼应 */
  var AI_ROUTE = 'M 400 505 C 580 220, 1320 220, 1471 505';
  var PAIN_ROUTE = 'M 400 625 C 580 910, 1320 910, 1471 625';

  function buildMasterMapSvg() {
    return '<svg class="master-map-routes" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<defs>' +
        '<marker id="arrow-ai" viewBox="0 0 10 10" markerWidth="26" markerHeight="26" refX="2.4" refY="5" orient="auto" markerUnits="userSpaceOnUse">' +
          '<path d="M 0 0 L 9 5 L 0 10 L 2.4 5 Z" fill="#48D7FF"></path>' +
        '</marker>' +
        '<marker id="arrow-current" viewBox="0 0 10 10" markerWidth="26" markerHeight="26" refX="2.4" refY="5" orient="auto" markerUnits="userSpaceOnUse">' +
          '<path d="M 0 0 L 9 5 L 0 10 L 2.4 5 Z" fill="#FF7A45"></path>' +
        '</marker>' +
      '</defs>' +
      '<path class="route-spine" pathLength="1000" d="M 413 565 L 1471 565"></path>' +
      '<path class="route-ai" pathLength="1000" d="' + AI_ROUTE + '"></path>' +
      '<path class="route-current" pathLength="1000" d="' + PAIN_ROUTE + '"></path>' +
      '<line class="route-link ai-link" data-qa-id="ai-link-0" x1="720" y1="428" x2="720" y2="532"></line>' +
      '<line class="route-link ai-link" data-qa-id="ai-link-1" x1="960" y1="428" x2="960" y2="532"></line>' +
      '<line class="route-link ai-link" data-qa-id="ai-link-2" x1="1200" y1="428" x2="1200" y2="532"></line>' +
      '<line class="route-link pain-link" data-qa-id="pain-link-0" x1="720" y1="598" x2="720" y2="702"></line>' +
      '<line class="route-link pain-link" data-qa-id="pain-link-1" x1="960" y1="598" x2="960" y2="702"></line>' +
      '<line class="route-link pain-link" data-qa-id="pain-link-2" x1="1200" y1="598" x2="1200" y2="702"></line>' +
    '</svg>';
  }

  function buildMasterMap(opts) {
    opts = opts || {};
    var m = C().masterMap;
    var complete = opts.complete;
    var cls = 'mmap-v8' + (complete ? ' mmap-complete' : '') + (opts.compact ? ' mmap-compact' : '');

    var stageNodes = C().stages.map(function (s, i) {
      return '<div class="stage-node" data-col="' + i + '" data-qa-id="stage-' + i + '">' +
        '<span class="stage-num">' + esc(s.num) + '</span>' +
        '<span class="stage-name">' + esc(s.name) + '</span>' +
      '</div>';
    }).join('');

    var aiCopy = C().stages.map(function (s, i) {
      var c = splitCopy(s.aiPath);
      return '<div class="route-copy ai-copy" data-col="' + i + '" data-qa-id="ai-copy-' + i + '">' +
        '<span class="copy-line1">' + esc(c.line1) + '</span><span class="copy-line2">' + esc(c.line2) + '</span>' +
      '</div>';
    }).join('');

    var painCopy = C().stages.map(function (s, i) {
      var c = splitCopy(s.currentPain);
      return '<div class="route-copy pain-copy" data-col="' + i + '" data-qa-id="pain-copy-' + i + '">' +
        '<span class="copy-line1">' + esc(c.line1) + '</span><span class="copy-line2">' + esc(c.line2) + '</span>' +
      '</div>';
    }).join('');

    var particles = '<div class="particle manual"></div><div class="particle manual"></div><div class="particle manual"></div>' +
      '<div class="ai-comet ai-comet-core"></div>' +
      '<div class="ai-comet ai-comet-tail t1"></div>' +
      '<div class="ai-comet ai-comet-tail t2"></div>' +
      '<div class="ai-comet ai-comet-tail t3"></div>';

    var html = '<div class="' + cls + '" data-stage="' + (complete ? '5' : '0') + '">' +
      '<div class="master-map-canvas">' +
        (opts.compact ? '' : '<header class="mmap-hd" data-qa-id="page-title"><h1 class="spx-display">' + esc(m.title) + '</h1><p class="mmap-subtitle">' + esc(m.subtitle) + '</p></header>') +
        buildMasterMapSvg() +
        '<span class="route-label route-label-ai" data-qa-id="route-label-ai">AI方向</span>' +
        '<span class="route-label route-label-pain" data-qa-id="route-label-pain">当前痛点</span>' +
        aiCopy + painCopy +
        buildPlanetNode('left', m.leftTitle, m.leftTexture) +
        buildPlanetNode('right', m.rightTitle, m.rightTexture) +
        stageNodes +
        '<div class="mmap-particles">' + particles + '</div>' +
        (opts.compact ? '' : '<footer class="mmap-ft" data-qa-id="page-conclusion"><p>' + (C().corePropositionHtml || esc(C().coreProposition)) + '</p></footer>') +
      '</div>' +
    '</div>';
    /* 紧凑背景实例仅作装饰，不参与 QA 语义标识，避免与前景元素误判碰撞 */
    return opts.compact ? html.replace(/\sdata-qa-id="[^"]*"/g, '') : html;
  }

  /* 可见性矩阵：每个 stage 明确声明各组元素的强调等级，不叠加历史 class。
     Stage 4 是终态：彗星点亮右侧星球 与 底部核心结论 同一步出现，
     不再单独用一个"回落"的 stage 5 打断"压缩距离"的观感 */
  var MAP_VISIBILITY = {
    0: { planet: 'is-primary', stageNode: '', route: '', mapText: '' },
    1: { planet: 'is-secondary', stageNode: 'is-primary', route: '', mapText: '' },
    2: { planet: 'is-secondary', stageNode: 'is-secondary', route: 'pain', mapText: 'pain' },
    3: { planet: 'is-secondary', stageNode: 'is-secondary', route: 'ai', mapText: 'ai' },
    4: { planet: 'is-primary-right', stageNode: 'is-primary', route: 'ai', mapText: 'ai' }
  };

  function setMasterStage(map, stage) {
    stage = Math.max(0, Math.min(4, stage));
    var prevStage = +map.dataset.stage || 0;
    map.dataset.stage = String(stage);
    if (map.classList.contains('mmap-complete')) return;

    var v = MAP_VISIBILITY[stage];
    map.querySelectorAll('.planet-node').forEach(function (el) {
      el.classList.remove('is-primary', 'is-secondary');
      if (v.planet === 'is-primary-right') {
        el.classList.add(el.classList.contains('right') ? 'is-primary' : 'is-secondary');
      } else {
        el.classList.add(v.planet);
      }
    });
    map.querySelectorAll('.stage-node').forEach(function (el) {
      el.classList.remove('is-primary', 'is-secondary');
      if (v.stageNode) el.classList.add(v.stageNode);
    });

    if (prevStage !== stage) {
      clearMapAnimTimers();
      map.classList.remove('anim-pain', 'anim-ai');
      void map.offsetWidth;
      if (stage === 2) map.classList.add('anim-pain');
      if (stage === 4) map.classList.add('anim-ai');
    }
  }

  function replayMasterMap(map) {
    if (!map || map.classList.contains('mmap-complete')) return;
    clearMapAnimTimers();
    map.classList.remove('anim-pain', 'anim-ai');
    map.dataset.stage = '0';
    map.querySelectorAll('.planet-node, .stage-node').forEach(function (el) {
      el.classList.remove('is-primary', 'is-secondary');
    });
    void map.offsetWidth;
    mapAnimTimers.push(setTimeout(function () { setMasterStage(map, APP.beat); }, 60));
  }

  /* ═══════════════════════════════════════════════════════════
     Page 1 — 纯开场：标题 + 核心命题
     ═══════════════════════════════════════════════════════════ */
  /* 核心命题不在开场页重复出现——总纲页底部已有同样结论 */
  function buildOpening() {
    var p = C().pages[0];
    var titleHtml = esc(p.title).replace(/\n/g, '<br>');
    return '<div class="open-slide">' +
      '<h1 class="open-title" data-qa-id="page-title">' + titleHtml + '</h1>' +
      rv('<p class="open-subtitle">' + esc(p.subtitle) + '</p>', 1) +
    '</div>';
  }

  /* ═══════════════════════════════════════════════════════════
     Page 2 — 总纲页（Stage 0—5）
     ═══════════════════════════════════════════════════════════ */
  function buildMasterTotalMap() {
    return '<div class="slide-body">' + buildMasterMap({}) + '</div>';
  }

  /* 聚焦舞台：idle 居中灰字 → 逐模块聚焦展开（无页末 outro 回 idle 页） */
  function applyFocusStageBeat(root, opts) {
    var beat = opts.beat;
    var outro = opts.outroBeat != null && beat === opts.outroBeat;
    var grid = root.querySelector(opts.gridSel);
    if (grid) {
      grid.setAttribute('data-beat', String(beat));
      grid.classList.toggle('focus-stage-outro', outro);
    }
    root.querySelectorAll(opts.colSel).forEach(function (el, i) {
      el.classList.remove('is-idle', 'is-focused', 'is-dimmed', 'is-primary', 'is-secondary');
      if (beat === 0 || outro) el.classList.add('is-idle');
      else if (i === beat - 1) el.classList.add('is-focused');
      else if (i < beat - 1) el.classList.add('is-dimmed');
      else el.classList.add('is-idle');
    });
    if (opts.arrowSel) {
      root.querySelectorAll(opts.arrowSel).forEach(function (el) {
        el.classList.toggle('is-visible', beat > 0 && !outro);
      });
    }
    var conclusion = root.querySelector('[data-conclusion]');
    if (conclusion && opts.conclusionBeat != null) {
      conclusion.classList.toggle('is-dormant', beat < opts.conclusionBeat);
    }
  }

  /* ═══════════════════════════════════════════════════════════
     Page 3 — 舆情解析：三类信号来源，逐一聚焦
     ═══════════════════════════════════════════════════════════ */
  function buildParsePage() {
    var p = C().pages[2];
    return '<div class="slide-body">' +
      '<div class="slide-title-block" data-qa-id="page-title">' +
        '<h1 class="spx-display">' + esc(p.title) + '</h1>' +
        '<p class="spx-note">' + esc(p.subtitle) + '</p>' +
      '</div>' +
      '<div class="signal-grid focus-stage-grid" data-beat="0">' +
        p.sourceColumns.map(function (col, i) {
          var evList = (col.evidence || []).filter(function (e) { return asset(e.id); });
          var groupAttr = evList.map(function (e) { return e.id; }).join(',');
          var chips = evList.map(function (e, idx) {
            return '<button class="ev-chip" data-ev-id="' + esc(e.id) + '" data-ev-group="' + esc(groupAttr) + '" data-ev-idx="' + idx + '">' + esc(e.label) + '</button>';
          }).join('');
          return '<div class="signal-col is-idle" data-focus="' + i + '">' +
            '<div class="focus-col-inner">' +
              '<header class="focus-col-head"><h4 class="focus-col-title">' + esc(col.name) + '</h4></header>' +
              '<div class="focus-col-body">' +
                '<div class="signal-stream">' + col.items.slice(0, 3).map(function (it) { return '<p class="signal-item">' + esc(it) + '</p>'; }).join('') + '</div>' +
                (chips ? '<div class="signal-evidence"><span class="signal-evidence-label">如何解决 · 已接入证据</span><div class="ev-chip-row">' + chips + '</div></div>' : '') +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<p class="parse-conclusion is-dormant" data-conclusion data-qa-id="page-conclusion">' + esc(p.conclusion) + '</p>' +
    '</div>';
  }

  function applyParseBeat(root, beat) {
    applyFocusStageBeat(root, {
      beat: beat,
      gridSel: '.signal-grid',
      colSel: '.signal-col',
      conclusionBeat: 3
    });
  }

  /* ═══════════════════════════════════════════════════════════
     Page 4 — 舆情处置：左/左中/右中/右 四分栏渐进呈现
     原始投诉(球体词云) → 风险标签识别 → 舆情事件卡 → 预警触发
     ═══════════════════════════════════════════════════════════ */
  function buildHandlePage() {
    var p = C().pages[3];
    var cols = p.handleColumns || [];
    var evt = APP.demoEvent;
    var n = names();

    var col0Body = buildComplaintList(evt.complaintCloud || [], 10) +
      '<p class="handle-col-note">' + esc(evt.facts.sessionCount) + ' 段会话 · ' + esc(evt.facts.messageCount) + ' 条投诉持续涌入</p>' +
      evChips(cols[0] && cols[0].evidence);

    var col1Body = '<div class="risk-fields">' +
      '<div class="risk-field"><label>① 标签库匹配</label><span>T.' + esc(n.hostA) + ' / T.' + esc(n.hostB) + ' → 命中人设风险标签</span></div>' +
      '<div class="risk-field"><label>② 相似投诉聚合</label><span>' + esc(evt.facts.sessionCount) + ' 段会话 · ' + esc(evt.facts.messageCount) + ' 条投诉聚合为同一事件</span></div>' +
      '<div class="risk-field"><label>③ 智能标签生成</label><span>' + evt.aiInsights.riskTags.slice(0, 3).join(' · ') + '</span></div>' +
      '<div class="risk-field"><label>④ 结构性研判</label><span>' + esc(evt.priority) + ' · 建议角色 ' + evt.suggestedRoles.slice(0, 2).join('/') + '</span></div>' +
    '</div>' + evChips(cols[1] && cols[1].evidence);

    var dims = evt.cardDimensions || {};
    var stageTrack = (dims.stageTrack || []).map(function (s, i) {
      return '<span class="dims-stage' + (i === dims.currentStageIndex ? ' is-current' : '') + '">' + esc(s) + '</span>';
    }).join('<i class="dims-arrow">›</i>');
    var col2Body = '<div class="event-dims-card">' +
      '<div class="dims-top"><span class="mono">' + esc(evt.id) + '</span><span class="dims-priority">' + esc(evt.priority) + '</span></div>' +
      '<h3>' + esc(swap(evt.name, n)) + '</h3>' +
      '<div class="dims-stage-track">' + stageTrack + '</div>' +
      '<div class="dims-score"><span class="dims-score-label">风险评分</span><span class="dims-score-value">' + esc(dims.riskScore) + '</span><span class="dims-score-tag">' + esc(dims.riskScoreLevel) + '</span></div>' +
      '<div class="dims-grid">' +
        '<div><label>归属厅 · 部门</label><span>' + esc(swap(dims.org, n)) + ' · ' + esc(swap(dims.department, n)) + '</span></div>' +
        '<div><label>涉及主体</label><span>' + evt.facts.mainSubjects.map(function (s) { return esc(swap(s, n)); }).join(' · ') + '</span></div>' +
        '<div class="dims-span2"><label>类目 · 场景</label><span>' + esc(dims.category) + ' → ' + esc(dims.categoryScene) + '</span></div>' +
        '<div><label>影响范围</label><span>' + (dims.impactScope || []).join(' · ') + '</span></div>' +
        '<div><label>当前阶段</label><span>' + esc(dims.claimStage) + '</span></div>' +
        '<div class="dims-span2"><label>下一步行动</label><span>' + esc(dims.nextActionShort) + '</span></div>' +
      '</div>' +
    '</div>' + evChips(cols[2] && cols[2].evidence);

    var col3Body = '<div class="alert-stack">' +
      '<div class="alert-box" data-box="normal"><h4>数量型预警</h4><p>普通事件累计到第 ' + APP.demoMessages.quantityThreshold + ' 条后触发，适合常规升温监测。</p></div>' +
      '<div class="alert-box hot" data-box="hot"><h4>性质型预警</h4><p>' + esc(isRoadshowMode() ? '医疗高敏、隐私争议等高敏词，第一条即触发介入。' : 'ICU、昏迷、药物中毒等高敏词，第一条即触发介入。') + '</p></div>' +
    '</div>' + evChips(cols[3] && cols[3].evidence);

    var bodies = [col0Body, col1Body, col2Body, col3Body];

    return '<div class="slide-body">' +
      '<div class="slide-title-block" data-qa-id="page-title">' +
        '<h1 class="spx-display">' + esc(p.title) + '</h1>' +
        '<p class="spx-note">' + esc(p.subtitle) + '</p>' +
      '</div>' +
      '<div class="handle-grid focus-stage-grid" data-beat="0">' +
        cols.map(function (col, i) {
          return (i > 0 ? '<div class="handle-arrow" aria-hidden="true">→</div>' : '') +
            '<div class="handle-col is-idle" data-focus="' + i + '">' +
              '<div class="focus-col-inner">' +
                '<header class="focus-col-head">' +
                  '<h4 class="focus-col-title">' +
                    '<span class="handle-kicker">' + esc(col.kicker) + '</span>' +
                    '<span class="handle-name">' + esc(col.name) + '</span>' +
                  '</h4>' +
                '</header>' +
                '<div class="focus-col-body handle-col-body">' + bodies[i] + '</div>' +
              '</div>' +
            '</div>';
        }).join('') +
      '</div>' +
      '<p class="handle-conclusion is-dormant" data-conclusion data-qa-id="page-conclusion">' + esc(p.conclusion) + '</p>' +
    '</div>';
  }

  function applyHandleBeat(root, beat) {
    applyFocusStageBeat(root, {
      beat: beat,
      gridSel: '.handle-grid',
      colSel: '.handle-col',
      arrowSel: '.handle-arrow',
      conclusionBeat: 4
    });
  }

  /* ═══════════════════════════════════════════════════════════
     Page 5 — 舆情回溯：开场即给出「复盘沉淀」证据（月报 + 态势复盘图）→
     闭环流程收起的同一步，结论与 3D 场景库同时呈现（终态，无额外结尾页）
     ═══════════════════════════════════════════════════════════ */
  function buildLoopPage() {
    var p = C().pages[4];
    var sc = APP.config.sphere.currentScene;
    var steps = [
      { t: '风险沉淀', d: '事件进入月报与场景库，成为组织可调用资产。' },
      { t: '根因纠正', d: '追问为什么发生，落实整改责任人与时限。' },
      { t: '复发预警', d: '同类特征再次出现时，提前命中历史场景。' }
    ];
    var topEv = EVIDENCE.loop.map(function (id, idx) {
      var a = asset(id);
      if (!a) return '';
      return '<button class="ev-chip" data-ev-id="' + esc(id) + '" data-ev-group="' + EVIDENCE.loop.join(',') + '" data-ev-idx="' + idx + '">' + esc(a.title) + '</button>';
    }).join('');
    return '<div class="slide-body">' +
      '<div class="slide-title-block" data-qa-id="page-title">' +
        '<h1 class="spx-display">' + esc(p.title) + '</h1>' +
        '<p class="spx-note">' + esc(p.subtitle) + '</p>' +
      '</div>' +
      '<div class="loop-stage">' +
        '<div class="loop-flow" data-loop-flow>' +
          '<div class="loop-steps">' + steps.map(function (s) {
            return '<div class="loop-step"><h4>' + esc(s.t) + '</h4><p>' + esc(s.d) + '</p></div>';
          }).join('') + '</div>' +
          '<div class="loop-evidence-top"><span class="loop-evidence-label">如何复盘沉淀 · 已接入证据</span><div class="ev-chip-row">' + topEv + '</div></div>' +
        '</div>' +
        '<div class="sphere-panel" data-sphere-panel>' +
          '<div class="sphere-box" id="sphere-box"><img class="sphere-fb" src="' + esc(APP.config.sphere.fallbackImage) + '" alt="风险知识宇宙截图"></div>' +
          '<div class="scene-card"><span class="mono">' + esc(sc.code) + '</span><h3>' + esc(sc.name) + '</h3><p>类目 ' + esc(sc.category) + ' · ' + esc(sc.alertLevel) + '</p>' +
            '<a class="ev-link" href="' + esc(APP.config.sphere.url) + '" target="_blank" rel="noopener"><span>Evidence</span>204场景3D场景库演示</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="loop-conclusion is-dormant" data-conclusion data-qa-id="page-conclusion"><p>' + esc(p.conclusion) + '</p>' +
        '<a class="ev-link" href="' + esc(APP.config.opsSystemUrl) + '" target="_blank" rel="noopener"><span>Evidence</span>' + esc(APP.config.opsSystemLabel || '舆情系统实时环境') + '</a>' +
      '</div>' +
    '</div>';
  }

  var SPHERE_EMBED_W = 1440;
  var SPHERE_EMBED_H = 900;

  function fitSphereBox() {
    var box = $('sphere-box');
    if (!box) return;
    var iframe = box.querySelector('iframe');
    var fb = box.querySelector('.sphere-fb');
    var bw = box.clientWidth;
    var bh = box.clientHeight;
    if (bw < 4 || bh < 4) return;
    if (iframe) {
      var s = Math.min(bw / SPHERE_EMBED_W, bh / SPHERE_EMBED_H);
      var x = Math.round((bw - SPHERE_EMBED_W * s) / 2);
      var y = Math.round((bh - SPHERE_EMBED_H * s) / 2);
      iframe.style.position = 'absolute';
      iframe.style.left = x + 'px';
      iframe.style.top = y + 'px';
      iframe.style.width = SPHERE_EMBED_W + 'px';
      iframe.style.height = SPHERE_EMBED_H + 'px';
      iframe.style.transform = 'scale(' + s + ')';
      iframe.style.transformOrigin = 'top left';
      iframe.style.border = '0';
      iframe.style.pointerEvents = 'auto';
    }
    if (fb) {
      fb.style.position = 'absolute';
      fb.style.inset = '0';
      fb.style.width = '100%';
      fb.style.height = '100%';
      fb.style.objectFit = 'contain';
      fb.style.objectPosition = 'center center';
      fb.style.border = '0';
    }
  }

  function applyLoopBeat(root, beat) {
    var flow = root.querySelector('[data-loop-flow]');
    var sphere = root.querySelector('[data-sphere-panel]');
    if (flow) flow.classList.toggle('is-collapsed', beat >= 1);
    if (sphere) sphere.classList.toggle('is-on', beat >= 1);
    var conclusion = root.querySelector('[data-conclusion]');
    if (conclusion) conclusion.classList.toggle('is-dormant', beat < 1);
    if (beat >= 1) {
      initSphere();
      requestAnimationFrame(function () {
        fitSphereBox();
        requestAnimationFrame(fitSphereBox);
      });
      setTimeout(fitSphereBox, 150);
    } else destroySphere();
    stabilizeLayout();
  }

  function initSphere() {
    var box = $('sphere-box');
    if (!box || box.dataset.ok) return;
    box.dataset.ok = '1';
    mountSphereIframe(box);
    setTimeout(function () {
      if (!navigator.onLine) {
        box.classList.add('fallback');
        box.classList.remove('is-loading');
        fitSphereBox();
      }
    }, APP.config.sphere.loadTimeoutMs || 8000);
  }

  /* ═══════════════════════════════════════════════════════════
     Page 6 — 统一行动：总纲原图不淡化作为实景背景（隐藏痛点/AI方向标签），
     核心文案居中落在两颗星球之间的空白处，4 个复制方向上移不压导航/星球
     ═══════════════════════════════════════════════════════════ */
  function buildClosingPage() {
    return '<div class="slide-body">' +
      buildMasterMap({ complete: true, compact: true }) +
      '<div class="closing-centerpiece" data-qa-id="page-title">' +
        '<h1 class="spx-display">一条已跑通的路径<br>可复制到更多岗位</h1>' +
      '</div>' +
      rv('<div class="replicate-grid" data-qa-id="replicate-grid">' + C().replication.map(function (r) {
        return '<div><b>' + esc(r.role) + '</b><p>' + esc(r.desc) + '</p>' +
          (r.note ? '<p class="replicate-note"><span class="replicate-note-tag">愿景</span>' + esc(r.note) + '</p>' : '') +
        '</div>';
      }).join('') + '</div>', 1) +
      rv('<div class="final-words" data-qa-id="page-conclusion">' +
        C().closing.copyLines.map(function (l, i) {
          return '<p' + (i === 2 ? ' class="final-emphasis"' : '') + '>' + esc(l) + '</p>';
        }).join('') +
      '</div>', 2) +
    '</div>';
  }

  function buildClosingPageRoadshow() {
    return '<div class="slide-body">' +
      buildMasterMap({ complete: true, compact: true }) +
      '<div class="closing-centerpiece" data-qa-id="page-title">' +
        '<h1 class="spx-display">三个组织结果</h1>' +
        '<p class="spx-note">同一件事 · 同一套行动 · 同一种可复用经验</p>' +
      '</div>' +
      rv('<div class="final-words roadshow-close" data-qa-id="page-conclusion">' +
        C().closing.copyLines.map(function (l, i) {
          return '<p' + (i === 2 ? ' class="final-emphasis"' : '') + '>' + esc(l) + '</p>';
        }).join('') +
        '<p class="roadshow-handoff">下一章：各岗位如何接入 →</p></div>', 1) +
    '</div>';
  }

  function roleCard(r) {
    if (!r) return '';
    return '<div class="role-card"><b>' + esc(r.role) + '</b><p>' + esc(r.desc) + '</p>' +
      (r.note ? '<p class="role-note">' + esc(r.note) + '</p>' : '') + '</div>';
  }

  function buildRolesPage() {
    var p = C().pages[6] || { title: '各岗位如何接入', subtitle: '' };
    var roles = C().replication || [];
    return '<div class="slide-body roles-slide">' +
      '<div class="slide-title-block" data-qa-id="page-title">' +
        '<h1 class="spx-display">' + esc(p.title) + '</h1>' +
        '<p class="spx-note">' + esc(p.subtitle) + '</p>' +
      '</div>' +
      rv('<div class="roles-grid">' + roles.slice(0, 2).map(roleCard).join('') + '</div>', 0) +
      rv('<div class="roles-grid">' + roles.slice(2, 4).map(roleCard).join('') + '</div>', 1) +
      rv('<div class="roles-grid roles-grid-final">' + roleCard(roles[4]) +
        '<div class="roles-outro"><p>已跑通能力可复用 · 接口可按岗位扩展</p>' +
        '<p class="final-emphasis">AI 重构的是从发现信号到统一行动的工作范式</p></div></div>', 2) +
    '</div>';
  }

  function applyRolesBeat(root, beat) {
    root.querySelectorAll('.roles-slide .reveal').forEach(function (el) {
      var step = +(el.dataset.step || 0);
      el.classList.toggle('is-primary', step <= beat);
    });
  }

  var BASE_PAGES = [
    { beats: 2, build: buildOpening },
    { beats: 5, build: buildMasterTotalMap },
    { beats: 4, build: buildParsePage, evidence: parseEvidenceIds, apply: applyParseBeat },
    { beats: 5, build: buildHandlePage, evidence: handleEvidenceIds, apply: applyHandleBeat },
    { beats: 2, build: buildLoopPage, evidence: EVIDENCE.loop, apply: applyLoopBeat },
    { beats: 3, build: buildClosingPage }
  ];

  var PAGES = BASE_PAGES.slice();

  function initRoadshowPages() {
    if (!isRoadshowMode()) return;
    PAGES = BASE_PAGES.slice();
    PAGES[5] = { beats: 2, build: buildClosingPageRoadshow };
    PAGES.push({ beats: 3, build: buildRolesPage, apply: applyRolesBeat });
  }

  function fmtClock(sec) {
    var neg = sec < 0;
    sec = Math.abs(Math.floor(sec));
    return (neg ? '-' : '') + String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
  }

  function updateDeckClock() {
    var clock = $('clock');
    if (!clock || APP.isPreview) return;
    var remain = APP.targetSec - Math.floor((Date.now() - APP.startTime) / 1000);
    clock.textContent = fmtClock(remain);
    clock.classList.toggle('warn', remain <= 60 && remain >= 0);
    clock.classList.toggle('over', remain < 0);
  }

  function initDeckChrome() {
    var brand = $('brand-title');
    if (brand) {
      brand.textContent = C().projectTitle || APP.config.projectTitle || '用AI重构舆情工作范式';
    }
    APP.targetSec = APP.config.targetTotalSec || 600;
    updateDeckClock();
  }

  function buildChapterNav() {
    $('chapter-nav').innerHTML = '<div class="cn-track">' + C().pages.map(function (p, i) {
      return '<div class="cn-seg" data-ch="' + i + '"><span class="cn-label">' + esc(p.tag) + '</span><span class="cn-beat-bar"></span></div>';
    }).join('') + '</div>';
    $('chapter-nav').querySelectorAll('.cn-seg').forEach(function (el) {
      el.onclick = function () { goChapter(+el.dataset.ch, 0); };
    });
  }

  function updateNav() {
    var pg = PAGES[APP.chapter];
    $('chapter-nav').querySelectorAll('.cn-seg').forEach(function (el, i) {
      el.classList.toggle('active', i === APP.chapter);
      el.classList.toggle('done', i < APP.chapter);
      var pct = 0;
      if (i === APP.chapter) pct = ((APP.beat + 1) / pg.beats * 100);
      else if (i < APP.chapter) pct = 100;
      el.style.setProperty('--beat-pct', pct + '%');
    });
    var total = 0, done = 0;
    PAGES.forEach(function (p, i) {
      total += p.beats;
      if (i < APP.chapter) done += p.beats;
      else if (i === APP.chapter) done += APP.beat + 1;
    });
    $('progress-fill').style.width = (done / total * 100) + '%';
    if (!APP.isPreview) broadcastPresenterState();
  }

  function applyBeat(root, beat) {
    root.dataset.beat = beat;
    root.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.toggle('is-on', +el.dataset.step <= beat);
    });
    var map = root.querySelector('.mmap-v8');
    if (map) setMasterStage(map, beat);
    var pg = PAGES[APP.chapter];
    if (pg.apply) pg.apply(root, beat);
    markLiveEvidence(root, beat);
    document.body.classList.toggle('on-master-map', APP.chapter === 1);
  }

  /* Evidence 引导高亮：进度聚焦到含 Evidence 的内容时，按钮加光晕闪烁提示可点击；
     进入下一进度时旧的自动清除，只强调"当前该看"的证据 */
  function markLiveEvidence(root, beat) {
    root.querySelectorAll('.ev-live').forEach(function (el) { el.classList.remove('ev-live'); });
    var sel = [
      '.signal-col.is-focused',
      '.handle-col.is-focused',
      '.reveal.is-on[data-step="' + beat + '"]',
      '[data-conclusion]:not(.is-dormant)',
      '[data-loop-flow]:not(.is-collapsed)',
      '[data-sphere-panel].is-on'
    ].join(',');
    root.querySelectorAll(sel).forEach(function (box) {
      box.querySelectorAll('.ev-chip, .ev-btn, .ev-link').forEach(function (b) {
        b.classList.add('ev-live');
      });
    });
  }

  function bindEvButtons(root) {
    root.querySelectorAll('.ev-btn[data-ev-id]').forEach(function (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        openLightbox([btn.dataset.evId], 0);
      };
    });
    root.querySelectorAll('.ev-chip[data-ev-id]').forEach(function (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        var group = btn.dataset.evGroup ? btn.dataset.evGroup.split(',') : [btn.dataset.evId];
        openLightbox(group, +btn.dataset.evIdx || 0);
      };
    });
  }

  function render() {
    if (APP.busy) return;
    APP.busy = true;
    clearMapAnimTimers();
    if (APP.chapter !== 4) destroySphere();
    var canvas = $('slide-canvas');
    if (APP.lastChapter !== APP.chapter) {
      var dir = 0;
      if (!APP.isPreview) {
        if (APP.prevChapter === 0 && APP.chapter === 1) dir = 1;
        else if (APP.prevChapter === 1 && APP.chapter === 0) dir = -1;
      }
      APP.prevChapter = -1;
      if (dir) {
        slideChapter(canvas, dir);
        APP.lastChapter = APP.chapter;
        updateNav();
        return;
      }
      if (APP.isPreview) {
        canvas.classList.remove('fading');
        canvas.innerHTML = PAGES[APP.chapter].build();
        bindEvButtons(canvas);
        applyBeat(canvas, APP.beat);
        resetViewport();
        stabilizeLayout();
        preloadChapter(APP.chapter);
        APP.lastChapter = APP.chapter;
        APP.busy = false;
        updateNav();
        pumpNavQueue();
        return;
      }
      canvas.classList.add('fading');
      setTimeout(function () {
        canvas.innerHTML = PAGES[APP.chapter].build();
        bindEvButtons(canvas);
        applyBeat(canvas, APP.beat);
        canvas.classList.remove('fading');
        resetViewport();
        stabilizeLayout();
        preloadChapter(APP.chapter);
        APP.busy = false;
        updateNav();
        pumpNavQueue();
      }, APP.lastChapter < 0 ? 0 : 160);
      APP.lastChapter = APP.chapter;
    } else {
      applyBeat(canvas, APP.beat);
      stabilizeLayout();
      APP.busy = false;
      updateNav();
      pumpNavQueue();
    }
  }

  /* 总结构 ⇄ 总纲 链路式转场：旧内容整体左移退出，同时新内容自右滑入，
     用快照层承载旧画面，双层同轨移动，呈现"沿链路推进"的观感 */
  var SLIDE_MS = 620;
  function slideChapter(canvas, dir) {
    if (APP.isPreview) {
      canvas.classList.remove('fading');
      canvas.style.transition = 'none';
      canvas.style.transform = '';
      canvas.innerHTML = PAGES[APP.chapter].build();
      bindEvButtons(canvas);
      applyBeat(canvas, APP.beat);
      resetViewport();
      stabilizeLayout();
      preloadChapter(APP.chapter);
      APP.busy = false;
      pumpNavQueue();
      return;
    }
    var slide = canvas.parentNode;
    var ghost = document.createElement('div');
    ghost.className = 'canvas-ghost';
    ghost.innerHTML = canvas.innerHTML;
    slide.appendChild(ghost);
    canvas.classList.remove('fading');
    canvas.style.transition = 'none';
    canvas.style.transform = 'translateX(' + (dir > 0 ? 100 : -100) + '%)';
    canvas.innerHTML = PAGES[APP.chapter].build();
    bindEvButtons(canvas);
    applyBeat(canvas, APP.beat);
    resetViewport();
    stabilizeLayout();
    preloadChapter(APP.chapter);
    void canvas.offsetWidth;
    canvas.style.transition = 'transform ' + SLIDE_MS + 'ms cubic-bezier(0.66, 0, 0.22, 1)';
    canvas.style.transform = 'translateX(0)';
    ghost.style.transform = 'translateX(' + (dir > 0 ? -100 : 100) + '%)';
    setTimeout(function () {
      ghost.remove();
      canvas.style.transition = '';
      canvas.style.transform = '';
      resetViewport();
      APP.busy = false;
      pumpNavQueue();
    }, SLIDE_MS + 60);
  }

  /* 快速连按：积压导航增量，busy 结束后继续消化，避免丢键 */
  var navDelta = 0;
  var navPumpId = null;

  function pumpNavQueue() {
    if (navPumpId) return;
    navPumpId = setTimeout(function () {
      navPumpId = null;
      if (APP.busy) {
        pumpNavQueue();
        return;
      }
      if (APP._pendingGo) {
        var pg = APP._pendingGo;
        APP._pendingGo = null;
        navDelta = 0;
        goChapter(pg.chapter, pg.beat);
        return;
      }
      if (!navDelta) return;
      if (navDelta > 0) {
        navDelta--;
        advanceOnce();
      } else {
        navDelta++;
        retreatOnce();
      }
      if (navDelta || APP._pendingGo) pumpNavQueue();
    }, APP.busy ? 36 : 0);
  }

  function advanceOnce() {
    var pg = PAGES[APP.chapter];
    if (APP.beat < pg.beats - 1) {
      APP.beat++;
      render();
    } else if (APP.chapter < PAGES.length - 1) {
      goChapter(APP.chapter + 1, 0);
    }
  }

  function retreatOnce() {
    if (APP.beat > 0) {
      APP.beat--;
      render();
    } else if (APP.chapter > 0) {
      goChapter(APP.chapter - 1, PAGES[APP.chapter - 1].beats - 1);
    }
  }

  /* 唯一缩放计算：绝对定位 + translateX(-50%) + translateY + scale，避免 flex 子项撑出内部滚动 */
  function scale() {
    var viewport = $('scene-viewport');
    var stage = $('scene-stage');
    if (!viewport || !stage) return;
    resetViewport();
    var s = Math.min(viewport.clientWidth / 1920, viewport.clientHeight / 1080);
    var gapY = Math.max(0, (viewport.clientHeight - 1080 * s) / 2);
    stage.style.transform = 'translateX(-50%) translateY(' + gapY.toFixed(2) + 'px) scale(' + s.toFixed(4) + ')';
  }

  function stabilizeLayout() {
    scale();
    if (APP.chapter === 4) fitSphereBox();
    requestAnimationFrame(function () {
      resetViewport();
      scale();
      if (APP.chapter === 4) fitSphereBox();
    });
  }

  function goChapter(ch, beat) {
    if (APP.busy) {
      navDelta = 0;
      APP._pendingGo = {
        chapter: Math.max(0, Math.min(PAGES.length - 1, ch)),
        beat: beat || 0
      };
      pumpNavQueue();
      return;
    }
    var prev = APP.chapter;
    APP.chapter = Math.max(0, Math.min(PAGES.length - 1, ch));
    APP.beat = beat || 0;
    if (APP.lastChapter !== APP.chapter) {
      APP.prevChapter = prev;
      APP.lastChapter = -1;
    }
    render();
  }

  function advance() {
    navDelta++;
    pumpNavQueue();
  }

  function retreat() {
    navDelta--;
    pumpNavQueue();
  }

  function resetViewport() {
    window.scrollTo(0, 0);
    var vp = $('scene-viewport');
    if (vp) {
      vp.scrollTop = 0;
      vp.scrollLeft = 0;
    }
  }

  function bindViewportLock() {
    var vp = $('scene-viewport');
    if (!vp || vp.dataset.lock) return;
    vp.dataset.lock = '1';
    vp.addEventListener('scroll', function () {
      if (vp.scrollTop !== 0 || vp.scrollLeft !== 0) resetViewport();
    }, { passive: true });
  }

  /* 预加载：星球纹理 + 当前页 Evidence 图片，减少外部预览时的等待 */
  var preloaded = {};
  function preloadUrl(url) {
    if (!url || preloaded[url]) return;
    preloaded[url] = true;
    var img = new Image();
    img.decoding = 'async';
    img.src = url;
  }
  function preloadChapter(ch) {
    var pg = PAGES[ch];
    if (!pg) return;
    if (ch === 1 || ch === 5) {
      preloadUrl(C().masterMap.leftTexture);
      preloadUrl(C().masterMap.rightTexture);
    }
    var evSpec = pg.evidence;
    var ids = typeof evSpec === 'function' ? evSpec() : evSpec;
    (ids || []).forEach(function (id) {
      var a = asset(id);
      if (a) preloadUrl(a.path);
    });
  }

  function mountSphereIframe(box) {
    if (!box || box.querySelector('iframe')) return;
    box.classList.add('is-loading');
    var iframe = document.createElement('iframe');
    iframe.src = APP.config.sphere.url;
    iframe.title = '风险场景库';
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('tabindex', '-1');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    iframe.onload = function () {
      box.classList.remove('is-loading');
      fitSphereBox();
      stabilizeLayout();
    };
    iframe.onerror = function () { box.classList.add('fallback'); box.classList.remove('is-loading'); };
    box.insertBefore(iframe, box.firstChild);
  }

  function destroySphere() {
    var box = $('sphere-box');
    if (!box) return;
    var iframe = box.querySelector('iframe');
    if (iframe) iframe.remove();
    box.classList.remove('is-loading', 'fallback');
    delete box.dataset.ok;
  }

  function openLightbox(ids, idx) {
    APP.lbImages = ids.map(asset).filter(Boolean);
    if (!APP.lbImages.length) return;
    APP.lbIdx = idx || 0;
    APP.lbOpen = true;
    APP.lbImages.forEach(function (a) { preloadUrl(a.path); });
    syncLightbox();
    $('lightbox').classList.add('open');
  }
  function syncLightbox() {
    var a = APP.lbImages[APP.lbIdx];
    if (!a) return;
    var lb = $('lightbox');
    var img = $('lb-img');
    lb.classList.add('is-loading');
    img.classList.add('is-loading');
    img.onload = function () {
      lb.classList.remove('is-loading');
      img.classList.remove('is-loading');
    };
    img.onerror = function () {
      lb.classList.remove('is-loading');
      img.classList.remove('is-loading');
    };
    img.src = a.path;
    img.alt = swap(a.title, names());
    $('lb-cap').textContent = swap(a.title, names()) + ' - ' + swap(a.description, names());
    var src = $('lb-source');
    if (src) {
      if (a.sourceUrl && !isRoadshowMode()) {
        src.href = a.sourceUrl;
        src.textContent = (a.sourceLabel || '打开来源网站') + ' ↗';
        src.classList.add('has-link');
        src.hidden = false;
      } else {
        src.removeAttribute('href');
        src.classList.remove('has-link');
        src.hidden = isRoadshowMode();
      }
    }
    var next = APP.lbImages[(APP.lbIdx + 1) % APP.lbImages.length];
    if (next) preloadUrl(next.path);
  }
  function closeLightbox() {
    APP.lbOpen = false;
    $('lightbox').classList.remove('open');
  }
  function moveLightbox(dir) {
    if (!APP.lbImages.length) return;
    APP.lbIdx = (APP.lbIdx + dir + APP.lbImages.length) % APP.lbImages.length;
    syncLightbox();
  }

  function bindKeys() {
    if (APP.isPreview) return;
    document.addEventListener('keydown', function (e) {
      if (APP.lbOpen) {
        if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); return; }
        if (e.key === 'ArrowLeft') { e.preventDefault(); moveLightbox(-1); return; }
        if (e.key === 'ArrowRight') { e.preventDefault(); moveLightbox(1); return; }
      }
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          advance();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          retreat();
          break;
        case 'e':
        case 'E':
          var evSpec = PAGES[APP.chapter].evidence;
          var evList = typeof evSpec === 'function' ? evSpec() : evSpec;
          if (evList && evList.length) {
            e.preventDefault();
            openLightbox(evList, 0);
          }
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
          break;
        case 'r':
        case 'R':
          if (APP.chapter === 1) {
            e.preventDefault();
            replayMasterMap($('slide-canvas').querySelector('.mmap-v8'));
          }
          break;
        case 'd':
        case 'D':
          e.preventDefault();
          document.body.classList.toggle('qa-debug');
          break;
        case 's':
        case 'S':
          e.preventDefault();
          openPresenterWindow();
          break;
        case 'l':
        case 'L':
          if (APP.lbOpen) break;
          e.preventDefault();
          toggleProjectionMode();
          break;
        default:
          if (e.key >= '1' && e.key <= (isRoadshowMode() ? '7' : '6')) {
            e.preventDefault();
            goChapter(+e.key - 1, 0);
          }
      }
    });
    $('lb-close').onclick = closeLightbox;
    $('lb-prev').onclick = function () { moveLightbox(-1); };
    $('lb-next').onclick = function () { moveLightbox(1); };
  }

  function bindChrome() {
    var header = $('deck-header');
    var hideTimer = null;
    function show() {
      header.classList.add('chrome-active');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () { header.classList.remove('chrome-active'); }, 2200);
    }
    document.addEventListener('mousemove', show);
    show();
  }

  function init() {
    initProjectionMode();
    initPresenterMode();
    initData();
    initDeckChrome();
    buildChapterNav();
    if (!APP.isPreview) {
      bindChrome();
      bindKeys();
      bindViewportLock();
      bindPresenterChannel();
    } else {
      bindPreviewChannel();
    }
    preloadUrl(C().masterMap.leftTexture);
    preloadUrl(C().masterMap.rightTexture);
    if (!APP.isPreview) {
      setInterval(updateDeckClock, 1000);
    }
    if (APP.isPreview) {
      goChapter(APP.chapter, APP.beat);
    } else {
      render();
    }
    window.addEventListener('resize', stabilizeLayout);
    if (!APP.isPreview) broadcastPresenterState();
  }

  /* ═══ 投屏增权：黑底不变，?led=1 / L 键，不改布局字号 ═══ */
  function initProjectionMode() {
    var q = new URLSearchParams(window.location.search);
    var on = q.get('led') === '1' || q.get('led') === 'true';
    if (q.get('led') === '0' || q.get('led') === 'false') on = false;
    if (on) document.body.classList.add('projection-mode');
    APP.projectionMode = on;
  }

  function toggleProjectionMode() {
    APP.projectionMode = !APP.projectionMode;
    document.body.classList.toggle('projection-mode', APP.projectionMode);
    stabilizeLayout();
  }

  /* ═══ 讲者双屏：preview iframe + BroadcastChannel（不改变投屏默认行为） ═══ */
  var PRESENTER_CH = 'ai-final-presentation-v1';
  var PRESENTER_ACTION_KEY = 'ai-final-presentation-audience-action';
  var presenterChannel = null;
  var presenterWin = null;

  function initPresenterMode() {
    var q = new URLSearchParams(window.location.search);
    APP.isPreview = q.get('preview') === '1';
    try { presenterChannel = new BroadcastChannel(PRESENTER_CH); } catch (err) { presenterChannel = null; }
    if (APP.isPreview) {
      document.body.classList.add('preview-mode');
      APP.chapter = Math.max(0, Math.min(PAGES.length - 1, +(q.get('ch') || 0)));
      APP.beat = Math.max(0, +(q.get('beat') || 0));
      APP.busy = false;
      APP.lastChapter = -1;
      return;
    }
  }

  function openPresenterWindow() {
    if (presenterWin && !presenterWin.closed) {
      presenterWin.focus();
      broadcastPresenterState();
      return;
    }
    presenterWin = window.open('presenter.html', 'ai-final-presenter', 'width=1280,height=800');
    setTimeout(broadcastPresenterState, 600);
  }

  function broadcastPresenterState() {
    if (APP.isPreview || !presenterChannel) return;
    if (APP.chapter !== APP._lastBroadcastCh) {
      APP.pageStartTime = Date.now();
      APP._lastBroadcastCh = APP.chapter;
    }
    presenterChannel.postMessage({
      type: 'state',
      chapter: APP.chapter,
      beat: APP.beat,
      startTime: APP.startTime,
      pageStartTime: APP.pageStartTime || APP.startTime
    });
  }

  function bindPresenterChannel() {
    if (!presenterChannel) return;
    APP.pageStartTime = APP.startTime;
    APP._lastBroadcastCh = APP.chapter;
    bindPresenterStorageActions();
    presenterChannel.onmessage = function (ev) {
      var msg = ev.data;
      if (!msg) return;
      switch (msg.type) {
        case 'advance': advance(); break;
        case 'retreat': retreat(); break;
        case 'go':
          goChapter(msg.chapter || 0, msg.beat || 0);
          break;
        case 'open-evidence':
          if (msg.ids && msg.ids.length) openLightbox(msg.ids, msg.idx || 0);
          break;
        case 'close-evidence':
          APP.lbOpen = false;
          if ($('lightbox')) $('lightbox').classList.remove('open');
          break;
        case 'move-evidence':
          moveLightbox(msg.dir || 1);
          break;
        case 'request-sync':
        case 'request-state':
          broadcastPresenterState();
          break;
        case 'reset-timer':
          APP.startTime = Date.now();
          APP.pageStartTime = Date.now();
          updateDeckClock();
          broadcastPresenterState();
          break;
      }
    };
  }

  function bindPresenterStorageActions() {
    if (APP._storageBridgeBound) return;
    APP._storageBridgeBound = true;
    function runAction(raw) {
      try {
        var msg = JSON.parse(raw);
        if (!msg || !msg.action) return;
        if (APP._lastPresenterActionAt === msg.at) return;
        APP._lastPresenterActionAt = msg.at;
        if (msg.action === 'close-evidence') {
          APP.lbOpen = false;
          if ($('lightbox')) $('lightbox').classList.remove('open');
          return;
        }
        if (msg.action === 'move-evidence') {
          moveLightbox(msg.payload && msg.payload.dir ? msg.payload.dir : 1);
        }
      } catch (err) {}
    }
    window.addEventListener('storage', function (e) {
      if (e.key !== PRESENTER_ACTION_KEY || !e.newValue) return;
      runAction(e.newValue);
    });
    setInterval(function () {
      try {
        var raw = localStorage.getItem(PRESENTER_ACTION_KEY);
        if (raw) runAction(raw);
      } catch (err) {}
    }, 300);
  }

  function previewGoto(ch, beat) {
    if (!APP.isPreview) return;
    APP.chapter = Math.max(0, Math.min(PAGES.length - 1, ch));
    APP.beat = Math.max(0, Math.min(PAGES[APP.chapter].beats - 1, beat));
    APP.lastChapter = -1;
    APP.busy = false;
    render();
  }

  function bindPreviewChannel() {
    window.addEventListener('message', function (e) {
      if (e.data && e.data.type === 'preview-goto') {
        previewGoto(e.data.chapter, e.data.beat);
      }
    });
    bindPreviewInteractions();
    bindPreviewLightboxBridge();
    if (presenterChannel) {
      presenterChannel.onmessage = function (ev) {
        var msg = ev.data;
        if (msg && msg.type === 'preview-goto') previewGoto(msg.chapter, msg.beat);
      };
    }
  }

  function bindPreviewInteractions() {
    function refocusLater() {
      if (!presenterChannel) return;
      setTimeout(function () {
        presenterChannel.postMessage({ type: 'presenter-refocus' });
      }, 120);
    }
    document.addEventListener('click', function (e) {
      var chip = e.target.closest('.ev-chip[data-ev-id]');
      if (chip) {
        e.preventDefault();
        e.stopPropagation();
        if (presenterChannel) {
          presenterChannel.postMessage({
            type: 'open-evidence',
            ids: chip.dataset.evGroup ? chip.dataset.evGroup.split(',') : [chip.dataset.evId],
            idx: +chip.dataset.evIdx || 0
          });
        }
        try {
          window.parent.postMessage({
            type: 'presenter-open-evidence',
            ids: chip.dataset.evGroup ? chip.dataset.evGroup.split(',') : [chip.dataset.evId],
            idx: +chip.dataset.evIdx || 0
          }, '*');
        } catch (err) {}
        refocusLater();
        return;
      }
      var btn = e.target.closest('.ev-btn[data-ev-id]');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        if (presenterChannel) {
          presenterChannel.postMessage({
            type: 'open-evidence',
            ids: [btn.dataset.evId],
            idx: 0
          });
        }
        try {
          window.parent.postMessage({
            type: 'presenter-open-evidence',
            ids: [btn.dataset.evId],
            idx: 0
          }, '*');
        } catch (err) {}
        refocusLater();
        return;
      }
      var close = e.target.closest('.lb-close');
      if (close) {
        if (presenterChannel) {
          presenterChannel.postMessage({ type: 'close-evidence' });
        }
        try { window.parent.postMessage({ type: 'presenter-audience-action', action: 'close-evidence' }, '*'); } catch (err) {}
        refocusLater();
        return;
      }
      var prev = e.target.closest('.lb-prev');
      if (prev) {
        if (presenterChannel) {
          presenterChannel.postMessage({ type: 'move-evidence', dir: -1 });
        }
        try { window.parent.postMessage({ type: 'presenter-audience-action', action: 'move-evidence', dir: -1 }, '*'); } catch (err) {}
        refocusLater();
        return;
      }
      var next = e.target.closest('.lb-next');
      if (next) {
        if (presenterChannel) {
          presenterChannel.postMessage({ type: 'move-evidence', dir: 1 });
        }
        try { window.parent.postMessage({ type: 'presenter-audience-action', action: 'move-evidence', dir: 1 }, '*'); } catch (err) {}
        refocusLater();
        return;
      }
    }, true);
  }

  function bindPreviewLightboxBridge() {
    var closeBtn = $('lb-close');
    var prevBtn = $('lb-prev');
    var nextBtn = $('lb-next');
    if (closeBtn && !closeBtn.dataset.previewBridge) {
      closeBtn.dataset.previewBridge = '1';
      var closeOrig = closeBtn.onclick;
      closeBtn.onclick = function (ev) {
        if (typeof closeOrig === 'function') closeOrig.call(this, ev);
        if (presenterChannel) presenterChannel.postMessage({ type: 'close-evidence' });
      };
    }
    if (prevBtn && !prevBtn.dataset.previewBridge) {
      prevBtn.dataset.previewBridge = '1';
      var prevOrig = prevBtn.onclick;
      prevBtn.onclick = function (ev) {
        if (typeof prevOrig === 'function') prevOrig.call(this, ev);
        if (presenterChannel) presenterChannel.postMessage({ type: 'move-evidence', dir: -1 });
      };
    }
    if (nextBtn && !nextBtn.dataset.previewBridge) {
      nextBtn.dataset.previewBridge = '1';
      var nextOrig = nextBtn.onclick;
      nextBtn.onclick = function (ev) {
        if (typeof nextOrig === 'function') nextOrig.call(this, ev);
        if (presenterChannel) presenterChannel.postMessage({ type: 'move-evidence', dir: 1 });
      };
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
