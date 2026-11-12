// Renders favicons and social (Open Graph) images into /public.
// Needs Playwright with Chromium available on the machine: `npm run generate:og`.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = fileURLToPath(new URL('..', import.meta.url));
const land = JSON.parse(readFileSync(`${root}src/data/land.json`, 'utf8'));

const pages = [
  ['home', 'Global Workforce • Technology • AI', 'Building Global Talent. Powering Technology. Driving Business Forward.'],
  ['solutions', 'Solutions', 'Workforce, Technology & Business Solutions'],
  ['recruitment-workforce', 'Solutions', 'Recruitment & Workforce Solutions'],
  ['technology', 'Solutions', 'Technology Solutions'],
  ['training', 'Solutions', 'Training & Professional Development'],
  ['consulting', 'Solutions', 'Consulting & Professional Services'],
  ['business-process', 'Solutions', 'Business Process Solutions'],
  ['industries', 'Industries', 'Eleven industries, one partner'],
  ['technology-ai', 'Technology & AI', 'Technology and AI, delivered by our own engineers'],
  ['products', 'Products', 'AI products built by LucidAccuracy'],
  ['ai-calling-agent', 'LucidAI Calling Agent', 'Meet Your AI Calling Agent. Human-like conversations. Automated at scale.'],
  ['projects', 'Projects', 'Projects and case studies'],
  ['global-presence', 'Global Presence', 'Global Reach. Local Expertise.'],
  ['about', 'About Us', 'A global company built on people, technology and AI'],
  ['careers', 'Careers', 'Careers with LucidAccuracy and our clients'],
  ['contact', 'Contact', 'Talk to the LucidAccuracy team'],
  ['default', 'LucidAccuracy', 'Global Workforce, Technology & Business Solutions'],
];

// Orthographic globe, centred on the Atlantic.
const RAD = Math.PI / 180;
const rot = 42 * RAD;
const tilt = 20 * RAD;
const project = (lat, lon) => {
  const c = Math.cos(lat * RAD);
  const v = [c * Math.sin(lon * RAD), Math.sin(lat * RAD), c * Math.cos(lon * RAD)];
  const x = v[0] * Math.cos(rot) + v[2] * Math.sin(rot);
  const z1 = -v[0] * Math.sin(rot) + v[2] * Math.cos(rot);
  return [x, v[1] * Math.cos(tilt) - z1 * Math.sin(tilt), v[1] * Math.sin(tilt) + z1 * Math.cos(tilt)];
};
const R = 290;
const dots = land.globe
  .map(([lat, lon]) => project(lat, lon))
  .filter((p) => p[2] > 0)
  .map((p) => `<circle cx="${(p[0] * R).toFixed(1)}" cy="${(-p[1] * R).toFixed(1)}" r="${(1.3 + p[2] * 1.3).toFixed(2)}" opacity="${(0.2 + p[2] * 0.75).toFixed(2)}"/>`)
  .join('');
const pins = [[39.5, -98.5], [55, -106], [53.5, -1.8], [49.5, 11]]
  .map(([lat, lon]) => project(lat, lon))
  .map((p) => `<circle cx="${p[0] * R}" cy="${-p[1] * R}" r="7" fill="#eca01d"/><circle cx="${p[0] * R}" cy="${-p[1] * R}" r="15" fill="none" stroke="#eca01d" stroke-opacity=".5" stroke-width="2"/>`)
  .join('');

const font = (pkg, file) => `file://${root}node_modules/@fontsource-variable/${pkg}/files/${file}`;
const mark = (size) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}"><rect width="64" height="64" rx="16" fill="#1e8f79"/><path d="M45.4 21.6A17 17 0 1 0 49 32" fill="none" stroke="#fff" stroke-width="5.5" stroke-linecap="round"/><circle cx="32" cy="32" r="5.5" fill="#eca01d"/></svg>`;

const html = (kicker, title) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:D;src:url(${font('schibsted-grotesk', 'schibsted-grotesk-latin-wght-normal.woff2')});font-weight:400 900}
@font-face{font-family:B;src:url(${font('inter', 'inter-latin-wght-normal.woff2')});font-weight:100 900}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:radial-gradient(60% 90% at 88% 50%,hsl(168 65% 30%/.45),transparent 70%),hsl(188 42% 7.5%);color:hsl(150 22% 95%);font-family:B;position:relative}
.globe{position:absolute;left:1000px;top:330px;width:0;height:0}
.globe svg{overflow:visible}
.in{position:absolute;inset:0;padding:64px 72px;display:flex;flex-direction:column}
.logo{display:flex;align-items:center;gap:14px;font:700 34px D;letter-spacing:-.03em}
.logo b{color:hsl(166 58% 52%)}
.k{margin-top:auto;font:600 20px B;letter-spacing:.14em;text-transform:uppercase;color:hsl(166 58% 52%)}
h1{margin-top:18px;max-width:700px;font:600 ${title.length > 52 ? 52 : 66}px/1.06 D;letter-spacing:-.032em;text-wrap:balance}
.f{margin-top:34px;display:flex;gap:28px;font:500 21px B;color:hsl(168 16% 72%)}
.f span:first-child{color:#eca01d;font-weight:600}
</style></head><body>
<div class="globe"><svg width="1" height="1"><circle r="${R}" fill="hsl(186 34% 11%)" stroke="hsl(166 58% 52%)" stroke-opacity=".35"/><g fill="hsl(166 52% 56%)">${dots}</g>${pins}</svg></div>
<div class="in"><div class="logo">${mark(48)}<span>Lucid<b>Accuracy</b></span></div>
<p class="k">${kicker}</p><h1>${title}</h1>
<div class="f"><span>lucidaccuracy.com</span><span>USA · Canada · UK · Australia · Europe · India</span></div></div>
</body></html>`;

mkdirSync(`${root}public/og`, { recursive: true });
const tmp = `${root}.og-template.html`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [slug, kicker, title] of pages) {
  // Loaded from a file so the local font files are allowed to load.
  writeFileSync(tmp, html(kicker, title));
  await page.goto(`file://${tmp}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ type: 'png' });
  await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(`${root}public/og/${slug}.jpg`);
}
await browser.close();
rmSync(tmp, { force: true });

// Favicons
const svg = Buffer.from(mark(512));
for (const [name, size] of [['icon-512.png', 512], ['icon-192.png', 192], ['apple-touch-icon.png', 180]]) {
  await sharp(svg, { density: 300 }).resize(size, size).png().toFile(`${root}public/${name}`);
}
const png32 = await sharp(svg, { density: 300 }).resize(32, 32).png().toBuffer();
const ico = Buffer.alloc(22);
ico.writeUInt16LE(0, 0);
ico.writeUInt16LE(1, 2);
ico.writeUInt16LE(1, 4);
ico.writeUInt8(32, 6);
ico.writeUInt8(32, 7);
ico.writeUInt16LE(1, 10);
ico.writeUInt16LE(32, 12);
ico.writeUInt32LE(png32.length, 14);
ico.writeUInt32LE(22, 18);
writeFileSync(`${root}public/favicon.ico`, Buffer.concat([ico, png32]));
console.log(`Wrote ${pages.length} social images and favicons.`);
