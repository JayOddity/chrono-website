import { loadTable, enumTail } from '../lib/tables.mjs';
import { resolveText, resolveUIMaterial, assetPathToIconFile } from '../lib/resolvers.mjs';
import { copyIcon } from '../lib/icons.mjs';

const PLAYABLE_CLASSES = new Set([
  'Swordman',
  'Archer',
  'Paladin',
  'Sorcerer',
  'Berserker',
  'Assassin',
]);

const SLUG_BY_ENUM = {
  Swordman: 'swordsman',
  Archer: 'ranger',
  Paladin: 'paladin',
  Sorcerer: 'sorcerer',
  Berserker: 'berserker',
  Assassin: 'assassin',
};

const TYPE_ICON_BY_ENUM = {
  Swordman: 'TX_CharaterInfo_Type_Swordman',
  Archer: 'TX_CharaterInfo_Type_Ranger',
  Paladin: 'TX_CharaterInfo_Type_Paladine',
  Sorcerer: 'TX_CharaterInfo_Type_sorcerer',
  Berserker: 'TX_CharaterInfo_Type_Berserker',
  Assassin: 'TX_CharaterInfo_Type_Assassin',
};

export function buildClasses() {
  const info = loadTable('CharacterInfo');
  const out = [];

  for (const [dataId, row] of Object.entries(info)) {
    const classType = enumTail(row.ClassType);
    const subType = enumTail(row.UnitSubType);
    if (subType !== 'Hero') continue;
    if (!PLAYABLE_CLASSES.has(classType)) continue;

    const slug = SLUG_BY_ENUM[classType];
    const nameEng = resolveText('TextCharacter', row.CharacterName_TextID) ?? classType;

    const portraitAsset = resolveUIMaterial('UIMaterialsPortrait', row.UIMaterialPortraitID_M);
    const portraitSrc = assetPathToIconFile(portraitAsset);
    const portraitUrl = copyIcon(portraitSrc, 'classes', `${slug}-portrait.png`);

    const typeIconBase = TYPE_ICON_BY_ENUM[classType];
    const typeAsset = typeIconBase
      ? `/Game/UI/Game_Image/00_UI_Icons/Icon_Portrait/${typeIconBase}.${typeIconBase}`
      : null;
    const typeSrc = assetPathToIconFile(typeAsset);
    const typeUrl = copyIcon(typeSrc, 'classes', `${slug}-type.png`);

    out.push({
      slug,
      classType,
      dataId: Number(dataId),
      name: nameEng,
      portraitIcon: portraitUrl,
      typeIcon: typeUrl,
      portraitAssetPath: portraitAsset,
    });
  }

  const slugOrder = ['swordsman', 'ranger', 'paladin', 'sorcerer', 'berserker', 'assassin'];
  out.sort((a, b) => slugOrder.indexOf(a.slug) - slugOrder.indexOf(b.slug));
  return out;
}
