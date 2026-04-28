import type { MetadataRoute } from 'next';
import { classes } from '@/data/classes';
import { features } from '@/data/features';
import { allItemSlugs } from '@/data/item-slugs';
import { getMonsterSummaries } from '@/data/monsters';
import { getNpcSummaries } from '@/data/npcs';
import { sanityClient } from '@/lib/sanity';
import { getAllSteamNewsGids } from '@/lib/steam';

const SITE_URL = 'https://chronotector.com';

export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

const url = (path: string, opts: Omit<Entry, 'url'> = {}): Entry => ({
  url: `${SITE_URL}${path}`,
  lastModified: opts.lastModified ?? new Date(),
  changeFrequency: opts.changeFrequency ?? 'weekly',
  priority: opts.priority ?? 0.5,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  entries.push(url('/', { priority: 1.0, changeFrequency: 'daily' }));
  entries.push(url('/release-date', { priority: 0.9, changeFrequency: 'weekly' }));
  entries.push(url('/faq', { priority: 0.8, changeFrequency: 'weekly' }));
  entries.push(url('/system-requirements', { priority: 0.6, changeFrequency: 'monthly' }));

  entries.push(url('/classes', { priority: 0.9, changeFrequency: 'weekly' }));
  for (const c of classes) {
    entries.push(url(`/classes/${c.slug}`, { priority: 0.8, changeFrequency: 'weekly' }));
  }

  entries.push(url('/features', { priority: 0.8, changeFrequency: 'weekly' }));
  for (const f of features) {
    entries.push(url(`/features/${f.slug}`, { priority: 0.7, changeFrequency: 'weekly' }));
    for (const sp of f.subPages ?? []) {
      entries.push(url(`/features/${f.slug}/${sp.slug}`, { priority: 0.6, changeFrequency: 'weekly' }));
    }
  }

  entries.push(url('/weapons', { priority: 0.7, changeFrequency: 'weekly' }));
  entries.push(url('/activities', { priority: 0.7, changeFrequency: 'weekly' }));
  entries.push(url('/chronotector', { priority: 0.7, changeFrequency: 'weekly' }));
  entries.push(url('/dungeons', { priority: 0.7, changeFrequency: 'weekly' }));

  entries.push(url('/world', { priority: 0.7, changeFrequency: 'weekly' }));
  entries.push(url('/world/lore', { priority: 0.6, changeFrequency: 'weekly' }));
  entries.push(url('/world/enemies', { priority: 0.6, changeFrequency: 'weekly' }));

  entries.push(url('/map', { priority: 0.9, changeFrequency: 'weekly' }));
  entries.push(url('/map/atlas', { priority: 0.7, changeFrequency: 'monthly' }));
  entries.push(url('/talent-calculator', { priority: 0.8, changeFrequency: 'weekly' }));

  entries.push(url('/database', { priority: 0.9, changeFrequency: 'weekly' }));
  entries.push(url('/database/systems', { priority: 0.6, changeFrequency: 'monthly' }));

  for (const slug of allItemSlugs()) {
    entries.push(url(`/database/${slug}`, { priority: 0.4, changeFrequency: 'monthly' }));
  }

  for (const m of getMonsterSummaries()) {
    entries.push(url(`/database/monsters/${m.monsterId}`, { priority: 0.4, changeFrequency: 'monthly' }));
  }

  for (const n of getNpcSummaries()) {
    entries.push(url(`/database/npcs/${n.characterId}`, { priority: 0.4, changeFrequency: 'monthly' }));
  }

  try {
    const posts = await sanityClient.fetch<{ slug: { current: string }; _updatedAt?: string }[]>(
      `*[_type == "newsPost"]{ slug, _updatedAt }`,
    );
    for (const p of posts ?? []) {
      entries.push(
        url(`/news/${p.slug.current}`, {
          priority: 0.7,
          changeFrequency: 'monthly',
          lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
        }),
      );
    }
  } catch {
    // Sanity not yet configured — skip news entries
  }

  try {
    const gids = await getAllSteamNewsGids();
    for (const id of gids) {
      entries.push(url(`/news/steam/${id}`, { priority: 0.6, changeFrequency: 'monthly' }));
    }
  } catch {
    // Steam fetch failed — skip
  }

  return entries;
}
