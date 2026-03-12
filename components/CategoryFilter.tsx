'use client';

import { useState } from 'react';
import type { NewsCategory } from '@/lib/types';

const categories: (NewsCategory | 'All')[] = [
  'All',
  'Model Release',
  'Tool Launch',
  'Research',
  'Open Source',
  'SAP AI',
  'Industry',
  'Framework',
];

const categoryColors: Record<string, string> = {
  All: 'bg-white/10 text-slate-200 border-white/15 hover:bg-white/15',
  'Model Release': 'text-violet-300 border-violet-500/30 hover:bg-violet-500/15',
  'Tool Launch': 'text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/15',
  Research: 'text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/15',
  'Open Source': 'text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/15',
  'SAP AI': 'text-green-300 border-green-500/30 hover:bg-green-500/15',
  Industry: 'text-sky-300 border-sky-500/30 hover:bg-sky-500/15',
  Framework: 'text-orange-300 border-orange-500/30 hover:bg-orange-500/15',
};

const categoryActiveColors: Record<string, string> = {
  All: 'bg-white/15 text-white border-white/25',
  'Model Release': 'bg-violet-500/20 text-violet-200 border-violet-500/50',
  'Tool Launch': 'bg-cyan-500/20 text-cyan-200 border-cyan-500/50',
  Research: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/50',
  'Open Source': 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50',
  'SAP AI': 'bg-green-500/20 text-green-200 border-green-500/50',
  Industry: 'bg-sky-500/20 text-sky-200 border-sky-500/50',
  Framework: 'bg-orange-500/20 text-orange-200 border-orange-500/50',
};

interface CategoryFilterProps {
  onFilter?: (category: NewsCategory | 'All') => void;
}

export function CategoryFilter({ onFilter }: CategoryFilterProps) {
  const [active, setActive] = useState<NewsCategory | 'All'>('All');

  const handleClick = (cat: NewsCategory | 'All') => {
    setActive(cat);
    onFilter?.(cat);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
            active === cat
              ? categoryActiveColors[cat]
              : `bg-transparent ${categoryColors[cat]}`
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
