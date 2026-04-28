import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Chronotector',
    short_name: 'Chronotector',
    description: 'Chrono Odyssey MMO news, database, interactive map, and guides.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a1a22',
    theme_color: '#1a1a22',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
