import Link from 'next/link';
import Image from 'next/image';
import type { MonsterPoi } from '@/data/map-pois';
import { worldToUV } from '@/data/map-calibration';
import { GRADE_COLORS, GRADE_LABELS } from '@/data/monsters';

interface Props {
  monsterId: number;
  name: string;
  grade: string;
  spawns: MonsterPoi[];
}

export default function MonsterLocationMap({ monsterId, name, grade, spawns }: Props) {
  if (spawns.length === 0) return null;

  const deepLink = `/map?monster=${monsterId}`;
  const VB = 1000;
  const fill = GRADE_COLORS[grade] ?? '#94a3b8';
  const isBoss = grade.endsWith('Boss');
  const isElite = grade === 'Elite';
  const iconUrl = isBoss
    ? '/images/map/icons/TX_Icon_Monster_M2.png'
    : isElite
      ? '/images/map/icons/TX_Icon_Monster_M.png'
      : null;
  const ICON_SIZE = isBoss ? 32 : isElite ? 24 : 0;
  const dotR = isBoss ? 8 : isElite ? 6 : 4;

  return (
    <Link
      href={deepLink}
      className="block group relative overflow-hidden rounded-lg border border-border-subtle hover:border-accent-gold transition-colors"
    >
      <div className="relative aspect-square w-full bg-[#413b35]">
        <Image
          src="/images/map/setar/overview.webp"
          alt={`${name} spawn locations on the Setera world map`}
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
                <circle cx={cx} cy={cy} r={dotR} fill={fill} opacity={0.55} />
                <circle cx={cx} cy={cy} r={dotR * 0.45} fill={fill} />
                {iconUrl && (
                  <image
                    href={iconUrl}
                    x={cx - ICON_SIZE / 2}
                    y={cy - ICON_SIZE / 2}
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    preserveAspectRatio="xMidYMid meet"
                  />
                )}
              </g>
            );
          })}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 bg-gradient-to-t from-void-black/90 via-void-black/60 to-transparent px-3 pt-6 pb-2 text-xs text-white">
          <span>
            {spawns.length} {spawns.length === 1 ? 'location' : 'locations'}
            <span className="text-text-muted"> &middot; {GRADE_LABELS[grade] ?? grade}</span>
          </span>
          <span className="text-accent-gold group-hover:translate-x-0.5 transition-transform">
            Open map &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
