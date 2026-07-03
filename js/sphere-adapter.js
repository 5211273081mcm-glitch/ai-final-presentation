export class SphereAdapter {
  constructor(app) {
    this.app = app;
    this.loaded = false;
    this.fallback = false;
    this.timer = null;
  }

  init() {
    const wrap = document.getElementById('p5-sphere-wrap');
    const iframe = document.getElementById('p5-sphere-iframe');
    const fallbackImg = document.getElementById('p5-sphere-fallback');
    if (!wrap || !iframe) return;

    const config = this.app.config?.sphere;
    if (fallbackImg && config?.fallbackImage) {
      fallbackImg.src = config.fallbackImage;
    }

    iframe.src = config?.url || '';
    const timeout = config?.loadTimeoutMs || 8000;

    iframe.addEventListener('load', () => {
      this.loaded = true;
      clearTimeout(this.timer);
    });

    iframe.addEventListener('error', () => this.useFallback(wrap));

    this.timer = setTimeout(() => {
      if (!this.loaded) this.useFallback(wrap);
    }, timeout);

    if (!navigator.onLine) this.useFallback(wrap);
  }

  useFallback(wrap) {
    this.fallback = true;
    wrap?.classList.add('fallback');
  }

  onPageChange(page) {
    if (page !== 5) return;
    const iframe = document.getElementById('p5-sphere-iframe');
    if (iframe && !this.fallback) {
      iframe.style.pointerEvents = 'none';
    }
  }

  pause() {
    const iframe = document.getElementById('p5-sphere-iframe');
    if (iframe) iframe.style.visibility = 'hidden';
  }

  resume() {
    const iframe = document.getElementById('p5-sphere-iframe');
    if (iframe) iframe.style.visibility = 'visible';
  }
}
