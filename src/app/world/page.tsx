import Link from 'next/link';
import { factions } from '@/data/world';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'World - Chrono Info',
  description: 'World - Chrono Info',
};

export default function WorldPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <section className="pt-8 pb-4">
        <h1 className="font-heading text-4xl text-accent-gold mb-4">World</h1>
        <div className="diamond-divider mt-6">
          <span className="diamond" />
        </div>
      </section>

      <section className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/world/lore"
            className="flex flex-col bg-card-bg border border-border-subtle rounded-lg p-6 hover:border-accent-gold-dim transition-colors glow-gold-hover group"
          >
            <h2 className="font-heading text-xl text-text-primary group-hover:text-accent-gold transition-colors mb-2">Lore</h2>
          </Link>
          <Link
            href="/world/enemies"
            className="flex flex-col bg-card-bg border border-border-subtle rounded-lg p-6 hover:border-accent-gold-dim transition-colors glow-gold-hover group"
          >
            <h2 className="font-heading text-xl text-text-primary group-hover:text-accent-gold transition-colors mb-2">Enemies</h2>
          </Link>
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
