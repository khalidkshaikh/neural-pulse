'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface Props {
  title: string;
}

export function ShareButton({ title }: Props) {
  const [state, setState] = useState<'idle' | 'copied'>('idle');

  async function handleShare() {
    const url = window.location.href;
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      // share cancelled or not supported — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url);
      setState('copied');
      setTimeout(() => setState('idle'), 2000);
    } catch {
      // clipboard also failed — ignore
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all"
    >
      {state === 'copied' ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          Share
        </>
      )}
    </button>
  );
}
