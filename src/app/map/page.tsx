import type { Metadata } from 'next';
import InteractiveMap from './InteractiveMap';

export const metadata: Metadata = {
  title: 'Interactive Map - Chrono Odyssey | Chronotector',
  description:
    'Explore the world of Setera with our interactive map. Find warp points, settlements, monster spawns, dungeons, and more.',
};

export default function MapPage() {
  return (
    <>
      {/* Hide footer + prevent body scroll when map is mounted */}
      <style>{`footer { display: none !important; } body { overflow: hidden !important; }`}</style>
      <InteractiveMap />
    </>
  );
}
