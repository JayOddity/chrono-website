export interface SteamNewsItem {
  gid: string;
  title: string;
  url: string;
  author: string;
  contents: string;
  feedlabel: string;
  date: number;
  feedname: string;
  appid: number;
}

interface SteamNewsResponse {
  appnews: {
    appid: number;
    newsitems: SteamNewsItem[];
  };
}

const CHRONO_ODYSSEY_APPID = 2873440;

export async function getSteamNews(count = 10): Promise<SteamNewsItem[]> {
  try {
    const res = await fetch(
      `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${CHRONO_ODYSSEY_APPID}&count=${count}&maxlength=2000&format=json`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return [];

    const data: SteamNewsResponse = await res.json();
    return data.appnews?.newsitems ?? [];
  } catch {
    return [];
  }
}

// Single-post fetcher. Steam's API doesn't expose a get-by-gid endpoint, so we
// pull a wider window (the app has ~30 posts total) and filter. Uses a longer
// maxlength because we render the full body, not a list excerpt.
export async function getSteamNewsItem(gid: string): Promise<SteamNewsItem | null> {
  try {
    const res = await fetch(
      `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${CHRONO_ODYSSEY_APPID}&count=50&maxlength=20000&format=json`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data: SteamNewsResponse = await res.json();
    return data.appnews?.newsitems?.find((n) => n.gid === gid) ?? null;
  } catch {
    return null;
  }
}

export async function getAllSteamNewsGids(): Promise<string[]> {
  const items = await getSteamNews(50);
  return items.map((n) => n.gid);
}

export function steamBBCodeToText(bbcode: string): string {
  return bbcode
    .replace(/\[\/?\w+[^\]]*\]/g, '')
    .replace(/\{STEAM_CLAN_IMAGE\}[^\s]*/g, '')
    .replace(/https?:\/\/[^\s]*/g, '')
    .trim();
}

// Converts Steam announcement BBCode + Steam-specific tokens to safe HTML.
// Pipeline: substitute Steam URL tokens, escape HTML, then transform BBCode.
// HTML escaping happens before BBCode replacement so untrusted angle brackets
// in the source can't escape the renderer; bbcode brackets ([, ]) survive
// escaping unchanged so the regex passes still match.
export function steamBBCodeToHtml(bbcode: string): string {
  const isSafeUrl = (url: string): boolean => /^https?:\/\//i.test(url.trim());

  // 1. Resolve {STEAM_CLAN_IMAGE} token. The trailing path is captured
  //    separately to avoid leaking partial tokens if the suffix is missing.
  let s = bbcode.replace(/\{STEAM_CLAN_IMAGE\}/g, 'https://clan.akamai.steamstatic.com/images');

  // 2. HTML-escape the entire string.
  s = s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  // 3. Block-level BBCode.
  s = s.replace(/\[h1\]([\s\S]*?)\[\/h1\]/g, '<h2 class="font-heading text-2xl text-accent-gold mt-6 mb-3">$1</h2>');
  s = s.replace(/\[h2\]([\s\S]*?)\[\/h2\]/g, '<h2 class="font-heading text-xl text-accent-gold mt-6 mb-3">$1</h2>');
  s = s.replace(/\[h3\]([\s\S]*?)\[\/h3\]/g, '<h3 class="font-heading text-lg text-accent-gold mt-4 mb-2">$1</h3>');
  s = s.replace(/\[hr\](\[\/hr\])?/g, '<hr class="border-border-subtle my-4" />');

  s = s.replace(/\[olist\]([\s\S]*?)\[\/olist\]/g, (_m, inner: string) => {
    const items = inner
      .split(/\[\*\]/)
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => '<li>' + x + '</li>')
      .join('');
    return '<ol class="list-decimal list-inside space-y-1 my-3">' + items + '</ol>';
  });
  s = s.replace(/\[list\]([\s\S]*?)\[\/list\]/g, (_m, inner: string) => {
    const items = inner
      .split(/\[\*\]/)
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => '<li>' + x + '</li>')
      .join('');
    return '<ul class="list-disc list-inside space-y-1 my-3">' + items + '</ul>';
  });

  s = s.replace(/\[quote\]([\s\S]*?)\[\/quote\]/g, '<blockquote class="border-l-4 border-accent-gold-dim pl-4 italic text-text-muted my-3">$1</blockquote>');

  // 4. Inline formatting.
  s = s.replace(/\[b\]([\s\S]*?)\[\/b\]/g, '<strong>$1</strong>');
  s = s.replace(/\[i\]([\s\S]*?)\[\/i\]/g, '<em>$1</em>');
  s = s.replace(/\[u\]([\s\S]*?)\[\/u\]/g, '<u>$1</u>');
  s = s.replace(/\[strike\]([\s\S]*?)\[\/strike\]/g, '<s>$1</s>');

  // 5. Links — only allow http(s).
  s = s.replace(/\[url=([^\]]+)\]([\s\S]*?)\[\/url\]/g, (_m, url: string, label: string) => {
    const safe = isSafeUrl(url) ? url : '#';
    return '<a href="' + safe + '" target="_blank" rel="noopener noreferrer" class="text-accent-gold underline hover:text-accent-gold-dim">' + label + '</a>';
  });
  s = s.replace(/\[url\]([\s\S]*?)\[\/url\]/g, (_m, url: string) => {
    const safe = isSafeUrl(url) ? url : '#';
    return '<a href="' + safe + '" target="_blank" rel="noopener noreferrer" class="text-accent-gold underline hover:text-accent-gold-dim">' + url + '</a>';
  });

  // 6. Images.
  s = s.replace(/\[img\]([\s\S]*?)\[\/img\]/g, (_m, url: string) => {
    if (!isSafeUrl(url)) return '';
    return '<img src="' + url.trim() + '" alt="" class="rounded my-3 max-w-full h-auto" loading="lazy" />';
  });

  // 7. Steam YouTube preview embeds: [previewyoutube=ID;FULL][/previewyoutube].
  s = s.replace(
    /\[previewyoutube=([\w-]+)(?:;[^\]]*)?\]\[\/previewyoutube\]/g,
    (_m, vid: string) =>
      '<div class="relative aspect-video my-4"><iframe src="https://www.youtube-nocookie.com/embed/' +
      vid +
      '" title="YouTube video" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="absolute inset-0 w-full h-full rounded"></iframe></div>',
  );

  // 8. Strip any unknown bbcode tags that survived.
  s = s.replace(/\[\/?\w+[^\]]*\]/g, '');

  // 9. Newlines → paragraph breaks. Two+ blank lines = paragraph split,
  //    single newline = line break. Done last so block tags above already
  //    occupy their own boundaries.
  s = s.replace(/\n{2,}/g, '<br/><br/>').replace(/\n/g, '<br/>');

  return s;
}

export function formatSteamDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
