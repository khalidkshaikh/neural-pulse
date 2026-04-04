import { getTools } from '@/lib/getData';
import { ToolsClientPage } from '@/components/ToolsClientPage';
import { Wrench, Zap, TrendingUp } from 'lucide-react';

export default function ToolsPage() {
  const tools = getTools();
  const newCount = tools.filter((t) => t.isNew).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pb-16">
      {/* Page header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold mb-5">
          <Zap className="w-3.5 h-3.5" />
          AI Tools Directory
        </div>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 leading-tight">
              Every AI Tool{' '}
              <span className="gradient-text-cyan">That Matters</span>
            </h1>
            <p className="text-lg text-slate-400 font-light max-w-xl">
              {tools.length}+ tools across LLMs, image gen, video, coding, agents, writing, voice, and more - with direct links.
            </p>
          </div>
          <div className="hidden md:flex flex-col gap-3 flex-shrink-0">
            <StatPill icon={<Wrench className="w-3.5 h-3.5 text-cyan-400" />} value={tools.length} label="tools tracked" color="cyan" />
            <StatPill icon={<TrendingUp className="w-3.5 h-3.5 text-violet-400" />} value={newCount} label="newly added" color="violet" />
          </div>
        </div>
      </div>

      <ToolsClientPage tools={tools} />
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
