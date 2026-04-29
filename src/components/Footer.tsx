import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  siteName: string;
}

const footerLinks = [
  {
    title: 'Classes',
    links: [
      { name: 'All Classes', href: '/classes' },
      { name: 'Assassin', href: '/classes/assassin' },
      { name: 'Berserker', href: '/classes/berserker' },
      { name: 'Paladin', href: '/classes/paladin' },
      { name: 'Ranger', href: '/classes/ranger' },
      { name: 'Sorcerer', href: '/classes/sorcerer' },
      { name: 'Swordsman', href: '/classes/swordsman' },
    ],
  },
  {
    title: 'Features',
    links: [
      { name: 'Combat', href: '/features/combat' },
      { name: 'Professions', href: '/features/professions' },
      { name: 'Gameplay', href: '/features/gameplay' },
      { name: 'PvP', href: '/features/pvp' },
      { name: 'PvE', href: '/features/pve' },
    ],
  },
  {
    title: 'Database',
    links: [
      { name: 'All Items', href: '/database' },
      { name: 'Weapons', href: '/database?category=Weapon' },
      { name: 'Armor', href: '/database?category=Armor' },
      { name: 'Consumables', href: '/database?category=Consumable' },
      { name: 'Materials', href: '/database?category=Material' },
    ],
  },
  {
    title: 'World',
    links: [
      { name: 'Lore', href: '/world/lore' },
      { name: 'Enemies', href: '/world/enemies' },
      { name: 'Release Date', href: '/release-date' },
      { name: 'FAQ', href: '/faq' },
      { name: 'System Requirements', href: '/faq#system-requirements' },
    ],
  },
  {
    title: 'External',
    links: [
      { name: 'Steam Page', href: 'https://store.steampowered.com/app/2873440/Chrono_Odyssey/', external: true as const },
      { name: 'Official Site', href: 'https://chronoodyssey.kakaogames.com/', external: true as const },
    ],
  },
];

export default function Footer({ siteName }: FooterProps) {
  return (
    <footer className="bg-deep-night border-t border-border-subtle mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-heading text-accent-gold text-sm mb-3">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.name}>
                    {'external' in link ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-text-muted hover:text-accent-gold transition-colors"
                      >
                        {link.name} ↗
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-text-muted hover:text-accent-gold transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="diamond-divider mb-8">
          <span className="diamond" />
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt={`${siteName} logo`}
              width={20}
              height={20}
              className="w-5 h-5 object-contain"
            />
            <span>{siteName} Fan Site</span>
          </div>
          <p className="text-center">
            This is an independent fan project. Not affiliated with Chrono Odyssey Studios or Kakao Games.
          </p>
          <p>Chrono Odyssey &copy; Chrono Odyssey Studios / Kakao Games</p>
        </div>
      </div>
    </footer>
  );
}
