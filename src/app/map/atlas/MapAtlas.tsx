'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MAP_TILES } from '@/data/map-tiles';

const REGION_KEYS = ['setar', 'balrog', 'cradle'] as const;
type RegionKey = (typeof REGION_KEYS)[number];

const REGION_LABELS: Record<RegionKey, string> = {
  setar: 'Setera (Main Continent)',
  balrog: 'Balrog',
  cradle: 'Cradle',
};

const TILE_PX = 512;

function pickZoomForScale(scale: number, available: number[]): number {
  const target = Math.min(Math.max(Math.log2(scale * 2), 0), Math.max(...available));
  let best = available[0];
  for (const z of available) {
    if (Math.abs(z - target) < Math.abs(best - target)) best = z;
  }
  return best;
}

export default function MapAtlas() {
  const [region, setRegion] = useState<RegionKey>('setar');
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const regionData = MAP_TILES[region];
  const availableZooms = regionData?.zoomLevels ?? [0];
  const currentZoom = pickZoomForScale(scale, availableZooms);
  const gridSize = 1 << currentZoom;
  const useOverview = !!regionData?.overviewUrl && scale < 1.5;

  const baseSize = 1024;
  const displaySize = baseSize * scale;

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = delta > 0 ? 1.15 : 1 / 1.15;
    setScale((s) => Math.max(0.25, Math.min(32, s * factor)));
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY, tx, ty };
  }, [tx, ty]);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!dragRef.current) return;
      setTx(dragRef.current.tx + (e.clientX - dragRef.current.x));
      setTy(dragRef.current.ty + (e.clientY - dragRef.current.y));
    }
    function onUp() {
      dragRef.current = null;
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  function reset() {
    setScale(1);
    setTx(0);
    setTy(0);
  }

  useEffect(() => {
    reset();
  }, [region]);

  if (!regionData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)] text-text-muted">
        No tile data for region &quot;{region}&quot;.
      </div>
    );
  }

  const tiles = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      tiles.push({ x, y });
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 top-24 bg-void-black flex flex-col">
      <div className="px-4 py-2 flex items-center gap-3 border-b border-border-subtle bg-deep-night">
        <Link href="/map" className="text-xs text-accent-gold-dim hover:text-accent-gold">
          ← Gameplay map
        </Link>
        <div className="flex items-center gap-1.5">
          {REGION_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => setRegion(k)}
              className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                region === k
                  ? 'border-accent-gold text-accent-gold bg-accent-gold/10'
                  : 'border-border-subtle text-text-muted hover:text-accent-gold hover:border-accent-gold-dim'
              }`}
            >
              {REGION_LABELS[k]}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-text-muted">
          <span>Zoom {currentZoom} · scale {scale.toFixed(2)}×</span>
          <button onClick={reset} className="px-2 py-1 rounded border border-border-subtle hover:border-accent-gold-dim">
            Reset
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onWheel={onWheel}
        onMouseDown={onMouseDown}
      >
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px)`,
            width: displaySize,
            height: displaySize,
          }}
        >
          {useOverview && regionData.overviewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={regionData.overviewUrl}
              alt=""
              draggable={false}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
          ) : (
            tiles.map(({ x, y }) => {
              const tilePxScaled = displaySize / gridSize;
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${x}_${y}`}
                  src={`${regionData.publicPath}/z${currentZoom}/${x}_${y}.webp`}
                  alt=""
                  width={TILE_PX}
                  height={TILE_PX}
                  draggable={false}
                  className="absolute pointer-events-none"
                  style={{
                    left: x * tilePxScaled,
                    top: y * tilePxScaled,
                    width: tilePxScaled,
                    height: tilePxScaled,
                  }}
                />
              );
            })
          )}
        </div>
        <div className="absolute bottom-3 right-3 text-[10px] text-text-muted bg-deep-night/80 px-2 py-1 rounded border border-border-subtle">
          Drag to pan · Scroll to zoom · {useOverview ? 'Atlas view' : `${gridSize}×${gridSize} tiles @ z${currentZoom}`}
        </div>
      </div>
    </div>
  );
}
