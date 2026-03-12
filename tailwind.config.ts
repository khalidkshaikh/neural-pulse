import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          violet: '#7c3aed',
          'violet-light': '#a78bfa',
          'violet-dim': 'rgba(124,58,237,0.15)',
          cyan: '#06b6d4',
          'cyan-light': '#67e8f9',
          'cyan-dim': 'rgba(6,182,212,0.15)',
          emerald: '#10b981',
          'emerald-light': '#34d399',
          'emerald-dim': 'rgba(16,185,129,0.15)',
          orange: '#f97316',
          'orange-light': '#fb923c',
          'orange-dim': 'rgba(249,115,22,0.15)',
          rose: '#f43f5e',
          'rose-dim': 'rgba(244,63,94,0.15)',
          indigo: '#4f46e5',
          'indigo-light': '#818cf8',
        },
        surface: {
          950: '#020817',
          900: '#0a0f1e',
          800: '#0d1117',
          700: '#131a26',
          600: '#1a2235',
          500: '#1e293b',
          400: '#263148',
        },
      },
      animation: {
        'aurora-1': 'aurora-1 15s ease-in-out infinite',
        'aurora-2': 'aurora-2 18s ease-in-out infinite',
        'aurora-3': 'aurora-3 12s ease-in-out infinite',
        'ticker': 'ticker 50s linear infinite',
        'fade-up': 'fade-up 0.7s ease-out both',
        'fade-up-delay': 'fade-up 0.7s ease-out 0.15s both',
        'fade-up-delay-2': 'fade-up 0.7s ease-out 0.3s both',
        'scale-in': 'scale-in 0.4s ease-out both',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'aurora-1': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.4' },
          '33%': { transform: 'translate(80px, 40px) scale(1.1)', opacity: '0.6' },
          '66%': { transform: 'translate(-40px, 80px) scale(0.9)', opacity: '0.3' },
        },
        'aurora-2': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.3' },
          '50%': { transform: 'translate(-60px, -40px) scale(1.2)', opacity: '0.5' },
        },
        'aurora-3': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.25' },
          '40%': { transform: 'translate(60px, -30px) scale(0.95)', opacity: '0.4' },
          '80%': { transform: 'translate(-30px, 50px) scale(1.1)', opacity: '0.2' },
        },
        'ticker': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.93)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.8)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
