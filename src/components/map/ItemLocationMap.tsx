import Link from 'next/link';
import Image from 'next/image';
import { PROP_POIS } from '@/data/map-pois';
import { worldToUV } from '@/data/map-calibration';
import type { GatheringCategory } from '@/data/item-gathering-sources';

interface Props {
  subtype: string;
  category: GatheringCategory;
  itemName?: string;
}

// Server-rendered preview of where an item's gathering nodes spawn. Renders
// the pre-baked overview image plus an inline SVG of colored dots — zero JS.
// Wraps the whole tile in a link to the interactive map with the subtype
// pre-filtered and the camera panned to the cluster.
export default function ItemLocationMap({ subtype, category, itemName }: Props) {
  const points = PROP_POIS.filter((p) => p.title === subtype);
  if (points.length === 0) return null;

  const deepLink = `/map?category=${encodeURIComponent(category)}&subtype=${encodeURIComponent(subtype)}`;

  // The SVG uses a 1000×1000 viewBox so marker sizes can be specified in one
  // consistent unit regardless of the rendered size.
  const VB = 1000;
  const CATEGORY_ICON: Record<GatheringCategory, string> = {
    mining: '/images/map/icons/TX_Icon_Mine_M.png',
    harvesting: '/images/map/icons/TX_Icon_Grass_M.png',
    logging: '/images/map/icons/TX_Icon_Wood_M.png',
  };
  const iconUrl = CATEGORY_ICON[category];
  const ICON_SIZE = 28;

  return (
    <Link
      href={deepLink}
      className="block group relative overflow-hidden rounded-lg border border-border-subtle hover:border-accent-gold transition-colors"
    >
      <div className="relative aspect-square w-full bg-[#413b35]">
        <Image
          src="/images/map/setar/overview.webp"
          alt={`${itemName ?? subtype} spawn locations on the Setera world map`}
          fill
          className="object-cover opacity-90"
          sizes="(max-width: 640px) 100vw, 480px"
        />
        <svg
          viewBox={`0 0 ${VB} ${VB}`}
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          {points.map((p) => {
            const { u, v } = worldToUV(p.x, p.y);
            return (
              <image
                key={p.propId}
                href={iconUrl}
                x={u * VB - ICON_SIZE / 2}
                y={v * VB - ICON_SIZE / 2}
                width={ICON_SIZE}
                height={ICON_SIZE}
                preserveAspectRatio="xMidYMid meet"
              />
            );
          })}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 bg-gradient-to-t from-void-black/90 via-void-black/60 to-transparent px-3 pt-6 pb-2 text-xs text-white">
          <span>
            {points.length} {points.length === 1 ? 'location' : 'locations'}
          </span>
          <span className="text-accent-gold group-hover:translate-x-0.5 transition-transform">
            Open map &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
