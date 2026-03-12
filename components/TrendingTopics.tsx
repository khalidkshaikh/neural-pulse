import { TrendingUp } from 'lucide-react';
import { trendingTopics } from '@/lib/mockData';

export function TrendingTopics() {
  const max = Math.max(...trendingTopics.map((t) => t.count));

  return (
    <div className="glass rounded-xl p-5 border border-white/[0.07]">
      <div className="flex items-center gap-2 mb-4">
        <div className="section-accent" />
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-bold text-slate-200">Trending in AI</h3>
        </div>
      </div>

      <div className="space-y-3">
        {trendingTopics.map((topic, i) => {
          const pct = Math.round((topic.count / max) * 100);
          return (
            <div key={topic.label} className="group cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-600 w-4 tabular-nums">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors font-medium">
                    {topic.label}
                  </span>
                </div>
                <span className="text-xs text-slate-600 tabular-nums">{topic.count}</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-white/[0.05]">
        <p className="text-xs text-slate-600 text-center">Updated every 6 hours</p>
      </div>
    </div>
  );
}
