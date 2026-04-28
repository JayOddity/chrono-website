import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { items } from '@/data/items';
import { getItemDetail, getUsedInCrafting } from '@/data/items-detail';
import { getItemIcon } from '@/data/item-icons';
import { gradeTextColor } from '@/components/database/GradeBadge';
import ItemTooltip from '@/components/database/ItemTooltip';
import ItemLocationMap from '@/components/map/ItemLocationMap';
import { getGatheringSource } from '@/data/item-gathering-sources';
import { allItemSlugs, getItemIdBySlug, getItemSlug } from '@/data/item-slugs';
import { getItemSources, type ItemSource } from '@/data/item-sources';
import { pageMetadata } from '@/lib/metadata';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

export function generateStaticParams() {
  return allItemSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const itemId = getItemIdBySlug(slug);
  const detail = itemId !== undefined ? getItemDetail(itemId) : null;
  if (!detail) return { title: 'Item Not Found' };
  return pageMetadata({
    title: `${detail.name} (${detail.grade} ${detail.typeDisplay})`,
    description: detail.description || `${detail.name} is a ${detail.grade} ${detail.typeDisplay} in Chrono Odyssey.`,
    path: `/database/${slug}`,
  });
}

export default async function ItemDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const itemId = getItemIdBySlug(slug);
  const detail = itemId !== undefined ? getItemDetail(itemId) : null;

  if (itemId === undefined || !detail) notFound();

  const listEntry = items.find((i) => i.id === itemId);
  const usedInCrafting = getUsedInCrafting(itemId);
  const gatheringSource = getGatheringSource(itemId);
  const detailedSources = getItemSources(itemId);
  const groupedSources = groupSources(detailedSources);

  const tooltipDetail = {
    description: detail.description,
    stats: detail.stats,
    perkSlots: detail.perkSlots,
    uniquePerk: detail.uniquePerk,
    weight: detail.weight,
    sellPrice: detail.sellPrice,
    durability: detail.durability,
    bindType: detail.bindType,
    maxReinforce: detail.maxReinforce,
  };

  const bindLabels: Record<string, string> = {
    None: 'Unbound',
    BindOnGetCharacter: 'Bind on Pickup',
    BindOnEquip: 'Bind on Equip',
  };

  const gradeColorMap: Record<string, string> = {
    Common: '#9d9d9d',
    Uncommon: '#1eff00',
    Rare: '#0070dd',
    Epic: '#a335ee',
    Legendary: '#ff8000',
  };
  const gradeAccent = gradeColorMap[detail.grade] || '#9d9d9d';

  const sourceColors: Record<string, string> = {
    Crafting: 'border-amber-400/40 text-amber-400 bg-amber-400/10',
    Store: 'border-emerald-400/40 text-emerald-400 bg-emerald-400/10',
    Quest: 'border-sky-400/40 text-sky-400 bg-sky-400/10',
    Dungeon: 'border-red-400/40 text-red-400 bg-red-400/10',
    Challenge: 'border-purple-400/40 text-purple-400 bg-purple-400/10',
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Database', path: '/database' },
          { name: detail.name, path: `/database/${slug}` },
        ])}
      />
      {/* Ambient grade halo behind content */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[520px] -z-10 opacity-30"
        style={{
          background:
            'radial-gradient(60% 60% at 20% 10%, ' + gradeAccent + '55 0%, transparent 60%)',
        }}
      />

      <Link
        href="/database"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent-gold transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Item Database
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] gap-6 items-start">
        {/* Left column: in-game tooltip preview (sticky on large screens) */}
        {listEntry && (
          <div className="lg:sticky lg:top-6">
            <ItemTooltip item={listEntry} preloadedDetail={tooltipDetail} />
          </div>
        )}

        {/* Right column: details */}
        <div className="space-y-4">
          {/* Properties */}
          <section
            className="rounded-lg p-5 border"
            style={{
              backgroundColor: 'rgba(10,13,16,0.6)',
              borderColor: gradeAccent + '33',
            }}
          >
            <h2
              className="font-heading text-sm uppercase tracking-wider mb-3"
              style={{ color: gradeAccent }}
            >
              Properties
            </h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <PropRow label="Type" value={detail.typeDisplay || detail.category} />
              <PropRow label="Category" value={detail.category} />
              <PropRow label="Bind" value={bindLabels[detail.bindType] || detail.bindType} />
              {detail.weight > 0 && (
                <PropRow label="Weight" value={detail.weight.toString()} />
              )}
              {detail.durability > 0 && (
                <PropRow label="Durability" value={detail.durability.toLocaleString()} />
              )}
              {detail.sellPrice > 0 && (
                <PropRow
                  label="Sell Price"
                  value={detail.sellPrice.toLocaleString()}
                  valueClass="text-accent-gold"
                />
              )}
              <PropRow label="Marketable" value={detail.isMarketable ? 'Yes' : 'No'} />
              {detail.canReinforce && detail.maxReinforce > 0 && (
                <PropRow label="Max Reinforce" value={'+' + detail.maxReinforce} />
              )}
            </dl>
          </section>

          {/* Crafting Recipe */}
          {detail.crafting && (
            <section
              className="rounded-lg p-5 border"
              style={{
                backgroundColor: 'rgba(10,13,16,0.6)',
                borderColor: gradeAccent + '33',
              }}
            >
              <h2
                className="font-heading text-sm uppercase tracking-wider mb-3"
                style={{ color: gradeAccent }}
              >
                Crafting Recipe
              </h2>
              <div className="space-y-1.5">
                {detail.crafting.materials.map((mat, i) => {
                  const matIcon = mat.materialId ? getItemIcon(mat.materialId) : null;
                  const matSlug = mat.materialId ? getItemSlug(mat.materialId) : undefined;
                  const inner = (
                    <>
                      <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded bg-deep-night border border-border-subtle overflow-hidden mr-2.5">
                        {matIcon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={matIcon} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-text-muted text-[9px]"> </span>
                        )}
                      </span>
                      <span className="flex-1 min-w-0 truncate">{mat.name}</span>
                      <span className="text-text-muted shrink-0 ml-2 text-sm">×{mat.count}</span>
                    </>
                  );
                  return matSlug ? (
                    <Link
                      key={i}
                      href={'/database/' + matSlug}
                      className="flex items-center py-1 px-1.5 rounded text-sm text-text-secondary hover:text-accent-gold hover:bg-white/5 transition-colors"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div key={i} className="flex items-center py-1 px-1.5 text-sm text-text-secondary">
                      {inner}
                    </div>
                  );
                })}
                {detail.crafting.cost > 0 && (
                  <div className="flex justify-between text-sm border-t border-border-subtle pt-2 mt-2">
                    <span className="text-text-muted">Gold Cost</span>
                    <span className="text-accent-gold">
                      {detail.crafting.cost.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Sources + Class Restrictions on one row */}
          {(detail.sources.length > 0 ||
            (detail.classNames.length > 0 && detail.classNames.length < 6)) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {detail.sources.length > 0 && (
                <section
                  className="rounded-lg p-5 border"
                  style={{
                    backgroundColor: 'rgba(10,13,16,0.6)',
                    borderColor: gradeAccent + '33',
                  }}
                >
                  <h2
                    className="font-heading text-sm uppercase tracking-wider mb-3"
                    style={{ color: gradeAccent }}
                  >
                    Obtained From
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {detail.sources.map((source) => (
                      <span
                        key={source}
                        className={
                          'px-2.5 py-1 text-xs rounded border ' +
                          (sourceColors[source] || 'border-border-subtle text-text-muted')
                        }
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </section>
              )}
              {detail.classNames.length > 0 && detail.classNames.length < 6 && (
                <section
                  className="rounded-lg p-5 border"
                  style={{
                    backgroundColor: 'rgba(10,13,16,0.6)',
                    borderColor: gradeAccent + '33',
                  }}
                >
                  <h2
                    className="font-heading text-sm uppercase tracking-wider mb-3"
                    style={{ color: gradeAccent }}
                  >
                    Class Restrictions
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {detail.classNames.map((cls) => (
                      <span
                        key={cls}
                        className="px-2.5 py-1 text-xs rounded border border-accent-gold-dim text-accent-gold bg-accent-gold/10"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Detailed sources */}
          {detailedSources.length > 0 && (
            <section
              className="rounded-lg p-5 border"
              style={{
                backgroundColor: 'rgba(10,13,16,0.6)',
                borderColor: gradeAccent + '33',
              }}
            >
              <h2
                className="font-heading text-sm uppercase tracking-wider mb-3"
                style={{ color: gradeAccent }}
              >
                Sources
              </h2>
              <div className="space-y-4 text-sm">
                {groupedSources.map(([kind, list]) => {
                  const total = list.reduce((s, g) => s + g.count, 0);
                  return (
                    <div key={kind}>
                      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                        {SOURCE_KIND_LABEL[kind]} ({total})
                      </h3>
                      <ul className="space-y-1">
                        {list.map((entry, i) => (
                          <li key={i} className="text-text-secondary">
                            {renderSource(entry.source)}
                            {entry.count > 1 && (
                              <span className="text-text-muted ml-1">
                                {'(' + entry.count + '\u00d7)'}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Gathering locations */}
          {gatheringSource && (
            <section
              className="rounded-lg p-5 border"
              style={{
                backgroundColor: 'rgba(10,13,16,0.6)',
                borderColor: gradeAccent + '33',
              }}
            >
              <h2
                className="font-heading text-sm uppercase tracking-wider mb-3"
                style={{ color: gradeAccent }}
              >
                Where to Gather
              </h2>
              <ItemLocationMap
                subtype={gatheringSource.subtype}
                category={gatheringSource.category}
                itemName={detail.name}
              />
            </section>
          )}

          {/* Used in Crafting */}
          {usedInCrafting.length > 0 && (
            <section
              className="rounded-lg p-5 border"
              style={{
                backgroundColor: 'rgba(10,13,16,0.6)',
                borderColor: gradeAccent + '33',
              }}
            >
              <h2
                className="font-heading text-sm uppercase tracking-wider mb-3"
                style={{ color: gradeAccent }}
              >
                Used in Crafting ({usedInCrafting.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {usedInCrafting.map((entry) => {
                  const entryIcon = getItemIcon(entry.id);
                  const entrySlug = getItemSlug(entry.id);
                  return (
                    <Link
                      key={entry.id}
                      href={'/database/' + (entrySlug ?? entry.id)}
                      className="flex items-center py-1 px-1.5 rounded text-sm hover:bg-white/5 transition-colors"
                    >
                      <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded bg-deep-night border border-border-subtle overflow-hidden mr-2">
                        {entryIcon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={entryIcon}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-text-muted text-[9px]"> </span>
                        )}
                      </span>
                      <span className={'flex-1 min-w-0 truncate ' + gradeTextColor(entry.grade)}>
                        {entry.name}
                      </span>
                      <span className="text-text-muted shrink-0 ml-2 text-xs">×{entry.count}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <p className="text-[11px] text-text-muted text-center pt-2">
            Data from Chrono Odyssey closed beta (June 2025). Subject to change before release.
          </p>
        </div>
      </div>
    </main>
  );
}

function PropRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <>
      <dt className="text-text-muted">{label}</dt>
      <dd className={'text-right ' + (valueClass || 'text-text-primary')}>{value}</dd>
    </>
  );
}

const SOURCE_KIND_ORDER: ItemSource['kind'][] = [
  'quest',
  'achievement',
  'dungeon-entry',
  'dungeon-reward',
  'monster-soul',
  'bounty',
  'challenge',
  'vendor',
];

const SOURCE_KIND_LABEL: Record<ItemSource['kind'], string> = {
  quest: 'Quest reward',
  achievement: 'Achievement reward',
  'dungeon-entry': 'Dungeon entry key',
  'dungeon-reward': 'Dungeon reward',
  'monster-soul': 'Monster soul unlock',
  bounty: 'Bounty (Wanted)',
  challenge: 'Challenge reward',
  vendor: 'Vendor stock',
};

type GroupedSource = { source: ItemSource; count: number };

function collapseKey(s: ItemSource): string {
  switch (s.kind) {
    case 'quest':
    case 'achievement':
    case 'dungeon-entry':
    case 'dungeon-reward':
    case 'monster-soul':
      return JSON.stringify(s);
    case 'vendor':
      return `vendor|${s.vendorId ?? s.storeId}`;
    case 'bounty':
      return `bounty|${s.targetMonsterName}|${s.role}|${s.quantity ?? ''}`;
    case 'challenge':
      return `challenge|${s.targetMonsterName ?? ''}|${s.quantity ?? ''}`;
  }
}

function groupSources(list: ItemSource[]): [ItemSource['kind'], GroupedSource[]][] {
  const groups = new Map<ItemSource['kind'], Map<string, GroupedSource>>();
  for (const s of list) {
    let bucket = groups.get(s.kind);
    if (!bucket) {
      bucket = new Map();
      groups.set(s.kind, bucket);
    }
    const key = collapseKey(s);
    const existing = bucket.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      bucket.set(key, { source: s, count: 1 });
    }
  }
  return SOURCE_KIND_ORDER
    .filter((k) => groups.has(k))
    .map((k) => [k, [...groups.get(k)!.values()]] as [ItemSource['kind'], GroupedSource[]]);
}

function quantityLabel(min?: number, max?: number, exact?: number): string {
  if (exact !== undefined && exact > 0) return ' \u00d7' + exact;
  if (min !== undefined && max !== undefined && min > 0) {
    return ' \u00d7' + (min === max ? min : min + '-' + max);
  }
  return '';
}

function MapLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="text-text-muted hover:text-accent-gold transition-colors text-xs ml-2 underline decoration-dotted"
    >
      map
    </Link>
  );
}

function renderSource(src: ItemSource) {
  switch (src.kind) {
    case 'quest':
      return (
        <span>
          <span className="text-text-primary">{src.questName}</span>
          <span className="text-text-muted">{quantityLabel(src.quantityMin, src.quantityMax)}</span>
        </span>
      );
    case 'achievement':
      return (
        <span>
          <span className="text-text-primary">{src.achievementName}</span>
          <span className="text-text-muted">{quantityLabel(src.quantityMin, src.quantityMax)}</span>
        </span>
      );
    case 'dungeon-entry':
      return (
        <span>
          Required for{' '}
          <span className="text-text-primary">{src.dungeonName}</span>
          <span className="text-text-muted">{quantityLabel(undefined, undefined, src.quantity)}</span>
        </span>
      );
    case 'dungeon-reward':
      return (
        <span>
          Drops in <span className="text-text-primary">{src.dungeonName}</span>
        </span>
      );
    case 'monster-soul':
      return (
        <span>
          <Link
            href={'/database/monsters/' + src.monsterId}
            className="hover:text-accent-gold transition-colors"
          >
            Soul drops from{' '}
            <span className="text-text-primary">{src.monsterName}</span>
            <span className="text-text-muted">{quantityLabel(undefined, undefined, src.quantity)}</span>
          </Link>
          <MapLink href={'/map?monsters=' + src.monsterId} />
        </span>
      );
    case 'bounty':
      return (
        <span>
          <Link
            href={'/database/monsters/' + src.targetMonsterId}
            className="hover:text-accent-gold transition-colors"
          >
            {src.role === 'proof' ? 'Bounty proof from ' : 'Bounty reward (target: '}
            <span className="text-text-primary">{src.targetMonsterName}</span>
            {src.role === 'reward' && <span className="text-text-secondary">)</span>}
            <span className="text-text-muted">{quantityLabel(undefined, undefined, src.quantity)}</span>
          </Link>
          <MapLink href={'/map?monsters=' + src.targetMonsterId} />
        </span>
      );
    case 'challenge':
      if (src.targetMonsterId) {
        return (
          <span>
            <Link
              href={'/database/monsters/' + src.targetMonsterId}
              className="hover:text-accent-gold transition-colors"
            >
              Challenge: defeat{' '}
              <span className="text-text-primary">{src.targetMonsterName ?? 'target'}</span>
              <span className="text-text-muted">{quantityLabel(undefined, undefined, src.quantity)}</span>
            </Link>
            <MapLink href={'/map?monsters=' + src.targetMonsterId} />
          </span>
        );
      }
      return (
        <span>
          Challenge reward
          <span className="text-text-muted">{quantityLabel(undefined, undefined, src.quantity)}</span>
        </span>
      );
    case 'vendor':
      if (src.vendorName) {
        return (
          <span>
            Sold by{' '}
            {src.vendorId ? (
              <Link
                href={'/database/npcs/' + src.vendorId}
                className="text-text-primary hover:text-accent-gold transition-colors"
              >
                {src.vendorName}
              </Link>
            ) : (
              <span className="text-text-primary">{src.vendorName}</span>
            )}
            {src.vendorId && <MapLink href={'/map?npcs=' + src.vendorId} />}
          </span>
        );
      }
      return (
        <span>
          Sold by vendor <span className="text-text-muted">(Store #{src.storeId})</span>
        </span>
      );
  }
}
