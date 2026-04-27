export interface Faction {
  name: string;
  tagline: string;
  description: string;
  colour: string;
}

export const factions: Faction[] = [
  {
    name: 'The Guardians',
    tagline: 'Those who protect Setera under the guidance of "The Great Ones."',
    description:
      'Greater beings that oversee all of Setera, consisting of otherworldly entities summoned by "The Great Ones" after their worlds were destroyed. They view the World Movers as threats requiring elimination.',
    colour: 'text-yellow-400',
  },
  {
    name: 'The Void',
    tagline: 'Otherworldly invaders that reject the existence of life itself.',
    description:
      'This faction embodies nothingness and the cruel abyss, aiming for complete world destruction. Though nearly immortal, Setera\u2019s rejection of their existence limits their power they\u2019re growing stronger.',
    colour: 'text-purple-400',
  },
  {
    name: 'The Broken',
    tagline: 'Those whose bodies and minds have succumbed to Void contamination.',
    description:
      'World Movers whose bodies succumbed to Void contamination. The instability causes physical breakdown, leaving victims neither alive nor dead, causing them to attack indiscriminately to restore lost energy.',
    colour: 'text-red-400',
  },
  {
    name: 'The Outcasts',
    tagline: 'Those who are all the more threatening for their humanity.',
    description:
      'An organised band of exiled World Movers who work together based on their hostility towards the World Movers. They excel at disguise and deception, posing a fundamentally different threat through manipulation and scams rather than direct combat.',
    colour: 'text-orange-400',
  },
  {
    name: 'The World Movers',
    tagline: 'Those who had the strength to survive and lay roots in Setera.',
    description:
      'Refugees from destroyed worlds who reached Setera through extraordinary strength or luck. They\u2019re organised into three competing factions, each pursuing survival and prosperity while vying for influence and resources.',
    colour: 'text-emerald-400',
  },
];
