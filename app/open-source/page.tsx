import { RepoCard } from '@/components/RepoCard';
import { openSourceRepos } from '@/lib/mockData';
import { Github, Star, TrendingUp, GitFork, Layers } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

const languages = ['All', 'Python', 'TypeScript', 'Go', 'C++', 'Rust'];
const sortOptions = ['Stars Today', 'Total Stars', 'Forks', 'Recently Updated'];

export default function OpenSourcePage() {
  const totalStars = openSourceRepos.reduce((s, r) => s + r.stars, 0);
  const totalStarsToday = openSourceRepos.reduce((s, r) => s + r.starsToday, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pb-16">
      {/* Page header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold mb-5">
          <Github className="w-3.5 h-3.5" />
          Trending AI Repositories
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 leading-tight">
          Open Source{' '}
          <span className="gradient-text-emerald">AI Projects</span>
        </h1>
        <p className="text-lg text-slate-400 font-light max-w-xl mb-8">
          The most-starred and fastest-growing AI repositories on GitHub. Updated daily from trending data.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-4">
          <StatsCard icon={<Star className="w-4 h-4 text-yellow-400" />} value={formatNumber(totalStars)} label="Total Stars" bg="bg-yellow-500/10 border-yellow-500/20" />
          <StatsCard icon={<TrendingUp className="w-4 h-4 text-emerald-400" />} value={`+${totalStarsToday.toLocaleString()}`} label="Stars Today" bg="bg-emerald-500/10 border-emerald-500/20" />
          <StatsCard icon={<Layers className="w-4 h-4 text-violet-400" />} value={openSourceRepos.length} label="Repos Tracked" bg="bg-violet-500/10 border-violet-500/20" />
          <StatsCard icon={<GitFork className="w-4 h-4 text-cyan-400" />} value={formatNumber(openSourceRepos.reduce((s, r) => s + r.forks, 0))} label="Total Forks" bg="bg-cyan-500/10 border-cyan-500/20" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div>
          <p className="text-xs text-slate-600 mb-2 font-semibold uppercase tracking-wide">Language</p>
          <div className="flex gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  lang === 'All'
                    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40'
                    : 'bg-transparent text-slate-500 border-white/10 hover:bg-white/5 hover:text-slate-300'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
        <div className="ml-auto">
          <p className="text-xs text-slate-600 mb-2 font-semibold uppercase tracking-wide">Sort by</p>
          <div className="flex gap-2">
            {sortOptions.map((opt) => (
              <button
                key={opt}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  opt === 'Stars Today'
                    ? 'bg-white/10 text-slate-200 border-white/20'
                    : 'bg-transparent text-slate-600 border-white/8 hover:bg-white/5 hover:text-slate-400'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="section-accent-emerald section-accent" />
        <h2 className="text-base font-bold text-slate-200">Trending Today</h2>
        <div className="flex items-center gap-1.5">
          <span className="live-dot" />
          <span className="text-xs text-slate-500">Updated 15 min ago</span>
        </div>
      </div>

      {/* Repo list */}
      <div className="space-y-4 mb-8">
        {openSourceRepos.map((repo, i) => (
          <RepoCard key={repo.id} repo={repo} rank={i + 1} />
        ))}
      </div>

      {/* Category breakdown */}
      <div className="glass rounded-2xl p-8 border border-white/[0.07]">
        <h3 className="text-lg font-bold text-slate-100 mb-6">By Category</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {getCategoryStats(openSourceRepos).map((cat) => (
            <div key={cat.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{cat.label}</span>
                <span className="text-xs text-slate-500">{cat.count} repos</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  style={{ width: `${(cat.count / openSourceRepos.length) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatsCard({ icon, value, label, bg }: { icon: React.ReactNode; value: string | number; label: string; bg: string }) {
  return (
    <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border ${bg}`}>
      {icon}
      <div>
        <div className="text-sm font-bold text-white tabular-nums">{value}</div>
        <div className="text-xs text-slate-500">{label}</div>
      </div>
    </div>
  );
}

function getCategoryStats(repos: typeof openSourceRepos) {
  const counts: Record<string, number> = {};
  repos.forEach((r) => {
    counts[r.category] = (counts[r.category] ?? 0) + 1;
  });
  return Object.entries(counts).map(([label, count]) => ({ label, count }));
}
