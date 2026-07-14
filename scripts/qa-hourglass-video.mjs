#!/usr/bin/env node
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const qaDir = resolve(root, '_qa/hourglass-video');
mkdirSync(qaDir, { recursive: true });

const baseUrl = process.env.QA_URL || 'http://127.0.0.1:8777/index-20m.html?led=1&v=20m-hgvideo1';
const report = {
  baseUrl,
  screenshots: [],
  console: [],
  requestFailed: [],
  checks: {}
};

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      report.console.push({ type: msg.type(), text: msg.text() });
    }
  });
  page.on('requestfailed', (req) => {
    report.requestFailed.push({ url: req.url(), failure: req.failure()?.errorText || 'unknown' });
  });

  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1200);

  await page.waitForSelector('.split-hourglass-stage.hg-video-ready', { timeout: 15000 }).catch(() => {});

  const snap = async (name) => {
    const path = resolve(qaDir, name);
    await page.screenshot({ path, fullPage: false });
    report.screenshots.push(path);
  };

  await snap('01-ch0-beat0.png');

  report.checks.ch0 = await page.evaluate(() => {
    var stage = document.querySelector('.split-hourglass-stage');
    var videos = stage ? stage.querySelectorAll('video') : [];
    var sources = [];
    videos.forEach(function (v) {
      v.querySelectorAll('source').forEach(function (s) { sources.push(s.src); });
    });
    return {
      beat: stage && stage.getAttribute('data-beat'),
      className: stage && stage.className,
      videoCount: videos.length,
      hasCanvas: !!document.querySelector('.hg-sand-canvas'),
      hasHourglassSand: typeof window.HourglassSand !== 'undefined',
      hasHourglassHeroVideo: typeof window.HourglassHeroVideo !== 'undefined',
      sources: sources,
      loadedScripts: Array.from(document.scripts).map(function (s) { return s.src; }).filter(Boolean)
    };
  });

  await page.evaluate(() => { if (window.goChapter) goChapter(0, 1); });
  await page.waitForTimeout(900);
  await snap('02-ch0-beat1.png');

  await page.evaluate(() => {
    var v = document.querySelector('.hg-video-visible') || document.querySelector('.hg-video-a');
    if (v && v.duration) v.currentTime = Math.max(0, v.duration - 0.55);
  });
  await page.waitForTimeout(400);
  await snap('03-loop-boundary-before.png');
  await page.waitForTimeout(800);
  await snap('04-loop-boundary-after.png');

  await page.evaluate(() => { if (window.goChapter) goChapter(1, 0); });
  await page.waitForTimeout(800);
  await page.evaluate(() => { if (window.goChapter) goChapter(0, 0); });
  await page.waitForTimeout(1500);
  await snap('05-ch0-return.png');

  writeFileSync(resolve(qaDir, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.checks, null, 2));
  console.log('console errors:', report.console.length);
  console.log('request failed:', report.requestFailed.length);
  console.log('qa dir:', qaDir);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
