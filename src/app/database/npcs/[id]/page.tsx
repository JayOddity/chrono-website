import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNpcDetail } from '@/data/npcs';
import NpcLocationMap from '@/components/map/NpcLocationMap';
import { pageMetadata } from '@/lib/metadata';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const characterId = parseInt(id, 10);
  const detail = Number.isFinite(characterId) ? getNpcDetail(characterId) : null;
  if (!detail) return { title: 'NPC Not Found' };
  return pageMetadata({
    title: detail.name,
    description: `${detail.name} is an NPC with ${detail.pinCount} known location${detail.pinCount === 1 ? '' : 's'} in Chrono Odyssey.`,
    path: `/database/npcs/${detail.characterId}`,
  });
}

export default async function NpcDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const characterId = parseInt(id, 10);
  const detail = Number.isFinite(characterId) ? getNpcDetail(characterId) : null;
  if (!detail) notFound();

  const sortedSpawns = [...detail.spawns];
  const topSpawns = sortedSpawns.slice(0, 20);
  const remaining = sortedSpawns.length - topSpawns.length;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Database', path: '/database' },
          { name: 'NPCs', path: '/database?type=npcs' },
          { name: detail.name, path: `/database/npcs/${detail.characterId}` },
        ])}
      />
      <div className="mb-6">
        <div className="text-sm text-text-muted mb-2">
          <Link href="/database" className="hover:text-accent-gold">Database</Link>
          <span className="mx-2">/</span>
          <Link href="/database?type=npcs" className="hover:text-accent-gold">NPCs</Link>
          <span className="mx-2">/</span>
          <span>{detail.name}</span>
        </div>
        <h1 className="font-heading text-3xl text-white">{detail.name}</h1>
        <p className="text-text-muted text-sm mt-2">
          ID {detail.characterId} &middot; {detail.pinCount} location{detail.pinCount === 1 ? '' : 's'}
          {detail.regionIds.length > 0 && (
            <> &middot; {detail.regionIds.length} region{detail.regionIds.length === 1 ? '' : 's'}</>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <NpcLocationMap
            characterId={detail.characterId}
            name={detail.name}
            spawns={detail.spawns}
          />
          <div className="mt-3 text-xs text-text-muted">
            Pulled from <code>WorldNeighborSpawner</code> in the June 2025 CBT data dump.
            Some NPCs appear in multiple regions or move between phases of the world.
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border-subtle p-4 bg-dark-surface/40">
            <h2 className="font-heading text-lg text-accent-gold mb-3">Summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-muted">Locations</dt>
                <dd className="text-white">{detail.pinCount.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-muted">Regions</dt>
                <dd className="text-white">{detail.regionIds.length.toLocaleString()}</dd>
              </div>
            </dl>
            <Link
              href={`/map?npc=${detail.characterId}`}
              className="mt-4 block w-full text-center px-3 py-2 rounded border border-accent-gold text-accent-gold hover:bg-accent-gold/10 text-sm"
            >
              View on map &rarr;
            </Link>
          </div>

          <div className="rounded-lg border border-border-subtle p-4 bg-dark-surface/40">
            <h2 className="font-heading text-lg text-accent-gold mb-3">Top locations</h2>
            <ul className="space-y-1 text-xs font-mono text-text-muted">
              {topSpawns.map((s, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span>
                    ({Math.round(s.x).toLocaleString()}, {Math.round(s.y).toLocaleString()})
                  </span>
                  <span className="text-white">R{s.regionId}</span>
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
