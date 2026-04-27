import fs from 'node:fs';
import path from 'node:path';
import { loadTable, enumTail } from '../lib/tables.mjs';
import { resolveText } from '../lib/resolvers.mjs';
import { REPO_ROOT } from '../lib/config.mjs';

// Build the set of region IDs belonging to the Setera continent (WorldID = 10).
// All other WorldIDs are mini-dungeons, Balrog, Cradle, etc. — they use local
// coordinate spaces that overlap Setera and must be excluded from the main map.
let _seteraRegions = null;
function seteraRegions() {
  if (_seteraRegions) return _seteraRegions;
  const wr = loadTable('WorldRegion');
  _seteraRegions = new Set();
  for (const [id, row] of Object.entries(wr)) {
    if (row.WorldID === 10) _seteraRegions.add(Number(id));
  }
  return _seteraRegions;
}
function isSeteraRegion(regionId) {
  return seteraRegions().has(Number(regionId));
}

function resolveCharacterName(charInfoId) {
  const ci = loadTable('CharacterInfo');
  const row = ci[String(charInfoId)];
  if (!row) return null;
  return resolveText('TextCharacter', row.CharacterName_TextID);
}

function bucketize(positions, bucketSize = 4000) {
  const buckets = new Map();
  for (const p of positions) {
    const bx = Math.round(p.x / bucketSize);
    const by = Math.round(p.y / bucketSize);
    const key = `${bx}_${by}`;
    const entry = buckets.get(key);
    if (!entry) {
      buckets.set(key, { sumX: p.x, sumY: p.y, count: 1 });
    } else {
      entry.sumX += p.x;
      entry.sumY += p.y;
      entry.count += 1;
    }
  }
  return [...buckets.values()].map((b) => ({
    x: Math.round(b.sumX / b.count),
    y: Math.round(b.sumY / b.count),
    count: b.count,
  }));
}

function buildWarpPOIs() {
  const wp = loadTable('WarpPoint');
  const prop = loadTable('WorldProp');
  const hero = loadTable('WorldHeroSpawnPoint');
  const propById = new Map();
  for (const v of Object.values(prop)) propById.set(v.PropId, v);
  const heroById = new Map();
  for (const v of Object.values(hero)) {
    const list = heroById.get(v.HeroSpawnPointID) ?? [];
    list.push(v);
    heroById.set(v.HeroSpawnPointID, list);
  }

  const out = [];
  for (const row of Object.values(wp)) {
    const name = resolveText('TextWorld', row.WarpPointNameTextID);
    if (!name) continue;

    let pos = null;
    const p = propById.get(row.PropId);
    if (p?.SpawnPosition) pos = p.SpawnPosition;
    if (!pos) {
      const heroes = heroById.get(row.HeroSpawnPositionID) ?? [];
      for (const h of heroes) {
        if (h?.SpawnPointPosition) { pos = h.SpawnPointPosition; break; }
      }
    }
    if (!pos) continue;

    const isBoundStone = name === 'Bound Stone';
    out.push({
      id: row.WarpPointID,
      name,
      type: isBoundStone ? 'boundStone' : 'warp',
      cost: row.BaseCost ?? 0,
      sectionId: row.SectionID,
      x: Math.round(pos.X),
      y: Math.round(pos.Y),
    });
  }
  return out;
}

function buildRespawnPOIs() {
  const rp = loadTable('RespawnPoint');
  const hero = loadTable('WorldHeroSpawnPoint');
  const heroById = new Map();
  for (const v of Object.values(hero)) {
    const list = heroById.get(v.HeroSpawnPointID) ?? [];
    list.push(v);
    heroById.set(v.HeroSpawnPointID, list);
  }

  const out = [];
  for (const row of Object.values(rp)) {
    if (!isSeteraRegion(row.RegionID)) continue;
    const heroes = heroById.get(row.HeroSpawnPointID) ?? [];
    const hit = heroes.find((h) => h.RegionID === row.RegionID) ?? heroes[0];
    const pos = hit?.SpawnPointPosition;
    if (!pos) continue;
    const name = resolveText('TextWorld', row.RespawnPointNameTextID) ?? 'Respawn';
    out.push({
      id: row.RespawnPointID,
      name,
      regionId: row.RegionID,
      x: Math.round(pos.X),
      y: Math.round(pos.Y),
    });
  }
  return out;
}

function buildReturnPOIs() {
  const rp = loadTable('ReturnPoint');
  const hero = loadTable('WorldHeroSpawnPoint');
  const heroById = new Map();
  for (const v of Object.values(hero)) {
    const list = heroById.get(v.HeroSpawnPointID) ?? [];
    list.push(v);
    heroById.set(v.HeroSpawnPointID, list);
  }

  const out = [];
  for (const row of Object.values(rp)) {
    if (!isSeteraRegion(row.RegionID)) continue;
    const heroes = heroById.get(row.HeroSpawnPointID) ?? [];
    const hit = heroes.find((h) => h.RegionID === row.RegionID) ?? heroes[0];
    const pos = hit?.SpawnPointPosition;
    if (!pos) continue;
    const name = resolveText('TextWorld', row.ReturnPointNameTextID);
    if (!name) continue;
    out.push({
      id: row.ReturnPointID,
      name,
      type: enumTail(row.ReturnPointType),
      x: Math.round(pos.X),
      y: Math.round(pos.Y),
    });
  }
  return out;
}

function buildSectionLabels() {
  const sections = loadTable('WorldSection');
  const warps = buildWarpPOIs();
  const warpsBySection = new Map();
  for (const w of warps) {
    warpsBySection.set(w.sectionId, w);
  }

  const out = [];
  for (const row of Object.values(sections)) {
    const name = resolveText('TextWorld', row.SectionTextID);
    if (!name || name === 'Temp Section' || name === 'Bound Stone' || name === 'Vault') continue;
    const warp = warpsBySection.get(row.DataID);
    if (!warp) continue; // can only label sections we can position
    out.push({
      id: row.DataID,
      name,
      regionId: row.RegionID,
      minLevel: row.MinRecommendLv > 0 ? row.MinRecommendLv : 0,
      maxLevel: row.MaxRecommendLv > 0 ? row.MaxRecommendLv : 0,
      isPvP: !!row.IsPvPChange,
      x: warp.x,
      y: warp.y,
    });
  }
  return out;
}

function buildMonsterPOIs() {
  const spawns = loadTable('WorldMonsterSpawnPosition');
  const charInfo = loadTable('CharacterInfo');

  const byMonster = new Map();
  for (const row of Object.values(spawns)) {
    if (!isSeteraRegion(row.RegionID)) continue;
    const mid = row.MonsterID;
    const pos = row.MonsterPosition;
    if (!mid || mid < 0 || !pos) continue;
    if (!byMonster.has(mid)) byMonster.set(mid, []);
    byMonster.get(mid).push({ x: pos.X, y: pos.Y });
  }

  const pois = [];
  for (const [mid, positions] of byMonster) {
    const name = resolveCharacterName(mid);
    if (!name) continue;
    const ci = charInfo[String(mid)];
    const grade = enumTail(ci?.GradeType);
    const subType = enumTail(ci?.UnitSubType);
    const buckets = bucketize(positions, 5000);
    for (const b of buckets) {
      pois.push({
        monsterId: mid,
        name,
        grade,
        subType,
        x: b.x,
        y: b.y,
        spawnCount: b.count,
      });
    }
  }
  return pois;
}

function buildHeroPOIs() {
  const heroes = loadTable('WorldHeroSpawnPoint');
  const out = [];
  for (const row of Object.values(heroes)) {
    if (!isSeteraRegion(row.RegionID)) continue;
    const pos = row.SpawnPointPosition;
    if (!pos) continue;
    out.push({
      id: row.HeroSpawnPointID,
      name: row.SpawnPointName ?? '',
      x: Math.round(pos.X),
      y: Math.round(pos.Y),
      radius: row.SpawnPointRadius ?? -1,
      faction: enumTail(row.FactionType),
      regionId: row.RegionID,
    });
  }
  return out;
}

function buildNeighborPOIs() {
  const neighbors = loadTable('WorldNeighborSpawner');
  const out = [];
  for (const row of Object.values(neighbors)) {
    if (!isSeteraRegion(row.RegionID)) continue;
    const pos = row.position;
    if (!pos) continue;
    const cid = row.CharacterID;
    const name = resolveCharacterName(cid) ?? null;
    out.push({
      characterId: cid,
      name,
      x: Math.round(pos.X),
      y: Math.round(pos.Y),
      regionId: row.RegionID,
    });
  }
  return out;
}

function resolveTextPropTag(tag) {
  if (!tag || tag === 'None' || typeof tag !== 'string') return null;
  const prefix = 'TextProp.';
  const bare = tag.startsWith(prefix) ? tag.slice(prefix.length) : tag;
  const rows = loadTable('TextProp');
  for (const r of Object.values(rows)) {
    if (r.TagName === bare) return r.Text_ENG || null;
  }
  return null;
}

// Build a single propInfo → category mapping
function classifyProp(info, resolvedName) {
  const ability = enumTail(info.AbilityType);
  const nav = enumTail(info.NavimarkType);
  if (ability === 'Mining') return 'mining';
  if (ability === 'Harvesting') return 'harvesting';
  if (ability === 'Logging') return 'logging';
  const navMap = {
    Labyrinth: 'labyrinth',
    MapTower: 'mapTower',
    Expeduition: 'expedition',
    Trial: 'trial',
    Exit: 'exit',
    MarketNpc: 'market',
    Kitchen: 'kitchen',
    Storage: 'storage',
    CraftWeapon: 'craftWeapon',
    CraftArmor: 'craftArmor',
    CraftAccessory: 'craftAccessory',
    MagicWorkShop: 'magicWorkshop',
    WarBoard: 'warBoard',
    WantedBoard: 'wantedBoard',
    TownBoard: 'townBoard',
    RegionManagementTable: 'regionTable',
    Process: 'process',
  };
  if (navMap[nav]) return navMap[nav];

  if (resolvedName) {
    const n = resolvedName;
    if (n.startsWith('Time Portal')) return 'timePortal';
    if (n === 'Beacon of Time') return 'beaconOfTime';
    if (n === 'Wedge of Time') return 'wedgeOfTime';
    if (n.startsWith('Elite ') && (n.includes('Crate') || n.includes('Supply'))) return 'chestElite';
    if (n.includes('Crate')) return 'chest';
    if (n.includes('Corpse')) return 'corpse';
    if (n === 'Locked Door') return 'lockedDoor';
    if (n === 'Bound Stone') return 'boundStoneExtra';
    if (n === 'Switch') return 'switch';
    if (n === 'Well') return 'well';
    if (n === 'Vault') return 'vault';
    if (n === 'Pure Form') return 'pureForm';
    if (n === 'Glass Bottle') return 'questItem';
  }
  return null;
}

function buildPropPOIs() {
  const props = loadTable('WorldProp');
  const propInfo = loadTable('PropInfo');
  const out = [];
  const tagCache = new Map();

  for (const row of Object.values(props)) {
    if (!isSeteraRegion(row.RegionID)) continue;
    const pos = row.SpawnPosition;
    if (!pos) continue;
    const info = propInfo[String(row.PropGroupID)];
    if (!info) continue;

    const tagKey = info.TagID ?? 'None';
    let title = tagCache.get(tagKey);
    if (title === undefined) {
      title = resolveTextPropTag(tagKey);
      tagCache.set(tagKey, title);
    }

    const category = classifyProp(info, title);
    if (!category) continue;

    out.push({
      propId: row.PropId,
      propGroupId: row.PropGroupID,
      category,
      title: title ?? null,
      level: info.HuntingRequireLv ?? 0,
      x: Math.round(pos.X),
      y: Math.round(pos.Y),
      regionId: row.RegionID,
    });
  }
  return out;
}

export function buildPOIs() {
  const warps = buildWarpPOIs();
  const respawns = buildRespawnPOIs();
  const returns = buildReturnPOIs();
  const sections = buildSectionLabels();
  const monsters = buildMonsterPOIs();
  const heroes = buildHeroPOIs();
  const neighbors = buildNeighborPOIs();
  const propPois = buildPropPOIs();

  const byCategory = {};
  for (const p of propPois) (byCategory[p.category] ??= 0, byCategory[p.category]++);

  // The arrays are written as JSON files — Turbopack parses JSON far more
  // cheaply than huge inline TS array literals, which used to crash the dev
  // server with out-of-memory restarts. The TS wrapper just re-exports them.
  const dataDir = path.join(REPO_ROOT, 'src', 'data');
  const jsonDir = path.join(dataDir, 'map-pois');
  fs.mkdirSync(jsonDir, { recursive: true });

  const jsonTargets = [
    ['warp-pois.json', warps],
    ['respawn-pois.json', respawns],
    ['return-pois.json', returns],
    ['section-labels.json', sections],
    ['monster-pois.json', monsters],
    ['hero-pois.json', heroes],
    ['neighbor-pois.json', neighbors],
    ['prop-pois.json', propPois],
  ];
  for (const [name, data] of jsonTargets) {
    fs.writeFileSync(path.join(jsonDir, name), JSON.stringify(data));
  }

  const outFile = path.join(dataDir, 'map-pois.ts');
  const tsSource =
    `// AUTO-GENERATED by scripts/datamine — do not edit\n` +
    `// POI types + re-exports. The arrays live in map-pois/*.json so Turbopack\n` +
    `// can load them as static JSON modules instead of parsing a single giant TS file.\n\n` +
    `import warpData from './map-pois/warp-pois.json';\n` +
    `import respawnData from './map-pois/respawn-pois.json';\n` +
    `import returnData from './map-pois/return-pois.json';\n` +
    `import sectionData from './map-pois/section-labels.json';\n` +
    `import monsterData from './map-pois/monster-pois.json';\n` +
    `import heroData from './map-pois/hero-pois.json';\n` +
    `import neighborData from './map-pois/neighbor-pois.json';\n` +
    `import propData from './map-pois/prop-pois.json';\n\n` +
    `export interface WarpPoi { id: number; name: string; type: 'warp' | 'boundStone'; cost: number; sectionId: number; x: number; y: number; }\n` +
    `export interface RespawnPoi { id: number; name: string; regionId: number; x: number; y: number; }\n` +
    `export interface ReturnPoi { id: number; name: string; type: string; x: number; y: number; }\n` +
    `export interface SectionLabel { id: number; name: string; regionId: number; minLevel: number; maxLevel: number; isPvP: boolean; x: number; y: number; }\n` +
    `export interface MonsterPoi { monsterId: number; name: string; grade: string; subType: string; x: number; y: number; spawnCount: number; }\n` +
    `export interface HeroPoi { id: number; name: string; x: number; y: number; radius: number; faction: string; regionId: number; }\n` +
    `export interface NeighborPoi { characterId: number; name: string | null; x: number; y: number; regionId: number; }\n` +
    `export interface PropPoi { propId: number; propGroupId: number; category: string; title: string | null; level: number; x: number; y: number; regionId: number; }\n\n` +
    `export const WARP_POIS = warpData as WarpPoi[];\n` +
    `export const RESPAWN_POIS = respawnData as RespawnPoi[];\n` +
    `export const RETURN_POIS = returnData as ReturnPoi[];\n` +
    `export const SECTION_LABELS = sectionData as SectionLabel[];\n` +
    `export const MONSTER_POIS = monsterData as MonsterPoi[];\n` +
    `export const HERO_POIS = heroData as HeroPoi[];\n` +
    `export const NEIGHBOR_POIS = neighborData as NeighborPoi[];\n` +
    `export const PROP_POIS = propData as PropPoi[];\n`;

  fs.writeFileSync(outFile, tsSource);
  return {
    count:
      warps.length + respawns.length + returns.length + sections.length +
      monsters.length + heroes.length + neighbors.length + propPois.length,
    outFile,
    breakdown: {
      warps: warps.length,
      respawns: respawns.length,
      returns: returns.length,
      sections: sections.length,
      monsters: monsters.length,
      heroes: heroes.length,
      neighbors: neighbors.length,
      props: propPois.length,
      byCategory,
    },
  };
}
