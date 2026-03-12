import type { SAPUpdate } from '@/lib/types';
import { ArrowUpRight, BookOpen, Star } from 'lucide-react';
import { getSAPProductColor, getUpdateTypeColor, timeAgo } from '@/lib/utils';

interface SAPCardProps {
  update: SAPUpdate;
  showTimeline?: boolean;
}

export function SAPCard({ update, showTimeline = true }: SAPCardProps) {
  const productColor = getSAPProductColor(update.product);

  if (update.isWeeklyDigest) {
    return (
      <div className="relative rounded-2xl overflow-hidden glass border border-emerald-500/20 group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-teal-900/20 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />

        <div className="relative p-7">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-emerald-400" />
              <span className="badge badge-emerald">Weekly Digest</span>
              <span className={`badge border ${getSAPProductColor(update.product)}`}>{update.product}</span>
            </div>
            <span className="text-xs text-slate-500">{timeAgo(update.publishedAt)}</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-3 leading-snug">{update.title}</h3>
          <p className="text-slate-300 leading-relaxed mb-5">{update.summary}</p>
          <div className="flex flex-wrap gap-1.5">
            {update.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 group">
      {showTimeline && (
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-5 relative">
            {update.isNew && (
              <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
            )}
          </div>
          <div className="w-px flex-1 bg-white/[0.06] mt-1" />
        </div>
      )}

      <div className="flex-1 min-w-0 pb-4">
        <div className="glass rounded-xl p-5 border border-white/[0.07] group-hover:border-emerald-500/25 transition-colors duration-200">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              {update.isNew && <span className="badge badge-emerald text-[10px]">New</span>}
              <span className={`badge border text-[11px] ${productColor}`}>{update.product}</span>
              <span className={`badge text-[10px] ${getUpdateTypeColor(update.updateType)}`}>
                {update.updateType}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-slate-600">{timeAgo(update.publishedAt)}</span>
              <a
                href={update.sourceUrl}
                className="w-6 h-6 rounded-md flex items-center justify-center bg-white/5 border border-white/10 hover:bg-emerald-500/15 hover:border-emerald-500/30 transition-all"
              >
                <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </a>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-100 group-hover:text-white mb-2 leading-snug transition-colors">
            {update.title}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3">
            {update.summary}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {update.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
