import Link from 'next/link';
import Image from 'next/image';
import { Cpu, Github, Twitter, Rss } from 'lucide-react';

const navSections = [
  {
    title: 'Sections',
    links: [
      { label: 'Daily AI News', href: '/' },
      { label: 'AI Tools Tracker', href: '/tools' },
      { label: 'Open Source AI', href: '/open-source' },
      { label: 'SAP AI Hub', href: '/sap-ai' },
    ],
  },
  {
    title: 'Topics',
    links: [
      { label: 'Model Releases', href: '/?cat=Model+Release' },
      { label: 'Research Papers', href: '/?cat=Research' },
      { label: 'AI Frameworks', href: '/?cat=Framework' },
      { label: 'Industry News', href: '/?cat=Industry' },
    ],
  },
  {
    title: 'SAP AI',
    links: [
      { label: 'SAP Joule', href: '/sap-ai?product=Joule' },
      { label: 'SAP AI Core', href: '/sap-ai?product=AI+Core' },
      { label: 'Generative AI Hub', href: '/sap-ai?product=Generative+AI+Hub' },
      { label: 'SAP Business AI', href: '/sap-ai?product=Business+AI' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="page-content mt-20">
      <div className="footer-top-line" />
      <div className="bg-surface-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                  <Cpu className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-sm">
                  <span className="text-white">Neural</span>
                  <span className="gradient-text">Pulse</span>
                </span>
              </Link>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                The Bloomberg terminal for AI news. Automated daily intelligence on AI model releases,
                tools, open-source projects, and SAP AI ecosystem updates.
              </p>
              <div className="flex items-center gap-2">
                <a href="https://github.com/xdrkzx1/neural-pulse" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Github className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Twitter className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Rss className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Nav sections */}
            {navSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Built by */}
          <div className="glass rounded-xl p-4 border border-white/[0.07] mb-6 flex items-center gap-4">
            <a
              href="https://linkedin.com/in/or-khalid-shaikh/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0"
            >
              <div className="w-11 h-11 rounded-xl overflow-hidden ring-2 ring-violet-500/40 shadow-lg shadow-violet-500/20 hover:scale-105 transition-transform flex-shrink-0">
                <Image src="/author.png" alt="Khalid Shaikh" width={44} height={44} className="w-full h-full object-cover" />
              </div>
            </a>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 mb-0.5">Designed &amp; built by</p>
              <a
                href="https://linkedin.com/in/or-khalid-shaikh/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-slate-200 hover:text-violet-300 transition-colors"
              >
                Khalid Shaikh
              </a>
              <p className="text-[11px] text-slate-600 mt-0.5">
                AI &amp; SAP Technology Enthusiast
              </p>
            </div>
            <a
              href="https://linkedin.com/in/or-khalid-shaikh/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold hover:bg-blue-600/30 transition-colors"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>

          <div className="divider mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-600">
              © 2026 NeuralPulse. AI-generated content — always verify with primary sources.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-400 transition-colors">RSS Feed</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
