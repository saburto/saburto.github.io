#!/usr/bin/env node
/**
 * Generates per-blog-post OG images at build time.
 * Output: public/og/<slug>.png (1200×630)
 * Each post gets a Lucide icon matched to its primary tag.
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const OUT_DIR = path.join(ROOT, 'public', 'og');
const WIDTH = 1200;
const HEIGHT = 630;

const TEXT_PRIMARY = '#1a1a1a';
const TEXT_MUTED = '#6b7280';
const TAG_BG = '#dbeafe';
const TAG_TEXT = '#1e40af';
const ICON_COLOR = '#2563eb';

// Lucide icon paths (viewBox 0 0 24 24) keyed by tag → icon name
const TAG_ICONS = {
  debugging: 'bug',
  java: 'code',
  jdb: 'terminal',
  ai: 'brain',
  agentic: 'brain',
  llm: 'brain',
  agent: 'brain',
  cli: 'terminal',
  tools: 'terminal',
  maven: 'package',
  'build-tools': 'package',
  git: 'git-branch',
  ruby: 'code',
  testing: 'lightbulb',
  jacoco: 'lightbulb',
  sdkman: 'package',
  tutorial: 'book-open',
  'domain-driven-design': 'box',
  patterns: 'box',
  'design-patterns': 'box',
  'software-engineering': 'brain',
  productivity: 'coffee',
  development: 'code',
  context: 'brain',
};

const ICONS = {
  sparkles: `<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>`,
  terminal: `<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>`,
  brain: `<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>`,
  lightbulb: `<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5 0-3.3-2.7-6-6-6S6 4.7 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>`,
  'book-open': `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`,
  code: `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,
  'git-branch': `<line x1="6" y1="3" x2="6" y2="15"/><circle cx="6" cy="3" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="21" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>`,
  bug: `<path d="m8 2 1.9 1.9"/><path d="m16 2-1.9 1.9"/><path d="M3 13h2"/><path d="M19 13h2"/><path d="M12 21V17"/><rect x="4" y="4" width="16" height="11" rx="3"/>`,
  box: `<path d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4a2 2 0 0 0-1 1.7"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/>`,
  coffee: `<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>`,
  package: `<path d="m16.5 9.4-9-5.2"/><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4a2 2 0 0 0-1 1.7v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/>`,
};

function pickIcon(tags) {
  if (!tags || tags.length === 0) return 'sparkles';
  for (const tag of tags) {
    const key = tag.toLowerCase();
    if (TAG_ICONS[key]) return TAG_ICONS[key];
  }
  return 'sparkles';
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function extractFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    value = value.replace(/^['"]|['"]$/g, '');
    if (key === 'tags' && value.startsWith('[')) {
      fm[key] = value.slice(1, -1).split(',').map(t => t.trim().replace(/^['"]|['"]$/g, ''));
    } else {
      fm[key] = value;
    }
  }
  return fm;
}

function wrapText(text, maxCharsPerLine) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if (current && (current + ' ' + word).length > maxCharsPerLine) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + ' ' + word : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function buildSvg({ title, description, tags, date }) {
  const titleLines = wrapText(title, 34);
  const titleY = 160;
  const lineHeight = 52;
  const titleSvgs = titleLines.map((line, i) =>
    `<text x="50" y="${titleY + i * lineHeight}" font-family="'DejaVu Sans','Liberation Sans',Arial,sans-serif" font-weight="700" font-size="42" fill="${TEXT_PRIMARY}">${escapeXml(line)}</text>`
  ).join('\n');

  const descY = titleY + titleLines.length * lineHeight + 20;
  let descSvg = '';
  if (description) {
    const descLines = wrapText(description, 48);
    descSvg = descLines.map((line, i) =>
      `<text x="50" y="${descY + i * 30}" font-family="'DejaVu Sans','Liberation Sans',Arial,sans-serif" font-size="22" fill="${TEXT_MUTED}">${escapeXml(line)}</text>`
    ).join('\n');
  }

  const descLineCount = description ? wrapText(description, 48).length : 0;
  const tagsY = descY + descLineCount * 30 + 30;
  const tagSvgs = (tags && tags.length > 0)
    ? tags.slice(0, 4).reduce(({ svg, x }, tag) => {
        const label = '#' + tag;
        const w = label.length * 11 + 24;
        const el = `<rect x="${x}" y="${tagsY}" width="${w}" height="34" rx="17" fill="${TAG_BG}"/><text x="${x + w / 2}" y="${tagsY + 23}" font-family="'DejaVu Sans','Liberation Sans',Arial,sans-serif" font-size="18" fill="${TAG_TEXT}" text-anchor="middle">${escapeXml(label)}</text>`;
        return { svg: svg + el, x: x + w + 10 };
      }, { svg: '', x: 50 }).svg
    : '';

  const iconName = pickIcon(tags);
  const iconPath = ICONS[iconName] || ICONS.sparkles;

  const dateStr = date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const nameY = 558;
  const dateY = 590;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#eff6ff"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <!-- Icon behind text -->
  <g transform="translate(500,10) scale(25)" fill="none" stroke="${ICON_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.03">
    ${iconPath}
  </g>
  ${titleSvgs}
  ${descSvg}
  ${tagSvgs}
  <text x="50" y="${nameY}" font-family="'DejaVu Sans','Liberation Sans',Arial,sans-serif" font-size="16" fill="${TEXT_MUTED}">Sebastian Aburto's blog — Thoughts, ideas, philosophy, and practical tips about software development</text>
  <text x="50" y="${dateY}" font-family="'DejaVu Sans','Liberation Sans',Arial,sans-serif" font-size="14" fill="${TEXT_MUTED}">${escapeXml(dateStr)} · saburto.com</text>
</svg>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
  let generated = 0;

  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
    const fm = extractFrontmatter(raw);
    if (!fm.title) continue;

    const slug = file.replace(/\.md$/, '');

    const svg = buildSvg({
      title: fm.title,
      description: fm.description || null,
      tags: fm.tags || [],
      date: fm.date,
    });

    const svgPath = path.join(OUT_DIR, `${slug}.svg`);
    const pngPath = path.join(OUT_DIR, `${slug}.png`);
    fs.writeFileSync(svgPath, svg, 'utf-8');

    try {
      execSync(`node scripts/render-svg.mjs "${svgPath}" "${pngPath}"`, {
        stdio: 'pipe',
        timeout: 15000,
      });
      generated++;
      console.log(`  ✓ ${slug} (${pickIcon(fm.tags || [])})`);
    } catch (e) {
      console.error(`  ✗ ${slug}: ${e.message}`);
    }

    fs.unlinkSync(svgPath);
  }

  console.log(`\nGenerated ${generated} OG images in ${OUT_DIR}`);

  // Also generate index/home page OG image
  const indexSvg = buildSvg({
    title: 'Sebastian Aburto',
    description: 'Thoughts, ideas, philosophy, and practical tips about software development',
    tags: [],
    date: new Date().toISOString(),
  });

  const idxSvgPath = path.join(OUT_DIR, 'index.svg');
  const idxPngPath = path.join(OUT_DIR, 'index.png');
  fs.writeFileSync(idxSvgPath, indexSvg, 'utf-8');

  try {
    execSync(`node scripts/render-svg.mjs "${idxSvgPath}" "${idxPngPath}"`, { stdio: 'pipe', timeout: 15000 });
    console.log(`  ✓ index (sparkles)`);
  } catch (e) {
    console.error(`  ✗ index: ${e.message}`);
  }
  fs.unlinkSync(idxSvgPath);

  // Copy index.png to og-image.png as fallback for non-blog pages
  const fallbackPath = path.join(OUT_DIR, '..', 'og-image.png');
  fs.copyFileSync(idxPngPath, fallbackPath);
  console.log(`  → copied to public/og-image.png`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
