import { Navigation } from './navigation.js';
import { EvidenceDrawer } from './evidence-drawer.js';
import { DemoEngine } from './demo-engine.js';
import { SphereAdapter } from './sphere-adapter.js';
import { Scenes } from './scenes.js';

class App {
  constructor() {
    this.config = null;
    this.manifest = null;
    this.demoMessages = null;
    this.demoAnalysis = null;
    this.demoEvent = null;
    this.nav = null;
    this.evidenceDrawer = null;
    this.demo = null;
    this.sphere = null;
    this.scenes = null;
    this.reducedMotion = false;
  }

  async init() {
    await this.loadData();
    this.nav = new Navigation(this);
    this.evidenceDrawer = new EvidenceDrawer(this);
    this.demo = new DemoEngine(this);
    this.sphere = new SphereAdapter(this);
    this.injectScenes();
    this.evidenceDrawer.init();
    this.scenes.initP6Orbit();
    this.scenes.renderP5SceneDetail();
    this.sphere.init();
    this.setupScale();
    this.setupSettings();
    this.setupVisibility();
    this.nav.goToPage(1);
    window.addEventListener('resize', () => this.setupScale());
  }

  async loadData() {
    if (window.__PRESENTATION_DATA__) {
      const d = window.__PRESENTATION_DATA__;
      this.config = d.config;
      this.manifest = d.manifest;
      this.demoMessages = d.demoMessages;
      this.demoAnalysis = d.demoAnalysis;
      this.demoEvent = d.demoEvent;
      return;
    }
    const base = this.getBasePath();
    const files = [
      ['config', 'presentation-config.json'],
      ['manifest', 'asset-manifest.json'],
      ['demoMessages', 'demo-messages.json'],
      ['demoAnalysis', 'demo-analysis.json'],
      ['demoEvent', 'demo-event.json'],
    ];
    await Promise.all(files.map(async ([key, file]) => {
      const res = await fetch(`${base}data/${file}`);
      if (!res.ok) throw new Error(`Failed to load ${file}`);
      this[key] = await res.json();
    }));
  }

  getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/ai-final-presentation')) {
      const idx = path.indexOf('/ai-final-presentation');
      return path.substring(0, idx + '/ai-final-presentation'.length) + '/';
    }
    return './';
  }

  injectScenes() {
    const stage = document.getElementById('scene-stage');
    const scenes = new Scenes(this);
    stage.innerHTML = scenes.buildHTML();
    this.scenes = scenes;
  }

  setupScale() {
    const viewport = document.getElementById('scene-viewport');
    const stage = document.getElementById('scene-stage');
    if (!viewport || !stage) return;
    const scaleX = viewport.clientWidth / 1920;
    const scaleY = viewport.clientHeight / 1080;
    const scale = Math.min(scaleX, scaleY);
    stage.style.transform = `scale(${scale})`;
  }

  setupSettings() {
    document.getElementById('btn-motion')?.addEventListener('click', () => {
      this.reducedMotion = !this.reducedMotion;
      document.body.classList.toggle('reduced-motion', this.reducedMotion);
      document.getElementById('btn-motion')?.classList.toggle('active', this.reducedMotion);
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduced-motion');
      this.reducedMotion = true;
    }
  }

  setupVisibility() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.sphere?.pause();
      else this.sphere?.resume();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init()
    .then(() => {
      const hint = document.createElement('div');
      hint.className = 'startup-hint';
      hint.innerHTML = '按 <kbd>Space</kbd> 开始演示 · <kbd>→</kbd> 翻页 · <kbd>F</kbd> 全屏';
      document.getElementById('app')?.appendChild(hint);
      setTimeout(() => hint.remove(), 6000);
    })
    .catch(err => {
      console.error('Init failed:', err);
      const box = document.getElementById('init-error');
      const msg = document.getElementById('init-error-msg');
      if (box) { box.hidden = false; }
      if (msg) { msg.textContent = err?.message || String(err); }
    });
  window.__presentationApp = app;
});
