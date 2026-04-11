import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.resolve(__dirname, '..', '..', '..', 'Datamined Stuff', 'Data', 'Table_P');
const OUTPUT_FILE = path.resolve(__dirname, '..', 'data', 'talent-calculator.ts');

function readTable(filename: string) {
  const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), 'utf8'));
  return raw[0].Rows;
}

function stripEnum(val: string): string {
  const idx = val.indexOf('::');
  return idx >= 0 ? val.slice(idx + 2) : val;
}

function getText(textRows: Record<string, any>, id: number): string {
  const entry = textRows[id];
  return entry ? entry.Text_ENG : '';
}

// Load tables
console.log('Loading data tables...');
const textSkill = readTable('TextSkill.json');
const weaponMastery = readTable('WeaponMasteryInfo.json');
const weaponMasterySkill = readTable('WeaponMasterySkillInfo.json');
const classMastery = readTable('ClassMasteryInfo.json');
const classMasterySkill = readTable('ClassMasterySkillInfo.json');
const skillTable = readTable('Skill.json');

// --- Weapon display names ---
const WEAPON_DISPLAY: Record<string, string> = {
  GreatSword: 'Greatsword',
  LongSword: 'Longsword',
  DualSwords: 'Dual Blades',
  LongBow: 'Bow',
  Crossbows: 'Crossbow',
  Rapier: 'Rapier',
  Lance: 'Lance',
  Halberd: 'Halberd',
  Mace: 'Mace',
  Staff: 'Staff',
  MagicOrb: 'Manasphere',
  Spellbook: 'Grimoire',
  ChainSwords: 'Chain Blades',
  Hatchets: 'Twin Axes',
  BattleAxe: 'Battle Axe',
  Sabre: 'Sabre',
  WristBlades: 'Wrist Blades',
  Musket: 'Musket',
};

const CLASS_DISPLAY: Record<string, string> = {
  Swordman: 'Swordsman',
  Archer: 'Ranger',
  Paladin: 'Paladin',
  Sorcerer: 'Sorcerer',
  Berserker: 'Berserker',
  Assassin: 'Assassin',
};

const CLASS_ORDER = ['Swordman', 'Archer', 'Paladin', 'Sorcerer', 'Berserker', 'Assassin'];

// --- Process Weapon Mastery ---
console.log('Processing weapon mastery...');

interface WMNode {
  id: number;
  name: string;
  description: string;
  type: string;
  maxLevel: number;
  gridIndex: number;
  needMasteryLevel: number;
  prereq1: { id: number; level: number } | null;
  prereq2: { id: number; level: number } | null;
  cooldown: number;
  resourceCost: number;
  resourceType: string;
  staminaCost: number;
  hpCost: number;
}

interface WeaponTreeData {
  weaponKey: string;
  displayName: string;
  nodes: WMNode[];
}

interface ClassTalentData {
  classKey: string;
  displayName: string;
  weapons: WeaponTreeData[];
  classMastery: CMNode[];
}

interface CMNode {
  id: number;
  name: string;
  description: string;
  type: string;
  unlockLevel: number;
  isShared: boolean;
}

// Get weapon mastery skill descriptions
function getWMDescription(skillGroupId: number): string {
  // Find the first skill info entry for this group
  const entries = Object.values(weaponMasterySkill).filter(
    (e: any) => e.WeaponMasterySkillGroupID === skillGroupId
  );
  if (entries.length === 0) return '';
  const first = entries[0] as any;
  let desc = getText(textSkill, first.Desc_TextID);
  // Clean up template vars - replace [@...] with placeholder
  desc = desc.replace(/\[@[^\]]+\.Damage_Rate\]/g, 'X');
  desc = desc.replace(/\[@[^\]]+\.Heal_Rate\]/g, 'X');
  desc = desc.replace(/\[@[^\]]+\.IncreaseStatRate\]/g, 'X');
  desc = desc.replace(/\[@[^\]]+\.DecreaseStatRate\]/g, 'X');
  desc = desc.replace(/\[@[^\]]+\.StatusEffectDuration\]/g, 'X');
  desc = desc.replace(/\[@[^\]]+\.MaxStack\]/g, 'X');
  desc = desc.replace(/\[@[^\]]+\.Duration\]/g, 'X');
  desc = desc.replace(/\[@[^\]]+\.DamageRate\]/g, 'X');
  desc = desc.replace(/\[@[^\]]+\]/g, 'X');
  return desc;
}

// Get skill cooldown/cost info from Skill.json
function getSkillInfo(skillGroupId: number): { cooldown: number; resourceCost: number; resourceType: string; staminaCost: number; hpCost: number } {
  // The skill group ID often maps directly to a skill ID
  const skillEntry = skillTable[skillGroupId] as any;
  if (!skillEntry) {
    return { cooldown: 0, resourceCost: 0, resourceType: '', staminaCost: 0, hpCost: 0 };
  }

  const cooldowns = skillEntry.Cooldown || [0];
  const cd = cooldowns[0] > 0 ? cooldowns[0] : 0;
  const cp1 = skillEntry.CP1Change || 0;
  const stamina = skillEntry.StaminaCost || 0;
  const hpCost = skillEntry.HPRateCost || 0;

  let resourceType = '';
  if (cp1 < 0) resourceType = 'resource'; // Generic - will be named per class

  return {
    cooldown: cd,
    resourceCost: cp1 < 0 ? Math.abs(cp1) : 0,
    resourceType,
    staminaCost: stamina,
    hpCost: hpCost > 0 ? Math.round(hpCost * 100) : 0,
  };
}

// Build weapon trees grouped by class
const allClassData: ClassTalentData[] = [];

for (const classKey of CLASS_ORDER) {
  const classEntries = Object.values(weaponMastery).filter(
    (e: any) => stripEnum(e.ClassType) === classKey
  );

  // Group by weapon
  const weaponGroups: Record<string, any[]> = {};
  for (const entry of classEntries as any[]) {
    const wep = stripEnum(entry.WeaponType);
    if (!weaponGroups[wep]) weaponGroups[wep] = [];
    weaponGroups[wep].push(entry);
  }

  const weapons: WeaponTreeData[] = [];
  for (const [wepKey, entries] of Object.entries(weaponGroups)) {
    const nodes: WMNode[] = [];

    for (const e of entries) {
      const name = getText(textSkill, e.Title_TextID);
      const desc = getWMDescription(e.WeaponMasterySkillGroup);
      const type = stripEnum(e.MasteryType);
      const skillInfo = getSkillInfo(e.WeaponMasterySkillGroup);

      nodes.push({
        id: e.MasteryID,
        name: name || `Unknown (${e.MasteryID})`,
        description: desc,
        type,
        maxLevel: e.MaxLevel,
        gridIndex: e.MasteryIndex,
        needMasteryLevel: e.NeedMasteryLevel,
        prereq1: e.PrecedeMasteryID1 ? { id: e.PrecedeMasteryID1, level: e.NeedPrecedeMasteryLevel1 } : null,
        prereq2: e.PrecedeMasteryID2 ? { id: e.PrecedeMasteryID2, level: e.NeedPrecedeMasteryLevel2 } : null,
        cooldown: skillInfo.cooldown,
        resourceCost: skillInfo.resourceCost,
        resourceType: skillInfo.resourceType,
        staminaCost: skillInfo.staminaCost,
        hpCost: skillInfo.hpCost,
      });
    }

    nodes.sort((a, b) => a.gridIndex - b.gridIndex);

    weapons.push({
      weaponKey: wepKey,
      displayName: WEAPON_DISPLAY[wepKey] || wepKey,
      nodes,
    });
  }

  // --- Process Class Mastery ---
  const cmEntries = Object.values(classMastery).filter((e: any) => {
    const cls = stripEnum(e.ClassType);
    return cls === classKey || cls === 'None';
  });

  const classMasteryNodes: CMNode[] = [];
  for (const e of cmEntries as any[]) {
    const name = getText(textSkill, e.Title_TextID);
    const cls = stripEnum(e.ClassType);

    // Get description from ClassMasterySkillInfo
    const cmSkillEntry = Object.values(classMasterySkill).find(
      (s: any) => s.DataID === e.MasteryID
    ) as any;
    let desc = '';
    if (cmSkillEntry) {
      desc = getText(textSkill, cmSkillEntry.Desc_TextID);
      desc = desc.replace(/\[@[^\]]+\]/g, 'X');
    }

    classMasteryNodes.push({
      id: e.MasteryID,
      name: name || `Unknown (${e.MasteryID})`,
      description: desc,
      type: stripEnum(e.MasteryType),
      unlockLevel: e.OpenClassLv,
      isShared: cls === 'None',
    });
  }

  classMasteryNodes.sort((a, b) => a.unlockLevel - b.unlockLevel || a.id - b.id);

  allClassData.push({
    classKey,
    displayName: CLASS_DISPLAY[classKey],
    weapons,
    classMastery: classMasteryNodes,
  });
}

// --- Generate output ---
console.log('Writing output...');

let output = `// AUTO-GENERATED by process-talents.ts — do not edit manually
// Generated: ${new Date().toISOString()}

export interface WeaponMasteryNode {
  id: number;
  name: string;
  description: string;
  type: 'Active' | 'ActiveEnforce' | 'Passive' | 'PassiveSynergy' | 'SpecialAction';
  maxLevel: number;
  gridIndex: number;
  needMasteryLevel: number;
  prereq1: { id: number; level: number } | null;
  prereq2: { id: number; level: number } | null;
  cooldown: number;
  resourceCost: number;
  resourceType: string;
  staminaCost: number;
  hpCost: number;
}

export interface WeaponTree {
  weaponKey: string;
  displayName: string;
  nodes: WeaponMasteryNode[];
}

export interface ClassMasteryNode {
  id: number;
  name: string;
  description: string;
  type: 'Active' | 'Passive';
  unlockLevel: number;
  isShared: boolean;
}

export interface ClassTalentData {
  classKey: string;
  displayName: string;
  weapons: WeaponTree[];
  classMastery: ClassMasteryNode[];
}

export const GRID_COLS = 6;
export const GRID_ROWS = 7;

export const CLASS_RESOURCES: Record<string, string> = {
  Swordman: 'Rage',
  Archer: 'Vigor',
  Paladin: 'Mana',
  Sorcerer: 'Mana',
  Berserker: 'Rage',
  Assassin: 'Vigor',
};

`;

output += `export const TALENT_DATA: ClassTalentData[] = ${JSON.stringify(allClassData, null, 2)};\n`;

fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
console.log(`Done! Wrote ${allClassData.length} classes to ${OUTPUT_FILE}`);

// Print summary
for (const cls of allClassData) {
  console.log(`\n${cls.displayName}:`);
  for (const wep of cls.weapons) {
    console.log(`  ${wep.displayName}: ${wep.nodes.length} nodes`);
    const named = wep.nodes.filter(n => n.name && !n.name.startsWith('Unknown'));
    console.log(`    Named: ${named.length}, Unnamed: ${wep.nodes.length - named.length}`);
  }
  console.log(`  Class Mastery: ${cls.classMastery.length} nodes`);
}
