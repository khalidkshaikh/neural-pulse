'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, ChevronDown } from 'lucide-react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface ChatbotProps {
  articleContext: string;
  digestSummary: string;
}

const GROQ_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY ?? '';

// Render assistant message - strips markdown stars, formats lists & paragraphs
function renderMessage(text: string) {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '') {
      nodes.push(<div key={key++} className="h-1.5" />);
      continue;
    }

    // Inline: strip **bold** stars and render the content
    const parseInline = (str: string): React.ReactNode[] =>
      str.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**'))
          return <span key={j} className="font-semibold text-slate-100">{part.slice(2, -2)}</span>;
        if (part.startsWith('*') && part.endsWith('*'))
          return <em key={j}>{part.slice(1, -1)}</em>;
        return part;
      });

    // Bullet list
    if (trimmed.match(/^[-•]\s/)) {
      nodes.push(
        <div key={key++} className="flex gap-2 mt-1 leading-snug">
          <span className="text-violet-400 flex-shrink-0 select-none">•</span>
          <span>{parseInline(trimmed.replace(/^[-•]\s/, ''))}</span>
        </div>
      );
      continue;
    }

    // Numbered list
    if (trimmed.match(/^\d+\.\s/)) {
      const num = trimmed.match(/^(\d+)\./)?.[1];
      nodes.push(
        <div key={key++} className="flex gap-2 mt-1 leading-snug">
          <span className="text-violet-400 font-medium flex-shrink-0 select-none">{num}.</span>
          <span>{parseInline(trimmed.replace(/^\d+\.\s/, ''))}</span>
        </div>
      );
      continue;
    }

    nodes.push(<p key={key++} className="leading-relaxed">{parseInline(trimmed)}</p>);
  }

  return <div className="space-y-0.5 text-sm">{nodes}</div>;
}

function buildSystemPrompt(context: string) {
  return `You are NeuralPulse AI - the intelligent assistant for NeuralPulse, an automated AI & SAP news intelligence platform. You help users understand the latest developments in artificial intelligence and SAP's AI ecosystem.

SCOPE: Only answer questions related to:
- Artificial intelligence, machine learning, LLMs, AI tools, AI research
- SAP AI products: Joule, AI Core, Generative AI Hub, Business AI, BTP
- News and trends covered on NeuralPulse

If asked about unrelated topics, politely redirect to AI/SAP.
NEVER generate or describe images, videos, or media. Text answers only.
Keep answers concise (2-4 sentences for simple questions, up to 6 for complex ones).

FORMATTING RULES - strictly follow these:
- Do NOT use asterisks (**), stars, or any markdown symbols whatsoever.
- Do NOT use bold markers or italic markers.
- Use plain sentences. For lists, use a dash followed by a space: "- item".
- Separate paragraphs with a single blank line.
- Structure answers clearly with short sentences and natural line breaks only.

LATEST NEWS CONTEXT (use this to ground your answers):
${context}`;
}

export function Chatbot({ articleContext, digestSummary }: ChatbotProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: digestSummary },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const next: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROQ_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          max_tokens: 300,
          temperature: 0.5,
          messages: [
            { role: 'system', content: buildSystemPrompt(articleContext) },
            ...next.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message ?? `API error ${res.status}`);
      }
      const reply = data.choices?.[0]?.message?.content?.trim() ?? 'Sorry, I could not generate a response.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = [
    'What are today\'s top AI stories?',
    'What is SAP Joule?',
    'Latest LLM releases this week',
    'How does SAP AI Core work?',
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg shadow-violet-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-violet-500/50 ${open ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100'}`}
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-surface-950 animate-pulse" />
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[400px] transition-all duration-300 ease-out ${
          open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <div className="glass border border-white/[0.1] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col h-[580px] sm:h-[600px]">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07] bg-gradient-to-r from-violet-900/40 to-cyan-900/20 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">NeuralPulse AI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-500">Grounded in today&apos;s AI & SAP news</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-violet-600/80 text-white text-sm leading-relaxed rounded-br-sm'
                      : 'bg-white/[0.06] border border-white/[0.08] text-slate-300 rounded-bl-sm'
                  }`}
                >
                  {msg.role === 'assistant' ? renderMessage(msg.content) : msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="bg-white/[0.06] border border-white/[0.08] rounded-xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions (only if first message) */}
          {messages.length === 1 && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-white/[0.07] flex-shrink-0">
            <div className="flex gap-2 items-center bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 focus-within:border-violet-500/40 transition-colors">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="Ask about AI or SAP…"
                className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-7 h-7 rounded-lg bg-violet-600 disabled:bg-white/10 flex items-center justify-center transition-colors hover:bg-violet-500 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <p className="text-[10px] text-slate-700 text-center mt-1.5">AI answers may be inaccurate - verify with sources</p>
          </div>
        </div>
      </div>

      {/* Backdrop on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
