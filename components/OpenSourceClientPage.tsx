'use client';

import { useState, useMemo } from 'react';
import type { OpenSourceRepo } from '@/lib/types';
import { RepoCard } from '@/components/RepoCard';
import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react';

const LANGUAGES = ['All', 'Python', 'TypeScript', 'Go', 'C++', 'Rust', 'JavaScript'];

type SortKey = 'starsToday' | 'stars' | 'forks' | 'lastUpdated';

const SORT_OPTIONS: { label: string; key: SortKey }[] = [
  { label: 'Stars Today', key: 'starsToday' },
  { label: 'Total Stars', key: 'stars' },
  { label: 'Forks', key: 'forks' },
  { label: 'Recently Updated', key: 'lastUpdated' },
];

const PAGE_SIZE = 12;

interface Props {
  repos: OpenSourceRepo[];
}

export function OpenSourceClientPage({ repos }: Props) {
  const [language, setLanguage] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('starsToday');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Language counts
  const langCounts = useMemo(() => {
    const counts: Record<string, number> = { All: repos.length };
    for (const r of repos) {
      counts[r.language] = (counts[r.language] ?? 0) + 1;
    }
    return counts;
  }, [repos]);

  // Filtered + sorted
  const filtered = useMemo(() => {
    let result = [...repos];

    // Language filter
    if (language !== 'All') {
      result = result.filter((r) => r.language === language);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.owner.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortKey === 'lastUpdated') {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
      return (b[sortKey] as number) - (a[sortKey] as number);
    });

    return result;
  }, [repos, language, search, sortKey]);

  // Visible slice
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset visible count when filters change
  const handleLanguage = (lang: string) => {
    setLanguage(lang);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSort = (key: SortKey) => {
    setSortKey(key);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setVisibleCount(PAGE_SIZE);
  };

  // Category stats for the breakdown
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach((r) => {
      counts[r.category] = (counts[r.category] ?? 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [filtered]);

  return (
    <>
      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search repos by name, owner, description, or tag..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/40 focus:bg-white/[0.06] transition-all"
        />
        {search && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded-md bg-white/5 border border-white/10 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-end gap-4 mb-8">
        {/* Language pills */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-600 mb-2 font-semibold uppercase tracking-wide flex items-center gap-1.5">
            <SlidersHorizontal className="w-3 h-3" />
            Language
          </p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => {
              const isActive = language === lang;
              const count = langCounts[lang] ?? 0;
              return (
                <button
                  key={lang}
                  onClick={() => handleLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                      : 'bg-transparent text-slate-500 border-white/10 hover:bg-white/5 hover:text-slate-300'
                  }`}
                >
                  {lang}
                  {count > 0 && (
                    <span className={`ml-1.5 text-[10px] font-bold ${isActive ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort pills */}
        <div className="flex-shrink-0">
          <p className="text-xs text-slate-600 mb-2 font-semibold uppercase tracking-wide">Sort by</p>
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map(({ label, key }) => {
              const isActive = sortKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-slate-200 border-white/20'
                      : 'bg-transparent text-slate-600 border-white/[0.08] hover:bg-white/5 hover:text-slate-400'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="section-accent-emerald section-accent" />
        <h2 className="text-base font-bold text-slate-200">
          {search ? 'Search Results' : language === 'All' ? 'Trending Today' : `${language} Repositories`}
        </h2>
        <span className="badge bg-white/5 text-slate-500 border-white/10 text-[10px]">
          {filtered.length} {filtered.length === 1 ? 'repo' : 'repos'}
        </span>
        {!search && (
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="live-dot" />
            <span className="text-xs text-slate-500">Updated 15 min ago</span>
          </div>
        )}
      </div>

      {/* Repo list */}
      {visible.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500 text-sm mb-2">No repositories match your search.</p>
          <button
            onClick={() => { handleSearch(''); handleLanguage('All'); }}
            className="text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {visible.map((repo, i) => (
            <RepoCard key={repo.id} repo={repo} rank={i + 1} />
          ))}
        </div>
      )}

      {/* Load More button */}
      {hasMore && (
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-sm font-semibold hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
          >
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            Load More
            <span className="text-xs text-emerald-400/60 font-normal">
              ({filtered.length - visibleCount} remaining)
            </span>
          </button>
        </div>
      )}

      {/* Category breakdown */}
      {categoryStats.length > 0 && (
        <div className="glass rounded-2xl p-8 border border-white/[0.07]">
          <h3 className="text-lg font-bold text-slate-100 mb-6">By Category</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryStats.map((cat) => (
              <div key={cat.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{cat.label}</span>
                  <span className="text-xs text-slate-500">{cat.count} repos</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${(cat.count / Math.max(filtered.length, 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
