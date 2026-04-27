import { loadTable, enumTail } from '../lib/tables.mjs';
import {
  resolveText,
  resolveUIMaterial,
  resolveTagIcon,
  assetPathToIconFile,
} from '../lib/resolvers.mjs';
import { copyIcon, iconBasenameFromAsset } from '../lib/icons.mjs';

const CLASS_SLUGS = ['swordsman', 'ranger', 'paladin', 'sorcerer', 'berserker', 'assassin'];

function resolveItemIcon(row, detailInfo) {
  let asset = resolveUIMaterial('UIMaterialsItem', row.UIMaterialID);
  if (!asset) asset = resolveTagIcon(detailInfo?.MaterialTag_Normal);
  if (!asset) return null;
  const src = assetPathToIconFile(asset);
  if (!src) return null;
  const fileName = iconBasenameFromAsset(asset);
  if (!fileName) return null;
  return copyIcon(src, 'items', fileName);
}

function extractStats(row) {
  const types = row.StatType ?? [];
  const values = row.StatValue ?? [];
  const out = [];
  for (let i = 0; i < types.length; i++) {
    const stat = enumTail(types[i]);
    if (!stat || stat === 'None') continue;
    out.push({ stat, value: values[i] ?? 0 });
  }
  return out;
}

export function buildItems() {
  const items = loadTable('Item');
  const detailTypes = loadTable('ItemDetailTypeInfo');
  const out = [];

  for (const row of Object.values(items)) {
    const name = resolveText('TextItem', row.ItemNameID);
    if (!name) continue;

    const detailType = enumTail(row.ItemDetailType);
    const detailInfo = detailTypes[detailType];
    const itemType = enumTail(detailInfo?.ItemType);
    const equipSlot = enumTail(detailInfo?.EquipItemType);

    const icon = resolveItemIcon(row, detailInfo);

    const classMask = row.IsPossibleClassType ?? [];
    const allowedClasses = CLASS_SLUGS.filter((_, i) => classMask[i]);
    const anyClass = allowedClasses.length === CLASS_SLUGS.length;

    out.push({
      id: row.ItemId,
      name,
      description: resolveText('TextItem', row.ItemDescID),
      detailType,
      itemType: itemType ?? null,
      equipSlot: equipSlot && equipSlot !== 'None' ? equipSlot : null,
      grade: enumTail(row.Grade),
      tier: row.Tier ?? 0,
      limitClassLevel: row.LimitClassLevel ?? 0,
      armorType: enumTail(row.ArmorType),
      allowedClasses: anyClass ? [] : allowedClasses,
      icon,
      stats: extractStats(row),
      canReinforce: !!row.IsCanReinforce,
      isMarket: !!row.IsMarket,
      sellPrice: row.SellPrice ?? 0,
      weight: row.Weight ?? 0,
      flags: {
        typeIsOpen: !!detailInfo?.IsOpen,
        typeIsLock: !!detailInfo?.IsLock,
      },
    });
  }

  out.sort((a, b) => a.id - b.id);
  return out;
}
