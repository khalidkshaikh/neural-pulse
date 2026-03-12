import { tickerItems } from '@/lib/mockData';
import { Radio } from 'lucide-react';

export function LiveTicker() {
  // Duplicate items for seamless loop
  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] bg-surface-900/50 py-2.5">
      {/* Label */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-4 gap-2 bg-gradient-to-r from-surface-900 via-surface-900 to-transparent pr-12">
        <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
        <span className="text-[11px] font-bold text-rose-400 uppercase tracking-widest">Breaking</span>
      </div>

      {/* Fade right edge */}
      <div className="absolute right-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-l from-surface-900 to-transparent pointer-events-none" />

      <div className="ticker-wrapper pl-32">
        <div className="ticker-content">
          {items.map((item, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="text-sm text-slate-300">{item}</span>
              <span className="mx-8 text-white/20">|</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
