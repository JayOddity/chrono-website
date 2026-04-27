import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.resolve(__dirname, '..', '..', '..', 'Datamined Stuff', 'Data', 'Table_P');
const OUTPUT_FILE = path.resolve(__dirname, '..', 'data', 'items.ts');

function readTable(filename: string) {
  const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), 'utf8'));
  return raw[0].Rows;
}

function stripEnum(val: string): string {
  const idx = val.indexOf('::');
  return idx >= 0 ? val.slice(idx + 2) : val;
}

function formatStatName(stat: string): string {
  // "CriticalHitChance" -> "Critical Hit Chance"
  return stat.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
}

// Load all tables
console.log('Loading data tables...');
const itemRows = readTable('Item.json');
const textItemRows = readTable('TextItem.json');
const detailTypeRows = readTable('ItemDetailTypeInfo.json');
const tierRows = readTable('ItemTierInfo.json');
const commonPerkRows = readTable('CommonPerk.json');
const textCommonPerkRows = readTable('TextItemCommonPerk.json');
const uniquePerkRows = readTable('UniquePerk.json');
const textUniquePerkRows = readTable('TextItemUniquePerk.json');
const specialPerkRows = readTable('SpecialPerk.json');
const textPerkRows = readTable('TextItemPerk.json');
const craftRows = readTable('ItemCraft.json');
const statInfoRows = readTable('StatInfo.json');
const storeGroupRows = readTable('StoreItemGroup.json');
const questRewardGroupRows = readTable('RewardQuestGroup.json');
const dungeonRewardRows = readTable('RewardDungeon.json');
const challengeRewardRows = readTable('RewardChallenge.json');
const gradeProbabilityRows = readTable('GradeProbability.json');

// GradeProbabilityID → displayed grade.
// Deterministic tables (single 100% entry) override raw Grade on the item row.
// Mixed-roll tables (multi-grade) fall back to the raw Grade field.
const gradeByProbId: Record<number, string> = {};
const GRADE_KEYS: Record<string, string> = {
  CommonProbability: 'Common',
  UncommonProbability: 'Uncommon',
  RareProbability: 'Rare',
  EpicProbability: 'Epic',
  LegendaryProbability: 'Legendary',
};
for (const rid in gradeProbabilityRows) {
  const r = gradeProbabilityRows[rid];
  const active = Object.keys(GRADE_KEYS).filter((k) => (r[k] ?? 0) > 0);
  if (active.length === 1) gradeByProbId[r.DataID] = GRADE_KEYS[active[0]];
}

// Build lookup maps
console.log('Building lookup maps...');

// Detail type -> category mapping
const detailTypeMap: Record<string, { itemType: string; equipType: string }> = {};
for (const [key, val] of Object.entries(detailTypeRows) as [string, any][]) {
  detailTypeMap[key] = {
    itemType: stripEnum(val.ItemType),
    equipType: stripEnum(val.EquipItemType),
  };
}

// Tier -> gear score
const tierMap: Record<number, { min: number; max: number; maxReinforce: number }> = {};
for (const val of Object.values(tierRows) as any[]) {
  tierMap[val.Tier] = {
    min: val.DefaultGearScoreMin,
    max: val.DefaultGearScoreMax,
    maxReinforce: val.MaxReinforceLevel,
  };
}

// Common perks by group ID
const commonPerksByGroup: Record<number, { name: string; description: string }[]> = {};
for (const val of Object.values(commonPerkRows) as any[]) {
  const nameText = textCommonPerkRows[String(val.CommonPerkNameString)]?.Text_ENG;
  if (!nameText) continue;
  const descText = textCommonPerkRows[String(val.CommonPerkDescriptionString)]?.Text_ENG || '';
  const groupId = val.CommonPerkGroupID;
  if (!commonPerksByGroup[groupId]) commonPerksByGroup[groupId] = [];
  commonPerksByGroup[groupId].push({
    name: nameText,
    description: descText,
  });
}

// Unique perks by ID
const uniquePerkMap: Record<number, string> = {};
for (const val of Object.values(uniquePerkRows) as any[]) {
  const nameText = textUniquePerkRows[String(val.UniquePerkNameString)]?.Text_ENG;
  if (nameText) uniquePerkMap[val.UniquePerkID] = nameText;
}

// Special perks by group ID
const specialPerksByGroup: Record<number, { name: string; description: string }[]> = {};
for (const val of Object.values(specialPerkRows) as any[]) {
  const nameText = textPerkRows[String(val.SpecialPerkNameString)]?.Text_ENG;
  if (!nameText) continue;
  const groupId = val.SpecialPerkGroupID;
  if (!specialPerksByGroup[groupId]) specialPerksByGroup[groupId] = [];
  if (!specialPerksByGroup[groupId].some(p => p.name === nameText)) {
    specialPerksByGroup[groupId].push({ name: nameText, description: '' });
  }
}

// Craft recipes by result item ID
const craftByResult: Record<number, any> = {};
for (const val of Object.values(craftRows) as any[]) {
  craftByResult[val.ResultItemID] = val;
}

// Stat display info
const statDisplay: Record<string, { name: string; isPercent: boolean }> = {};
for (const val of Object.values(statInfoRows) as any[]) {
  const key = stripEnum(val.StatType);
  statDisplay[key] = {
    name: formatStatName(key),
    isPercent: val.IsPercentString || false,
  };
}

// Categorize item types
function getCategory(detailType: string): string {
  const info = detailTypeMap[detailType];
  if (!info) return 'Other';

  if (detailType === 'Blueprint') return 'Blueprint';

  const weaponTypes = new Set(['GreatSword', 'LongSword', 'DualSwords', 'LongBow', 'Crossbows', 'Rapier',
    'Staff', 'MagicOrb', 'Spellbook', 'Lance', 'Halberd', 'Mace', 'ChainSwords', 'Hatchets',
    'BattleAxe', 'Sabre', 'WristBlades', 'Musket']);
  if (weaponTypes.has(detailType)) return 'Weapon';

  const armorTypes = new Set(['Head', 'Chest', 'Legs', 'Hands', 'Feet', 'Back']);
  if (armorTypes.has(detailType)) return 'Armor';

  const accessoryTypes = new Set(['Necklace', 'Ring', 'Belt']);
  if (accessoryTypes.has(detailType)) return 'Accessory';

  const toolTypes = new Set(['Pickaxe', 'Axe', 'Sickle', 'SkinningKnife', 'FishingPole', 'RepairTools']);
  if (toolTypes.has(detailType)) return 'Tool';

  const consumableTypes = new Set(['Potions', 'SpecialPotions', 'Food', 'Drink', 'CampFood', 'RawFood', 'Fish']);
  if (consumableTypes.has(detailType)) return 'Consumable';

  const materialTypes = new Set(['ElementalMaterial', 'ElementalCore', 'Ore', 'Ingot', 'Wood', 'Lumber',
    'Fiber', 'Cloth', 'Rawhide', 'Leather', 'Herb', 'ReinforceMaterial', 'Resource', 'Gem']);
  if (materialTypes.has(detailType)) return 'Material';

  return 'Other';
}

// Format detail type for display
function formatDetailType(dt: string): string {
  const names: Record<string, string> = {
    GreatSword: 'Greatsword', LongSword: 'Long Sword', DualSwords: 'Dual Swords',
    LongBow: 'Long Bow', ChainSwords: 'Chain Blades', MagicOrb: 'Magic Orb',
    BattleAxe: 'Battle Axe', WristBlades: 'Wrist Blades', SkinningKnife: 'Skinning Knife',
    FishingPole: 'Fishing Pole', RepairTools: 'Repair Tools', RawFood: 'Raw Food',
    CampFood: 'Camp Food', SpecialPotions: 'Special Potions', ElementalMaterial: 'Elemental Material',
    ElementalCore: 'Elemental Core', ReinforceMaterial: 'Reinforce Material',
    ProbabilityBox: 'Loot Box', SelectBox: 'Select Box', MonsterSoul: 'Monster Soul',
    VehicleSoul: 'Vehicle Soul', SubQuest: 'Quest Item', MainQuest: 'Quest Item',
    QuestActivate: 'Quest Item', CampMain: 'Camp Item',
  };
  return names[dt] || dt.replace(/([a-z])([A-Z])/g, '$1 $2');
}

// Build item source map
const itemSources: Record<number, Set<string>> = {};
function addSource(itemId: number, source: string) {
  if (!itemSources[itemId]) itemSources[itemId] = new Set();
  itemSources[itemId].add(source);
}

// Crafting sources
for (const val of Object.values(craftRows) as any[]) {
  addSource(val.ResultItemID, 'Crafting');
}

// Store/vendor sources
for (const val of Object.values(storeGroupRows) as any[]) {
  addSource(val.ItemId, 'Store');
}

// Quest reward sources
for (const val of Object.values(questRewardGroupRows) as any[]) {
  addSource(val.ItemId, 'Quest');
}

// Dungeon drop sources
for (const val of Object.values(dungeonRewardRows) as any[]) {
  for (const itemId of val.Item) {
    if (itemId > 0) addSource(itemId, 'Dungeon');
  }
}

// Challenge reward sources
for (const val of Object.values(challengeRewardRows) as any[]) {
  if (val.Item > 0) addSource(val.Item, 'Challenge');
}

// Process items
console.log('Processing items...');
const CLASS_NAMES = ['Swordsman', 'Ranger', 'Sorcerer', 'Paladin', 'Berserker', 'Assassin'];

interface PerkSlot {
  kind: 'Common' | 'Special' | 'Reinforce';
  reinforceLevel?: number;
  pool: { name: string; description: string }[];
}

interface ProcessedItem {
  id: number;
  name: string;
  description: string | null;
  type: string;
  typeDisplay: string;
  category: string;
  grade: string;
  tier: number;
  armorType: string;
  classes: boolean[];
  classNames: string[];
  stats: { name: string; value: number; isPercent: boolean }[];
  weight: number;
  sellPrice: number;
  isMarketable: boolean;
  canReinforce: boolean;
  durability: number;
  bindType: string;
  gearScoreMin: number;
  gearScoreMax: number;
  maxReinforce: number;
  perkSlots: PerkSlot[];
  uniquePerk: string | null;
  crafting: { materials: { name: string; count: number; materialId: number | null }[]; cost: number } | null;
  sources: string[];
}

const items: ProcessedItem[] = [];
let skipped = 0;

for (const [key, raw] of Object.entries(itemRows) as [string, any][]) {
  // Skip unnamed items
  if (raw.ItemNameID <= 0) { skipped++; continue; }

  const nameEntry = textItemRows[String(raw.ItemNameID)];
  if (!nameEntry?.Text_ENG) { skipped++; continue; }

  const name = nameEntry.Text_ENG;
  if (name.includes('(Test)') || name.startsWith('Test_')) { skipped++; continue; }

  const detailType = stripEnum(raw.ItemDetailType);
  // Prefer GradeProbability when it resolves to a single deterministic grade —
  // Item.Grade is often a base-template value that does not reflect the actual
  // dropped/equipped grade players see.
  const grade =
    gradeByProbId[raw.GradeProbabilityID] ?? stripEnum(raw.Grade);
  const armorType = stripEnum(raw.ArmorType);
  const bindType = stripEnum(raw.BindType);
  const tier = raw.Tier;
  const tierInfo = tierMap[tier] || { min: 0, max: 0, maxReinforce: 0 };

  // Description
  const descEntry = raw.ItemDescID > 0 ? textItemRows[String(raw.ItemDescID)] : null;
  const description = descEntry?.Text_ENG || null;

  // Stats
  const stats: { name: string; value: number; isPercent: boolean }[] = [];
  for (let i = 0; i < raw.StatType.length; i++) {
    const statKey = stripEnum(raw.StatType[i]);
    if (statKey === 'None' || raw.StatValue[i] === 0) continue;
    const display = statDisplay[statKey];
    stats.push({
      name: display?.name || formatStatName(statKey),
      value: raw.StatValue[i],
      isPercent: display?.isPercent || false,
    });
  }

  // Classes
  const classes = raw.IsPossibleClassType;
  const classNames = classes
    .map((v: boolean, i: number) => v ? CLASS_NAMES[i] : null)
    .filter(Boolean) as string[];

  // Perks — one PerkSlot per active entry in the slot arrays, each carrying
  // its own pool (so different slots can point to different groups, and a
  // deterministic 1-entry pool is preserved alongside random pools on the
  // same item).
  const perkSlots: PerkSlot[] = [];
  for (const groupId of raw.CommonPerkGroupID as number[]) {
    if (!groupId || groupId <= 0) continue;
    const pool = commonPerksByGroup[groupId];
    if (!pool || pool.length === 0) continue;
    perkSlots.push({ kind: 'Common', pool });
  }
  for (const groupId of raw.SpecialPerkGroupID as number[]) {
    if (!groupId || groupId <= 0) continue;
    const pool = specialPerksByGroup[groupId];
    if (!pool || pool.length === 0) continue;
    perkSlots.push({ kind: 'Special', pool });
  }
  const reinforceGroupId = raw.ReinforceCommonPerkGroupID;
  if (reinforceGroupId && reinforceGroupId > 0) {
    const pool = commonPerksByGroup[reinforceGroupId];
    if (pool && pool.length > 0 && tierInfo.maxReinforce > 0) {
      for (let lvl = 1; lvl <= tierInfo.maxReinforce; lvl++) {
        perkSlots.push({ kind: 'Reinforce', reinforceLevel: lvl, pool });
      }
    }
  }
  const uniquePerk = raw.UniquePerkID > 0 ? uniquePerkMap[raw.UniquePerkID] || null : null;

  // Crafting
  let crafting: ProcessedItem['crafting'] = null;
  const recipe = craftByResult[raw.ItemId];
  if (recipe) {
    const materials: { name: string; count: number; materialId: number | null }[] = [];
    for (let i = 0; i < recipe.MaterialItemID.length; i++) {
      const matId = recipe.MaterialItemID[i];
      const matCount = recipe.MaterialCount[i];
      if (matId <= 0 || matCount <= 0) continue;
      const matItem = itemRows[String(matId)];
      let matName = 'Unknown Material';
      if (matItem && matItem.ItemNameID > 0) {
        const matText = textItemRows[String(matItem.ItemNameID)];
        if (matText?.Text_ENG) matName = matText.Text_ENG;
      }
      const materialExists = !!matItem && matItem.ItemNameID > 0;
      materials.push({ name: matName, count: matCount, materialId: materialExists ? matId : null });
    }
    if (materials.length > 0) {
      crafting = { materials, cost: recipe.CraftMoneyValue || 0 };
    }
  }

  items.push({
    id: raw.ItemId,
    name,
    description,
    type: detailType,
    typeDisplay: formatDetailType(detailType),
    category: getCategory(detailType),
    grade,
    tier,
    armorType,
    classes,
    classNames,
    stats,
    weight: raw.Weight,
    sellPrice: raw.SellPrice,
    isMarketable: raw.IsMarket,
    canReinforce: raw.IsCanReinforce,
    durability: raw.Durability,
    bindType,
    gearScoreMin: tierInfo.min,
    gearScoreMax: tierInfo.max,
    maxReinforce: tierInfo.maxReinforce,
    perkSlots,
    uniquePerk,
    crafting,
    sources: itemSources[raw.ItemId] ? [...itemSources[raw.ItemId]].sort() : [],
  });
}

// Sort by name then ID for stable ordering
items.sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id);

console.log(`Processed ${items.length} items (skipped ${skipped})`);

// Generate categories/types for filters
const allCategories = [...new Set(items.map(i => i.category))].sort();
const allTypes = [...new Set(items.map(i => i.type))].sort();
const allGrades = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

// Write output — split into list (lightweight) and detail (full) files
console.log('Writing output...');

const OUTPUT_DETAIL = path.resolve(__dirname, '..', 'data', 'items-detail.ts');

// List items — minimal data for grid/filter
const listItems = items.map(i => ({
  id: i.id,
  name: i.name,
  type: i.type,
  typeDisplay: i.typeDisplay,
  category: i.category,
  grade: i.grade,
  tier: i.tier,
  armorType: i.armorType,
  classes: i.classes,
  gearScoreMin: i.gearScoreMin,
  gearScoreMax: i.gearScoreMax,
  hasStats: i.stats.length > 0,
  hasPerks: i.perkSlots.length > 0,
  hasCrafting: i.crafting !== null,
  sources: i.sources,
}));

const listOutput = `// AUTO-GENERATED — do not edit manually
// Generated by: npx tsx src/scripts/process-items.ts

export interface ItemListEntry {
  id: number;
  name: string;
  type: string;
  typeDisplay: string;
  category: string;
  grade: string;
  tier: number;
  armorType: string;
  classes: boolean[];
  gearScoreMin: number;
  gearScoreMax: number;
  hasStats: boolean;
  hasPerks: boolean;
  hasCrafting: boolean;
  sources: string[];
}

export const CLASS_NAMES = ${JSON.stringify(CLASS_NAMES)} as const;

export const ALL_CATEGORIES = ${JSON.stringify(allCategories)} as const;

export const ALL_GRADES = ${JSON.stringify(allGrades)} as const;

export const items: ItemListEntry[] = ${JSON.stringify(listItems)};

export function getItemById(id: number): ItemListEntry | undefined {
  return items.find(i => i.id === id);
}
`;

// Detail items — keyed by ID, only loaded on detail pages
const detailMap: Record<number, any> = {};
for (const i of items) {
  detailMap[i.id] = {
    name: i.name,
    description: i.description,
    type: i.type,
    typeDisplay: i.typeDisplay,
    category: i.category,
    grade: i.grade,
    tier: i.tier,
    armorType: i.armorType,
    classNames: i.classNames,
    stats: i.stats,
    weight: i.weight,
    sellPrice: i.sellPrice,
    isMarketable: i.isMarketable,
    canReinforce: i.canReinforce,
    durability: i.durability,
    bindType: i.bindType,
    gearScoreMin: i.gearScoreMin,
    gearScoreMax: i.gearScoreMax,
    maxReinforce: i.maxReinforce,
    perkSlots: i.perkSlots,
    uniquePerk: i.uniquePerk,
    crafting: i.crafting,
    sources: i.sources,
  };
}

// Build reverse crafting map: materialId -> array of items that use it
const usedInCraftingMap: Record<number, { id: number; name: string; grade: string; count: number }[]> = {};
for (const item of items) {
  if (!item.crafting) continue;
  for (const mat of item.crafting.materials) {
    if (mat.materialId == null) continue;
    if (!usedInCraftingMap[mat.materialId]) usedInCraftingMap[mat.materialId] = [];
    usedInCraftingMap[mat.materialId].push({ id: item.id, name: item.name, grade: item.grade, count: mat.count });
  }
}

const detailOutput = `// AUTO-GENERATED — do not edit manually
// Generated by: npx tsx src/scripts/process-items.ts

export interface ItemStat {
  name: string;
  value: number;
  isPercent: boolean;
}

export interface CraftingRecipe {
  materials: { name: string; count: number; materialId: number | null }[];
  cost: number;
}

export interface PerkSlot {
  kind: 'Common' | 'Special' | 'Reinforce';
  reinforceLevel?: number;
  pool: { name: string; description: string }[];
}

export interface ItemDetail {
  name: string;
  description: string | null;
  type: string;
  typeDisplay: string;
  category: string;
  grade: string;
  tier: number;
  armorType: string;
  classNames: string[];
  stats: ItemStat[];
  weight: number;
  sellPrice: number;
  isMarketable: boolean;
  canReinforce: boolean;
  durability: number;
  bindType: string;
  gearScoreMin: number;
  gearScoreMax: number;
  maxReinforce: number;
  perkSlots: PerkSlot[];
  uniquePerk: string | null;
  crafting: CraftingRecipe | null;
  sources: string[];
}

const detailMap: Record<number, ItemDetail> = ${JSON.stringify(detailMap)};

/** Maps materialId -> list of items that use it as a crafting ingredient */
const usedInCraftingMap: Record<number, { id: number; name: string; grade: string; count: number }[]> = ${JSON.stringify(usedInCraftingMap)};

export function getItemDetail(id: number): ItemDetail | undefined {
  return detailMap[id];
}

export function getUsedInCrafting(materialId: number): { id: number; name: string; grade: string; count: number }[] {
  return usedInCraftingMap[materialId] ?? [];
}
`;

fs.writeFileSync(OUTPUT_FILE, listOutput, 'utf8');
fs.writeFileSync(OUTPUT_DETAIL, detailOutput, 'utf8');
const listSizeKB = Math.round(fs.statSync(OUTPUT_FILE).size / 1024);
const detailSizeKB = Math.round(fs.statSync(OUTPUT_DETAIL).size / 1024);
console.log('Done! Wrote items.ts (' + listSizeKB + ' KB) + items-detail.ts (' + detailSizeKB + ' KB)');

// Print summary
console.log('\n--- Summary ---');
console.log('Total items: ' + items.length);
console.log('Categories: ' + allCategories.join(', '));
console.log('By category:');
for (const cat of allCategories) {
  console.log('  ' + cat + ': ' + items.filter(i => i.category === cat).length);
}
console.log('By grade:');
for (const g of allGrades) {
  console.log('  ' + g + ': ' + items.filter(i => i.grade === g).length);
}
console.log('Items with stats: ' + items.filter(i => i.stats.length > 0).length);
console.log('Items with perks: ' + items.filter(i => i.perkSlots.length > 0).length);
console.log('Items with crafting: ' + (items.filter(i => i.crafting !== null).length));
console.log('Items with sources: ' + items.filter(i => i.sources.length > 0).length);
console.log('By source:');
const sourceCounts: Record<string, number> = {};
for (const i of items) {
  for (const s of i.sources) {
    sourceCounts[s] = (sourceCounts[s] || 0) + 1;
  }
}
for (const [s, c] of Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])) {
  console.log('  ' + s + ': ' + c);
}
