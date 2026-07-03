/**
 * SpaceX Cinematic Deck — 内容 1:1 · DESIGN.md 电影级呈现
 */
(function () {
  'use strict';
  if (document.body && document.body.getAttribute('data-deck') !== 'spacex-cinematic') return;

  var APP = {
    config: null, content: null, manifest: null,
    demoMessages: null, demoEvent: null,
    chapter: 0, beat: 0, lastChapter: -1, busy: false,
    lbOpen: false, lbIdx: 0, lbImages: [], drawerOpen: false,
    startTime: Date.now()
  };
  window.APP = APP;

  function $(id) { return document.getElementById(id); }
  function C() { return APP.content; }
  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
  function rv(html, step) {
    return '<div class="rv" data-step="' + step + '">' + html + '</div>';
  }
  function panel(html, step) {
    return '<section class="step-panel" data-panel-step="' + step + '">' + html + '</section>';
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

  var BG = {
    signal: 'assets/generated/planet-signal-red.png',
    action: 'assets/generated/planet-action-blue.png',
    douban: 'assets/evidence/【豆瓣】数据爬虫.png',
    secretary: 'assets/evidence/【大秘书】原始私信内容.png',
    sphere: 'assets/evidence/3D场景球体截图.png',
    void: ''
  };

  function cine(photos, inner, extra) {
    var bgHtml = '';
    if (photos.left) {
      bgHtml += '<div class="cine-photo dual-left" style="background-image:url(' + esc(photos.left) + ')"></div>';
    }
    if (photos.right) {
      bgHtml += '<div class="cine-photo dual-right" style="background-image:url(' + esc(photos.right) + ')"></div>';
    }
    if (photos.single) {
      bgHtml += '<div class="cine-photo" style="background-image:url(' + esc(photos.single) + ')"></div>';
    }
    if (!bgHtml) bgHtml = '<div class="cine-photo" style="background:#000"></div>';
    return '<div class="cine is-active ' + (extra || '') + '">' +
      bgHtml +
      '<div class="cine-gradient ' + (photos.bottomHeavy ? 'bottom-heavy' : '') + '"></div>' +
      '<div class="cine-content">' + inner + '</div></div>';
  }

  function evBtns(ids, step) {
    if (!ids || !ids.length) return '';
    return rv('<div class="ev-row">' + ids.map(function (id) {
      var a = asset(id);
      if (!a) return '';
      return '<button class="btn-ghost sm ev-btn" data-ev-id="' + esc(id) + '">Evidence · ' + esc(a.title) + '</button>';
    }).join('') + '</div>', step);
  }

  function buildMiniMap(active) {
    var stages = C().stages;
    return rv('<div class="mini-chain">' +
      '<span class="t-micro">发现信号</span>' +
      stages.map(function (s) {
        return '<span class="mini-step ' + (s.id === active ? 'active' : '') + '">' + esc(s.num) + ' ' + esc(s.name) + '</span>';
      }).join('<span class="t-micro">→</span>') +
      '<span class="mini-step lit">统一行动</span></div>', 0);
  }

  function buildMasterChain(opts) {
    opts = opts || {};
    var m = C().masterMap;
    var mode = opts.mode || 'default';
    var stages = C().stages;

    var nodes = stages.map(function (s, i) {
      return '<div class="chain-node" data-stage="' + i + '">' +
        '<div class="t-micro">' + esc(s.num) + '</div>' +
        '<div class="t-nav-bold">' + esc(s.name) + '</div></div>';
    }).join('<div class="chain-arrow"></div>');

    var aiOrbit = stages.map(function (s) {
      return '<div class="orbit-line ai">' + esc(s.aiPath) + '</div>';
    }).join('');
    var painOrbit = stages.map(function (s) {
      return '<div class="orbit-line pain">' + esc(s.currentPain) + '</div>';
    }).join('');

    return '<div class="chain-scene mmap" data-map-mode="' + esc(mode) + '" data-stage="0">' +
      '<div class="chain-hd">' +
        '<div class="t-micro">' + esc(m.kicker || '总纲 · 主脉络') + '</div>' +
        '<h1 class="t-display">' + esc(m.title) + '</h1>' +
        '<p class="t-body-cn">' + esc(m.subtitle) + '</p>' +
      '</div>' +
      '<div class="orbit-row">' +
        '<div class="orbit-col"><div class="t-micro">AI 方向</div>' + aiOrbit + '</div>' +
      '</div>' +
      '<div class="chain-row">' +
        '<div class="chain-node end" data-end="left"><div class="t-micro">起点</div><div class="t-nav-bold">' + esc(m.leftTitle) + '</div></div>' +
        '<div class="chain-arrow"></div>' + nodes + '<div class="chain-arrow"></div>' +
        '<div class="chain-node end" data-end="right"><div class="t-micro">终点</div><div class="t-nav-bold">' + esc(m.rightTitle) + '</div></div>' +
      '</div>' +
      '<div class="orbit-row">' +
        '<div class="orbit-col"><div class="t-micro">当前痛点</div>' + painOrbit + '</div>' +
      '</div>' +
      '<div class="chain-ft">' +
        '<div class="t-nav-bold">发现信号 · 缩短距离 · 统一行动</div>' +
        '<p class="t-body-cn">' + (C().corePropositionHtml || esc(C().coreProposition)) + '</p>' +
      '</div></div>';
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
    }
    if (mode === 'fracture') focus = Math.max(-1, Math.min(2, beat - 1));
    if (mode === 'complete') focus = -1;

    map.querySelectorAll('.chain-node[data-stage]').forEach(function (el) {
      var i = +el.dataset.stage;
      var on = mode === 'complete' || (mode === 'opening' && (i === focus || beat >= 4));
      el.classList.toggle('on', on);
      el.classList.toggle('focus', i === focus && mode !== 'complete');
    });
    map.querySelectorAll('.chain-arrow').forEach(function (el, idx) {
      el.classList.toggle('on', beat >= 1);
    });
    map.querySelectorAll('.orbit-line').forEach(function (el) {
      el.classList.toggle('on', beat >= 1);
    });
    var right = map.querySelector('[data-end="right"]');
    if (right) right.classList.toggle('on', beat >= 4 || mode === 'complete');
    var left = map.querySelector('[data-end="left"]');
    if (left) left.classList.toggle('on', beat >= 0);
    root.querySelectorAll('.break-item').forEach(function (el, i) {
      el.classList.toggle('focus', mode === 'fracture' && beat === i + 1);
    });
  }

  function buildOpening() {
    var p = C().pages[0];
    var inner = buildMasterChain({ mode: 'opening' }) +
      '<div class="callout-stack">' +
        rv('<div class="callout-line"><div class="t-nav-bold">01 舆情解析</div><p class="t-body-cn">前期要把多渠道碎片，先拼成同一件事。</p></div>', 1) +
        rv('<div class="callout-line"><div class="t-nav-bold">02 舆情处置</div><p class="t-body-cn">中期要减少转述损耗，让责任和时限直接出现。</p></div>', 2) +
        rv('<div class="callout-line"><div class="t-nav-bold">03 舆情回溯</div><p class="t-body-cn">长期要沉淀纠错机制，避免同类风险复发。</p></div>', 3) +
        rv('<div class="callout-line"><div class="t-nav-bold">今天的核心</div><p class="t-body-cn"><strong>' + esc(p.title).replace(/\n/g, ' · ') + '</strong><br>' + esc(p.subtitle) + '</p></div>', 4) +
      '</div>';
    return cine({ left: BG.signal, right: BG.action }, inner, 'scene-opening');
  }

  function buildFracturePage() {
    var inner =
      rv('<div class="page-head"><div class="t-micro">现实断层 · 姜添 / 萨满事件</div>' +
        '<h1 class="t-display" style="font-size:32px">看见风险，不等于组织已经完成行动</h1>' +
        '<p class="t-body-cn">现有爬虫、群预警和沉淀表已经证明"信号能被看见"；真正的断层在理解、协同和纠错。</p></div>', 0) +
      buildMasterChain({ mode: 'fracture' }) +
      '<div class="break-grid">' +
        rv('<div class="break-item"><span>解析断层</span><b>多渠道仍需人工关联</b><p>黑话、别称、同一事件归并，仍然依赖经验判断。</p></div>', 1) +
        rv('<div class="break-item"><span>处置断层</span><b>多层转述带来信息损耗</b><p>厅管、粉运、经纪人、法务之间需要同一份事实底稿。</p></div>', 2) +
        rv('<div class="break-item"><span>回溯断层</span><b>解释回应后容易复发</b><p>缺少整改责任、验证路径和复发识别机制。</p></div>', 3) +
      '</div>' +
      rv('<p class="one-line">所以这次不是做一个工具，而是把"发现信号 → 统一行动"的距离压短。</p>' + evBtns(EVIDENCE.page2, 4), 4);
    return cine({ single: BG.douban, bottomHeavy: true }, inner);
  }

  function buildParsePage() {
    var p = C().pages[2];
    var oldItems = ['分渠道人工看', '复制截图和链接', '人工判断黑话', '人工判断是否同一事件'];
    var newItems = ['多源接入', '主体归一', '会话聚合', '高敏识别', '事件对象'];
    var fusion = ['多源信号', '主体归一', '会话聚合', '统一事件', '高敏识别'];
    var inner =
      rv('<div class="page-head"><div class="t-micro">从总纲展开 · 舆情解析</div>' +
        '<h1 class="t-display" style="font-size:34px">' + esc(p.title) + '</h1>' +
        '<p class="t-body-cn">' + esc(p.subtitle) + '</p></div>', 0) +
      buildMiniMap('parse') +
      rv('<div class="dual-col">' +
        '<div><div class="col-hd">旧流程 · 人工拼图</div>' + oldItems.map(function (t) { return '<div class="col-line">' + esc(t) + '</div>'; }).join('') + '</div>' +
        '<div><div class="col-hd">AI 路径 · 先成事件</div>' + newItems.map(function (t) { return '<div class="col-line">' + esc(t) + '</div>'; }).join('') + '</div>' +
      '</div>', 1) +
      rv('<div class="source-trio">' + p.sourceColumns.map(function (col) {
        return '<div class="source-block"><h4>' + esc(col.name) + '</h4>' +
          col.items.map(function (it) { return '<p>' + esc(it) + '</p>'; }).join('') + '</div>';
      }).join('') + '</div>', 2) +
      rv('<div class="fusion">' + fusion.map(function (t, i) {
        return (i ? '<i>→</i>' : '') + '<span data-fi="' + i + '">' + esc(t) + '</span>';
      }).join('') + '</div><p class="one-line">' + esc(p.conclusion) + '</p>', 3);
    return cine({ single: BG.signal, bottomHeavy: true }, inner);
  }

  function messageRows() {
    var n = names();
    return APP.demoMessages.messages.map(function (m, i) {
      return '<div class="type-row ' + (m.sensitive ? 'hot' : '') + '" data-msg="' + i + '">' +
        '<span class="type-idx">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="type-time">' + esc(m.time.split(' ')[1]) + '</span>' +
        '<span class="type-main">' + esc(swap(m.content, n)) + '</span>' +
        '<span class="type-tags">' + m.tags.map(esc).join(' / ') + '</span></div>';
    }).join('');
  }

  function eventDossier() {
    var evt = APP.demoEvent;
    var n = names();
    return '<div class="dossier">' +
      '<div class="dossier-id"><span class="t-micro">' + esc(evt.id) + '</span><span class="t-nav-bold">' + esc(evt.priority) + '</span></div>' +
      '<h2>' + esc(swap(evt.name, n)) + '</h2>' +
      '<div class="dossier-meta">' +
        '<span>' + esc(evt.riskLevel) + '</span><span>' + esc(evt.stage) + '</span>' +
        '<span>' + esc(evt.duration) + '</span><span>' + evt.facts.sessionCount + ' 会话 / ' + evt.facts.messageCount + ' 消息</span>' +
      '</div>' +
      '<div class="tag-row">' + evt.aiInsights.riskTags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' +
      '<p class="t-body-cn">AI 只形成事实底稿：诉求、风险标签、待核验事项和建议角色，不替代最终责任判断。</p></div>';
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
    var inner =
      rv('<div class="page-head"><div class="t-micro">核心演示 · 舆情处置</div>' +
        '<h1 class="t-display" style="font-size:34px">' + esc(p.title) + '</h1>' +
        '<p class="t-body-cn">' + esc(p.subtitle) + '</p></div>', 0) +
      buildMiniMap('handle') +
      '<div class="step-zone">' +
        panel('<div><h2 class="t-nav-bold" style="font-size:18px;margin-bottom:12px">让同一件事，转化成同一套行动</h2>' +
          '<p class="t-body-cn">九叔 - 哈哈案例，本地确定性仿真。演示重点不是判断谁对谁错，而是组织如何先基于同一份事实协同。</p></div>', 0) +
        panel('<div><div class="t-nav-bold" style="margin-bottom:12px">人工转述链</div><div class="relay">' +
          ['舆情同学', '大秘书', '厅管', '主播管理', '粉丝运营', '法务', '业务负责人'].map(function (r, i, a) {
            return '<span>' + esc(r) + '</span>' + (i < a.length - 1 ? '<i></i>' : '');
          }).join('') +
          '</div><p class="t-body-cn" style="margin-top:12px">每多一层转述，就多一次信息损耗、口径偏差和责任模糊。</p></div>', 1) +
        panel('<div><div class="t-nav-bold" style="margin-bottom:12px">8 条私信流入</div><div class="type-list">' + messageRows() + '</div></div>', 2) +
        panel(eventDossier(), 3) +
        panel('<div class="q-grid">' + five.map(function (q, i) {
          return '<div class="q-item"><span>Q' + (i + 1) + '</span><b>' + esc(q[0]) + '</b><p>' + esc(q[1]) + '</p></div>';
        }).join('') + '</div>', 4) +
        panel('<div class="action-list"><div class="t-nav-bold" style="margin-bottom:12px">责任动作清单</div>' +
          actions.map(function (a) {
            return '<div class="action-item"><b>' + esc(a[0]) + '</b><span>' + esc(a[1]) + '</span><em>' + esc(a[2]) + '</em></div>';
          }).join('') + '</div>', 5) +
        panel('<div class="alert-duo"><div><h3>数量型预警</h3><p>普通事件累计到第 ' + APP.demoMessages.quantityThreshold + ' 条后触发。</p><b>适合常规升温监测</b></div>' +
          '<div class="hot"><h3>性质型预警</h3><p>ICU、昏迷、药物中毒、法律责任等高敏词，第一条就值得介入。</p><b>适合高敏风险前置</b></div></div>', 6) +
        panel('<div class="boundary"><h3>人机边界</h3><p>' + esc(p.aiBoundary.not) + '</p><ul>' +
          p.aiBoundary.does.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') +
          '</ul><strong>' + esc(p.conclusion) + '</strong></div>' + evBtns(EVIDENCE.page4, 0), 7) +
      '</div>';
    return cine({ single: BG.secretary, bottomHeavy: true }, inner);
  }

  function buildLoopPage() {
    var p = C().pages[4];
    var sc = APP.config.sphere.currentScene;
    var inner =
      rv('<div class="page-head"><div class="t-micro">从总纲展开 · 舆情闭环</div>' +
        '<h1 class="t-display" style="font-size:34px">' + esc(p.title) + '</h1>' +
        '<p class="t-body-cn">' + esc(p.subtitle) + '</p></div>', 0) +
      buildMiniMap('loop') +
      '<div class="step-zone">' +
        panel('<div><div class="t-nav-bold" style="font-size:16px;margin-bottom:8px">旧收尾解决的是"这次怎么结束"</div>' +
          '<p class="t-body-cn">回复、公告、处罚之后，还缺三个问题：为什么发生、谁整改、如何验证不复发。</p></div>', 0) +
        panel('<div class="deposit-row">' +
          ['风险场景', '历史关联', '根因纠正', '责任人验证', '复发预警'].map(function (t) {
            return '<div><b>' + esc(t) + '</b><p>从单次事件沉淀为下一次可调用的判断依据。</p></div>';
          }).join('') + '</div>', 1) +
        panel('<div class="t-nav-bold" style="font-size:14px">' + esc(APP.demoEvent.id) + ' → 月报 / SOP / 场景库 → 组织资产</div>', 2) +
        panel('<div class="sphere-layout"><div class="sphere-frame" id="sphere-box">' +
          '<iframe src="' + esc(APP.config.sphere.url) + '" title="风险场景库"></iframe>' +
          '<img class="sphere-fb" src="' + esc(APP.config.sphere.fallbackImage) + '" alt=""></div>' +
          '<div class="scene-info"><span class="t-micro">' + esc(sc.code) + '</span>' +
          '<h3>' + esc(sc.name) + '</h3>' +
          '<p>类目 ' + esc(sc.category) + ' · 权重 ' + esc(sc.weight) + ' · ' + esc(sc.alertLevel) + '</p>' +
          '<p>角色 ' + sc.roles.map(esc).join(' / ') + '</p></div></div>', 3) +
        panel('<div><div class="t-nav-bold" style="margin-bottom:8px">这次事件如何服务下一次</div>' +
          '<p class="t-body-cn">它不应只留在群聊，而要进入月报、场景库和 SOP，成为后续识别、分发、复盘的共同语料。</p>' +
          '<p class="t-nav-bold" style="margin-top:12px;font-size:12px">' + esc(sc.sop) + '</p></div>', 4) +
        panel('<p class="one-line">' + esc(p.conclusion) + '</p>' + evBtns(EVIDENCE.page5, 0), 5) +
      '</div>';
    return cine({ single: BG.sphere, bottomHeavy: true }, inner);
  }

  function buildClosingPage() {
    var status = [
      ['已跑通', '豆瓣监测、大秘书私信解析、事件卡、月报沉淀'],
      ['正在接通', '机器人预警、责任分发、处置状态追踪'],
      ['逐步扩展', '粉丝运营、内容策划、主播管理、法务协同']
    ];
    var inner = buildMasterChain({ mode: 'complete' }) +
      '<div class="closing-panels">' +
        rv('<div class="rep-row">' + C().replication.map(function (r) {
          return '<div><b>' + esc(r.role) + '</b><p>' + esc(r.desc) + '</p></div>';
        }).join('') + '</div>', 1) +
        rv('<div class="status-row">' + status.map(function (s) {
          return '<div><span>' + esc(s[0]) + '</span><p>' + esc(s[1]) + '</p></div>';
        }).join('') + '</div>', 2) +
        rv('<div class="final-block">' + C().closing.copyLines.map(function (l) {
          return '<p>' + esc(l) + '</p>';
        }).join('') + '<h2>' + esc(C().coreProposition) + '</h2></div>', 3) +
      '</div>';
    return cine({ left: BG.signal, right: BG.action }, inner, 'scene-closing');
  }

  var PAGES = [
    { beats: 5, build: buildOpening },
    { beats: 5, build: buildFracturePage, evidence: EVIDENCE.page2 },
    { beats: 4, build: buildParsePage },
    { beats: 8, build: buildDemoPage, evidence: EVIDENCE.page4 },
    { beats: 6, build: buildLoopPage, evidence: EVIDENCE.page5 },
    { beats: 4, build: buildClosingPage }
  ];

  function applyBeat(root, beat) {
    root.dataset.beat = beat;
    root.className = 'spx-canvas beat-' + beat;
    root.querySelectorAll('.rv').forEach(function (el) {
      el.classList.toggle('on', +el.dataset.step <= beat);
    });
    root.querySelectorAll('[data-panel-step]').forEach(function (el) {
      var step = +el.dataset.panelStep;
      el.classList.toggle('current', step === beat);
      el.classList.toggle('past', step < beat);
    });
    setMapFocus(root, beat);
    root.querySelectorAll('.fusion span').forEach(function (el, i) {
      el.classList.toggle('on', beat >= 3 && i <= beat - 2);
    });
    if (APP.chapter === 3 && beat >= 2) {
      root.querySelectorAll('.type-row').forEach(function (el, i) {
        el.classList.toggle('on', beat >= 2);
        el.style.transitionDelay = (i * 0.07) + 's';
      });
    }
  }

  function buildChapterNav() {
    $('chapter-nav').innerHTML = C().pages.map(function (p, i) {
      return '<div class="spx-ch" data-ch="' + i + '">' +
        '<span class="spx-ch-code">' + esc(p.code) + '</span>' +
        '<span class="spx-ch-label">' + esc(p.tag) + '</span>' +
        '<span class="spx-ch-bar"></span></div>';
    }).join('');
    $('chapter-nav').querySelectorAll('.spx-ch').forEach(function (el) {
      el.onclick = function () { goChapter(+el.dataset.ch, 0); };
    });
  }

  function updateNav() {
    var pg = PAGES[APP.chapter];
    $('chapter-nav').querySelectorAll('.spx-ch').forEach(function (el, i) {
      el.classList.toggle('active', i === APP.chapter);
      el.classList.toggle('done', i < APP.chapter);
      var pct = i === APP.chapter ? ((APP.beat + 1) / pg.beats) : (i < APP.chapter ? 1 : 0);
      el.style.setProperty('--beat-pct', pct);
    });
    var total = 0, done = 0;
    PAGES.forEach(function (p, i) {
      total += p.beats;
      if (i < APP.chapter) done += p.beats;
      else if (i === APP.chapter) done += APP.beat + 1;
    });
    $('progress-fill').style.width = (done / total * 100) + '%';
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
      }, APP.lastChapter < 0 ? 0 : 200);
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
    var wrap = $('scene-viewport');
    var s = Math.min(wrap.clientWidth / 1920, wrap.clientHeight / 1032);
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
    if (APP.beat < pg.beats - 1) { APP.beat++; render(); }
    else if (APP.chapter < PAGES.length - 1) goChapter(APP.chapter + 1, 0);
  }

  function retreat() {
    if (APP.busy) return;
    if (APP.beat > 0) { APP.beat--; render(); }
    else if (APP.chapter > 0) goChapter(APP.chapter - 1, PAGES[APP.chapter - 1].beats - 1);
  }

  function initSphere() {
    var box = $('sphere-box');
    if (!box || box.dataset.ok) return;
    box.dataset.ok = '1';
    setTimeout(function () {
      if (!navigator.onLine) box.classList.add('fallback');
    }, APP.config.sphere.loadTimeoutMs || 8000);
    box.querySelector('iframe').addEventListener('error', function () {
      box.classList.add('fallback');
    });
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
    $('lb-cap').textContent = a.title + ' — ' + a.description;
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
    div.className = 'ev-drawer';
    div.id = 'evidence-drawer';
    div.innerHTML =
      '<button class="ev-drawer-close" id="drawer-close" aria-label="关闭">×</button>' +
      '<div class="ev-drawer-main"><img id="drawer-img" alt="">' +
      '<div class="ev-drawer-copy"><span id="drawer-count" class="t-micro"></span>' +
      '<h3 id="drawer-title"></h3><p id="drawer-desc"></p></div></div>' +
      '<div class="ev-thumbs" id="drawer-thumbs"></div>';
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
      return '<button class="' + (i === APP.lbIdx ? 'active' : '') + '" data-idx="' + i + '">' +
        '<img src="' + esc(item.path) + '" alt=""><span>' + esc(item.title) + '</span></button>';
    }).join('');
    $('drawer-thumbs').querySelectorAll('button').forEach(function (btn) {
      btn.onclick = function () { APP.lbIdx = +btn.dataset.idx; syncDrawer(); };
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
        case 'ArrowRight': case 'PageDown': case ' ':
          e.preventDefault(); advance(); break;
        case 'ArrowLeft': case 'PageUp':
          e.preventDefault(); retreat(); break;
        case 'e': case 'E':
          if (PAGES[APP.chapter].evidence) {
            e.preventDefault();
            openDrawer(PAGES[APP.chapter].evidence);
          }
          break;
        case 'f': case 'F':
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
