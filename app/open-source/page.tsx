import { getRepos } from '@/lib/getData';
import { OpenSourceClientPage } from '@/components/OpenSourceClientPage';
import { Github, Star, TrendingUp, GitFork, Layers } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function OpenSourcePage() {
  const repos = getRepos();
  const totalStars = repos.reduce((s, r) => s + r.stars, 0);
  const totalStarsToday = repos.reduce((s, r) => s + r.starsToday, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks, 0);

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
          The most-starred and fastest-growing AI repositories on GitHub. {repos.length} projects tracked across models, agents, frameworks and tools.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-4">
          <StatsCard icon={<Star className="w-4 h-4 text-yellow-400" />} value={formatNumber(totalStars)} label="Total Stars" bg="bg-yellow-500/10 border-yellow-500/20" />
          <StatsCard icon={<TrendingUp className="w-4 h-4 text-emerald-400" />} value={`+${totalStarsToday.toLocaleString()}`} label="Stars Today" bg="bg-emerald-500/10 border-emerald-500/20" />
          <StatsCard icon={<Layers className="w-4 h-4 text-violet-400" />} value={repos.length} label="Repos Tracked" bg="bg-violet-500/10 border-violet-500/20" />
          <StatsCard icon={<GitFork className="w-4 h-4 text-cyan-400" />} value={formatNumber(totalForks)} label="Total Forks" bg="bg-cyan-500/10 border-cyan-500/20" />
        </div>
      </div>

      {/* Client-side interactive section */}
      <OpenSourceClientPage repos={repos} />
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
