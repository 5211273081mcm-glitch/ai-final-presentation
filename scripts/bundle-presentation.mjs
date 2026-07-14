#!/usr/bin/env node
/**
 * Bundle presentation data + final-show.js into a single runtime file.
 * Usage:
 *   node scripts/bundle-presentation.mjs           # final (600s)
 *   node scripts/bundle-presentation.mjs roadshow  # roadshow desensitized (209min)
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const mode = process.argv[2] === 'roadshow' ? 'roadshow' : process.argv[2] === '20m' ? '20m' : 'final';

const pick = (name) => readFileSync(resolve(root, 'data', name), 'utf8');

const data = mode === 'roadshow'
  ? {
      config: JSON.parse(pick('presentation-config-roadshow.json')),
      content: JSON.parse(pick('presentation-content-roadshow.json')),
      manifest: JSON.parse(pick('asset-manifest-roadshow.json')),
      demoMessages: JSON.parse(pick('demo-messages-anon.json')),
      demoAnalysis: JSON.parse(pick('demo-analysis-anon.json')),
      demoEvent: JSON.parse(pick('demo-event-anon.json'))
    }
  : mode === '20m'
  ? {
      config: JSON.parse(pick('presentation-config-20m.json')),
      content: JSON.parse(pick('presentation-content-20m.json')),
      manifest: JSON.parse(pick('asset-manifest.json')),
      demoMessages: JSON.parse(pick('demo-messages.json')),
      demoAnalysis: JSON.parse(pick('demo-analysis.json')),
      demoEvent: JSON.parse(pick('demo-event.json'))
    }
  : {
      config: JSON.parse(pick('presentation-config.json')),
      content: JSON.parse(pick('presentation-content.json')),
      manifest: JSON.parse(pick('asset-manifest.json')),
      demoMessages: JSON.parse(pick('demo-messages.json')),
      demoAnalysis: JSON.parse(pick('demo-analysis.json')),
      demoEvent: JSON.parse(pick('demo-event.json'))
    };

const showJs = readFileSync(resolve(root, 'js', 'final-show.js'), 'utf8');
const outName = mode === 'roadshow' ? 'presentation-roadshow.all.js' : mode === '20m' ? 'presentation-20m.all.js' : 'presentation.all.js';
const out = 'window.__PRESENTATION_DATA__ = ' + JSON.stringify(data, null, 0) + ';\n\n' + showJs;
writeFileSync(resolve(root, 'js', outName), out, 'utf8');
console.log('Bundled', mode, '->', outName, `(${Math.round(out.length / 1024)} KB)`);
