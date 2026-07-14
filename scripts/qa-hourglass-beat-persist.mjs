#!/usr/bin/env node
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const qaDir = resolve(root, '_qa/hourglass-beat-persist');
mkdirSync(qaDir, { recursive: true });

const baseUrl = process.env.QA_URL || 'http://127.0.0.1:8777/index-20m.html?led=1&v=20m-hgvideo2';
const report = {
  baseUrl,
  console: [],
  requestFailed: [],
  steps: []
};

function readMedia(page) {
  return page.evaluate(() => {
    var stage = document.querySelector('.split-hourglass-stage');
    var va = stage && stage.querySelector('.hg-video-a');
    var vb = stage && stage.querySelector('.hg-video-b');
    var poster = stage && stage.querySelector('.hg-video-poster');
    var dbg = window.HourglassHeroVideo && window.HourglassHeroVideo.getDebugState
      ? window.HourglassHeroVideo.getDebugState() : null;
    return {
      beat: stage && stage.getAttribute('data-beat'),
      videoARef: va ? va.outerHTML.slice(0, 40) : null,
      videoBRef: vb ? vb.outerHTML.slice(0, 40) : null,
      videoAIdentity: va,
      videoBIdentity: vb,
      videoACurrentTime: va ? va.currentTime : null,
      videoBCurrentTime: vb ? vb.currentTime : null,
      posterHidden: poster ? poster.classList.contains('hg-video-poster-hidden') : null,
      posterOpacity: poster ? getComputedStyle(poster).opacity : null,
      stageReady: stage ? stage.classList.contains('hg-video-ready') : null,
      debug: dbg
    };
  });
}

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  page.on('console', (msg) => {
    if (msg.type() === 'error') report.console.push({ type: msg.type(), text: msg.text() });
  });
  page.on('requestfailed', (req) => {
    report.requestFailed.push({ url: req.url(), failure: req.failure()?.errorText || 'unknown' });
  });

  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('.split-hourglass-stage.hg-video-ready', { timeout: 15000 });
  await page.waitForTimeout(3000);

  const before = await readMedia(page);
  const videoAHandleBefore = await page.$('.hg-video-a');
  const videoBHandleBefore = await page.$('.hg-video-b');

  report.steps.push({ label: 'after-3s-beat0', ...before });

  await page.keyboard.press('ArrowRight');
  await page.waitForSelector('.split-hourglass-stage[data-beat="1"]', { timeout: 5000 });
  await page.waitForTimeout(400);

  const afterBeat1 = await readMedia(page);
  const videoAHandleAfter = await page.$('.hg-video-a');
  const videoBHandleAfter = await page.$('.hg-video-b');

  report.steps.push({ label: 'after-beat1', ...afterBeat1 });

  await page.keyboard.press('ArrowLeft');
  await page.waitForSelector('.split-hourglass-stage[data-beat="0"]', { timeout: 5000 });
  await page.waitForTimeout(400);

  const afterBeat0Again = await readMedia(page);
  report.steps.push({ label: 'after-beat0-again', ...afterBeat0Again });

  const sameVideoA = videoAHandleBefore && videoAHandleAfter &&
    (await videoAHandleBefore.evaluate((el) => el)) === (await videoAHandleAfter.evaluate((el) => el));
  const sameVideoB = videoBHandleBefore && videoBHandleAfter &&
    (await videoBHandleBefore.evaluate((el) => el)) === (await videoBHandleAfter.evaluate((el) => el));

  const timeBefore = before.debug ? before.debug.currentTime : before.videoACurrentTime;
  const timeAfterBeat1 = afterBeat1.debug ? afterBeat1.debug.currentTime : afterBeat1.videoACurrentTime;

  report.verdict = {
    sameVideoADom: sameVideoA,
    sameVideoBDom: sameVideoB,
    currentTimeBeforeBeat1: timeBefore,
    currentTimeAfterBeatSwitch: timeAfterBeat1,
    currentTimeDidNotResetToZero: timeAfterBeat1 > 0.5,
    posterStayedHiddenOnBeat1: afterBeat1.posterHidden === true,
    stageReadyOnBeat1: afterBeat1.stageReady === true,
    consoleErrors: report.console.length,
    requestFailed: report.requestFailed.length,
    pass: sameVideoA && sameVideoB && timeAfterBeat1 > 0.5 && afterBeat1.posterHidden === true &&
      afterBeat1.stageReady === true && afterBeat1.beat === '1' &&
      report.requestFailed.length === 0
  };

  await page.screenshot({ path: resolve(qaDir, 'beat1-after-switch.png') });
  writeFileSync(resolve(qaDir, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.verdict, null, 2));
  console.log('report:', resolve(qaDir, 'report.json'));

  await browser.close();
  process.exit(report.verdict.pass ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
