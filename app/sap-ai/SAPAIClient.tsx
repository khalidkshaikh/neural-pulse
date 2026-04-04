'use client';

import { useState } from 'react';
import { SAPCard } from '@/components/SAPCard';
import type { SAPProduct, SAPUpdate } from '@/lib/types';
import { Cpu, BookOpen, TrendingUp, Clock, Star, ChevronRight } from 'lucide-react';

const products: (SAPProduct | 'All')[] = ['All', 'Joule', 'AI Core', 'Generative AI Hub', 'Business AI', 'BTP', 'Community'];

const productDescriptions: Record<string, string> = {
  Joule: 'SAP\'s generative AI copilot embedded across all SAP applications',
  'AI Core': 'The foundation for running and serving AI models in the SAP ecosystem',
  'Generative AI Hub': 'Access to 20+ LLMs via a unified API inside SAP AI Core',
  'Business AI': 'AI capabilities embedded into SAP business processes',
  BTP: 'SAP Business Technology Platform - cloud platform for AI extension',
  Community: 'Top questions, discussions, and guides from the SAP AI community',
};

export default function SAPAIClient({ sapUpdates }: { sapUpdates: SAPUpdate[] }) {
  const [activeProduct, setActiveProduct] = useState<SAPProduct | 'All'>('All');

  const weeklyDigest = sapUpdates.find((u) => u.isWeeklyDigest);
  const filteredUpdates = sapUpdates.filter(
    (u) =>
      !u.isWeeklyDigest &&
      (activeProduct === 'All' || u.product === activeProduct)
  );

  const statsMap: Record<SAPProduct | 'All', number> = {
    All: sapUpdates.filter((u) => !u.isWeeklyDigest).length,
    Joule: sapUpdates.filter((u) => u.product === 'Joule').length,
    'AI Core': sapUpdates.filter((u) => u.product === 'AI Core').length,
    'Generative AI Hub': sapUpdates.filter((u) => u.product === 'Generative AI Hub').length,
    'Business AI': sapUpdates.filter((u) => u.product === 'Business AI').length,
    BTP: sapUpdates.filter((u) => u.product === 'BTP').length,
    Community: sapUpdates.filter((u) => u.product === 'Community').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pb-16">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold mb-5">
          <Cpu className="w-3.5 h-3.5" />
          SAP AI Intelligence Hub
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 leading-tight">
          SAP AI{' '}
          <span className="gradient-text-emerald">Ecosystem</span>
        </h1>
        <p className="text-lg text-slate-400 font-light max-w-xl">
          Daily monitoring of SAP Business AI: Joule, AI Core, Generative AI Hub, and the entire SAP AI ecosystem - without digging through multiple SAP channels.
        </p>
      </div>

      {/* SAP product overview cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {(Object.keys(productDescriptions) as SAPProduct[]).map((product) => (
          <ProductOverviewCard
            key={product}
            product={product}
            description={productDescriptions[product]}
            updateCount={statsMap[product] ?? 0}
            onClick={() => setActiveProduct(product)}
            isActive={activeProduct === product}
          />
        ))}
      </div>

      {/* Weekly digest */}
      {weeklyDigest && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="section-accent-emerald section-accent" />
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-slate-200">This Week&apos;s Digest</h2>
            </div>
          </div>
          <SAPCard update={weeklyDigest} showTimeline={false} />
        </div>
      )}

      {/* Product filter tabs */}
      <div className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {products.map((product) => (
            <button
              key={product}
              onClick={() => setActiveProduct(product)}
              className={`flex-shrink-0 flex items-center gap-1.5 sap-pill ${
                activeProduct === product ? 'sap-pill-active' : 'sap-pill-inactive'
              }`}
            >
              {product}
              {statsMap[product] > 0 && (
                <span
                  className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${
                    activeProduct === product
                      ? 'bg-emerald-500/30 text-emerald-300'
                      : 'bg-white/5 text-slate-600'
                  }`}
                >
                  {statsMap[product]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline feed */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="section-accent-emerald section-accent" />
            <h2 className="text-base font-bold text-slate-200">
              {activeProduct === 'All' ? 'All Updates' : `${activeProduct} Updates`}
            </h2>
            <span className="badge bg-white/5 text-slate-500 border-white/10 text-[10px]">
              {filteredUpdates.length} items
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="live-dot" />
              <span className="text-xs text-slate-600">Live feed</span>
            </div>
          </div>

          {filteredUpdates.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center border border-white/[0.07]">
              <Cpu className="w-8 h-8 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No updates for this product yet.</p>
            </div>
          ) : (
            <div>
              {filteredUpdates.map((update) => (
                <SAPCard key={update.id} update={update} showTimeline />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass rounded-xl p-5 border border-white/[0.07]">
            <div className="flex items-center gap-2 mb-4">
              <div className="section-accent-emerald section-accent" />
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-200">Quick Links</h3>
              </div>
            </div>
            <ul className="space-y-2">
              {[
                'SAP AI Core Documentation',
                'Joule Developer Guide',
                'Generative AI Hub API Reference',
                'SAP Business AI Roadmap',
                'SAP Community AI Board',
                'TechEd AI Sessions',
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-300 transition-colors py-1.5 group"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-xl p-5 border border-white/[0.07]">
            <div className="flex items-center gap-2 mb-4">
              <div className="section-accent-emerald section-accent" />
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-200">Coverage Stats</h3>
              </div>
            </div>
            <div className="space-y-3">
              {(Object.entries(statsMap).filter(([k]) => k !== 'All') as [string, number][]).map(([product, count]) => (
                <div key={product}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{product}</span>
                    <span className="text-slate-500">{count}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      style={{ width: `${(count / Math.max(1, ...Object.values(statsMap))) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-4 border border-white/[0.07]">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-500">SAP sources checked every 24 hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductOverviewCard({
  product,
  description,
  updateCount,
  onClick,
  isActive,
}: {
  product: SAPProduct;
  description: string;
  updateCount: number;
  onClick: () => void;
  isActive: boolean;
}) {
  const colorMap: Record<string, { dot: string; bg: string; border: string; text: string }> = {
    Joule: {
      dot: 'bg-emerald-400',
      bg: isActive ? 'bg-emerald-500/15' : 'bg-white/[0.03]',
      border: isActive ? 'border-emerald-500/40' : 'border-white/[0.06]',
      text: 'text-emerald-300',
    },
    'AI Core': {
      dot: 'bg-violet-400',
      bg: isActive ? 'bg-violet-500/15' : 'bg-white/[0.03]',
      border: isActive ? 'border-violet-500/40' : 'border-white/[0.06]',
      text: 'text-violet-300',
    },
    'Generative AI Hub': {
      dot: 'bg-cyan-400',
      bg: isActive ? 'bg-cyan-500/15' : 'bg-white/[0.03]',
      border: isActive ? 'border-cyan-500/40' : 'border-white/[0.06]',
      text: 'text-cyan-300',
    },
    'Business AI': {
      dot: 'bg-sky-400',
      bg: isActive ? 'bg-sky-500/15' : 'bg-white/[0.03]',
      border: isActive ? 'border-sky-500/40' : 'border-white/[0.06]',
      text: 'text-sky-300',
    },
    BTP: {
      dot: 'bg-orange-400',
      bg: isActive ? 'bg-orange-500/15' : 'bg-white/[0.03]',
      border: isActive ? 'border-orange-500/40' : 'border-white/[0.06]',
      text: 'text-orange-300',
    },
    Community: {
      dot: 'bg-rose-400',
      bg: isActive ? 'bg-rose-500/15' : 'bg-white/[0.03]',
      border: isActive ? 'border-rose-500/40' : 'border-white/[0.06]',
      text: 'text-rose-300',
    },
  };

  const colors = colorMap[product] ?? colorMap.Joule;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${colors.bg} ${colors.border} hover:scale-[1.01]`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
          <span className={`text-sm font-bold ${colors.text}`}>{product}</span>
        </div>
        {updateCount > 0 && (
          <span className={`text-xs font-bold ${colors.text} tabular-nums`}>
            {updateCount} update{updateCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    </button>
  );
}
