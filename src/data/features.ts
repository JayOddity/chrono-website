export interface Feature {
  slug: string;
  name: string;
  tagline: string;
  sections: { heading: string; body: string }[];
}

export const features: Feature[] = [
  {
    slug: 'combat',
    name: 'Combat',
    tagline: 'Action-based combat with crisp animations and responsive controls.',
    sections: [
      {
        heading: 'Action Combat',
        body: 'Chrono Odyssey features action-based combat with real-time player engagement. The developers drew inspiration from titles known for impactful melee to create a dark, oppressive world blending horror with sci-fi aesthetics. Intentional freeze-frame effects on hits emphasise every impact.',
      },
      {
        heading: 'Weapon Swapping',
        body: 'Rather than traditional tank/healer/DPS archetypes, the game features six classes that can equip two weapons and swap between them mid-combat. This design allows flexible role adaptation without rigid restrictions.',
      },
      {
        heading: 'Responsive Controls',
        body: 'Combat emphasises crisp animations and responsive controls. Every ability is designed to feel weighty and satisfying, rewarding skilled play and precise timing.',
      },
    ],
  },
  {
    slug: 'crafting-professions',
    name: 'Crafting & Professions',
    tagline: 'Gather, craft, and contribute to the player economy.',
    sections: [
      {
        heading: 'Gathering',
        body: 'Players can engage in harvesting, logging, mining, and skinning across the diverse biomes of Setera. Resources gathered fuel the crafting system and player economy.',
      },
      {
        heading: 'Crafting',
        body: 'Collected resources enable crafting of equipment and consumables necessary for difficult encounters. The system supports progression and allows players to specialise in their chosen professions.',
      },
      {
        heading: 'Player Economy',
        body: 'Crafting mechanics support community collaboration and a player-driven economy, encouraging trade and cooperation between adventurers.',
      },
    ],
  },
  {
    slug: 'gameplay',
    name: 'Gameplay',
    tagline: 'Solo-friendly with deep group content options.',
    sections: [
      {
        heading: 'Content Variety',
        body: 'Players can pursue solo challenges including trials, labyrinths, and Chrono Gates. Small-group dungeons for 3\u20135 players provide cooperative challenges, while world bosses require larger coordinated groups.',
      },
      {
        heading: 'Time Mechanics',
        body: 'The Chronotector artifact enables players to experience the world across different time periods, discovering secrets and treasures hidden throughout Setera\u2019s timeline.',
      },
      {
        heading: 'Exploration',
        body: 'Traverse diverse biomes\u2014grasslands, swamps, and snowlands\u2014within the world of Setera. Time Portals and bounty hunts offer further activities beyond the main story.',
      },
    ],
  },
  {
    slug: 'pvp',
    name: 'PvP',
    tagline: 'Optional, stress-free player-versus-player content.',
    sections: [
      {
        heading: 'Small-Scale Combat',
        body: 'The developers confirmed no large-scale PvP or realm warfare. Instead, PvP takes the form of small, instanced skirmishes or world-triggered hybrid events, with a demonstrated 3v3 arena mode featuring NPC opponents.',
      },
      {
        heading: 'Optional Participation',
        body: 'PvP is designed to remain stress-free rather than central to gameplay. Players can engage in structured arenas and smaller-scale battlegrounds without affecting the broader open-world experience.',
      },
      {
        heading: 'Rewards',
        body: 'Participation yields unique rewards such as exclusive cosmetics, resources, or reputation boosts, incentivising engagement while keeping it entirely optional.',
      },
    ],
  },
  {
    slug: 'pve',
    name: 'PvE',
    tagline: 'A vast world designed primarily for solo and cooperative play.',
    sections: [
      {
        heading: 'Dungeons & Raids',
        body: 'Challenging dungeons and epic raids with formidable bosses await. Confident players can even attempt these encounters solo for greater rewards.',
      },
      {
        heading: 'Solo-Friendly Design',
        body: 'The developers have prioritised a rewarding and stress-free experience, allowing players to progress at their own pace while offering depth for those seeking group-based challenges.',
      },
      {
        heading: 'Exploration & Discovery',
        body: 'Traverse diverse biomes within Setera. The Chronotector artifact enables players to experience the world across different time periods, discovering secrets and treasures throughout the timeline.',
      },
    ],
  },
];

export function getFeatureBySlug(slug: string): Feature | undefined {
  return features.find((f) => f.slug === slug);
}
