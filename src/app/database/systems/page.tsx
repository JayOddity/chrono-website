import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Item Systems - Chronotector',
  description: 'Perks, gems, and reinforcement mechanics for Chrono Odyssey gear.',
};

const perkSummary = {
  unique: 84,
  uniqueText: 698,
  common: 213,
  commonText: 156,
  special: 38,
  perkText: 304,
};

const gemSummary = {
  options: 87,
  textEntries: 270,
  uniqueGems: 216,
  examples: ['Fire Weapon', 'Ice Weapon', 'Nature Weapon', 'Lightning Weapon', 'Light Weapon', 'Dark Weapon'],
};

const reinforceSummary = {
  weaponMax: 15,
  armorMax: 15,
  bonusReinforceLevel: 5,
  bonusEffect: 'Adds an extra Common Perk slot at +5',
};

export default function ItemSystemsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <section className="pt-8 pb-4">
        <Link href="/database" className="text-sm text-accent-gold-dim hover:text-accent-gold transition-colors mb-4 inline-block">
          &larr; Item Database
        </Link>
        <h1 className="font-heading text-4xl text-accent-gold mb-4">Item Systems</h1>
        <p className="text-text-secondary max-w-3xl">
          The mechanics that turn raw gear into endgame builds. Perks roll on the item itself, gems socket into them, and reinforcement raises the base power. All numbers below are extracted from the closed beta data and may shift before launch.
        </p>
        <div className="diamond-divider mt-6">
          <span className="diamond" />
        </div>
      </section>

      {/* Perks */}
      <section className="py-8">
        <h2 className="font-heading text-2xl text-accent-gold mb-3">Perks</h2>
        <p className="text-text-secondary leading-relaxed max-w-3xl mb-6">
          Three flavours of perks roll on equipment. Common Perks are the bread and butter stat lines (regen, attack, defence). Special Perks are rarer effects with rolling probabilities. Unique Perks are signature item powers tied to specific high end gear, often unlocking a passive ability.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <PerkCard title="Common Perks" count={perkSummary.common} note="Stat line perks (regen, atk, def)" />
          <PerkCard title="Special Perks" count={perkSummary.special} note="Rarer rolled effects with probability gates" />
          <PerkCard title="Unique Perks" count={perkSummary.unique} note="Signature powers tied to specific items" />
        </div>
        <p className="text-text-muted text-xs mt-3">
          {perkSummary.perkText} perk descriptions, {perkSummary.uniqueText} unique perk descriptions, and {perkSummary.commonText} common perk descriptions are present in the localisation tables.
        </p>
      </section>

      {/* Gems */}
      <section className="py-8">
        <h2 className="font-heading text-2xl text-accent-gold mb-3">Gems</h2>
        <p className="text-text-secondary leading-relaxed max-w-3xl mb-6">
          Gems slot into gear sockets to add elemental damage, resistance, or specialised effects. Each gem comes in multiple levels (typically Lv. 1 4), and gems read against the equipment type they were designed for a Weapon gem only socketses into a weapon.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Stat label="Gem Options" value={gemSummary.options} />
          <Stat label="Unique Gems" value={gemSummary.uniqueGems} />
          <Stat label="Text Entries" value={gemSummary.textEntries} />
          <Stat label="Element Variants" value={gemSummary.examples.length} />
        </div>
        <div>
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Elemental weapon gems</h3>
          <div className="flex flex-wrap gap-2">
            {gemSummary.examples.map((g) => (
              <span key={g} className="text-sm px-3 py-1 bg-card-bg border border-border-subtle rounded text-text-secondary">
                {g}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Reinforce */}
      <section className="py-8">
        <h2 className="font-heading text-2xl text-accent-gold mb-3">Reinforcement</h2>
        <p className="text-text-secondary leading-relaxed max-w-3xl mb-6">
          Reinforcement raises an item&rsquo;s effective level. Both weapons and armor cap at +{reinforceSummary.weaponMax}, with material and gold costs scaling steeply at higher tiers. Crossing certain reinforce thresholds unlocks bonus effects on the item.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Stat label="Weapon Cap" value={`+${reinforceSummary.weaponMax}`} />
          <Stat label="Armor Cap" value={`+${reinforceSummary.armorMax}`} />
          <Stat label="Bonus Threshold" value={`+${reinforceSummary.bonusReinforceLevel}`} />
        </div>
        <p className="text-text-muted text-xs mt-4">{reinforceSummary.bonusEffect}.</p>
      </section>
    </div>
  );
}

function PerkCard({ title, count, note }: { title: string; count: number; note: string }) {
  return (
    <div className="bg-card-bg border border-border-subtle rounded-lg p-5">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-heading text-lg text-accent-gold">{title}</h3>
        <span className="text-2xl font-heading text-text-primary">{count}</span>
      </div>
      <p className="text-text-muted text-sm">{note}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-card-bg border border-border-subtle rounded-lg p-4 text-center">
      <div className="font-heading text-2xl text-accent-gold">{value}</div>
      <div className="text-xs text-text-muted uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}
