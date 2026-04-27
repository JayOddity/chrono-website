import type { Metadata } from 'next';
import MapAtlas from './MapAtlas';

export const metadata: Metadata = {
  title: 'World Atlas - Chrono Odyssey | Chronotector',
  description:
    'High resolution in game world map of Setera, extracted from the Chrono Odyssey June 2025 closed beta build.',
};

export default function MapAtlasPage() {
  return (
    <>
      <style>{`footer { display: none !important; } body { overflow: hidden !important; }`}</style>
      <MapAtlas />
    </>
  );
}
