'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  TALENT_DATA,
  CLASS_RESOURCES,
  GRID_COLS,
  type WeaponMasteryNode,
  type ClassTalentData,
  type WeaponTree,
} from '@/data/talent-calculator';

// --- Types ---
type NodeLevels = Record<number, number>; // masteryId -> allocated level

// --- Constants ---
const CLASS_ICONS: Record<string, string> = {
  Swordman: '\u2694\uFE0F',
  Archer: '\uD83C\uDFF9',
  Paladin: '\uD83D\uDEE1\uFE0F',
  Sorcerer: '\uD83D\uDD2E',
  Berserker: '\uD83E\uDE93',
  Assassin: '\uD83D\uDDE1\uFE0F',
};

const TYPE_COLORS: Record<string, string> = {
  Active: 'border-blue-500',
  ActiveEnforce: 'border-purple-500',
  Passive: 'border-green-500',
  PassiveSynergy: 'border-yellow-500',
  SpecialAction: 'border-accent-gold',
};

const TYPE_BG: Record<string, string> = {
  Active: 'bg-blue-500/10',
  ActiveEnforce: 'bg-purple-500/10',
  Passive: 'bg-green-500/10',
  PassiveSynergy: 'bg-yellow-500/10',
  SpecialAction: 'bg-accent-gold/10',
};

const TYPE_GLOW: Record<string, string> = {
  Active: 'shadow-blue-500/30',
  ActiveEnforce: 'shadow-purple-500/30',
  Passive: 'shadow-green-500/30',
  PassiveSynergy: 'shadow-yellow-500/30',
  SpecialAction: 'shadow-accent-gold/30',
};

const TYPE_LABELS: Record<string, string> = {
  Active: 'Active Skill',
  ActiveEnforce: 'Enhanced Skill',
  Passive: 'Passive',
  PassiveSynergy: 'Synergy Passive',
  SpecialAction: 'Special Action',
};

// --- Helper functions ---
function canAllocate(
  node: WeaponMasteryNode,
  levels: NodeLevels,
  weaponNodes: WeaponMasteryNode[],
): boolean {
  if (node.maxLevel === 0) return false;
  const current = levels[node.id] || 0;
  if (current >= node.maxLevel) return false;

  // Check mastery level requirement (total points spent in this weapon tree)
  const totalSpent = weaponNodes.reduce((sum, n) => sum + (levels[n.id] || 0), 0);
  if (totalSpent < node.needMasteryLevel) return false;

  // Check prerequisites
  if (node.prereq1) {
    const prereqLevel = levels[node.prereq1.id] || 0;
    if (prereqLevel < node.prereq1.level) return false;
  }
  if (node.prereq2) {
    const prereqLevel = levels[node.prereq2.id] || 0;
    if (prereqLevel < node.prereq2.level) return false;
  }

  return true;
}

function isNodeUnlocked(
  node: WeaponMasteryNode,
  levels: NodeLevels,
  weaponNodes: WeaponMasteryNode[],
): boolean {
  if (node.maxLevel === 0) return true; // SpecialAction always shown
  const totalSpent = weaponNodes.reduce((sum, n) => sum + (levels[n.id] || 0), 0);
  if (totalSpent < node.needMasteryLevel) return false;
  if (node.prereq1) {
    const prereqLevel = levels[node.prereq1.id] || 0;
    if (prereqLevel < node.prereq1.level) return false;
  }
  if (node.prereq2) {
    const prereqLevel = levels[node.prereq2.id] || 0;
    if (prereqLevel < node.prereq2.level) return false;
  }
  return true;
}

// --- Components ---

function TalentNode({
  node,
  level,
  unlocked,
  canLevel,
  onAllocate,
  onDeallocate,
  weaponNodes,
  levels,
}: {
  node: WeaponMasteryNode;
  level: number;
  unlocked: boolean;
  canLevel: boolean;
  onAllocate: () => void;
  onDeallocate: () => void;
  weaponNodes: WeaponMasteryNode[];
  levels: NodeLevels;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isMaxed = level >= node.maxLevel;
  const isSpecial = node.type === 'SpecialAction';
  const hasPoints = level > 0;

  const borderColor = hasPoints
    ? isMaxed
      ? 'border-accent-gold'
      : TYPE_COLORS[node.type]
    : unlocked
      ? 'border-border-subtle'
      : 'border-border-subtle/40';

  const bgColor = hasPoints ? TYPE_BG[node.type] : 'bg-card-bg/60';
  const textColor = hasPoints
    ? 'text-text-primary'
    : unlocked
      ? 'text-text-muted'
      : 'text-text-muted/40';

  // Find prerequisite names for tooltip
  const prereqNames: string[] = [];
  if (node.prereq1) {
    const p = weaponNodes.find((n) => n.id === node.prereq1!.id);
    if (p) prereqNames.push(`${p.name} Lv${node.prereq1.level}`);
  }
  if (node.prereq2) {
    const p = weaponNodes.find((n) => n.id === node.prereq2!.id);
    if (p) prereqNames.push(`${p.name} Lv${node.prereq2.level}`);
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={(e) => {
          if (e.shiftKey || e.button === 2) {
            onDeallocate();
          } else {
            if (canLevel) onAllocate();
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          onDeallocate();
        }}
        disabled={isSpecial && node.maxLevel === 0}
        className={`
          w-full aspect-square rounded-lg border-2 ${borderColor} ${bgColor}
          flex flex-col items-center justify-center gap-0.5 p-1
          transition-all duration-200 cursor-pointer
          ${canLevel ? 'hover:brightness-125 hover:shadow-lg ' + TYPE_GLOW[node.type] : ''}
          ${hasPoints && isMaxed ? 'shadow-md shadow-accent-gold/20' : ''}
          ${!unlocked && !hasPoints ? 'opacity-40' : ''}
          disabled:cursor-default
        `}
      >
        {/* Type indicator dot */}
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            node.type === 'Active' || node.type === 'ActiveEnforce'
              ? 'bg-blue-400'
              : node.type === 'SpecialAction'
                ? 'bg-accent-gold'
                : 'bg-green-400'
          }`}
        />

        {/* Name */}
        <span
          className={`text-[10px] sm:text-xs leading-tight text-center font-medium ${textColor} line-clamp-2`}
        >
          {node.name}
        </span>

        {/* Level indicator */}
        {node.maxLevel > 0 && (
          <span
            className={`text-[10px] font-bold ${
              isMaxed ? 'text-accent-gold' : hasPoints ? 'text-accent-gold-light' : 'text-text-muted/60'
            }`}
          >
            {level}/{node.maxLevel}
          </span>
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 sm:w-72 pointer-events-none">
          <div className="bg-deep-night border border-border-subtle rounded-lg p-3 shadow-xl text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-heading text-accent-gold font-semibold text-sm">
                {node.name}
              </span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${TYPE_BG[node.type]} ${
                  TYPE_COLORS[node.type].replace('border-', 'text-')
                }`}
              >
                {TYPE_LABELS[node.type]}
              </span>
            </div>

            {node.maxLevel > 0 && (
              <div className="text-xs text-text-muted mb-2">
                Level: {level}/{node.maxLevel}
              </div>
            )}

            {node.description && (
              <p className="text-text-secondary text-xs leading-relaxed mb-2">
                {node.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 text-xs text-text-muted">
              {node.cooldown > 0 && (
                <span>CD: {node.cooldown}s</span>
              )}
              {node.resourceCost > 0 && (
                <span>Cost: {node.resourceCost}</span>
              )}
              {node.staminaCost > 0 && (
                <span>Stamina: {node.staminaCost}</span>
              )}
              {node.hpCost > 0 && (
                <span>HP: {node.hpCost}%</span>
              )}
            </div>

            {node.needMasteryLevel > 0 && (
              <div className="text-xs text-text-muted mt-1">
                Requires: Mastery Level {node.needMasteryLevel}
              </div>
            )}

            {prereqNames.length > 0 && (
              <div className="text-xs text-text-muted mt-1">
                Prerequisites: {prereqNames.join(', ')}
              </div>
            )}

            {node.maxLevel > 0 && (
              <div className="text-xs text-text-muted/60 mt-2 border-t border-border-subtle pt-1">
                Left-click to add, Right-click to remove
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function WeaponTreeGrid({
  weapon,
  levels,
  onAllocate,
  onDeallocate,
}: {
  weapon: WeaponTree;
  levels: NodeLevels;
  onAllocate: (nodeId: number) => void;
  onDeallocate: (nodeId: number) => void;
}) {
  // Build grid: 7 rows x 6 cols
  const grid: (WeaponMasteryNode | null)[][] = Array.from({ length: 7 }, () =>
    Array(GRID_COLS).fill(null),
  );

  for (const node of weapon.nodes) {
    const row = Math.floor(node.gridIndex / GRID_COLS);
    const col = node.gridIndex % GRID_COLS;
    if (row < 7 && col < GRID_COLS) {
      grid[row][col] = node;
    }
  }

  // Calculate total points spent
  const totalSpent = weapon.nodes.reduce(
    (sum, n) => sum + (levels[n.id] || 0),
    0,
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-lg text-accent-gold">
          {weapon.displayName}
        </h3>
        <span className="text-sm text-text-muted">
          Points: <span className="text-accent-gold-light font-semibold">{totalSpent}</span>
        </span>
      </div>

      {/* Mastery level bar */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-text-muted">Mastery Level</span>
          <span className="text-xs text-accent-gold-light font-semibold">{totalSpent}</span>
        </div>
        <div className="h-1.5 bg-dark-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-gold-dim to-accent-gold rounded-full transition-all duration-300"
            style={{ width: `${Math.min((totalSpent / 35) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Skill tree grid */}
      <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
        {grid.map((row, ri) =>
          row.map((node, ci) =>
            node ? (
              <TalentNode
                key={node.id}
                node={node}
                level={levels[node.id] || 0}
                unlocked={isNodeUnlocked(node, levels, weapon.nodes)}
                canLevel={canAllocate(node, levels, weapon.nodes)}
                onAllocate={() => onAllocate(node.id)}
                onDeallocate={() => onDeallocate(node.id)}
                weaponNodes={weapon.nodes}
                levels={levels}
              />
            ) : (
              <div key={`empty-${ri}-${ci}`} className="aspect-square" />
            ),
          ),
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 text-[10px] sm:text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-400" /> Active
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-400" /> Enhanced
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400" /> Passive
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-400" /> Synergy
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-accent-gold" /> Special
        </span>
      </div>
    </div>
  );
}

function ClassMasterySection({
  classData,
  selectedMastery,
  onToggle,
}: {
  classData: ClassTalentData;
  selectedMastery: Set<number>;
  onToggle: (id: number) => void;
}) {
  const tiers = [
    { level: 10, label: 'Level 10', isShared: false },
    { level: 15, label: 'Level 15', isShared: false },
    { level: 20, label: 'Level 20', isShared: false },
    { level: 25, label: 'Level 25', isShared: true },
    { level: 30, label: 'Level 30', isShared: true },
    { level: 40, label: 'Level 40', isShared: true },
  ];

  return (
    <div>
      <h3 className="font-heading text-lg text-accent-gold mb-4">
        Class Mastery
      </h3>

      <div className="space-y-4">
        {tiers.map(({ level, label, isShared }) => {
          const nodes = classData.classMastery.filter(
            (n) => n.unlockLevel === level && n.isShared === isShared,
          );
          if (nodes.length === 0) return null;

          return (
            <div key={`${level}-${isShared}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  {isShared ? `Shared - ${label}` : label}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isShared
                      ? 'bg-purple-500/10 text-purple-400'
                      : 'bg-accent-gold/10 text-accent-gold'
                  }`}
                >
                  {nodes[0].type}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {nodes.map((node) => {
                  const selected = selectedMastery.has(node.id);
                  return (
                    <button
                      key={node.id}
                      onClick={() => onToggle(node.id)}
                      className={`
                        p-2.5 rounded-lg border-2 text-left transition-all duration-200
                        ${
                          selected
                            ? 'border-accent-gold bg-accent-gold/10 shadow-md shadow-accent-gold/10'
                            : 'border-border-subtle bg-card-bg/60 hover:border-border-subtle hover:brightness-110'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs sm:text-sm font-medium ${
                            selected ? 'text-accent-gold' : 'text-text-primary'
                          }`}
                        >
                          {node.name}
                        </span>
                        <span
                          className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                            selected
                              ? 'border-accent-gold bg-accent-gold'
                              : 'border-text-muted/40'
                          }`}
                        >
                          {selected && (
                            <svg className="w-2 h-2 text-void-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                      </div>
                      {node.description && (
                        <p className="text-[10px] sm:text-xs text-text-muted leading-relaxed line-clamp-3">
                          {node.description}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Main Component ---
export default function TalentCalculator() {
  const [selectedClass, setSelectedClass] = useState(0);
  const [selectedWeapon, setSelectedWeapon] = useState(0);
  const [nodeLevels, setNodeLevels] = useState<NodeLevels>({});
  const [selectedMastery, setSelectedMastery] = useState<Set<number>>(
    new Set(),
  );

  const classData = TALENT_DATA[selectedClass];
  const weaponData = classData.weapons[selectedWeapon];
  const resourceName = CLASS_RESOURCES[classData.classKey];

  const handleAllocate = useCallback(
    (nodeId: number) => {
      const node = weaponData.nodes.find((n) => n.id === nodeId);
      if (!node) return;
      if (!canAllocate(node, nodeLevels, weaponData.nodes)) return;

      setNodeLevels((prev) => ({
        ...prev,
        [nodeId]: (prev[nodeId] || 0) + 1,
      }));
    },
    [weaponData, nodeLevels],
  );

  const handleDeallocate = useCallback(
    (nodeId: number) => {
      const current = nodeLevels[nodeId] || 0;
      if (current <= 0) return;

      // Check if removing this would break any allocated dependent nodes
      const newLevels = { ...nodeLevels, [nodeId]: current - 1 };
      const wouldBreak = weaponData.nodes.some((n) => {
        const nLevel = newLevels[n.id] || 0;
        if (nLevel <= 0) return false;
        // Check if this node's prereqs are still met
        if (n.prereq1 && n.prereq1.id === nodeId) {
          if (current - 1 < n.prereq1.level) return true;
        }
        if (n.prereq2 && n.prereq2.id === nodeId) {
          if (current - 1 < n.prereq2.level) return true;
        }
        return false;
      });

      if (wouldBreak) return;

      setNodeLevels((prev) => ({
        ...prev,
        [nodeId]: current - 1,
      }));
    },
    [weaponData, nodeLevels],
  );

  const handleToggleMastery = useCallback((id: number) => {
    setSelectedMastery((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setNodeLevels({});
    setSelectedMastery(new Set());
  }, []);

  const handleResetWeapon = useCallback(() => {
    const weaponIds = new Set(weaponData.nodes.map((n) => n.id));
    setNodeLevels((prev) => {
      const next: NodeLevels = {};
      for (const [k, v] of Object.entries(prev)) {
        if (!weaponIds.has(Number(k))) next[Number(k)] = v;
      }
      return next;
    });
  }, [weaponData]);

  // Summary stats
  const totalWeaponPoints = useMemo(() => {
    return classData.weapons.reduce(
      (sum, wep) =>
        sum + wep.nodes.reduce((s, n) => s + (nodeLevels[n.id] || 0), 0),
      0,
    );
  }, [classData, nodeLevels]);

  const currentWeaponPoints = useMemo(() => {
    return weaponData.nodes.reduce(
      (sum, n) => sum + (nodeLevels[n.id] || 0),
      0,
    );
  }, [weaponData, nodeLevels]);

  return (
    <div className="space-y-6">
      {/* Class Selector */}
      <div className="flex flex-wrap gap-2">
        {TALENT_DATA.map((cls, i) => (
          <button
            key={cls.classKey}
            onClick={() => {
              setSelectedClass(i);
              setSelectedWeapon(0);
            }}
            className={`
              px-4 py-2.5 rounded-lg border-2 font-heading text-sm sm:text-base transition-all duration-200
              ${
                i === selectedClass
                  ? 'border-accent-gold bg-accent-gold/15 text-accent-gold shadow-md shadow-accent-gold/10'
                  : 'border-border-subtle bg-card-bg text-text-muted hover:border-accent-gold-dim hover:text-text-primary'
              }
            `}
          >
            <span className="mr-1.5">{CLASS_ICONS[cls.classKey]}</span>
            {cls.displayName}
          </button>
        ))}
      </div>

      {/* Weapon Tabs + Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {classData.weapons.map((wep, i) => (
            <button
              key={wep.weaponKey}
              onClick={() => setSelectedWeapon(i)}
              className={`
                px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                ${
                  i === selectedWeapon
                    ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/40'
                    : 'bg-card-bg text-text-muted border border-border-subtle hover:text-text-primary'
                }
              `}
            >
              {wep.displayName}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleResetWeapon}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-card-bg text-text-muted border border-border-subtle hover:border-accent-red/40 hover:text-accent-red transition-colors"
          >
            Reset Weapon
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-card-bg text-text-muted border border-border-subtle hover:border-accent-red/40 hover:text-accent-red transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="flex flex-wrap gap-4 p-3 bg-card-bg border border-border-subtle rounded-lg text-sm">
        <div>
          <span className="text-text-muted">Class:</span>{' '}
          <span className="text-text-primary font-medium">
            {classData.displayName}
          </span>
        </div>
        <div>
          <span className="text-text-muted">Resource:</span>{' '}
          <span className="text-accent-gold-light font-medium">
            {resourceName}
          </span>
        </div>
        <div>
          <span className="text-text-muted">Current Weapon:</span>{' '}
          <span className="text-text-primary font-medium">
            {currentWeaponPoints} pts
          </span>
        </div>
        <div>
          <span className="text-text-muted">Total Weapon:</span>{' '}
          <span className="text-text-primary font-medium">
            {totalWeaponPoints} pts
          </span>
        </div>
        <div>
          <span className="text-text-muted">Class Mastery:</span>{' '}
          <span className="text-text-primary font-medium">
            {selectedMastery.size} selected
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weapon Tree - takes 2 cols */}
        <div className="lg:col-span-2 bg-card-bg border border-border-subtle rounded-lg p-4 sm:p-6">
          <WeaponTreeGrid
            weapon={weaponData}
            levels={nodeLevels}
            onAllocate={handleAllocate}
            onDeallocate={handleDeallocate}
          />
        </div>

        {/* Class Mastery Sidebar */}
        <div className="bg-card-bg border border-border-subtle rounded-lg p-4 sm:p-6 max-h-[800px] overflow-y-auto">
          <ClassMasterySection
            classData={classData}
            selectedMastery={selectedMastery}
            onToggle={handleToggleMastery}
          />
        </div>
      </div>

      {/* Build Summary - Allocated Skills */}
      <div className="bg-card-bg border border-border-subtle rounded-lg p-4 sm:p-6">
        <h3 className="font-heading text-lg text-accent-gold mb-4">
          Build Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classData.weapons.map((wep) => {
            const allocatedNodes = wep.nodes.filter(
              (n) => (nodeLevels[n.id] || 0) > 0,
            );
            const wepTotal = wep.nodes.reduce(
              (s, n) => s + (nodeLevels[n.id] || 0),
              0,
            );

            return (
              <div key={wep.weaponKey}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-heading text-text-primary">
                    {wep.displayName}
                  </span>
                  <span className="text-xs text-accent-gold-light">
                    {wepTotal} pts
                  </span>
                </div>
                {allocatedNodes.length === 0 ? (
                  <p className="text-xs text-text-muted">No points allocated</p>
                ) : (
                  <div className="space-y-1">
                    {allocatedNodes.map((n) => (
                      <div
                        key={n.id}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-text-secondary">{n.name}</span>
                        <span className="text-text-muted">
                          {nodeLevels[n.id]}/{n.maxLevel}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected class mastery */}
        {selectedMastery.size > 0 && (
          <div className="mt-4 pt-4 border-t border-border-subtle">
            <span className="text-sm font-heading text-text-primary mb-2 block">
              Class Mastery
            </span>
            <div className="space-y-1">
              {classData.classMastery
                .filter((n) => selectedMastery.has(n.id))
                .map((n) => (
                  <div key={n.id} className="flex items-center gap-2 text-xs">
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        n.type === 'Active'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-green-500/10 text-green-400'
                      }`}
                    >
                      {n.type}
                    </span>
                    <span className="text-text-secondary">{n.name}</span>
                    <span className="text-text-muted">Lv{n.unlockLevel}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
