import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import type { NewsArticle } from '@/lib/types';
import { getCategoryBadgeClass, timeAgo } from '@/lib/utils';
import { ArticleCover } from './ArticleCover';

interface FeaturedArticleProps {
  article: NewsArticle;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden glass border border-white/[0.07] group cursor-pointer">
      {/* Branded cover art */}
      <ArticleCover category={article.category} slug={article.slug} />

      {/* Decorative grid lines on top */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-8 sm:p-10 min-h-[320px] flex flex-col justify-between">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`badge ${getCategoryBadgeClass(article.category)}`}>
              {article.category}
            </span>
            <span className="badge bg-white/10 text-slate-300 border-white/15 text-[10px]">
              FEATURED
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime} min read
          </div>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3 group-hover:text-violet-100 transition-colors duration-200">
            {article.title}
          </h2>
          <p className="text-slate-300 text-base leading-relaxed mb-6 max-w-3xl">
            {article.summary}
          </p>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="font-medium text-slate-300">{article.source}</span>
                <span>·</span>
                <span>{timeAgo(article.publishedAt)}</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {article.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
            <Link
              href={`/article/${article.slug}`}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium hover:bg-violet-600/30 hover:border-violet-500/50 transition-all duration-200 group/btn"
            >
              Read article
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
