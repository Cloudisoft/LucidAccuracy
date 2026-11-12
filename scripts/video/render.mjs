// Renders the explainer videos from studio.html.
// usage: node scripts/video/render.mjs [id ...] [--stills t1,t2,...]
//   With --stills it writes PNG frames at those times instead of a video.
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = resolve(new URL('../..', import.meta.url).pathname);
const args = process.argv.slice(2);
const stillsArg = args.indexOf('--stills');
const stills = stillsArg >= 0 ? args[stillsArg + 1].split(',').map(Number) : null;
const outArg = args.indexOf('--out');
const outDir = outArg >= 0 ? resolve(args[outArg + 1]) : join(root, 'public/video');
const skip = new Set([stillsArg, outArg].filter((i) => i >= 0).map((i) => i + 1));
const ids = args.filter((a, i) => !a.startsWith('--') && !skip.has(i));
const all = ['people', 'technology', 'ai', 'ai-hiring', 'skills'];
const list = ids.length ? ids : all;
const FPS = 30;
const DUR = 30;

const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  const p = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(root) || !existsSync(p) || statSync(p).isDirectory()) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' });
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/scripts/video/studio.html`;
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
for (const id of list) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${base}?v=${id}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.ready);
  if (errors.length) throw new Error(`${id}: ${errors.join('; ')}`);

  if (stills) {
    for (const t of stills) {
      await page.evaluate((t) => window.seek(t), t);
      await page.screenshot({ path: join(outDir, `${id}-${t}.png`) });
    }
    console.log(id, 'stills written');
    await page.close();
    continue;
  }

  const music = join(outDir, `${id}.wav`);
  spawnSync('python3', [join(root, 'scripts/video/music.py'), music, id], { stdio: 'inherit' });
  const mp4 = join(outDir, `${id}.mp4`);
  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-i', music,
    '-filter:a', 'loudnorm=I=-20:TP=-2:LRA=7',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
    '-c:a', 'aac', '-b:a', '128k', '-ar', '44100',
    '-shortest', '-movflags', '+faststart', mp4,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const started = Date.now();
  for (let f = 0; f < FPS * DUR; f++) {
    await page.evaluate((t) => window.seek(t), f / FPS);
    const jpg = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  // Poster from a settled moment of the opening scene.
  await page.evaluate(() => window.seek(4.2));
  await page.screenshot({ path: join(outDir, `${id}.jpg`), type: 'jpeg', quality: 82 });
  spawnSync('rm', ['-f', music]);
  console.log(id, `rendered in ${Math.round((Date.now() - started) / 1000)}s`, `${(statSync(mp4).size / 1e6).toFixed(1)} MB`);
  await page.close();
}
await browser.close();
server.close();
