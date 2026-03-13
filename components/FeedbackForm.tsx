'use client';

import { useState } from 'react';
import { MessageSquarePlus, X, Star, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export function FeedbackForm() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) return;
    setStatus('sending');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? '',
          subject: `NeuralPulse Feedback — ${rating}/5 stars from ${form.name}`,
          from_name: form.name,
          email: form.email,
          message: `Rating: ${rating}/5 stars\n\n${form.message}`,
          botcheck: '',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus('sent');
        setTimeout(() => {
          setOpen(false);
          setStatus('idle');
          setForm({ name: '', email: '', message: '' });
          setRating(0);
        }, 2800);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  const activeRating = hovered || rating;

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 left-4 z-40 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600 text-white text-xs font-semibold shadow-lg shadow-violet-500/25 hover:scale-105 hover:shadow-violet-500/40 transition-all"
        aria-label="Send feedback"
      >
        <MessageSquarePlus className="w-4 h-4" />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          {/* Modal */}
          <div className="glass w-full max-w-md rounded-2xl border border-white/10 shadow-2xl shadow-violet-500/10 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
              <div>
                <h2 className="text-sm font-bold text-slate-100">Share Your Feedback</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Help us improve NeuralPulse</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Sent state */}
            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center py-12 px-5 gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-sm font-semibold text-slate-100">Thank you for your feedback!</p>
                <p className="text-xs text-slate-500 text-center">Your response has been received and will help shape NeuralPulse.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Star rating */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">
                    Overall Rating <span className="text-rose-400">*</span>
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            star <= activeRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-2 text-xs text-slate-400">
                        {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}
                      </span>
                    )}
                  </div>
                  {!rating && status === 'error' && (
                    <p className="text-[11px] text-rose-400 mt-1">Please select a rating</p>
                  )}
                </div>

                {/* Name + Email */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="What do you think? What could be better?"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
                  />
                </div>

                {/* Error */}
                {status === 'error' && (
                  <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    Failed to send. Please try again or email directly.
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {status === 'sending' ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit Feedback
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
