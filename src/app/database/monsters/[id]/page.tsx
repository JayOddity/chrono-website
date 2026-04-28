import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getMonsterDetail,
  formatLevelRange,
  GRADE_COLORS,
  GRADE_LABELS,
} from '@/data/monsters';
import MonsterLocationMap from '@/components/map/MonsterLocationMap';
import { pageMetadata } from '@/lib/metadata';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const monsterId = parseInt(id, 10);
  const detail = Number.isFinite(monsterId) ? getMonsterDetail(monsterId) : null;
  if (!detail) return { title: 'Monster Not Found' };
  const gradeLabel = GRADE_LABELS[detail.grade] ?? detail.grade;
  return pageMetadata({
    title: `${detail.name} (${gradeLabel})`,
    description: `${detail.name} (${gradeLabel}) spawns in ${detail.pinCount} location${detail.pinCount === 1 ? '' : 's'} across Setera. ${detail.totalSpawns} total spawn points from the June 2025 CBT data.`,
    path: `/database/monsters/${detail.monsterId}`,
  });
}

export default async function MonsterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const monsterId = parseInt(id, 10);
  const detail = Number.isFinite(monsterId) ? getMonsterDetail(monsterId) : null;
  if (!detail) notFound();

  const color = GRADE_COLORS[detail.grade] ?? '#94a3b8';
  const gradeLabel = GRADE_LABELS[detail.grade] ?? detail.grade;

  const sortedSpawns = [...detail.spawns].sort((a, b) => b.spawnCount - a.spawnCount);
  const topSpawns = sortedSpawns.slice(0, 20);
  const remaining = sortedSpawns.length - topSpawns.length;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Database', path: '/database' },
          { name: 'Enemies', path: '/database?type=enemies' },
          { name: detail.name, path: `/database/monsters/${detail.monsterId}` },
        ])}
      />
      <div className="mb-6">
        <div className="text-sm text-text-muted mb-2">
          <Link href="/database" className="hover:text-accent-gold">Database</Link>
          <span className="mx-2">/</span>
          <Link href="/database/monsters" className="hover:text-accent-gold">Bestiary</Link>
          <span className="mx-2">/</span>
          <span>{detail.name}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-3xl text-white">{detail.name}</h1>
          <span
            className="inline-block px-2 py-0.5 rounded text-xs"
            style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}55` }}
          >
            {gradeLabel}
          </span>
          {(() => {
            const lv = formatLevelRange(detail.levelMin, detail.levelMax);
            return lv ? (
              <span className="inline-block px-2 py-0.5 rounded text-xs text-text-muted border border-white/15">
                {lv}
              </span>
            ) : null;
          })()}
        </div>
        <p className="text-text-muted text-sm mt-2">
          ID {detail.monsterId} &middot; {detail.subType}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <MonsterLocationMap
            monsterId={detail.monsterId}
            name={detail.name}
            grade={detail.grade}
            spawns={detail.spawns}
          />
          <div className="mt-3 text-xs text-text-muted">
            Pulled from <code>WorldMonsterSpawnPosition</code> in the June 2025 CBT data dump.
            Each pin is one spawner placement; spawners can host more than one creature.
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border-subtle p-4 bg-dark-surface/40">
            <h2 className="font-heading text-lg text-accent-gold mb-3">Spawn summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-muted">Locations</dt>
                <dd className="text-white">{detail.pinCount.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-muted">Total spawns</dt>
                <dd className="text-white">{detail.totalSpawns.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-muted">Avg per location</dt>
                <dd className="text-white">
                  {(detail.totalSpawns / detail.pinCount).toFixed(1)}
                </dd>
              </div>
            </dl>
            <Link
              href={`/map?monster=${detail.monsterId}`}
              className="mt-4 block w-full text-center px-3 py-2 rounded border border-accent-gold text-accent-gold hover:bg-accent-gold/10 text-sm"
            >
              View on map &rarr;
            </Link>
          </div>

          <div className="rounded-lg border border-border-subtle p-4 bg-dark-surface/40">
            <h2 className="font-heading text-lg text-accent-gold mb-3">Top spawn points</h2>
            <ul className="space-y-1 text-xs font-mono text-text-muted">
              {topSpawns.map((s, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span>
                    ({Math.round(s.x).toLocaleString()}, {Math.round(s.y).toLocaleString()})
                  </span>
                  <span className="text-white">x{s.spawnCount}</span>
                </li>
              ))}
            </ul>
            {remaining > 0 && (
              <div className="mt-2 text-xs text-text-muted">
                {remaining} more locations not shown.
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
