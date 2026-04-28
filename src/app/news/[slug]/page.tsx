import Link from 'next/link';
import { sanityClient } from '@/lib/sanity';
import SanityBody from '@/components/SanityBody';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import JsonLd from '@/components/JsonLd';
import { articleSchema, breadcrumbSchema } from '@/lib/schema';

interface NewsPost {
  title: string;
  slug: { current: string };
  excerpt?: string;
  body?: unknown[];
  publishedAt?: string;
  _updatedAt?: string;
}

export async function generateStaticParams() {
  const posts = await sanityClient.fetch<{ slug: { current: string } }[]>(
    `*[_type == "newsPost"]{ slug }`
  ).catch(() => []);
  return posts.map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityClient.fetch<NewsPost>(
    `*[_type == "newsPost" && slug.current == $slug][0]{ title, excerpt, publishedAt, _updatedAt }`,
    { slug }
  ).catch(() => null);
  return pageMetadata({
    title: post?.title || 'Post',
    description: post?.excerpt || `${post?.title || 'News post'} on Chronotector.`,
    path: `/news/${slug}`,
    ogType: 'article',
    publishedTime: post?.publishedAt,
    modifiedTime: post?._updatedAt,
  });
}

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await sanityClient.fetch<NewsPost & { _updatedAt?: string }>(
    `*[_type == "newsPost" && slug.current == $slug][0]{
      title, slug, excerpt, body, publishedAt, _updatedAt
    }`,
    { slug }
  ).catch(() => null);

  if (!post) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-heading text-3xl text-accent-red mb-4">Post Not Found</h1>
        <Link href="/" className="text-accent-gold hover:text-accent-gold-light">&larr; Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <JsonLd
        data={[
          articleSchema({
            headline: post.title,
            description: post.excerpt ?? post.title,
            path: `/news/${slug}`,
            datePublished: post.publishedAt,
            dateModified: post._updatedAt,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: post.title, path: `/news/${slug}` },
          ]),
        ]}
      />
      <nav className="text-sm text-text-muted mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-accent-gold transition-colors">Home</Link>
        <span>/</span>
        <span className="text-text-secondary">{post.title}</span>
      </nav>

      <article className="bg-card-bg border border-border-subtle rounded-lg p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold px-2 py-1 rounded bg-accent-gold/10 text-accent-gold">News</span>
          {post.publishedAt && (
            <span className="text-sm text-text-muted">
              {new Date(post.publishedAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          )}
        </div>

        <h1 className="font-heading text-3xl md:text-4xl text-accent-gold mb-6">{post.title}</h1>

        {post.body ? (
          <SanityBody value={post.body} />
        ) : (
          <p className="text-text-muted">No content yet.</p>
        )}
      </article>

      <Link href="/" className="inline-block mt-6 text-accent-gold hover:text-accent-gold-light text-sm transition-colors">
        &larr; Back to Home
      </Link>
    </div>
  );
}
