'use client';

import { useState, useMemo } from 'react';
import type { AITool } from '@/lib/types';
import { ToolCard } from '@/components/ToolCard';
import {
  Bot, Image, Video, Code2, Zap, PenLine, Mic2, Search, Briefcase, Paintbrush, LayoutGrid
} from 'lucide-react';

const CATEGORIES = [
  { label: 'All',              icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { label: 'LLMs & Chatbots', icon: <Bot className="w-3.5 h-3.5" /> },
  { label: 'Image Generation', icon: <Image className="w-3.5 h-3.5" /> },
  { label: 'Video Generation', icon: <Video className="w-3.5 h-3.5" /> },
  { label: 'Coding & Dev',     icon: <Code2 className="w-3.5 h-3.5" /> },
  { label: 'AI Agents',        icon: <Zap className="w-3.5 h-3.5" /> },
  { label: 'Writing & Content',icon: <PenLine className="w-3.5 h-3.5" /> },
  { label: 'Voice & Audio',    icon: <Mic2 className="w-3.5 h-3.5" /> },
  { label: 'Search & Research',icon: <Search className="w-3.5 h-3.5" /> },
  { label: 'Productivity',     icon: <Briefcase className="w-3.5 h-3.5" /> },
  { label: 'Design & UI',      icon: <Paintbrush className="w-3.5 h-3.5" /> },
];

interface Props { tools: AITool[] }

export function ToolsClientPage({ tools }: Props) {
  const [active, setActive] = useState('All');

  const featuredTool = tools.find((t) => t.isFeatured) ?? tools[0];

  const filtered = useMemo(() => {
    const all = tools.filter((t) => !t.isFeatured);
    if (active === 'All') return all;
    return all.filter((t) => t.category === active);
  }, [tools, active]);

  const counts = useMemo(() => {
    const m: Record<string, number> = { All: tools.filter((t) => !t.isFeatured).length };
    for (const t of tools) {
      if (!t.isFeatured) m[t.category] = (m[t.category] ?? 0) + 1;
    }
    return m;
  }, [tools]);

  return (
    <>
      {/* Category filter bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
        {CATEGORIES.map(({ label, icon }) => {
          const isActive = active === label;
          return (
            <button
              key={label}
              onClick={() => setActive(label)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'bg-transparent text-slate-500 border-white/10 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              {icon}
              {label}
              {counts[label] !== undefined && (
                <span className={`text-[10px] font-bold ${isActive ? 'text-cyan-400' : 'text-slate-600'}`}>
                  {counts[label]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Featured tool — only show on All tab */}
      {active === 'All' && (
        <div className="mb-8">
          <ToolCard tool={featuredTool} featured />
        </div>
      )}

      {/* Tools grid */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="section-accent" style={{ background: 'linear-gradient(180deg, #06b6d4, #7c3aed)' }} />
          <h2 className="text-base font-bold text-slate-200">
            {active === 'All' ? 'All Tools' : active}
          </h2>
          <span className="badge bg-white/5 text-slate-500 border-white/10 text-[10px]">
            {filtered.length} tools
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">No tools in this category yet.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
