import Link from 'next/link';
import Image from 'next/image';
import type { NeighborPoi } from '@/data/map-pois';
import { worldToUV } from '@/data/map-calibration';

interface Props {
  characterId: number;
  name: string;
  spawns: NeighborPoi[];
}

export default function NpcLocationMap({ characterId, name, spawns }: Props) {
  if (spawns.length === 0) return null;

  const deepLink = `/map?npc=${characterId}`;
  const VB = 1000;
  const fill = '#38bdf8';

  return (
    <Link
      href={deepLink}
      className="block group relative overflow-hidden rounded-lg border border-border-subtle hover:border-accent-gold transition-colors"
    >
      <div className="relative aspect-square w-full bg-[#413b35]">
        <Image
          src="/images/map/setar/overview.webp"
          alt={`${name} locations on the Setera world map`}
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
          {spawns.map((p, i) => {
            const { u, v } = worldToUV(p.x, p.y);
            const cx = u * VB;
            const cy = v * VB;
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={6} fill={fill} opacity={0.55} />
                <circle cx={cx} cy={cy} r={3} fill={fill} />
              </g>
            );
          })}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 bg-gradient-to-t from-void-black/90 via-void-black/60 to-transparent px-3 pt-6 pb-2 text-xs text-white">
          <span>
            {spawns.length} {spawns.length === 1 ? 'location' : 'locations'}
          </span>
          <span className="text-accent-gold group-hover:translate-x-0.5 transition-transform">
            Open map &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
