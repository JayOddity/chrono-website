// Chronotector active-ability descriptions transcribed from the official
// Steam developer notes. Cooldown values are from the closed-beta data
// dump and may shift before launch.

export interface ChronotectorAction {
  name: string;
  type: string;
  cooldown: number;
  description: string;
}

export const chronotectorActions: ChronotectorAction[] = [
  {
    name: 'Temporal Isolation',
    type: 'Time Acceleration',
    cooldown: 180,
    description:
      'Halts enemy movement for a set duration. When used while under enemy Temporal Isolation, disables its effects.',
  },
  {
    name: 'Time Reversal',
    type: 'Time Rewind',
    cooldown: 120,
    description: "Reverts the caster's position and HP to their previous state after 10 seconds.",
  },
  {
    name: 'Temporal Resistance',
    type: 'Gravity Control',
    cooldown: 150,
    description:
      'Grants slow fall and aerial gliding. Does not prevent fall damage after the effect ends.',
  },
  {
    name: 'Summon',
    type: 'Monster Summon',
    cooldown: 300,
    description:
      'Summons a specter that fights alongside you for a set duration, vanishing after unleashing a powerful skill.',
  },
  {
    name: 'Temporal Tuning',
    type: 'Manipulation',
    cooldown: 10,
    description:
      'Releases a shockwave that reveals traces of the past, including specific objects and footprints.',
  },
];
