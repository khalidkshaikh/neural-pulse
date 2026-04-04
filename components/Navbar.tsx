'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Cpu, Zap, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'Daily AI' },
  { href: '/tools', label: 'AI Tools' },
  { href: '/open-source', label: 'Open Source' },
  { href: '/sap-ai', label: 'SAP AI Hub' },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  function isActive(href: string) {
    return href === '/' ? pathname === '/' : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-black/[0.06] dark:border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group" onClick={() => setMenuOpen(false)}>
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-violet-500/40 transition-shadow duration-300">
            <Cpu className="w-4 h-4 text-white" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-600/50 to-cyan-500/50 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="font-bold text-base tracking-tight">
            <span className="text-slate-900 dark:text-white">Neural</span>
            <span className="gradient-text">Pulse</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3.5 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? 'text-violet-600 dark:text-violet-300 bg-violet-500/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.07] dark:border-white/[0.07]">
            <span className="live-dot" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Live</span>
          </div>

          {/* Date */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500 font-medium">
            <Zap className="w-3 h-3 text-violet-400" />
            {today}
          </div>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Hamburger - mobile only */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.07] dark:border-white/[0.07] text-slate-600 dark:text-slate-400 hover:bg-black/[0.07] dark:hover:bg-white/[0.07] transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-black/[0.06] dark:border-white/[0.06] px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-violet-600 dark:text-violet-300 bg-violet-500/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {isActive(link.href) && (
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex-shrink-0" />
              )}
              <span className={isActive(link.href) ? '' : 'ml-[14px]'}>{link.label}</span>
            </Link>
          ))}

          {/* Live + date row */}
          <div className="flex items-center gap-3 px-3 pt-1 pb-1">
            <div className="flex items-center gap-2">
              <span className="live-dot" />
              <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">Live</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-violet-400" />
              <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">{today}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
