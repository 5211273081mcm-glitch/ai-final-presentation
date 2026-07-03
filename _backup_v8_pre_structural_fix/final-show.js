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

  var mapAnimTimers = [];

  function clearMapAnimTimers() {
    mapAnimTimers.forEach(clearTimeout);
    mapAnimTimers = [];
  }

  function splitCopy(text) {
    var parts = String(text || '').split(' / ');
    return { line1: parts[0] || '', line2: parts[1] || '' };
  }

  function buildPlanetNode(side, title, texture, lit) {
    var ringW = 560;
    var ringH = 98;
    return '<div class="planet-node ' + side + (lit ? ' lit' : '') + '">' +
      '<div class="planet-wrap">' +
        '<svg class="saturn-ring saturn-ring-back" viewBox="0 0 ' + ringW + ' ' + ringH + '" aria-hidden="true">' +
          '<ellipse cx="280" cy="52" rx="248" ry="38"></ellipse>' +
        '</svg>' +
        '<div class="planet-sphere">' +
          (texture ? '<img class="planet-texture" src="' + esc(texture) + '" alt="">' : '') +
          '<span class="planet-core-title">' + esc(title) + '</span>' +
        '</div>' +
        '<svg class="saturn-ring saturn-ring-front" viewBox="0 0 ' + ringW + ' ' + ringH + '" aria-hidden="true">' +
          '<ellipse cx="280" cy="52" rx="248" ry="38"></ellipse>' +
        '</svg>' +
      '</div>' +
    '</div>';
  }

  function buildMasterMap(opts) {
    opts = opts || {};
    var m = C().masterMap;
    var complete = opts.complete;
    var mode = opts.mode || 'default';
    var cls = 'mmap mmap-v77' + (complete ? ' mmap-complete' : '') + (opts.compact ? ' mmap-compact' : '');

    var stageNodes = C().stages.map(function (s, i) {
      return '<div class="stage-node" data-col="' + i + '">' +
        '<span class="stage-num">' + esc(s.num) + '</span>' +
        '<span class="stage-name">' + esc(s.name) + '</span>' +
      '</div>';
    }).join('');

    var aiCopy = C().stages.map(function (s, i) {
      var c = splitCopy(s.aiPath);
      return '<div class="route-copy ai-copy" data-col="' + i + '">' +
        '<span class="copy-line1">' + esc(c.line1) + '</span>' +
        '<span class="copy-line2">' + esc(c.line2) + '</span>' +
      '</div>';
    }).join('');

    var painCopy = C().stages.map(function (s, i) {
      var c = splitCopy(s.currentPain);
      return '<div class="route-copy pain-copy" data-col="' + i + '">' +
        '<span class="copy-line1">' + esc(c.line1) + '</span>' +
        '<span class="copy-line2">' + esc(c.line2) + '</span>' +
      '</div>';
    }).join('');

    var particles = '<div class="particle manual"></div><div class="particle manual"></div><div class="particle manual"></div>' +
      '<div class="particle ai"></div><div class="particle ai"></div><div class="particle ai"></div>';

    return '<div class="' + cls + '" data-map-mode="' + esc(mode) + '" data-stage="' + (complete ? '5' : '0') + '">' +
      '<div class="master-map-canvas">' +
        '<header class="mmap-hd">' +
          '<h1 class="spx-display">' + esc(m.title) + '</h1>' +
          '<p class="mmap-subtitle">' + esc(m.subtitle) + '</p>' +
        '</header>' +
        '<svg class="master-map-routes" viewBox="0 0 1920 1080" aria-hidden="true">' +
          '<path class="route-spine" pathLength="1200" d="M 413 565 L 1507 565"></path>' +
          '<path class="route-ai" pathLength="2000" d="M 335 505 C 455 300, 375 278, 398 278"></path>' +
          '<path class="route-ai" pathLength="2000" d="M 508 278 C 960 270, 1420 278, 1605 505"></path>' +
          '<path class="route-current route-current-a" pathLength="800" d="M 335 625 C 500 835, 680 838, 698 838"></path>' +
          '<path class="route-current route-current-b" pathLength="800" d="M 742 838 L 952 838"></path>' +
          '<path class="route-current route-current-c" pathLength="800" d="M 968 838 C 1100 838, 1188 838, 1208 838"></path>' +
          '<path class="route-current route-current-d" pathLength="800" d="M 1212 838 C 1360 838, 1520 828, 1605 625"></path>' +
        '</svg>' +
        '<span class="route-label route-label-ai">AI方向</span>' +
        '<span class="route-label route-label-pain">当前痛点</span>' +
        aiCopy +
        painCopy +
        buildPlanetNode('left', m.leftTitle, m.leftTexture) +
        buildPlanetNode('right', m.rightTitle, m.rightTexture, complete) +
        stageNodes +
        '<div class="mmap-particles">' + particles + '</div>' +
        '<footer class="mmap-ft"><p>' + (C().corePropositionHtml || esc(C().coreProposition)) + '</p></footer>' +
        '<div class="mmap-debug" aria-hidden="true">' +
          '<div class="debug-safe"></div>' +
          '<div class="debug-line-v" data-x="720"></div>' +
          '<div class="debug-line-v" data-x="960"></div>' +
          '<div class="debug-line-v" data-x="1200"></div>' +
          '<div class="debug-box planet-left"></div>' +
          '<div class="debug-box planet-right"></div>' +
          '<div class="debug-box stage" data-col="0"></div>' +
          '<div class="debug-box stage" data-col="1"></div>' +
          '<div class="debug-box stage" data-col="2"></div>' +
          '<div class="debug-zone ai-zone"></div>' +
          '<div class="debug-zone pain-zone"></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function triggerMapAnimations(map, beat) {
    if (!map || map.classList.contains('mmap-complete')) return;
    clearMapAnimTimers();
    map.classList.remove('anim-pain', 'anim-ai');
    void map.offsetWidth;
    if (beat === 2) {
      map.classList.add('anim-pain');
    }
    if (beat === 4) {
      map.classList.add('anim-ai');
    }
  }

  function setMapFocus(root, beat) {
    var map = root.querySelector('.mmap');
    if (!map) return;
    if (map.classList.contains('mmap-complete')) {
      map.dataset.stage = '5';
      return;
    }
    var mode = map.dataset.mapMode;
    var stage = beat;
    if (mode === 'fracture') {
      stage = Math.min(5, Math.max(0, beat));
    }
    if (mode === 'opening') {
      stage = Math.min(5, Math.max(0, beat));
    }
    var prev = +map.dataset.stage || 0;
    map.dataset.stage = String(stage);
    map.querySelectorAll('.stage-node').forEach(function (el) {
      el.classList.toggle('highlight', stage >= 4);
    });
    var right = map.querySelector('.planet-node.right');
    if (right) right.classList.toggle('lit', stage >= 4);
    if (stage !== prev) triggerMapAnimations(map, stage);
  }

  function replayMasterMap(root) {
    var map = root.querySelector('.mmap');
    if (!map || map.classList.contains('mmap-complete')) return;
    clearMapAnimTimers();
    map.classList.remove('anim-pain', 'anim-ai');
    map.dataset.stage = '0';
    map.querySelectorAll('.stage-node').forEach(function (el) {
      el.classList.remove('highlight');
    });
    var right = map.querySelector('.planet-node.right');
    if (right) right.classList.remove('lit');
    void map.offsetWidth;
    var beat = APP.beat;
    mapAnimTimers.push(setTimeout(function () {
      setMapFocus(root, beat);
    }, 80));
  }

  function toggleMapDebug(root) {
    var map = root.querySelector('.mmap');
    if (map) map.classList.toggle('debug');
  }

  function buildOpening() {
    return '<div class="slide-body total-slide">' +
      '<div class="map-shell">' + buildMasterMap({ mode: 'opening' }) + '</div>' +
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
    { beats: 6, build: buildOpening },
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
    document.body.classList.toggle('on-master-map', APP.chapter === 0 && !!root.querySelector('.mmap-v77'));
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
    clearMapAnimTimers();
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
    var s = Math.min(viewport.clientWidth / 1920, (viewport.clientHeight - 48) / 1080);
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
        case 'r':
        case 'R':
          if (APP.chapter === 0) {
            e.preventDefault();
            replayMasterMap($('slide-canvas'));
          }
          break;
        case 'd':
        case 'D':
          if ($('slide-canvas').querySelector('.mmap-v77')) {
            e.preventDefault();
            toggleMapDebug($('slide-canvas'));
          }
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
