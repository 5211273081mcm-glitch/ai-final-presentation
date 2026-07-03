window.__PRESENTATION_DATA__ = {"config": {"projectTitle": "用AI重构舆情工作范式", "subtitle": "AI重构舆情的本质，是缩短从发现信号到统一行动的距离", "useAnonymizedNames": false, "names": {"real": {"hostA": "九叔", "hostB": "哈哈"}, "anon": {"hostA": "主播A", "hostB": "主播B"}}, "sphere": {"url": "https://5211273081mcm-glitch.github.io/tcg-scene-library-v41/", "fallbackImage": "assets/evidence/3D场景球体截图.png", "loadTimeoutMs": 8000, "currentScene": {"code": "R-087", "name": "主播言行引发健康高敏争议", "category": "医疗高敏", "triggers": ["ICU", "昏迷", "药物中毒", "停播诉求"], "weight": 0.92, "alertLevel": "P1", "roles": ["大秘书", "主播管理", "舆情公关", "法务"], "relatedEvent": "九叔—哈哈解绑及健康高敏争议", "sop": "高敏医疗类事件SOP v2.1"}}, "evidenceMapping": {"signals": ["douban-crawler", "douban-monitor-jiang", "secretary-raw", "douban-alert-1"], "demo": ["secretary-raw", "secretary-ai-1", "secretary-ocr", "event-card-old", "douban-alert-2"], "loop": ["monthly-june", "sphere-screenshot", "event-card-old", "douban-slang-1"]}, "stats": {"categories": 17, "scenes": 204}, "pages": [{"id": 1, "tag": "总结构", "durationSec": 50, "beats": 5}, {"id": 2, "tag": "现实断层", "durationSec": 50, "beats": 5, "hasEvidence": true}, {"id": 3, "tag": "舆情解析", "durationSec": 90, "beats": 4}, {"id": 4, "tag": "舆情处置", "durationSec": 180, "beats": 8, "hasEvidence": true}, {"id": 5, "tag": "舆情回溯", "durationSec": 125, "beats": 6, "hasEvidence": true}, {"id": 6, "tag": "统一行动", "durationSec": 105, "beats": 4}]}, "content": {"projectTitle": "用AI重构舆情工作范式", "coreProposition": "AI重构的本质，是缩短从发现信号到统一行动的距离。", "corePropositionHtml": "AI重构的本质，是 <em>缩短</em> 从发现信号到统一行动的 <em>距离</em>。", "humanBoundary": "AI不代替公司作决策，AI让所有人先基于同一份事实行动。", "masterMap": {"kicker": "总纲 · 主脉络", "title": "用AI重构舆情工作范式", "subtitle": "核心目标：把分散信号，变成统一行动", "note": "AI不是替代判断，而是重构从发现、解析、处置到闭环的协同链路。", "leftTitle": "发现信号", "leftDesc": "来自豆瓣、评论、私信、投诉和业务反馈的分散风险线索", "leftTexture": "assets/generated/planet-signal-red.png", "leftCaption": "更少人力 · 更快 · 更准 · 更精 · 更专", "rightTitle": "统一行动", "rightDesc": "基于客观事实、统一口径与责任共识后的组织行动", "rightTexture": "assets/generated/planet-action-blue.png", "rightCaption": "更全面 · 有事实 · 有依据 · 有建议", "signalTags": ["豆瓣", "评论", "私信", "投诉", "业务反馈"]}, "stages": [{"id": "parse", "num": "01", "name": "舆情解析", "capsuleDesc": "主体识别 / 问题提炼 / 事件聚合", "currentPain": "信源分散 / 人工提炼", "aiPath": "智能感知 / 事件聚合"}, {"id": "handle", "num": "02", "name": "舆情处置", "capsuleDesc": "风险分级 / 责任分发 / 动作建议", "currentPain": "层层转述 / 人力协同", "aiPath": "统一事件 / 自动分发"}, {"id": "loop", "num": "03", "name": "舆情闭环", "capsuleDesc": "结果追踪 / 风险沉淀 / 经验复用", "currentPain": "解释回应 / 容易复发", "aiPath": "风险沉淀 / 纠错闭环"}], "replication": [{"role": "大秘书 / 小秘书", "desc": "同一事件卡驱动回复口径与介入跟踪"}, {"role": "粉丝运营", "desc": "风险信号与处置状态同步可见"}, {"role": "内容策划", "desc": "基于历史场景规避同类内容风险"}, {"role": "主播管理 / 法务", "desc": "责任清单与待核验事项自动分发"}], "closing": {"copyLines": ["今天我想展示的，不是一套已经完全建成的庞大系统，而是一条已经跑通的路径。", "过去，我们花很多时间在信息里寻找风险；", "未来，我们希望让风险主动找到正确的负责人。"]}, "pages": [{"id": 1, "code": "01", "tag": "总结构", "title": "舆情真正的难点\n不是看见风险，而是推动行动", "subtitle": "我们最需要重构的，不是单点工具，而是从「发现信号」到「统一行动」的整条链路。", "conclusion": "接下来，先看这条链路的全貌。"}, {"id": 2, "code": "02", "tag": "现实断层", "title": "用AI重构舆情工作范式", "subtitle": "核心目标：把分散信号，变成统一行动"}, {"id": 3, "code": "03", "tag": "舆情解析", "title": "风险信号是分散的、多源的、非结构化的", "subtitle": "发现信号不等于理解风险——信息从各处涌入，却难以汇聚成同一件事。", "conclusion": "问题不在「有没有数据」，而在「能不能先拼成同一件事」。", "sourceColumns": [{"name": "豆瓣讨论", "items": ["异常讨论升温 · 关联主播话题", "黑话与别称需人工识别", "趋势变化依赖人工盯盘"]}, {"name": "大秘书私信 / 投诉", "items": ["用户诉求碎片化", "图片 / 链接需 OCR 解析", "多条会话是否同一事件需人工判断"]}, {"name": "业务反馈 / 评论", "items": ["内部业务线零散上报", "口径不统一", "与外部舆情难以自动关联"]}]}, {"id": 4, "code": "04", "tag": "舆情处置", "title": "从原始投诉，到可协同的事件卡", "subtitle": "AI 不在替人决定谁对谁错，而在更快完成聚合、识别、建议与触发。", "conclusion": "同一件事，第一次以统一事件卡的形式被组织看见。", "aiBoundary": {"not": "AI 不判断主播是否应对病情负责。", "does": ["事件聚合", "风险识别", "责任建议", "介入触发"]}}, {"id": 5, "code": "05", "tag": "舆情回溯", "title": "预警不是终点，闭环才是价值", "subtitle": "一次处理应沉淀为月报、场景库与组织经验，避免同类问题复发。", "conclusion": "事件结束以后，它应该成为下一次判断可以调用的组织资产。"}, {"id": 6, "code": "06", "tag": "统一行动", "title": "回到总纲 · 闭环完成", "subtitle": "一条已跑通的路径，可复制到更多业务岗位"}]}, "manifest": {"generatedAt": "2026-06-30", "assets": [{"id": "sphere-screenshot", "originalFilename": "3D场景球体截图.png", "path": "assets/evidence/3D场景球体截图.png", "width": 2874, "height": 1550, "category": "3D球体截图", "suggestedPage": "page5", "usageTier": "main", "title": "3D风险知识宇宙", "description": "17类目、204个风险场景构成的组织知识资产视图"}, {"id": "secretary-ai-1", "originalFilename": "【大秘书】AI解析后的字段结果1.png", "path": "assets/evidence/【大秘书】AI解析后的字段结果1.png", "width": 2934, "height": 1588, "category": "大秘书-AI解析", "suggestedPage": "page4", "usageTier": "main", "title": "AI结构化解析结果", "description": "AI将非结构化私信解析为结构化风险字段，证明解析能力已运行"}, {"id": "secretary-ai-2", "originalFilename": "【大秘书】AI解析后的字段结果2 补充解析维度.png", "path": "assets/evidence/【大秘书】AI解析后的字段结果2 补充解析维度.png", "width": 2940, "height": 1590, "category": "大秘书-AI解析", "suggestedPage": "page4", "usageTier": "main", "title": "补充解析维度", "description": "场景编号、风险类目、预警等级等补充研判维度"}, {"id": "secretary-raw", "originalFilename": "【大秘书】原始私信内容.png", "path": "assets/evidence/【大秘书】原始私信内容.png", "width": 2940, "height": 1588, "category": "大秘书-原始私信", "suggestedPage": "page4", "usageTier": "main", "title": "大秘书原始私信", "description": "大秘书渠道真实私信原始内容，证明投诉接入已运行"}, {"id": "secretary-ocr", "originalFilename": "【大秘书】私信图片OCR 私信链接解析.png", "path": "assets/evidence/【大秘书】私信图片OCR 私信链接解析.png", "width": 2934, "height": 1586, "category": "大秘书-OCR", "suggestedPage": "page4", "usageTier": "main", "title": "私信图片OCR与链接解析", "description": "私信中的图片与链接可被自动解析，补充证据链"}, {"id": "monthly-june", "originalFilename": "【月报】2026年6月舆情大盘图.png", "path": "assets/evidence/【月报】2026年6月舆情大盘图.png", "width": 1672, "height": 941, "category": "月报", "suggestedPage": "page5", "usageTier": "main", "title": "2026年6月舆情大盘", "description": "月度风险趋势汇总，证明事件可沉淀为管理视图"}, {"id": "crawler-aggregate", "originalFilename": "【爬虫分析】聚合.png", "path": "assets/evidence/【爬虫分析】聚合.png", "width": 1672, "height": 941, "category": "爬虫分析", "suggestedPage": "page6", "usageTier": "evidence", "title": "评论抓取与聚合分析", "description": "批量评论正负向分析与主题聚合，可复制至内容策划"}, {"id": "douban-trend-jiang", "originalFilename": "【豆瓣】大盘视图（姜添）.png", "path": "assets/evidence/【豆瓣】大盘视图（姜添）.png", "width": 2796, "height": 1752, "category": "豆瓣-大盘", "suggestedPage": "page2", "usageTier": "main", "title": "姜添相关讨论趋势", "description": "将零散转发内容转化为可比较的长期讨论量级"}, {"id": "douban-trend-saman", "originalFilename": "【豆瓣】大盘视图（萨满）.png", "path": "assets/evidence/【豆瓣】大盘视图（萨满）.png", "width": 2796, "height": 1752, "category": "豆瓣-大盘", "suggestedPage": "page2", "usageTier": "main", "title": "萨满相关讨论趋势", "description": "多主播风险传导的可视化趋势证据"}, {"id": "douban-monitor-jiang", "originalFilename": "【豆瓣】实时讨论监测+沉淀（1月底姜添）.png", "path": "assets/evidence/【豆瓣】实时讨论监测+沉淀（1月底姜添）.png", "width": 2936, "height": 1586, "category": "豆瓣-监测", "suggestedPage": "page2", "usageTier": "main", "title": "姜添事件实时监测", "description": "姜添相关讨论实时采集与内容沉淀"}, {"id": "douban-monitor-saman", "originalFilename": "【豆瓣】实时讨论监测+沉淀（1月底萨满）.png", "path": "assets/evidence/【豆瓣】实时讨论监测+沉淀（1月底萨满）.png", "width": 2940, "height": 1588, "category": "豆瓣-监测", "suggestedPage": "page2", "usageTier": "main", "title": "萨满事件实时监测", "description": "萨满相关讨论实时采集与内容沉淀"}, {"id": "douban-alert-1", "originalFilename": "【豆瓣】异常讨论群预警1.png", "path": "assets/evidence/【豆瓣】异常讨论群预警1.png", "width": 1890, "height": 1422, "category": "豆瓣-群预警", "suggestedPage": "page2", "usageTier": "main", "title": "群机器人阈值预警", "description": "单位时间新增讨论命中阈值，自动向舆情群发出提醒"}, {"id": "douban-alert-2", "originalFilename": "【豆瓣】异常讨论群预警2.png", "path": "assets/evidence/【豆瓣】异常讨论群预警2.png", "width": 1894, "height": 1152, "category": "豆瓣-群预警", "suggestedPage": "page2", "usageTier": "main", "title": "异常讨论群预警（二）", "description": "不同类型异常讨论的预警推送示例"}, {"id": "douban-crawler", "originalFilename": "【豆瓣】数据爬虫.png", "path": "assets/evidence/【豆瓣】数据爬虫.png", "width": 2878, "height": 1548, "category": "豆瓣-爬虫", "suggestedPage": "page2", "usageTier": "main", "title": "豆瓣数据爬虫", "description": "持续抓取指定豆瓣小组与话题内容，并同步进入内部表格"}, {"id": "event-card-old", "originalFilename": "聚合事件卡（旧版）.png", "path": "assets/evidence/聚合事件卡（旧版）.png", "width": 1370, "height": 1462, "category": "聚合事件卡", "suggestedPage": "page5", "usageTier": "main", "title": "聚合事件卡（旧版参考）", "description": "多条消息聚合为统一事件卡的产品形态参考"}, {"id": "douban-slang-1", "originalFilename": "【豆瓣】黑话解析1.png", "path": "assets/evidence/【豆瓣】黑话解析1.png", "width": 2434, "height": 848, "category": "豆瓣-黑话", "suggestedPage": "optional", "usageTier": "optional", "title": "黑话解析查询", "description": "粉圈黑话词典辅助理解，暂不入主舞台"}], "unused": [{"originalFilename": "【豆瓣】异常讨论群预警3.png", "reason": "与预警1/2功能重复，保留最清晰两张"}, {"originalFilename": "【豆瓣】异常讨论群预警4.png", "reason": "与预警1/2功能重复，保留最清晰两张"}, {"originalFilename": "【豆瓣】黑话解析.png", "reason": "黑话解析仅作扩展案例，主舞台不使用"}, {"originalFilename": "【豆瓣】黑话解析2.png", "reason": "黑话解析仅作扩展案例"}, {"originalFilename": "【豆瓣】黑话解析3.png", "reason": "黑话解析仅作扩展案例"}]}, "demoMessages": {"messages": [{"id": "msg-001", "source": "大秘书", "time": "2026-03-12 09:14", "sessionId": "S-7f2a", "content": "用户投诉九叔长期语言刺激哈哈，要求公司调查", "hasAttachment": false, "status": "待处理", "sensitive": false, "tags": ["主播言行", "CP争议"]}, {"id": "msg-002", "source": "大秘书", "time": "2026-03-12 11:32", "sessionId": "S-7f2a", "content": "用户要求公司暂停九叔直播，认为言行不当", "hasAttachment": false, "status": "待处理", "sensitive": false, "tags": ["停播诉求"]}, {"id": "msg-003", "source": "大秘书", "time": "2026-03-12 14:08", "sessionId": "S-8b1c", "content": "用户质疑公司为什么没有及时介入双方矛盾", "hasAttachment": false, "status": "处理中", "sensitive": false, "tags": ["公司治理"]}, {"id": "msg-004", "source": "大秘书", "time": "2026-03-13 08:45", "sessionId": "S-9c3d", "content": "用户咨询哈哈当前病情，提及ICU与昏迷", "hasAttachment": true, "status": "待处理", "sensitive": true, "tags": ["ICU", "昏迷", "医疗高敏"]}, {"id": "msg-005", "source": "大秘书", "time": "2026-03-13 16:22", "sessionId": "S-9c3d", "content": "用户要求发布官方处理结果，追问停播性质", "hasAttachment": false, "status": "待处理", "sensitive": false, "tags": ["公告诉求", "停播性质"]}, {"id": "msg-006", "source": "大秘书", "time": "2026-03-14 10:11", "sessionId": "S-a4e5", "content": "用户投诉公开讨论病情隐私，涉及药物中毒传言", "hasAttachment": true, "status": "待处理", "sensitive": true, "tags": ["隐私泄露", "药物中毒", "医疗高敏"]}, {"id": "msg-007", "source": "大秘书", "time": "2026-03-15 19:47", "sessionId": "S-b5f6", "content": "用户追问停播属于主动停播还是公司处罚", "hasAttachment": false, "status": "待处理", "sensitive": false, "tags": ["停播性质", "处罚"]}, {"id": "msg-008", "source": "大秘书", "time": "2026-03-16 21:03", "sessionId": "S-c6g7", "content": "用户要求公司核验双方真实关系与责任，提及法律责任", "hasAttachment": false, "status": "待处理", "sensitive": true, "tags": ["法律责任", "责任认定"]}], "quantityThreshold": 5, "natureTriggers": ["ICU", "昏迷", "药物中毒", "法律责任", "未成年人", "诈骗", "隐私泄露", "监管"]}, "demoAnalysis": {"complaintTarget": "T.九叔", "relatedSubject": "T.哈哈", "problemTypes": ["主播言行", "CP解绑", "医疗高敏"], "coreDemands": ["调查", "停播", "公告", "处罚"], "riskTags": ["ICU", "昏迷", "药物中毒", "法律责任"], "firstMessageTime": "2026-03-12 09:14", "lastMessageTime": "2026-03-16 21:03", "sessionSpan": "5天", "messageCount": 23, "sessionCount": 8, "interventionStatus": "大秘书已部分回复，待跨部门协同", "secretaryReply": "已回复2条，其余待统一口径", "evidence": {"works": 2, "images": 3, "voice": 1}, "latestSummary": "用户集中投诉九叔言行与哈哈健康状况的关联，要求停播、公告与责任认定，涉及医疗高敏与隐私争议", "latestConclusion": "事件已从普通CP争议升级为涉及医疗、人身安全、主播管理和公司治理的高敏风险", "latestScene": "主播言行引发健康高敏争议", "latestCategory": "医疗高敏 / 主播行为 / 粉丝关系", "alertLevel": "P1立即关注", "aiBoundary": "AI识别的是风险升级信号，不判断谁应对病情负责"}, "demoEvent": {"id": "EVT-2026-0147", "name": "九叔—哈哈解绑及健康高敏争议", "riskLevel": "高敏复核", "priority": "P1立即关注", "stage": "持续追问", "duration": "6天", "heating": true, "facts": {"mainSubjects": ["T.九叔", "T.哈哈"], "relatedSubjects": ["粉丝群体", "CP粉圈"], "firstSeen": "2026-03-12 09:14", "lastUpdate": "2026-03-16 21:03", "sessionCount": 8, "messageCount": 23, "sources": ["大秘书", "豆瓣", "社交媒体"]}, "aiInsights": {"topDemands": ["要求调查九叔言行", "要求暂停直播", "要求发布官方公告"], "riskTags": ["ICU", "昏迷", "药物中毒", "隐私泄露", "法律责任"], "frequentExpressions": ["为什么不处理", "病情真假", "停播还是处罚", "公司责任"], "sentiment": "焦虑、追问、对立", "trend": "持续新增"}, "pendingVerification": ["哈哈病情的真实信息来源", "主播言行与病情之间的直接因果", "九叔停播属于主动行为还是公司处理", "双方管理及粉丝是否继续对线"], "suggestedRoles": ["大秘书", "主播管理", "舆情公关", "法务"], "nextActions": ["统一回复口径", "核实停播及内部处理情况", "监测社交平台扩散", "避免对直接因果作未经核验的判断"], "footer": {"relatedHistory": ["2025-11 CP解绑争议", "2026-01 粉丝对立事件"], "sceneCode": "R-087", "inMonthlyReport": true, "inKnowledgeBase": true}, "alertCard": {"title": "高敏风险预警", "event": "九叔—哈哈健康与解绑争议", "triggerReason": "医疗高敏词 + 投诉持续增长", "sessions": 8, "messages": 23, "demands": ["调查", "停播", "公告", "处罚"], "trend": "持续新增", "deadline": "立即", "prototype": true}}};

/**
 * 决赛演讲板 v10 - 总纲母版 + 10 分钟现场节奏
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
    busy: false,
    lbOpen: false,
    lbIdx: 0,
    lbImages: [],
    drawerOpen: false,
    startTime: Date.now()
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
  function swap(text, n) {
    return String(text || '').replace(/九叔/g, n.hostA).replace(/哈哈/g, n.hostB);
  }
  function asset(id) {
    return APP.manifest.assets.find(function (a) { return a.id === id; });
  }
  function rv(html, step, extra) {
    return '<div class="reveal ' + (extra || '') + '" data-step="' + step + '">' + html + '</div>';
  }
  function panel(html, step, extra) {
    return '<section class="step-panel ' + (extra || '') + '" data-panel-step="' + step + '">' + html + '</section>';
  }
  function stageLabel(stage) {
    return '<span class="stage-num">' + esc(stage.num) + '</span><span>' + esc(stage.name) + '</span>';
  }

  function initData() {
    var d = window.__PRESENTATION_DATA__;
    if (!d) throw new Error('数据未加载');
    APP.config = d.config;
    APP.content = d.content;
    APP.manifest = d.manifest;
    APP.demoMessages = d.demoMessages;
    APP.demoEvent = d.demoEvent;
  }

  var EVIDENCE = {
    page2: ['douban-crawler', 'douban-monitor-jiang', 'douban-monitor-saman', 'douban-alert-1', 'douban-trend-jiang', 'douban-trend-saman'],
    page4: ['secretary-raw', 'secretary-ocr', 'secretary-ai-1', 'secretary-ai-2', 'event-card-old'],
    page5: ['monthly-june', 'sphere-screenshot', 'event-card-old', 'crawler-aggregate']
  };

  function evBtns(ids, step) {
    if (!ids || !ids.length) return '';
    return rv('<div class="ev-inline">' + ids.map(function (id) {
      var a = asset(id);
      if (!a) return '';
      return '<button class="ev-btn" data-ev-id="' + esc(id) + '"><span>Evidence</span>' + esc(a.title) + '</button>';
    }).join('') + '</div>', step);
  }

  function buildMiniMap(active) {
    return '<div class="mini-map" data-active="' + esc(active) + '">' +
      '<div class="mini-end">发现信号</div>' +
      C().stages.map(function (s) {
        return '<div class="mini-stage ' + (s.id === active ? 'active' : '') + '">' +
          '<b>' + esc(s.num) + '</b><span>' + esc(s.name) + '</span></div>';
      }).join('<div class="mini-arrow"></div>') +
      '<div class="mini-end lit">统一行动</div>' +
      '</div>';
  }

  function buildMasterMap(opts) {
    opts = opts || {};
    var m = C().masterMap;
    var complete = opts.complete;
    var mode = opts.mode || 'default';
    var active = opts.active == null ? -1 : opts.active;
    var cls = 'mmap mmap-v10' + (complete ? ' mmap-complete' : '') + (opts.compact ? ' mmap-compact' : '');
    var stages = C().stages.map(function (s, i) {
      return '<div class="mmap-stage-card ' + (i === active ? 'focus' : '') + '" data-stage-card="' + i + '">' +
        '<h4>' + esc(s.name) + '</h4>' +
        '</div>';
    }).join('<div class="map-arrow"></div>');
    var aiItems = C().stages.map(function (s) {
      return '<div class="orbit-item on">' + esc(s.aiPath).replace(' / ', '<br>') + '</div>';
    }).join('');
    var painItems = C().stages.map(function (s) {
      return '<div class="orbit-item on">' + esc(s.currentPain).replace(' / ', '<br>') + '</div>';
    }).join('');

    function planet(side, title, caption) {
      var isLeft = side.indexOf('left') >= 0;
      var key = isLeft ? 'left' : 'right';
      var texture = isLeft ? m.leftTexture : m.rightTexture;
      var ringCopy = (caption || '') + ' · ' + (caption || '') + ' · ' + (caption || '');
      var animate = isLeft
        ? '<animate attributeName="startOffset" values="-62%;38%" dur="18s" repeatCount="indefinite"></animate>'
        : '<animate attributeName="startOffset" values="38%;-62%" dur="20s" repeatCount="indefinite"></animate>';
      return '<div class="planet-node ' + side + '">' +
        '<div class="planet-wrap">' +
          '<svg class="saturn-ring saturn-ring-back" viewBox="0 0 560 260" aria-hidden="true">' +
            '<ellipse cx="280" cy="136" rx="250" ry="62"></ellipse>' +
          '</svg>' +
          '<div class="planet-sphere">' +
            (texture ? '<img class="planet-texture planet-base" src="' + esc(texture) + '" alt="">' : '') +
            (texture ? '<span class="planet-map" style="--planet-image:url(' + esc(texture) + ')"></span>' : '') +
            '<span class="planet-core-title">' + esc(title) + '</span>' +
          '</div>' +
          '<svg class="saturn-ring saturn-ring-front" viewBox="0 0 560 260" aria-hidden="true">' +
            '<defs><path id="planet-ring-copy-' + key + '" d="M 42 145 C 150 232 410 232 518 145"></path></defs>' +
            '<path class="ring-front-line" d="M 42 145 C 150 232 410 232 518 145"></path>' +
            '<text class="ring-copy"><textPath href="#planet-ring-copy-' + key + '" startOffset="-62%">' + esc(ringCopy) + animate + '</textPath></text>' +
          '</svg>' +
        '</div>' +
      '</div>';
    }

    return '<div class="' + cls + '" data-map-mode="' + esc(mode) + '" data-stage="0">' +
      '<div class="mmap-hd">' +
        '<h1 class="spx-display">' + esc(m.title) + '</h1>' +
        '<p class="spx-lede">' + esc(m.subtitle) + '</p>' +
      '</div>' +
      '<div class="mmap-scene">' +
        '<svg class="mmap-arcs" viewBox="0 0 1000 430" preserveAspectRatio="none" aria-hidden="true">' +
          '<defs>' +
            '<marker id="arrow-ai" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>' +
            '<marker id="arrow-pain" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker>' +
          '</defs>' +
          '<path class="arc-ai" marker-start="url(#arrow-ai)" marker-end="url(#arrow-ai)" d="M 128 146 C 310 34 690 34 872 146"></path>' +
          '<path class="arc-manual" marker-start="url(#arrow-pain)" marker-end="url(#arrow-pain)" d="M 135 286 C 314 392 686 392 865 286"></path>' +
        '</svg>' +
        '<div class="orbit-band top"><span class="band-title spx-micro">AI 方向</span>' +
          aiItems +
        '</div>' +
        '<div class="orbit-band bottom"><span class="band-title spx-micro">当前痛点</span>' +
          painItems +
        '</div>' +
        '<div class="mmap-core">' +
          planet('left', m.leftTitle, m.leftCaption || m.leftDesc) +
          '<div class="chain-hub">' +
            '<div class="bridge-arrow bridge-in"></div>' +
            '<div class="mmap-stage-row">' + stages + '</div>' +
            '<div class="bridge-arrow bridge-out"></div>' +
          '</div>' +
          planet('right' + (complete ? ' lit' : ''), m.rightTitle, m.rightCaption || m.rightDesc) +
        '</div>' +
      '</div>' +
      '<div class="mmap-ft">' +
        '<div class="distance-compress"><span>发现信号</span><i></i><b>缩短距离</b><i></i><span>统一行动</span></div>' +
        '<p>' + (C().corePropositionHtml || esc(C().coreProposition)) + '</p>' +
      '</div>' +
    '</div>';
  }

  function setMapFocus(root, beat) {
    var map = root.querySelector('.mmap');
    if (!map) return;
    map.dataset.stage = beat;
    var mode = map.dataset.mapMode;
    var focus = -1;
    if (mode === 'opening') {
      if (beat === 1) focus = 0;
      if (beat === 2) focus = 1;
      if (beat === 3) focus = 2;
      if (beat >= 4) focus = -1;
    }
    if (mode === 'fracture') {
      focus = Math.max(-1, Math.min(2, beat - 1));
      map.classList.toggle('show-fractures', beat >= 1);
    }
    map.querySelectorAll('[data-stage-card]').forEach(function (el) {
      var i = +el.dataset.stageCard;
      el.classList.toggle('focus', i === focus || beat >= 4 && mode === 'opening');
      el.classList.toggle('fracture', mode === 'fracture' && beat >= i + 1);
    });
    var right = map.querySelector('.planet-node.right');
    if (right) right.classList.toggle('lit', beat >= 4 || map.classList.contains('mmap-complete'));
  }

  function buildOpening() {
    var p = C().pages[0];
    return '<div class="slide-body total-slide">' +
      '<div class="map-shell">' + buildMasterMap({ mode: 'opening' }) + '</div>' +
      '<div class="callout-stack">' +
        rv('<div class="beat-callout"><b>01 舆情解析</b><span>前期要把多渠道碎片，先拼成同一件事。</span></div>', 1) +
        rv('<div class="beat-callout"><b>02 舆情处置</b><span>中期要减少转述损耗，让责任和时限直接出现。</span></div>', 2) +
        rv('<div class="beat-callout"><b>03 舆情回溯</b><span>长期要沉淀纠错机制，避免同类风险复发。</span></div>', 3) +
        rv('<div class="beat-callout final"><b>今天的核心</b><span>' + esc(p.title).replace(/\n/g, '<br>') + '</span><em>' + esc(p.subtitle) + '</em></div>', 4) +
      '</div>' +
    '</div>';
  }

  function buildFracturePage() {
    return '<div class="slide-body total-slide fracture-slide">' +
      rv('<div class="slide-head compact"><div class="spx-micro">现实断层 · 姜添 / 萨满事件</div>' +
        '<h1 class="spx-display">看见风险，不等于组织已经完成行动</h1>' +
        '<p class="spx-note">现有爬虫、群预警和沉淀表已经证明“信号能被看见”；真正的断层在理解、协同和纠错。</p></div>', 0) +
      '<div class="map-shell">' + buildMasterMap({ mode: 'fracture' }) + '</div>' +
      '<div class="break-grid">' +
        rv('<div class="break-card"><span>解析断层</span><b>多渠道仍需人工关联</b><p>黑话、别称、同一事件归并，仍然依赖经验判断。</p></div>', 1) +
        rv('<div class="break-card"><span>处置断层</span><b>多层转述带来信息损耗</b><p>厅管、粉运、经纪人、法务之间需要同一份事实底稿。</p></div>', 2) +
        rv('<div class="break-card"><span>回溯断层</span><b>解释回应后容易复发</b><p>缺少整改责任、验证路径和复发识别机制。</p></div>', 3) +
      '</div>' +
      rv('<p class="one-liner">所以这次不是做一个工具，而是把“发现信号 → 统一行动”的距离压短。</p>' + evBtns(EVIDENCE.page2, 4), 4) +
    '</div>';
  }

  function buildParsePage() {
    var p = C().pages[2];
    var oldItems = ['分渠道人工看', '复制截图和链接', '人工判断黑话', '人工判断是否同一事件'];
    var newItems = ['多源接入', '主体归一', '会话聚合', '高敏识别', '事件对象'];
    return '<div class="slide-body">' +
      rv('<div class="slide-head compact"><div class="spx-micro">从总纲展开 · 舆情解析</div><h1 class="spx-display">' + esc(p.title) + '</h1><p class="spx-note">' + esc(p.subtitle) + '</p></div>', 0) +
      rv(buildMiniMap('parse'), 0) +
      rv('<div class="parse-grid">' +
        '<div class="process-card old"><h4>旧流程 · 人工拼图</h4>' + oldItems.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>' +
        '<div class="process-card new"><h4>AI 路径 · 先成事件</h4>' + newItems.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>' +
      '</div>', 1) +
      rv('<div class="source-band">' + p.sourceColumns.map(function (col) {
        return '<div class="source-card"><h4>' + esc(col.name) + '</h4>' +
          col.items.map(function (it) { return '<p>' + esc(it) + '</p>'; }).join('') + '</div>';
      }).join('') + '</div>', 2) +
      rv('<div class="fusion-line"><span>多源信号</span><span>主体归一</span><span>会话聚合</span><span>统一事件</span><span>高敏识别</span></div><p class="one-liner">' + esc(p.conclusion) + '</p>', 3) +
    '</div>';
  }

  function messageRows() {
    var n = names();
    return APP.demoMessages.messages.map(function (m, i) {
      return '<div class="message-row ' + (m.sensitive ? 'hot' : '') + '">' +
        '<span class="mono">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span>' + esc(m.time.split(' ')[1]) + '</span>' +
        '<strong>' + esc(swap(m.content, n)) + '</strong>' +
        '<em>' + m.tags.map(esc).join(' / ') + '</em>' +
      '</div>';
    }).join('');
  }

  function eventCard() {
    var evt = APP.demoEvent;
    var n = names();
    return '<div class="event-card-v10">' +
      '<div class="event-top"><span class="mono">' + esc(evt.id) + '</span><b>' + esc(evt.priority) + '</b></div>' +
      '<h3>' + esc(swap(evt.name, n)) + '</h3>' +
      '<div class="event-meta"><span>' + esc(evt.riskLevel) + '</span><span>' + esc(evt.stage) + '</span><span>' + esc(evt.duration) + '</span><span>' + evt.facts.sessionCount + ' 会话 / ' + evt.facts.messageCount + ' 消息</span></div>' +
      '<div class="tag-cloud">' + evt.aiInsights.riskTags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' +
      '<p>AI 只形成事实底稿：诉求、风险标签、待核验事项和建议角色，不替代最终责任判断。</p>' +
    '</div>';
  }

  function buildDemoPage() {
    var p = C().pages[3];
    var evt = APP.demoEvent;
    var n = names();
    var five = [
      ['发生什么', '多条投诉指向主播解绑与健康高敏争议'],
      ['已确认什么', '投诉持续进入，含停播、公告、病情与责任诉求'],
      ['待核验什么', evt.pendingVerification.slice(0, 3).join('；')],
      ['谁要行动', evt.suggestedRoles.join(' / ')],
      ['什么时限', 'P1 立即关注，先统一事实底稿与回复边界']
    ];
    var actions = [
      ['大秘书', '统一回复口径', '待认领'],
      ['主播管理', '核实停播及内部处理情况', '处理中'],
      ['舆情公关', '监测社交平台扩散', '处理中'],
      ['法务', '避免未经核验的因果判断', '待复核'],
      ['业务负责人', '确认后续整改与复发观察点', '接通中']
    ];
    return '<div class="slide-body demo-slide">' +
      rv('<div class="slide-head compact"><div class="spx-micro">核心演示 · 舆情处置</div><h1 class="spx-display">' + esc(p.title) + '</h1><p class="spx-note">' + esc(p.subtitle) + '</p></div>', 0) +
      rv(buildMiniMap('handle'), 0) +
      '<div class="step-zone">' +
        panel('<div class="demo-intro"><h2>让同一件事，转化成同一套行动</h2><p>九叔 - 哈哈案例，本地确定性仿真。演示重点不是判断谁对谁错，而是组织如何先基于同一份事实协同。</p></div>', 0) +
        panel('<div class="relay-chain"><h3>人工转述链</h3><div class="relay-row">' +
          ['舆情同学', '大秘书', '厅管', '主播管理', '粉丝运营', '法务', '业务负责人'].map(function (r) { return '<span>' + esc(r) + '</span>'; }).join('<i></i>') +
          '</div><p>每多一层转述，就多一次信息损耗、口径偏差和责任模糊。</p></div>', 1) +
        panel('<div class="message-panel"><h3>8 条私信流入</h3>' + messageRows() + '</div>', 2) +
        panel(eventCard(), 3) +
        panel('<div class="question-grid">' + five.map(function (q, i) {
          return '<div><span>Q' + (i + 1) + '</span><b>' + esc(q[0]) + '</b><p>' + esc(q[1]) + '</p></div>';
        }).join('') + '</div>', 4) +
        panel('<div class="action-board"><h3>责任动作清单</h3>' + actions.map(function (a) {
          return '<div class="action-row"><b>' + esc(a[0]) + '</b><span>' + esc(a[1]) + '</span><em>' + esc(a[2]) + '</em></div>';
        }).join('') + '</div>', 5) +
        panel('<div class="alert-split"><div><h3>数量型预警</h3><p>普通事件累计到第 ' + APP.demoMessages.quantityThreshold + ' 条后触发。</p><b>适合常规升温监测</b></div>' +
          '<div class="hot"><h3>性质型预警</h3><p>ICU、昏迷、药物中毒、法律责任等高敏词，第一条就值得介入。</p><b>适合高敏风险前置</b></div></div>', 6) +
        panel('<div class="boundary-card"><h3>人机边界</h3><p>' + esc(p.aiBoundary.not) + '</p><ul>' + p.aiBoundary.does.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul><strong>' + esc(p.conclusion) + '</strong></div>' + evBtns(EVIDENCE.page4, 0), 7) +
      '</div>' +
    '</div>';
  }

  function buildLoopPage() {
    var p = C().pages[4];
    var sc = APP.config.sphere.currentScene;
    return '<div class="slide-body loop-slide">' +
      rv('<div class="slide-head compact"><div class="spx-micro">从总纲展开 · 舆情闭环</div><h1 class="spx-display">' + esc(p.title) + '</h1><p class="spx-note">' + esc(p.subtitle) + '</p></div>', 0) +
      rv(buildMiniMap('loop'), 0) +
      '<div class="step-zone">' +
        panel('<div class="closing-gap"><h3>旧收尾解决的是“这次怎么结束”</h3><p>回复、公告、处罚之后，还缺三个问题：为什么发生、谁整改、如何验证不复发。</p></div>', 0) +
        panel('<div class="deposit-grid">' +
          ['风险场景', '历史关联', '根因纠正', '责任人验证', '复发预警'].map(function (t) {
            return '<div><b>' + esc(t) + '</b><p>从单次事件沉淀为下一次可调用的判断依据。</p></div>';
          }).join('') + '</div>', 1) +
        panel('<div class="fly-card"><div>' + esc(APP.demoEvent.id) + '</div><span>进入月报 / SOP / 场景库</span><b>组织资产</b></div>', 2) +
        panel('<div class="sphere-zone"><div class="sphere-box" id="sphere-box"><iframe src="' + esc(APP.config.sphere.url) + '" title="风险场景库"></iframe><img class="sphere-fb" src="' + esc(APP.config.sphere.fallbackImage) + '" alt="风险知识宇宙截图"></div>' +
          '<div class="scene-card"><span class="mono">' + esc(sc.code) + '</span><h3>' + esc(sc.name) + '</h3><p>类目 ' + esc(sc.category) + ' · 权重 ' + esc(sc.weight) + ' · ' + esc(sc.alertLevel) + '</p><p>角色 ' + sc.roles.map(esc).join(' / ') + '</p></div></div>', 3) +
        panel('<div class="scene-detail"><h3>这次事件如何服务下一次</h3><p>它不应只留在群聊，而要进入月报、场景库和 SOP，成为后续识别、分发、复盘的共同语料。</p><strong>' + esc(sc.sop) + '</strong></div>', 4) +
        panel('<p class="one-liner">' + esc(p.conclusion) + '</p>' + evBtns(EVIDENCE.page5, 0), 5) +
      '</div>' +
    '</div>';
  }

  function buildClosingPage() {
    var status = [
      ['已跑通', '豆瓣监测、大秘书私信解析、事件卡、月报沉淀'],
      ['正在接通', '机器人预警、责任分发、处置状态追踪'],
      ['逐步扩展', '粉丝运营、内容策划、主播管理、法务协同']
    ];
    return '<div class="slide-body closing-slide">' +
      '<div class="map-shell">' + buildMasterMap({ complete: true, mode: 'complete' }) + '</div>' +
      '<div class="closing-panels">' +
        rv('<div class="rep-grid">' + C().replication.map(function (r) {
          return '<div><b>' + esc(r.role) + '</b><p>' + esc(r.desc) + '</p></div>';
        }).join('') + '</div>', 1) +
        rv('<div class="status-grid">' + status.map(function (s) {
          return '<div><span>' + esc(s[0]) + '</span><p>' + esc(s[1]) + '</p></div>';
        }).join('') + '</div>', 2) +
        rv('<div class="final-words">' + C().closing.copyLines.map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('') +
          '<h2>' + esc(C().coreProposition) + '</h2></div>', 3) +
      '</div>' +
    '</div>';
  }

  var PAGES = [
    { beats: 5, build: buildOpening },
    { beats: 5, build: buildFracturePage, evidence: EVIDENCE.page2 },
    { beats: 4, build: buildParsePage },
    { beats: 8, build: buildDemoPage, evidence: EVIDENCE.page4 },
    { beats: 6, build: buildLoopPage, evidence: EVIDENCE.page5 },
    { beats: 4, build: buildClosingPage }
  ];

  function buildChapterNav() {
    $('chapter-nav').innerHTML = '<div class="cn-track">' + C().pages.map(function (p, i) {
      return '<div class="cn-seg" data-ch="' + i + '"><span class="cn-code">' + esc(p.code) + '</span><span class="cn-label">' + esc(p.tag) + '</span><span class="cn-beat-bar"></span></div>';
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
      var bar = el.querySelector('.cn-beat-bar');
      if (i === APP.chapter) bar.style.width = ((APP.beat + 1) / pg.beats * 100) + '%';
      else if (i < APP.chapter) bar.style.width = '100%';
      else bar.style.width = '0';
    });
    var total = 0;
    var done = 0;
    PAGES.forEach(function (p, i) {
      total += p.beats;
      if (i < APP.chapter) done += p.beats;
      else if (i === APP.chapter) done += APP.beat + 1;
    });
    $('progress-fill').style.width = (done / total * 100) + '%';
    var slideNumber = $('slide-number');
    if (slideNumber) slideNumber.textContent = (APP.chapter + 1) + ' / ' + PAGES.length + ' · beat ' + (APP.beat + 1);
  }

  function applyBeat(root, beat) {
    root.dataset.beat = beat;
    root.className = 'slide-canvas beat-' + beat;
    root.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.toggle('is-on', +el.dataset.step <= beat);
    });
    root.querySelectorAll('[data-panel-step]').forEach(function (el) {
      var step = +el.dataset.panelStep;
      el.classList.toggle('is-current', step === beat);
      el.classList.toggle('is-past', step < beat);
    });
    setMapFocus(root, beat);
  }

  function bindEvButtons(root) {
    root.querySelectorAll('.ev-btn[data-ev-id]').forEach(function (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        openLightbox([btn.dataset.evId], 0);
      };
    });
  }

  function render() {
    if (APP.busy) return;
    APP.busy = true;
    var canvas = $('slide-canvas');
    if (APP.lastChapter !== APP.chapter) {
      canvas.classList.add('fading');
      setTimeout(function () {
        canvas.innerHTML = PAGES[APP.chapter].build();
        bindEvButtons(canvas);
        applyBeat(canvas, APP.beat);
        canvas.classList.remove('fading');
        APP.busy = false;
        if (APP.chapter === 4 && APP.beat >= 3) initSphere();
      }, APP.lastChapter < 0 ? 0 : 160);
      APP.lastChapter = APP.chapter;
    } else {
      applyBeat(canvas, APP.beat);
      APP.busy = false;
      if (APP.chapter === 4 && APP.beat >= 3) initSphere();
    }
    updateNav();
    scale();
  }

  function scale() {
    var viewport = $('scene-viewport');
    var s = Math.min(viewport.clientWidth / 1920, viewport.clientHeight / 980);
    $('scene-stage').style.transform = 'scale(' + s + ')';
  }

  function goChapter(ch, beat) {
    if (APP.busy) return;
    APP.chapter = Math.max(0, Math.min(PAGES.length - 1, ch));
    APP.beat = beat || 0;
    if (APP.lastChapter !== APP.chapter) APP.lastChapter = -1;
    render();
  }

  function advance() {
    if (APP.busy) return;
    var pg = PAGES[APP.chapter];
    if (APP.beat < pg.beats - 1) {
      APP.beat++;
      render();
    } else if (APP.chapter < PAGES.length - 1) {
      goChapter(APP.chapter + 1, 0);
    }
  }

  function retreat() {
    if (APP.busy) return;
    if (APP.beat > 0) {
      APP.beat--;
      render();
    } else if (APP.chapter > 0) {
      goChapter(APP.chapter - 1, PAGES[APP.chapter - 1].beats - 1);
    }
  }

  function initSphere() {
    var box = $('sphere-box');
    if (!box || box.dataset.ok) return;
    box.dataset.ok = '1';
    setTimeout(function () {
      if (!navigator.onLine) box.classList.add('fallback');
    }, APP.config.sphere.loadTimeoutMs || 8000);
  }

  function openLightbox(ids, idx) {
    APP.lbImages = ids.map(asset).filter(Boolean);
    if (!APP.lbImages.length) return;
    APP.lbIdx = idx || 0;
    APP.lbOpen = true;
    syncLightbox();
    $('lightbox').classList.add('open');
  }
  function syncLightbox() {
    var a = APP.lbImages[APP.lbIdx];
    if (!a) return;
    $('lb-img').src = a.path;
    $('lb-img').alt = a.title;
    $('lb-cap').textContent = a.title + ' - ' + a.description;
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

  function ensureDrawer() {
    if ($('evidence-drawer')) return;
    var div = document.createElement('div');
    div.className = 'evidence-drawer';
    div.id = 'evidence-drawer';
    div.innerHTML =
      '<button class="drawer-close" id="drawer-close" aria-label="关闭证据">×</button>' +
      '<div class="drawer-stage"><img id="drawer-img" alt=""><div class="drawer-copy"><span id="drawer-count" class="mono"></span><h3 id="drawer-title"></h3><p id="drawer-desc"></p></div></div>' +
      '<div class="drawer-thumbs" id="drawer-thumbs"></div>';
    document.body.appendChild(div);
    $('drawer-close').onclick = closeDrawer;
  }
  function openDrawer(ids) {
    ensureDrawer();
    APP.lbImages = ids.map(asset).filter(Boolean);
    if (!APP.lbImages.length) return;
    APP.lbIdx = 0;
    APP.drawerOpen = true;
    syncDrawer();
    $('evidence-drawer').classList.add('open');
  }
  function syncDrawer() {
    var a = APP.lbImages[APP.lbIdx];
    if (!a) return;
    $('drawer-img').src = a.path;
    $('drawer-img').alt = a.title;
    $('drawer-count').textContent = String(APP.lbIdx + 1).padStart(2, '0') + ' / ' + String(APP.lbImages.length).padStart(2, '0');
    $('drawer-title').textContent = a.title;
    $('drawer-desc').textContent = a.description;
    $('drawer-thumbs').innerHTML = APP.lbImages.map(function (item, i) {
      return '<button class="' + (i === APP.lbIdx ? 'active' : '') + '" data-drawer-idx="' + i + '"><img src="' + esc(item.path) + '" alt=""><span>' + esc(item.title) + '</span></button>';
    }).join('');
    $('drawer-thumbs').querySelectorAll('button').forEach(function (btn) {
      btn.onclick = function () {
        APP.lbIdx = +btn.dataset.drawerIdx;
        syncDrawer();
      };
    });
  }
  function closeDrawer() {
    APP.drawerOpen = false;
    var d = $('evidence-drawer');
    if (d) d.classList.remove('open');
  }
  function moveDrawer(dir) {
    if (!APP.lbImages.length) return;
    APP.lbIdx = (APP.lbIdx + dir + APP.lbImages.length) % APP.lbImages.length;
    syncDrawer();
  }

  function bindKeys() {
    document.addEventListener('keydown', function (e) {
      if (APP.lbOpen) {
        if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); return; }
        if (e.key === 'ArrowLeft') { e.preventDefault(); moveLightbox(-1); return; }
        if (e.key === 'ArrowRight') { e.preventDefault(); moveLightbox(1); return; }
      }
      if (APP.drawerOpen) {
        if (e.key === 'Escape' || e.key === 'e' || e.key === 'E') { e.preventDefault(); closeDrawer(); return; }
        if (e.key === 'ArrowLeft') { e.preventDefault(); moveDrawer(-1); return; }
        if (e.key === 'ArrowRight') { e.preventDefault(); moveDrawer(1); return; }
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
          if (PAGES[APP.chapter].evidence) {
            e.preventDefault();
            openDrawer(PAGES[APP.chapter].evidence);
          }
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
          break;
        default:
          if (e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            goChapter(+e.key - 1, 0);
          }
      }
    });
    $('lb-close').onclick = closeLightbox;
    $('lb-prev').onclick = function () { moveLightbox(-1); };
    $('lb-next').onclick = function () { moveLightbox(1); };
  }

  function init() {
    initData();
    buildChapterNav();
    bindKeys();
    setInterval(function () {
      var sec = Math.floor((Date.now() - APP.startTime) / 1000);
      $('clock').textContent = String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
    }, 1000);
    render();
    window.addEventListener('resize', scale);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
