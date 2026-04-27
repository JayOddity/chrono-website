// Aggregates NEIGHBOR_POIS (friendly NPCs — vendors, townsfolk, questgivers)
// into one row per characterId for the NPC list page, plus per-id spawn
// lookups for the detail page. All data comes from NEIGHBOR_POIS.

import { NEIGHBOR_POIS, type NeighborPoi } from './map-pois';

export interface NpcSummary {
  characterId: number;
  name: string;
  pinCount: number;
  regionIds: number[];
}

export interface NpcDetail extends NpcSummary {
  spawns: NeighborPoi[];
}

let summariesCache: NpcSummary[] | null = null;
let spawnsByIdCache: Map<number, NeighborPoi[]> | null = null;

function build(): void {
  const map = new Map<number, NeighborPoi[]>();
  for (const n of NEIGHBOR_POIS) {
    let arr = map.get(n.characterId);
    if (!arr) {
      arr = [];
      map.set(n.characterId, arr);
    }
    arr.push(n);
  }
  const summaries: NpcSummary[] = [];
  for (const [id, arr] of map) {
    const first = arr.find((p) => p.name) ?? arr[0];
    const name = first.name ?? 'Unnamed NPC';
    const regionSet = new Set<number>();
    for (const p of arr) regionSet.add(p.regionId);
    summaries.push({
      characterId: id,
      name,
      pinCount: arr.length,
      regionIds: Array.from(regionSet).sort((a, b) => a - b),
    });
  }
  summaries.sort((a, b) => a.name.localeCompare(b.name) || a.characterId - b.characterId);
  summariesCache = summaries;
  spawnsByIdCache = map;
}

export function getNpcSummaries(): NpcSummary[] {
  if (!summariesCache) build();
  return summariesCache!;
}

// One row per name. Different characterIds with the same name (e.g. "Frontier
// Guard" appearing under several IDs) collapse so the picker is shorter.
export interface NpcGroup {
  key: string;
  name: string;
  characterIds: number[];
  pinCount: number;
  regionIds: number[];
}

let groupsCache: NpcGroup[] | null = null;

export function getNpcGroups(): NpcGroup[] {
  if (groupsCache) return groupsCache;
  const map = new Map<string, NpcGroup>();
  for (const n of getNpcSummaries()) {
    let g = map.get(n.name);
    if (!g) {
      g = { key: n.name, name: n.name, characterIds: [], pinCount: 0, regionIds: [] };
      map.set(n.name, g);
    }
    g.characterIds.push(n.characterId);
    g.pinCount += n.pinCount;
    for (const r of n.regionIds) if (!g.regionIds.includes(r)) g.regionIds.push(r);
  }
  groupsCache = Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  return groupsCache;
}

export function getNpcDetail(id: number): NpcDetail | null {
  if (!spawnsByIdCache) build();
  const arr = spawnsByIdCache!.get(id);
  if (!arr || arr.length === 0) return null;
  const first = arr.find((p) => p.name) ?? arr[0];
  const name = first.name ?? 'Unnamed NPC';
  const regionSet = new Set<number>();
  for (const p of arr) regionSet.add(p.regionId);
  return {
    characterId: id,
    name,
    pinCount: arr.length,
    regionIds: Array.from(regionSet).sort((a, b) => a - b),
    spawns: arr,
  };
}
