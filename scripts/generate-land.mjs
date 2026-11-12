// Builds src/data/land.json: land dots for the 3D globe and the flat world map.
// Run with `npm run generate:land` (only needed if the dot density changes).
import { readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';

const topo = JSON.parse(readFileSync(new URL('../node_modules/world-atlas/land-110m.json', import.meta.url)));
const land = feature(topo, topo.objects.land);
const r1 = (n) => Math.round(n * 10) / 10;

// Globe: rows of latitude, longitude step widened towards the poles so dots stay evenly spaced.
const globe = [];
const STEP = 2.6;
for (let lat = -58; lat <= 82; lat += STEP) {
  const n = Math.max(1, Math.round((360 * Math.cos((lat * Math.PI) / 180)) / STEP));
  for (let i = 0; i < n; i++) {
    const lon = -180 + (360 * i) / n;
    if (geoContains(land, [lon, lat])) globe.push([r1(lat), r1(lon)]);
  }
}

// Flat map: regular equirectangular grid, cropped to inhabited latitudes.
const flat = [];
const FSTEP = 2.25;
for (let lat = 76; lat >= -54; lat -= FSTEP) {
  for (let lon = -168; lon <= 178; lon += FSTEP) {
    if (geoContains(land, [lon, lat])) flat.push([r1(lat), r1(lon)]);
  }
}

writeFileSync(new URL('../src/data/land.json', import.meta.url), JSON.stringify({ globe, flat }));
console.log(`globe: ${globe.length} dots, flat: ${flat.length} dots`);
