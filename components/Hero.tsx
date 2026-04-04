import { Sparkles, TrendingUp, Cpu, Globe } from 'lucide-react';

interface HeroProps {
  articlesToday: number;
  totalArticles: number;
  sourcesMonitored: number;
  lastUpdated: string;
}

export function Hero({ articlesToday, totalArticles, sourcesMonitored, lastUpdated }: HeroProps) {
  return (
    <section className="relative pt-20 pb-16 px-4 sm:px-6 overflow-hidden">
      {/* Hero glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-violet-600/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-semibold mb-6 animate-fade-up">
            <Sparkles className="w-3.5 h-3.5" />
            Automated AI Intelligence — Updated Daily
          </div>

          {/* Main title */}
          <h1 className="hero-title-gradient text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6 animate-fade-up-delay">
            The Intelligence Layer<br />for AI News
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 font-light leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-up-delay-2">
            Automated daily digest of model releases, AI tool launches, open-source trends,
            and SAP AI ecosystem updates — curated by AI, for AI professionals.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 animate-fade-up-delay-2">
            <StatCard icon={<TrendingUp className="w-4 h-4 text-violet-400" />} value={articlesToday} label="Articles Today" color="violet" />
            <div className="hidden sm:block w-px h-10 bg-white/10" />
            <StatCard icon={<Globe className="w-4 h-4 text-cyan-400" />} value={totalArticles} label="Total Articles" color="cyan" />
            <div className="hidden sm:block w-px h-10 bg-white/10" />
            <StatCard icon={<Cpu className="w-4 h-4 text-emerald-400" />} value={lastUpdated} label="Last Updated" color="emerald" isText />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
  isText,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color: 'violet' | 'cyan' | 'emerald';
  isText?: boolean;
}) {
  const colorMap = {
    violet: 'text-violet-300',
    cyan: 'text-cyan-300',
    emerald: 'text-emerald-300',
  };
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
          color === 'violet'
            ? 'bg-violet-500/10 border border-violet-500/20'
            : color === 'cyan'
            ? 'bg-cyan-500/10 border border-cyan-500/20'
            : 'bg-emerald-500/10 border border-emerald-500/20'
        }`}
      >
        {icon}
      </div>
      <div className="text-left">
        <div className={`text-lg font-bold tabular-nums ${colorMap[color]}`}>
          {isText ? value : typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="text-xs text-slate-500 font-medium">{label}</div>
      </div>
    </div>
  );
}
