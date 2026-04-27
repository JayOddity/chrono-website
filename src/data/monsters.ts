// Aggregates the raw MONSTER_POIS table into bestiary-style views: one row per
// monsterId for the list page, plus per-id spawn lookups for detail pages.
// All data comes from MONSTER_POIS — no separate processing pipeline.

import { MONSTER_POIS, type MonsterPoi } from './map-pois';
import monsterLevelsRaw from './monster-levels.json';

const monsterLevels = monsterLevelsRaw as unknown as Record<string, [number, number]>;

export type MonsterGrade =
  | 'Normal'
  | 'Elite'
  | 'Named'
  | 'LowBoss'
  | 'MidBoss'
  | 'HighBoss'
  | string;

export interface MonsterSummary {
  monsterId: number;
  name: string;
  grade: MonsterGrade;
  subType: string;
  totalSpawns: number;
  pinCount: number;
  levelMin: number | null;
  levelMax: number | null;
}

export interface MonsterDetail extends MonsterSummary {
  spawns: MonsterPoi[];
}

const GRADE_ORDER: Record<string, number> = {
  HighBoss: 0,
  MidBoss: 1,
  LowBoss: 2,
  Named: 3,
  Elite: 4,
  Normal: 5,
};

let summariesCache: MonsterSummary[] | null = null;
let spawnsByIdCache: Map<number, MonsterPoi[]> | null = null;

function build(): void {
  const map = new Map<number, MonsterPoi[]>();
  for (const m of MONSTER_POIS) {
    let arr = map.get(m.monsterId);
    if (!arr) {
      arr = [];
      map.set(m.monsterId, arr);
    }
    arr.push(m);
  }
  const summaries: MonsterSummary[] = [];
  for (const [id, arr] of map) {
    const first = arr[0];
    let totalSpawns = 0;
    for (const p of arr) totalSpawns += p.spawnCount;
    const lv = monsterLevels[String(id)];
    summaries.push({
      monsterId: id,
      name: first.name,
      grade: first.grade,
      subType: first.subType,
      totalSpawns,
      pinCount: arr.length,
      levelMin: lv ? lv[0] : null,
      levelMax: lv ? lv[1] : null,
    });
  }
  summaries.sort(
    (a, b) =>
      (GRADE_ORDER[a.grade] ?? 9) - (GRADE_ORDER[b.grade] ?? 9) ||
      a.name.localeCompare(b.name) ||
      a.monsterId - b.monsterId,
  );
  summariesCache = summaries;
  spawnsByIdCache = map;
}

export function getMonsterSummaries(): MonsterSummary[] {
  if (!summariesCache) build();
  return summariesCache!;
}

// One row per (name, grade). Same-named visual variants share a row so the
// map picker isn't cluttered with "Shady Lot Broken" × 4. monsterIds keeps
// the underlying ids so picking a group can spotlight every variant at once.
export interface MonsterGroup {
  key: string;
  name: string;
  grade: MonsterGrade;
  monsterIds: number[];
  pinCount: number;
  totalSpawns: number;
  levelMin: number | null;
  levelMax: number | null;
}

let groupsCache: MonsterGroup[] | null = null;

export function getMonsterGroups(): MonsterGroup[] {
  if (groupsCache) return groupsCache;
  const map = new Map<string, MonsterGroup>();
  for (const m of getMonsterSummaries()) {
    const key = `${m.name}\u0000${m.grade}`;
    let g = map.get(key);
    if (!g) {
      g = { key, name: m.name, grade: m.grade, monsterIds: [], pinCount: 0, totalSpawns: 0, levelMin: null, levelMax: null };
      map.set(key, g);
    }
    g.monsterIds.push(m.monsterId);
    g.pinCount += m.pinCount;
    g.totalSpawns += m.totalSpawns;
    if (m.levelMin != null) g.levelMin = g.levelMin == null ? m.levelMin : Math.min(g.levelMin, m.levelMin);
    if (m.levelMax != null) g.levelMax = g.levelMax == null ? m.levelMax : Math.max(g.levelMax, m.levelMax);
  }
  groupsCache = Array.from(map.values()).sort(
    (a, b) =>
      (GRADE_ORDER[a.grade] ?? 9) - (GRADE_ORDER[b.grade] ?? 9) ||
      a.name.localeCompare(b.name),
  );
  return groupsCache;
}

export function getMonsterDetail(id: number): MonsterDetail | null {
  if (!spawnsByIdCache) build();
  const arr = spawnsByIdCache!.get(id);
  if (!arr || arr.length === 0) return null;
  const first = arr[0];
  let totalSpawns = 0;
  for (const p of arr) totalSpawns += p.spawnCount;
  const lv = monsterLevels[String(id)];
  return {
    monsterId: id,
    name: first.name,
    grade: first.grade,
    subType: first.subType,
    totalSpawns,
    pinCount: arr.length,
    levelMin: lv ? lv[0] : null,
    levelMax: lv ? lv[1] : null,
    spawns: arr,
  };
}

// Helper for compact "Lv N" or "Lv N-M" badges in UI.
export function formatLevelRange(min: number | null, max: number | null): string | null {
  if (min == null || max == null) return null;
  if (min === max) return `Lv ${min}`;
  return `Lv ${min}-${max}`;
}

export const GRADE_LABELS: Record<string, string> = {
  HighBoss: 'High Boss',
  MidBoss: 'Mid Boss',
  LowBoss: 'Low Boss',
  Named: 'Named',
  Elite: 'Elite',
  Normal: 'Normal',
};

export const GRADE_COLORS: Record<string, string> = {
  HighBoss: '#f43f5e',
  MidBoss: '#fb7185',
  LowBoss: '#fda4af',
  Named: '#fbbf24',
  Elite: '#f87171',
  Normal: '#94a3b8',
};
