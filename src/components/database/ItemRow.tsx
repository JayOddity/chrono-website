'use client';

import { useCallback, useRef, useState } from 'react';
import type { ItemListEntry } from '@/data/items';
import ItemCard from './ItemCard';
import ItemTooltip from './ItemTooltip';

const MARGIN = 12;
const TOOLTIP_W = 340;

export default function ItemRow({ item }: { item: ItemListEntry }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);

  const place = useCallback((clientX: number, clientY: number) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let x = clientX + MARGIN;
    if (x + TOOLTIP_W + MARGIN > vw) x = clientX - TOOLTIP_W - MARGIN;
    if (x < MARGIN) x = MARGIN;
    let y = clientY + MARGIN;
    // clamp vertically — approximate max height 560, let the tooltip decide its own height
    if (y + 560 > vh) y = Math.max(MARGIN, vh - 560 - MARGIN);
    setPos({ x, y });
  }, []);

  return (
    <div
      ref={rowRef}
      onMouseEnter={(e) => {
        place(e.clientX, e.clientY);
        setShow(true);
      }}
      onMouseMove={(e) => {
        if (show) place(e.clientX, e.clientY);
      }}
      onMouseLeave={() => setShow(false)}
    >
      <ItemCard item={item} />
      {show && pos && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: pos.x, top: pos.y }}
        >
          <ItemTooltip item={item} />
        </div>
      )}
    </div>
  );
}
