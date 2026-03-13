import { getArticles } from '@/lib/getData';
import { Sparkles, TrendingUp, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

export function AISummaryWidget() {
  const articles = getArticles();
  const now = new Date();

  // Today's articles (last 24h)
  const todayArticles = articles.filter(
    (a) => now.getTime() - new Date(a.publishedAt).getTime() < 86_400_000
  );
  // This week
  const weekArticles = articles.filter(
    (a) => now.getTime() - new Date(a.publishedAt).getTime() < 7 * 86_400_000
  );

  // Category breakdown
  const catCounts = articles.slice(0, 40).reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1;
    return acc;
  }, {});
  const topCats = Object.entries(catCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  // Top sources
  const sourceCounts = articles.slice(0, 40).reduce<Record<string, number>>((acc, a) => {
    acc[a.source] = (acc[a.source] ?? 0) + 1;
    return acc;
  }, {});
  const topSources = Object.entries(sourceCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([s]) => s);

  const catColors: Record<string, string> = {
    'Model Release': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    'Tool Launch': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    Research: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    'Open Source': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'SAP AI': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    Industry: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    Framework: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  };

  return (
    <div className="glass rounded-2xl border border-white/[0.07] overflow-hidden mb-8">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.06] bg-gradient-to-r from-violet-900/20 to-cyan-900/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Intelligence Digest</h3>
            <p className="text-[10px] text-slate-500">Auto-generated from live sources</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
          <Clock className="w-3 h-3" />
          Updated daily
        </div>
      </div>

      <div className="p-5">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Today', value: todayArticles.length, icon: <Calendar className="w-3.5 h-3.5" />, color: 'text-violet-400' },
            { label: 'This week', value: weekArticles.length, icon: <TrendingUp className="w-3.5 h-3.5" />, color: 'text-cyan-400' },
            { label: 'All time', value: articles.length, icon: <Sparkles className="w-3.5 h-3.5" />, color: 'text-emerald-400' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <div className={`flex justify-center mb-1 ${color}`}>{icon}</div>
              <div className="text-lg font-black text-white">{value}</div>
              <div className="text-[10px] text-slate-600">{label}</div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="mb-4">
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider mb-2">Trending categories</p>
          <div className="flex flex-wrap gap-1.5">
            {topCats.map(([cat, count]) => (
              <span
                key={cat}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${catColors[cat] ?? 'bg-white/5 text-slate-400 border-white/10'}`}
              >
                {cat} · {count}
              </span>
            ))}
          </div>
        </div>

        {/* Top story */}
        {articles[0] && (
          <div className="mb-4">
            <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider mb-2">Top story</p>
            <Link
              href={`/article/${articles[0].slug}`}
              className="block p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/30 hover:bg-violet-500/5 transition-all group"
            >
              <p className="text-sm font-semibold text-slate-200 group-hover:text-white leading-snug line-clamp-2 transition-colors">
                {articles[0].title}
              </p>
              <p className="text-xs text-slate-500 mt-1">{articles[0].source}</p>
            </Link>
          </div>
        )}

        {/* Top sources */}
        <div>
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider mb-2">Most active sources</p>
          <div className="flex flex-wrap gap-1.5">
            {topSources.map((src) => (
              <span key={src} className="text-[11px] px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400">
                {src}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
