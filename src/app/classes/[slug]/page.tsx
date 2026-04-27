import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { classes, getClassBySlug } from '@/data/classes';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return classes.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cls = getClassBySlug(slug);
  if (!cls) return {};
  return {
    title: `${cls.name} - Chronotector`,
    description: cls.description,
  };
}

export default async function ClassPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cls = getClassBySlug(slug);
  if (!cls) notFound();

  const otherClasses = classes.filter((c) => c.slug !== slug);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <section className="mb-8">
        <Link href="/classes" className="text-sm text-accent-gold-dim hover:text-accent-gold transition-colors mb-4 inline-block">
          &larr; All Classes
        </Link>
        <h1 className="font-heading text-4xl sm:text-5xl text-accent-gold mb-2">{cls.name}</h1>
        <p className="text-xs text-accent-gold-dim font-medium uppercase tracking-wider mb-4">{cls.role}</p>
        <p className="text-text-secondary text-lg max-w-3xl mb-4">{cls.description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {cls.weapons.map((w) => (
            <span key={w.name} className="text-sm px-3 py-1 bg-dark-surface border border-border-subtle rounded text-text-muted">
              {w.name}
            </span>
          ))}
        </div>

        <div className="relative w-64 h-64 rounded-lg overflow-hidden border border-border-subtle bg-dark-surface mx-auto sm:mx-0">
          <Image src={cls.image} alt={cls.name} fill className="object-contain object-top" sizes="256px" priority />
        </div>
      </section>

      {/* Lore */}
      <div className="bg-card-bg border border-border-subtle rounded-lg p-6 mb-8">
        <p className="text-text-secondary leading-relaxed italic">{cls.lore}</p>
      </div>

      {/* Resource */}
      <section className="mb-10">
        <h2 className="font-heading text-2xl text-accent-gold mb-3">Resource: {cls.resource}</h2>
        <p className="text-text-secondary leading-relaxed max-w-3xl">{cls.resourceDescription}</p>
      </section>

      {/* How it plays */}
      <section className="mb-10">
        <h2 className="font-heading text-2xl text-accent-gold mb-3">How it plays</h2>
        <div className="space-y-4 max-w-3xl">
          {cls.overview.split('\n\n').map((para, i) => (
            <p key={i} className="text-text-secondary leading-relaxed">{para}</p>
          ))}
        </div>
      </section>

      {/* Weapons */}
      <section className="mb-10">
        <h2 className="font-heading text-2xl text-accent-gold mb-4">Weapons</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cls.weapons.map((w) => (
            <div key={w.name} className="bg-card-bg border border-border-subtle rounded-lg p-5">
              <h3 className="font-heading text-xl text-text-primary mb-1">{w.name}</h3>
              <p className="text-xs text-accent-gold-dim font-medium uppercase tracking-wider mb-3">{w.tagline}</p>
              <p className="text-text-secondary leading-relaxed text-sm">{w.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Build directions */}
      <section className="mb-10">
        <h2 className="font-heading text-2xl text-accent-gold mb-2">Build directions</h2>
        <p className="text-text-muted text-sm mb-4 max-w-3xl">
          Per the developers&rsquo; post beta notes, each weapon will get four progression paths in the upcoming Matrix system twelve builds per class in total. Final paths aren&rsquo;t published yet; these are the rough shapes players are likely to settle into.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          {cls.buildDirections.map((b) => (
            <div key={b.name} className="bg-card-bg border border-border-subtle rounded-lg p-4">
              <h3 className="font-heading text-lg text-accent-gold mb-1">{b.name}</h3>
              <p className="text-text-secondary leading-relaxed text-sm">{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Class Mastery */}
      {cls.classMastery && (
        <section className="mb-10">
          <h2 className="font-heading text-2xl text-accent-gold mb-2">Class Mastery</h2>
          <p className="text-text-muted text-sm mb-4 max-w-3xl">
            Seven cross weapon abilities that belong to the class itself rather than any single weapon. Three actives (unlocked at Lv 15) and four passives (Lv 10 and Lv 20). These remain available regardless of which weapon you have equipped.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cls.classMastery.map((m) => (
              <div key={m.name} className="bg-card-bg border border-border-subtle rounded-lg p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-heading text-text-primary text-sm">{m.name}</span>
                  <span className="text-xs text-text-muted shrink-0">Lv {m.unlockLevel}</span>
                </div>
                <span className={`text-xs uppercase tracking-wider ${m.type === 'Active' ? 'text-amber-400' : 'text-accent-gold-dim'}`}>
                  {m.type}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other Classes */}
      <section className="py-8">
        <div className="diamond-divider mb-6">
          <span className="diamond" />
        </div>
        <h2 className="font-heading text-xl text-accent-gold mb-4">Other Classes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {otherClasses.map((c) => (
            <Link
              key={c.slug}
              href={`/classes/${c.slug}`}
              className="flex flex-col items-center bg-card-bg border border-border-subtle rounded-lg overflow-hidden hover:border-accent-gold-dim transition-colors group"
            >
              <div className="relative w-full aspect-square bg-dark-surface">
                <Image src={c.image} alt={c.name} fill className="object-contain object-top" sizes="20vw" />
              </div>
              <span className="font-heading text-sm text-text-primary group-hover:text-accent-gold transition-colors p-3">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
