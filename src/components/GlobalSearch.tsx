'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { classes } from '@/data/classes';
import { features } from '@/data/features';
interface SearchResult {
  type: 'class' | 'page';
  name: string;
  description: string;
  href: string;
}

const staticResults: SearchResult[] = [
  ...classes.map((cls) => ({
    type: 'class' as const,
    name: cls.name,
    description: cls.description,
    href: `/classes/${cls.slug}`,
  })),
  ...features.map((f) => ({
    type: 'page' as const,
    name: f.name,
    description: f.tagline.slice(0, 80),
    href: `/features/${f.slug}`,
  })),
  { type: 'page', name: 'All Classes', description: 'Classes', href: '/classes' },
  { type: 'page', name: 'Features', description: 'Features', href: '/features' },
  { type: 'page', name: 'World', description: 'World', href: '/world' },
  { type: 'page', name: 'Lore', description: 'Lore', href: '/world/lore' },
  { type: 'page', name: 'Enemies', description: 'Enemies', href: '/world/enemies' },
  { type: 'page', name: 'Release Date', description: 'Release Date', href: '/release-date' },
  { type: 'page', name: 'System Requirements', description: 'System Requirements', href: '/system-requirements' },
  { type: 'page', name: 'Talent Calculator', description: 'Plan your build with weapon and class mastery trees', href: '/talent-calculator' },
  { type: 'page', name: 'Interactive Map', description: 'Explore Setera with warp points, dungeons, and monster locations', href: '/map' },
];

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Keyboard shortcut
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
      setSelectedIdx(0);
    }
  }, [open]);

  // Search
  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      setSelectedIdx(0);
      return;
    }

    const q = query.toLowerCase();
    const matched = staticResults.filter(
      (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    );

    setResults(matched.slice(0, 15));
    setSelectedIdx(0);
  }, [query]);

  const navigate = useCallback((result: SearchResult) => {
    setOpen(false);
    router.push(result.href);
  }, [router]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIdx]) {
      navigate(results[selectedIdx]);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Search input bar */}
      <div
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 min-w-[320px] bg-dark-surface border rounded-lg text-sm cursor-text transition-colors ${
          open ? 'border-accent-gold-dim' : 'border-border-subtle hover:border-accent-gold-dim'
        }`}
      >
        <svg className="w-4 h-4 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {open ? (
          <input
            ref={inputRef}
            type="text"
            placeholder="Type 3 characters to search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder:text-text-muted"
          />
        ) : (
          <span className="text-text-muted flex-1">Search</span>
        )}
        <kbd className="text-[10px] text-text-muted bg-void-black/50 px-1.5 py-0.5 rounded border border-border-subtle">
          Ctrl+K
        </kbd>
      </div>

      {/* Dropdown results */}
      {open && query.trim().length >= 3 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-deep-night border border-border-subtle rounded-lg shadow-2xl overflow-hidden z-[100]">
          <div className="max-h-80 overflow-y-auto py-1">
            {results.map((result, i) => (
              <button
                key={`${result.href}-${result.name}`}
                onClick={() => navigate(result)}
                onMouseEnter={() => setSelectedIdx(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === selectedIdx ? 'bg-dark-surface' : 'hover:bg-dark-surface/50'
                }`}
              >
                <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">{result.type === 'class' ? '⚔️' : '📄'}</span>
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate">{result.name}</p>
                  <p className="text-xs text-text-muted truncate">{result.description}</p>
                </div>
                <span className="text-[10px] text-text-muted bg-dark-surface px-1.5 py-0.5 rounded capitalize flex-shrink-0">
                  {result.type}
                </span>
              </button>
            ))}
            {results.length === 0 && query.trim().length >= 3 && (
              <p className="px-4 py-6 text-sm text-text-muted text-center">No results found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
