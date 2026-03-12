'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu, Zap } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Daily AI' },
  { href: '/tools', label: 'AI Tools' },
  { href: '/open-source', label: 'Open Source' },
  { href: '/sap-ai', label: 'SAP AI Hub' },
];

export function Navbar() {
  const pathname = usePathname();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-violet-500/40 transition-shadow duration-300">
            <Cpu className="w-4 h-4 text-white" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-600/50 to-cyan-500/50 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="font-bold text-base tracking-tight">
            <span className="text-white">Neural</span>
            <span className="gradient-text">Pulse</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-violet-300 bg-violet-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.07]">
            <span className="live-dot" />
            <span className="text-xs font-medium text-slate-400">Live</span>
          </div>
          {/* Date */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Zap className="w-3 h-3 text-violet-400" />
            {today}
          </div>
        </div>
      </div>
    </header>
  );
}
