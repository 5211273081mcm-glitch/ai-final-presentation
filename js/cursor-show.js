/**
 * Cursor v2 — 交互增强 fork（index2.html）
 * 基于 final-show.js，增加：N 键 HUD、beat 证据、Page4 流式仿真、信号粒子等
 */
(function () {
  'use strict';

  if (document.body && document.body.getAttribute('data-deck') !== 'cursor-v2') return;

  var APP = {
    config: null,
    content: null,
    manifest: null,
    demoMessages: null,
    demoEvent: null,
    speakerBeats: null,
    chapter: 0,
    beat: 0,
    lastChapter: -1,
    busy: false,
    lbOpen: false,
    lbIdx: 0,
    lbImages: [],
    drawerOpen: false,
    startTime: Date.now(),
    pageStartTime: Date.now(),
    hudVisible: false,
    messageStreamIdx: -1,
    messageStreamTimer: null
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

  function initData() {
    var d = window.__PRESENTATION_DATA__;
    if (!d) throw new Error('数据未加载');
    APP.config = d.config;
    APP.content = d.content;
    APP.manifest = d.manifest;
    APP.demoMessages = d.demoMessages;
    APP.demoEvent = d.demoEvent;
    APP.speakerBeats = d.speakerBeats || { pages: [] };
  }

  var EVIDENCE = {
    page2: ['douban-crawler', 'douban-monitor-jiang', 'douban-monitor-saman', 'douban-alert-1', 'douban-trend-jiang', 'douban-trend-saman'],
    page4: ['secretary-raw', 'secretary-ocr', 'secretary-ai-1', 'secretary-ai-2', 'event-card-old'],
    page5: ['monthly-june', 'sphere-screenshot', 'event-card-old', 'crawler-aggregate']
  };

  var EVIDENCE_BY_BEAT = {
    1: { 3: ['douban-crawler', 'douban-trend-jiang'], 4: ['douban-alert-1', 'douban-monitor-saman'] },
    3: { 2: ['secretary-raw'], 3: ['secretary-ai-1'], 6: ['secretary-ai-2'], 7: ['event-card-old'] },
    4: { 4: ['monthly-june'], 5: ['sphere-screenshot', 'monthly-june'] }
  };

  function getEvidenceForBeat(ch, beat) {
    var map = EVIDENCE_BY_BEAT[ch];
    if (map && map[beat]) return map[beat];
    var pg = PAGES[ch];
    return pg && pg.evidence ? pg.evidence : null;
  }

  function hasBeatEvidence(ch, beat) {
    var ids = getEvidenceForBeat(ch, beat);
    return ids && ids.length > 0;
  }

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
            (texture ? '<img class="planet-texture" src="' + esc(texture) + '" alt="">' : '') +
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
        '<div class="orbit-band top"><span class="band-title spx-micro">AI 方向</span>' + aiItems + '</div>' +
        '<div class="orbit-band bottom"><span class="band-title spx-micro">当前痛点</span>' + painItems + '</div>' +
        '<div class="mmap-core">' +
          planet('left', m.leftTitle, m.leftCaption || m.leftDesc) +
          '<div class="chain-hub">' +
            '<div class="bridge-arrow bridge-in signal-bridge"><span class="signal-dot"></span><span class="signal-dot"></span><span class="signal-dot"></span></div>' +
            '<div class="mmap-stage-row">' + stages + '</div>' +
            '<div class="bridge-arrow bridge-out signal-bridge"><span class="signal-dot"></span><span class="signal-dot"></span><span class="signal-dot"></span></div>' +
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
    if (right) {
      var lit = beat >= 4 || map.classList.contains('mmap-complete');
      right.classList.toggle('lit', lit);
      right.classList.toggle('pulse-lit', lit && beat >= 4);
    }
    map.classList.toggle('signal-flow', beat >= 1);
    map.dataset.signalStage = String(Math.max(0, focus));
  }

  function buildOpening() {
    var p = C().pages[0];
    return '<div class="slide-body total-slide">' +
      '<div class="map-shell">' + buildMasterMap({ mode: 'opening' }) + '</div>' +
      '<div class="callout-stack">' +
        rv('<div class="beat-callout"><b>01 舆情解析</b><span>前期要把多渠道碎片，先拼成同一件事。</span></div>', 1) +
        rv('<div class="beat-callout"><b>02 舆情处置</b><span>中期要减少转述损耗，让责任和时限直接出现。</span></div>', 2) +
        rv('<div class="beat-callout"><b>03 舆情回溯</b><span>长期要沉淀纠错机制，避免同类风险复发。</span></div>', 3) +
        rv('<div class="beat-callout final"><b>今天的核心</b><span>' + esc(p.title).replace(/\n/g, '<br>') + '</span><em>' + esc(p.subtitle) + '</em><strong class="gold-quote">知道风险 ≠ 能推动行动</strong></div>', 4) +
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
        rv('<div class="break-card" data-jump-ch="2" role="button" tabindex="0"><span>解析断层</span><b>多渠道仍需人工关联</b><p>黑话、别称、同一事件归并，仍然依赖经验判断。</p></div>', 1) +
        rv('<div class="break-card" data-jump-ch="3" role="button" tabindex="0"><span>处置断层</span><b>多层转述带来信息损耗</b><p>厅管、粉运、经纪人、法务之间需要同一份事实底稿。</p></div>', 2) +
        rv('<div class="break-card" data-jump-ch="4" role="button" tabindex="0"><span>回溯断层</span><b>解释回应后容易复发</b><p>缺少整改责任、验证路径和复发识别机制。</p></div>', 3) +
      '</div>' +
      rv('<p class="one-liner">所以这次不是做一个工具，而是把“发现信号 → 统一行动”的距离压短。</p>' + evBtns(EVIDENCE.page2, 4), 4) +
    '</div>';
  }

  function buildParsePage() {
    var p = C().pages[2];
    var oldItems = ['分渠道人工看', '复制截图和链接', '人工判断黑话', '人工判断是否同一事件'];
    var newItems = ['多源接入', '主体归一', '会话聚合', '高敏识别', '事件对象'];
    var fusionNodes = ['多源信号', '主体归一', '会话聚合', '统一事件', '高敏识别'];
    return '<div class="slide-body parse-slide">' +
      rv('<div class="slide-head compact"><div class="spx-micro">从总纲展开 · 舆情解析</div><h1 class="spx-display">' + esc(p.title) + '</h1><p class="spx-note">' + esc(p.subtitle) + '</p></div>', 0) +
      rv(buildMiniMap('parse'), 0) +
      rv('<div class="parse-grid">' +
        '<div class="process-card old"><h4>旧流程 · 人工拼图</h4>' + oldItems.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>' +
        '<div class="process-card new"><h4>AI 路径 · 先成事件</h4>' + newItems.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>' +
      '</div>', 1) +
      rv('<div class="source-band">' + p.sourceColumns.map(function (col, ci) {
        return '<div class="source-card" data-source-idx="' + ci + '"><h4>' + esc(col.name) + '</h4>' +
          col.items.map(function (it) { return '<p>' + esc(it) + '</p>'; }).join('') + '</div>';
      }).join('') + '</div>', 2) +
      rv('<div class="fusion-line">' + fusionNodes.map(function (t, i) {
        return '<span data-fusion-idx="' + i + '">' + esc(t) + '</span>';
      }).join('') + '</div><p class="one-liner">' + esc(p.conclusion) + '</p>', 3) +
    '</div>';
  }

  function messageRows() {
    var n = names();
    return APP.demoMessages.messages.map(function (m, i) {
      return '<div class="message-row ' + (m.sensitive ? 'hot' : '') + '" data-msg-idx="' + i + '">' +
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
      '<div class="event-seg" data-seg="0"><div class="event-top"><span class="mono">' + esc(evt.id) + '</span><b>' + esc(evt.priority) + '</b></div></div>' +
      '<div class="event-seg" data-seg="1"><h3>' + esc(swap(evt.name, n)) + '</h3></div>' +
      '<div class="event-seg" data-seg="2"><div class="event-meta"><span>' + esc(evt.riskLevel) + '</span><span>' + esc(evt.stage) + '</span><span>' + esc(evt.duration) + '</span><span>' + evt.facts.sessionCount + ' 会话 / ' + evt.facts.messageCount + ' 消息</span></div></div>' +
      '<div class="event-seg" data-seg="3"><div class="tag-cloud">' + evt.aiInsights.riskTags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div></div>' +
      '<div class="event-seg" data-seg="4"><p>AI 只形成事实底稿：诉求、风险标签、待核验事项和建议角色，不替代最终责任判断。</p></div>' +
    '</div>';
  }

  function buildDemoPage() {
    var p = C().pages[3];
    var evt = APP.demoEvent;
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
        panel('<div class="message-panel"><h3>8 条私信流入</h3><div class="message-stream">' + messageRows() + '</div></div>', 2) +
        panel(eventCard(), 3) +
        panel('<div class="question-grid">' + five.map(function (q, i) {
          return '<div><span>Q' + (i + 1) + '</span><b>' + esc(q[0]) + '</b><p>' + esc(q[1]) + '</p></div>';
        }).join('') + '</div>', 4) +
        panel('<div class="action-board"><h3>责任动作清单</h3>' + actions.map(function (a) {
          return '<div class="action-row"><b>' + esc(a[0]) + '</b><span>' + esc(a[1]) + '</span><em>' + esc(a[2]) + '</em></div>';
        }).join('') + '</div>', 5) +
        panel('<div class="alert-split">' +
          '<div class="alert-qty"><span class="alert-badge">第 ' + APP.demoMessages.quantityThreshold + ' 条触发</span><h3>数量型预警</h3><p>普通事件累计到第 ' + APP.demoMessages.quantityThreshold + ' 条后触发。</p><b>适合常规升温监测</b></div>' +
          '<div class="hot alert-nature"><span class="alert-badge">第 4 条已触发</span><h3>性质型预警</h3><p>ICU、昏迷、药物中毒、法律责任等高敏词，第一条就值得介入。</p><b>适合高敏风险前置</b></div></div>', 6) +
        panel('<div class="boundary-card"><h3>人机边界</h3><p>' + esc(p.aiBoundary.not) + '</p>' +
          '<p class="compare-line">过去：同一条信息转述 7 次 → 现在：一张事件卡 5 个角色同步看见</p>' +
          '<ul>' + p.aiBoundary.does.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul><strong>' + esc(p.conclusion) + '</strong></div>' +
          evBtns(EVIDENCE.page4, 0), 7) +
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
        panel('<div class="fly-card" id="fly-card"><div>' + esc(APP.demoEvent.id) + '</div><span>进入月报 / SOP / 场景库</span><b>组织资产</b></div>', 2) +
        panel('<div class="sphere-zone"><div class="sphere-box" id="sphere-box"><iframe src="' + esc(APP.config.sphere.url) + '" title="风险场景库"></iframe><img class="sphere-fb" src="' + esc(APP.config.sphere.fallbackImage) + '" alt="风险知识宇宙截图"></div>' +
          '<div class="scene-card"><span class="mono">' + esc(sc.code) + '</span><h3>' + esc(sc.name) + '</h3><p>类目 ' + esc(sc.category) + ' · 权重 ' + esc(sc.weight) + ' · ' + esc(sc.alertLevel) + '</p><p>角色 ' + sc.roles.map(esc).join(' / ') + '</p></div></div>', 3) +
        panel('<div class="scene-detail"><h3>这次事件如何服务下一次</h3><p>它不应只留在群聊，而要进入月报、场景库和 SOP，成为后续识别、分发、复盘的共同语料。</p><strong>' + esc(sc.sop) + '</strong></div>', 4) +
        panel('<p class="one-liner">' + esc(p.conclusion) + '</p>' + evBtns(EVIDENCE.page5, 0), 5) +
      '</div>' +
    '</div>';
  }

  function buildClosingPage() {
    var stats = APP.config.stats || { categories: 17, scenes: 204 };
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
        rv('<div class="metrics-strip"><span>' + stats.scenes + ' 风险场景</span><span>' + stats.categories + ' 类目</span><span>处理耗时 ↓70%+</span></div>' +
          '<div class="status-grid">' + status.map(function (s) {
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

  function clearMessageStream() {
    if (APP.messageStreamTimer) {
      clearInterval(APP.messageStreamTimer);
      APP.messageStreamTimer = null;
    }
    APP.messageStreamIdx = -1;
  }

  function startMessageStream(root) {
    clearMessageStream();
    var rows = root.querySelectorAll('.message-row');
    if (!rows.length) return;
    rows.forEach(function (r) { r.classList.remove('is-in', 'stream-pulse'); });
    APP.messageStreamIdx = 0;
    APP.messageStreamTimer = setInterval(function () {
      if (APP.messageStreamIdx >= rows.length) {
        clearMessageStream();
        return;
      }
      var row = rows[APP.messageStreamIdx];
      row.classList.add('is-in');
      if (+row.dataset.msgIdx === 3) row.classList.add('stream-pulse');
      APP.messageStreamIdx++;
    }, 400);
  }

  function applyParseFocus(root, beat) {
    if (APP.chapter !== 2) return;
    var activeSource = beat >= 2 ? Math.min(beat - 2, 2) : -1;
    root.querySelectorAll('.source-card').forEach(function (el) {
      var idx = +el.dataset.sourceIdx;
      el.classList.toggle('source-active', idx === activeSource);
      el.classList.toggle('source-dim', activeSource >= 0 && idx !== activeSource);
    });
    root.querySelectorAll('.fusion-line span').forEach(function (el, i) {
      el.classList.toggle('fusion-lit', beat >= 3 && i <= beat - 2);
    });
  }

  function applyDemoEffects(root, beat) {
    if (APP.chapter !== 3) return;
    var rows = root.querySelectorAll('.message-row');
    if (beat >= 3) {
      rows.forEach(function (r) { r.classList.add('is-in'); });
      clearMessageStream();
    } else if (beat === 2) {
      if (APP.messageStreamIdx < 0) startMessageStream(root);
    } else {
      clearMessageStream();
      rows.forEach(function (r) { r.classList.remove('is-in', 'stream-pulse', 'trigger-nature', 'trigger-quantity'); });
    }
    if (beat >= 3) {
      var segs = root.querySelectorAll('.event-seg');
      segs.forEach(function (el) {
        el.classList.toggle('reveal-in', +el.dataset.seg <= beat - 3);
      });
    }
    if (beat >= 6) {
      rows.forEach(function (r) {
        var idx = +r.dataset.msgIdx;
        r.classList.toggle('trigger-nature', idx === 3);
        r.classList.toggle('trigger-quantity', idx === 4);
      });
      var nature = rows[3];
      if (nature) nature.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  function applyLoopEffects(root, beat) {
    if (APP.chapter !== 4) return;
    var fly = root.querySelector('#fly-card');
    if (fly) fly.classList.toggle('fly-to-sphere', beat >= 3);
    var sphere = root.querySelector('.sphere-zone');
    if (sphere) sphere.classList.toggle('sphere-reveal', beat >= 3);
    if (beat >= 2) preloadSphere(root);
  }

  function preloadSphere(root) {
    var box = root.querySelector('#sphere-box') || $('sphere-box');
    if (!box || box.dataset.preload) return;
    box.dataset.preload = '1';
    var iframe = box.querySelector('iframe');
    if (iframe) iframe.loading = 'eager';
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
    applyParseFocus(root, beat);
    applyDemoEffects(root, beat);
    applyLoopEffects(root, beat);
    root.querySelectorAll('.break-card[data-jump-ch]').forEach(function (el, i) {
      el.classList.toggle('break-pulse', beat === i + 1);
    });
  }

  function bindBreakCards(root) {
    root.querySelectorAll('.break-card[data-jump-ch]').forEach(function (el) {
      function jump() { goChapter(+el.dataset.jumpCh, 0); }
      el.onclick = jump;
      el.onkeydown = function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jump(); }
      };
    });
  }

  function bindEvButtons(root) {
    root.querySelectorAll('.ev-btn[data-ev-id]').forEach(function (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        openLightbox([btn.dataset.evId], 0);
      };
    });
  }

  function ensurePresenterHud() {
    if ($('presenter-hud')) return;
    var footer = document.querySelector('.deck-footer');
    if (!footer) return;
    footer.innerHTML =
      '<div class="presenter-hud" id="presenter-hud" aria-hidden="true">' +
        '<div class="hud-meta"><span id="hud-page"></span><span id="hud-beat"></span><span id="hud-remain"></span></div>' +
        '<p id="hud-script"></p>' +
        '<span class="hud-ev-hint" id="hud-ev-hint">E · 查看本步证据</span>' +
      '</div>' +
      '<span class="deck-badge">CURSOR v2</span>';
    footer.removeAttribute('aria-hidden');
  }

  function pageDurationSec(ch) {
    var pages = APP.config.pages || [];
    return pages[ch] && pages[ch].durationSec ? pages[ch].durationSec : 60;
  }

  function updatePresenterHud() {
    ensurePresenterHud();
    var hud = $('presenter-hud');
    if (!hud) return;
    hud.classList.toggle('is-visible', APP.hudVisible);
    hud.setAttribute('aria-hidden', APP.hudVisible ? 'false' : 'true');
    var pg = PAGES[APP.chapter];
    var pageMeta = APP.config.pages[APP.chapter] || {};
    var elapsed = Math.floor((Date.now() - APP.pageStartTime) / 1000);
    var remain = Math.max(0, pageDurationSec(APP.chapter) - elapsed);
    var remainEl = $('hud-remain');
    $('hud-page').textContent = (pageMeta.tag || C().pages[APP.chapter].tag || '');
    $('hud-beat').textContent = 'Beat ' + (APP.beat + 1) + ' / ' + pg.beats;
    if (remainEl) {
      remainEl.textContent = '本页剩余 ' + String(Math.floor(remain / 60)).padStart(2, '0') + ':' + String(remain % 60).padStart(2, '0');
      remainEl.classList.toggle('overtime', elapsed > pageDurationSec(APP.chapter));
    }
    var script = '';
    var beats = APP.speakerBeats.pages[APP.chapter];
    if (beats && beats.beats && beats.beats[APP.beat]) script = beats.beats[APP.beat];
    var scriptEl = $('hud-script');
    if (scriptEl) scriptEl.textContent = script;
    var evHint = $('hud-ev-hint');
    if (evHint) evHint.style.display = APP.hudVisible && hasBeatEvidence(APP.chapter, APP.beat) ? 'block' : 'none';
  }

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
    updatePresenterHud();
  }

  function render() {
    if (APP.busy) return;
    APP.busy = true;
    var canvas = $('slide-canvas');
    if (APP.lastChapter !== APP.chapter) {
      clearMessageStream();
      canvas.classList.add('fading');
      setTimeout(function () {
        canvas.innerHTML = PAGES[APP.chapter].build();
        bindEvButtons(canvas);
        bindBreakCards(canvas);
        applyBeat(canvas, APP.beat);
        canvas.classList.remove('fading');
        APP.busy = false;
        if (APP.chapter === 4 && APP.beat >= 2) initSphere();
      }, APP.lastChapter < 0 ? 0 : 160);
      APP.lastChapter = APP.chapter;
    } else {
      applyBeat(canvas, APP.beat);
      APP.busy = false;
      if (APP.chapter === 4 && APP.beat >= 2) initSphere();
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
    clearMessageStream();
    APP.chapter = Math.max(0, Math.min(PAGES.length - 1, ch));
    APP.beat = beat || 0;
    APP.pageStartTime = Date.now();
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

  function toggleHud(onlyScript) {
    if (onlyScript) {
      APP.hudVisible = !APP.hudVisible;
    } else {
      APP.hudVisible = !APP.hudVisible;
    }
    updatePresenterHud();
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
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        toggleHud(e.shiftKey);
        return;
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
        case 'E': {
          var ids = getEvidenceForBeat(APP.chapter, APP.beat);
          if (ids && ids.length) {
            e.preventDefault();
            openDrawer(ids);
          } else if (PAGES[APP.chapter].evidence) {
            e.preventDefault();
            openDrawer(PAGES[APP.chapter].evidence);
          }
          break;
        }
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
    ensurePresenterHud();
    buildChapterNav();
    bindKeys();
    APP.pageStartTime = Date.now();
    setInterval(function () {
      var sec = Math.floor((Date.now() - APP.startTime) / 1000);
      $('clock').textContent = String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
      updatePresenterHud();
    }, 1000);
    render();
    window.addEventListener('resize', scale);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
