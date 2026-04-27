// One-off migration: reads the current inline arrays from src/data/map-pois.ts
// and writes each as its own JSON file under src/data/map-pois/. After this
// runs, map-pois.ts is rewritten to import the JSON instead of inlining the
// arrays, which cuts Turbopack's single-module memory cost dramatically.

import * as fs from 'fs';
import * as path from 'path';
import {
  WARP_POIS,
  RESPAWN_POIS,
  RETURN_POIS,
  SECTION_LABELS,
  MONSTER_POIS,
  HERO_POIS,
  NEIGHBOR_POIS,
  PROP_POIS,
} from '../data/map-pois';

const OUT_DIR = path.resolve(__dirname, '..', 'data', 'map-pois');
fs.mkdirSync(OUT_DIR, { recursive: true });

const targets: Array<[string, unknown]> = [
  ['warp-pois.json', WARP_POIS],
  ['respawn-pois.json', RESPAWN_POIS],
  ['return-pois.json', RETURN_POIS],
  ['section-labels.json', SECTION_LABELS],
  ['monster-pois.json', MONSTER_POIS],
  ['hero-pois.json', HERO_POIS],
  ['neighbor-pois.json', NEIGHBOR_POIS],
  ['prop-pois.json', PROP_POIS],
];

for (const [name, data] of targets) {
  const file = path.join(OUT_DIR, name);
  fs.writeFileSync(file, JSON.stringify(data));
  const size = fs.statSync(file).size;
  console.log(`wrote ${name}: ${(size / 1024).toFixed(1)} KiB`);
}
console.log(`Done. ${targets.length} files in ${OUT_DIR}`);
