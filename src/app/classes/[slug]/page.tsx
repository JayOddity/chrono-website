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
    title: `${cls.name} - Chrono Info`,
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
        <div className="flex gap-2 mb-6">
          {cls.weapons.map((w) => (
            <span key={w} className="text-sm px-3 py-1 bg-dark-surface border border-border-subtle rounded text-text-muted">
              {w}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cls.images.map((img, i) => (
            <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-border-subtle bg-dark-surface">
              <Image src={img} alt={`${cls.name} ${i + 1}`} fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          ))}
        </div>
      </section>

      {/* Lore */}
      <div className="bg-card-bg border border-border-subtle rounded-lg p-6 mb-8">
        <p className="text-text-secondary leading-relaxed">{cls.lore}</p>
      </div>

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
              <div className="relative w-full aspect-video bg-dark-surface">
                <Image src={c.images[0]} alt={c.name} fill className="object-contain" sizes="20vw" />
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
