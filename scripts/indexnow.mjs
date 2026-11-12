// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver; Bing also feeds
// ChatGPT search) that every page in the sitemap changed.
// usage: node scripts/indexnow.mjs   (after the site is deployed)
import { readFileSync } from 'node:fs';
const host = 'lucidaccuracy.com';
const key = readFileSync(new URL('../.indexnow-key', import.meta.url), 'utf8').trim();
const xml = await (await fetch(`https://${host}/sitemap-0.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList }),
});
console.log('IndexNow', res.status, res.statusText, `${urlList.length} URLs`);
