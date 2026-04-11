'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export default function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p > 1) {
      params.set('page', String(p));
    } else {
      params.delete('page');
    }
    router.push(pathname + '?' + params.toString(), { scroll: true });
  };

  const range = getPaginationRange(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 text-sm rounded border border-border-subtle text-text-muted hover:text-accent-gold hover:border-accent-gold-dim transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        Prev
      </button>
      {range.map((p, i) =>
        p === '...' ? (
          <span key={'ellipsis-' + i} className="px-2 text-text-muted">...</span>
        ) : (
          <button
            key={p}
            onClick={() => setPage(p as number)}
            className={
              'px-3 py-1.5 text-sm rounded border transition-colors ' +
              (p === page
                ? 'bg-accent-gold/20 border-accent-gold text-accent-gold'
                : 'border-border-subtle text-text-muted hover:text-accent-gold hover:border-accent-gold-dim')
            }
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => setPage(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1.5 text-sm rounded border border-border-subtle text-text-muted hover:text-accent-gold hover:border-accent-gold-dim transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        Next
      </button>
    </div>
  );
}

function getPaginationRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [1];
  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}
