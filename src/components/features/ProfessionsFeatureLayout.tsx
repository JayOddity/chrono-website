import Link from 'next/link';
import Image from 'next/image';
import { gradeTextColor } from '@/components/database/GradeBadge';
import type { Feature, PageImage, SubPage } from '@/data/features';
import InteractiveMap from '@/app/map/InteractiveMap';
import { getItemSlug } from '@/data/item-slugs';

const heroBackground = {
  background:
    'radial-gradient(circle at top left, rgba(200, 168, 78, 0.24), transparent 32%), radial-gradient(circle at bottom right, rgba(104, 126, 84, 0.2), transparent 30%), linear-gradient(145deg, rgba(38, 38, 58, 0.98), rgba(22, 22, 30, 0.98))',
};

const surfaceBackground = {
  background:
    'linear-gradient(180deg, rgba(43, 43, 60, 0.98), rgba(31, 31, 43, 0.98))',
};

const craftingBackground = {
  background:
    'linear-gradient(145deg, rgba(200, 168, 78, 0.16), rgba(44, 42, 57, 0.98) 38%, rgba(26, 26, 34, 0.98))',
};

const gatheringBackground = {
  background:
    'linear-gradient(145deg, rgba(108, 138, 88, 0.18), rgba(42, 44, 55, 0.98) 38%, rgba(26, 26, 34, 0.98))',
};

function Hero({
  back,
  title,
  tagline,
}: {
  back: { href: string; label: string };
  title: string;
  tagline: string;
}) {
  return (
    <section className="pt-2 sm:pt-4">
      <div
        className="relative overflow-hidden rounded-[1.5rem] border border-accent-gold-dim/35 px-5 py-4 sm:px-7 sm:py-5"
        style={heroBackground}
      >
        <div className="pointer-events-none absolute -top-24 right-[-4rem] h-72 w-72 rounded-full bg-accent-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-[-3rem] h-72 w-72 rounded-full bg-emerald-500/8 blur-3xl" />
        <div className="relative max-w-3xl">
          <Link
            href={back.href}
            className="inline-flex items-center gap-2 text-sm text-accent-gold-dim transition-colors hover:text-accent-gold"
          >
            <span>&larr;</span>
            <span>{back.label}</span>
          </Link>
          <h1 className="mt-2 font-heading text-4xl text-accent-gold sm:text-5xl">{title}</h1>
          <p className="mt-2 text-base leading-7 text-text-secondary">{tagline}</p>
        </div>
      </div>
    </section>
  );
}

function HeroShot({ image }: { image: PageImage }) {
  return (
    <figure className="mt-3 overflow-hidden rounded-[1.25rem] border border-border-subtle/80" style={surfaceBackground}>
      <div className="relative aspect-video w-full bg-black/30">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 960px"
          className="object-contain"
          priority
        />
      </div>
      {image.caption ? (
        <figcaption className="border-t border-white/8 px-4 py-2 text-sm text-text-muted">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function GallerySection({ images }: { images: PageImage[] }) {
  return (
    <section className="py-3">
      <h2 className="font-heading text-3xl text-accent-gold">Screenshots</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {images.map((image) => (
          <figure
            key={image.src}
            className="overflow-hidden rounded-[1.25rem] border border-border-subtle/80"
            style={surfaceBackground}
          >
            <div className="relative aspect-video w-full bg-black/30">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 560px"
                className="object-contain"
              />
            </div>
            {image.caption ? (
              <figcaption className="border-t border-white/8 px-3 py-2 text-sm text-text-muted">
                {image.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}

function SectionCard({
  heading,
  body,
  image,
  fullWidth,
  className = '',
}: {
  heading: string;
  body: string;
  image?: PageImage;
  fullWidth?: boolean;
  className?: string;
}) {
  const spanClass = image || fullWidth ? 'md:col-span-2' : '';
  const wrapperClass = image
    ? `relative overflow-hidden rounded-[1.75rem] border border-border-subtle/80 ${spanClass} ${className}`
    : `relative flex flex-col overflow-hidden rounded-[1.75rem] border border-border-subtle/80 ${spanClass} ${className}`;

  return (
    <article className={wrapperClass} style={surfaceBackground}>
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-accent-gold/8 blur-3xl" />
      {image ? (
        <div className="relative grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="flex flex-col px-4 py-3 sm:px-5 sm:py-4">
            <h2 className="font-heading text-2xl text-accent-gold">{heading}</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{body}</p>
          </div>
          <figure className="flex flex-col border-t border-white/8 bg-black/30 md:border-l md:border-t-0">
            <div className="relative aspect-video w-full">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 720px"
                className="object-contain"
              />
            </div>
            {image.caption ? (
              <figcaption className="border-t border-white/8 px-4 py-2 text-xs text-text-muted">
                {image.caption}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : (
        <div className="relative px-4 py-3 sm:px-5 sm:py-4">
          <h2 className="font-heading text-2xl text-accent-gold">{heading}</h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">{body}</p>
        </div>
      )}
    </article>
  );
}

function ProfessionCta({
  title,
  href,
  image,
  surface,
}: {
  title: string;
  href: string;
  image?: PageImage;
  surface: typeof craftingBackground;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[1.75rem] border border-border-subtle/80 transition-transform duration-300 hover:-translate-y-1 hover:border-accent-gold-dim/60"
      style={surface}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-3 sm:px-6">
        <h2 className="font-heading text-3xl text-accent-gold">{title}</h2>
        <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-text-muted transition-colors group-hover:text-accent-gold">
          &rarr;
        </span>
      </div>
      {image ? (
        <div className="relative aspect-video w-full border-t border-white/8 bg-black/30">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1280px) 100vw, 560px"
            className="object-contain"
          />
        </div>
      ) : null}
    </Link>
  );
}

function FeaturedItemsSection({
  groups,
  title,
  description,
}: {
  groups: NonNullable<SubPage['featuredCrafted']>;
  title: string;
  description: string;
}) {
  return (
    <section className="py-3">
      <div className="mb-3">
        <h2 className="font-heading text-3xl text-accent-gold">{title}</h2>
        <p className="mt-1 max-w-3xl text-sm text-text-muted">{description}</p>
      </div>
      <div className="grid gap-3 xl:grid-cols-2">
        {groups.map((group) => (
          <article
            key={group.profession}
            className="rounded-[1.25rem] border border-border-subtle/80 px-4 py-3"
            style={surfaceBackground}
          >
            <div className="border-b border-white/8 pb-2">
              <h3 className="font-heading text-2xl text-accent-gold">{group.profession}</h3>
            </div>
            <div className="mt-2 space-y-1.5">
              {group.items.map((item) => (
                <Link
                  key={item.id}
                  href={`/database/${getItemSlug(item.id) ?? item.id}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/15 px-3 py-2 transition-colors hover:border-accent-gold-dim/60 hover:bg-black/25"
                >
                  <span className={`font-medium ${gradeTextColor(item.grade)}`}>{item.name}</span>
                  <span
                    className={`text-xs uppercase tracking-[0.25em] ${gradeTextColor(item.grade)}`}
                  >
                    {item.grade}
                  </span>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SuffixSection({ items }: { items: NonNullable<SubPage['suffixExamples']> }) {
  return (
    <section className="py-3">
      <h2 className="font-heading text-3xl text-accent-gold">Crafted suffix prefixes</h2>
      <p className="mt-1 max-w-3xl text-sm text-text-muted">
        Five base prefixes determine the primary stat. Each combines with five modifiers (Strong,
        Dexterous, Erudite, Wise, Sturdy) for a secondary stat 25 total combinations.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {items.map((item) => (
          <div
            key={item.name}
            className="rounded-[1.25rem] border border-border-subtle/80 px-3 py-2 text-center"
            style={surfaceBackground}
          >
            <div className="font-heading text-xl text-accent-gold">{item.name}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.3em] text-text-muted">
              {item.stat}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SourcesSection({ sources }: { sources: { label: string; url: string }[] }) {
  return (
    <section className="py-3">
      <h2 className="font-heading text-3xl text-accent-gold">Sources</h2>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {sources.map((source) => (
          <a
            key={source.url}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[1.25rem] border border-border-subtle/80 px-4 py-3 text-sm text-text-secondary transition-colors hover:border-accent-gold-dim/60 hover:text-accent-gold"
            style={surfaceBackground}
          >
            {source.label}
          </a>
        ))}
      </div>
    </section>
  );
}

function MoreFeaturesSection({ otherFeatures }: { otherFeatures: Feature[] }) {
  return (
    <section className="py-4">
      <div className="diamond-divider mb-3">
        <span className="diamond" />
      </div>
      <h2 className="font-heading text-2xl text-accent-gold">More Features</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {otherFeatures.map((item) => (
          <Link
            key={item.slug}
            href={`/features/${item.slug}`}
            className="rounded-[1.25rem] border border-border-subtle/80 px-3 py-3 text-center transition-transform duration-300 hover:-translate-y-1 hover:border-accent-gold-dim/60"
            style={surfaceBackground}
          >
            <div className="font-heading text-lg text-text-primary">{item.name}</div>
            <div className="mt-1 text-sm text-text-muted">{item.tagline}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ProfessionsFeatureLayout({
  feature,
  otherFeatures,
}: {
  feature: Feature;
  otherFeatures: Feature[];
}) {
  const craftingPage = feature.subPages?.find((page) => page.slug === 'crafting');
  const gatheringPage = feature.subPages?.find((page) => page.slug === 'gathering');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
      <Hero
        back={{ href: '/features', label: 'All Features' }}
        title={feature.name}
        tagline={feature.tagline}
      />

      {feature.heroImage ? <HeroShot image={feature.heroImage} /> : null}

      <section className="py-3">
        <div className="grid gap-3 md:grid-cols-2">
          {craftingPage ? (
            <ProfessionCta
              title={craftingPage.name}
              href={`/features/${feature.slug}/${craftingPage.slug}`}
              image={craftingPage.overviewImage}
              surface={craftingBackground}
            />
          ) : null}
          {gatheringPage ? (
            <ProfessionCta
              title={gatheringPage.name}
              href={`/features/${feature.slug}/${gatheringPage.slug}`}
              image={gatheringPage.overviewImage}
              surface={gatheringBackground}
            />
          ) : null}
        </div>
      </section>

      {feature.sections.length > 0 ? (
        <section className="grid grid-cols-1 gap-3 py-3 md:grid-cols-2">
          {feature.sections.map((section) => (
            <SectionCard
              key={section.heading}
              heading={section.heading}
              body={section.body}
              image={section.image}
              fullWidth={section.fullWidth}
            />
          ))}
        </section>
      ) : null}

      {feature.externalSources ? <SourcesSection sources={feature.externalSources} /> : null}

      <MoreFeaturesSection otherFeatures={otherFeatures} />
    </div>
  );
}

export function ProfessionSubPageLayout({
  feature,
  subPage,
}: {
  feature: Feature;
  subPage: SubPage;
}) {
  const sibling = feature.subPages?.find((page) => page.slug !== subPage.slug);
  const siblingSurface =
    sibling?.slug === 'gathering' ? gatheringBackground : craftingBackground;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
      <Hero
        back={{ href: `/features/${feature.slug}`, label: feature.name }}
        title={subPage.name}
        tagline={subPage.tagline}
      />

      {subPage.heroImage ? <HeroShot image={subPage.heroImage} /> : null}

      <section className="grid grid-cols-1 gap-3 py-3 md:grid-cols-2">
        {subPage.sections.map((section) => (
          <SectionCard
            key={section.heading}
            heading={section.heading}
            body={section.body}
            image={section.image}
            fullWidth={section.fullWidth}
          />
        ))}
      </section>

      {subPage.slug === 'gathering' ? (
        <section className="py-3">
          <h2 className="font-heading text-3xl text-accent-gold">Node map</h2>
          <p className="mt-1 max-w-3xl text-sm text-text-muted">
            Every mining, harvesting, and logging node extracted from the game files. Toggle a category off if it&rsquo;s in the way. Open <Link href="/map" className="text-accent-gold hover:underline">the full map</Link> to filter by material.
          </p>
          <div
            className="mt-3 overflow-hidden rounded-[1.25rem] border border-border-subtle/80"
            style={surfaceBackground}
          >
            <InteractiveMap
              embed
              allowedLayers={['mining', 'harvesting', 'logging']}
              heightClass="h-[560px]"
              maxTileLod={3}
            />
          </div>
        </section>
      ) : null}

      {subPage.gallery && subPage.gallery.length > 0 ? (
        <GallerySection images={subPage.gallery} />
      ) : null}

      {subPage.featuredCrafted ? (
        <FeaturedItemsSection
          groups={subPage.featuredCrafted}
          title="Featured items"
          description="Click a name to open its item tooltip and full crafting breakdown."
        />
      ) : null}

      {subPage.suffixExamples ? <SuffixSection items={subPage.suffixExamples} /> : null}

      {subPage.externalSources ? <SourcesSection sources={subPage.externalSources} /> : null}

      {sibling ? (
        <section className="py-4">
          <div className="diamond-divider mb-3">
            <span className="diamond" />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <Link
              href={`/features/${feature.slug}`}
              className="rounded-[1.25rem] border border-border-subtle/80 px-4 py-3 transition-transform duration-300 hover:-translate-y-1 hover:border-accent-gold-dim/60"
              style={surfaceBackground}
            >
              <div className="text-[11px] uppercase tracking-[0.3em] text-text-muted">Back to</div>
              <div className="mt-1 font-heading text-2xl text-accent-gold">{feature.name}</div>
              <div className="mt-1 text-sm text-text-muted">{feature.tagline}</div>
            </Link>
            <Link
              href={`/features/${feature.slug}/${sibling.slug}`}
              className="rounded-[1.25rem] border border-border-subtle/80 px-4 py-3 transition-transform duration-300 hover:-translate-y-1 hover:border-accent-gold-dim/60"
              style={siblingSurface}
            >
              <div className="text-[11px] uppercase tracking-[0.3em] text-text-muted">
                Also under {feature.name}
              </div>
              <div className="mt-1 font-heading text-2xl text-accent-gold">{sibling.name}</div>
              <div className="mt-1 text-sm text-text-muted">{sibling.tagline}</div>
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
