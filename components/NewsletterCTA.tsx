'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('sending');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? '',
          subject: 'NeuralPulse Newsletter Signup',
          from_name: 'Newsletter Subscriber',
          email,
          message: `New newsletter signup: ${email}`,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="relative rounded-xl overflow-hidden glass border border-violet-500/20">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 to-transparent" />
      <div className="relative p-5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center mb-3">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h4 className="text-sm font-bold text-white mb-1">Daily AI Digest</h4>
        <p className="text-xs text-slate-400 mb-4">Get the top AI stories delivered to your inbox every morning.</p>

        {status === 'sent' ? (
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            You're subscribed! Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors flex-shrink-0"
            >
              {status === 'sending' ? '...' : 'Join'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-[11px] text-rose-400 mt-2">Something went wrong. Try again.</p>
        )}
      </div>
    </div>
  );
}
