import Link from 'next/link';
import { Clock, ArrowUpRight } from 'lucide-react';
import type { NewsArticle } from '@/lib/types';
import { getCategoryBadgeClass, timeAgo } from '@/lib/utils';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'compact';
}

export function NewsCard({ article, variant = 'default' }: NewsCardProps) {
  if (variant === 'compact') {
    return (
      <Link href={`/article/${article.slug}`} className="block group">
        <div className="flex gap-3 py-3 border-b border-white/[0.05] hover:bg-white/[0.02] rounded-lg px-2 -mx-2 transition-colors duration-150">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`badge text-[10px] ${getCategoryBadgeClass(article.category)}`}>
                {article.category}
              </span>
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
        {/* Image area */}
        <div className={`relative h-32 bg-gradient-to-br ${getImageGradient(article.id)} overflow-hidden flex-shrink-0`}>
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          {/* Noise texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {/* Category badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className={`badge ${getCategoryBadgeClass(article.category)}`}>
              {article.category}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-black/30 rounded px-1.5 py-0.5">
              <Clock className="w-2.5 h-2.5" />
              {article.readTime}m
            </div>
          </div>
          {/* Accent line */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${getCardAccent(article.category)}`} />
        </div>

        <div className="p-5 flex flex-col flex-1">

          {/* Title */}
          <h3 className="text-base font-bold text-slate-100 group-hover:text-white leading-snug mb-2.5 line-clamp-3 flex-1 transition-colors duration-200">
            {article.title}
          </h3>

          {/* Summary */}
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
            {article.summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>

          {/* Footer */}
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

const IMAGE_GRADIENTS = [
  'from-violet-900 via-violet-800 to-slate-900',
  'from-cyan-900 via-cyan-800 to-slate-900',
  'from-emerald-900 via-emerald-800 to-slate-900',
  'from-blue-900 via-blue-800 to-slate-900',
  'from-rose-900 via-rose-800 to-slate-900',
  'from-orange-900 via-orange-800 to-slate-900',
  'from-indigo-900 via-indigo-800 to-slate-900',
  'from-sky-900 via-sky-800 to-slate-900',
];

function getImageGradient(id: string): string {
  const idx = parseInt(id, 10);
  return IMAGE_GRADIENTS[(isNaN(idx) ? 0 : idx) % IMAGE_GRADIENTS.length];
}

function getCardAccent(category: string): string {
  const map: Record<string, string> = {
    'Model Release': 'from-violet-500 to-purple-500',
    'Tool Launch': 'from-cyan-500 to-sky-500',
    Research: 'from-indigo-500 to-violet-500',
    'Open Source': 'from-emerald-500 to-teal-500',
    'SAP AI': 'from-emerald-400 to-cyan-500',
    Industry: 'from-sky-500 to-blue-500',
    Framework: 'from-orange-500 to-rose-500',
  };
  return map[category] ?? 'from-violet-500 to-cyan-500';
}
