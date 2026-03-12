import Link from 'next/link';
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
                <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
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
