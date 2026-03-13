'use client';

import { useState, useMemo } from 'react';
import { NewsCard } from './NewsCard';
import type { NewsArticle } from '@/lib/types';
import { ChevronDown, Search, X } from 'lucide-react';

const PAGE_SIZE = 9;

export function ArticleGrid({ articles }: { articles: NewsArticle[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return articles;
    const q = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.summary.toLowerCase().includes(q),
    );
  }, [articles, query]);

  function handleQueryChange(val: string) {
    setQuery(val);
    setVisible(PAGE_SIZE);
  }

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search articles, topics, sources…"
          className="w-full pl-10 pr-10 py-2.5 rounded-xl glass border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/40 transition-colors bg-transparent"
        />
        {query && (
          <button
            onClick={() => handleQueryChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results count when filtering */}
      {query && (
        <p className="text-xs text-slate-500 mb-4">
          {filtered.length === 0
            ? `No results for "${query}"`
            : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${query}"`}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No articles match your search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.slice(0, visible).map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {visible < filtered.length && (
        <div className="flex flex-col items-center mt-10 gap-2">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-sm text-slate-300 hover:text-white hover:border-violet-500/40 hover:bg-violet-500/10 transition-all duration-200"
          >
            <ChevronDown className="w-4 h-4" />
            Load more
            <span className="text-slate-500 text-xs">({filtered.length - visible} remaining)</span>
          </button>
        </div>
      )}
    </div>
  );
}
