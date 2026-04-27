// POI types + re-exports. The actual arrays live in JSON files under
// src/data/map-pois/ — Turbopack parses JSON cheaply, so pulling the giant
// MONSTER_POIS / PROP_POIS arrays out of this TS module avoids the heavy
// single-line AST that used to trigger dev-server memory restarts.

import warpData from './map-pois/warp-pois.json';
import respawnData from './map-pois/respawn-pois.json';
import returnData from './map-pois/return-pois.json';
import sectionData from './map-pois/section-labels.json';
import monsterData from './map-pois/monster-pois.json';
import heroData from './map-pois/hero-pois.json';
import neighborData from './map-pois/neighbor-pois.json';
import propData from './map-pois/prop-pois.json';

export interface WarpPoi { id: number; name: string; type: 'warp' | 'boundStone'; cost: number; sectionId: number; x: number; y: number; }
export interface RespawnPoi { id: number; name: string; regionId: number; x: number; y: number; }
export interface ReturnPoi { id: number; name: string; type: string; x: number; y: number; }
export interface SectionLabel { id: number; name: string; regionId: number; minLevel: number; maxLevel: number; isPvP: boolean; x: number; y: number; }
export interface MonsterPoi { monsterId: number; name: string; grade: string; subType: string; x: number; y: number; spawnCount: number; }
export interface HeroPoi { id: number; name: string; x: number; y: number; radius: number; faction: string; regionId: number; }
export interface NeighborPoi { characterId: number; name: string | null; x: number; y: number; regionId: number; }
export interface PropPoi { propId: number; propGroupId: number; category: string; title: string | null; level: number; x: number; y: number; regionId: number; }

export const WARP_POIS = warpData as WarpPoi[];
export const RESPAWN_POIS = respawnData as RespawnPoi[];
export const RETURN_POIS = returnData as ReturnPoi[];
export const SECTION_LABELS = sectionData as SectionLabel[];
export const MONSTER_POIS = monsterData as MonsterPoi[];
export const HERO_POIS = heroData as HeroPoi[];
export const NEIGHBOR_POIS = neighborData as NeighborPoi[];
export const PROP_POIS = propData as PropPoi[];
