import type { Metadata } from 'next';
import InteractiveMap from './InteractiveMap';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Interactive Map',
  description:
    'Interactive map of Setera. Warp points, settlements, monster spawns, NPCs, and dungeons across the Chrono Odyssey world.',
  path: '/map',
});

export default function MapPage() {
  return (
    <>
      {/* Hide footer + prevent body scroll when map is mounted */}
      <style>{`footer { display: none !important; } body { overflow: hidden !important; }`}</style>
      <InteractiveMap />
    </>
  );
}
