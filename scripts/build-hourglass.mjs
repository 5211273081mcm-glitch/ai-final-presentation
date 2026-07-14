#!/usr/bin/env node
/**
 * Bundle Three.js + 3D hourglass engine → js/hourglass-sand.js (IIFE, sync load)
 */
import * as esbuild from 'esbuild';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const banner = `/**
 * 3D 液体玻璃沙漏 · WebGL (Three.js) + 2D 降级
 * 构建: node scripts/build-hourglass.mjs
 */`;

await esbuild.build({
  entryPoints: [resolve(root, 'js/src/hourglass-entry.mjs')],
  outfile: resolve(root, 'js/hourglass-sand.js'),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
  minify: true,
  treeShaking: true,
  sourcemap: false,
  banner: { js: banner },
  legalComments: 'none'
});

console.log('Built js/hourglass-sand.js (Three.js bundled)');
