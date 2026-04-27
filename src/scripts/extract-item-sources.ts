// Builds an itemId -> ItemSource[] index by walking the source-chain tables in
// `Datamined Stuff/Data/Table_P/`. Covers everything resolvable from JSON alone
// (no Blueprint extraction): quest rewards, achievement rewards, bounty rewards
// + bounty proofs, challenge rewards, monster soul unlocks, dungeon entry items,
// dungeon rewards, and vendor stock. Generic mob loot (Tier 3) lives in the
// Blueprint paks and is not covered here.
//
// Run: `npx tsx src/scripts/extract-item-sources.ts`
// Output: src/data/item-sources.json

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.resolve(__dirname, '..', '..', '..', 'Datamined Stuff', 'Data', 'Table_P');
const OUT_FILE = path.resolve(__dirname, '..', 'data', 'item-sources.json');

type Row = Record<string, unknown>;

function readTable(file: string): Record<string, Row> {
  const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8')) as Array<{ Rows: Record<string, Row> }>;
  return raw[0].Rows;
}

function asNum(v: unknown): number | undefined {
  return typeof v === 'number' ? v : undefined;
}

function asNumArr(v: unknown): number[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is number => typeof x === 'number');
}

// --- Load every table we need ---
const items = readTable('Item.json');
const quest = readTable('Quest.json');
const rewardQuest = readTable('RewardQuest.json');
const rewardQuestGroup = readTable('RewardQuestGroup.json');
const achievement = readTable('Achievement.json');
const rewardAchievement = readTable('RewardAchievement.json');
const rewardAchievementGroup = readTable('RewardAchievementGroup.json');
const wanted = readTable('Wanted.json');
const rewardWanted = readTable('RewardWanted.json');
const challenge = readTable('Challenge.json');
const rewardChallenge = readTable('RewardChallenge.json');
const monsterSoul = readTable('MonsterSoul.json');
const dungeon = readTable('Dungeon.json');
const rewardDungeon = readTable('RewardDungeon.json');
const store = readTable('Store.json');
const storeItemGroup = readTable('StoreItemGroup.json');
const character = readTable('Character.json');
const characterInfo = readTable('CharacterInfo.json');
const npcFunction = readTable('NPCFunction.json');
const npcFunctionGroup = readTable('NPCFunctionGroup.json');
const worldNeighborSpawner = readTable('WorldNeighborSpawner.json');

// Text tables
const textQuest = readTable('TextQuest.json');
const textCharacter = readTable('TextCharacter.json');
const textAchievement = readTable('TextAchievement.json');
const textWorld = readTable('TextWorld.json');

function txt(table: Record<string, Row>, id: number | undefined): string | undefined {
  if (id === undefined || id <= 0) return undefined;
  const row = table[id];
  if (!row) return undefined;
  const eng = row.Text_ENG;
  return typeof eng === 'string' && eng.length > 0 ? eng : undefined;
}

// --- Resolvers ---

function questName(questId: number): string {
  const q = quest[questId];
  if (!q) return `Quest ${questId}`;
  const nameId = asNum(q.QuestName);
  return txt(textQuest, nameId) ?? `Quest ${questId}`;
}

function achievementName(achievementId: number): string {
  const a = achievement[achievementId];
  if (!a) return `Achievement ${achievementId}`;
  const titleId = asNum(a.TitleTextID);
  return txt(textAchievement, titleId) ?? `Achievement ${achievementId}`;
}

function dungeonName(dungeonId: number): string {
  const d = dungeon[dungeonId];
  if (!d) return `Dungeon ${dungeonId}`;
  const nameId = asNum(d.DungeonName);
  return txt(textWorld, nameId) ?? `Dungeon ${dungeonId}`;
}

function regionId(dungeonId: number): number | undefined {
  return asNum(dungeon[dungeonId]?.RegionID);
}

function monsterName(characterId: number): string {
  // Character.json has CharacterID -> CharacterInfoID; CharacterInfo.json has the name TextID.
  const c = character[characterId];
  if (!c) return `Character ${characterId}`;
  const infoId = asNum(c.CharacterInfoID);
  if (infoId !== undefined) {
    const info = characterInfo[infoId];
    const nameId = asNum(info?.CharacterName_TextID);
    if (nameId !== undefined) {
      const t = txt(textCharacter, nameId);
      if (t) return t;
    }
  }
  return `Character ${characterId}`;
}

// --- Source schema ---
type ItemSource =
  | { kind: 'quest'; questId: number; questName: string; quantityMin?: number; quantityMax?: number }
  | { kind: 'achievement'; achievementId: number; achievementName: string; quantityMin?: number; quantityMax?: number }
  | { kind: 'bounty'; wantedId: number; targetMonsterId: number; targetMonsterName: string; role: 'proof' | 'reward'; quantity?: number }
  | { kind: 'challenge'; challengeId: number; targetMonsterId?: number; targetMonsterName?: string; quantity?: number }
  | { kind: 'monster-soul'; monsterId: number; monsterName: string; quantity: number }
  | { kind: 'dungeon-entry'; dungeonId: number; dungeonName: string; regionId?: number; quantity?: number }
  | { kind: 'dungeon-reward'; dungeonId: number; dungeonName: string; regionId?: number }
  | { kind: 'vendor'; storeId: number; vendorId?: number; vendorName?: string };

const sources = new Map<number, ItemSource[]>();
function add(itemId: number, src: ItemSource) {
  if (!itemId || itemId <= 0) return;
  let arr = sources.get(itemId);
  if (!arr) {
    arr = [];
    sources.set(itemId, arr);
  }
  arr.push(src);
}

// 1. Quest rewards.
//    RewardQuestGroup.ItemId -> RewardQuest.Group (array contains RewardQuestGroup.RewardGroup)
//    -> RewardQuest.ContentID = quest DataID.
const questGroupToQuests = new Map<number, number[]>();
for (const r of Object.values(rewardQuest)) {
  const contentId = asNum(r.ContentID);
  if (contentId === undefined) continue;
  for (const groupId of asNumArr(r.Group)) {
    if (groupId <= 0) continue;
    let arr = questGroupToQuests.get(groupId);
    if (!arr) {
      arr = [];
      questGroupToQuests.set(groupId, arr);
    }
    arr.push(contentId);
  }
}
for (const r of Object.values(rewardQuestGroup)) {
  const itemId = asNum(r.ItemId);
  const groupId = asNum(r.RewardGroup);
  if (itemId === undefined || groupId === undefined) continue;
  const min = asNum(r.QuantityMin);
  const max = asNum(r.QuantityMax);
  const quests = questGroupToQuests.get(groupId) ?? [];
  for (const qid of quests) {
    add(itemId, {
      kind: 'quest',
      questId: qid,
      questName: questName(qid),
      quantityMin: min,
      quantityMax: max,
    });
  }
}

// 2. Achievement rewards (same shape as quest).
const achGroupToAchievements = new Map<number, number[]>();
for (const r of Object.values(rewardAchievement)) {
  const contentId = asNum(r.ContentID);
  if (contentId === undefined) continue;
  for (const groupId of asNumArr(r.Group)) {
    if (groupId <= 0) continue;
    let arr = achGroupToAchievements.get(groupId);
    if (!arr) {
      arr = [];
      achGroupToAchievements.set(groupId, arr);
    }
    arr.push(contentId);
  }
}
for (const r of Object.values(rewardAchievementGroup)) {
  const itemId = asNum(r.ItemId);
  const groupId = asNum(r.RewardGroup);
  if (itemId === undefined || groupId === undefined) continue;
  const min = asNum(r.QuantityMin);
  const max = asNum(r.QuantityMax);
  const achs = achGroupToAchievements.get(groupId) ?? [];
  for (const aid of achs) {
    add(itemId, {
      kind: 'achievement',
      achievementId: aid,
      achievementName: achievementName(aid),
      quantityMin: min,
      quantityMax: max,
    });
  }
}

// 3a. Bounty proof items: itemId == Wanted.WantedItemID drops from TargetMonsterID.
for (const r of Object.values(wanted)) {
  const itemId = asNum(r.WantedItemID);
  const monsterId = asNum(r.TargetMonsterID);
  const wantedId = asNum(r.DataID);
  if (itemId === undefined || monsterId === undefined || wantedId === undefined) continue;
  add(itemId, {
    kind: 'bounty',
    wantedId,
    targetMonsterId: monsterId,
    targetMonsterName: monsterName(monsterId),
    role: 'proof',
  });
}

// 3b. Bounty rewards: RewardWanted.ItemId[] paired with ItemValue[].
for (const r of Object.values(rewardWanted)) {
  const wantedId = asNum(r.ContentID);
  if (wantedId === undefined) continue;
  const ids = asNumArr(r.ItemId);
  const counts = asNumArr(r.ItemValue);
  for (let i = 0; i < ids.length; i++) {
    const itemId = ids[i];
    if (!itemId || itemId <= 0) continue;
    const w = wanted[wantedId];
    const monsterId = asNum(w?.TargetMonsterID) ?? 0;
    add(itemId, {
      kind: 'bounty',
      wantedId,
      targetMonsterId: monsterId,
      targetMonsterName: monsterId ? monsterName(monsterId) : `Bounty ${wantedId}`,
      role: 'reward',
      quantity: counts[i] && counts[i] > 0 ? counts[i] : undefined,
    });
  }
}

// 4. Challenge rewards: RewardChallenge.Item[] with ItemQuantity[].
for (const r of Object.values(rewardChallenge)) {
  const challengeId = asNum(r.ContentID);
  if (challengeId === undefined) continue;
  const ids = asNumArr(r.Item);
  const counts = asNumArr(r.ItemQuantity);
  const ch = challenge[challengeId];
  const monsterId = asNum(ch?.TargetId);
  for (let i = 0; i < ids.length; i++) {
    const itemId = ids[i];
    if (!itemId || itemId <= 0) continue;
    add(itemId, {
      kind: 'challenge',
      challengeId,
      targetMonsterId: monsterId,
      targetMonsterName: monsterId ? monsterName(monsterId) : undefined,
      quantity: counts[i] && counts[i] > 0 ? counts[i] : undefined,
    });
  }
}

// 5. Monster soul unlocks.
for (const r of Object.values(monsterSoul)) {
  const itemId = asNum(r.UnlockItemID);
  const charId = asNum(r.CharacterID);
  const count = asNum(r.UnlockItemCount) ?? 1;
  if (itemId === undefined || charId === undefined) continue;
  add(itemId, {
    kind: 'monster-soul',
    monsterId: charId,
    monsterName: monsterName(charId),
    quantity: count,
  });
}

// 6. Dungeon entry items.
for (const r of Object.values(dungeon)) {
  const itemId = asNum(r.EnterItemID);
  const dungeonId = asNum(r.DataID);
  if (itemId === undefined || itemId <= 0 || dungeonId === undefined) continue;
  add(itemId, {
    kind: 'dungeon-entry',
    dungeonId,
    dungeonName: dungeonName(dungeonId),
    regionId: regionId(dungeonId),
    quantity: asNum(r.EnterItemQuantity) ?? undefined,
  });
}

// 7. Dungeon rewards: RewardDungeon.Item[] keyed by dungeon DataID.
for (const r of Object.values(rewardDungeon)) {
  const dungeonId = asNum(r.ContentID);
  if (dungeonId === undefined) continue;
  for (const itemId of asNumArr(r.Item)) {
    if (!itemId || itemId <= 0) continue;
    add(itemId, {
      kind: 'dungeon-reward',
      dungeonId,
      dungeonName: dungeonName(dungeonId),
      regionId: regionId(dungeonId),
    });
  }
}

// 8. Vendor stock. StoreItemGroup.ItemId belongs to a Store via StoreItemGroupID.
//    Trace Store -> NPCFunctionGroup (FunctionType=Store, FunctionValue=storeId) ->
//    NPCFunction.DataID = vendor character ID. Spawner position lives in
//    WorldNeighborSpawner keyed by CharacterID.
const storeItemGroupToStore = new Map<number, number>();
for (const s of Object.values(store)) {
  const dataId = asNum(s.DataID);
  const groupId = asNum(s.StoreItemGroupID);
  if (dataId !== undefined && groupId !== undefined) storeItemGroupToStore.set(groupId, dataId);
}

// storeId -> vendor character IDs
const storeToVendors = new Map<number, number[]>();
const functionGroupToStoreId = new Map<number, number>();
for (const r of Object.values(npcFunctionGroup)) {
  if (r.FunctionType !== 'ENpLib_NPCFunctionType::Store') continue;
  const groupId = asNum(r.FunctionGroupID);
  const storeId = asNum(r.FunctionValue);
  if (groupId !== undefined && storeId !== undefined) functionGroupToStoreId.set(groupId, storeId);
}
for (const r of Object.values(npcFunction)) {
  const npcId = asNum(r.DataID);
  const groupId = asNum(r.FunctionGroupID);
  if (npcId === undefined || groupId === undefined) continue;
  const storeId = functionGroupToStoreId.get(groupId);
  if (storeId === undefined) continue;
  let arr = storeToVendors.get(storeId);
  if (!arr) {
    arr = [];
    storeToVendors.set(storeId, arr);
  }
  if (!arr.includes(npcId)) arr.push(npcId);
}

// quick check: does the NPC have a spawner in WorldNeighborSpawner?
const npcHasSpawner = new Set<number>();
for (const r of Object.values(worldNeighborSpawner)) {
  const cid = asNum(r.CharacterID);
  if (cid !== undefined) npcHasSpawner.add(cid);
}

for (const r of Object.values(storeItemGroup)) {
  const itemId = asNum(r.ItemId);
  const groupId = asNum(r.StoreItemGroupID);
  if (itemId === undefined || itemId <= 0 || groupId === undefined) continue;
  const storeId = storeItemGroupToStore.get(groupId) ?? groupId;
  const vendors = storeToVendors.get(storeId) ?? [];
  if (vendors.length === 0) {
    add(itemId, { kind: 'vendor', storeId });
    continue;
  }
  for (const vendorId of vendors) {
    add(itemId, {
      kind: 'vendor',
      storeId,
      vendorId: npcHasSpawner.has(vendorId) ? vendorId : undefined,
      vendorName: monsterName(vendorId), // resolves friendly NPC names too
    });
  }
}

// --- Dedupe identical sources per item, sort, and emit JSON ---
const out: Record<string, ItemSource[]> = {};
const itemIdsSorted = [...sources.keys()].sort((a, b) => a - b);
let totalSources = 0;
for (const id of itemIdsSorted) {
  const seen = new Set<string>();
  const list = sources.get(id)!.filter((s) => {
    const key = JSON.stringify(s);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  out[id] = list;
  totalSources += list.length;
}

fs.writeFileSync(OUT_FILE, JSON.stringify(out));
const itemsCovered = Object.keys(out).length;
const totalItems = Object.keys(items).length;
console.log(`item-sources: ${itemsCovered}/${totalItems} items (${totalSources} source rows) -> ${OUT_FILE}`);
const byKind: Record<string, number> = {};
for (const list of Object.values(out)) for (const s of list) byKind[s.kind] = (byKind[s.kind] ?? 0) + 1;
for (const [k, n] of Object.entries(byKind).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k}: ${n}`);
}
