import type { ItemListEntry } from '@/data/items';
import ItemCard from './ItemCard';
import Pagination from './Pagination';
import TableHeader from './TableHeader';

export default function ItemGrid({
  items,
  total,
  page,
  totalPages,
}: {
  items: ItemListEntry[];
  total: number;
  page: number;
  totalPages: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-muted">
          Showing {total.toLocaleString()} item{total !== 1 ? 's' : ''}
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-text-muted">
            Page {page} of {totalPages}
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          No items match your filters.
        </div>
      ) : (
        <div className="bg-card-bg border border-border-subtle rounded-lg overflow-hidden">
          <TableHeader />
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} />
      )}
    </div>
  );
}
