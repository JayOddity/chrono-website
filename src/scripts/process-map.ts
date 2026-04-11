import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.resolve(__dirname, '..', '..', '..', 'Datamined Stuff', 'Data', 'Table_P');
const OUTPUT_FILE = path.resolve(__dirname, '..', 'data', 'map-data.ts');

function readTable(filename: string) {
  const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), 'utf8'));
  return raw[0].Rows;
}

function stripEnum(val: string): string {
  const idx = val.indexOf('::');
  return idx >= 0 ? val.slice(idx + 2) : val;
}

console.log('Loading data tables...');
const textWorld = readTable('TextWorld.json');
const world = readTable('World.json');
const sections = readTable('WorldSection.json');
const areaNames = readTable('UIAreaName.json');
const warpPoints = readTable('WarpPoint.json');
const heroSpawn = readTable('WorldHeroSpawnPoint.json');
const dungeons = readTable('Dungeon.json');
const monsters = readTable('WorldMonsterSpawner.json');
const fishing = readTable('FishingLocationInfo.json');

function getTextENG(id: number): string {
  const e = textWorld[id];
  return e ? e.Text_ENG : '';
}

// --- Area Labels (zone names with coordinates) ---
console.log('Processing area labels...');
interface AreaLabel {
  id: number;
  name: string;
  x: number;
  y: number;
  regionGroup: string;
}

const areaLabels: AreaLabel[] = [];
for (const a of Object.values(areaNames) as any[]) {
  let name = getTextENG(a.TextID);
  if (!name) continue;
  // Determine region group from WorldID prefix
  const wid = a.WorldID;
  let regionGroup = 'unknown';
  if (wid >= 9001000 && wid < 9002000) regionGroup = 'dawn-slope';
  else if (wid >= 9002000 && wid < 9003000) regionGroup = 'guardian';
  else if (wid >= 9003000 && wid < 9004000) regionGroup = 'plains-promise';
  else if (wid >= 9004000 && wid < 9005000) regionGroup = 'void-region';
  else if (wid >= 9005000 && wid < 9006000) regionGroup = 'broken-region';
  else if (wid >= 9006000 && wid < 9007000) regionGroup = 'outcast-region';

  areaLabels.push({
    id: a.DataID,
    name,
    x: Math.round(a.Coordinate.X),
    y: Math.round(a.Coordinate.Y),
    regionGroup,
  });
}

// --- Warp Points (with coordinates from HeroSpawnPoint) ---
console.log('Processing warp points...');
interface WarpMarker {
  id: number;
  name: string;
  x: number;
  y: number;
  warpType: 'settlement' | 'warp' | 'boundstone';
}

// Build spawn point lookup: (HeroSpawnPointID, RegionID) -> position
const seteraSpawns = (Object.values(heroSpawn) as any[]).filter(
  (h) => h.Actor.AssetPathName.includes('Setera'),
);
const spawnMap: Record<string, { x: number; y: number }> = {};
for (const h of seteraSpawns) {
  const key = `${h.HeroSpawnPointID}_${h.RegionID}`;
  spawnMap[key] = {
    x: Math.round(h.SpawnPointPosition.X),
    y: Math.round(h.SpawnPointPosition.Y),
  };
}

function sectionToBaseRegion(sectionID: number): number {
  if (sectionID >= 9100000) return 1000000;
  const regionNum = Math.floor((sectionID - 9000000) / 1000);
  return regionNum * 1000 + 1000000;
}

const warpMarkers: WarpMarker[] = [];
for (const w of Object.values(warpPoints) as any[]) {
  const name = getTextENG(w.WarpPointNameTextID);
  if (!name) continue;
  const baseRegion = sectionToBaseRegion(w.SectionID);
  const key = `${w.HeroSpawnPositionID}_${baseRegion}`;
  let pos = spawnMap[key];
  // Fallback: find any spawn with this HeroSpawnPointID
  if (!pos) {
    const alt = seteraSpawns.find((h: any) => h.HeroSpawnPointID === w.HeroSpawnPositionID);
    if (alt) pos = { x: Math.round(alt.SpawnPointPosition.X), y: Math.round(alt.SpawnPointPosition.Y) };
  }
  if (!pos) continue;

  // Determine warp type from name
  let warpType: 'settlement' | 'warp' | 'boundstone' = 'warp';
  if (name === 'Bound Stone') warpType = 'boundstone';
  else if (['Dawn Slope Settlement', 'Settlement', 'New Rodinia', 'Bell of Grace', 'Lantern of Adventure', 'The Citadel'].includes(name)) warpType = 'settlement';

  warpMarkers.push({
    id: w.WarpPointID,
    name,
    x: pos.x,
    y: pos.y,
    warpType,
  });
}

// --- Enrich area labels with section spawn positions ---
// For sections with named areas but no UIAreaName, use heroSpawn coords
for (const s of Object.values(sections) as any[]) {
  const id = s.DataID;
  if (id < 9001000 || id >= 9900000) continue;
  const name = getTextENG(s.SectionTextID);
  if (!name || name === 'Temp Section' || name === 'Bound Stone') continue;
  // Skip if we already have this from UIAreaName
  if (areaLabels.some((a) => a.name === name)) continue;

  // Try to find spawn point for this section via base region mapping
  const baseRegion = sectionToBaseRegion(id);
  // Look for any spawn in this base region
  const spawn = seteraSpawns.find((h: any) => h.RegionID === baseRegion);
  if (!spawn) continue;

  let regionGroup = 'unknown';
  if (id >= 9001000 && id < 9002000) regionGroup = 'dawn-slope';
  else if (id >= 9002000 && id < 9003000) regionGroup = 'guardian';
  else if (id >= 9003000 && id < 9004000) regionGroup = 'plains-promise';
  else if (id >= 9004000 && id < 9005000) regionGroup = 'void-region';
  else if (id >= 9005000 && id < 9006000) regionGroup = 'broken-region';
  else if (id >= 9006000 && id < 9007000) regionGroup = 'outcast-region';

  // Don't add - we don't have per-section coordinates, only per-region
  // The UIAreaName entries are the authoritative coordinate source
}

// --- Named Sections (sub-areas with level ranges) ---
console.log('Processing sections...');
interface SectionMarker {
  id: number;
  name: string;
  minLevel: number;
  maxLevel: number;
  isPvP: boolean;
  regionGroup: string;
}

const sectionMarkers: SectionMarker[] = [];
for (const s of Object.values(sections) as any[]) {
  const id = s.DataID;
  if (id < 9001000 || id >= 9900000) continue;
  const name = getTextENG(s.SectionTextID);
  if (!name || name === 'Temp Section' || name === 'Bound Stone') continue;

  let regionGroup = 'unknown';
  if (id >= 9001000 && id < 9002000) regionGroup = 'dawn-slope';
  else if (id >= 9002000 && id < 9003000) regionGroup = 'guardian';
  else if (id >= 9003000 && id < 9004000) regionGroup = 'plains-promise';
  else if (id >= 9004000 && id < 9005000) regionGroup = 'void-region';
  else if (id >= 9005000 && id < 9006000) regionGroup = 'broken-region';
  else if (id >= 9006000 && id < 9007000) regionGroup = 'outcast-region';

  sectionMarkers.push({
    id,
    name,
    minLevel: s.MinRecommendLv > 0 ? s.MinRecommendLv : 0,
    maxLevel: s.MaxRecommendLv > 0 ? s.MaxRecommendLv : 0,
    isPvP: s.IsPvPChange,
    regionGroup,
  });
}

// --- Dungeons ---
console.log('Processing dungeons...');
interface DungeonMarker {
  id: number;
  name: string;
  description: string;
  type: string;
  groupType: string;
  minGearScore: number;
  minParty: number;
  maxParty: number;
}

const dungeonMarkers: DungeonMarker[] = [];
for (const d of Object.values(dungeons) as any[]) {
  const name = getTextENG(d.DungeonName);
  const desc = getTextENG(d.DungeonDesc);
  if (!name) continue;
  // Skip temp/placeholder names
  if (name.includes('(임시') || name.includes('(Eden)')) continue;
  const type = stripEnum(d.DungeonType);
  const group = stripEnum(d.GroupType);

  dungeonMarkers.push({
    id: d.DataID,
    name,
    description: desc,
    type,
    groupType: group,
    minGearScore: d.MinGearScore > 0 ? d.MinGearScore : 0,
    minParty: d.MinPeopleNumber,
    maxParty: d.MaxPeopleNumber,
  });
}

// --- Monster Spawn Clusters (aggregate into zone density) ---
console.log('Processing monster spawns...');
interface MonsterCluster {
  x: number;
  y: number;
  count: number;
}

// Bucket monsters into grid cells for density visualization
const BUCKET_SIZE = 10000; // 10K unit buckets
const monsterBuckets: Record<string, { x: number; y: number; count: number; sumX: number; sumY: number }> = {};
for (const m of Object.values(monsters) as any[]) {
  if (!m.Actor.AssetPathName.includes('Setera')) continue;
  const bx = Math.floor(m.SpawnPosition.X / BUCKET_SIZE);
  const by = Math.floor(m.SpawnPosition.Y / BUCKET_SIZE);
  const key = `${bx},${by}`;
  if (!monsterBuckets[key]) {
    monsterBuckets[key] = { x: 0, y: 0, count: 0, sumX: 0, sumY: 0 };
  }
  monsterBuckets[key].count++;
  monsterBuckets[key].sumX += m.SpawnPosition.X;
  monsterBuckets[key].sumY += m.SpawnPosition.Y;
}

const monsterClusters: MonsterCluster[] = Object.values(monsterBuckets)
  .filter(b => b.count >= 3) // Only show clusters with 3+ spawns
  .map(b => ({
    x: Math.round(b.sumX / b.count),
    y: Math.round(b.sumY / b.count),
    count: b.count,
  }));

// --- Coordinate bounds ---
const allX = [
  ...areaLabels.map(a => a.x),
  ...warpMarkers.map(w => w.x),
  ...monsterClusters.map(m => m.x),
];
const allY = [
  ...areaLabels.map(a => a.y),
  ...warpMarkers.map(w => w.y),
  ...monsterClusters.map(m => m.y),
];

const bounds = {
  minX: Math.min(...allX),
  maxX: Math.max(...allX),
  minY: Math.min(...allY),
  maxY: Math.max(...allY),
};

// --- Generate output ---
console.log('Writing output...');

let output = `// AUTO-GENERATED by process-map.ts — do not edit manually
// Generated: ${new Date().toISOString()}

export interface AreaLabel {
  id: number;
  name: string;
  x: number;
  y: number;
  regionGroup: string;
}

export interface WarpMarker {
  id: number;
  name: string;
  x: number;
  y: number;
  warpType: 'settlement' | 'warp' | 'boundstone';
}

export interface SectionMarker {
  id: number;
  name: string;
  minLevel: number;
  maxLevel: number;
  isPvP: boolean;
  regionGroup: string;
}

export interface DungeonMarker {
  id: number;
  name: string;
  description: string;
  type: string;
  groupType: string;
  minGearScore: number;
  minParty: number;
  maxParty: number;
}

export interface MonsterCluster {
  x: number;
  y: number;
  count: number;
}

export const MAP_BOUNDS = ${JSON.stringify(bounds)};

export const REGION_GROUPS: Record<string, { name: string; color: string }> = {
  'dawn-slope': { name: 'Dawn Slope', color: '#4ade80' },
  'plains-promise': { name: 'Plains of Promise', color: '#60a5fa' },
  'guardian': { name: 'Guardian Territory', color: '#c084fc' },
  'void-region': { name: 'Void Territory', color: '#f87171' },
  'broken-region': { name: 'Broken Territory', color: '#fb923c' },
  'outcast-region': { name: 'Outcast Territory', color: '#facc15' },
};

`;

output += `export const AREA_LABELS: AreaLabel[] = ${JSON.stringify(areaLabels, null, 2)};\n\n`;
output += `export const WARP_MARKERS: WarpMarker[] = ${JSON.stringify(warpMarkers, null, 2)};\n\n`;
output += `export const SECTION_MARKERS: SectionMarker[] = ${JSON.stringify(sectionMarkers, null, 2)};\n\n`;
output += `export const DUNGEON_MARKERS: DungeonMarker[] = ${JSON.stringify(dungeonMarkers, null, 2)};\n\n`;
output += `export const MONSTER_CLUSTERS: MonsterCluster[] = ${JSON.stringify(monsterClusters, null, 2)};\n`;

fs.writeFileSync(OUTPUT_FILE, output, 'utf8');

console.log(`Done! Written to ${OUTPUT_FILE}`);
console.log(`  Area labels: ${areaLabels.length}`);
console.log(`  Warp markers: ${warpMarkers.length}`);
console.log(`  Sections: ${sectionMarkers.length}`);
console.log(`  Dungeons: ${dungeonMarkers.length}`);
console.log(`  Monster clusters: ${monsterClusters.length}`);
console.log(`  Bounds: X[${bounds.minX}, ${bounds.maxX}] Y[${bounds.minY}, ${bounds.maxY}]`);
