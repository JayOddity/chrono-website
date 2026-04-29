'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { ALL_CATEGORIES, ALL_GRADES } from '@/data/items';

const tierOptions = [1, 2, 3, 4, 5];
const sourceOptions = ['Crafting', 'Store', 'Quest', 'Dungeon', 'Challenge'];

export default function ItemFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSearch = searchParams.get('q') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentGrade = searchParams.get('grade') || '';
  const currentTier = searchParams.get('tier') || '';
  const currentSource = searchParams.get('source') || '';

  const setParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.replace(pathname + '?' + params.toString(), { scroll: false });
  }, [searchParams, router, pathname]);

  const selectClasses = 'bg-deep-night border border-border-subtle rounded px-2 py-1.5 text-sm text-text-primary focus:border-accent-gold-dim focus:outline-none';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <select
          value={currentCategory}
          onChange={(e) => setParam('category', e.target.value)}
          className={selectClasses}
        >
          <option value="">All Categories</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={currentGrade}
          onChange={(e) => setParam('grade', e.target.value)}
          className={selectClasses}
        >
          <option value="">All Grades</option>
          {ALL_GRADES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <select
          value={currentTier}
          onChange={(e) => setParam('tier', e.target.value)}
          className={selectClasses}
        >
          <option value="">All Tiers</option>
          {tierOptions.map((t) => (
            <option key={t} value={String(t)}>Tier {t}</option>
          ))}
        </select>

        <select
          value={currentSource}
          onChange={(e) => setParam('source', e.target.value)}
          className={selectClasses}
        >
          <option value="">All Sources</option>
          {sourceOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search items..."
          defaultValue={currentSearch}
          onChange={(e) => setParam('q', e.target.value)}
          className="ml-auto flex-1 min-w-[200px] bg-deep-night border border-border-subtle rounded px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-gold-dim focus:outline-none"
        />
      </div>
    </div>
  );
}
