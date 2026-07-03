export class DemoEngine {
  constructor(app) {
    this.app = app;
  }

  getName(key) {
    const cfg = this.app.config;
    const names = cfg.useAnonymizedNames ? cfg.names.anon : cfg.names.real;
    return names[key] || key;
  }

  replaceNames(text) {
    return text
      .replace(/九叔/g, this.getName('hostA'))
      .replace(/哈哈/g, this.getName('hostB'));
  }

  renderStage1(container, stage) {
    const messages = this.app.demoMessages?.messages || [];
    const visibleCount = stage >= 1 ? messages.length : 0;

    container.innerHTML = `
      <div style="position:relative; height:100%; display:flex; flex-direction:column;">
        <div class="p4-counter">
          <div class="p4-counter-num">${visibleCount}</div>
          <div class="p4-counter-label">messages received</div>
        </div>
        <div class="p4-messages" id="p4-msg-list"></div>
      </div>
    `;

    const list = container.querySelector('#p4-msg-list');
    messages.forEach((msg, i) => {
      const el = document.createElement('div');
      el.className = `p4-msg${msg.sensitive ? ' sensitive' : ''}`;
      el.innerHTML = `
        <span class="p4-msg-source">${msg.source}</span>
        <span class="p4-msg-time">${msg.time.split(' ')[1]}</span>
        <span class="p4-msg-content">${this.replaceNames(msg.content)}</span>
        <span class="p4-msg-status">${msg.hasAttachment ? '📎' : ''} ${msg.status}</span>
        <span class="mono" style="font-size:11px;color:var(--text-muted)">${msg.sessionId}</span>
      `;
      list.appendChild(el);
      if (stage >= 1) {
        setTimeout(() => el.classList.add('visible'), i * 120);
      }
    });
  }

  renderStage2(container, stage) {
    const analysis = this.app.demoAnalysis;
    if (stage < 2) {
      container.innerHTML = '<div class="p4-scan-overlay active"><span class="p4-scan-text">AI 解析中…</span></div>';
      return;
    }

    const fields = [
      ['投诉对象', analysis.complaintTarget, 'cyan'],
      ['关联主体', analysis.relatedSubject, ''],
      ['问题类型', analysis.problemTypes.join(' / '), ''],
      ['核心诉求', analysis.coreDemands.join('、'), ''],
      ['风险标签', analysis.riskTags.join('、'), 'danger'],
      ['首次私信', analysis.firstMessageTime, ''],
      ['最近私信', analysis.lastMessageTime, ''],
      ['会话跨度', analysis.sessionSpan, ''],
      ['消息条数', analysis.messageCount, 'mono'],
      ['介入状态', analysis.interventionStatus, ''],
      ['大秘书回复', analysis.secretaryReply, ''],
      ['证据', `作品${analysis.evidence.works} / 图片${analysis.evidence.images} / 语音${analysis.evidence.voice}`, ''],
      ['最新摘要', analysis.latestSummary, ''],
      ['研判结论', analysis.latestConclusion, 'cyan'],
      ['风险场景', analysis.latestScene, ''],
      ['风险类目', analysis.latestCategory, ''],
      ['预警等级', analysis.alertLevel, 'danger'],
    ];

    container.innerHTML = `
      <div class="p4-analysis scale-in">
        <div class="p4-analysis-left card">
          <h4 style="margin-bottom:16px;color:var(--text-muted);font-size:13px;">非结构化私信</h4>
          <p style="font-size:var(--card-size);color:var(--text-secondary);line-height:1.6;">
            用户投诉${this.getName('hostA')}长期语言刺激${this.getName('hostB')}…<br>
            提及ICU、昏迷、药物中毒…<br>
            要求停播、公告、处罚…
          </p>
          <div style="text-align:center;margin:24px 0;font-size:24px;color:var(--ai-cyan);">→</div>
          <p style="font-size:13px;color:var(--ai-cyan);text-align:center;">结构化风险字段</p>
        </div>
        <div class="p4-analysis-right card card-glow">
          <h4 style="margin-bottom:16px;color:var(--ai-cyan);font-size:13px;">AI 解析结果</h4>
          ${fields.map(([label, value, cls]) => `
            <div class="p4-field">
              <span class="p4-field-label">${label}</span>
              <span class="p4-field-value ${cls}">${this.replaceNames(value)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderStage3(container) {
    const ev = this.app.demoEvent;
    container.innerHTML = `
      <div class="event-card scale-in">
        <div class="event-card-header">
          <div>
            <div class="event-card-id">${ev.id}</div>
            <div class="event-card-name">${this.replaceNames(ev.name)}</div>
            <div class="event-card-meta">
              <span class="badge badge-danger">${ev.riskLevel}</span>
              <span class="badge badge-danger">${ev.priority}</span>
              <span class="badge badge-beta">${ev.stage}</span>
              ${ev.heating ? '<span class="badge badge-danger">升温中</span>' : ''}
            </div>
          </div>
          <div style="text-align:right;font-size:13px;color:var(--text-muted);">
            持续 ${ev.duration}
          </div>
        </div>
        <div class="event-card-body">
          <div class="event-card-section">
            <h4>基础事实</h4>
            <ul>
              <li>主要主体：${ev.facts.mainSubjects.join('、')}</li>
              <li>关联主体：${ev.facts.relatedSubjects.join('、')}</li>
              <li>首次出现：${ev.facts.firstSeen}</li>
              <li>最近新增：${ev.facts.lastUpdate}</li>
              <li>会话数：${ev.facts.sessionCount} / 消息：${ev.facts.messageCount}</li>
              <li>来源：${ev.facts.sources.join('、')}</li>
            </ul>
          </div>
          <div class="event-card-section">
            <h4>AI 提炼</h4>
            <ul>
              <li>核心诉求：${ev.aiInsights.topDemands.map(d => this.replaceNames(d)).join('；')}</li>
              <li>风险标签：${ev.aiInsights.riskTags.join('、')}</li>
              <li>高频表达：${ev.aiInsights.frequentExpressions.join('、')}</li>
              <li>用户情绪：${ev.aiInsights.sentiment}</li>
              <li>讨论趋势：${ev.aiInsights.trend}</li>
            </ul>
          </div>
          <div class="event-card-section">
            <h4>待核验 / 建议协同</h4>
            <ul>
              ${ev.pendingVerification.map(v => `<li>？ ${v}</li>`).join('')}
              <li style="margin-top:8px;color:var(--ai-cyan);">协同：${ev.suggestedRoles.join('、')}</li>
              ${ev.nextActions.map(a => `<li>→ ${a}</li>`).join('')}
            </ul>
          </div>
          <div class="event-card-boundary">
            ${this.app.demoAnalysis.aiBoundary}
          </div>
        </div>
        <div class="event-card-footer">
          <span>场景 ${ev.footer.sceneCode} · ${ev.footer.relatedHistory.join('、')}</span>
          <span>${ev.footer.inMonthlyReport ? '✓ 月报' : ''} ${ev.footer.inKnowledgeBase ? '✓ 知识库' : ''}</span>
        </div>
      </div>
    `;
  }

  renderStage4(container, stage) {
    const messages = this.app.demoMessages?.messages || [];
    const threshold = this.app.demoMessages?.quantityThreshold || 5;

    const qtySlots = messages.slice(0, 4).map((m, i) => ({
      text: `第${i + 1}条：${this.replaceNames(m.content).slice(0, 20)}…`,
      lit: stage >= 2 && i < 4,
      warn: false
    }));
    qtySlots.push({
      text: `第5条进入 → 数量阈值触发`,
      lit: stage >= 2,
      warn: true
    });

    const natureSlots = messages.filter(m => m.sensitive).map((m, i) => ({
      text: `第${messages.indexOf(m) + 1}条含高敏词：${m.tags.filter(t => ['ICU','昏迷','药物中毒','法律责任'].includes(t)).join('、') || '医疗高敏'}`,
      lit: stage >= 2,
      danger: true
    }));

    container.innerHTML = `
      <div class="p4-alerts">
        <div class="p4-alert-track card">
          <h4>A · 数量型预警</h4>
          <p>普通事件需达到设定数量或增速后触发</p>
          <div class="p4-alert-slots">
            ${qtySlots.map(s => `
              <div class="p4-alert-slot${s.lit ? ' lit' : ''}${s.warn ? ' warn' : ''}">
                <span class="p4-alert-dot"></span>
                <span>${s.text}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="p4-alert-track card">
          <h4>B · 性质型预警</h4>
          <p>高敏性质出现即直接进入人工复核</p>
          <div class="p4-alert-slots">
            ${natureSlots.map(s => `
              <div class="p4-alert-slot${s.lit ? ' lit danger' : ''}">
                <span class="p4-alert-dot"></span>
                <span>${s.text}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="p4-alert-summary${stage >= 2 ? ' visible' : ''}">
          不是所有风险都要「等数量上来」。<br>
          <strong>有些问题，第一条就值得介入。</strong>
        </div>
      </div>
    `;
  }

  renderStage5(container) {
    const card = this.app.demoEvent?.alertCard;
    container.innerHTML = `
      <div class="bot-card scale-in">
        <div class="bot-card-header">
          <h4>${card.title}</h4>
          <span class="badge badge-proto">PROTOTYPE · 接通中</span>
        </div>
        <div class="bot-card-body">
          <div class="bot-field"><span class="bot-field-label">事件</span><span class="bot-field-value">${this.replaceNames(card.event)}</span></div>
          <div class="bot-field"><span class="bot-field-label">触发原因</span><span class="bot-field-value">${card.triggerReason}</span></div>
          <div class="bot-field"><span class="bot-field-label">当前量级</span><span class="bot-field-value">${card.sessions}个会话 / ${card.messages}条消息</span></div>
          <div class="bot-field"><span class="bot-field-label">主要诉求</span><span class="bot-field-value">${card.demands.join('、')}</span></div>
          <div class="bot-field"><span class="bot-field-label">当前趋势</span><span class="bot-field-value">${card.trend}</span></div>
          <div class="bot-field"><span class="bot-field-label">建议时限</span><span class="bot-field-value" style="color:var(--danger-red)">${card.deadline}</span></div>
        </div>
        <div class="bot-card-actions">
          <span class="bot-btn">查看原始会话</span>
          <span class="bot-btn">打开聚合事件卡</span>
          <span class="bot-btn primary">认领处理</span>
        </div>
      </div>
    `;
  }

  render(container, stage) {
    const active = stage <= 0 ? 1 : Math.min(stage, 5);
    const stages = container.querySelectorAll('.p4-stage');
    stages.forEach((el, i) => el.classList.toggle('active', i + 1 === active));

    if (active === 1) this.renderStage1(stages[0], stage);
    if (active === 2) this.renderStage2(stages[1], 2);
    if (active === 3) this.renderStage3(stages[2]);
    if (active === 4) this.renderStage4(stages[3], stage);
    if (active === 5) this.renderStage5(stages[4]);
  }
}
