'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  // Sync with the html class that was set by the anti-FOUC script
  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('np-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('np-theme', 'light');
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="
        w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
        bg-black/5 dark:bg-white/5
        border border-black/8 dark:border-white/10
        text-slate-500 dark:text-slate-400
        hover:bg-black/10 dark:hover:bg-white/10
        hover:text-slate-700 dark:hover:text-slate-200
      "
    >
      {dark
        ? <Sun  className="w-3.5 h-3.5" />
        : <Moon className="w-3.5 h-3.5" />
      }
    </button>
  );
}
