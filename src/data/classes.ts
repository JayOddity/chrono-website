export interface ClassWeapon {
  name: string;
  tagline: string;
  description: string;
}

export interface BuildDirection {
  name: string;
  description: string;
}

export interface MasterySkill {
  name: string;
  type: 'Active' | 'Passive';
  unlockLevel: number;
}

export interface GameClass {
  slug: string;
  name: string;
  role: string;
  resource: string;
  resourceDescription: string;
  description: string;
  overview: string;
  weapons: ClassWeapon[];
  buildDirections: BuildDirection[];
  classMastery?: MasterySkill[];
  lore: string;
  gradient: string;
  image: string;
}

export const classes: GameClass[] = [
  {
    slug: 'assassin',
    name: 'Assassin',
    role: 'Burst DPS / Stealth',
    resource: 'Vigor + Bloodlust',
    resourceDescription:
      'Vigor is your main fuel spent on skills, regenerates on its own. Bloodlust is a separate meter that fills up as you fight, capped at 3 stacks, and spent on your biggest hits.',
    description:
      'Swift, deadly practitioners of stealth combat. Their approach is difficult even for trained eyes to follow.',
    overview:
      "The Assassin is a glass cannon hunter. You're not here to trade blows you're here to pick a target, disappear, reappear behind them, and do enough damage in a few seconds that the fight is basically over before they've turned around. If that burst misses or gets answered, you're fragile, so the whole class is built around picking the right moment and vanishing when things go wrong.\n\nEach of the three weapons gives you a different way to open and finish a fight, and the real fun is swapping between them mid combo. A typical fight: open from stealth with Wrist Blades, then swap to Sabre to bleed the target. If they survive, the Musket finishes them off from range. You're not locked into any one weapon you carry all three and switch on the fly.",
    weapons: [
      {
        name: 'Wrist Blades',
        tagline: 'the stealth weapon',
        description:
          'Short range knives that lean hardest into the fantasy of being an assassin. The special move is actual stealth you disappear, reposition, and your next attack hits harder. Most of the kit is about ambushing, poisoning, and slipping away. This is your "I pick when the fight starts" weapon.',
      },
      {
        name: 'Sabre',
        tagline: 'the bleed weapon',
        description:
          'A curved sword for people who want to stand in melee range a little longer. Instead of one shot burst, Sabre stacks bleeds on the target that keep ticking while you keep hitting. Your damage ramps up the longer the target stays bleeding, so this is the weapon that rewards you for committing to the fight rather than disengaging.',
      },
      {
        name: 'Musket',
        tagline: 'the ranged weapon',
        description:
          "A slow, heavy hitting firearm for when you'd rather pick people off from a distance. Lower damage per second than the melee weapons, but you're safe, you can kite, and you've got tools like smoke bombs and traps to control space. This is the \"clean up from range\" weapon, or the one you pull out when a fight goes sideways and you need to reset.",
      },
    ],
    buildDirections: [
      {
        name: 'Stealth picker',
        description:
          'Lean into Wrist Blades ambushes, use Musket for follow up, Sabre mostly as a panic button in melee.',
      },
      {
        name: 'Bleed duellist',
        description:
          'Commit to Sabre in melee, use Wrist Blades to reposition, Musket for enemies out of reach.',
      },
      {
        name: 'Ranged skirmisher',
        description:
          'Musket as the main weapon, Wrist Blades for emergency escapes, Sabre barely touched.',
      },
      {
        name: 'Hybrid swapper',
        description:
          'No single main weapon; build around swapping constantly to keep cooldowns rolling on all three.',
      },
    ],
    classMastery: [
      { name: 'Master of Torment', type: 'Passive', unlockLevel: 10 },
      { name: 'Rising Malice', type: 'Passive', unlockLevel: 10 },
      { name: 'Bloodshadow Pool', type: 'Active', unlockLevel: 15 },
      { name: 'Shadow Image', type: 'Active', unlockLevel: 15 },
      { name: 'Cunning Theft', type: 'Active', unlockLevel: 15 },
      { name: 'Aerialist', type: 'Passive', unlockLevel: 20 },
      { name: 'Cutthroat', type: 'Passive', unlockLevel: 20 },
    ],
    lore: "Whatever their target sees before their life fades away, it won't be the Assassin. For those deemed enemies of these assassins, it's only a matter of time before they meet their end. Their accuracy with a musket is as sharp as their blade skills.",
    gradient: 'from-purple-900/40 to-void-black',
    image: '/images/classes/assassin.webp',
  },
  {
    slug: 'berserker',
    name: 'Berserker',
    role: 'Melee DPS / Bruiser',
    resource: 'Rage',
    resourceDescription:
      'Rage starts empty, builds up as you deal and take damage, and bleeds away when you stop fighting. If you want to use your big hit abilities, you have to stay in combat and keep swinging.',
    description:
      'Rage fueled warriors charging into battle with overwhelming force. Fearlessly charging into battle with raw power and relentless attacks that leave enemies trembling.',
    overview:
      "The Berserker is the class for players who want the fight ugly and up close. Where the Assassin picks one target and vanishes, the Berserker picks the whole room and doesn't leave. You're built to take hits and dish them back harder the longer you're in the fight. The resource enforces this: you can't nuke someone from full you have to earn your big moves by grinding through the opening exchanges.\n\nAll three weapons keep you in melee, but each one tunes how aggressive vs. durable you are. The Berserker doesn't really have a \"safe range\" option. Swapping weapons isn't about repositioning; it's about picking which kind of melee you want this moment.",
    weapons: [
      {
        name: 'Chain Swords',
        tagline: 'the cleave weapon',
        description:
          'Paired blades on chains that let you hit multiple enemies with wide swings and give you a bit of extra reach. There\u2019s a cold/ice theme running through the kit (several of the skills chill enemies), so this is your "crowd control while dealing damage" weapon. Good for clearing groups and keeping enemies debuffed.',
      },
      {
        name: 'Hatchets',
        tagline: 'the dual wield fury weapon',
        description:
          'Two hand axes for single target fury. This is the weapon you pull out when you want to melt one priority target fast. Its special move literally puts you into a "berserk" state more damage, more speed, less self preservation. It\u2019s the most aggressive of the three and the most punishing if you mistime it.',
      },
      {
        name: 'Battle Axe',
        tagline: 'the heavy weapon',
        description:
          'A giant two hander. Slower swings, bigger numbers, and more passive tools to keep you alive (guard, balance, stance abilities). If Hatchets are the "I want to delete someone" weapon, Battle Axe is the "I want to anchor the fight and not fall over" weapon. A decent pick for players who like Berserker\u2019s damage but don\u2019t love how squishy the other two can feel.',
      },
    ],
    buildDirections: [
      {
        name: 'Pure rage tank',
        description:
          'Battle Axe main, lean into durability passives, shrug off damage while you grind a boss down.',
      },
      {
        name: 'Single target deleter',
        description:
          'Hatchets main, stack damage passives, use Chain Swords or Battle Axe to stay alive between big windows.',
      },
      {
        name: 'Crowd controller',
        description:
          'Chain Swords main, use the chill/freeze synergies to lock down groups, swap weapons for finishers.',
      },
      {
        name: 'Frontline swapper',
        description:
          'No single main weapon; rotate all three to keep Rage ticking and skills off cooldown.',
      },
    ],
    classMastery: [
      { name: "Warrior's Spirit", type: 'Passive', unlockLevel: 10 },
      { name: 'Raging Storm', type: 'Passive', unlockLevel: 10 },
      { name: 'Avatar', type: 'Active', unlockLevel: 15 },
      { name: 'Quaking Impact', type: 'Active', unlockLevel: 15 },
      { name: 'Explosive Rage', type: 'Active', unlockLevel: 15 },
      { name: 'Crimson Frenzy', type: 'Passive', unlockLevel: 20 },
      { name: 'Dominating Presence', type: 'Passive', unlockLevel: 20 },
    ],
    lore: 'Their boundless rage knows no limits. They rely on boundless aggression and raw power in direct combat, making them a dangerous opponent in any scenario.',
    gradient: 'from-red-900/40 to-void-black',
    image: '/images/classes/berserker.webp',
  },
  {
    slug: 'paladin',
    name: 'Paladin',
    role: 'Tank / Support',
    resource: 'Mana',
    resourceDescription:
      "Mana starts full and regenerates steadily. Unlike Rage, you don't have to earn it; it just caps your spell density. Plan your cooldowns so you're not dry at a bad moment.",
    description:
      'Holy warriors balancing protection with divine combat power. Wielding a lance, halberd or mace imbued with holy powers, their weapons are more formidable than those of ordinary warriors.',
    overview:
      'The Paladin is the "I want to be useful to my group, not just hit things" class. You can solo on one they hit hard and don\u2019t die easily but the real identity is being the person who keeps a party alive. Damage, protection, and healing are all on the table, and which one you lean into is mostly a question of which weapon you pick.\n\nThe Paladin\u2019s weapons are less about range and more about what job you\u2019re doing today. Tanking the boss? Different weapon to healing the group. The class still has weapon swapping, but you\u2019re less likely to cycle all three mid fight than a Berserker or Assassin would. You pick your role, then commit.',
    weapons: [
      {
        name: 'Lance',
        tagline: 'the protector weapon',
        description:
          'One handed spear with a shield. Your special move literally puts up a guard. The passives are all about stepping in front of things holding the line, punishing enemies that hit you, keeping allies safe. This is the tank weapon. If you want to be the person the group hides behind, this is your pick.',
      },
      {
        name: 'Halberd',
        tagline: 'the damage weapon',
        description:
          "Two handed polearm. Lots of reach, lightning themed damage, and none of the shield tools. This is the \"I'm a holy warrior and I'm here to hit things\" weapon. You trade the safety of the Lance for real damage output. Good for solo play or when your group already has a tank.",
      },
      {
        name: 'Mace',
        tagline: 'the support weapon',
        description:
          "Mace and shield, built around auras persistent effects that buff your group or debuff enemies while they're near you. Includes actual healing. This is the closest thing the game has to a dedicated support/healer, and it's probably the most group focused weapon in the whole class roster. If you want to be the one keeping people alive without being a full healer archetype, this is it.",
      },
    ],
    buildDirections: [
      {
        name: 'Tank anchor',
        description:
          'Lance main, maximum durability, focus on holding aggro and surviving.',
      },
      {
        name: 'Holy smiter',
        description:
          'Halberd main, damage passives, basically play as a heavy hitting melee DPS with a bit of self heal.',
      },
      {
        name: 'Aura healer',
        description:
          'Mace main, stack support passives, buff your group and patch them up.',
      },
      {
        name: 'Hybrid',
        description:
          'Split between Lance (defense) and Mace (auras) to be a flexible off tank / off healer.',
      },
    ],
    classMastery: [
      { name: 'Brand of Denial', type: 'Passive', unlockLevel: 10 },
      { name: 'Blessing of Restoration', type: 'Passive', unlockLevel: 10 },
      { name: 'Divine Wrath', type: 'Active', unlockLevel: 15 },
      { name: 'Sacred Shield', type: 'Active', unlockLevel: 15 },
      { name: 'Judgment', type: 'Active', unlockLevel: 15 },
      { name: 'Unbreakable Resolve', type: 'Passive', unlockLevel: 20 },
      { name: 'Ritual of Exorcism', type: 'Passive', unlockLevel: 20 },
    ],
    lore: 'They protect allies while dealing formidable damage. Their battlefield presence offers sanctuary or divine punishment depending on whether you stand with them or against them.',
    gradient: 'from-yellow-900/40 to-void-black',
    image: '/images/classes/paladin.webp',
  },
  {
    slug: 'ranger',
    name: 'Ranger',
    role: 'Ranged DPS / Mobility',
    resource: 'Vigor + Arrows',
    resourceDescription:
      'Vigor starts full and regenerates quickly, spent on skills. On top of that, the Longbow uses Arrows: a small pool (5) that regenerates slowly. Most shots are free; your heaviest shots eat Arrows, so you can\u2019t just spam them.',
    description:
      'Ranged specialists excelling in bow combat and mobility. Their mastery of bows, crossbows and long range combat is impeccable. They also wield rapiers for close range encounters.',
    overview:
      "The Ranger is the kite class. You deal your damage from a distance, you move constantly, and you ideally never let anything touch you. Out of the six classes, this is the one that punishes enemies most for being slow or predictable. You're not fragile because you're weak you're fragile because you're not supposed to be where the attacks are landing.\n\nUnusually, the Ranger\u2019s weapons range from \"very long range\" all the way down to \"actual melee\" and the class is designed around the idea that if someone does close on you, you don\u2019t panic, you swap weapons and deal with it. This makes them more flexible than a typical ranged class.",
    weapons: [
      {
        name: 'Longbow',
        tagline: 'the precision weapon',
        description:
          'Classic long range bow. Slower than the crossbows but hits harder per shot, with the most reach and utility (curved shots, volleys, retreat shots). This is the "sniper" weapon pick off priority targets, control space with arrow showers, keep your distance. The Arrow resource matters most here.',
      },
      {
        name: 'Crossbows',
        tagline: 'the fast skirmisher weapon',
        description:
          'Paired crossbows for rapid fire and mobility. Shorter range than the bow, but faster, with poison and trap tools baked in. This is the weapon for players who want to strafe, pepper, and stay in motion rather than line up clean shots. Better for dodgy, up tempo fights.',
      },
      {
        name: 'Rapier',
        tagline: 'the close range weapon',
        description:
          "A melee thrusting sword for when things get inside your range. It's not meant to be your main weapon it's the tool you pull out when a melee target has closed on you and you need to duel them for a few seconds before re opening the gap. Packs counterattacks, evasion, and poison to buy you time.",
      },
    ],
    buildDirections: [
      {
        name: 'Longbow sniper',
        description:
          'Max range, big single shots, Rapier only as a panic button.',
      },
      {
        name: 'Crossbow skirmisher',
        description:
          'Fast firing, poison stacks, constantly moving.',
      },
      {
        name: 'Dueller',
        description:
          'Rapier focused, use the bows to set up the engage and finish in melee.',
      },
      {
        name: 'All range hybrid',
        description:
          'Swap freely to keep pressure at every distance, build around cooldown reduction and mobility.',
      },
    ],
    classMastery: [
      { name: 'Nimble Stride', type: 'Passive', unlockLevel: 10 },
      { name: 'Windwalker', type: 'Passive', unlockLevel: 10 },
      { name: 'Windstep Strike', type: 'Active', unlockLevel: 15 },
      { name: 'Wind Dance', type: 'Active', unlockLevel: 15 },
      { name: 'Verdant Snare', type: 'Active', unlockLevel: 15 },
      { name: 'Fruit of Perseverance', type: 'Passive', unlockLevel: 20 },
      { name: 'Evasive Gale', type: 'Passive', unlockLevel: 20 },
    ],
    lore: 'Combining speed with devastating range attacks, Rangers eliminate threats before opponents can close distance. Their quick reaction times and range superiority make them lethal at any distance.',
    gradient: 'from-green-900/40 to-void-black',
    image: '/images/classes/ranger.webp',
  },
  {
    slug: 'sorcerer',
    name: 'Sorcerer',
    role: 'Ranged DPS / Crowd Control / Support',
    resource: 'Mana',
    resourceDescription:
      "Mana is the same as the Paladin's: full on start, regenerates over time. Big spells cost big mana, so you're managing a budget.",
    description:
      "Magical scholars commanding powerful spells. They possess immense knowledge of magical powers and can employ tactical abilities like vanishing and freezing opponents mid combat.",
    overview:
      "The Sorcerer is the spellcaster class, and unusually for an MMO it covers all three of the classic caster roles depending on which weapon you're holding. One weapon is the \"burn everything to the ground\" nuker, one is the \"lock down the enemy\" controller, and one is the \"keep the party alive\" healer. The class identity is flexibility you're playing a different role depending on your main weapon.\n\nCommon to all three: you're squishy, you want distance, and your damage comes from landing your big spells, not from raw auto attacks.",
    weapons: [
      {
        name: 'Staff',
        tagline: 'the elemental nuker weapon',
        description:
          'Fire and ice damage, big AoE spells, heavy hits. This is the glass cannon weapon the special move is literally called "Glass Cannon". Fireballs, meteors, ice shards, area freezes. If you want to see huge damage numbers and don\u2019t mind being made of paper, this is the pick.',
      },
      {
        name: 'Magic Orb',
        tagline: 'the arcane control weapon',
        description:
          "More about debuffs, gravity wells, darkness circles, and breaking up enemy positioning than raw damage. You're not the one deleting the boss you're the one making sure the boss can't move, can't hit straight, and gets punished for existing. Great in group content where a controller is more valuable than another DPS.",
      },
      {
        name: 'Spellbook',
        tagline: 'the support/healer weapon',
        description:
          'Healing waves, blessings, protective barriers, sanctuaries. This is the closest thing to a traditional healer in the game. You can still deal damage, but the core fantasy is buffing and patching up your group. Pairs naturally with a Paladin tank.',
      },
    ],
    buildDirections: [
      {
        name: 'Elemental nuker',
        description:
          'Staff main, max damage, ignore support tools.',
      },
      {
        name: 'Controller',
        description:
          'Magic Orb main, stack CC and debuffs, play to enable your team.',
      },
      {
        name: 'Healer',
        description:
          'Spellbook main, stack healing and barrier passives, babysit the party.',
      },
      {
        name: 'Battlemage hybrid',
        description:
          'Split between Staff and Magic Orb, do damage with control mixed in, Spellbook as emergency heal.',
      },
    ],
    classMastery: [
      { name: 'Arcanic Brand', type: 'Passive', unlockLevel: 10 },
      { name: 'Balance of Power', type: 'Passive', unlockLevel: 10 },
      { name: 'Arcane Elemental', type: 'Active', unlockLevel: 15 },
      { name: 'Circle of Inversion', type: 'Active', unlockLevel: 15 },
      { name: 'Ice Block', type: 'Active', unlockLevel: 15 },
      { name: 'Unnamed Passive (TBC)', type: 'Passive', unlockLevel: 20 },
      { name: 'Unnamed Passive (TBC)', type: 'Passive', unlockLevel: 20 },
    ],
    lore: "Just when you think you've caught them, they'll vanish before your eyes and you might find yourself frozen on the spot literally. They specialise in magical attacks and crowd control.",
    gradient: 'from-blue-900/40 to-void-black',
    image: '/images/classes/sorcerer.webp',
  },
  {
    slug: 'swordsman',
    name: 'Swordsman',
    role: 'Melee DPS / Off tank',
    resource: 'Rage',
    resourceDescription:
      'Rage works the same as the Berserker\u2019s: starts empty, builds up as you fight, decays out of combat. The more aggressive you are, the more resource you have for your big moves.',
    description:
      'Versatile frontline fighters and defensive anchors. They can freely wield different types of swords and excel in close combat, adapting between aggressive and defensive roles.',
    overview:
      "Swordsman is the \"generalist melee\" class. If Berserker is reckless aggression and Paladin is holy defence, Swordsman sits comfortably in the middle: competent damage, competent survivability, no special tricks. It's the class to pick when you want straightforward sword and shield gameplay without the Berserker's fragility or the Paladin's party support expectations.\n\nAll three weapons are bladed and all three are melee, but they\u2019re tuned across the defence to damage spectrum. Swordsman players tend to pick one and stick with it more than, say, an Assassin would weapon swapping here is often for ability chaining rather than a full role swap.",
    weapons: [
      {
        name: 'Longsword',
        tagline: 'the sword and shield weapon',
        description:
          "One handed sword with a shield. The special move is an actual Block. Passives are about staying upright, punishing attackers, and holding ground. This is the off tank weapon you won't main tank like a Paladin, but you can survive a lot of pressure while still outputting real damage. The \"solid, dependable\" pick.",
      },
      {
        name: 'Dual Swords',
        tagline: 'the fast attacker weapon',
        description:
          "Twin blades, fast combos, counterattacks, lots of movement. No shield, but you've got evasion and deflect tools. This is the duellist weapon get in, land a flurry, weave around the counter, repeat. Rewards good reads on enemy attacks rather than raw stat trading.",
      },
      {
        name: 'Greatsword',
        tagline: 'the heavy hitter weapon',
        description:
          'Giant two hander. Slow, wide swings, and the biggest damage numbers the class has. Lots of passives around breaking armour and finishing off weakened enemies. This is the "I want to crush things" weapon. Similar in feel to Berserker\u2019s Battle Axe but with more finesse baked in.',
      },
    ],
    buildDirections: [
      {
        name: 'Sword and board off tank',
        description:
          'Longsword main, defensive passives, sit next to the real tank and eat damage.',
      },
      {
        name: 'Dueller',
        description:
          'Dual Swords main, counter heavy, evade focused, melee DPS with footwork.',
      },
      {
        name: 'Greatsword smasher',
        description:
          'Greatsword main, max damage, finish wounded enemy synergies.',
      },
      {
        name: 'Swap combo bruiser',
        description:
          'Rotate between all three to chain skills across weapons and keep Rage flowing.',
      },
    ],
    classMastery: [
      { name: 'Decimate', type: 'Passive', unlockLevel: 10 },
      { name: "Guardian's Shield", type: 'Passive', unlockLevel: 10 },
      { name: 'War Cry', type: 'Active', unlockLevel: 15 },
      { name: 'Absolute Defense', type: 'Active', unlockLevel: 15 },
      { name: 'Unyielding Will', type: 'Active', unlockLevel: 15 },
      { name: 'Fervor', type: 'Passive', unlockLevel: 20 },
      { name: 'Last Stand', type: 'Passive', unlockLevel: 20 },
    ],
    lore: 'Fighting at the vanguard, they halt enemy hordes and adapt from fierce warriors to sturdy walls as needed. A dependable presence on any battlefield.',
    gradient: 'from-orange-900/40 to-void-black',
    image: '/images/classes/swordsman.webp',
  },
];

export function getClassBySlug(slug: string): GameClass | undefined {
  return classes.find((c) => c.slug === slug);
}
