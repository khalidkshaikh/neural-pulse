/**
 * NeuralPulse — Daily News Fetcher
 *
 * Fetches from real RSS/API sources, optionally summarizes with Claude,
 * and writes to data/articles.json and data/sap-updates.json
 *
 * Usage:
 *   node scripts/fetch-news.mjs
 *
 * Env vars (set in GitHub Actions secrets):
 *   ANTHROPIC_API_KEY  — optional, for AI-powered summaries
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ─── RSS Sources ─────────────────────────────────────────────────────────────

const AI_SOURCES = [
  { name: 'OpenAI Blog',       url: 'https://openai.com/blog/rss.xml',                                     category: 'Model Release' },
  { name: 'Anthropic Blog',    url: 'https://www.anthropic.com/rss.xml',                                   category: 'Research' },
  { name: 'Hugging Face Blog', url: 'https://huggingface.co/blog/feed.xml',                                category: 'Open Source' },
  { name: 'Google DeepMind',   url: 'https://deepmind.google/blog/rss',                                    category: 'Model Release' },
  { name: 'Meta AI Blog',      url: 'https://ai.meta.com/blog/rss/',                                       category: 'Model Release' },
  { name: 'Mistral AI Blog',   url: 'https://mistral.ai/news/rss.xml',                                     category: 'Model Release' },
  { name: 'TechCrunch AI',     url: 'https://techcrunch.com/category/artificial-intelligence/feed/',       category: 'Industry' },
  { name: 'The Verge AI',      url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',   category: 'Industry' },
  { name: 'MIT Tech Review AI','url': 'https://www.technologyreview.com/topic/artificial-intelligence/feed', category: 'Research' },
  { name: 'VentureBeat AI',    url: 'https://venturebeat.com/category/ai/feed/',                           category: 'Industry' },
  { name: 'ArXiv CS.AI',       url: 'https://rss.arxiv.org/rss/cs.AI',                                    category: 'Research' },
  { name: 'LangChain Blog',    url: 'https://blog.langchain.dev/rss/',                                     category: 'Framework' },
  { name: 'Towards Data Science', url: 'https://towardsdatascience.com/feed',                              category: 'Research' },
];

const SAP_SOURCES = [
  { name: 'SAP News Center',   url: 'https://news.sap.com/feed/', product: 'Business AI' },
  { name: 'SAP Community AI',  url: 'https://community.sap.com/khhcw49343/rss/category?category.id=Artificial+Intelligence', product: 'Community' },
  { name: 'SAP BTP Blog',      url: 'https://blogs.sap.com/tag/sap-btp/feed/', product: 'BTP' },
  { name: 'SAP AI Core Blog',  url: 'https://blogs.sap.com/tag/sap-ai-core/feed/', product: 'AI Core' },
  { name: 'SAP Joule Blog',    url: 'https://blogs.sap.com/tag/joule/feed/', product: 'Joule' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i'))
    || xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return match ? match[1].trim().replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'") : '';
}

function extractItems(feedXml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(feedXml)) !== null) {
    const block = match[1];
    const title = extractTag(block, 'title');
    const link  = extractTag(block, 'link') || extractTag(block, 'guid');
    const desc  = extractTag(block, 'description') || extractTag(block, 'summary') || extractTag(block, 'content:encoded');
    const pubDate = extractTag(block, 'pubDate') || extractTag(block, 'published') || extractTag(block, 'dc:date');
    if (title && link) items.push({ title, link, desc, pubDate });
  }
  return items;
}

async function fetchFeed(url, timeoutMs = 8000) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'NeuralPulse-Bot/1.0 (AI news aggregator; +https://neuralpulse.app)' },
    });
    clearTimeout(id);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function slug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

function truncate(text, max = 280) {
  if (!text || text.length <= max) return text ?? '';
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

function guessCategory(title, desc, defaultCat) {
  const text = (title + ' ' + desc).toLowerCase();
  if (/sap\s+(ai|joule|btp|hana|ariba|s\/4)/i.test(text)) return 'SAP AI';
  if (/\bopen.?source\b|github|llama|mistral|phi-|gemma/i.test(text)) return 'Open Source';
  if (/\bframework|sdk|library|langchain|llamaindex|pytorch|jax\b/i.test(text)) return 'Framework';
  if (/\bresearch|paper|arxiv|benchmark|study|university/i.test(text)) return 'Research';
  if (/\blaunch|release|v\d\.|new model|model card|weights/i.test(text)) return 'Model Release';
  if (/\btool|product|startup|raises|\$\d+m|funding/i.test(text)) return 'Tool Launch';
  return defaultCat;
}

function guessSAPProduct(title, desc) {
  const text = (title + ' ' + desc).toLowerCase();
  if (/joule/i.test(text)) return 'Joule';
  if (/generative ai hub/i.test(text)) return 'Generative AI Hub';
  if (/ai core/i.test(text)) return 'AI Core';
  if (/business ai/i.test(text)) return 'Business AI';
  if (/btp|business technology/i.test(text)) return 'BTP';
  return 'Community';
}

function extractTags(title, desc) {
  const text = title + ' ' + desc;
  const known = [
    'GPT-4','GPT-5','Claude','Llama','Gemini','Mistral','Phi','Gemma','DeepSeek',
    'PyTorch','LangChain','LlamaIndex','Hugging Face','OpenAI','Anthropic',
    'Google','Meta','Microsoft','SAP','Joule','AI Core','HANA',
    'RAG','Agent','Fine-tuning','RLHF','Transformer','Attention',
    'Benchmark','SWE-bench','MMLU','HumanEval','open-source','inference',
  ];
  return known.filter(k => new RegExp(k, 'i').test(text)).slice(0, 4);
}

const imageGradients = [
  'from-violet-900/60 via-violet-800/40 to-surface-950',
  'from-cyan-900/60 via-cyan-800/40 to-surface-950',
  'from-emerald-900/60 via-emerald-800/40 to-surface-950',
  'from-blue-900/60 via-blue-800/40 to-surface-950',
  'from-rose-900/60 via-rose-800/40 to-surface-950',
  'from-orange-900/60 via-orange-800/40 to-surface-950',
  'from-indigo-900/60 via-indigo-800/40 to-surface-950',
  'from-sky-900/60 via-sky-800/40 to-surface-950',
];

// ─── Optional: Claude AI summaries ───────────────────────────────────────────

async function aiSummarize(title, rawDesc) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !rawDesc) return truncate(rawDesc, 280);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 120,
        messages: [{
          role: 'user',
          content: `Summarize this AI news article in 1-2 concise sentences (max 200 chars). Focus on what's new and why it matters. No filler phrases.\n\nTitle: ${title}\nContent: ${rawDesc.slice(0, 800)}`,
        }],
      }),
    });
    if (!res.ok) return truncate(rawDesc, 280);
    const data = await res.json();
    return data.content?.[0]?.text?.trim() ?? truncate(rawDesc, 280);
  } catch {
    return truncate(rawDesc, 280);
  }
}

// ─── Main fetch logic ─────────────────────────────────────────────────────────

async function fetchAINews() {
  console.log('🔍 Fetching AI news from', AI_SOURCES.length, 'sources...');
  const articles = [];
  let idx = 0;

  for (const source of AI_SOURCES) {
    console.log('  →', source.name);
    const xml = await fetchFeed(source.url);
    if (!xml) { console.log('    ✗ failed'); continue; }

    const items = extractItems(xml).slice(0, 5); // top 5 per source
    for (const item of items) {
      const summary = await aiSummarize(item.title, item.desc);
      const category = guessCategory(item.title, item.desc, source.category);
      articles.push({
        id: String(++idx),
        slug: slug(item.title) + '-' + idx,
        title: item.title.slice(0, 120),
        summary,
        category,
        source: source.name,
        sourceUrl: item.link,
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        readTime: Math.max(2, Math.round(summary.split(' ').length / 200 * 5)),
        tags: extractTags(item.title, item.desc),
        featured: idx === 1,
        imageGradient: imageGradients[idx % imageGradients.length],
      });
    }
  }

  // Sort by most recent
  articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  articles[0] = { ...articles[0], featured: true };

  console.log(`✅ Collected ${articles.length} AI articles`);
  return articles;
}

async function fetchSAPNews() {
  console.log('\n🟢 Fetching SAP AI updates from', SAP_SOURCES.length, 'sources...');
  const updates = [];
  let idx = 0;

  for (const source of SAP_SOURCES) {
    console.log('  →', source.name);
    const xml = await fetchFeed(source.url);
    if (!xml) { console.log('    ✗ failed'); continue; }

    const items = extractItems(xml).slice(0, 4);
    for (const item of items) {
      const summary = await aiSummarize(item.title, item.desc);
      const product = guessSAPProduct(item.title, item.desc) ?? source.product;
      updates.push({
        id: String(++idx),
        title: item.title.slice(0, 120),
        summary,
        product,
        updateType: idx === 1 && product !== 'Community' ? 'Release' : (product === 'Community' ? 'Community' : 'Feature'),
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        sourceUrl: item.link,
        isNew: true,
        isWeeklyDigest: false,
        tags: extractTags(item.title, item.desc),
      });
    }
  }

  // Add a weekly digest entry
  if (updates.length > 0) {
    updates.unshift({
      id: '0',
      title: `Weekly SAP AI Digest — Week of ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
      summary: `This week in SAP AI: ${updates.slice(0, 3).map(u => u.title.split(':')[0]).join(', ')} and more. Full roundup of Joule, AI Core, Generative AI Hub, and SAP Business AI updates.`,
      product: 'Community',
      updateType: 'Deep Dive',
      publishedAt: new Date().toISOString(),
      sourceUrl: '#',
      isNew: false,
      isWeeklyDigest: true,
      tags: ['Weekly Digest', 'SAP AI'],
    });
  }

  // Sort by most recent (non-digest first)
  updates.sort((a, b) => {
    if (a.isWeeklyDigest) return -1;
    if (b.isWeeklyDigest) return 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  console.log(`✅ Collected ${updates.length} SAP AI updates`);
  return updates;
}

// ─── Entry point ──────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 NeuralPulse daily fetch starting...\n');

  const [articles, sapUpdates] = await Promise.all([
    fetchAINews(),
    fetchSAPNews(),
  ]);

  // If fetch yielded nothing (rate limits, blocked), keep existing data
  const articlesPath = resolve(ROOT, 'data/articles.json');
  const sapPath      = resolve(ROOT, 'data/sap-updates.json');

  if (articles.length > 0) {
    writeFileSync(articlesPath, JSON.stringify(articles, null, 2));
    console.log(`\n💾 Wrote ${articles.length} articles → data/articles.json`);
  } else {
    console.log('\n⚠️  No articles fetched, keeping existing data.');
  }

  if (sapUpdates.length > 0) {
    writeFileSync(sapPath, JSON.stringify(sapUpdates, null, 2));
    console.log(`💾 Wrote ${sapUpdates.length} SAP updates → data/sap-updates.json`);
  } else {
    console.log('⚠️  No SAP updates fetched, keeping existing data.');
  }

  console.log('\n✨ Done!');
}

main().catch(console.error);
