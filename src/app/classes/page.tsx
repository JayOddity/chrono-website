import Link from 'next/link';
import Image from 'next/image';
import { classes } from '@/data/classes';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Classes - Chrono Info',
  description: 'All six playable classes in Chrono Odyssey: Assassin, Berserker, Paladin, Ranger, Sorcerer, and Swordsman.',
};

export default function ClassesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <section className="pt-8 pb-4">
        <h1 className="font-heading text-4xl text-accent-gold mb-4">Classes</h1>
        <p className="text-text-secondary max-w-3xl">
          Chrono Odyssey features six playable classes, each with two equippable weapons and the ability to swap between them mid-combat. Rather than rigid archetypes, every class offers flexible role adaptation.
        </p>
        <div className="diamond-divider mt-6">
          <span className="diamond" />
        </div>
      </section>

      <section className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <Link
              key={cls.slug}
              href={`/classes/${cls.slug}`}
              className="flex flex-col bg-card-bg border border-border-subtle rounded-lg overflow-hidden hover:border-accent-gold-dim transition-colors glow-gold-hover group"
            >
              <div className="relative h-48 bg-dark-surface overflow-hidden">
                <Image src={cls.images[0]} alt={cls.name} fill className="object-contain group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              </div>
              <div className="p-5">
                <h2 className="font-heading text-xl text-text-primary group-hover:text-accent-gold transition-colors mb-1">
                  {cls.name}
                </h2>
                <p className="text-xs text-accent-gold-dim font-medium uppercase tracking-wider mb-3">{cls.role}</p>
                <p className="text-sm text-text-muted line-clamp-3">{cls.description}</p>
                <div className="flex gap-2 mt-3">
                  {cls.weapons.map((w) => (
                    <span key={w} className="text-xs px-2 py-1 bg-dark-surface border border-border-subtle rounded text-text-muted">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
