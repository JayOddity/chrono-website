import fs from 'node:fs';
import path from 'node:path';
import { OUT_DATA_DIR } from './lib/config.mjs';
import { buildClasses } from './domains/classes.mjs';
import { buildItems } from './domains/items.mjs';
import { buildItemIconsTs } from './domains/item-icons-ts.mjs';
import { buildMapTiles } from './domains/map-tiles.mjs';
import { buildPOIs } from './domains/pois.mjs';

const DOMAINS = {
  classes: buildClasses,
  items: buildItems,
};

const SIDECARS = {
  'item-icons-ts': buildItemIconsTs,
  'map-tiles': buildMapTiles,
  'map-pois': buildPOIs,
};

function main() {
  const requested = process.argv.slice(2);
  const names = requested.length
    ? requested
    : [...Object.keys(DOMAINS), ...Object.keys(SIDECARS)];

  fs.mkdirSync(OUT_DATA_DIR, { recursive: true });

  for (const name of names) {
    if (DOMAINS[name]) {
      console.log(`[datamine] building ${name}...`);
      const data = DOMAINS[name]();
      const outFile = path.join(OUT_DATA_DIR, `${name}.json`);
      fs.writeFileSync(outFile, JSON.stringify(data, null, 2) + '\n');
      console.log(`[datamine] wrote ${outFile} (${Array.isArray(data) ? data.length : 'n/a'} rows)`);
    } else if (SIDECARS[name]) {
      console.log(`[datamine] building ${name}...`);
      const result = SIDECARS[name]();
      console.log(`[datamine] wrote ${result.outFile} (${result.count} entries)`);
    } else {
      console.error(`Unknown target: ${name}`);
      process.exit(1);
    }
  }
}

main();
