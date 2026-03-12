import type { NewsCategory, SAPProduct } from './types';

export function getCategoryBadgeClass(category: NewsCategory | string): string {
  const map: Record<string, string> = {
    'Model Release': 'badge-violet',
    'Tool Launch': 'badge-cyan',
    Research: 'badge-indigo',
    'Open Source': 'badge-emerald',
    'SAP AI': 'badge-sap',
    Industry: 'badge-sky',
    Framework: 'badge-orange',
  };
  return map[category] ?? 'badge-violet';
}

export function getSAPProductColor(product: SAPProduct | string): string {
  const map: Record<string, string> = {
    Joule: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
    'AI Core': 'text-violet-300 bg-violet-500/15 border-violet-500/30',
    'Generative AI Hub': 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30',
    'Business AI': 'text-sky-300 bg-sky-500/15 border-sky-500/30',
    BTP: 'text-orange-300 bg-orange-500/15 border-orange-500/30',
    Community: 'text-rose-300 bg-rose-500/15 border-rose-500/30',
  };
  return map[product] ?? 'text-slate-300 bg-white/10 border-white/15';
}

export function getUpdateTypeColor(type: string): string {
  const map: Record<string, string> = {
    Release: 'badge-emerald',
    Feature: 'badge-cyan',
    Announcement: 'badge-violet',
    'Deep Dive': 'badge-orange',
    Community: 'badge-rose',
  };
  return map[type] ?? 'badge-indigo';
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
