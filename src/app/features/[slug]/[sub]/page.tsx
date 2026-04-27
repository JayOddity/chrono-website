import Link from 'next/link';
import { notFound } from 'next/navigation';
import { features, getFeatureBySlug } from '@/data/features';
import { gradeTextColor } from '@/components/database/GradeBadge';
import { ProfessionSubPageLayout } from '@/components/features/ProfessionsFeatureLayout';
import { getItemSlug } from '@/data/item-slugs';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return features.flatMap((f) =>
    (f.subPages ?? []).map((sp) => ({ slug: f.slug, sub: sp.slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; sub: string }> }): Promise<Metadata> {
  const { slug, sub } = await params;
  const feature = getFeatureBySlug(slug);
  const sp = feature?.subPages?.find((p) => p.slug === sub);
  if (!feature || !sp) return {};
  return {
    title: `${sp.name} - ${feature.name} - Chronotector`,
    description: sp.tagline,
  };
}

export default async function SubFeaturePage({ params }: { params: Promise<{ slug: string; sub: string }> }) {
  const { slug, sub } = await params;
  const feature = getFeatureBySlug(slug);
  if (!feature) notFound();
  const sp = feature.subPages?.find((p) => p.slug === sub);
  if (!sp) notFound();

  const siblings = feature.subPages?.filter((p) => p.slug !== sub) ?? [];

  if (feature.slug === 'professions') {
    return <ProfessionSubPageLayout feature={feature} subPage={sp} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <section className="pt-8 pb-4">
        <Link href={`/features/${feature.slug}`} className="text-sm text-accent-gold-dim hover:text-accent-gold transition-colors mb-4 inline-block">
          &larr; {feature.name}
        </Link>
        <h1 className="font-heading text-4xl text-accent-gold mb-2">{sp.name}</h1>
        <p className="text-text-secondary max-w-3xl mb-4">{sp.tagline}</p>
        <div className="diamond-divider mt-6">
          <span className="diamond" />
        </div>
      </section>

      <section className="py-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {sp.sections.map((section) => (
          <div key={section.heading} className="bg-card-bg border border-border-subtle rounded-lg p-5 hover:border-accent-gold-dim/50 transition-colors">
            <h2 className="font-heading text-lg text-accent-gold mb-2">{section.heading}</h2>
            <p className="text-text-secondary text-sm leading-relaxed">{section.body}</p>
          </div>
        ))}
      </section>

      {sp.featuredCrafted && (
        <section className="py-4">
          <h2 className="font-heading text-2xl text-accent-gold mb-2">Featured items</h2>
          <p className="text-text-muted text-sm mb-4 max-w-3xl">
            Click a name to open its item tooltip and full crafting breakdown.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sp.featuredCrafted.map((group) => (
              <div key={group.profession} className="bg-card-bg border border-border-subtle rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 bg-deep-night border-b border-border-subtle">
                  <span className="font-heading text-sm text-accent-gold uppercase tracking-wider">{group.profession}</span>
                  <span className="text-text-muted text-xs ml-2">{group.items.length}</span>
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/database/${getItemSlug(item.id) ?? item.id}`}
                      className={`inline-flex items-center px-2.5 py-1 text-sm rounded border border-border-subtle bg-dark-surface hover:border-accent-gold-dim hover:bg-deep-night transition-colors ${gradeTextColor(item.grade)}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {sp.suffixExamples && (
        <section className="py-4">
          <h2 className="font-heading text-2xl text-accent-gold mb-2">Crafted suffix prefixes</h2>
          <p className="text-text-muted text-sm mb-4 max-w-3xl">
            Five base prefixes determine the primary stat. Each combines with five modifiers (Strong, Dexterous, Erudite, Wise, Sturdy) for a secondary stat 25 total combinations.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {sp.suffixExamples.map((s) => (
              <div key={s.name} className="bg-card-bg border border-border-subtle rounded-lg p-3 text-center">
                <div className="font-heading text-accent-gold">{s.name}</div>
                <div className="text-xs text-text-muted uppercase tracking-wider mt-1">{s.stat}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {sp.externalSources && (
        <section className="py-4">
          <h2 className="font-heading text-2xl text-accent-gold mb-3">Sources</h2>
          <ul className="space-y-1 text-sm">
            {sp.externalSources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-accent-gold transition-colors underline decoration-border-subtle hover:decoration-accent-gold underline-offset-4"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {siblings.length > 0 && (
        <section className="py-8">
          <div className="diamond-divider mb-6">
            <span className="diamond" />
          </div>
          <h2 className="font-heading text-xl text-accent-gold mb-4">Also under {feature.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                href={`/features/${feature.slug}/${s.slug}`}
                className="bg-card-bg border border-border-subtle rounded-lg p-4 hover:border-accent-gold-dim transition-colors group"
              >
                <div className="font-heading text-accent-gold group-hover:text-accent-gold transition-colors mb-1">{s.name}</div>
                <div className="text-xs text-text-muted">{s.tagline}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
