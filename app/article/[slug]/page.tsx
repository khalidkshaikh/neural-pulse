import { getArticles } from '@/lib/getData';
import { getCategoryBadgeClass, timeAgo } from '@/lib/utils';
import { Clock, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleCover } from '@/components/ArticleCover';
import { ShareButton } from '@/components/ShareButton';
import { ReadingProgress } from '@/components/ReadingProgress';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const articles = getArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = articles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pb-16">
      <ReadingProgress />

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        {/* Article */}
        <div>
          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Daily AI
          </Link>

          {/* Hero cover */}
          <div className="relative w-full h-52 sm:h-72 rounded-2xl overflow-hidden mb-8">
            <ArticleCover category={article.category} slug={article.slug} />
            {/* Extra dark gradient so text below isn't competing */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Category + read time chip */}
            <div className="absolute bottom-5 left-5 flex items-center gap-2">
              <span className={`badge ${getCategoryBadgeClass(article.category)}`}>
                {article.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-300 bg-black/40 backdrop-blur-sm rounded px-2 py-0.5">
                <Clock className="w-3 h-3" />
                {article.readTime} min read
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
              {article.title}
            </h1>

            <p className="text-xl text-slate-400 font-light leading-relaxed mb-6">
              {article.summary}
            </p>

            <div className="flex items-center justify-between py-4 border-y border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                  {article.source[0]}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-300">{article.source}</div>
                  <div className="text-xs text-slate-600">{timeAgo(article.publishedAt)}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Source
                </a>
                <ShareButton title={article.title} />
              </div>
            </div>
          </div>

          {/* Article body */}
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="space-y-5 text-slate-300 leading-relaxed">
              <p className="text-lg text-slate-200 font-light">
                {article.summary}
              </p>
              <p>
                This development represents a significant milestone in the AI industry, building upon
                recent advances in machine learning and neural network architectures. Industry experts
                have been closely monitoring these trends, and the implications extend across multiple
                sectors including research, enterprise applications, and open-source communities.
              </p>
              <p>
                Organizations and practitioners watching this space will want to evaluate how this fits
                into their existing workflows, toolchains, and strategic roadmaps. The rapid pace of
                innovation in AI demands continuous evaluation of new tools and methodologies.
              </p>
              <div className="glass rounded-xl p-5 border border-white/[0.07] my-6">
                <h3 className="text-base font-bold text-white mb-3">Key Takeaways</h3>
                <ul className="space-y-2">
                  {article.tags.map((tag) => (
                    <li key={tag} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                      Coverage includes: <strong className="text-white">{tag}</strong>
                    </li>
                  ))}
                </ul>
              </div>
              <h3 className="text-lg font-bold text-white mt-8 mb-3">Industry Impact</h3>
              <p>
                The announcement has sparked discussions across the AI community, with particular focus on
                how this will affect competition among major AI labs and open-source projects. Research
                institutions are already exploring applications in their respective domains.
              </p>
              <h3 className="text-lg font-bold text-white mt-8 mb-3">Looking Ahead</h3>
              <p>
                As the AI landscape continues to evolve, staying informed about these developments is
                crucial for technology professionals. NeuralPulse will continue monitoring this story
                and providing updates as more information becomes available from primary sources.
              </p>
              <div className="glass rounded-xl p-5 border border-white/[0.07] my-6 bg-violet-900/10">
                <h3 className="text-base font-bold text-white mb-3">Related Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.slice(0, 4).map((tag) => (
                    <Link
                      key={tag}
                      href={`/?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-violet-500/20 border border-violet-500/30 text-violet-300 hover:bg-violet-500/30 transition-all"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-500 italic">
                This article was automatically generated from aggregated sources by the NeuralPulse
                AI pipeline. Content is synthesized and reformulated - always refer to the original
                source for full details.
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <p className="text-xs text-slate-600 mb-3 font-semibold uppercase tracking-wide">Tags</p>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?q=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {related.length > 0 && (
            <div className="glass rounded-xl p-5 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-4">
                <div className="section-accent" />
                <h3 className="text-sm font-bold text-slate-200">Related Articles</h3>
              </div>
              <div className="space-y-1">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/article/${r.slug}`}
                    className="block py-3 border-b border-white/[0.05] last:border-0 group"
                  >
                    <div className="flex items-start gap-2">
                      <span className={`badge text-[10px] flex-shrink-0 mt-0.5 ${getCategoryBadgeClass(r.category)}`}>
                        {r.category}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-300 group-hover:text-white mt-1 leading-snug line-clamp-2 transition-colors">
                      {r.title}
                    </p>
                    <span className="text-xs text-slate-600 mt-1 block">{timeAgo(r.publishedAt)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl p-4 bg-amber-500/5 border border-amber-500/15">
            <p className="text-xs text-amber-300/80 leading-relaxed">
              <strong className="text-amber-300">AI-generated content.</strong> This article was
              synthesized automatically from multiple sources. Always verify claims with primary
              sources before acting on this information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
