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
  var AI_ROUTE = 'M 400 505 C 610 270, 1310 270, 1520 505';
  var PAIN_ROUTE = 'M 400 625 C 610 860, 1310 860, 1520 625';

  function buildMasterMapSvg() {
    return '<svg class="master-map-routes" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<defs>' +
        '<marker id="arrow-ai" viewBox="0 0 10 10" markerWidth="9" markerHeight="9" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">' +
          '<path d="M 0 0 L 9 5 L 0 10 L 2.6 5 Z" fill="#48D7FF"></path>' +
        '</marker>' +
        '<marker id="arrow-current" viewBox="0 0 10 10" markerWidth="9" markerHeight="9" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">' +
          '<path d="M 0 0 L 9 5 L 0 10 L 2.6 5 Z" fill="#FF7A45"></path>' +
        '</marker>' +
      '</defs>' +
      '<path class="route-spine" pathLength="1000" d="M 413 565 L 1507 565"></path>' +
      '<path class="route-ai" pathLength="1000" marker-end="url(#arrow-ai)" d="' + AI_ROUTE + '"></path>' +
      '<path class="route-current" pathLength="1000" marker-end="url(#arrow-current)" d="' + PAIN_ROUTE + '"></path>' +
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

  /* ═══════════════════════════════════════════════════════════
     Page 3 — 舆情解析：三类信号来源，逐一聚焦
     ═══════════════════════════════════════════════════════════ */
  function buildParsePage() {
    var p = C().pages[2];
    return '<div class="slide-body">' +
      '<div class="slide-title-block" data-qa-id="page-title">' +
        '<span class="spx-micro">从总纲展开 · 舆情解析</span>' +
        '<h1 class="spx-display">' + esc(p.title) + '</h1>' +
        '<p class="spx-note">' + esc(p.subtitle) + '</p>' +
      '</div>' +
      '<div class="signal-grid">' +
        p.sourceColumns.map(function (col, i) {
          var evList = (col.evidence || []).filter(function (e) { return asset(e.id); });
          var groupAttr = evList.map(function (e) { return e.id; }).join(',');
          var chips = evList.map(function (e, idx) {
            return '<button class="ev-chip" data-ev-id="' + esc(e.id) + '" data-ev-group="' + esc(groupAttr) + '" data-ev-idx="' + idx + '">' + esc(e.label) + '</button>';
          }).join('');
          return '<div class="signal-col" data-focus="' + i + '"><h4>' + esc(col.name) + '</h4>' +
            '<div class="signal-stream">' + col.items.slice(0, 3).map(function (it) { return '<p class="signal-item">' + esc(it) + '</p>'; }).join('') + '</div>' +
            (chips ? '<div class="signal-evidence"><span class="signal-evidence-label">如何解决 · 已接入证据</span><div class="ev-chip-row">' + chips + '</div></div>' : '') +
          '</div>';
        }).join('') +
      '</div>' +
      '<p class="parse-conclusion is-dormant" data-conclusion data-qa-id="page-conclusion">' + esc(p.conclusion) + '</p>' +
    '</div>';
  }

  function applyParseBeat(root, beat) {
    var cols = root.querySelectorAll('.signal-col');
    cols.forEach(function (el, i) {
      el.classList.remove('is-primary', 'is-secondary');
      if (beat === 0) el.classList.add('is-secondary');
      else el.classList.add(i === beat - 1 ? 'is-primary' : 'is-secondary');
    });
    var conclusion = root.querySelector('[data-conclusion]');
    if (conclusion) conclusion.classList.toggle('is-dormant', beat < 3);
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
        '<div><label>归属厅 · 部门</label><span>' + esc(dims.org) + ' · ' + esc(dims.department) + '</span></div>' +
        '<div><label>涉及主体</label><span>' + evt.facts.mainSubjects.map(function (s) { return esc(swap(s, n)); }).join(' · ') + '</span></div>' +
        '<div class="dims-span2"><label>类目 · 场景</label><span>' + esc(dims.category) + ' → ' + esc(dims.categoryScene) + '</span></div>' +
        '<div><label>影响范围</label><span>' + (dims.impactScope || []).join(' · ') + '</span></div>' +
        '<div><label>当前阶段</label><span>' + esc(dims.claimStage) + '</span></div>' +
        '<div class="dims-span2"><label>下一步行动</label><span>' + esc(dims.nextActionShort) + '</span></div>' +
      '</div>' +
    '</div>' + evChips(cols[2] && cols[2].evidence);

    var col3Body = '<div class="alert-stack">' +
      '<div class="alert-box" data-box="normal"><h4>数量型预警</h4><p>普通事件累计到第 ' + APP.demoMessages.quantityThreshold + ' 条后触发，适合常规升温监测。</p></div>' +
      '<div class="alert-box hot" data-box="hot"><h4>性质型预警</h4><p>ICU、昏迷、药物中毒等高敏词，第一条即触发介入。</p></div>' +
    '</div>' + evChips(cols[3] && cols[3].evidence);

    var bodies = [col0Body, col1Body, col2Body, col3Body];

    return '<div class="slide-body">' +
      '<div class="slide-title-block" data-qa-id="page-title">' +
        '<span class="spx-micro">从总纲展开 · 舆情处置</span>' +
        '<h1 class="spx-display">' + esc(p.title) + '</h1>' +
        '<p class="spx-note">' + esc(p.subtitle) + '</p>' +
      '</div>' +
      '<div class="handle-grid">' +
        cols.map(function (col, i) {
          return (i > 0 ? '<div class="handle-arrow" aria-hidden="true">→</div>' : '') +
            '<div class="handle-col" data-focus="' + i + '">' +
              '<h4><span class="handle-kicker">' + esc(col.kicker) + '</span>' + esc(col.name) + '</h4>' +
              '<div class="handle-col-body">' + bodies[i] + '</div>' +
            '</div>';
        }).join('') +
      '</div>' +
      '<p class="handle-conclusion is-dormant" data-conclusion data-qa-id="page-conclusion">' + esc(p.conclusion) + '</p>' +
    '</div>';
  }

  function applyHandleBeat(root, beat) {
    var cols = root.querySelectorAll('.handle-col');
    cols.forEach(function (el, i) {
      el.classList.remove('is-primary', 'is-secondary');
      if (beat === 0) el.classList.add('is-secondary');
      else el.classList.add(i === beat - 1 ? 'is-primary' : 'is-secondary');
    });
    var conclusion = root.querySelector('[data-conclusion]');
    if (conclusion) conclusion.classList.toggle('is-dormant', beat < 4);
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
        '<span class="spx-micro">从总纲展开 · 舆情回溯</span>' +
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
        '<a class="ev-link" href="' + esc(APP.config.opsSystemUrl) + '" target="_blank" rel="noopener"><span>Evidence</span>舆情系统实时环境</a>' +
      '</div>' +
    '</div>';
  }

  function applyLoopBeat(root, beat) {
    var flow = root.querySelector('[data-loop-flow]');
    var sphere = root.querySelector('[data-sphere-panel]');
    if (flow) flow.classList.toggle('is-collapsed', beat >= 1);
    if (sphere) sphere.classList.toggle('is-on', beat >= 1);
    var conclusion = root.querySelector('[data-conclusion]');
    if (conclusion) conclusion.classList.toggle('is-dormant', beat < 1);
    if (beat >= 1) initSphere();
    else destroySphere();
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
        '<span class="spx-micro">回到总纲 · 闭环完成</span>' +
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

  var PAGES = [
    { beats: 2, build: buildOpening },
    { beats: 5, build: buildMasterTotalMap },
    { beats: 4, build: buildParsePage, evidence: parseEvidenceIds, apply: applyParseBeat },
    { beats: 5, build: buildHandlePage, evidence: handleEvidenceIds, apply: applyHandleBeat },
    { beats: 2, build: buildLoopPage, evidence: EVIDENCE.loop, apply: applyLoopBeat },
    { beats: 3, build: buildClosingPage }
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
      '.signal-col.is-primary',
      '.handle-col.is-primary',
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
    stage.style.transform = 'translateX(-50%) translateY(' + gapY.toFixed(2) + 'px) scale(' + s + ')';
  }

  function stabilizeLayout() {
    scale();
    requestAnimationFrame(function () {
      resetViewport();
      scale();
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
    img.alt = a.title;
    $('lb-cap').textContent = a.title + ' - ' + a.description;
    var src = $('lb-source');
    if (src) {
      if (a.sourceUrl) {
        src.href = a.sourceUrl;
        src.textContent = (a.sourceLabel || '打开来源网站') + ' ↗';
        src.classList.add('has-link');
      } else {
        src.removeAttribute('href');
        src.classList.remove('has-link');
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
    initPresenterMode();
    initData();
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
      setInterval(function () {
        var sec = Math.floor((Date.now() - APP.startTime) / 1000);
        $('clock').textContent = String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
      }, 1000);
    }
    if (APP.isPreview) {
      goChapter(APP.chapter, APP.beat);
    } else {
      render();
    }
    window.addEventListener('resize', stabilizeLayout);
    if (!APP.isPreview) broadcastPresenterState();
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
