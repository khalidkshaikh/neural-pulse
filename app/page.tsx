import { Hero } from '@/components/Hero';
import { LiveTicker } from '@/components/LiveTicker';
import { FeaturedArticle } from '@/components/FeaturedArticle';
import { ArticleGrid } from '@/components/ArticleGrid';
import { TrendingTopics } from '@/components/TrendingTopics';
import { AISummaryWidget } from '@/components/AISummaryWidget';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SAPCard } from '@/components/SAPCard';
import { getArticles, getSAPUpdates } from '@/lib/getData';
import { timeAgo } from '@/lib/utils';
import { ArrowRight, Cpu } from 'lucide-react';
import Link from 'next/link';
import { NewsletterCTA } from '@/components/NewsletterCTA';

export default function HomePage() {
  const newsArticles = getArticles();
  const sapUpdates = getSAPUpdates();
  const featuredArticle = newsArticles.find((a) => a.featured) ?? newsArticles[0];
  const gridArticles = newsArticles.filter((a) => !a.featured);
  const latestSAPUpdates = sapUpdates.filter((u) => !u.isWeeklyDigest).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      <Hero
        articlesToday={newsArticles.length}
        sourcesMonitored={87}
        lastUpdated={timeAgo(featuredArticle.publishedAt)}
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
          {/* Article grid with load more */}
          <ArticleGrid articles={gridArticles} />

          {/* Sidebar */}
          <div className="space-y-6">
            <AISummaryWidget />
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
