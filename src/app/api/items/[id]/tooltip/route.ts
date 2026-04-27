import { NextResponse } from 'next/server';
import { getItemDetail } from '@/data/items-detail';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [];
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const detail = getItemDetail(parseInt(id, 10));
  if (!detail) return NextResponse.json({ error: 'not found' }, { status: 404 });

  return NextResponse.json({
    description: detail.description,
    stats: detail.stats,
    perkSlots: detail.perkSlots,
    uniquePerk: detail.uniquePerk,
    weight: detail.weight,
    sellPrice: detail.sellPrice,
    durability: detail.durability,
    bindType: detail.bindType,
    maxReinforce: detail.maxReinforce,
  });
}
