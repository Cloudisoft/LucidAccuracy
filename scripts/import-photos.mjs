// Turns chosen Wikimedia Commons photos into site images plus a credits file.
// usage: node scripts/import-photos.mjs <found.json> <thumb dir> slug=id [slug=id ...]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import sharp from 'sharp';

const [found, dir, ...pairs] = process.argv.slice(2);
const photos = JSON.parse(readFileSync(found, 'utf8')).photos;
const out = new URL('../src/data/photos.json', import.meta.url);
const credits = existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : {};
for (const pair of pairs) {
  const [slug, id] = pair.split('=');
  const p = photos.find((x) => x.id === id);
  if (!p) throw new Error(`no photo ${id}`);
  const file = `public/images/industries/${slug}.webp`;
  const img = sharp(`${dir}/${id}.jpg`).resize({ width: 960, height: 640, fit: 'cover', position: 'attention' });
  await img.webp({ quality: 74 }).toFile(file);
  const tiny = await sharp(`${dir}/${id}.jpg`).resize(24, 16, { fit: 'cover' }).webp({ quality: 40 }).toBuffer();
  credits[slug] = {
    src: `/images/industries/${slug}.webp`,
    placeholder: `data:image/webp;base64,${tiny.toString('base64')}`,
    by: p.by,
    licence: p.licence,
    licenceUrl: p.licenceUrl,
    page: p.page,
    title: p.alt,
  };
  console.log(slug, '<-', id, p.licence);
}
writeFileSync(out, JSON.stringify(credits, null, 2));
