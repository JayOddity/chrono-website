// Builds a monsterId → level index by joining Character.CharacterStatID against
// CharacterStat. Each monster's stat group has one or more (DataID, Level) rows
// — we collect those levels and store [min, max]. In practice almost every
// monster has a single level, so the badge usually shows "Lv N" not a range.

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.resolve(__dirname, '..', '..', '..', 'Datamined Stuff', 'Data', 'Table_P');
const OUT_FILE = path.resolve(__dirname, '..', 'data', 'monster-levels.json');

type Row = Record<string, unknown>;

function readTable(file: string): Record<string, Row> {
  const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8')) as Array<{ Rows: Record<string, Row> }>;
  return raw[0].Rows;
}

const characters = readTable('Character.json');
const stats = readTable('CharacterStat.json');

// statId → list of levels available for that stat group.
const levelsByStat = new Map<number, number[]>();
for (const r of Object.values(stats)) {
  const dataId = r.DataID as number;
  const level = r.Level as number;
  if (typeof dataId !== 'number' || typeof level !== 'number') continue;
  let arr = levelsByStat.get(dataId);
  if (!arr) {
    arr = [];
    levelsByStat.set(dataId, arr);
  }
  arr.push(level);
}

const out: Record<string, [number, number]> = {};
let ok = 0;
let missing = 0;
for (const c of Object.values(characters)) {
  const charId = c.DataID as number;
  const statId = c.CharacterStatID as number;
  if (typeof charId !== 'number' || typeof statId !== 'number') continue;
  const levels = levelsByStat.get(statId);
  if (!levels || levels.length === 0) {
    missing++;
    continue;
  }
  const min = Math.min(...levels);
  const max = Math.max(...levels);
  out[String(charId)] = [min, max];
  ok++;
}

fs.writeFileSync(OUT_FILE, JSON.stringify(out));
console.log(`characters with levels: ${ok}, without: ${missing}`);
console.log(`stat groups indexed: ${levelsByStat.size}`);
console.log(`output: ${OUT_FILE}`);
