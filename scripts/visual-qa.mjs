/**
 * 全量视觉 QA v8：三分辨率截图 + 通用碰撞检测 + 文字溢出检测
 * 覆盖全部 6 个页面 × 关键 beat，以及总纲页 6 个 stage 的截图。
 */
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, mkdirSync, existsSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'qa-screenshots-v8');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

function serve(port) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let p = join(ROOT, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
      if (!existsSync(p)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = extname(p);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(readFileSync(p));
    });
    server.listen(port, () => resolve(server));
  });
}

const VIEWPORTS = [
  { name: '1920x1080', width: 1920, height: 1080 },
  { name: '1600x900', width: 1600, height: 900 },
  { name: '1440x810', width: 1440, height: 810 },
];

const PAGES = [
  { chapter: 0, name: 'p1-opening', beats: 3 },
  { chapter: 1, name: 'p2-mastermap', beats: 6 },
  { chapter: 2, name: 'p3-parse', beats: 4 },
  { chapter: 3, name: 'p4-demo', beats: 5 },
  { chapter: 4, name: 'p5-loop', beats: 4 },
  { chapter: 5, name: 'p6-closing', beats: 3 },
];

function overlaps(a, b) {
  return !(a.x + a.width <= b.x || a.x >= b.x + b.width || a.y + a.height <= b.y || a.y >= b.y + b.height);
}
function overlapRatio(a, b) {
  const ix = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const iy = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  const inter = ix * iy;
  const smaller = Math.min(a.width * a.height, b.width * b.height);
  return smaller > 0 ? inter / smaller : 0;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const server = await serve(9877);
  const browser = await chromium.launch();
  const results = { collisions: [], overflows: [], screenshots: [], stageChecks: [] };

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (!url.startsWith('http://127.0.0.1:9877')) return route.abort();
      return route.continue();
    });
    await page.goto('http://127.0.0.1:9877/index.html', { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(400);

    for (const pg of PAGES) {
      // navigate to chapter via number key, then advance to final beat
      await page.keyboard.press(String(pg.chapter + 1));
      await page.waitForTimeout(350);
      for (let i = 0; i < pg.beats - 1; i++) {
        await page.keyboard.press(' ');
        await page.waitForTimeout(120);
      }
      await page.waitForTimeout(400);

      const shot = join(OUT, `${pg.name}-${vp.name}.png`);
      await page.screenshot({ path: shot, fullPage: false });
      results.screenshots.push(shot);

      // Collect boxes for all data-qa-id elements + header
      const data = await page.evaluate(() => {
        const out = {};
        document.querySelectorAll('[data-qa-id]').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            const id = el.getAttribute('data-qa-id');
            out[id] = out[id] || [];
            out[id].push({ x: r.x, y: r.y, width: r.width, height: r.height });
          }
        });
        return out;
      });

      const ids = Object.keys(data);
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const idA = ids[i], idB = ids[j];
          if (idA === idB) continue;
          for (const boxA of data[idA]) {
            for (const boxB of data[idB]) {
              if (overlaps(boxA, boxB)) {
                const ratio = overlapRatio(boxA, boxB);
                if (ratio > 0.06) {
                  results.collisions.push({ page: pg.name, viewport: vp.name, a: idA, b: idB, ratio: +ratio.toFixed(2) });
                }
              }
            }
          }
        }
      }

      // Header must never cover page-title
      if (data['deck-header'] && data['page-title']) {
        for (const h of data['deck-header']) {
          for (const t of data['page-title']) {
            if (overlaps(h, t)) {
              results.collisions.push({ page: pg.name, viewport: vp.name, a: 'deck-header', b: 'page-title', critical: true });
            }
          }
        }
      }

      const overflow = await page.evaluate(() => {
        const issues = [];
        // route-label 使用负inset的::before做黑底遮罩，会把自身撑大 scrollWidth/Height，属于已知装饰性误判，排除
        document.querySelectorAll('#slide-canvas *:not(.route-label)').forEach((el) => {
          if (!(el instanceof HTMLElement)) return;
          if (!el.textContent || !el.textContent.trim()) return;
          if (el.children.length > 0) return;
          if (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2) {
            issues.push({ tag: el.tagName, class: el.className, text: el.textContent.trim().slice(0, 40) });
          }
        });
        return issues;
      });
      if (overflow.length) {
        results.overflows.push({ page: pg.name, viewport: vp.name, count: overflow.length, samples: overflow.slice(0, 6) });
      }
    }
    await page.close();
  }

  // Master map stage-by-stage screenshots + data-stage assertion (1920 only)
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (!url.startsWith('http://127.0.0.1:9877')) return route.abort();
    return route.continue();
  });
  await page.goto('http://127.0.0.1:9877/index.html', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(500);
  await page.keyboard.press('2');
  await page.waitForSelector('.mmap-v8', { timeout: 30000 });
  await page.waitForFunction(() => document.querySelector('.mmap-v8')?.dataset.stage === '0', null, { timeout: 30000 });
  for (let stage = 0; stage <= 5; stage++) {
    await page.waitForFunction(
      (s) => document.querySelector('.mmap-v8')?.dataset.stage === String(s),
      stage,
      { timeout: 30000 }
    ).catch(() => {});
    await page.waitForTimeout(900);
    const shot = join(OUT, `p2-mastermap-stage${stage}.png`);
    await page.screenshot({ path: shot, fullPage: false });
    const st = await page.$eval('.mmap-v8', (el) => el.dataset.stage).catch(() => null);
    results.stageChecks.push({ expected: String(stage), actual: st, match: st === String(stage) });
    if (stage < 5) await page.keyboard.press(' ');
  }

  await browser.close();
  server.close();

  const reportPath = join(OUT, 'verify-report.json');
  writeFileSync(reportPath, JSON.stringify(results, null, 2));

  console.log('=== v8 全量视觉 QA ===');
  console.log('截图数量:', results.screenshots.length);
  console.log('碰撞:', results.collisions.length ? JSON.stringify(results.collisions, null, 2) : 'NONE');
  console.log('溢出:', results.overflows.length ? JSON.stringify(results.overflows, null, 2) : 'NONE');
  console.log('总纲阶段校验:', results.stageChecks.every((s) => s.match) ? 'ALL PASS' : JSON.stringify(results.stageChecks));
  console.log('报告:', reportPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
