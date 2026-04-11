import Link from 'next/link';
import type { ItemListEntry } from '@/data/items';
import GradeBadge, { gradeTextColor } from './GradeBadge';

const sourceColors: Record<string, string> = {
  Crafting: 'text-amber-400',
  Store: 'text-emerald-400',
  Quest: 'text-sky-400',
  Dungeon: 'text-red-400',
  Challenge: 'text-purple-400',
};

export default function ItemCard({ item }: { item: ItemListEntry }) {
  return (
    <Link
      href={'/database/' + item.id}
      className="group flex items-center px-4 py-2.5 border-b border-border-subtle hover:bg-deep-night transition-colors"
    >
      <span className={'flex-1 min-w-0 text-sm font-medium truncate pr-4 group-hover:text-accent-gold transition-colors ' + gradeTextColor(item.grade)}>
        {item.name}
      </span>

      <span className="text-xs text-text-muted w-28 shrink-0 truncate hidden sm:block">
        {item.typeDisplay}
      </span>

      <span className="w-[5.5rem] shrink-0">
        <GradeBadge grade={item.grade} />
      </span>

      <span className="text-xs text-text-muted w-10 shrink-0 text-center">T{item.tier}</span>

      <span className="text-xs text-text-muted w-20 shrink-0 text-right hidden md:block">
        {item.gearScoreMin > 0 ? 'GS ' + item.gearScoreMin + '–' + item.gearScoreMax : ''}
      </span>

      <span className="w-24 shrink-0 flex gap-1.5 justify-end hidden lg:flex">
        {item.sources.map((source) => (
          <span key={source} className={'text-xs ' + (sourceColors[source] || 'text-text-muted')}>
            {source}
          </span>
        ))}
      </span>
    </Link>
  );
}
