/**
 * 决赛演讲板 v4 — 丝滑工作链 + 强关联过渡 + 投影级字号
 */
(function () {
  'use strict';

  const DECK = [
    { n:'01', t:'智能感知', status:'live', statusLabel:'LIVE · 已运行',
      d:'多源信号自动汇入系统，不再依赖人工搬运',
      detail:'豆瓣小组 · 抖音评论 · 大秘书私信 · 小秘书投诉(接通中) · 业务反馈',
      tags:['豆瓣','评论','大秘书','业务群'] },
    { n:'02', t:'智能研判', status:'live', statusLabel:'LIVE · 已运行',
      d:'非结构化内容 → 可复核的结构化风险判断',
      detail:'主体识别 · 诉求提炼 · 会话聚合 · 事件归并 · 高敏性质识别 · 场景归类',
      tags:['主体','诉求','归并','高敏'] },
    { n:'03', t:'行动协同', status:'beta', statusLabel:'BETA · 接通中',
      d:'从「知道」到「推动负责人行动」的关键一段',
      detail:'数量阈值预警 · 性质直接预警 · 飞书推送 · 责任角色分发 · 介入状态跟踪',
      tags:['双预警','飞书','分发','跟踪'] },
    { n:'04', t:'风险沉淀', status:'next', statusLabel:'NEXT · 持续建设',
      d:'一次舆情结束，应成为组织可调用的资产',
      detail:'17类目 · 204场景 · 主播档案 · 相似召回 · SOP · 月报 · 决策支持',
      tags:['场景库','SOP','月报','召回'] }
  ];

  const DEMO_PIPE = ['私信流入','AI解析','事件聚合','双重预警','机器人推送'];

  const CHAPTERS = [
    { id:0, tag:'开场', beats:3, evidence:false,
      render(b) {
        if (b===0) return tag('01','核心命题')+`
          <h1 class="hero-title rv d1">当风险已经被看见</h1>
          <p class="hero-sub rv d2">为什么仍然可能失控？</p>
          <p class="golden rv d3">AI 不是多写一份报告，而是缩短从「知道风险」到「推动行动」的距离。</p>`;
        if (b===1) return tag('01','信息散落')+`
          <h1 class="hero-title sm rv d1">知道 ≠ 行动</h1>
          <p class="hero-sub rv d2">信号在豆瓣、大秘书、业务群、社媒同时出现——彼此无法连成判断</p>
          <div class="visual rv d3"><div class="chip-row" id="chips">${[
            ['豆瓣','讨论升温'],['大秘书','追问结果'],['业务群','是否停播'],['社媒','扩散风险'],['粉丝运营','集中反馈']
          ].map(([s,t],i)=>`<div class="chip rv d${i+1}" data-ci="${i}"><div class="c-src">${s}</div>${t}</div>`).join('')}</div></div>`;
        return tag('01','结论')+`
          <h1 class="hero-title signal rv d1">缩短从知道到行动的距离</h1>
          <p class="core-line rv d2">舆情难点不是信息不足，而是信息无法形成统一判断和行动。</p>
          ${bridge('用一个真实案例：主播争议如何升级为公司级风险')}`;
      }
    },
    { id:1, tag:'案例', beats:4, evidence:true,
      intro:'豆瓣采集 · 群预警 · 姜添/萨满趋势 — 证明感知能力已运行',
      render(b) {
        if (b===0) return tag('02','风险升级')+`
          <h1 class="hero-title sm rv d1">一条主播争议</h1>
          <p class="hero-sub rv d2">如何升级为公司级风险 · 年初姜添/萨满案例</p>`;
        if (b===1) return tag('02','升级链')+`
          <p class="hero-sub rv d1" style="margin-bottom:28px">风险传导链 — 每一步都更接近公司级</p>
          <div class="visual rv d2"><div class="tl" id="tl">${['早期信号','粉圈扩散','举报路径','监管介入','公司级影响'].map((t,i)=>
            `<div class="tl-i" data-ti="${i}"><div class="tl-dot">${String(i+1).padStart(2,'0')}</div><div class="tl-txt">${t}</div></div>`).join('')}</div></div>`;
        if (b===2) return tag('02','范式对比')+`
          <h1 class="hero-title sm rv d1">从人盯信息 → 系统感知</h1>
          <div class="visual rv d2"><div class="vs-arena">
            <div class="vs-side vs-old"><h3>旧 · 人盯</h3><div class="vs-sub">MANUAL</div>
              ${['人工巡查','截图散落','Excel整理','口头推动'].map(t=>`<div class="vp">${t}</div>`).join('')}</div>
            <div class="vs-side vs-new"><h3>新 · 系统</h3><div class="vs-sub">AI-DRIVEN</div>
              ${['自动采集','飞书沉淀','AI打标','自动预警'].map(t=>`<div class="vp">${t}</div>`).join('')}</div>
            <div class="vs-badge">VS</div></div></div>`;
        return tag('02','行动距离')+`
          <h1 class="hero-title sm rv d1">看见了信号</h1>
          <p class="hero-sub rv d2">但距离统一行动仍然很远</p>
          <p class="core-line rv d3">多渠道人工关联 · 责任角色不清 · 跨部门仍靠人推</p>
          <div class="evidence-cue rv d3" data-ev>按 <kbd>E</kbd> 打开「结合AI成果演示」</div>`;
      }
    },
    { id:2, tag:'工作链', beats:6, evidence:false, chainMode:true,
      render(b) {
        if (b===0) return tag('03','工作链')+`
          <h1 class="hero-title sm rv d1">AI 重构的不是工具</h1>
          <p class="hero-sub rv d2">而是整条舆情工作链</p>
          <p class="hero-support rv d3">接下来用实验舱逐段点亮 — 01→04 丝滑切换，不停顿黑屏</p>`;
        if (b>=5) return tag('03','边界')+`
          <h1 class="hero-title sm rv d1">AI 聚合提醒 · 人核验决策</h1>
          <p class="core-line rv d2">PUBLIC OPINION OPS = DATA × AI × SOP × DECISION</p>
          ${bridge('现场演示：一条高敏投诉如何形成事件')}`;
        return renderChainShell(b - 1);
      }
    },
    { id:3, tag:'演示', beats:6, evidence:true,
      intro:'原始私信 · OCR · AI解析字段 — 证明能力已运行',
      render(b) {
        const n = names();
        const pipe = demoPipe(b);
        if (b===0) return tag('04','现场演示')+pipe+`
          <h1 class="hero-title sm rv d1">一条高敏投诉</h1>
          <p class="hero-sub rv d2">${n.hostA}—${n.hostB} 解绑及健康高敏争议</p>
          <p class="hero-support rv d3 mono signal">DEMO · 基于真实业务流程的确定性仿真</p>`;
        if (b===1) return tag('04','信息流入')+pipe+`
          <h1 class="hero-title sm rv d1">大秘书私信持续进入</h1>
          <div class="visual rv d2"><div class="struct-3col">
            <div class="panel"><div class="panel-tag">RAW · 非结构化</div>
              <div class="raw-text">用户投诉${n.hostA}长期刺激${n.hostB}…<br>提及 ICU、昏迷、药物中毒…<br>要求停播、公告、处罚、法律责任…</div></div>
            <div class="engine-mid"><div class="em">⚙</div><div class="em-lbl">流式接入</div></div>
            <div class="panel" style="border-color:rgba(92,225,230,.35)"><div class="panel-tag signal">COUNTER</div>
              <div class="raw-text signal" style="font-size:72px;font-family:'Barlow Condensed',sans-serif;line-height:1">8</div>
              <div class="raw-text" style="font-size:20px;margin-top:8px">messages · 4 sessions</div></div>
          </div></div>`;
        if (b===2) return tag('04','AI解析')+pipe+`
          <h1 class="hero-title sm rv d1">非结构化 → 结构化</h1>
          <div class="visual rv d2"><div class="struct-3col">
            <div class="panel"><div class="panel-tag">私信原文</div><div class="raw-text">用户咨询${n.hostB}病情，提及 ICU 与昏迷…</div></div>
            <div class="engine-mid"><div class="em">AI</div><div class="em-lbl">解析引擎</div></div>
            <div class="panel" style="border-color:rgba(92,225,230,.35)">
              ${[['投诉对象','T.'+n.hostA],['风险标签','ICU·昏迷·药物中毒','hot'],['预警','P1 立即关注','hot'],['研判','医疗高敏升级，不判断因果',''],['诉求','调查·停播·公告·处罚','']].map(([k,v,c])=>
                `<div class="field-row"><span class="fk">${k}</span><span class="fv ${c||''}">${v}</span></div>`).join('')}
            </div></div></div>`;
        if (b===3) return tag('04','事件聚合')+pipe+`
          <h1 class="hero-title sm rv d1">聚合成事件卡</h1>
          <div class="visual rv d2"><div class="ev-card">
            <div class="ev-card-head"><div class="mono" style="font-size:14px;color:var(--ink-3)">EVT-2026-0147</div>
              <div class="ev-card-name">${n.hostA}—${n.hostB} 健康高敏争议</div>
              <div class="ev-card-meta"><span class="ember">高敏复核</span><span>P1</span><span>8会话 / 23消息</span><span>持续新增</span></div></div>
            <div class="ev-card-em">AI 识别风险升级信号 — 不判断谁应对病情负责</div></div></div>`;
        if (b===4) return tag('04','双重预警')+pipe+`
          <h1 class="hero-title sm ember rv d1">有些问题，第一条就值得介入</h1>
          <div class="visual rv d2"><div class="alert2">
            <div class="alert-box"><h4>数量型预警</h4><p>普通事件达到阈值后触发</p>
              ${[1,2,3,4,5].map(x=>`<div class="alert-line${x>=5?' on':''}"><span class="dot"></span>第 ${x} 条消息进入</div>`).join('')}</div>
            <div class="alert-box"><h4 class="ember">性质型预警</h4><p>高敏性质 · 第一条即介入</p>
              <div class="alert-line danger on"><span class="dot"></span>医疗高敏 · 第 1 条</div>
              <div class="alert-line danger on"><span class="dot"></span>ICU / 昏迷 / 药物中毒</div></div>
          </div></div>
          <div class="evidence-cue rv d3" data-ev>按 <kbd>E</kbd> 打开「结合AI成果演示」</div>`;
        return tag('04','预警卡')+pipe+`
          <h1 class="hero-title sm rv d1">高敏风险预警</h1>
          <div class="visual rv d2"><div class="bot">
            <div class="bot-head"><h4>飞书机器人推送</h4><span class="mono warn" style="font-size:13px">PROTOTYPE · 接通中</span></div>
            <div class="bot-body">
              <div class="bot-row"><span class="bl">事件</span>${n.hostA}—${n.hostB} 健康与解绑争议</div>
              <div class="bot-row"><span class="bl">触发</span>医疗高敏词 + 投诉持续增长</div>
              <div class="bot-row"><span class="bl">诉求</span>调查 · 停播 · 公告 · 处罚</div>
              <div class="bot-row"><span class="bl">时限</span><span class="ember">立即</span></div>
            </div></div></div>
          ${bridge('预警不是终点 — 闭环才是舆情价值')}`;
      }
    },
    { id:4, tag:'闭环', beats:4, evidence:true,
      intro:'月报大盘 · 3D知识宇宙 · 事件卡 — 证明可沉淀为组织资产',
      render(b) {
        if (b===0) return tag('05','闭环')+`
          <h1 class="hero-title sm rv d1">预警不是终点</h1>
          <p class="hero-sub rv d2">闭环才是舆情价值</p>
          <p class="hero-support rv d3">发现 → 聚合 → 复核 → 分发 → 处置 → 沉淀</p>`;
        if (b===1) return tag('05','人机协同')+`
          <h1 class="hero-title sm rv d1">AI 与人，各守边界</h1>
          <div class="visual rv d2"><div class="loop-lanes">
            <div class="loop-lane ai"><h4>AI 泳道</h4>
              ${['聚合同类信息','提炼事实与诉求','追踪新增趋势','关联历史问题','生成行动清单','跟踪介入状态'].map((t,i)=>
                `<div class="loop-item on rv d${i+1}">${t}</div>`).join('')}</div>
            <div class="loop-lane human"><h4>人工泳道</h4>
              ${['核验信息真实性','判断直接因果','评估法律责任','统一回复口径','粉丝沟通','作出最终决策'].map((t,i)=>
                `<div class="loop-item on rv d${i+1}">${t}</div>`).join('')}</div>
          </div></div>`;
        if (b===2) return tag('05','知识宇宙')+`
          <h1 class="hero-title sm rv d1">事件进入知识宇宙</h1>
          <p class="hero-sub rv d2">17 类目 · 204 个风险场景 · 组织级资产</p>
          <div class="visual rv d3"><div class="sphere-box" id="sphere-box">
            <iframe src="${APP.config.sphere.url}" title="3D"></iframe>
            <img class="sphere-fb" src="${APP.config.sphere.fallbackImage}" alt=""/></div></div>
          <div class="evidence-cue rv d3" data-ev>按 <kbd>E</kbd> 打开「结合AI成果演示」</div>`;
        return tag('05','资产')+`
          <h1 class="hero-title sm signal rv d1">不应只留在群聊里</h1>
          <p class="core-line rv d2">应成为下一次判断可调用的组织资产</p>
          ${bridge('这套方法，可以复制到公司其他岗位')}`;
      }
    },
    { id:5, tag:'收束', beats:3, evidence:false,
      render(b) {
        if (b===0) return tag('06','提效')+`
          <h1 class="hero-title sm rv d1">提效不是感觉</h1>
          <p class="hero-sub rv d2">而是可量化的工作方式变化</p>
          <div class="visual rv d3"><div class="metrics-hero"><div class="big">70<span class="suf">%+</span></div><div class="lbl">整理耗时下降</div></div>
          <div class="metrics-row">${[['3-5×','报告效率'],['6+','覆盖渠道'],['204','风险场景'],['17','一级类目']].map(([n,d])=>
            `<div class="metric-box"><div class="num">${n}</div><div class="desc">${d}</div></div>`).join('')}</div></div>`;
        if (b===1) return tag('06','复制')+`
          <h1 class="hero-title sm rv d1">ABCD · 可复制路径</h1>
          <div class="visual rv d2"><div class="abcd">${[
            ['A','采集','多源自动流入系统'],['B','识别','AI结构化打标初筛'],['C','分析','趋势预警与研判'],['D','系统','沉淀为组织工具']
          ].map(([l,t,d],i)=>`<div class="abcd-card on rv d${i+1}"><div class="letter">${l}</div><h4>${t}</h4><p>${d}</p></div>`).join('')}</div></div>`;
        return tag('06','收束')+`
          <div class="outro rv d1">
            <p class="l1">今天展示的，不是一套已完成的庞大系统，<br>而是一条已经跑通、可复制的工作范式。</p>
            <p class="l2">AI 重构的不是一个页面<br>而是一种工作范式</p>
          </div>`;
      }
    }
  ];

  function tag(idx, cn) { return `<div class="scene-tag rv"><span class="idx">${idx}</span><span>/ ${cn}</span></div>`; }
  function bridge(t) { return `<div class="chapter-bridge rv d3"><span class="cb-arrow">→</span><span>${t}</span></div>`; }
  function names() { return APP.config.useAnonymizedNames ? APP.config.names.anon : APP.config.names.real; }
  function demoPipe(b) {
    return `<div class="demo-pipeline rv">${DEMO_PIPE.map((s,i)=>
      `${i>0?'<span class="demo-pipe-arrow">→</span>':''}<span class="demo-pipe-step${i<=b?' on':''}">${s}</span>`).join('')}</div>`;
  }

  function renderChainShell(stepIdx) {
    const pct = stepIdx / (DECK.length - 1) * 100;
    return `<div class="chain-stage" id="chain-stage">
      <div class="chain-head">
        <div class="scene-tag rv"><span class="idx">03</span><span>/ 工作链</span></div>
        <h1 class="hero-title sm signal" id="chain-title">${DECK[stepIdx].n} ${DECK[stepIdx].t}</h1>
      </div>
      <div class="lab-deck">
        <div class="deck-scan"></div>
        <div class="deck-rail"><div class="deck-fill" id="deck-fill" style="width:${Math.max(8,pct)}%"></div>
          <div class="deck-head" id="deck-head" style="left:${pct}%"></div></div>
        <div class="deck-steps" id="deck-steps">${DECK.map((s,j)=>`
          <div class="deck-step" data-step="${j}">
            <div class="ds-n">${s.n}</div><div class="ds-t">${s.t}</div>
            <div class="ds-status ${s.status}">${s.statusLabel}</div>
            <div class="deck-break">${s.tags.map((t,k)=>`<span style="--i:${k}">${t}</span>`).join('')}</div>
          </div>`).join('')}
        </div>
      </div>
      <div class="deck-readout" id="deck-readout">
        <span class="dr-tag" id="dr-tag">${DECK[stepIdx].statusLabel}</span>
        <div><div class="dr-txt" id="dr-txt">${DECK[stepIdx].d}</div><div class="dr-detail" id="dr-detail">${DECK[stepIdx].detail}</div></div>
      </div>
    </div>`;
  }

  function updateChainStep(stepIdx) {
    const steps = document.querySelectorAll('#deck-steps .deck-step');
    const pct = stepIdx / (DECK.length - 1) * 100;
    const s = DECK[stepIdx];
    steps.forEach((el, j) => {
      el.classList.remove('on', 'done');
      if (j < stepIdx) el.classList.add('done');
      if (j === stepIdx) el.classList.add('on');
    });
    const fill = document.getElementById('deck-fill');
    const head = document.getElementById('deck-head');
    if (fill) fill.style.width = Math.max(8, pct) + '%';
    if (head) head.style.left = pct + '%';
    const title = document.getElementById('chain-title');
    if (title) title.textContent = s.n + ' ' + s.t;
    const drTag = document.getElementById('dr-tag');
    const drTxt = document.getElementById('dr-txt');
    const drDetail = document.getElementById('dr-detail');
    if (drTxt) { drTxt.style.opacity = '0'; setTimeout(()=>{ drTxt.textContent = s.d; drTxt.style.opacity = '1'; }, 120); }
    if (drDetail) drDetail.textContent = s.detail;
    if (drTag) drTag.textContent = s.statusLabel;
    animateReveals(document.getElementById('chain-stage'));
  }

  const APP = { config:null, manifest:null, chapter:0, beat:0, prevChapter:0, prevBeat:0,
    evidenceOpen:false, lbOpen:false, lbIdx:0, lbImages:[], startTime:Date.now() };
  window.APP = APP;

  function $(id) { return document.getElementById(id); }

  function initData() {
    const d = window.__PRESENTATION_DATA__;
    if (!d) throw new Error('数据未加载');
    APP.config = d.config; APP.manifest = d.manifest;
  }

  function buildRail() {
    $('side-rail').innerHTML = CHAPTERS.map((c,i)=>
      `<a data-ch="${i}" class="${i===0?'active':''}"><span class="rn">${String(i+1).padStart(2,'0')}</span>${c.tag}</a>`).join('');
    $('side-rail').querySelectorAll('a').forEach(a=>a.onclick=()=>goChapter(+a.dataset.ch,0,true));
  }

  function animateReveals(root) {
    (root||document).querySelectorAll('.rv').forEach((el,i)=>setTimeout(()=>el.classList.add('in'), i*70));
    root?.querySelectorAll('.chip').forEach((el,i)=>setTimeout(()=>el.classList.add('on'), 200+i*120));
    root?.querySelectorAll('.tl-i').forEach((el,i)=>setTimeout(()=>el.classList.add('on'), 150+i*180));
  }

  function postRenderHooks() {
    if (APP.chapter===1 && APP.beat===1) {
      document.querySelectorAll('.tl-i').forEach((el,i)=>setTimeout(()=>el.classList.add('on'),150+i*200));
    }
    if (APP.chapter===4 && APP.beat===2) initSphere();
  }

  function renderSlide() {
    const c = CHAPTERS[APP.chapter];
    const stage = $('scene-stage');
    const html = `<div class="slide entering active">${c.render(APP.beat)}</div>`;
    const old = stage.querySelector('.slide.active,.slide.leaving');
    if (old) { old.classList.remove('active','entering'); old.classList.add('leaving'); setTimeout(()=>old.remove(), 680); }
    stage.insertAdjacentHTML('beforeend', html);
    requestAnimationFrame(()=>{
      const cur = stage.querySelector('.slide.entering');
      if (cur) { cur.classList.remove('entering'); cur.classList.add('active'); }
      animateReveals(cur);
      if (APP.chapter===2 && APP.beat>=1 && APP.beat<=4) updateChainStep(APP.beat-1);
      postRenderHooks();
    });
    updateUI();
  }

  function updateUI() {
    const c = CHAPTERS[APP.chapter];
    const prog = ((APP.chapter + (APP.beat+1)/c.beats)/CHAPTERS.length)*100;
    $('progress-fill').style.width = prog+'%';
    $('beat-indicator').textContent = `${String(APP.chapter+1).padStart(2,'0')} · ${APP.beat+1}/${c.beats}`;
    $('side-rail').querySelectorAll('a').forEach((a,i)=>a.classList.toggle('active',i===APP.chapter));
    $('evidence-trigger').classList.toggle('hidden', !c.evidence);
    $('drawer-intro').textContent = c.intro||'';
    scale();
  }

  function scale() {
    const s = Math.min($('scene-viewport').clientWidth/1920, $('scene-viewport').clientHeight/1080);
    $('scene-stage').style.transform = `scale(${s})`;
  }

  function softFlash(cb) {
    const f = $('page-flash');
    f.classList.add('on');
    setTimeout(()=>{ cb(); setTimeout(()=>f.classList.remove('on'), 350); }, 180);
  }

  function goChapter(ch, beat, force) {
    if (ch<0||ch>=CHAPTERS.length) return;
    APP.prevChapter = APP.chapter; APP.prevBeat = APP.beat;
    const doRender = ()=>{ APP.chapter=ch; APP.beat=beat||0; renderSlide(); };
    if (force || ch !== APP.chapter) softFlash(doRender);
    else { APP.beat=beat||0; renderSlide(); }
  }

  function advance() {
    const c = CHAPTERS[APP.chapter];
    // 工作链 01-04 丝滑：不重建 DOM，只更新链状态
    if (APP.chapter===2 && APP.beat>=1 && APP.beat<=3) {
      APP.beat++;
      updateChainStep(APP.beat-1);
      updateUI();
      return;
    }
    if (APP.beat < c.beats-1) {
      APP.prevBeat = APP.beat;
      APP.beat++;
      // 工作链：从 beat0→1 或 beat4→5 需要 render；beat 1→2 等已在上面处理
      if (APP.chapter===2 && APP.beat===1) { renderSlide(); return; }
      if (APP.chapter===2 && APP.beat===5) { renderSlide(); return; }
      renderSlide();
    } else if (APP.chapter < CHAPTERS.length-1) {
      goChapter(APP.chapter+1, 0);
    }
  }

  function retreat() {
    if (APP.chapter===2 && APP.beat>=1 && APP.beat<=4) {
      APP.beat--;
      if (APP.beat>=1) { updateChainStep(APP.beat-1); updateUI(); return; }
      renderSlide();
      return;
    }
    if (APP.beat>0) { APP.beat--; renderSlide(); }
    else if (APP.chapter>0) goChapter(APP.chapter-1, CHAPTERS[APP.chapter-1].beats-1);
  }

  function initSphere() {
    const box = $('sphere-box');
    if (!box||box.dataset.ok) return;
    box.dataset.ok='1';
    setTimeout(()=>{ if(!navigator.onLine) box.classList.add('fallback'); }, APP.config.sphere.loadTimeoutMs||6000);
  }

  function getEvidence() {
    const ids = APP.config.evidenceMapping['page'+(APP.chapter+1)]||[];
    return ids.map(id=>APP.manifest.assets.find(a=>a.id===id)).filter(Boolean);
  }

  function openEvidence() {
    APP.lbImages = getEvidence();
    $('drawer-body').innerHTML = APP.lbImages.map((a,i)=>`
      <div class="ev-item" data-i="${i}"><img src="${a.path}" loading="lazy"/>
      <div class="ev-info"><h4>${a.title}</h4><p>${a.description}</p></div></div>`).join('');
    $('drawer-body').querySelectorAll('.ev-item').forEach(el=>el.onclick=()=>openLb(+el.dataset.i));
    $('evidence-drawer').classList.add('open');
    APP.evidenceOpen=true;
  }
  function closeEvidence() { $('evidence-drawer').classList.remove('open'); APP.evidenceOpen=false; }
  function openLb(i) { APP.lbIdx=i; APP.lbOpen=true; const a=APP.lbImages[i]; $('lb-img').src=a.path; $('lb-cap').textContent=a.title+' — '+a.description; $('lightbox').classList.add('open'); }
  function closeLb() { APP.lbOpen=false; $('lightbox').classList.remove('open'); }

  function initStars() {
    const c=$('starbg'), ctx=c.getContext('2d'); let w,h,stars=[];
    const resize=()=>{ w=c.width=innerWidth*devicePixelRatio; h=c.height=innerHeight*devicePixelRatio; c.style.width=innerWidth+'px'; c.style.height=innerHeight+'px'; stars=[]; const n=Math.floor(innerWidth*innerHeight/7000); for(let i=0;i<n;i++) stars.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.3+.2,a:Math.random()*.5+.1,s:Math.random()*.35+.04,ph:Math.random()*Math.PI*2}); };
    const tick=t=>{ ctx.clearRect(0,0,w,h); stars.forEach(s=>{ const a=(Math.sin(t*.0008+s.ph)+1)*.5*s.a+.06; ctx.fillStyle=`rgba(240,240,250,${a})`; ctx.beginPath(); ctx.arc(s.x,s.y,s.r*devicePixelRatio,0,Math.PI*2); ctx.fill(); s.y+=s.s*devicePixelRatio; if(s.y>h+4){s.y=-4;s.x=Math.random()*w;} }); requestAnimationFrame(tick); };
    resize(); addEventListener('resize',resize); requestAnimationFrame(tick);
  }

  function bindKeys() {
    document.addEventListener('keydown', e=>{
      if (APP.lbOpen) {
        if (e.key==='Escape'){e.preventDefault();closeLb();return;}
        if (e.key==='ArrowLeft'){e.preventDefault();APP.lbIdx=(APP.lbIdx-1+APP.lbImages.length)%APP.lbImages.length;openLb(APP.lbIdx);return;}
        if (e.key==='ArrowRight'){e.preventDefault();APP.lbIdx=(APP.lbIdx+1)%APP.lbImages.length;openLb(APP.lbIdx);return;}
      }
      if (APP.evidenceOpen&&e.key==='Escape'){e.preventDefault();closeEvidence();return;}
      switch(e.key){
        case 'ArrowRight': case 'PageDown': e.preventDefault(); advance(); break;
        case 'ArrowLeft': case 'PageUp': e.preventDefault(); retreat(); break;
        case ' ': e.preventDefault(); advance(); break;
        case 'e': case 'E': e.preventDefault(); APP.evidenceOpen?closeEvidence():openEvidence(); break;
        case 'f': case 'F': e.preventDefault(); document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen(); break;
        case 'h': case 'H': e.preventDefault(); $('controls-hint').classList.add('show'); setTimeout(()=>$('controls-hint').classList.remove('show'),3000); break;
        default: if(e.key>='1'&&e.key<='6'){e.preventDefault();goChapter(+e.key-1,0,true);}
      }
    });
    document.addEventListener('mousemove',e=>{if(e.clientY>innerHeight-90)$('controls-hint').classList.add('show');});
    $('evidence-trigger').onclick=()=>APP.evidenceOpen?closeEvidence():openEvidence();
    $('evidence-close').onclick=closeEvidence;
    $('lb-close').onclick=closeLb;
    $('lb-prev').onclick=()=>{APP.lbIdx=(APP.lbIdx-1+APP.lbImages.length)%APP.lbImages.length;openLb(APP.lbIdx);};
    $('lb-next').onclick=()=>{APP.lbIdx=(APP.lbIdx+1)%APP.lbImages.length;openLb(APP.lbIdx);};
    document.addEventListener('click',e=>{if(e.target.closest('[data-ev]'))openEvidence();});
    $('btn-motion')?.addEventListener('click',()=>document.body.classList.toggle('reduced-motion'));
  }

  function init() {
    initData(); buildRail(); initStars(); bindKeys();
    setInterval(()=>{
      const sec=Math.floor((Date.now()-APP.startTime)/1000);
      $('clock').textContent=String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0');
    },1000);
    renderSlide();
    window.addEventListener('resize',scale);
    const t=document.createElement('div'); t.className='controls-hint show'; t.style.bottom='100px';
    t.innerHTML='按 <kbd>空格</kbd> 推进 · 第3章工作链01→04丝滑切换 · 目标 <kbd>10:00</kbd>';
    document.body.appendChild(t); setTimeout(()=>t.remove(),6000);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
