export class Scenes {
  constructor(app) {
    this.app = app;
    this.p1Fragments = [
      { text: '某主播相关讨论开始增加', source: '豆瓣', x: 8, y: 12 },
      { text: '用户持续追问处理结果', source: '大秘书', x: 72, y: 8 },
      { text: '同类投诉重复出现', source: '小秘书', x: 15, y: 78 },
      { text: '是否需要暂停直播', source: '业务群', x: 68, y: 72 },
      { text: '是否已形成外部扩散', source: '社交媒体', x: 42, y: 5 },
      { text: '评论区出现举报倾向', source: '抖音评论', x: 5, y: 45 },
      { text: '某厅小秘书收到集中反馈', source: '粉丝运营', x: 78, y: 42 },
      { text: '主播管理群讨论升级', source: '主播管理', x: 35, y: 82 },
    ];
    this.p2Nodes = [
      '豆瓣与客诉侧已出现异常信号',
      '讨论从单一主播扩散至多个圈层',
      '外部形成可复制的投诉路径',
      '合作方、平台与监管被卷入',
      '主播个人问题升级为公司级影响',
    ];
    this.p6Nodes = [
      { id: 'secretary', label: '大秘书/小秘书', angle: 0, detail: { status: '舆情人员需逐个询问投诉数量，不同厅信息散落', capability: '私信实时接入、自动识别主播与问题、同类投诉聚合、双重预警、介入状态跟踪' }},
      { id: 'fans', label: '粉丝运营', angle: 51, detail: { capability: '提炼群体核心诉求、区分个体情绪与群体风险、识别粉圈对立关系' }},
      { id: 'content', label: '内容策划', angle: 103, detail: { status: '过去通常只看评论区前几条高赞', capability: '批量抓取数百上千条评论、统计正负向、聚合争议主题、对比内容方案反馈' }},
      { id: 'host', label: '主播管理', angle: 154, detail: { capability: '查看历史投诉与处罚、判断复发、区分偶发与行为模式、支撑培训处罚停排复播' }},
      { id: 'biz', label: '商务', angle: 206, detail: { capability: '合作前检索历史风险、分析圈层接受度、评估外部舆论承压能力' }},
      { id: 'legal', label: '法务', angle: 257, detail: { capability: '快速获得事实摘要、调取原始证据、高敏事件早期介入' }},
      { id: 'pr', label: '舆情公关', angle: 309, detail: { capability: '统一口径、监测扩散、跨部门协同、处置结果追踪' }},
    ];
    this.p6Selected = 0;
  }

  showPage(n, prev) {
    document.querySelectorAll('.scene').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.page, 10) === n);
    });
    const stage = this.app.nav.getStage(n);
    this.renderStage(n, stage);
  }

  renderStage(page, stage) {
    switch (page) {
      case 1: this.renderP1(stage); break;
      case 2: this.renderP2(stage); break;
      case 3: this.renderP3(stage); break;
      case 4: this.renderP4(stage); break;
      case 5: this.renderP5(stage); break;
      case 6: this.renderP6(stage); break;
    }
    this.updateStageHint(page, stage);
  }

  updateStageHint(page, stage) {
    const max = this.app.nav.maxStage(page);
    const hint = document.querySelector(`.scene[data-page="${page}"] .stage-hint`);
    if (hint) {
      hint.innerHTML = stage < max
        ? `<kbd>Space</kbd> 推进下一阶段 (${stage}/${max})`
        : '按 <kbd>→</kbd> 进入下一页';
    }
  }

  renderP1(stage) {
    const container = document.getElementById('p1-fragments');
    if (!container) return;
    container.innerHTML = this.p1Fragments.map((f, i) => `
      <div class="p1-fragment${stage >= 1 ? ' visible' : ''}${stage === 1 ? ' floating' : ''}${stage >= 2 ? ' stopped' : ''}"
           style="left:${f.x}%;top:${f.y}%;transition-delay:${i * 0.08}s">
        <span style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:2px">${f.source}</span>
        ${f.text}
      </div>
    `).join('');

    document.getElementById('p1-equation')?.classList.toggle('visible', stage >= 2);
    document.getElementById('p1-conclusion')?.classList.toggle('visible', stage >= 3);

    const lines = document.getElementById('p1-lines');
    if (lines && stage >= 2) {
      const pairs = [[0,1],[1,4],[2,5],[3,6],[0,5],[1,3]];
      lines.innerHTML = `<svg>${pairs.map(([a,b], i) => {
        const fa = this.p1Fragments[a], fb = this.p1Fragments[b];
        const fail = i % 2 === 1;
        return `<line class="p1-line visible${fail ? ' fail' : ''}" x1="${fa.x+5}%" y1="${fa.y+3}%" x2="${fb.x+5}%" y2="${fb.y+3}%" style="transition-delay:${i*0.1}s"/>`;
      }).join('')}</svg>`;
    }
  }

  renderP2(stage) {
    document.querySelectorAll('.p2-node').forEach((el, i) => {
      el.classList.toggle('active', stage >= 1 || i === 0);
    });
    const line = document.querySelector('.p2-gap-line');
    if (line) line.style.transform = stage >= 2 ? 'scaleY(0.3)' : 'scaleY(1)';
  }

  renderP3(stage) {
    document.querySelectorAll('.p3-stage').forEach((el, i) => {
      el.classList.toggle('lit', i < stage);
    });
    document.querySelector('.p3-pipeline')?.classList.toggle('flow-visible', stage >= 2);
    document.querySelector('.p3-formula')?.classList.toggle('visible', stage >= 4);
    document.getElementById('p3-boundary')?.classList.toggle('visible', stage >= 4);
  }

  renderP4(stage) {
    const container = document.getElementById('p4-demo');
    if (!container || !this.app.demo) return;
    this.app.demo.render(container, stage);
  }

  renderP5(stage) {
    const mainFlow = document.getElementById('p5-main-flow');
    mainFlow?.querySelectorAll('.p5-main-step').forEach((el, i) => {
      el.classList.toggle('lit', stage >= 1 && i <= Math.min(stage + 2, 6));
    });
    mainFlow?.classList.toggle('active', stage >= 1);

    document.querySelectorAll('.p5-lane').forEach(lane => {
      lane.classList.toggle('active', stage >= 1);
      lane.querySelectorAll('.p5-step').forEach((el, i) => {
        el.classList.toggle('lit', stage >= 1 && i <= stage + 1);
      });
    });

    const sphereArea = document.getElementById('p5-sphere-area');
    if (stage >= 2) {
      sphereArea?.classList.add('visible');
      if (stage >= 3) {
        document.querySelectorAll('.p5-output-chip').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 200);
        });
        document.getElementById('p5-conclusion')?.classList.add('visible');
      }
    }

    if (stage === 2) this.animateEventToSphere();
  }

  animateEventToSphere() {
    const existing = document.querySelector('.p5-event-fly');
    if (existing) return;
    const fly = document.createElement('div');
    fly.className = 'p5-event-fly event-card';
    fly.style.cssText = 'width:300px;height:180px;top:50%;left:30%;transform:translate(-50%,-50%);opacity:0.9;';
    fly.innerHTML = '<div style="padding:20px;font-size:14px;">事件卡 → 知识宇宙</div>';
    document.body.appendChild(fly);
    requestAnimationFrame(() => {
      fly.style.top = '55%';
      fly.style.left = '42%';
      fly.style.transform = 'translate(-50%,-50%) scale(0.1)';
      fly.style.opacity = '0';
    });
    setTimeout(() => fly.remove(), 1600);
  }

  renderP6(stage) {
    document.querySelectorAll('.p6-formula-step').forEach((el) => {
      el.classList.toggle('lit', stage >= 1);
    });
    document.querySelectorAll('.p6-orbit-node').forEach((el, i) => {
      el.classList.toggle('lit', stage >= 2);
      el.classList.toggle('selected', i === this.p6Selected && stage >= 2);
    });
    document.querySelectorAll('.p6-roadmap-phase').forEach((el, i) => {
      el.classList.toggle('lit', stage >= 3 || i === 0);
    });
    document.getElementById('p6-footer')?.classList.toggle('visible', stage >= 4);

    if (stage >= 2) {
      const node = this.p6Nodes[this.p6Selected];
      const detail = document.getElementById('p6-node-detail');
      if (detail && node) {
        detail.innerHTML = `
          <h5>${node.label}</h5>
          ${node.detail.status ? `<p><strong>现状：</strong>${node.detail.status}</p>` : ''}
          <p><strong>可复制能力：</strong>${node.detail.capability}</p>
        `;
      }
    }
  }

  initP6Orbit() {
    const network = document.getElementById('p6-network');
    if (!network || network.dataset.initialized) return;
    network.dataset.initialized = 'true';
    const radius = 200;
    this.p6Nodes.forEach((node, i) => {
      const el = document.createElement('div');
      el.className = 'p6-orbit-node';
      el.textContent = node.label;
      const rad = (node.angle - 90) * Math.PI / 180;
      el.style.left = `calc(50% + ${Math.cos(rad) * radius}px - 55px)`;
      el.style.top = `calc(50% + ${Math.sin(rad) * radius}px - 20px)`;
      el.addEventListener('click', () => {
        this.p6Selected = i;
        this.renderP6(Math.max(this.app.nav.getStage(6), 2));
      });
      network.appendChild(el);
    });
  }

  buildHTML() {
    return `
      <section class="scene" data-page="1">
        <div class="scene-header">
          <h1 class="scene-title">当风险已经被看见<br>为什么仍然可能失控？</h1>
          <p class="scene-subtitle">舆情真正的难点，不是信息不足，而是信息无法及时形成统一判断和行动。</p>
        </div>
        <div class="p1-body">
          <div class="p1-fragments" id="p1-fragments"></div>
          <div class="p1-lines" id="p1-lines"></div>
          <div class="p1-center">
            <div class="p1-equation" id="p1-equation">知道 ≠ 行动</div>
            <div class="p1-conclusion" id="p1-conclusion">AI重构的价值，是缩短从知道到行动的距离。</div>
          </div>
        </div>
        <div class="stage-hint"><kbd>Space</kbd> 开始</div>
      </section>

      <section class="scene" data-page="2">
        <div class="scene-header">
          <h1 class="scene-title">一条主播争议<br>如何升级为公司级风险</h1>
          <p class="scene-subtitle">我们不是没有看到信号，而是从信号到统一行动仍有距离。</p>
        </div>
        <div class="scene-body" style="display:flex;flex-direction:column;">
          <div class="p2-timeline">
            ${this.p2Nodes.map((t, i) => `
              <div class="p2-node${i === 0 ? ' active' : ''}">
                <div class="p2-node-num">0${i + 1}</div>
                <div class="p2-node-text">${t}</div>
              </div>
            `).join('')}
          </div>
          <div class="p2-compare">
            <div class="p2-side p2-done card">
              <h3>当时已经做到</h3>
              <ul>
                <li>豆瓣讨论实时采集</li>
                <li>数据同步进入飞书</li>
                <li>群机器人触发阈值预警</li>
                <li>舆情团队提前感知风险</li>
              </ul>
            </div>
            <div class="p2-gap-bridge">
              <div class="p2-gap-line"></div>
              <span class="p2-gap-label">行动距离</span>
            </div>
            <div class="p2-side p2-gap card">
              <h3>仍然存在的行动距离</h3>
              <ul>
                <li>多渠道信息仍需人工关联</li>
                <li>风险内容仍需人工重新整理</li>
                <li>影响对象与责任角色不够清晰</li>
                <li>提醒到跨部门行动依赖人工推动</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="stage-hint"><kbd>Space</kbd> 推进</div>
      </section>

      <section class="scene" data-page="3">
        <div class="scene-header">
          <h1 class="scene-title">AI重构的不是一个工具<br>而是整条舆情工作链</h1>
        </div>
        <div class="scene-body">
          <div class="p3-pipeline">
            <div class="p3-stage" data-stage="1">
              <div class="p3-stage-num">01</div>
              <div class="p3-stage-title">智能感知</div>
              <ul class="p3-stage-list">
                <li>豆瓣讨论 · LIVE</li>
                <li>抖音评论 · LIVE</li>
                <li>大秘书私信 · LIVE</li>
                <li>小秘书投诉 · 接通中</li>
                <li>业务反馈</li>
              </ul>
              <span class="badge badge-live">已运行</span>
            </div>
            <div class="p3-stage" data-stage="2">
              <div class="p3-stage-num">02</div>
              <div class="p3-stage-title">智能研判</div>
              <ul class="p3-stage-list">
                <li>主播主体识别</li>
                <li>问题摘要提炼</li>
                <li>同一会话聚合</li>
                <li>事件主题归并</li>
                <li>风险场景识别</li>
                <li>高敏性质判断</li>
              </ul>
              <span class="badge badge-live">已运行</span>
            </div>
            <div class="p3-stage" data-stage="3">
              <div class="p3-stage-num">03</div>
              <div class="p3-stage-title">行动协同</div>
              <ul class="p3-stage-list">
                <li>数量阈值预警</li>
                <li>高敏性质直接预警</li>
                <li>飞书群推送</li>
                <li>责任角色分发</li>
                <li>介入状态跟踪</li>
              </ul>
              <span class="badge badge-beta">接通中</span>
            </div>
            <div class="p3-stage" data-stage="4">
              <div class="p3-stage-num">04</div>
              <div class="p3-stage-title">风险沉淀</div>
              <ul class="p3-stage-list">
                <li>主播历史风险档案</li>
                <li>相似事件检索</li>
                <li>月度趋势分析</li>
                <li>17类目 · 204场景</li>
                <li>处置经验与SOP</li>
              </ul>
              <span class="badge badge-next">持续建设</span>
            </div>
          </div>
          <div class="p3-formula">
            <div class="p3-formula-main">PUBLIC OPINION OPS = DATA × AI × SOP × DECISION</div>
            <div class="p3-formula-sub">舆情运营能力 = 数据 × 智能研判 × 标准流程 × 决策协同</div>
            <div class="p3-boundary" id="p3-boundary" style="opacity:0;transition:opacity 0.6s">
              AI负责聚合、提炼和提醒；人负责核验、定责和决策。
            </div>
          </div>
        </div>
        <div class="stage-hint"><kbd>Space</kbd> 点亮链路</div>
      </section>

      <section class="scene" data-page="4">
        <div class="p4-demo-badge"><span class="badge badge-demo">DEMO BASED ON REAL WORKFLOW · 基于真实业务流程的确定性仿真</span></div>
        <div class="scene-header">
          <h1 class="scene-title">现场演示<br>一条高敏投诉如何形成事件</h1>
        </div>
        <div class="scene-body" id="p4-demo">
          <div class="p4-stage active" data-p4="1"></div>
          <div class="p4-stage" data-p4="2"></div>
          <div class="p4-stage" data-p4="3"></div>
          <div class="p4-stage" data-p4="4"></div>
          <div class="p4-stage" data-p4="5"></div>
        </div>
        <div class="stage-hint"><kbd>Space</kbd> 推进演示</div>
      </section>

      <section class="scene" data-page="5">
        <div class="scene-header">
          <h1 class="scene-title">预警不是终点<br>闭环才是舆情价值</h1>
        </div>
        <div class="scene-body" style="display:flex;flex-direction:column;">
          <div class="p5-main-flow" id="p5-main-flow">
            ${['发现信号','AI事件聚合','高敏人工复核','责任角色分发','对外回复与内部处置','用户反馈追踪','结案与知识沉淀'].map(s =>
              `<span class="p5-main-step">${s}</span>${s !== '结案与知识沉淀' ? '<span class="p5-main-arrow">→</span>' : ''}`
            ).join('')}
          </div>
          <div class="p5-swimlanes">
            <div class="p5-lane">
              <div class="p5-lane-label">AI泳道</div>
              <div class="p5-lane-steps">
                ${['聚合同类信息','提炼事实与诉求','追踪新增趋势','关联历史问题','生成行动清单','跟踪介入状态','生成月报初稿'].map(s =>
                  `<span class="p5-step">${s}</span>`
                ).join('')}
              </div>
            </div>
            <div class="p5-lane">
              <div class="p5-lane-label">人工泳道</div>
              <div class="p5-lane-steps">
                ${['核验信息真实性','判断直接因果','评估法律责任','统一回复口径','粉丝沟通','作出最终决策','对处置结果负责'].map(s =>
                  `<span class="p5-step human">${s}</span>`
                ).join('')}
              </div>
            </div>
          </div>
          <div class="p5-sphere-area" id="p5-sphere-area">
            <div class="p5-sphere-wrap" id="p5-sphere-wrap">
              <iframe class="p5-sphere-iframe" id="p5-sphere-iframe" title="3D风险知识宇宙" loading="lazy"></iframe>
              <img class="p5-sphere-fallback" id="p5-sphere-fallback" alt="3D球体静态降级" />
            </div>
            <div class="p5-scene-detail card" id="p5-scene-detail"></div>
          </div>
          <div class="p5-outputs">
            ${['已进入月度风险趋势','已生成事件脉络','已关联风险场景','已沉淀处置建议','可供相似事件召回'].map(s =>
              `<span class="p5-output-chip">${s}</span>`
            ).join('')}
          </div>
          <div class="p5-conclusion" id="p5-conclusion">
            一次舆情结束以后，它不应该只留在群聊和某个人的经验里。<br>
            它应该成为下一次判断可以调用的组织资产。
          </div>
        </div>
        <div class="stage-hint"><kbd>Space</kbd> 推进闭环</div>
      </section>

      <section class="scene" data-page="6">
        <div class="scene-header">
          <h1 class="scene-title">从一个舆情工具<br>复制为业务AI升级方法</h1>
        </div>
        <div class="scene-body p6-grid">
          <div class="p6-formula">
            ${[
              ['非结构化信息输入','多渠道原始反馈与投诉'],
              ['AI理解与聚合','识别主体、提炼诉求、归并事件'],
              ['规则与阈值判断','数量型 + 性质型双重预警'],
              ['自动工作流','推送、分发、跟踪、提醒'],
              ['业务知识沉淀','场景库、SOP、月报、决策支持'],
            ].map(([t, d], i) => `
              <div class="p6-formula-step" data-step="${i}">
                <span class="p6-formula-arrow">→</span>
                <div class="p6-formula-text"><h4>${t}</h4><p>${d}</p></div>
              </div>
            `).join('')}
          </div>
          <div>
            <div class="p6-network" id="p6-network">
              <div class="p6-center-node">AI舆情<br>协同中枢</div>
            </div>
            <div class="p6-node-detail card" id="p6-node-detail">按 Space 依次点亮协同节点</div>
          </div>
          <div class="p6-roadmap">
            <div class="p6-roadmap-phase phase1 lit">
              <h4>阶段1 · 已跑通</h4>
              <ul><li>豆瓣及评论抓取</li><li>大秘书私信接入</li><li>AI投诉解析</li><li>飞书数据沉淀</li><li>部分群预警</li></ul>
            </div>
            <div class="p6-roadmap-phase phase2">
              <h4>阶段2 · 下一步复制</h4>
              <ul><li>数量与性质双预警</li><li>大秘书群机器人推送</li><li>小秘书体系接入</li><li>责任角色自动分发</li></ul>
            </div>
            <div class="p6-roadmap-phase phase3">
              <h4>阶段3 · 规模化</h4>
              <ul><li>主播历史风险档案</li><li>相似事件自动召回</li><li>多部门风险协同</li><li>统一风险大盘</li></ul>
            </div>
          </div>
          <div class="p6-footer" id="p6-footer">
            <p class="p6-footer-quote">今天展示的，不是一套已经完成的庞大系统，而是一条已经跑通的路径。<br>
            过去，我们花大量时间在信息里寻找风险；未来，我们希望让风险主动找到正确的负责人。</p>
            <div class="p6-footer-final">AI重构舆情的本质<br>就是缩短从知道到行动的距离</div>
          </div>
        </div>
        <div class="stage-hint"><kbd>Space</kbd> 点亮网络</div>
      </section>
    `;
  }

  renderP5SceneDetail() {
    const scene = this.app.config?.sphere?.currentScene;
    const el = document.getElementById('p5-scene-detail');
    if (!el || !scene) return;
    el.innerHTML = `
      <h4>场景详情</h4>
      <div class="p5-detail-field"><span class="p5-detail-label">场景编号 </span><span class="p5-detail-value mono">${scene.code}</span></div>
      <div class="p5-detail-field"><span class="p5-detail-label">场景名称 </span><span class="p5-detail-value">${scene.name}</span></div>
      <div class="p5-detail-field"><span class="p5-detail-label">所属类目 </span><span class="p5-detail-value">${scene.category}</span></div>
      <div class="p5-detail-field"><span class="p5-detail-label">典型信号 </span><span class="p5-detail-value">${scene.triggers.join('、')}</span></div>
      <div class="p5-detail-field"><span class="p5-detail-label">风险权重 </span><span class="p5-detail-value">${scene.weight}</span></div>
      <div class="p5-detail-field"><span class="p5-detail-label">预警等级 </span><span class="p5-detail-value" style="color:var(--danger-red)">${scene.alertLevel}</span></div>
      <div class="p5-detail-field"><span class="p5-detail-label">介入角色 </span><span class="p5-detail-value">${scene.roles.join('、')}</span></div>
      <div class="p5-detail-field"><span class="p5-detail-label">关联事件 </span><span class="p5-detail-value">${scene.relatedEvent}</span></div>
      <div class="p5-detail-field"><span class="p5-detail-label">推荐SOP </span><span class="p5-detail-value">${scene.sop}</span></div>
    `;
  }
}
