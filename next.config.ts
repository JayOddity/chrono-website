import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: 'https', hostname: 'clan.fastly.steamstatic.com' },
      { protocol: 'https', hostname: 'shared.fastly.steamstatic.com' },
      { protocol: 'https', hostname: 'clan.akamai.steamstatic.com' },
      { protocol: 'https', hostname: 'shared.akamai.steamstatic.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
};

export default nextConfig;
