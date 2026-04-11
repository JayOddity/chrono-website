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

export function steamBBCodeToText(bbcode: string): string {
  return bbcode
    .replace(/\[\/?\w+[^\]]*\]/g, '')
    .replace(/\{STEAM_CLAN_IMAGE\}[^\s]*/g, '')
    .replace(/https?:\/\/[^\s]*/g, '')
    .trim();
}

export function formatSteamDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
