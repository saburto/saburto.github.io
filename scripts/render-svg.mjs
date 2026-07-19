#!/usr/bin/env node
/**
 * Renders an SVG file to PNG using Chrome headless.
 * Chrome must be running on :9222 (browser-start.js).
 *
 * Usage: node scripts/render-svg.mjs <input.svg> <output.png>
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { connect, open, cmd } from '/home/saburto/.pi/agent/skills/pi-skills/browser-tools/lib/cdp.js';

const inPath = resolve(process.argv[2]);
const outPath = resolve(process.argv[3]);
const WIDTH = 1200;
const HEIGHT = 630;

// Wrap SVG in minimal HTML for Chrome to render
const svgContent = readFileSync(inPath, 'utf-8');
const html = `<!doctype html><html><head><style>body{margin:0;padding:0;width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden}</style></head><body>${svgContent}</body></html>`;

const tmpHtml = '/tmp/og-render.html';
writeFileSync(tmpHtml, html);

let c;
try {
  c = await connect();
} catch (e) {
  console.error('✗ Chrome not running on :9222 — run browser-start.js first');
  process.exit(1);
}

// Create new target (tab) so we don't overwrite the user's tab
const {browserWsUrl} = c;
const bw = await open(browserWsUrl);
const targetResult = await new Promise((resolve, reject) => {
  let id = 1;
  bw.onmessage = (e) => {
    const r = JSON.parse(e.data);
    if (r.id === id) resolve(r.result);
  };
  bw.send(JSON.stringify({ id: id, method: 'Target.createTarget', params: { url: 'about:blank' } }));
});
bw.close();

const pageWsUrl = await new Promise((resolve, reject) => {
  const fetchTarget = async () => {
    const resp = await fetch('http://localhost:9222/json');
    const targets = await resp.json();
    const page = targets.find(t => t.type === 'page' && t.url === 'about:blank');
    if (page) resolve(page.webSocketDebuggerUrl);
    else setTimeout(fetchTarget, 100);
  };
  fetchTarget();
});

const ws = await open(pageWsUrl, 10000);

// Simple CDP send helper
let msgId = 1;
function send(method, params) {
  return new Promise((resolve) => {
    const id = ++msgId;
    ws.onmessage = (e) => {
      const r = JSON.parse(e.data);
      if (r.id === id) resolve(r.result);
    };
    ws.send(JSON.stringify({ id, method, params }));
  });
}

// Navigate to the HTML file
await send('Page.enable');
await send('Page.navigate', { url: `file://${tmpHtml}` });
// Wait for load
await new Promise(r => setTimeout(r, 500));

// Set viewport
await send('Emulation.setDeviceMetricsOverride', {
  width: WIDTH,
  height: HEIGHT,
  deviceScaleFactor: 1,
  mobile: false,
});

// Screenshot
const result = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale: 1 } });

ws.close();

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, Buffer.from(result.data, 'base64'));
console.log(outPath);
