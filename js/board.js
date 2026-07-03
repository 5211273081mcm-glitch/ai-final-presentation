/**
 * 演讲板渲染引擎 — 单焦点、投影级字号
 */
class Board {
  constructor(app) {
    this.app = app;
    this.stage = document.getElementById('board-stage');
  }

  render(pageIdx, beatIdx) {
    const page = this.app.beats.pages[pageIdx];
    const beat = page.beats[beatIdx];
    if (!page || !beat) return;

    const chapterEl = document.getElementById('chapter-indicator');
    if (chapterEl) chapterEl.textContent = `${String(pageIdx + 1).padStart(2, '0')} · ${page.chapter}`;

    const totalBeats = page.beats.length;
    const progress = ((pageIdx + (beatIdx + 1) / totalBeats) / this.app.beats.pages.length) * 100;
    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = `${progress}%`;

    const html = this.buildBeat(page, beat, beatIdx);
    this.stage.innerHTML = html;

    requestAnimationFrame(() => {
      this.stage.querySelector('.beat')?.classList.add('active');
      this.animateVisual(beat, beatIdx);
    });
  }

  buildBeat(page, beat, beatIdx) {
    const tagHtml = beat.tag ? `<span class="beat-tag${beat.tag.includes('接通') || beat.tag.includes('原型') ? ' warn' : ''}">${beat.tag}</span>` : '';
    const bridgeHtml = beat.bridge ? `<div class="beat-bridge show">${beat.bridge}</div>` : '';
    const evidenceHtml = beat.evidenceCue && page.hasEvidence
      ? `<div class="evidence-cue show" data-open-evidence>按 <kbd>E</kbd> 打开「结合AI成果演示」</div>`
      : '';

    return `
      <section class="beat">
        <div class="beat-chapter">${page.chapter}</div>
        <div class="beat-main">
          ${tagHtml}
          <h1 class="beat-hero${beat.hero.length > 14 ? ' sm' : ''}">${beat.hero}</h1>
          ${beat.sub ? `<p class="beat-sub">${beat.sub}</p>` : ''}
          ${beat.support ? `<p class="beat-support">${beat.support}</p>` : ''}
          <div class="visual-zone" id="visual-zone">${this.renderVisual(beat, beatIdx)}</div>
        </div>
        ${bridgeHtml}
        ${evidenceHtml}
      </section>
    `;
  }

  renderVisual(beat, beatIdx) {
    switch (beat.visual) {
      case 'fragments': return this.renderFragments();
      case 'disconnect': return '<div class="frag-grid" id="frag-grid"></div>';
      case 'bridge': return '';
      case 'title': return '';
      case 'timeline': return this.renderTimeline(beat, beatIdx);
      case 'contrast': return this.renderContrast(beat);
      case 'chain-single': return this.renderChain(beat);
      case 'formula': return this.renderFormula();
      case 'demo-title': return '';
      case 'demo-messages': return this.renderDemoMessages();
      case 'demo-analysis': return this.renderDemoAnalysis();
      case 'demo-event': return this.renderDemoEvent(beat);
      case 'demo-alert': return this.renderDemoAlert(beat);
      case 'demo-bot': return this.renderDemoBot();
      case 'loop': return this.renderLoop(beatIdx);
      case 'sphere': return this.renderSphere();
      case 'method': return this.renderMethod();
      case 'network': return this.renderNetwork(beatIdx);
      case 'finale': return '<div class="finale-glow">就是缩短从知道到行动的距离</div>';
      default: return '';
    }
  }

  renderFragments() {
    const items = [
      ['豆瓣', '讨论开始增加'], ['大秘书', '追问处理结果'], ['抖音', '举报倾向'],
      ['业务群', '是否暂停直播'], ['粉丝运营', '集中反馈'], ['社交媒体', '外部扩散'],
    ];
    return `<div class="frag-grid">${items.map(([s, t]) =>
      `<div class="frag-chip"><div class="src">${s}</div>${t}</div>`
    ).join('')}</div>`;
  }

  renderTimeline(beat, beatIdx) {
    const steps = beat.timeline || [];
    const active = beat.activeStep ?? beatIdx;
    return `<div class="timeline-bar">${steps.map((t, i) => `
      <div class="tl-step${i <= active ? ' on' : ''}">
        <div class="tl-dot">${String(i + 1).padStart(2, '0')}</div>
        <div class="tl-text">${t}</div>
      </div>`).join('')}</div>`;
  }

  renderContrast(beat) {
    const L = beat.left, R = beat.right;
    return `<div class="contrast-grid">
      <div class="contrast-panel done"><h3>${L.title}</h3><ul>${L.items.map(i => `<li>${i}</li>`).join('')}</ul></div>
      <div class="contrast-gap"><div class="contrast-gap-line"></div><span class="contrast-gap-label">行动距离</span></div>
      <div class="contrast-panel gap"><h3>${R.title}</h3><ul>${R.items.map(i => `<li>${i}</li>`).join('')}</ul></div>
    </div>`;
  }

  renderChain(beat) {
    const idx = beat.chainIndex ?? 0;
    return `<div class="chain-card">
      <div class="chain-progress">${[0,1,2,3].map(i => `<span class="chain-dot${i <= idx ? ' on' : ''}"></span>`).join('')}</div>
    </div>`;
  }

  renderFormula() {
    return `<p style="font-family:var(--font-mono);font-size:36px;color:var(--ai-cyan);letter-spacing:0.04em;">DATA × AI × SOP × DECISION</p>`;
  }

  renderDemoMessages() {
    const msgs = this.app.demoMessages?.messages?.slice(0, 4) || [];
    const name = (t) => this.app.replaceNames(t);
    return `<div class="demo-msg-list">${msgs.map(m => `
      <div class="demo-msg${m.sensitive ? ' sensitive' : ''}">
        <span class="demo-msg-src">${m.source}</span>
        <span class="demo-msg-text">${name(m.content)}</span>
      </div>`).join('')}</div>
      <p class="demo-stat" style="margin-top:24px;text-align:center;">8</p>
      <p style="text-align:center;font-size:var(--caption);color:var(--text-muted);">messages received</p>`;
  }

  renderDemoAnalysis() {
    const a = this.app.demoAnalysis || {};
    const fields = [
      ['投诉对象', a.complaintTarget, 'cyan'],
      ['风险标签', (a.riskTags || []).join('、'), 'hi'],
      ['预警等级', a.alertLevel, 'hi'],
      ['研判结论', a.latestConclusion, ''],
    ];
    return `<div class="demo-fields">${fields.map(([l, v, c]) => `
      <div class="demo-field"><span class="demo-field-label">${l}</span><span class="demo-field-value ${c || ''}">${this.app.replaceNames(v || '')}</span></div>
    `).join('')}</div>`;
  }

  renderDemoEvent(beat) {
    const e = this.app.demoEvent || {};
    return `<div class="event-card-v2">
      <div class="event-card-v2-head">
        <span style="font-size:var(--label);color:var(--text-muted);">${e.id}</span>
        <div class="event-card-v2-name">${this.app.replaceNames(e.name || '')}</div>
        <span class="beat-tag danger">${e.riskLevel} · ${e.priority}</span>
      </div>
      <div class="event-card-v2-row">
        <span>${e.facts?.sessionCount || 8} 会话</span>
        <span>${e.facts?.messageCount || 23} 消息</span>
        <span>趋势：${e.aiInsights?.trend || '持续新增'}</span>
      </div>
      <div class="event-card-v2-emphasis">${beat.emphasis || ''}</div>
    </div>`;
  }

  renderDemoAlert(beat) {
    return `<div class="alert-duo">
      <div class="alert-panel">
        <h4>数量型预警</h4>
        <p>普通事件达到阈值后触发</p>
        ${[1,2,3,4,5].map(n => `<div class="alert-item${n >= 5 ? ' on' : ''}"><span class="alert-dot"></span>第 ${n} 条消息</div>`).join('')}
      </div>
      <div class="alert-panel">
        <h4>性质型预警</h4>
        <p>高敏性质第一条即介入</p>
        <div class="alert-item danger on"><span class="alert-dot"></span>医疗高敏 · 第 1 条</div>
      </div>
    </div>`;
  }

  renderDemoBot() {
    const c = this.app.demoEvent?.alertCard || {};
    return `<div class="bot-card-v2">
      <div class="bot-card-v2-head"><h4>${c.title || '高敏风险预警'}</h4><span class="beat-tag warn">PROTOTYPE · 接通中</span></div>
      <div class="bot-card-v2-body">
        <div class="bot-row"><span class="bot-row-label">事件</span>${this.app.replaceNames(c.event || '')}</div>
        <div class="bot-row"><span class="bot-row-label">触发</span>${c.triggerReason || ''}</div>
        <div class="bot-row"><span class="bot-row-label">时限</span><span style="color:var(--danger-red)">${c.deadline || '立即'}</span></div>
      </div>
    </div>`;
  }

  renderLoop(step) {
    const steps = ['发现信号','AI聚合','人工复核','责任分发','对外处置','知识沉淀'];
    return `<div class="loop-steps">${steps.map((s, i) =>
      `${i > 0 ? '<span class="loop-arrow">→</span>' : ''}<span class="loop-step${i <= step + 2 ? ' on' : ''}">${s}</span>`
    ).join('')}</div>`;
  }

  renderSphere() {
    const url = this.app.config?.sphere?.url || '';
    const fb = this.app.config?.sphere?.fallbackImage || '';
    return `<div class="sphere-wrap" id="sphere-wrap">
      <iframe src="${url}" title="3D知识宇宙" loading="lazy"></iframe>
      <img class="sphere-fallback" src="${fb}" alt="3D球体" />
    </div>`;
  }

  renderMethod() {
    return `<p style="font-size:var(--body);color:var(--text-secondary);text-align:center;max-width:1200px;line-height:1.8;">
      输入 → 理解 → 判断 → 工作流 → 沉淀<br>
      <span style="color:var(--text-muted);font-size:var(--caption);">业务团队定义规则 · AI验证原型 · 业管数据技术规模化</span>
    </p>`;
  }

  renderNetwork(idx) {
    const nodes = ['大秘书','粉丝运营','内容策划','主播管理','商务','法务','舆情公关'];
    const r = 220;
    return `<div class="network-ring">${nodes.map((n, i) => {
      const rad = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(rad) * r + 280 - 40;
      const y = Math.sin(rad) * r + 280 - 16;
      return `<span class="network-node${i <= idx + 2 ? ' on' : ''}" style="left:${x}px;top:${y}px">${n}</span>`;
    }).join('')}<div class="network-center">AI舆情<br>协同中枢</div></div>`;
  }

  animateVisual(beat, beatIdx) {
    if (beat.visual === 'fragments' || beat.visual === 'disconnect') {
      this.stage.querySelectorAll('.frag-chip').forEach((el, i) => {
        setTimeout(() => el.classList.add('on'), i * 100);
      });
    }
    if (beat.visual === 'timeline') {
      const active = beat.activeStep ?? 0;
      this.stage.querySelectorAll('.tl-step').forEach((el, i) => {
        setTimeout(() => { if (i <= active) el.classList.add('on'); }, i * 200);
      });
    }
    if (beat.visual === 'sphere') this.app.sphere?.init();
  }
}
