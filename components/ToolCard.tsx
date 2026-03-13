import type { AITool } from '@/lib/types';
import { ArrowUpRight, Zap } from 'lucide-react';
import { timeAgo } from '@/lib/utils';

interface ToolCardProps {
  tool: AITool;
  featured?: boolean;
}

export function ToolCard({ tool, featured = false }: ToolCardProps) {
  if (featured) {
    return (
      <div className="relative rounded-2xl overflow-hidden glass border border-white/[0.08] group">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(ellipse at top left, ${tool.accentColor}30, transparent 60%)` }}
        />
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${tool.accentColor}, transparent)` }} />

        <div className="relative p-8 sm:p-10">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                {tool.isNew && (
                  <span className="badge badge-emerald">
                    <Zap className="w-3 h-3" />
                    New
                  </span>
                )}
                <span className="badge bg-white/10 text-slate-300 border-white/15">Featured</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-2">{tool.name}</h2>
              <p className="text-lg text-slate-400 font-light">{tool.tagline}</p>
            </div>
            <a
              href={tool.url} target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: `${tool.accentColor}25`,
                color: tool.accentColor,
                border: `1px solid ${tool.accentColor}40`,
              }}
            >
              Visit
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <p className="text-slate-300 leading-relaxed mb-6 max-w-2xl">{tool.description}</p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-1.5">
              {tool.platform.map((p) => (
                <span key={p} className="tag">{p}</span>
              ))}
            </div>
            <span className="text-slate-600 text-sm">·</span>
            <span className="text-sm text-slate-500">{tool.category}</span>
            <span className="text-slate-600 text-sm">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold" style={{ color: tool.accentColor }}>
                ▲ {tool.upvotes.toLocaleString()}
              </span>
              <span className="text-xs text-slate-600">upvotes</span>
            </div>
            <span className="text-slate-600 text-sm">·</span>
            <span className="text-xs text-slate-500">Launched {timeAgo(tool.launchDate)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass glass-hover rounded-xl overflow-hidden group cursor-pointer border border-white/[0.07]">
      <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${tool.accentColor}, transparent)` }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-base font-bold text-white">{tool.name}</h3>
              {tool.isNew && (
                <span className="badge badge-emerald text-[10px]">New</span>
              )}
            </div>
            <p className="text-xs text-slate-500">{tool.tagline}</p>
          </div>
          <a
            href={tool.url} target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4">{tool.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <div className="flex gap-1">
            {tool.platform.map((p) => (
              <span key={p} className="text-[11px] text-slate-600 font-medium">{p}</span>
            )).reduce((prev, curr) => [prev, <span key="sep" className="text-slate-700 mx-0.5">·</span>, curr] as any)}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold" style={{ color: tool.accentColor }}>▲</span>
            <span className="text-xs font-medium text-slate-400">{tool.upvotes.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
