import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { items } from '@/data/items';
import { getItemDetail } from '@/data/items-detail';
import GradeBadge, { gradeTextColor } from '@/components/database/GradeBadge';

export function generateStaticParams() {
  return items.map((item) => ({ id: String(item.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const detail = getItemDetail(parseInt(id, 10));
  if (!detail) return { title: 'Item Not Found - Chrono Info' };
  return {
    title: detail.name + ' - Item Database - Chrono Info',
    description: detail.description || detail.name + ' is a ' + detail.grade + ' ' + detail.typeDisplay + ' in Chrono Odyssey.',
  };
}

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const itemId = parseInt(id, 10);
  const detail = getItemDetail(itemId);

  if (!detail) notFound();

  const bindLabels: Record<string, string> = {
    None: 'Unbound',
    BindOnGetCharacter: 'Bind on Pickup',
    BindOnEquip: 'Bind on Equip',
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/database"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent-gold transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Item Database
      </Link>

      <div className="bg-card-bg border border-border-subtle rounded-lg p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h1 className={'font-heading text-2xl sm:text-3xl mb-2 ' + gradeTextColor(detail.grade)}>
              {detail.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <GradeBadge grade={detail.grade} />
              <span className="text-sm text-text-muted">{detail.typeDisplay}</span>
              <span className="text-sm text-text-muted">Tier {detail.tier}</span>
              {detail.armorType !== 'None' && (
                <span className="text-sm text-text-muted">{detail.armorType} Armor</span>
              )}
            </div>
          </div>
          {detail.gearScoreMin > 0 && (
            <div className="text-right">
              <div className="text-xs text-text-muted">Gear Score</div>
              <div className="text-lg text-accent-gold font-heading">
                {detail.gearScoreMin}–{detail.gearScoreMax}
              </div>
            </div>
          )}
        </div>

        {detail.description && (
          <p className="text-text-secondary text-sm mb-4 border-t border-border-subtle pt-4">
            {detail.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stats */}
        {(detail.stats.length > 0 || detail.perkSlots > 0) && (
          <div className="bg-card-bg border border-border-subtle rounded-lg p-5">
            <h2 className="font-heading text-lg text-accent-gold mb-3">Stats</h2>
            <div className="space-y-2">
              {detail.stats.map((stat) => (
                <div key={stat.name} className="flex justify-between text-sm">
                  <span className="text-text-muted">{stat.name}</span>
                  <span className="text-text-primary">
                    {stat.isPercent ? (stat.value / 100).toFixed(1) + '%' : stat.value.toLocaleString()}
                  </span>
                </div>
              ))}
              {detail.perkSlots > 0 && (
                <div className={(detail.stats.length > 0 ? 'border-t border-border-subtle pt-2 mt-2 ' : '') + 'space-y-2'}>
                  {Array.from({ length: detail.perkSlots }, (_, i) => (
                    <div key={i} className="group/slot relative flex justify-between text-sm">
                      <span className="text-text-muted">Perk {i + 1}</span>
                      <span className="text-text-primary italic cursor-help border-b border-dotted border-text-muted/40">Random</span>
                      {detail.perks.length > 0 && (
                        <div className="absolute right-0 top-full mt-1 hidden group-hover/slot:block z-10 px-3 py-2 rounded bg-deep-night border border-border-subtle shadow-lg text-xs max-w-xs w-56">
                          <div className="text-text-muted mb-1.5 font-medium">Possible rolls:</div>
                          <div className="space-y-1">
                            {detail.perks.map((perk) => (
                              <div key={perk.name} className="text-text-secondary">
                                {perk.name}
                                {perk.description && (
                                  <span className="text-text-muted"> — {perk.description}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Possible Perks */}
        {(detail.perks.length > 0 || detail.uniquePerk) && (
          <div className="bg-card-bg border border-border-subtle rounded-lg p-5">
            <h2 className="font-heading text-lg text-accent-gold mb-3">Possible Perks</h2>
            {detail.perkSlots > 0 && (
              <p className="text-xs text-text-muted mb-3">
                This item has {detail.perkSlots} perk slot{detail.perkSlots !== 1 ? 's' : ''}. Each slot randomly rolls one of the perks below.
              </p>
            )}
            <div className="space-y-2">
              {detail.uniquePerk && (
                <div className="text-sm">
                  <span className="text-grade-legendary">{detail.uniquePerk}</span>
                  <span className="text-xs text-text-muted ml-2">(Unique)</span>
                </div>
              )}
              {detail.perks.map((perk) => (
                <div key={perk.name} className="group/perk relative text-sm text-text-secondary cursor-help">
                  <span className="border-b border-dotted border-text-muted/40">{perk.name}</span>
                  {perk.description && (
                    <div className="absolute left-0 bottom-full mb-1 hidden group-hover/perk:block z-10 px-3 py-2 rounded bg-deep-night border border-border-subtle shadow-lg text-xs text-text-muted max-w-xs whitespace-normal">
                      {perk.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crafting */}
        {detail.crafting && (
          <div className="bg-card-bg border border-border-subtle rounded-lg p-5">
            <h2 className="font-heading text-lg text-accent-gold mb-3">Crafting Recipe</h2>
            <div className="space-y-2">
              {detail.crafting.materials.map((mat, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-text-secondary">{mat.name}</span>
                  <span className="text-text-muted">x{mat.count}</span>
                </div>
              ))}
              {detail.crafting.cost > 0 && (
                <div className="flex justify-between text-sm border-t border-border-subtle pt-2 mt-2">
                  <span className="text-text-muted">Gold Cost</span>
                  <span className="text-accent-gold">{detail.crafting.cost.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Properties */}
        <div className="bg-card-bg border border-border-subtle rounded-lg p-5">
          <h2 className="font-heading text-lg text-accent-gold mb-3">Properties</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Category</span>
              <span className="text-text-primary">{detail.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Bind</span>
              <span className="text-text-primary">{bindLabels[detail.bindType] || detail.bindType}</span>
            </div>
            {detail.weight > 0 && (
              <div className="flex justify-between">
                <span className="text-text-muted">Weight</span>
                <span className="text-text-primary">{(detail.weight / 1000).toFixed(1)}</span>
              </div>
            )}
            {detail.durability > 0 && (
              <div className="flex justify-between">
                <span className="text-text-muted">Durability</span>
                <span className="text-text-primary">{detail.durability.toLocaleString()}</span>
              </div>
            )}
            {detail.sellPrice > 0 && (
              <div className="flex justify-between">
                <span className="text-text-muted">Sell Price</span>
                <span className="text-accent-gold">{detail.sellPrice.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-text-muted">Marketable</span>
              <span className="text-text-primary">{detail.isMarketable ? 'Yes' : 'No'}</span>
            </div>
            {detail.canReinforce && detail.maxReinforce > 0 && (
              <div className="flex justify-between">
                <span className="text-text-muted">Max Reinforce</span>
                <span className="text-text-primary">+{detail.maxReinforce}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sources */}
      {detail.sources.length > 0 && (
        <div className="mt-6 bg-card-bg border border-border-subtle rounded-lg p-5">
          <h2 className="font-heading text-lg text-accent-gold mb-3">Obtained From</h2>
          <div className="flex flex-wrap gap-2">
            {detail.sources.map((source) => {
              const colors: Record<string, string> = {
                Crafting: 'border-amber-400/40 text-amber-400 bg-amber-400/10',
                Store: 'border-emerald-400/40 text-emerald-400 bg-emerald-400/10',
                Quest: 'border-sky-400/40 text-sky-400 bg-sky-400/10',
                Dungeon: 'border-red-400/40 text-red-400 bg-red-400/10',
                Challenge: 'border-purple-400/40 text-purple-400 bg-purple-400/10',
              };
              return (
                <span
                  key={source}
                  className={'px-3 py-1 text-sm rounded border ' + (colors[source] || 'border-border-subtle text-text-muted')}
                >
                  {source}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Class Compatibility */}
      {detail.classNames.length > 0 && detail.classNames.length < 6 && (
        <div className="mt-6 bg-card-bg border border-border-subtle rounded-lg p-5">
          <h2 className="font-heading text-lg text-accent-gold mb-3">Class Restrictions</h2>
          <div className="flex flex-wrap gap-2">
            {detail.classNames.map((cls) => (
              <span
                key={cls}
                className="px-3 py-1 text-sm rounded border border-accent-gold-dim text-accent-gold bg-accent-gold/10"
              >
                {cls}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-xs text-text-muted text-center">
        Data from Chrono Odyssey closed beta (June 2025). Subject to change before release.
      </div>
    </main>
  );
}
