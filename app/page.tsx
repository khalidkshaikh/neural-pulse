import { Hero } from '@/components/Hero';
import { LiveTicker } from '@/components/LiveTicker';
import { FeaturedArticle } from '@/components/FeaturedArticle';
import { NewsCard } from '@/components/NewsCard';
import { TrendingTopics } from '@/components/TrendingTopics';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SAPCard } from '@/components/SAPCard';
import { newsArticles, sapUpdates } from '@/lib/mockData';
import { ArrowRight, Cpu } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const featuredArticle = newsArticles.find((a) => a.featured) ?? newsArticles[0];
  const gridArticles = newsArticles.filter((a) => !a.featured).slice(0, 9);
  const latestSAPUpdates = sapUpdates.filter((u) => !u.isWeeklyDigest).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      <Hero
        articlesToday={newsArticles.length}
        sourcesMonitored={87}
        lastUpdated="2 min ago"
      />

      <LiveTicker />

      {/* Main content area */}
      <div className="mt-10">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="section-accent" />
            <h2 className="text-lg font-bold text-slate-100">Today in AI</h2>
            <span className="badge bg-white/5 text-slate-500 border-white/10 text-[10px]">
              {newsArticles.length} stories
            </span>
          </div>
          <CategoryFilter />
        </div>

        {/* Featured article */}
        <div className="mb-8">
          <FeaturedArticle article={featuredArticle} />
        </div>

        {/* News grid + sidebar */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Article grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gridArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TrendingTopics />

            {/* SAP AI preview */}
            <div className="glass rounded-xl p-5 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-4">
                <div className="section-accent-emerald" />
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-200">SAP AI Updates</h3>
                </div>
              </div>
              <div className="space-y-1">
                {latestSAPUpdates.map((update) => (
                  <SAPCard key={update.id} update={update} showTimeline={false} />
                ))}
              </div>
              <Link
                href="/sap-ai"
                className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                View all SAP AI updates
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Newsletter */}
            <NewsletterCTA />
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsletterCTA() {
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
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all"
          />
          <button className="px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors flex-shrink-0">
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
