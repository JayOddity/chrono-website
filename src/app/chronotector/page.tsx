import type { Metadata } from 'next';
import Image from 'next/image';
import { chronotectorActions } from '@/data/chronotector';

export const metadata: Metadata = {
  title: 'The Chronotector - Chronotector',
  description: 'The signature time manipulation device that gives Chrono Odyssey its name.',
};

export default function ChronotectorPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <section className="pt-8 pb-4">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
          <div>
            <h1 className="font-heading text-4xl text-accent-gold mb-4">The Chronotector</h1>
            <p className="text-text-secondary text-lg max-w-3xl mb-2">
              The signature device that gives Chrono Odyssey its name. Every Sentinel carries a Chronotector a wrist worn artefact that bends time itself to the wielder&rsquo;s will.
            </p>
            <p className="text-text-muted text-sm max-w-3xl">
              On a moment to moment level, the Chronotector grants five active abilities that sit alongside your weapon skills. It also carries a deep upgrade tree you customise as you progress.
            </p>
          </div>
          <div className="relative w-full max-w-[220px] md:w-[220px] aspect-square mx-auto md:mx-0">
            <Image src="/images/chronotector/watch.avif" alt="Chronotector pocket watch" fill className="object-contain" sizes="220px" priority />
          </div>
        </div>
        <div className="diamond-divider mt-6">
          <span className="diamond" />
        </div>
      </section>

      {/* Actions */}
      <section className="py-8">
        <h2 className="font-heading text-2xl text-accent-gold mb-2">Five Active Abilities</h2>
        <p className="text-text-muted text-sm mb-4 max-w-3xl">
          Each ability has its own cooldown and unlocks separately as you progress. Names and descriptions are taken from the official Steam developer notes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chronotectorActions.map((a) => (
            <div key={a.name} className="bg-card-bg border border-border-subtle rounded-lg p-5">
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="font-heading text-lg text-accent-gold">{a.name}</h3>
                <span className="text-xs text-text-muted">{a.cooldown}s CD</span>
              </div>
              <p className="text-xs text-accent-gold-dim font-medium uppercase tracking-wider mb-3">{a.type}</p>
              <p className="text-text-secondary text-sm leading-relaxed">{a.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upgrade Tree */}
      <section className="py-8">
        <h2 className="font-heading text-2xl text-accent-gold mb-3">The Upgrade Tree</h2>
        <figure className="rounded-lg overflow-hidden border border-border-subtle bg-dark-surface">
          <div className="relative aspect-video">
            <Image src="/images/chronotector/menu.webp" alt="Chronotector menu showing the Temporal Isolation upgrade tree laid around a pocket watch face" fill className="object-contain" sizes="(max-width: 1024px) 100vw, 1024px" />
          </div>
          <figcaption className="text-xs text-text-muted px-4 py-2 border-t border-border-subtle">
            The Chronotector menu from the June 2025 closed beta. Nodes arrange around a pocket watch face; categories (Temporal Isolation, Time Reversal, Temporal Resistance, Summon, Temporal Tuning) sit in the sidebar.
          </figcaption>
        </figure>
      </section>
    </div>
  );
}
