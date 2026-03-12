'use client';

import { useState } from 'react';
import { NewsCard } from './NewsCard';
import type { NewsArticle } from '@/lib/types';
import { ChevronDown } from 'lucide-react';

const PAGE_SIZE = 9;

export function ArticleGrid({ articles }: { articles: NewsArticle[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.slice(0, visible).map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {visible < articles.length && (
        <div className="flex flex-col items-center mt-10 gap-2">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-sm text-slate-300 hover:text-white hover:border-violet-500/40 hover:bg-violet-500/10 transition-all duration-200"
          >
            <ChevronDown className="w-4 h-4" />
            Load more
            <span className="text-slate-500 text-xs">({articles.length - visible} remaining)</span>
          </button>
        </div>
      )}
    </div>
  );
}
