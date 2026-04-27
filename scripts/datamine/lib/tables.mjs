import fs from 'node:fs';
import path from 'node:path';
import { DATA_TABLE_DIR } from './config.mjs';

const cache = new Map();

export function loadTable(name) {
  if (cache.has(name)) return cache.get(name);
  const file = path.join(DATA_TABLE_DIR, `${name}.json`);
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = JSON.parse(raw);
  const envelope = Array.isArray(parsed) ? parsed[0] : parsed;
  const rows = envelope?.Rows ?? {};
  cache.set(name, rows);
  return rows;
}

export function enumTail(value) {
  if (typeof value !== 'string') return value;
  const idx = value.lastIndexOf('::');
  return idx >= 0 ? value.slice(idx + 2) : value;
}
