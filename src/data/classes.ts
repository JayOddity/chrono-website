export interface GameClass {
  slug: string;
  name: string;
  role: string;
  weapons: string[];
  description: string;
  lore: string;
  gradient: string;
  images: [string, string];
}

export const classes: GameClass[] = [
  {
    slug: 'assassin',
    name: 'Assassin',
    role: 'Burst DPS / Stealth',
    weapons: ['Wrist Blades', 'Musket'],
    description:
      'Swift, deadly practitioners of stealth combat. Their swift approach is difficult even for trained eyes to follow. They employ muskets and wrist blades for precision strikes against targets.',
    lore: 'Whatever their target sees before their life fades away, it won\'t be the Assassin. For those deemed enemies of these assassins, it\'s only a matter of time before they meet their end. Their accuracy with a musket is as sharp as their blade skills.',
    gradient: 'from-purple-900/40 to-void-black',
    images: ['/images/classes/assassin-1.avif', '/images/classes/assassin-2.avif'],
  },
  {
    slug: 'berserker',
    name: 'Berserker',
    role: 'Melee DPS / Bruiser',
    weapons: ['Greatsword', 'Dual Axes'],
    description:
      'Rage-fueled warriors charging into battle with overwhelming force. Fearlessly charging into battle with raw power and relentless attacks that leave enemies trembling.',
    lore: 'Their boundless rage knows no limits. They rely on boundless aggression and raw power in direct combat, making them a dangerous opponent in any scenario.',
    gradient: 'from-red-900/40 to-void-black',
    images: ['/images/classes/berserker-1.avif', '/images/classes/berserker-2.avif'],
  },
  {
    slug: 'paladin',
    name: 'Paladin',
    role: 'Tank / Support',
    weapons: ['Mace', 'Lance'],
    description:
      'Holy warriors balancing protection with divine combat power. Wielding a mace or lance imbued with holy powers, their weapons are more formidable than those of ordinary warriors.',
    lore: 'They protect allies while dealing formidable damage. Their battlefield presence offers sanctuary or divine punishment depending on whether you stand with them or against them.',
    gradient: 'from-yellow-900/40 to-void-black',
    images: ['/images/classes/paladin-1.avif', '/images/classes/paladin-2.avif'],
  },
  {
    slug: 'ranger',
    name: 'Ranger',
    role: 'Ranged DPS / Mobility',
    weapons: ['Bow', 'Rapier'],
    description:
      'Ranged specialists excelling in bow combat and mobility. Their mastery of bows and long-range combat is impeccable. They also wield rapiers for close-range encounters.',
    lore: 'Combining speed with devastating range attacks, Rangers eliminate threats before opponents can close distance. Their quick reaction times and range superiority make them lethal at any distance.',
    gradient: 'from-green-900/40 to-void-black',
    images: ['/images/classes/ranger-1.avif', '/images/classes/ranger-2.avif'],
  },
  {
    slug: 'sorcerer',
    name: 'Sorcerer',
    role: 'Ranged DPS / Crowd Control',
    weapons: ['Staff', 'Tome'],
    description:
      'Magical scholars commanding powerful spells. They possess immense knowledge of magical powers and can employ tactical abilities like vanishing and freezing opponents mid-combat.',
    lore: 'Just when you think you\'ve caught them, they\'ll vanish before your eyes and you might find yourself frozen on the spot\u2014literally. They specialise in magical attacks and crowd control.',
    gradient: 'from-blue-900/40 to-void-black',
    images: ['/images/classes/sorcerer-1.avif', '/images/classes/sorcerer-2.avif'],
  },
  {
    slug: 'swordsman',
    name: 'Swordsman',
    role: 'Melee DPS / Tank',
    weapons: ['Longsword', 'Shield & Sword'],
    description:
      'Versatile frontline fighters and defensive anchors. They can freely wield different types of swords and excel in close combat, adapting between aggressive and defensive roles.',
    lore: 'Fighting at the vanguard, they halt enemy hordes and adapt from fierce warriors to sturdy walls as needed. A dependable presence on any battlefield.',
    gradient: 'from-orange-900/40 to-void-black',
    images: ['/images/classes/swordsman-1.avif', '/images/classes/swordsman-2.avif'],
  },
];

export function getClassBySlug(slug: string): GameClass | undefined {
  return classes.find((c) => c.slug === slug);
}
