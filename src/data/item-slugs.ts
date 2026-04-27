// Bidirectional map between item IDs and URL slugs. Built once at module load.
// Slug = kebab-cased item name. Names that collide (e.g. 181 items named
// "Ragged Clothes") get disambiguated by appending the numeric id.

import { items } from './items';

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const itemIdToSlug = new Map<number, string>();
const slugToItemId = new Map<string, number>();

(() => {
  const baseCount = new Map<string, number>();
  const bases: { id: number; base: string }[] = [];
  for (const item of items) {
    const base = normalize(item.name);
    bases.push({ id: item.id, base });
    baseCount.set(base, (baseCount.get(base) ?? 0) + 1);
  }
  for (const { id, base } of bases) {
    const rawBase = base || 'item';
    const collides = (baseCount.get(base) ?? 0) > 1 || base === '';
    const slug = collides ? `${rawBase}-${id}` : rawBase;
    itemIdToSlug.set(id, slug);
    slugToItemId.set(slug, id);
  }
})();

export function getItemSlug(itemId: number): string | undefined {
  return itemIdToSlug.get(itemId);
}

export function getItemIdBySlug(slug: string): number | undefined {
  return slugToItemId.get(slug);
}

export function allItemSlugs(): string[] {
  return Array.from(slugToItemId.keys());
}
