#!/usr/bin/env node
/**
 * 3D 沙漏自动化验收 — Playwright 截图 + 控制台/网络/ DOM 检查
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const qaDir = resolve(root, '_qa/hourglass3d-2');
const baseUrl = process.env.QA_URL || 'http://127.0.0.1:8765/index-20m.html?led=1&v=20m-hourglass3d-2';

const logs = { console: [], pageerror: [], requestfailed: [], unhandled: [] };

async function main() {
  await mkdir(qaDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') logs.console.push(msg.text());
  });
  page.on('pageerror', (err) => logs.pageerror.push(String(err)));
  page.on('requestfailed', (req) => logs.requestfailed.push(req.url() + ' ' + req.failure()?.errorText));
  page.on('request', (req) => {
    if (req.resourceType() === 'image' && !req.url()) logs.requestfailed.push('empty image url');
  });

  await page.addInitScript(() => {
    window.addEventListener('unhandledrejection', (e) => {
      window.__qaRejections = window.__qaRejections || [];
      window.__qaRejections.push(String(e.reason));
    });
  });

  async function waitHourglassActive() {
    await page.waitForSelector('.split-hourglass-stage.hg-webgl-active', { timeout: 15000 });
    await page.waitForTimeout(800);
  }

  async function inspectStage(label) {
    return page.evaluate((lbl) => {
      var stage = document.querySelector('.split-hourglass-stage');
      if (!stage) return { label: lbl, error: 'no stage' };
      var imgs = stage.querySelectorAll('img');
      var badImgs = [];
      imgs.forEach(function (img) {
        if (!img.src || img.naturalWidth === 0) badImgs.push({ src: img.src, complete: img.complete });
      });
      var canvases = stage.querySelectorAll('canvas');
      var canvasInfo = Array.from(canvases).map(function (c) {
        var cs = getComputedStyle(c);
        return {
          w: c.width,
          h: c.height,
          display: cs.display,
          opacity: cs.opacity,
          bg: cs.backgroundColor,
          connected: c.isConnected
        };
      });
      var cls = stage.className;
      return {
        label: lbl,
        className: cls,
        badImgs: badImgs,
        canvasCount: canvases.length,
        canvasInfo: canvasInfo,
        hasSvg: !!stage.querySelector('svg.hg-fallback-svg')
      };
    }, label);
  }

  async function screenshot(name) {
    var p = resolve(qaDir, name);
    await page.screenshot({ path: p, fullPage: false });
    return p;
  }

  async function gotoCh0() {
    await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await waitHourglassActive();
  }

  var shots = [];

  await gotoCh0();
  shots.push(await screenshot('01-ch0-beat0-active.png'));
  var dom0 = await inspectStage('ch0-beat0');

  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(600);
  shots.push(await screenshot('02-ch0-beat1.png'));

  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(800);
  shots.push(await screenshot('03-ch1-enter.png'));

  for (var i = 0; i < 3; i++) await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(800);
  await waitHourglassActive();
  shots.push(await screenshot('04-ch0-return.png'));
  var domReturn = await inspectStage('ch0-return');

  for (var r = 0; r < 10; r++) {
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    var pending = await page.$('.split-hourglass-stage.hg-webgl-pending');
    if (pending) await page.waitForSelector('.split-hourglass-stage.hg-webgl-active', { timeout: 15000 }).catch(() => {});
  }
  shots.push(await screenshot('05-after-10-refresh.png'));

  for (var n = 0; n < 5; n++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(400);
    for (var j = 0; j < 3; j++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(400);
    }
    await page.waitForSelector('.split-hourglass-stage', { timeout: 8000 }).catch(() => {});
  }
  var domRound = await inspectStage('after-5-roundtrips');
  var canvasCount = await page.evaluate(() => document.querySelectorAll('.split-hourglass-stage canvas').length);
  var rendererCount = await page.evaluate(() => window.__hgRendererCount || 'n/a');

  var rejections = await page.evaluate(() => window.__qaRejections || []);

  var report = {
    baseUrl,
    screenshots: shots,
    domChecks: [dom0, domReturn, domRound],
    canvasCountAfterRoundtrips: canvasCount,
    rendererCount,
    logs,
    unhandledRejections: rejections,
    pass: logs.console.length === 0 && logs.pageerror.length === 0 && logs.requestfailed.length === 0 &&
      canvasCount <= 1 && domRound.badImgs.length === 0 &&
      domReturn.className.indexOf('hg-webgl-active') >= 0 && dom0.className.indexOf('hg-webgl-active') >= 0
  };

  await writeFile(resolve(qaDir, 'report.json'), JSON.stringify(report, null, 2));
  await browser.close();
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.pass ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
