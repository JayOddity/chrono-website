import type { Metadata } from 'next';
import { Suspense } from 'react';
import { items } from '@/data/items';
import type { ItemListEntry } from '@/data/items';
import ItemFilters from '@/components/database/ItemFilters';
import ItemGrid from '@/components/database/ItemGrid';

const ITEMS_PER_PAGE = 100;

const gradeOrder: Record<string, number> = {
  Legendary: 0, Epic: 1, Rare: 2, Uncommon: 3, Common: 4,
};

export const metadata: Metadata = {
  title: 'Item Database - Chrono Info',
  description: 'Browse all 3,034 datamined items from the Chrono Odyssey closed beta. Filter by category, grade, tier, and more.',
};

function filterAndSort(
  searchParams: Record<string, string | undefined>
): { items: ItemListEntry[]; total: number; page: number; totalPages: number } {
  const search = (searchParams.q || '').toLowerCase();
  const category = searchParams.category || '';
  const grade = searchParams.grade || '';
  const tier = searchParams.tier || '';
  const sort = searchParams.sort || 'name';
  const source = searchParams.source || '';
  const page = Math.max(1, parseInt(searchParams.page || '1', 10));

  let result = items;

  if (search) {
    result = result.filter(i => i.name.toLowerCase().includes(search));
  }
  if (category) {
    result = result.filter(i => i.category === category);
  }
  if (grade) {
    result = result.filter(i => i.grade === grade);
  }
  if (tier) {
    result = result.filter(i => i.tier === parseInt(tier, 10));
  }
  if (source) {
    result = result.filter(i => i.sources.includes(source));
  }

  result = [...result];
  switch (sort) {
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'type':
      result.sort((a, b) => a.typeDisplay.localeCompare(b.typeDisplay) || a.name.localeCompare(b.name));
      break;
    case 'type-desc':
      result.sort((a, b) => b.typeDisplay.localeCompare(a.typeDisplay) || a.name.localeCompare(b.name));
      break;
    case 'grade':
      result.sort((a, b) => (gradeOrder[a.grade] ?? 5) - (gradeOrder[b.grade] ?? 5) || a.name.localeCompare(b.name));
      break;
    case 'grade-desc':
      result.sort((a, b) => (gradeOrder[b.grade] ?? 5) - (gradeOrder[a.grade] ?? 5) || a.name.localeCompare(b.name));
      break;
    case 'tier-asc':
      result.sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));
      break;
    case 'tier-desc':
      result.sort((a, b) => b.tier - a.tier || a.name.localeCompare(b.name));
      break;
    case 'gs-asc':
      result.sort((a, b) => a.gearScoreMin - b.gearScoreMin || a.name.localeCompare(b.name));
      break;
    case 'gs-desc':
      result.sort((a, b) => b.gearScoreMin - a.gearScoreMin || a.name.localeCompare(b.name));
      break;
    case 'source':
      result.sort((a, b) => (a.sources[0] || 'zzz').localeCompare(b.sources[0] || 'zzz') || a.name.localeCompare(b.name));
      break;
    case 'source-desc':
      result.sort((a, b) => (b.sources[0] || '').localeCompare(a.sources[0] || '') || a.name.localeCompare(b.name));
      break;
  }

  const totalPages = Math.ceil(result.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(page, totalPages);
  const pageItems = result.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  return { items: pageItems, total: result.length, page: safePage, totalPages };
}

export default async function DatabasePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const { items: pageItems, total, page, totalPages } = filterAndSort(params);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl text-accent-gold mb-2">Item Database</h1>
        <p className="text-text-muted text-sm">
          {items.length.toLocaleString()} items datamined from the Chrono Odyssey closed beta (June 2025).
          Stats and items are subject to change before release.
        </p>
      </div>

      <Suspense fallback={<div className="text-text-muted">Loading filters...</div>}>
        <div className="mb-6">
          <ItemFilters />
        </div>
      </Suspense>

      <ItemGrid
        items={pageItems}
        total={total}
        page={page}
        totalPages={totalPages}
      />
    </main>
  );
}
