import Link from 'next/link';
import { notFound } from 'next/navigation';
import { features, getFeatureBySlug } from '@/data/features';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return features.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);
  if (!feature) return {};
  return {
    title: `${feature.name} - Chrono Info`,
    description: feature.tagline,
  };
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);
  if (!feature) notFound();

  const otherFeatures = features.filter((f) => f.slug !== slug);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <section className="pt-8 pb-4">
        <Link href="/features" className="text-sm text-accent-gold-dim hover:text-accent-gold transition-colors mb-4 inline-block">
          &larr; All Features
        </Link>
        <h1 className="font-heading text-4xl text-accent-gold mb-2">{feature.name}</h1>
        <p className="text-text-secondary max-w-3xl mb-4">{feature.tagline}</p>
        <div className="diamond-divider mt-6">
          <span className="diamond" />
        </div>
      </section>

      <section className="py-8 space-y-6">
        {feature.sections.map((section) => (
          <div key={section.heading} className="bg-card-bg border border-border-subtle rounded-lg p-6">
            <h2 className="font-heading text-xl text-accent-gold mb-3">{section.heading}</h2>
            <p className="text-text-secondary leading-relaxed">{section.body}</p>
          </div>
        ))}
      </section>

      {/* Other Features */}
      <section className="py-8">
        <div className="diamond-divider mb-6">
          <span className="diamond" />
        </div>
        <h2 className="font-heading text-xl text-accent-gold mb-4">More Features</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {otherFeatures.map((f) => (
            <Link
              key={f.slug}
              href={`/features/${f.slug}`}
              className="bg-card-bg border border-border-subtle rounded-lg p-4 hover:border-accent-gold-dim transition-colors group text-center"
            >
              <span className="font-heading text-sm text-text-primary group-hover:text-accent-gold transition-colors">
                {f.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
