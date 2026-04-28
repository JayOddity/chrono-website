import Link from 'next/link';
import Image from 'next/image';
import { factions } from '@/data/world';
import { territories, hubName } from '@/data/territories';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'World',
  description: 'The world of Setera: regions, factions, and notable locations.',
  path: '/world',
});

export default function WorldPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <section className="pt-8 pb-4">
        <h1 className="font-heading text-4xl text-accent-gold mb-4">World of Setera</h1>
        <p className="text-text-secondary max-w-3xl">
          Setera is the surviving world that refugees from destroyed planets have made their home. Five regions span the continent, each with its own level range and hostile factions.
        </p>
        <figure className="mt-6 relative w-full overflow-hidden rounded-md border border-border-subtle">
          <Image
            src="/images/world/soroma-stronghold.avif"
            alt="Soroma Stronghold courtyard viewed from above"
            width={1600}
            height={900}
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
          />
          <figcaption className="px-4 py-2 text-xs text-text-muted italic bg-deep-night/60 border-t border-border-subtle">
            Soroma Stronghold. Source: Developer&rsquo;s Notes #1 (Apr 2025).
          </figcaption>
        </figure>
        <div className="diamond-divider mt-6">
          <span className="diamond" />
        </div>
      </section>

      <section className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/world/lore"
            className="flex flex-col bg-card-bg border border-border-subtle rounded-lg p-6 hover:border-accent-gold-dim transition-colors glow-gold-hover group"
          >
            <h2 className="font-heading text-xl text-text-primary group-hover:text-accent-gold transition-colors mb-2">Lore</h2>
            <p className="text-text-muted text-sm">The story of Setera, the World Movers, and the cosmic threats they face.</p>
          </Link>
          <Link
            href="/world/enemies"
            className="flex flex-col bg-card-bg border border-border-subtle rounded-lg p-6 hover:border-accent-gold-dim transition-colors glow-gold-hover group"
          >
            <h2 className="font-heading text-xl text-text-primary group-hover:text-accent-gold transition-colors mb-2">Enemies</h2>
            <p className="text-text-muted text-sm">Bestiary of bosses, elites, and faction enemies datamined from the game files.</p>
          </Link>
        </div>
      </section>

      {/* Territories */}
      <section className="py-8">
        <h2 className="font-heading text-2xl text-accent-gold mb-2">Regions</h2>
        <p className="text-text-muted text-sm mb-6 max-w-3xl">
          Five known regions of Setera. Hub city: <span className="text-accent-gold-dim">{hubName}</span>.
        </p>
        <div className="space-y-4">
          {territories.map((t) => (
            <div key={t.name} className="bg-card-bg border border-border-subtle rounded-lg p-5">
              <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                <h3 className="font-heading text-xl text-accent-gold">{t.name}</h3>
                <span className="text-xs text-text-muted uppercase tracking-wider">
                  {t.minLv > 0 ? `Lv ${t.minLv}-${t.maxLv}` : 'Endgame / unknown'}
                </span>
              </div>
              <p className="text-text-secondary text-sm mb-3">{t.blurb}</p>
              {t.locations.length > 0 && (
                <details>
                  <summary className="cursor-pointer text-xs font-semibold text-text-muted uppercase tracking-wider hover:text-accent-gold-dim">
                    Notable locations ({t.locations.length})
                  </summary>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    {t.locations.map((l) => (
                      <div key={l.name} className="text-sm text-text-secondary flex justify-between border-b border-border-subtle/40 py-1">
                        <span>{l.name}</span>
                        <span className="text-text-muted text-xs">
                          Lv {l.minLv}{l.maxLv > l.minLv ? `-${l.maxLv}` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Factions */}
      <section className="py-8">
        <h2 className="font-heading text-2xl text-accent-gold mb-6">Factions</h2>
        <div className="space-y-4">
          {factions.map((faction) => (
            <div key={faction.name} className="bg-card-bg border border-border-subtle rounded-lg p-5">
              <h3 className={`font-heading text-lg ${faction.colour} mb-1`}>{faction.name}</h3>
              <p className="text-sm text-text-muted italic mb-2">&ldquo;{faction.tagline}&rdquo;</p>
              <p className="text-text-secondary text-sm">{faction.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
