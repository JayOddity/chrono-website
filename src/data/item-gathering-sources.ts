// Auto-built mapping from item IDs to the gathering node subtype that produces
// them. Each PROP_POIS subtype title (e.g. "Iron Deposit") is matched against
// items.ts via a small set of name transforms — the first hit wins.
//
// If the datamined drop tables ever get extracted, regenerate this map from
// them instead; the heuristics here are a stopgap.

import { items, type ItemListEntry } from './items';
import { PROP_POIS } from './map-pois';

export type GatheringCategory = 'mining' | 'harvesting' | 'logging';

export interface GatheringSource {
  subtype: string;
  category: GatheringCategory;
}

const GATHERING_CATEGORIES: GatheringCategory[] = ['mining', 'harvesting', 'logging'];

// Manual transform overrides for subtypes whose raw-gathered item name doesn't
// match the node label directly.
const SPECIAL_CANDIDATES: Record<string, string[]> = {
  'Rock': ['Stone'],
  'Cotton': ['Cotton Fibers'],
  'Silk': ['Silk Fibers'],
  'Ramie': ['Ramie Fibers'],
  'Flax': ['Flax Fibers'],
  'Thicket': ['Thicket Bud', 'Thicket Stem'],
  'Wild Berries': ['Wild Berry'],
};

function candidateItemNames(subtype: string): string[] {
  const out: string[] = [subtype];
  if (subtype.endsWith(' Deposit')) {
    out.push(subtype.replace(/ Deposit$/, ' Ore'));
  }
  if (subtype.endsWith(' Tree')) {
    out.push(subtype.replace(/ Tree$/, ' Wood'));
    out.push(subtype.replace(/ Tree$/, ' Log'));
    out.push(subtype.replace(/ Tree$/, ' Timber'));
  }
  if (SPECIAL_CANDIDATES[subtype]) {
    out.push(...SPECIAL_CANDIDATES[subtype]);
  }
  return out;
}

function findItemByName(name: string): ItemListEntry | null {
  return items.find((i) => i.name === name) ?? null;
}

// Collect unique (subtype, category) pairs from PROP_POIS for the three
// gathering categories.
const SUBTYPE_TO_CATEGORY = new Map<string, GatheringCategory>();
for (const p of PROP_POIS) {
  if (!GATHERING_CATEGORIES.includes(p.category as GatheringCategory)) continue;
  if (!p.title) continue;
  SUBTYPE_TO_CATEGORY.set(p.title, p.category as GatheringCategory);
}

export const ITEM_TO_GATHERING_SOURCE: Record<number, GatheringSource> = (() => {
  const out: Record<number, GatheringSource> = {};
  for (const [subtype, category] of SUBTYPE_TO_CATEGORY.entries()) {
    for (const name of candidateItemNames(subtype)) {
      const item = findItemByName(name);
      if (item) {
        out[item.id] = { subtype, category };
        break;
      }
    }
  }
  return out;
})();

export function getGatheringSource(itemId: number): GatheringSource | null {
  return ITEM_TO_GATHERING_SOURCE[itemId] ?? null;
}
