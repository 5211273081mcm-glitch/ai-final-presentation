/**
 * 演讲板主应用
 */
class BoardNav {
  constructor(app) {
    this.app = app;
    this.page = 0;
    this.beat = 0;
    this.bindKeys();
  }

  get pages() { return this.app.beats?.pages || []; }
  get currentPage() { return this.pages[this.page]; }
  get maxBeat() { return (this.currentPage?.beats?.length || 1) - 1; }

  bindKeys() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      const ed = this.app.evidence;

      if (ed?.lightboxOpen) {
        if (e.key === 'Escape') { e.preventDefault(); ed.closeLightbox(); return; }
        if (e.key === 'ArrowLeft') { e.preventDefault(); ed.prev(); return; }
        if (e.key === 'ArrowRight') { e.preventDefault(); ed.next(); return; }
      }
      if (ed?.open && e.key === 'Escape') { e.preventDefault(); ed.close(); return; }

      switch (e.key) {
        case 'ArrowRight': e.preventDefault(); this.next(); break;
        case 'ArrowLeft': e.preventDefault(); this.prev(); break;
        case ' ': e.preventDefault(); this.advance(); break;
        case 'e': case 'E': e.preventDefault(); ed?.toggle(); break;
        case 'r': case 'R': e.preventDefault(); this.replay(); break;
        case 'f': case 'F': e.preventDefault(); this.fullscreen(); break;
        case 'h': case 'H': e.preventDefault(); this.showHint(); break;
        case 'Home': e.preventDefault(); this.goPage(0); break;
        case 'End': e.preventDefault(); this.goPage(this.pages.length - 1); break;
        default:
          if (e.key >= '1' && e.key <= '6') {
            e.preventDefault(); this.goPage(parseInt(e.key, 10) - 1);
          }
      }
    });
    document.addEventListener('mousemove', (e) => {
      if (e.clientY > window.innerHeight - 100) this.showHint();
    });
  }

  showHint() {
    const h = document.getElementById('controls-hint');
    if (!h) return;
    h.classList.add('visible');
    clearTimeout(this._hintT);
    this._hintT = setTimeout(() => h.classList.remove('visible'), 3500);
  }

  advance() {
    if (this.beat < this.maxBeat) {
      this.beat++;
      this.render();
    } else if (this.page < this.pages.length - 1) {
      this.transition(() => { this.page++; this.beat = 0; this.render(); });
    }
  }

  next() {
    if (this.page < this.pages.length - 1) {
      this.transition(() => { this.page++; this.beat = 0; this.render(); });
    }
  }

  prev() {
    if (this.beat > 0) { this.beat--; this.render(); }
    else if (this.page > 0) {
      this.transition(() => {
        this.page--;
        this.beat = this.maxBeat;
        this.render();
      });
    }
  }

  goPage(p) {
    if (p < 0 || p >= this.pages.length) return;
    this.transition(() => { this.page = p; this.beat = 0; this.render(); });
  }

  replay() { this.render(true); }

  transition(cb) {
    const overlay = document.getElementById('page-transition');
    if (!overlay) { cb(); return; }
    overlay.classList.add('active');
    setTimeout(() => { cb(); setTimeout(() => overlay.classList.remove('active'), 200); }, 280);
  }

  render() {
    this.app.board.render(this.page, this.beat);
    this.updateUI();
  }

  updateUI() {
    const p = this.page + 1;
    const b = this.beat + 1;
    const total = this.pages.length;
    const el = document.getElementById('page-indicator');
    if (el) el.innerHTML = `<span class="cur">${String(p).padStart(2,'0')}</span> / ${String(total).padStart(2,'0')} · 第${b}幕`;

    const trigger = document.getElementById('evidence-trigger');
    if (trigger) trigger.classList.toggle('hidden', !this.currentPage?.hasEvidence);

    const intro = document.getElementById('evidence-intro');
    if (intro && this.currentPage?.evidenceIntro) intro.textContent = this.currentPage.evidenceIntro;
  }

  fullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
}

class EvidencePanel {
  constructor(app) {
    this.app = app;
    this.open = false;
    this.lightboxOpen = false;
    this.images = [];
    this.idx = 0;
  }

  init() {
    document.getElementById('evidence-trigger')?.addEventListener('click', () => this.toggle());
    document.getElementById('evidence-close')?.addEventListener('click', () => this.close());
    document.getElementById('lightbox-close')?.addEventListener('click', () => this.closeLightbox());
    document.getElementById('lightbox-prev')?.addEventListener('click', () => this.prev());
    document.getElementById('lightbox-next')?.addEventListener('click', () => this.next());
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-open-evidence]')) this.openPanel();
    });
  }

  getAssets() {
    const key = `page${this.app.nav.page + 1}`;
    const ids = this.app.config?.evidenceMapping?.[key] || [];
    return ids.map(id => this.app.manifest?.assets?.find(a => a.id === id)).filter(Boolean);
  }

  openPanel() {
    this.images = this.getAssets();
    const body = document.getElementById('evidence-drawer-body');
    if (!body) return;
    body.innerHTML = this.images.map((a, i) => `
      <div class="evidence-item" data-i="${i}">
        <img src="${a.path}" alt="${a.title}" loading="lazy"/>
        <div class="evidence-item-info"><h4>${a.title}</h4><p>${a.description}</p></div>
      </div>`).join('');
    body.querySelectorAll('.evidence-item').forEach(el => {
      el.addEventListener('click', () => this.openLightbox(parseInt(el.dataset.i, 10)));
    });
    document.getElementById('evidence-drawer')?.classList.add('open');
    this.open = true;
  }

  close() {
    document.getElementById('evidence-drawer')?.classList.remove('open');
    this.open = false;
  }

  toggle() { this.open ? this.close() : this.openPanel(); }

  openLightbox(i) {
    this.idx = i; this.lightboxOpen = true;
    this.updateLightbox();
    document.getElementById('lightbox')?.classList.add('open');
  }

  closeLightbox() {
    this.lightboxOpen = false;
    document.getElementById('lightbox')?.classList.remove('open');
  }

  updateLightbox() {
    const a = this.images[this.idx];
    if (!a) return;
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');
    if (img) img.src = a.path;
    if (cap) cap.textContent = `${a.title} — ${a.description}`;
  }

  prev() { this.idx = (this.idx - 1 + this.images.length) % this.images.length; this.updateLightbox(); }
  next() { this.idx = (this.idx + 1) % this.images.length; this.updateLightbox(); }
}

class SphereAdapter {
  constructor(app) { this.app = app; this.inited = false; }

  init() {
    if (this.inited) return;
    const wrap = document.getElementById('sphere-wrap');
    const iframe = wrap?.querySelector('iframe');
    const fb = wrap?.querySelector('.sphere-fallback');
    if (!wrap) return;
    this.inited = true;
    const timeout = this.app.config?.sphere?.loadTimeoutMs || 8000;
    iframe?.addEventListener('error', () => wrap.classList.add('fallback'));
    setTimeout(() => { if (iframe && !iframe.contentWindow) wrap.classList.add('fallback'); }, timeout);
    if (!navigator.onLine && fb) wrap.classList.add('fallback');
  }
}

class BoardApp {
  constructor() {
    this.config = null;
    this.manifest = null;
    this.beats = null;
    this.demoMessages = null;
    this.demoAnalysis = null;
    this.demoEvent = null;
    this.nav = null;
    this.board = null;
    this.evidence = null;
    this.sphere = null;
  }

  replaceNames(t) {
    if (!t) return '';
    const n = this.config?.useAnonymizedNames ? this.config.names.anon : this.config.names.real;
    return t.replace(/九叔/g, n.hostA).replace(/哈哈/g, n.hostB);
  }

  async init() {
    this.loadEmbedded();
    this.board = new Board(this);
    this.nav = new BoardNav(this);
    this.evidence = new EvidencePanel(this);
    this.sphere = new SphereAdapter(this);
    this.evidence.init();
    this.scale();
    window.addEventListener('resize', () => this.scale());

    document.getElementById('btn-motion')?.addEventListener('click', () => {
      document.body.classList.toggle('reduced-motion');
    });

    this.nav.render();

    const toast = document.createElement('div');
    toast.className = 'startup-toast';
    toast.innerHTML = '按 <strong>空格键</strong> 推进 · <strong>E</strong> 成果演示 · <strong>F</strong> 全屏';
    document.getElementById('app')?.appendChild(toast);
    setTimeout(() => toast.remove(), 7000);
  }

  loadEmbedded() {
    const d = window.__PRESENTATION_DATA__;
    if (!d) throw new Error('数据未加载');
    this.config = d.config;
    this.manifest = d.manifest;
    this.beats = d.beats;
    this.demoMessages = d.demoMessages;
    this.demoAnalysis = d.demoAnalysis;
    this.demoEvent = d.demoEvent;
  }

  scale() {
    const vp = document.getElementById('board-viewport');
    const st = document.getElementById('board-stage');
    if (!vp || !st) return;
    const s = Math.min(vp.clientWidth / 1920, vp.clientHeight / 1080);
    st.style.transform = `scale(${s})`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new BoardApp();
  app.init().catch(err => {
    console.error(err);
    const box = document.getElementById('init-error');
    if (box) { box.hidden = false; document.getElementById('init-error-msg').textContent = err.message; }
  });
  window.__boardApp = app;
});
