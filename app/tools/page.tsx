import { ToolCard } from '@/components/ToolCard';
import { aiTools } from '@/lib/mockData';
import { Wrench, Zap, TrendingUp, Globe, Code2, Search, Bot, Eye } from 'lucide-react';

const categories = ['All', 'Developer Tools', 'AI Platform', 'Observability', 'Web Builder', 'AI Workspace', 'UI Generation', 'AI Search', 'AI Agent'];

const categoryIcons: Record<string, React.ReactNode> = {
  'Developer Tools': <Code2 className="w-3.5 h-3.5" />,
  'AI Platform': <Bot className="w-3.5 h-3.5" />,
  Observability: <Eye className="w-3.5 h-3.5" />,
  'Web Builder': <Globe className="w-3.5 h-3.5" />,
  'AI Search': <Search className="w-3.5 h-3.5" />,
  'AI Agent': <Zap className="w-3.5 h-3.5" />,
};

export default function ToolsPage() {
  const featuredTool = aiTools.find((t) => t.isFeatured) ?? aiTools[0];
  const otherTools = aiTools.filter((t) => !t.isFeatured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pb-16">
      {/* Page header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold mb-5">
          <Zap className="w-3.5 h-3.5" />
          AI Tools Launch Tracker
        </div>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 leading-tight">
              What's New in{' '}
              <span className="gradient-text-cyan">AI Tools</span>
            </h1>
            <p className="text-lg text-slate-400 font-light max-w-xl">
              Track the latest AI tool and product launches. From dev tools to no-code builders — curated and updated daily.
            </p>
          </div>
          {/* Stats */}
          <div className="hidden md:flex flex-col gap-3 flex-shrink-0">
            <StatPill icon={<Wrench className="w-3.5 h-3.5 text-cyan-400" />} value={aiTools.length} label="tools this week" color="cyan" />
            <StatPill icon={<TrendingUp className="w-3.5 h-3.5 text-violet-400" />} value={aiTools.reduce((s, t) => s + t.upvotes, 0).toLocaleString()} label="total upvotes" color="violet" />
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
              cat === 'All'
                ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40'
                : 'bg-transparent text-slate-500 border-white/10 hover:bg-white/5 hover:text-slate-300'
            }`}
          >
            {categoryIcons[cat]}
            {cat}
          </button>
        ))}
      </div>

      {/* Featured tool */}
      <div className="mb-8">
        <ToolCard tool={featuredTool} featured />
      </div>

      {/* Tools grid */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="section-accent" style={{ background: 'linear-gradient(180deg, #06b6d4, #7c3aed)' }} />
          <h2 className="text-base font-bold text-slate-200">All Launches</h2>
          <span className="badge bg-white/5 text-slate-500 border-white/10 text-[10px]">
            {otherTools.length} tools
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {otherTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

      {/* Load more */}
      <div className="text-center mt-8">
        <button className="px-6 py-2.5 rounded-xl glass border border-white/10 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200">
          Load more tools
        </button>
      </div>
    </div>
  );
}

function StatPill({ icon, value, label, color }: { icon: React.ReactNode; value: string | number; label: string; color: 'cyan' | 'violet' }) {
  return (
    <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border ${
      color === 'cyan' ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-violet-500/10 border-violet-500/20'
    }`}>
      {icon}
      <span className={`text-sm font-bold ${color === 'cyan' ? 'text-cyan-300' : 'text-violet-300'}`}>
        {value}
      </span>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}
