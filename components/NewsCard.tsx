'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Clock, ArrowUpRight } from 'lucide-react';
import type { NewsArticle } from '@/lib/types';
import { getCategoryBadgeClass, timeAgo } from '@/lib/utils';
import { ArticleCover } from './ArticleCover';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'compact';
}

export function NewsCard({ article, variant = 'default' }: NewsCardProps) {
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    setIsNew(Date.now() - new Date(article.publishedAt).getTime() < 86_400_000);
  }, [article.publishedAt]);

  if (variant === 'compact') {
    return (
      <Link href={`/article/${article.slug}`} className="block group">
        <div className="flex gap-3 py-3 border-b border-white/[0.05] hover:bg-white/[0.02] rounded-lg px-2 -mx-2 transition-colors duration-150">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`badge text-[10px] ${getCategoryBadgeClass(article.category)}`}>
                {article.category}
              </span>
              {isNew && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  NEW
                </span>
              )}
              <span className="text-xs text-slate-600">{timeAgo(article.publishedAt)}</span>
            </div>
            <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white leading-snug line-clamp-2 transition-colors">
              {article.title}
            </h3>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 flex-shrink-0 mt-1 transition-colors" />
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.slug}`} className="block group">
      <article className="glass glass-hover rounded-xl overflow-hidden h-full flex flex-col">
        {/* Cover */}
        <div className="relative h-44 overflow-hidden flex-shrink-0">
          <ArticleCover category={article.category} slug={article.slug} />

          {/* Overlays */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`badge ${getCategoryBadgeClass(article.category)}`}>
                {article.category}
              </span>
              {isNew && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 backdrop-blur-sm">
                  NEW
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-300 bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5">
              <Clock className="w-2.5 h-2.5" />
              {article.readTime}m
            </div>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-base font-bold text-slate-100 group-hover:text-white leading-snug mb-2.5 line-clamp-3 flex-1 transition-colors duration-200">
            {article.title}
          </h3>

          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
            {article.summary}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
            <div className="text-xs text-slate-500">
              <span className="text-slate-400 font-medium">{article.source}</span>
              {' · '}
              {timeAgo(article.publishedAt)}
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors duration-200" />
          </div>
        </div>
      </article>
    </Link>
  );
}
