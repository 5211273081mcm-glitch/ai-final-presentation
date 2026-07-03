export class Navigation {
  constructor(app) {
    this.app = app;
    this.currentPage = 1;
    this.totalPages = 6;
    this.stageCounters = {};
    this.hintVisible = false;
    this.hintTimer = null;
    this.bindKeys();
    this.bindHint();
    this.updateProgress();
  }

  bindKeys() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (this.app.evidenceDrawer?.isLightboxOpen()) {
        if (e.key === 'Escape') { e.preventDefault(); this.app.evidenceDrawer.closeLightbox(); return; }
        if (e.key === 'ArrowLeft') { e.preventDefault(); this.app.evidenceDrawer.prevImage(); return; }
        if (e.key === 'ArrowRight') { e.preventDefault(); this.app.evidenceDrawer.nextImage(); return; }
      }

      if (this.app.evidenceDrawer?.isOpen && e.key === 'Escape') {
        e.preventDefault();
        this.app.evidenceDrawer.close();
        return;
      }

      switch (e.key) {
        case 'ArrowRight': e.preventDefault(); this.nextPage(); break;
        case 'ArrowLeft': e.preventDefault(); this.prevPage(); break;
        case ' ':
          e.preventDefault();
          this.advanceStage();
          break;
        case 'Home': e.preventDefault(); this.goToPage(1); break;
        case 'End': e.preventDefault(); this.goToPage(this.totalPages); break;
        case 'r': case 'R': e.preventDefault(); this.replayPage(); break;
        case 'f': case 'F': e.preventDefault(); this.toggleFullscreen(); break;
        case 'h': case 'H': e.preventDefault(); this.showHint(); break;
        default:
          if (e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            this.goToPage(parseInt(e.key, 10));
          }
      }
    });
  }

  bindHint() {
    document.addEventListener('mousemove', (e) => {
      if (e.clientY > window.innerHeight - 80) this.showHint();
    });
  }

  showHint() {
    const hint = document.getElementById('controls-hint');
    if (!hint) return;
    hint.classList.add('visible');
    clearTimeout(this.hintTimer);
    this.hintTimer = setTimeout(() => hint.classList.remove('visible'), 3000);
  }

  getStage(page = this.currentPage) {
    return this.stageCounters[page] || 0;
  }

  setStage(page, stage) {
    this.stageCounters[page] = stage;
  }

  maxStage(page) {
    const config = this.app.config?.pages?.[page - 1];
    return config?.stages || 1;
  }

  advanceStage() {
    const max = this.maxStage(this.currentPage);
    const current = this.getStage();
    if (current < max) {
      this.setStage(this.currentPage, current + 1);
      this.app.scenes.renderStage(this.currentPage, current + 1);
    } else if (this.currentPage < this.totalPages) {
      this.nextPage();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    if (this.currentPage > 1) this.goToPage(this.currentPage - 1);
  }

  goToPage(n) {
    if (n < 1 || n > this.totalPages) return;
    const prev = this.currentPage;
    this.currentPage = n;
    if (!this.stageCounters[n]) this.stageCounters[n] = 0;
    this.app.scenes.showPage(n, prev);
    this.updateProgress();
    this.updateEvidenceTrigger();
    this.app.sphere?.onPageChange(n);
  }

  replayPage() {
    this.setStage(this.currentPage, 0);
    this.app.scenes.showPage(this.currentPage, this.currentPage);
    this.app.scenes.renderStage(this.currentPage, 0);
  }

  updateProgress() {
    const el = document.getElementById('progress-indicator');
    if (el) {
      el.innerHTML = `<span class="current">${String(this.currentPage).padStart(2, '0')}</span> / ${String(this.totalPages).padStart(2, '0')}`;
    }
  }

  updateEvidenceTrigger() {
    const trigger = document.getElementById('evidence-trigger');
    const page = this.app.config?.pages?.[this.currentPage - 1];
    if (trigger) trigger.classList.toggle('hidden', !page?.hasEvidence);
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }
}
