import type { Metadata } from 'next';
import MapAtlas from './MapAtlas';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'World Atlas',
  description:
    'High resolution in game world map of Setera, extracted from the Chrono Odyssey June 2025 closed beta build.',
  path: '/map/atlas',
});

export default function MapAtlasPage() {
  return (
    <>
      <style>{`footer { display: none !important; } body { overflow: hidden !important; }`}</style>
      <MapAtlas />
    </>
  );
}
