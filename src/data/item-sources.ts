// Helper around `item-sources.json` (built by `src/scripts/extract-item-sources.ts`).
// `getItemSources(itemId)` returns the typed source list for a given item.

import sourcesRaw from './item-sources.json';

export type ItemSource =
  | { kind: 'quest'; questId: number; questName: string; quantityMin?: number; quantityMax?: number }
  | { kind: 'achievement'; achievementId: number; achievementName: string; quantityMin?: number; quantityMax?: number }
  | { kind: 'bounty'; wantedId: number; targetMonsterId: number; targetMonsterName: string; role: 'proof' | 'reward'; quantity?: number }
  | { kind: 'challenge'; challengeId: number; targetMonsterId?: number; targetMonsterName?: string; quantity?: number }
  | { kind: 'monster-soul'; monsterId: number; monsterName: string; quantity: number }
  | { kind: 'dungeon-entry'; dungeonId: number; dungeonName: string; regionId?: number; quantity?: number }
  | { kind: 'dungeon-reward'; dungeonId: number; dungeonName: string; regionId?: number }
  | { kind: 'vendor'; storeId: number; vendorId?: number; vendorName?: string };

const sources = sourcesRaw as Record<string, ItemSource[]>;

export function getItemSources(itemId: number): ItemSource[] {
  return sources[itemId.toString()] ?? [];
}

export function hasItemSources(itemId: number): boolean {
  return Boolean(sources[itemId.toString()]?.length);
}
