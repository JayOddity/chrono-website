'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  MAP_BOUNDS,
  REGION_GROUPS,
  AREA_LABELS,
  WARP_MARKERS,
  SECTION_MARKERS,
  DUNGEON_MARKERS,
  MONSTER_CLUSTERS,
  type DungeonMarker,
} from '@/data/map-data';

// --- Constants ---
const MAP_WIDTH = 1200;
const MAP_HEIGHT = 900;
const PADDING = 60;

const DATA_WIDTH = MAP_BOUNDS.maxX - MAP_BOUNDS.minX;
const DATA_HEIGHT = MAP_BOUNDS.maxY - MAP_BOUNDS.minY;
const SCALE = Math.min(
  (MAP_WIDTH - PADDING * 2) / DATA_WIDTH,
  (MAP_HEIGHT - PADDING * 2) / DATA_HEIGHT,
);

function worldToScreen(wx: number, wy: number): { x: number; y: number } {
  return {
    x: PADDING + (wx - MAP_BOUNDS.minX) * SCALE,
    y: MAP_HEIGHT - PADDING - (wy - MAP_BOUNDS.minY) * SCALE,
  };
}

type LayerKey =
  | 'settlements'
  | 'warpPoints'
  | 'boundStones'
  | 'monsters'
  | 'areaLabels'
  | 'regionZones';

interface LayerConfig {
  key: LayerKey;
  label: string;
  color: string;
  defaultOn: boolean;
}

const LAYERS: LayerConfig[] = [
  { key: 'settlements', label: 'Settlements', color: '#facc15', defaultOn: true },
  { key: 'warpPoints', label: 'Warp Points', color: '#60a5fa', defaultOn: true },
  { key: 'boundStones', label: 'Bound Stones', color: '#a78bfa', defaultOn: false },
  { key: 'monsters', label: 'Monster Density', color: '#f87171', defaultOn: true },
  { key: 'areaLabels', label: 'Area Names', color: '#e0c068', defaultOn: true },
  { key: 'regionZones', label: 'Region Zones', color: '#4ade80', defaultOn: true },
];

// --- Sub-components ---

function MapTooltip({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <div className="absolute z-50 pointer-events-none" style={{ left: x, top: y - 10, transform: 'translate(-50%, -100%)' }}>
      <div className="bg-deep-night border border-border-subtle rounded-lg px-3 py-2 shadow-xl text-sm max-w-xs">
        {children}
      </div>
    </div>
  );
}

function DungeonPanel({ dungeon, onClose }: { dungeon: DungeonMarker; onClose: () => void }) {
  const typeColors: Record<string, string> = {
    Expedition: 'text-blue-400 bg-blue-500/10',
    Ordeal: 'text-purple-400 bg-purple-500/10',
    Wanted: 'text-red-400 bg-red-500/10',
    Labyrinth: 'text-orange-400 bg-orange-500/10',
    SealOfTime: 'text-accent-gold bg-accent-gold/10',
    Normal: 'text-green-400 bg-green-500/10',
    Raid: 'text-red-400 bg-red-500/10',
    QuestPhase: 'text-cyan-400 bg-cyan-500/10',
    IntersectionOfSpace: 'text-violet-400 bg-violet-500/10',
  };
  return (
    <div className="absolute top-4 left-[17rem] z-50 w-80 bg-deep-night border border-border-subtle rounded-lg shadow-xl overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-border-subtle">
        <h3 className="font-heading text-accent-gold text-sm">{dungeon.name}</h3>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary text-lg leading-none">&times;</button>
      </div>
      <div className="p-3 space-y-2 text-xs">
        <div className="flex gap-2">
          <span className={`px-2 py-0.5 rounded ${typeColors[dungeon.type] || 'text-text-muted bg-dark-surface'}`}>{dungeon.type}</span>
          <span className="px-2 py-0.5 rounded bg-dark-surface text-text-muted">{dungeon.groupType}</span>
        </div>
        {dungeon.description && <p className="text-text-secondary leading-relaxed">{dungeon.description}</p>}
        <div className="flex gap-3 text-text-muted">
          {dungeon.minGearScore > 0 && <span>GS: {dungeon.minGearScore}+</span>}
          <span>Party: {dungeon.minParty}-{dungeon.maxParty}</span>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---
export default function InteractiveMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: React.ReactNode } | null>(null);
  const [selectedDungeon, setSelectedDungeon] = useState<DungeonMarker | null>(null);
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>(() => {
    const init: Record<string, boolean> = {};
    LAYERS.forEach((l) => (init[l.key] = l.defaultOn));
    return init as Record<LayerKey, boolean>;
  });
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    const results: { name: string; x: number; y: number; type: string }[] = [];
    WARP_MARKERS.forEach((w) => {
      if (w.name.toLowerCase().includes(q)) results.push({ name: w.name, x: w.x, y: w.y, type: 'Warp' });
    });
    SECTION_MARKERS.forEach((s) => {
      if (s.name.toLowerCase().includes(q)) results.push({ name: s.name, x: 0, y: 0, type: 'Section' });
    });
    DUNGEON_MARKERS.forEach((d) => {
      if (d.name.toLowerCase().includes(q)) results.push({ name: d.name, x: 0, y: 0, type: d.type });
    });
    return results.slice(0, 10);
  }, [searchQuery]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.min(Math.max(zoom * delta, 0.5), 5);
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const scale = newZoom / zoom;
        setPan({ x: cx - (cx - pan.x) * scale, y: cy - (cy - pan.y) * scale });
      }
      setZoom(newZoom);
    },
    [zoom, pan],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setPanStart(pan);
    },
    [pan],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPan({ x: panStart.x + (e.clientX - dragStart.x), y: panStart.y + (e.clientY - dragStart.y) });
    },
    [isDragging, dragStart, panStart],
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    const up = () => setIsDragging(false);
    window.addEventListener('mouseup', up);
    return () => window.removeEventListener('mouseup', up);
  }, []);

  const toggleLayer = useCallback((key: LayerKey) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleCenterOn = useCallback((wx: number, wy: number) => {
    const screen = worldToScreen(wx, wy);
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const newZoom = 2;
    setPan({ x: rect.width / 2 - screen.x * newZoom, y: rect.height / 2 - screen.y * newZoom });
    setZoom(newZoom);
    setSearchQuery('');
  }, []);

  const settlements = WARP_MARKERS.filter((w) => w.warpType === 'settlement');
  const warpPoints = WARP_MARKERS.filter((w) => w.warpType === 'warp');
  const boundStones = WARP_MARKERS.filter((w) => w.warpType === 'boundstone');

  return (
    <div className="flex h-[calc(100dvh-90px)] overflow-hidden">
      {/* Left side panel */}
      <div className="w-80 shrink-0 bg-card-bg border-r border-border-subtle flex flex-col min-h-0">
        {/* Search */}
        <div className="p-3 border-b border-border-subtle shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-deep-night border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-accent-gold-dim"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-full bg-deep-night border border-border-subtle rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => { if (r.x || r.y) handleCenterOn(r.x, r.y); setSearchQuery(''); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-dark-surface flex items-center justify-between"
                  >
                    <span className="text-text-primary truncate">{r.name}</span>
                    <span className="text-[10px] text-text-muted shrink-0 ml-2">{r.type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-5">
          {/* Layers */}
          <div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-2">Layers</div>
            <div className="space-y-0.5">
              {LAYERS.map((l) => (
                <button
                  key={l.key}
                  onClick={() => toggleLayer(l.key)}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded text-xs transition-colors hover:bg-dark-surface/50"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center shrink-0 transition-colors ${
                      layers[l.key] ? 'border-current bg-current/20' : 'border-text-muted/30'
                    }`}
                    style={{ color: l.color, borderColor: layers[l.key] ? l.color : undefined }}
                  >
                    {layers[l.key] && (
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    )}
                  </span>
                  <span className={layers[l.key] ? 'text-text-primary' : 'text-text-muted'}>{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Settlements */}
          <div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-2">Settlements</div>
            <div className="space-y-0.5">
              {settlements.map((w) => (
                <button
                  key={w.id}
                  onClick={() => handleCenterOn(w.x, w.y)}
                  className="w-full text-left px-2 py-1.5 rounded text-xs text-text-secondary hover:text-accent-gold hover:bg-dark-surface/50 transition-colors"
                >
                  {w.name}
                </button>
              ))}
            </div>
          </div>

          {/* Warp Points */}
          <div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-2">Warp Points</div>
            <div className="space-y-0.5">
              {warpPoints.filter((w) => w.name !== 'Bound Stone').map((w) => (
                <button
                  key={w.id}
                  onClick={() => handleCenterOn(w.x, w.y)}
                  className="w-full text-left px-2 py-1.5 rounded text-xs text-text-secondary hover:text-accent-gold hover:bg-dark-surface/50 transition-colors"
                >
                  {w.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dungeons */}
          <div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-2">Dungeons</div>
            <div className="space-y-0.5">
              {DUNGEON_MARKERS.filter((d) => !d.name.includes('Boss Title') && !d.name.includes('Mini Dungeon')).map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDungeon(d)}
                  className="w-full text-left flex items-center justify-between px-2 py-1.5 rounded text-xs hover:bg-dark-surface/50 transition-colors"
                >
                  <span className="text-text-secondary truncate mr-2">{d.name}</span>
                  <span className="text-text-muted/60 shrink-0">{d.type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Zones */}
          <div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-2">Zones by Level</div>
            <div className="space-y-0.5">
              {SECTION_MARKERS.filter((s) => s.minLevel > 0 && !s.name.includes('Chrono Gate') && !s.name.includes('Seal of Time') && !s.name.includes('Vault'))
                .sort((a, b) => a.minLevel - b.minLevel)
                .map((s) => {
                  const regionColor = REGION_GROUPS[s.regionGroup]?.color || '#a8a8bc';
                  return (
                    <div key={s.id} className="flex items-center justify-between px-2 py-1.5 text-xs">
                      <span className="text-text-secondary truncate mr-2">{s.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-text-muted">Lv{s.minLevel}-{s.maxLevel}</span>
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: regionColor }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Zoom controls — pinned to bottom */}
        <div className="p-3 border-t border-border-subtle shrink-0">
          <div className="flex items-center gap-1">
            <button onClick={() => setZoom((z) => Math.min(z * 1.3, 5))} className="w-7 h-7 rounded bg-deep-night border border-border-subtle text-text-muted hover:text-text-primary text-sm flex items-center justify-center">+</button>
            <div className="flex-1 text-center text-xs text-text-muted">{Math.round(zoom * 100)}%</div>
            <button onClick={() => setZoom((z) => Math.max(z * 0.7, 0.5))} className="w-7 h-7 rounded bg-deep-night border border-border-subtle text-text-muted hover:text-text-primary text-sm flex items-center justify-center">-</button>
            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="px-2 h-7 rounded bg-deep-night border border-border-subtle text-text-muted hover:text-text-primary text-xs">Reset</button>
          </div>
        </div>
      </div>

      {/* Map canvas */}
      <div
        ref={containerRef}
        className="relative flex-1 bg-void-black overflow-hidden select-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { setIsDragging(false); setTooltip(null); }}
      >
        <svg
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(42,42,74,0.3)" strokeWidth="0.5" />
            </pattern>
            <pattern id="gridLarge" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M 200 0 L 0 0 0 200" fill="none" stroke="rgba(42,42,74,0.5)" strokeWidth="1" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#0a0a0f" />
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#grid)" />
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#gridLarge)" />

          {/* Region zones */}
          {layers.regionZones && Object.entries(REGION_GROUPS).map(([key, config]) => {
            const points = AREA_LABELS.filter((a) => a.regionGroup === key);
            if (points.length === 0) return null;
            const screenPoints = points.map((p) => worldToScreen(p.x, p.y));
            const cx = screenPoints.reduce((s, p) => s + p.x, 0) / screenPoints.length;
            const cy = screenPoints.reduce((s, p) => s + p.y, 0) / screenPoints.length;
            return (
              <g key={key}>
                <circle cx={cx} cy={cy} r={80} fill={config.color} opacity={0.04} />
                <text x={cx} y={cy - 70} textAnchor="middle" fill={config.color} fontSize="10" fontFamily="Cinzel" opacity={0.6}>{config.name}</text>
              </g>
            );
          })}

          {/* Monster density */}
          {layers.monsters && MONSTER_CLUSTERS.map((m, i) => {
            const pos = worldToScreen(m.x, m.y);
            const intensity = Math.min(m.count / 30, 1);
            return <circle key={`m-${i}`} cx={pos.x} cy={pos.y} r={3 + intensity * 6} fill="#f87171" opacity={0.08 + intensity * 0.15} />;
          })}

          {/* Bound Stones */}
          {layers.boundStones && boundStones.map((w) => {
            const pos = worldToScreen(w.x, w.y);
            return (
              <g key={`bs-${w.id}`}>
                <circle cx={pos.x} cy={pos.y} r={4} fill="#a78bfa" opacity={0.7} stroke="#a78bfa" strokeWidth={1} strokeOpacity={0.3} />
                <circle cx={pos.x} cy={pos.y} r={8} fill="none" stroke="#a78bfa" strokeWidth={0.5} opacity={0.3} />
              </g>
            );
          })}

          {/* Warp Points */}
          {layers.warpPoints && warpPoints.map((w) => {
            const pos = worldToScreen(w.x, w.y);
            return (
              <g
                key={`wp-${w.id}`}
                className="cursor-pointer"
                onMouseEnter={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, content: (<div><div className="text-accent-gold font-medium">{w.name}</div><div className="text-text-muted text-xs">Warp Point</div></div>) });
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                <rect x={pos.x - 4} y={pos.y - 4} width={8} height={8} fill="#60a5fa" transform={`rotate(45 ${pos.x} ${pos.y})`} opacity={0.9} />
                <text x={pos.x} y={pos.y + 12} textAnchor="middle" fill="#60a5fa" fontSize="7" fontFamily="DM Sans" opacity={0.8}>{w.name}</text>
              </g>
            );
          })}

          {/* Settlements */}
          {layers.settlements && settlements.map((w) => {
            const pos = worldToScreen(w.x, w.y);
            return (
              <g
                key={`st-${w.id}`}
                className="cursor-pointer"
                filter="url(#glow)"
                onMouseEnter={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, content: (<div><div className="text-yellow-400 font-medium">{w.name}</div><div className="text-text-muted text-xs">Settlement / Safe Zone</div></div>) });
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                <circle cx={pos.x} cy={pos.y} r={7} fill="#facc15" opacity={0.2} />
                <circle cx={pos.x} cy={pos.y} r={5} fill="#facc15" opacity={0.9} stroke="#fef08a" strokeWidth={1} />
                <text x={pos.x} y={pos.y + 14} textAnchor="middle" fill="#facc15" fontSize="8" fontWeight="bold" fontFamily="Cinzel">{w.name}</text>
              </g>
            );
          })}

          {/* Area Labels */}
          {layers.areaLabels && AREA_LABELS.map((a) => {
            const pos = worldToScreen(a.x, a.y);
            const color = REGION_GROUPS[a.regionGroup]?.color || '#e0c068';
            return <text key={`al-${a.id}`} x={pos.x} y={pos.y} textAnchor="middle" fill={color} fontSize="7" fontFamily="DM Sans" opacity={0.7}>{a.name}</text>;
          })}

          {/* Scale bar */}
          <g transform={`translate(${MAP_WIDTH - 150}, ${MAP_HEIGHT - 30})`}>
            <line x1={0} y1={0} x2={100} y2={0} stroke="#a8a8bc" strokeWidth={1} opacity={0.5} />
            <line x1={0} y1={-3} x2={0} y2={3} stroke="#a8a8bc" strokeWidth={1} opacity={0.5} />
            <line x1={100} y1={-3} x2={100} y2={3} stroke="#a8a8bc" strokeWidth={1} opacity={0.5} />
            <text x={50} y={12} textAnchor="middle" fill="#a8a8bc" fontSize="8" opacity={0.5}>~{Math.round(100 / SCALE)} units</text>
          </g>
        </svg>

        {/* Tooltip */}
        {tooltip && <MapTooltip x={tooltip.x} y={tooltip.y}>{tooltip.content}</MapTooltip>}

        {/* Dungeon detail overlay */}
        {selectedDungeon && <DungeonPanel dungeon={selectedDungeon} onClose={() => setSelectedDungeon(null)} />}
      </div>
    </div>
  );
}
