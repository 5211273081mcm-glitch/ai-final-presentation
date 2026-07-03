export class EvidenceDrawer {
  constructor(app) {
    this.app = app;
    this.isOpen = false;
    this.currentImages = [];
    this.lightboxIndex = 0;
    this.drawer = null;
    this.lightbox = null;
  }

  init() {
    this.drawer = document.getElementById('evidence-drawer');
    this.lightbox = document.getElementById('lightbox');
    document.getElementById('evidence-trigger')?.addEventListener('click', () => this.toggle());
    document.getElementById('evidence-close')?.addEventListener('click', () => this.close());
    document.getElementById('lightbox-close')?.addEventListener('click', () => this.closeLightbox());
    document.getElementById('lightbox-prev')?.addEventListener('click', () => this.prevImage());
    document.getElementById('lightbox-next')?.addEventListener('click', () => this.nextImage());
  }

  getAssetsForPage(pageNum) {
    const key = `page${pageNum}`;
    const ids = this.app.config?.evidenceMapping?.[key] || [];
    return ids.map(id => this.app.manifest?.assets?.find(a => a.id === id)).filter(Boolean);
  }

  open(pageNum) {
    const page = pageNum || this.app.nav.currentPage;
    const assets = this.getAssetsForPage(page);
    this.currentImages = assets;
    this.render(assets, page);
    this.drawer?.classList.add('open');
    this.isOpen = true;
  }

  close() {
    this.drawer?.classList.remove('open');
    this.isOpen = false;
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  render(assets, page) {
    const body = document.getElementById('evidence-drawer-body');
    if (!body) return;

    let flowHtml = '';
    if (page === 4 && this.app.config?.page4EvidenceFlow) {
      flowHtml = `<div class="evidence-flow">${this.app.config.page4EvidenceFlow.map(s => `<span>${s}</span>`).join('')}</div>`;
    }

    body.innerHTML = flowHtml + assets.map((a, i) => `
      <div class="evidence-item" data-index="${i}">
        <img src="${a.path}" alt="${a.title}" loading="lazy" />
        <div class="evidence-item-info">
          <h4>${a.title}</h4>
          <p>${a.description}</p>
        </div>
      </div>
    `).join('');

    body.querySelectorAll('.evidence-item').forEach(item => {
      item.addEventListener('click', () => this.openLightbox(parseInt(item.dataset.index, 10)));
    });
  }

  openLightbox(index) {
    this.lightboxIndex = index;
    this.updateLightbox();
    this.lightbox?.classList.add('open');
  }

  closeLightbox() {
    this.lightbox?.classList.remove('open');
  }

  isLightboxOpen() {
    return this.lightbox?.classList.contains('open');
  }

  updateLightbox() {
    const asset = this.currentImages[this.lightboxIndex];
    if (!asset) return;
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');
    if (img) img.src = asset.path;
    if (cap) cap.textContent = `${asset.title} — ${asset.description}`;
  }

  prevImage() {
    this.lightboxIndex = (this.lightboxIndex - 1 + this.currentImages.length) % this.currentImages.length;
    this.updateLightbox();
  }

  nextImage() {
    this.lightboxIndex = (this.lightboxIndex + 1) % this.currentImages.length;
    this.updateLightbox();
  }
}
