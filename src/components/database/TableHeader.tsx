'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const columns = [
  { key: 'name', label: 'Name', className: 'flex-1 min-w-0 pr-4 text-left' },
  { key: 'type', label: 'Type', className: 'w-28 shrink-0 hidden sm:block text-left' },
  { key: 'grade', label: 'Grade', className: 'w-[5.5rem] shrink-0 text-left' },
  { key: 'tier-asc', label: 'Tier', className: 'w-10 shrink-0 text-center' },
  { key: 'gs', label: 'GS', className: 'w-20 shrink-0 text-right hidden md:block' },
  { key: 'source', label: 'Source', className: 'w-24 shrink-0 text-right hidden lg:block' },
];

export default function TableHeader() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentSort = searchParams.get('sort') || 'name';

  const handleSort = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());

    let newSort: string;
    if (key === 'tier-asc') {
      newSort = currentSort === 'tier-asc' ? 'tier-desc' : 'tier-asc';
    } else if (key === 'gs') {
      newSort = currentSort === 'gs-asc' ? 'gs-desc' : 'gs-asc';
    } else if (currentSort === key) {
      newSort = key + '-desc';
    } else if (currentSort === key + '-desc') {
      newSort = key;
    } else {
      newSort = key;
    }

    params.set('sort', newSort);
    params.delete('page');
    router.replace(pathname + '?' + params.toString(), { scroll: false });
  };

  const getSortIndicator = (key: string) => {
    if (key === 'tier-asc') {
      if (currentSort === 'tier-asc') return ' \u25B2';
      if (currentSort === 'tier-desc') return ' \u25BC';
    } else if (key === 'gs') {
      if (currentSort === 'gs-asc') return ' \u25B2';
      if (currentSort === 'gs-desc') return ' \u25BC';
    } else {
      if (currentSort === key) return ' \u25B2';
      if (currentSort === key + '-desc') return ' \u25BC';
    }
    return '';
  };

  return (
    <div className="flex items-center px-4 py-2 border-b border-border-subtle text-xs font-medium bg-deep-night select-none">
      {columns.map((col) => (
        <button
          key={col.key}
          onClick={() => handleSort(col.key)}
          className={col.className + ' hover:text-accent-gold transition-colors cursor-pointer ' +
            (getSortIndicator(col.key) ? 'text-accent-gold' : 'text-text-muted')}
        >
          {col.label}{getSortIndicator(col.key)}
        </button>
      ))}
    </div>
  );
}
