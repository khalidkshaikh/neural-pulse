import type { OpenSourceRepo } from '@/lib/types';
import { Star, GitFork, TrendingUp, ArrowUpRight } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface RepoCardProps {
  repo: OpenSourceRepo;
  rank: number;
}

export function RepoCard({ repo, rank }: RepoCardProps) {
  return (
    <div className="glass glass-hover-emerald rounded-xl p-5 group cursor-pointer border border-white/[0.07]">
      <div className="flex items-start gap-4">
        {/* Rank */}
        <span className="text-2xl font-black text-slate-700 tabular-nums w-6 flex-shrink-0 pt-0.5">
          {rank}
        </span>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">{repo.owner}</a>
                <span className="text-slate-700">/</span>
                <a href={repo.url} target="_blank" rel="noopener noreferrer">
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {repo.name}
                  </h3>
                </a>
              </div>
              <span className="text-xs text-slate-500 font-medium">{repo.category}</span>
            </div>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center bg-white/5 border border-white/10 hover:bg-emerald-500/15 hover:border-emerald-500/30 transition-all"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </a>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-3">
            {repo.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {repo.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs">
            {/* Language */}
            <div className="flex items-center gap-1.5">
              <span className="lang-dot" style={{ backgroundColor: repo.languageColor }} />
              <span className="text-slate-400">{repo.language}</span>
            </div>
            {/* Stars */}
            <div className="flex items-center gap-1 text-slate-500">
              <Star className="w-3.5 h-3.5" />
              <span className="tabular-nums">{formatNumber(repo.stars)}</span>
            </div>
            {/* Forks */}
            <div className="flex items-center gap-1 text-slate-500">
              <GitFork className="w-3.5 h-3.5" />
              <span className="tabular-nums">{formatNumber(repo.forks)}</span>
            </div>
            {/* Stars today */}
            <div className="flex items-center gap-1 text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="tabular-nums">+{repo.starsToday} today</span>
            </div>
            {/* License */}
            <span className="text-slate-600 ml-auto">{repo.license}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
