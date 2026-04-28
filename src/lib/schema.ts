import { SITE_NAME, SITE_URL } from './metadata';

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/database?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
  };
}

export function videoGameSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Chrono Odyssey',
    url: SITE_URL,
    description:
      'An open world MMORPG by Chrono Odyssey Studios and Kakao Games, built in Unreal Engine 5. Targets a Q1 2027 launch on PC, PS5, and Xbox Series X.',
    genre: ['MMORPG', 'Action RPG', 'Open World'],
    gamePlatform: ['PC', 'PlayStation 5', 'Xbox Series X'],
    publisher: { '@type': 'Organization', name: 'Kakao Games' },
    developer: { '@type': 'Organization', name: 'Chrono Odyssey Studios' },
    applicationCategory: 'Game',
    operatingSystem: 'Windows',
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export interface ArticleInput {
  headline: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}

export function articleSchema({
  headline,
  description,
  path,
  image,
  datePublished,
  dateModified,
  author = SITE_NAME,
}: ArticleInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: `${SITE_URL}${path}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
    image: image ? [image] : undefined,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: { '@type': 'Organization', name: author },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.png` },
    },
  };
}
