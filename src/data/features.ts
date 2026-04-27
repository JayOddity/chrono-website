export interface PageImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface FeatureSection {
  heading: string;
  body: string;
  image?: PageImage;
  fullWidth?: boolean;
}

export interface SubPage {
  slug: string;
  name: string;
  tagline: string;
  sections: FeatureSection[];
  heroImage?: PageImage;
  overviewImage?: PageImage;
  gallery?: PageImage[];
  featuredCrafted?: { profession: string; items: { id: number; name: string; grade: string }[] }[];
  suffixExamples?: { name: string; stat: string }[];
  externalSources?: { label: string; url: string }[];
}

export interface Feature {
  slug: string;
  name: string;
  tagline: string;
  sections: FeatureSection[];
  heroImage?: PageImage;
  gallery?: PageImage[];
  video?: { youtubeId: string; title: string };
  professions?: { name: string; type: 'Gathering' | 'Crafting'; recipeCount?: number; maxLevel: number; tool?: string }[];
  suffixExamples?: { name: string; stat: string }[];
  pvpTerritories?: { name: string; recommendedLevels: string }[];
  siegeCamps?: { tier: number; cost: number; weaponLimit: number }[];
  wantedSystem?: { totalBounties: number; bountyLevels: string; rankLevels: number; topRankBonus: string };
  featuredCrafted?: { profession: string; items: { id: number; name: string; grade: string }[] }[];
  externalSources?: { label: string; url: string }[];
  subPages?: SubPage[];
}

export const features: Feature[] = [
  {
    slug: 'combat',
    name: 'Combat',
    tagline: 'Action based combat with crisp animations and responsive controls.',
    sections: [
      {
        heading: 'Action Combat',
        body: 'Chrono Odyssey features action based combat with real time player engagement. The developers drew inspiration from titles known for impactful melee to create a dark, oppressive world blending horror with sci fi aesthetics. Intentional freeze frame effects on hits emphasise every impact.',
        image: {
          src: '/images/features/combat/hit-feedback.avif',
          alt: 'Sorcerer mid strike against a fallen enemy with a glowing spear',
          caption: 'Post CBT hit reactions make every impact visibly register. Source: Developer\u2019s Notes #4 (Jan 2026).',
        },
      },
      {
        heading: 'Weapon Swapping',
        body: 'Six classes, each with three weapons. Swap between them mid combat with Q on a 0.25s cooldown. Each weapon has eight abilities and four can be active at once. This replaces traditional tank/healer/DPS archetypes with role flexibility driven by weapon choice.',
        image: {
          src: '/images/features/combat/weapon-swapping.avif',
          alt: 'Two players engaging in combat at a waterfall, one with a spear and the other with sword and shield',
          caption: 'Different classes and weapon loadouts at a glance. Source: Steam store screenshots.',
        },
      },
      {
        heading: 'Responsive Controls',
        body: 'Combat emphasises crisp animations and responsive controls. Every ability is designed to feel weighty and satisfying, rewarding skilled play and precise timing.',
        image: {
          src: '/images/features/combat/responsive-controls.avif',
          alt: 'Character sprinting through a dungeon corridor after a jump',
          caption: 'Control responsiveness overhaul: instant sprint input, no post jump roll. Source: Developer\u2019s Notes #4 (Jan 2026).',
        },
      },
      {
        heading: 'Free Movement',
        body: 'Movement used to lock to the camera, so turning the character meant turning the view. Post CBT, movement and camera are separate. Attacks and skills fire in the direction the character is facing, not where the camera points, so you can strafe around a boss or back away while reading its pattern. Strafe running while locked on opens side steps out of AOEs and flanking on linear attacks.',
        image: {
          src: '/images/features/combat/free-movement.avif',
          alt: 'Player strafing around a boss while locked on, greatsword drawn',
          caption: 'Lock on sprint in action. Source: Developer\u2019s Notes #4 (Jan 2026).',
        },
      },
    ],
    gallery: [
      {
        src: '/images/features/combat/wound-zone.avif',
        alt: 'Before and after comparison showing the new wound zone damage indicator on the ground',
        caption: 'Wound zones added post CBT: hits now leave a visible area marker on the ground. Source: Developer\u2019s Notes #4 (Jan 2026).',
      },
      {
        src: '/images/features/combat/duel-system.avif',
        alt: 'Before and after comparison showing the new player duel system with a countdown timer',
        caption: 'Duel system added post CBT: players can challenge nearby players with a timed countdown. Source: Developer\u2019s Notes #4 (Jan 2026).',
      },
    ],
    video: {
      youtubeId: '-WXL9rhEFwM',
      title: 'Combat Update Overview',
    },
    externalSources: [
      { label: 'Developer\u2019s Notes #4 \u2014 Steam (Jan 2026)', url: 'https://steamcommunity.com/games/2873440/announcements/detail/1823191198601082' },
      { label: 'Developer\u2019s Notes #2 Part 2 \u2014 Steam (Jul 2025)', url: 'https://steamcommunity.com/games/2873440/announcements/detail/1806698490633870' },
    ],
  },
  {
    slug: 'professions',
    name: 'Professions',
    tagline: 'Eleven professions split between gathering raw materials and crafting finished goods.',
    heroImage: {
      src: '/images/professions/life-mastery-overview.webp',
      alt: 'Life Mastery menu showing the six Crafting lines and five Life Skills',
      caption: 'The Life Mastery panel as it appears in game. Crafting holds the six production lines; Life Skills holds the five gathering lines.',
    },
    sections: [],
    professions: [
      { name: 'Weapon Crafting', type: 'Crafting', maxLevel: 10, recipeCount: 438 },
      { name: 'Armor Crafting', type: 'Crafting', maxLevel: 10, recipeCount: 310 },
      { name: 'Processing', type: 'Crafting', maxLevel: 10, recipeCount: 76 },
      { name: 'Cooking', type: 'Crafting', maxLevel: 10, recipeCount: 47 },
      { name: 'Alchemy', type: 'Crafting', maxLevel: 10, recipeCount: 43 },
      { name: 'Accessory Crafting', type: 'Crafting', maxLevel: 10, recipeCount: 12 },
      { name: 'Gathering', type: 'Gathering', maxLevel: 10, tool: 'Sickle' },
      { name: 'Logging', type: 'Gathering', maxLevel: 10, tool: 'Axe' },
      { name: 'Mining', type: 'Gathering', maxLevel: 10, tool: 'Pickaxe' },
      { name: 'Butchering', type: 'Gathering', maxLevel: 10, tool: 'Butcher Knife' },
      { name: 'Fishing', type: 'Gathering', maxLevel: 10, tool: 'Fishing Pole' },
    ],
    subPages: [
      {
        slug: 'crafting',
        name: 'Crafting',
        tagline: 'The six crafting lines. Weapon Crafting, Armor Crafting, Accessory Crafting, Alchemy, Cooking, and Processing turn raw materials into everything you wear, wield, eat, or drink.',
        overviewImage: {
          src: '/images/professions/weapon-crafting-ui.webp',
          alt: 'Weapon Crafting menu with the six class tabs',
        },
        sections: [
          {
            heading: 'Weapon Crafting',
            body: "Easily the biggest crafting line. The bench shows tabs for all six classes and all three weapons per class, so any Weapon Crafter can produce anything from a Crude Battle Axe to a Legendary Aegis. Recipes aren't tied to the class you play, so a high level crafter can sit in town and churn gear for an alt. Watch the tab you're on when crafting for yourself: a Swordsman can't swing a crossbow, so picking the wrong tab just gives you a weapon you can't use.",
            image: {
              src: '/images/professions/weapon-crafting-ui.webp',
              alt: 'Weapon Crafting menu with the six class tabs and a Crude Greatsword detail view',
              caption: 'Weapon Crafting. One tab per class, and each weapon type sits under its class.',
            },
          },
          {
            heading: 'Armor Crafting',
            body: "Six slots all told: head, chest, hands, legs, feet, and a Back slot for cloaks. Armor splits into three weight classes: Light, Medium, Heavy. Light leans into offensive stats (crit rate, damage), Heavy into defence, Medium sits in the middle. Armor is not class locked, so a Ranger can craft and wear a Heavy chestpiece if they want the defensive stats. From Uncommon and up, crafted pieces can also roll a jewel socket and two perk types: a transferable Prefix (orange text, can be moved to another item at the Transfer Attributes bench) and a General Attribute (permanent, smaller).",
            image: {
              src: '/images/professions/armor-crafting-ui.webp',
              alt: 'Armor Crafting menu showing the six slot tabs and a Herbalist Tunic recipe',
              caption: 'Armor Crafting. Slots run Head, Chest, Hands, Legs, Feet, Back across the top.',
            },
          },
          {
            heading: 'Accessory Crafting',
            body: "The tight corner of the crafting catalogue. Three slot tabs (Waist, Neck, Finger), a short recipe list, and a heavy lean on rare reagents. You wear one belt, one necklace, and two rings. Where Weapon and Armor Crafting run on iron, Accessory Crafting mostly runs on silver and other specialist metals, so a jeweller's gathering priorities skew away from a smith's. Accessories don't push raw power the way a weapon does, but they pack a lot of stats into a small item.",
            image: {
              src: '/images/professions/accessory-crafting-ui.webp',
              alt: 'Accessory Crafting menu showing the Waist, Neck, and Finger slot tabs with a Sturdy Belt recipe',
              caption: 'Accessory Crafting. Three slot tabs: Waist, Neck, Finger. You wear two rings at once.',
            },
          },
          {
            heading: 'Alchemy',
            body: "Alchemy is the potion half of the catalogue. Potion crafting is a two step process. First you convert herbs into a Solvent Reagent; then you combine Solvent with a berry or similar reagent to produce the finished potion. Six potion lines run across Health, Mana, Carnage, Attack, Defence, and Battle, with higher tiers unlocking from Uncommon and up. Every recipe has its own cooldown on the detail panel, so high grade potions can't be chained inside a single fight. Beta observation: potion consumption outran crafting supply, so a dedicated alchemist may be a strong market play.",
            image: {
              src: '/images/professions/alchemy-ui.webp',
              alt: 'Alchemy crafting menu with the Uncommon Health Potion recipe and the full potion list visible',
              caption: 'Alchemy. Potion lines: Health, Mana, Carnage, Attack, Defence, Battle, plus Solvent Reagents at each grade.',
            },
          },
          {
            heading: 'Cooking',
            body: "The menu splits into Food, Drink, and Feast tabs. Food and Drink each grant one player a timed buff (some give straight HP recovery, some give regen, some give stat boosts: Nectar of Fortification recovers HP and grants +1 Strength, Dexterity, Intellect, and Wisdom for 30 minutes). Feasts didn't appear in the June CBT menu, so their buff scope is unconfirmed. Cooking ingredients route in from Butchering meat drops and Fishing catches, plus a separate world pickup layer (oranges, lemons, berry bushes you can interact with directly) that doesn't require the Gathering profession at all.",
            image: {
              src: '/images/professions/cooking-ui.webp',
              alt: 'Cooking crafting menu showing the Food tab with a Hearty Pottage recipe and six food recipes in the list',
              caption: 'Cooking. Three tabs: Food, Drink, Feast. Each meal lists its ingredients and the buff it grants on the detail panel.',
            },
          },
          {
            heading: 'Processing',
            body: "The middle of the supply chain, and the bench that makes gathering tools as well as refined materials. Six tabs across the top: Tool (craft new sickles, pickaxes, axes, butcher knives, fishing poles, campfires), Resource (intermediate crafting inputs like oil and polishing grit), Mining (ore into Ingots), Logging (wood into Lumber), Gathering (plant fibres into Linen or Cotton Cloth), Butchering (hides into Leather). Nearly every Uncommon and higher material in the game passes through here before a weapon or armor recipe can consume it.",
            image: {
              src: '/images/professions/processing-ui.webp',
              alt: 'Processing menu showing the Logging tab with a Processed Lumber recipe and the full lumber ladder',
              caption: 'Processing, Logging tab. Lumber grades run Firewood, Processed Lumber, Sturdy Lumber, Red Lumber, Arche Lumber.',
            },
          },
          {
            heading: 'Enhancement and salvage',
            body: "Two NPCs in Dawn Slope, the starter settlement, handle the upkeep side of crafting. Richter takes a piece of gear you already own and enhances it. Tilda breaks gear down and refunds part of its materials. Kakao hasn't written up how either one actually works yet, so most of the detail online came out of the June CBT and should be read as beta impressions until an official systems note lands.",
          },
        ],
        featuredCrafted: [
          {
            profession: 'Weapon Crafting',
            items: [
              { id: 11123101, name: 'Crude Battle Axe', grade: 'Common' },
              { id: 11121203, name: 'Beastly Chain Blades', grade: 'Uncommon' },
              { id: 11506203, name: 'Ancestral Bow', grade: 'Epic' },
              { id: 11118508, name: 'Aegis', grade: 'Legendary' },
            ],
          },
          {
            profession: 'Armor Crafting',
            items: [
              { id: 11277101, name: 'Crude Cloak', grade: 'Common' },
              { id: 11253201, name: 'Angler Gloves', grade: 'Uncommon' },
              { id: 11672203, name: 'Ancestral Armor', grade: 'Epic' },
              { id: 11273503, name: 'Arbiter Ashen Gauntlets', grade: 'Legendary' },
            ],
          },
          {
            profession: 'Accessory Crafting',
            items: [
              { id: 11382101, name: 'Bronze Necklace', grade: 'Common' },
              { id: 11381201, name: 'Belt of Strength', grade: 'Uncommon' },
              { id: 11382201, name: 'Pearl Necklace', grade: 'Uncommon' },
            ],
          },
          {
            profession: 'Alchemy and Cooking',
            items: [
              { id: 14020211, name: 'Attack Potion', grade: 'Common' },
              { id: 14070321, name: 'Feast - Grilled Steak', grade: 'Uncommon' },
              { id: 14020231, name: 'Advanced Attack Potion', grade: 'Rare' },
              { id: 14020441, name: 'Superior Battle Potion', grade: 'Epic' },
            ],
          },
          {
            profession: 'Processing',
            items: [
              { id: 16030111, name: 'Processed Lumber', grade: 'Common' },
              { id: 16090121, name: 'Iron Ingot', grade: 'Uncommon' },
              { id: 16090231, name: 'Gold Ingot', grade: 'Rare' },
              { id: 16030141, name: 'Arche Lumber', grade: 'Epic' },
              { id: 16090151, name: 'Arche Ingot', grade: 'Legendary' },
            ],
          },
        ],
        suffixExamples: [
          { name: "Warrior's", stat: 'Strength' },
          { name: "Hunter's", stat: 'Dexterity' },
          { name: "Scholar's", stat: 'Intelligence' },
          { name: "Priest's", stat: 'Wisdom' },
          { name: "Protector's", stat: 'Vitality' },
        ],
      },
      {
        slug: 'gathering',
        name: 'Gathering',
        tagline: 'The five Life Skills. Gathering, Logging, Mining, Butchering, and Fishing all feed the crafting economy, and tool grade controls speed rather than access.',
        overviewImage: {
          src: '/images/professions/mining-action.webp',
          alt: 'Character swinging a pickaxe at a glowing ore node',
        },
        sections: [
          {
            heading: 'How nodes work',
            body: "All five life skills share the same interaction pattern. Walk up to a node, press E, wait for the bar to fill. Every successful pull grants two XP rewards at once: profession XP in the life skill you used, and class XP toward your combat level, so gathering doubles as levelling. There are no level gates on the node itself. A level 1 character can start mining an Arche Ingot deposit; the pull just takes five or more minutes. Your profession level and your tool grade both shorten that time, and higher tier tools can also roll small perks (yield and speed effects observed in the CBT).",
            fullWidth: true,
          },
          {
            heading: 'Gathering',
            body: "The sickle line, and confusingly the one that shares its name with the umbrella. You cut herbs and plant fibres out of world nodes. Herbs feed Cooking directly; fibres route through Processing into Linen or Cotton Cloth, which Armor Crafting then picks up for robes and light armor. A few Cooking ingredients (oranges, lemons, berry bushes) sit in the world as direct interactions and skip the sickle entirely.",
            image: {
              src: '/images/professions/gathering-action.webp',
              alt: 'Character crouched in front of a berry bush with a Gather prompt, with a Vitality Potions quest tracking herb counts',
              caption: 'Gathering from a herb bush. Herb quests list exact counts you need to pull.',
            },
          },
          {
            heading: 'Logging',
            body: "The logging axe line. Different tree types produce different wood grades in the CBT: light wood and mature wood at the low end, a blue tinted wood in the middle, and a red wood at the top. Processing refines the raw output into Firewood, Processed Lumber, Sturdy Lumber, Red Lumber, and Arche Lumber. Lumber is called for in weapon and armor recipes at nearly every grade, which makes Logging one of the safer life skills to level if you care about being useful to other crafters.",
            image: {
              src: '/images/professions/logging-action.webp',
              alt: 'Character stood next to a blue barked tree with a Log prompt on screen',
              caption: 'Logging a blue wood tree. Different tree types yield different wood grades.',
            },
          },
          {
            heading: 'Mining',
            body: "The pickaxe line. You break ore deposits into raw chunks, and Processing smelts them up the ingot ladder: Processed Stone, Iron Ingot, Silver Ingot, Gold Ingot, Titanium Ingot, Platinum Ingot, Meteorite Ingot, Arche Ingot. Ingots sit at the core of every metal weapon recipe and every heavy armor piece, which makes Mining the load bearing life skill for anyone chasing melee gear.",
            image: {
              src: '/images/professions/mining-action.webp',
              alt: 'Character swinging a pickaxe at a glowing blue ore node on a cliffside',
              caption: 'Mining a deposit. The glowing blue marker indicates an active ore node.',
            },
          },
          {
            heading: 'Butchering',
            body: "The butcher knife line, and the one life skill without a fixed node on the map. You skin what you just killed, so Butchering folds into combat instead of standing apart from it. The level of the monster you killed controls the hide's rarity, so higher level mobs produce higher grade hides. Hides route through Processing into Thin Leather, Leather, Thick Leather, Sturdy Leather, and Arche Leather; meat drops feed Cooking.",
            image: {
              src: '/images/professions/butchering-action.webp',
              alt: 'Character kneeling over a large feathered creature carcass with a Butcher prompt on screen',
              caption: 'Butchering a downed creature. The node is the corpse itself rather than a fixed spawn.',
            },
          },
          {
            heading: 'Fishing',
            body: "The pole line, and the one life skill with its own mechanic. Press F5 to enter Fishing Mode, then cast: the cast bar controls how far the bobber goes, not what you catch. The bite indicator runs in two phases. When a fish approaches, the icon on the bobber changes to three dots. When the three dots flip to a timer icon, left click to hook. The game reels in the rest by itself, so there's no manual tension mini game. Fishing feeds Cooking almost exclusively, with a small number of catches routing into Alchemy reagents.",
            image: {
              src: '/images/professions/fishing-action.webp',
              alt: 'Character casting a fishing line into a clear lake with Equip Fishing Pole and Fishing Mode prompts on screen',
              caption: 'Fishing at a lakeside node. The tension indicator on the right tracks the catch.',
            },
          },
          {
            heading: 'Tools and camp gear',
            body: "Each life skill uses its own tool, and the five tools all sit on the same Common to Legendary grade ladder as gear. A Basic Fishing Pole catches the same fish an Arche Fishing Pole does; the better tool just works faster. Higher grade tools also roll small perks on top: beta observations point to yield and gathering speed as the two common effects, though the exact perk pool hasn't been documented. You buy the basic versions from a town vendor and craft the rest at a Processing bench. On long runs out of town, Campfire Kits drop a temporary cook and craft point wherever you plant one.",
            image: {
              src: '/images/professions/tool-crafting-ui.webp',
              alt: 'Tool crafting menu showing Sickle, Pickaxe, Logging Axe, Butcher Knife, Fishing Pole, and Campfire tabs',
              caption: 'Tool crafting bench. One tab per gathering tool plus a Campfire tab for camp kits.',
            },
          },
        ],
        featuredCrafted: [
          {
            profession: 'Processing outputs',
            items: [
              { id: 16030111, name: 'Processed Lumber', grade: 'Common' },
              { id: 16090121, name: 'Iron Ingot', grade: 'Uncommon' },
              { id: 16070121, name: 'Leather', grade: 'Uncommon' },
              { id: 16050121, name: 'Linen Cloth', grade: 'Uncommon' },
              { id: 16090231, name: 'Gold Ingot', grade: 'Rare' },
              { id: 16030141, name: 'Arche Lumber', grade: 'Epic' },
              { id: 16090151, name: 'Arche Ingot', grade: 'Legendary' },
            ],
          },
          {
            profession: 'Tools',
            items: [
              { id: 11496101, name: 'Basic Fishing Pole', grade: 'Common' },
              { id: 11494201, name: 'Iron Logging Axe', grade: 'Uncommon' },
              { id: 11495301, name: 'Titanium Butcher Knife', grade: 'Rare' },
              { id: 11494401, name: 'Meteorite Logging Axe', grade: 'Epic' },
              { id: 11495501, name: 'Arche Butcher Knife', grade: 'Legendary' },
            ],
          },
          {
            profession: 'Camp gear',
            items: [
              { id: 11498101, name: 'Simple Campfire Kit', grade: 'Common' },
              { id: 11498201, name: 'Basic Campfire Kit', grade: 'Uncommon' },
              { id: 11498301, name: 'Uncommon Campfire Kit', grade: 'Rare' },
              { id: 11498401, name: 'Advanced Campfire Kit', grade: 'Epic' },
              { id: 11498501, name: 'Superior Campfire Kit', grade: 'Legendary' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'gameplay',
    name: 'Gameplay',
    tagline: 'Solo friendly with deep group content options.',
    sections: [
      {
        heading: 'Action Combat',
        body: 'Real time action combat anchors every encounter. Three weapons per class, Q to swap between two equipped at once, four abilities active per weapon. See the combat page for the full breakdown.',
        image: {
          src: '/images/features/gameplay/action-combat.avif',
          alt: 'Armoured character wielding a greatsword in a sunlit grass field',
          caption: 'Greatsword character mid stance. Source: Steam store screenshots.',
        },
      },
      {
        heading: 'Content Variety',
        body: 'Players can pursue solo challenges including trials, labyrinths, and Chrono Gates. Small group dungeons for 3\u20135 players provide cooperative challenges, while world bosses require larger coordinated groups.',
        image: {
          src: '/images/features/gameplay/content-variety.avif',
          alt: 'Four member party entering a dark dungeon gate with weapons drawn',
          caption: 'Party based content. Source: Steam store screenshots.',
        },
      },
      {
        heading: 'Time Mechanics',
        body: 'The Chronotector artifact enables players to experience the world across different time periods, discovering secrets and treasures hidden throughout Setera\u2019s timeline.',
        image: {
          src: '/images/features/gameplay/time-mechanics.avif',
          alt: 'Armoured knight with polearm facing a winged dragon in the sky',
          caption: 'World encounters scale up to cosmic threats. Source: Steam store screenshots.',
        },
      },
      {
        heading: 'Exploration',
        body: 'Biomes across Setera range from grasslands to snowlands. Time Portals and bounty hunts offer further activities beyond the main story.',
        image: {
          src: '/images/features/gameplay/exploration.avif',
          alt: 'Player on horseback overlooking a sunset plain with a tower and fallen obelisk',
          caption: 'Open world riding at sunset. Source: Steam store screenshots.',
        },
      },
    ],
  },
  {
    slug: 'pvp',
    name: 'PvP',
    tagline: 'Territory sieges, PvE bounties, and small scale skirmishes.',
    sections: [
      {
        heading: 'Territory Sieges',
        body: 'Four open world territories support large scale siege content: First Breath Hill (Lv 1-15), Plains of Promise (Lv 15-30), Iskelon\u2019s Backbone (Lv 25-40), and Shaikan Swamp (Lv 30-45). Each siege features attackers and defenders fighting over a defender base plus three middle objectives (A, B, C). Sides have dedicated spawn points and the contested points use a capture style mechanic. Territory influence caps at 700,000 per region and standing in a territory can rank up to 300.',
      },
      {
        heading: 'Siege Camps',
        body: 'Attackers can purchase siege camps in three tiers, each capping how many siege weapons you can field. Tier 1 starts at 1,000 gold. Camps act as forward staging areas for prolonged siege content.',
      },
      {
        heading: 'Wanted (Bounty Hunting)',
        body: 'A 30 rank PvE bounty hunting career. Fifteen bounty contracts are currently in the data, ranging from rank 1 to 5 in difficulty. Each bounty asks you to kill a specific monster and return proof. Levelling your Wanted rank grants permanent stat bonuses up to +100 attack and +365 max HP at the cap.',
        image: {
          src: '/images/features/pvp/wanted-poster.avif',
          alt: 'In game wanted poster for a bounty target',
          caption: 'In game wanted poster. Source: Developer\u2019s Notes #1 (Apr 2025).',
        },
      },
      {
        heading: 'Small Scale Skirmishes',
        body: 'In addition to the open world sieges, the developers have shown small instanced PvP including a 3v3 arena (originally demonstrated against NPC opponents). The team has explicitly said there will not be realm vs realm warfare; PvP stays opt in and small scale.',
      },
    ],
    pvpTerritories: [
      { name: 'First Breath Hill', recommendedLevels: 'Lv 1 - 15' },
      { name: 'Plains of Promise', recommendedLevels: 'Lv 15 - 30' },
      { name: "Iskelon's Backbone", recommendedLevels: 'Lv 25 - 40' },
      { name: 'Shaikan Swamp', recommendedLevels: 'Lv 30 - 45' },
    ],
    siegeCamps: [
      { tier: 1, cost: 1000, weaponLimit: 6 },
      { tier: 2, cost: 2000, weaponLimit: 8 },
      { tier: 3, cost: 3000, weaponLimit: 10 },
    ],
    wantedSystem: {
      totalBounties: 15,
      bountyLevels: '1 - 5',
      rankLevels: 30,
      topRankBonus: '+100 Attack, +365 Max HP',
    },
  },
  {
    slug: 'pve',
    name: 'PvE',
    tagline: 'A vast world designed primarily for solo and cooperative play.',
    sections: [
      {
        heading: 'Dungeons & Raids',
        body: 'Dungeons scale for groups. Confident players can attempt them solo for greater rewards.',
      },
      {
        heading: 'Solo Friendly Design',
        body: 'The developers have prioritised a rewarding and stress free experience, allowing players to progress at their own pace while offering depth for those seeking group based challenges.',
      },
      {
        heading: 'Exploration & Discovery',
        body: 'The Chronotector lets players visit different time periods of the same region. Setera hides both present day finds and historical ones.',
      },
    ],
  },
];

export function getFeatureBySlug(slug: string): Feature | undefined {
  return features.find((f) => f.slug === slug);
}
