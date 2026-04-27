'use client';

import { useEffect, useState } from 'react';
import type { ItemListEntry } from '@/data/items';
import { getItemIcon } from '@/data/item-icons';

type PerkSlot = {
  kind: 'Common' | 'Special' | 'Reinforce';
  reinforceLevel?: number;
  pool: { name: string; description: string }[];
};

type TooltipDetail = {
  description: string | null;
  stats: { name: string; value: number; isPercent: boolean }[];
  perkSlots: PerkSlot[];
  uniquePerk: string | null;
  weight: number;
  sellPrice: number;
  durability: number;
  bindType: string;
  maxReinforce: number;
};

// Grade → index used for /images/ui/tooltip/TX_GradeIMG{N}.png and TX_GradeIMG_A{N}.png
// Common=0 Uncommon=1 Rare=2 Epic=3 Legendary=4
const GRADE_INDEX: Record<string, number> = {
  Common: 0,
  Uncommon: 1,
  Rare: 2,
  Epic: 3,
  Legendary: 4,
};

// Saturated top-of-strip grade colours, sampled from the in-game TX_GradeIMG_A* gradients.
const GRADE_TOP: Record<string, string> = {
  Common: '#6b7280',
  Uncommon: '#4a8a3c',
  Rare: '#2d5a96',
  Epic: '#7e3fb3',
  Legendary: '#b77732',
};

const GRADE_TEXT: Record<string, string> = {
  Common: '#cfcfcf',
  Uncommon: '#6ad049',
  Rare: '#4d90e6',
  Epic: '#c576f0',
  Legendary: '#f09b3d',
};

const CLASS_NAMES = ['Swordsman', 'Ranger', 'Sorcerer', 'Paladin', 'Berserker', 'Assassin'] as const;

function restrictedClasses(item: ItemListEntry): string[] {
  const on = item.classes.filter(Boolean).length;
  if (on === 0 || on === CLASS_NAMES.length) return [];
  return CLASS_NAMES.filter((_, i) => item.classes[i]);
}

function formatStat(s: { name: string; value: number; isPercent: boolean }): string {
  const v = s.isPercent ? s.value.toFixed(2) + '%' : String(s.value);
  return v;
}

const BIND_LABELS: Record<string, string> = {
  None: 'Unbound',
  BindOnGetCharacter: 'Bind on Pickup',
  BindOnEquip: 'Bind on Equip',
};

const SLOT_KIND_COLOR: Record<PerkSlot['kind'], string> = {
  Common: 'rgba(255,255,255,0.55)',
  Special: '#f0c254',
  Reinforce: '#8fb6e6',
};

// One row per slot. Common and Special each get their own numbering;
// Reinforce collapses into a single "+1 to +N" row. Pool shows on hover.
type RenderedSlot = {
  label: string;
  kind: PerkSlot['kind'];
  valueText: string;
  pool: PerkSlot['pool'];
  deterministic: boolean;
};

function buildRenderedSlots(slots: PerkSlot[]): RenderedSlot[] {
  const out: RenderedSlot[] = [];
  const common = slots.filter((s) => s.kind === 'Common');
  const special = slots.filter((s) => s.kind === 'Special');
  const reinforce = slots.filter((s) => s.kind === 'Reinforce');

  const pushEach = (group: PerkSlot[], labelPrefix: string) => {
    group.forEach((s, i) => {
      const det = s.pool.length === 1 ? s.pool[0].name : null;
      out.push({
        label: `${labelPrefix} ${i + 1}`,
        kind: s.kind,
        valueText: det ?? 'Random',
        pool: s.pool,
        deterministic: det !== null,
      });
    });
  };

  pushEach(common, 'Perk');
  pushEach(special, 'Special Perk');

  if (reinforce.length > 0) {
    const levels = reinforce
      .map((s) => s.reinforceLevel)
      .filter((l): l is number => typeof l === 'number')
      .sort((a, b) => a - b);
    const first = reinforce[0];
    const det = first.pool.length === 1 ? first.pool[0].name : null;
    const label =
      levels.length === 0
        ? 'Reinforce'
        : levels.length === 1
          ? `Reinforce +${levels[0]}`
          : `Reinforce +${levels[0]} to +${levels[levels.length - 1]}`;
    out.push({
      label,
      kind: 'Reinforce',
      valueText: det ?? 'Random',
      pool: first.pool,
      deterministic: det !== null,
    });
  }

  return out;
}

function renderPerkSlots(slots: PerkSlot[]) {
  const rendered = buildRenderedSlots(slots);
  if (rendered.length === 0) return null;
  return (
    <>
      <div className="mx-3 border-t border-white/10" />
      <div className="px-3 py-2 space-y-0.5">
        {rendered.map((r, idx) => {
          const hasPool = r.pool.length > 0;
          return (
            <div key={idx} className="group/slot relative flex items-baseline gap-1.5 text-[11px]">
              <span style={{ color: SLOT_KIND_COLOR[r.kind] }}>{r.label}:</span>
              <span
                className={
                  'text-white/90 font-medium' +
                  (hasPool && !r.deterministic ? ' border-b border-dotted border-white/30' : '')
                }
              >
                {r.valueText}
              </span>

              {/* Hover popover: listed pool. Absolute-positioned, shows on row hover. */}
              {hasPool && !r.deterministic && (
                <div className="absolute left-full top-0 ml-2 hidden group-hover/slot:block z-50 w-[260px] bg-[#0a0d10] border border-white/15 shadow-2xl p-2.5 pointer-events-none">
                  <div className="text-[10px] uppercase tracking-wider text-white/50 mb-1.5">
                    Possible rolls ({r.pool.length})
                  </div>
                  <ul className="space-y-1 text-[11px] text-white/80 leading-snug">
                    {r.pool.map((p, i) => (
                      <li key={i}>
                        <span className="font-medium">{p.name}</span>
                        {p.description && (
                          <span className="text-white/50"> {p.description}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function ItemTooltip({
  item,
  preloadedDetail,
}: {
  item: ItemListEntry;
  preloadedDetail?: TooltipDetail;
}) {
  const [detail, setDetail] = useState<TooltipDetail | null>(preloadedDetail ?? null);

  useEffect(() => {
    if (preloadedDetail) return;
    let cancelled = false;
    fetch(`/api/items/${item.id}/tooltip`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) setDetail(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [item.id, preloadedDetail]);

  const gradeIdx = GRADE_INDEX[item.grade] ?? 0;
  const icon = getItemIcon(item.id);
  const isLegendary = item.grade === 'Legendary';
  const classesOwned = restrictedClasses(item);

  return (
    <div
      className="relative w-[340px] text-white font-sans shadow-2xl"
      style={{ backgroundColor: '#0a0d10' }}
    >
      {/* Grade vertical gradient overlay — fades from grade colour at top to transparent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url(/images/ui/tooltip/TX_GradeIMG_A${gradeIdx + 1}.png)`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          opacity: 0.55,
          mixBlendMode: 'screen',
        }}
      />

      {/* Content */}
      <div className="relative">
        {/* Top strip: Tier • Grade • Class • Subtype */}
        <div
          className="px-3 py-1.5 text-[11px] font-medium tracking-wide flex items-center gap-2"
          style={{
            backgroundColor: GRADE_TOP[item.grade] || GRADE_TOP.Common,
            color: 'rgba(255,255,255,0.95)',
          }}
        >
          <span>Tier {item.tier}</span>
          <span className="opacity-40">|</span>
          <span>{item.grade}</span>
          {classesOwned.length > 0 && classesOwned.length <= 2 && (
            <>
              <span className="opacity-40">|</span>
              <span>{classesOwned.join(', ')}</span>
            </>
          )}
          <span className="opacity-40">|</span>
          <span className="truncate">{item.typeDisplay}</span>
        </div>

        {/* Header section: name + item icon */}
        <div className="flex items-start gap-3 px-3 pt-3 pb-2">
          <div className="min-w-0 flex-1">
            <h3
              className="font-heading text-[18px] leading-tight font-semibold break-words"
              style={{ color: GRADE_TEXT[item.grade] || '#ffffff' }}
            >
              {item.name}
            </h3>
            {item.armorType !== 'None' && item.category === 'Armor' && (
              <p className="text-[11px] text-white/60 mt-0.5">{item.armorType} Armor</p>
            )}
          </div>

          {/* Icon with grade-colour square behind it */}
          <div className="relative shrink-0 w-[64px] h-[64px]">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage: `url(/images/ui/tooltip/TX_GradeIMG${gradeIdx}.png)`,
                backgroundSize: '100% 100%',
              }}
            />
            {isLegendary && (
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(/images/ui/tooltip/TX_Unique_Bg.png)`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  opacity: 0.9,
                }}
              />
            )}
            {icon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={icon}
                alt=""
                className="relative w-full h-full object-contain p-1"
                loading="lazy"
              />
            )}
          </div>
        </div>

        {/* Equipment Score block */}
        {item.gearScoreMin > 0 && (
          <div className="px-3 pb-2">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/55">Equipment Score</p>
                <p className="text-[32px] leading-none font-bold">
                  {item.gearScoreMin === item.gearScoreMax
                    ? item.gearScoreMin
                    : `${item.gearScoreMin}-${item.gearScoreMax}`}
                </p>
              </div>
              {classesOwned.length > 0 && (
                <p className="text-[11px] text-white/60 text-right pb-1">
                  Owned: {classesOwned.join(', ')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Stats (from detail) */}
        {detail && detail.stats.length > 0 && (
          <>
            <div className="mx-3 border-t border-white/10" />
            <div className="px-3 py-2 space-y-1">
              {detail.stats.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-[12px]">
                  <span className="text-white/70">{s.name}</span>
                  <span className="font-semibold text-white">{formatStat(s)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Unique perk */}
        {detail?.uniquePerk && (
          <>
            <div className="mx-3 border-t border-white/10" />
            <div className="px-3 py-2">
              <p
                className="text-[11px] font-semibold mb-0.5"
                style={{ color: GRADE_TEXT.Legendary }}
              >
                Unique Perk
              </p>
              <p className="text-[11px] text-white/75 leading-snug">{detail.uniquePerk}</p>
            </div>
          </>
        )}

        {/* Perk slots: one row per slot, per-slot pool determines deterministic vs random */}
        {detail && detail.perkSlots.length > 0 && renderPerkSlots(detail.perkSlots)}

        {/* Description */}
        {detail?.description && (
          <>
            <div className="mx-3 border-t border-white/10" />
            <div className="px-3 py-2">
              <p className="text-[11px] italic text-white/50 leading-snug">
                {detail.description}
              </p>
            </div>
          </>
        )}

        {/* Footer */}
        {detail && (
          <>
            <div className="mx-3 border-t border-white/10" />
            <div className="px-3 py-2 text-[10px] text-white/55 space-y-0.5">
              {detail.bindType !== 'None' && (
                <p>{BIND_LABELS[detail.bindType] || detail.bindType}</p>
              )}
              {detail.weight > 0 && <p>Weight: {detail.weight}</p>}
              {detail.sellPrice > 0 && <p>Sell Price: {detail.sellPrice.toLocaleString()}</p>}
            </div>
          </>
        )}

        {/* Durability bar */}
        {detail && detail.durability > 0 && (
          <div
            className="px-3 py-1 text-[10px] font-semibold text-center"
            style={{
              backgroundColor: '#b78a2c',
              color: '#1a1206',
            }}
          >
            Durability: {detail.durability} / {detail.durability}
          </div>
        )}
      </div>
    </div>
  );
}
