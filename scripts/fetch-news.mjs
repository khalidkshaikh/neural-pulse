/**
 * NeuralPulse — Daily News Fetcher
 *
 * Fetches from real RSS/API sources, summarizes with AI, and writes
 * to data/articles.json and data/sap-updates.json
 *
 * Usage:
 *   node scripts/fetch-news.mjs
 *
 * Env vars (set in GitHub Actions secrets) — first found is used:
 *   GROQ_API_KEY       — free at console.groq.com  ← recommended
 *   ANTHROPIC_API_KEY  — paid, claude-haiku-4-5
 *   (none)             — falls back to raw RSS description
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ─── Auto-load .env.local for local development ───────────────────────────────
// In GitHub Actions, secrets are real env vars — this block is a no-op there.
try {
  const envPath = resolve(ROOT, '.env.local');
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx < 1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
      // Map NEXT_PUBLIC_ prefix → bare name for server-side use
      if (key === 'NEXT_PUBLIC_GROQ_API_KEY'     && !process.env.GROQ_API_KEY)      process.env.GROQ_API_KEY = val;
      if (key === 'NEXT_PUBLIC_ANTHROPIC_API_KEY' && !process.env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = val;
    }
  }
} catch { /* silently skip — env vars already provided */ }

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
  { name: 'MIT Tech Review AI', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', category: 'Research' },
  { name: 'VentureBeat AI',    url: 'https://venturebeat.com/category/ai/feed/',                           category: 'Industry' },
  { name: 'ArXiv CS.AI',       url: 'https://rss.arxiv.org/rss/cs.AI',                                    category: 'Research' },
  { name: 'LangChain Blog',    url: 'https://blog.langchain.dev/rss/',                                     category: 'Framework' },
  { name: 'Towards Data Science', url: 'https://towardsdatascience.com/feed',                              category: 'Research' },
  { name: 'Wired AI',          url: 'https://www.wired.com/feed/tag/ai/feed',         category: 'Industry' },
  { name: 'Bloomberg AI',      url: 'https://feeds.bloomberg.com/markets/news.rss', category: 'Industry' },
  { name: 'Reuters AI',        url: 'https://www.reutersagency.com/feed/?best-topics=tech', category: 'Industry' },
  { name: 'ZDNet AI',          url: 'https://www.zdnet.com/news/rss.xml',             category: 'Industry' },
  { name: 'CNET AI',           url: 'https://www.cnet.com/rss/news/',                category: 'Industry' },
  { name: 'IEEE Spectrum',    url: 'https://spectrum.ieee.org/feeds/feed.rss',                            category: 'Research' },
  { name: 'Quanta Magazine',   url: 'https://api.allorigins.win/raw?url=https://www.quantamagazine.org/feed/', category: 'Research' },
  { name: 'Microsoft AI Blog', url: 'https://azure.microsoft.com/en-us/blog/search/rss/?q=AI',            category: 'Model Release' },
  { name: 'Nvidia Blog',       url: 'https://developer.nvidia.com/blog/feed/',                            category: 'Model Release' },
  { name: 'Amazon AI',         url: 'https://www.amazon.science/rss/',                                     category: 'Research' },
  { name: 'IBM Research',      url: 'https://www.research.ibm.com/rss/ai',                                 category: 'Research' },
  { name: 'Stability AI',      url: 'https://stability.ai/rss.xml',                                       category: 'Model Release' },
  { name: 'Cohere Blog',       url: 'https://cohere.com/blog/rss.xml',                                     category: 'Model Release' },
  { name: 'AI21 Labs',         url: 'https://www.ai21.com/blog/rss',                                       category: 'Model Release' },
  { name: 'DeepLearning.AI',   url: 'https://www.deeplearning.ai/feed/',                                   category: 'Research' },
  { name: 'Hugging Face RSS',  url: 'https://huggingface.co/blog/rss',                                    category: 'Open Source' },
  { name: 'Weights & Biases',  url: 'https://wandb.ai/articles/rss',                                      category: 'Framework' },
  { name: 'PyTorch Blog',      url: 'https://pytorch.org/blog/feed/',                                     category: 'Framework' },
  { name: 'TensorFlow Blog',   url: 'https://blog.tensorflow.org/feeds/posts/default',                    category: 'Framework' },
  { name: 'JAX Blog',          url: 'https://github.com/google/jax/releases.atom',                       category: 'Framework' },
  { name: 'MLOps Newsletter',   url: 'https://neptune.ai/blog/rss',                                         category: 'Tool Launch' },
  { name: 'Papers with Code',  url: 'https://paperswithcode.com/atom.xml',                                category: 'Research' },
  { name: 'Analytics Vidhya',  url: 'https://www.analyticsvidhya.com/feed/',                              category: 'Research' },
  { name: 'KDNuggets',         url: 'https://www.kdnuggets.com/feed/',                                      category: 'Research' },
  { name: 'Data Science Central', url: 'https://www.datasciencecentral.com/feed/',                       category: 'Research' },
  { name: 'OpenAI Research',   url: 'https://openai.com/research/rss.xml',                                category: 'Research' },
  { name: 'Anthropic Research', url: 'https://www.anthropic.com/research/rss.xml',                       category: 'Research' },
  { name: 'InfoQ',             url: 'https://www.infoq.com/ai/feed/',                                      category: 'Industry' },
  { name: 'DevOps.com',        url: 'https://devops.com/feed/',                                            category: 'Industry' },
  { name: 'TechTarget AI',     url: 'https://searchenterpriseai.techtarget.com/rss',                      category: 'Industry' },
  { name: 'AI News',           url: 'https://www.artificialintelligence-news.com/feed/',                  category: 'Industry' },
  { name: 'MarkTechPost',      url: 'https://www.marktechpost.com/feed/',                                  category: 'Industry' },
  { name: 'Synced Review',     url: 'https://syncedreview.com/feed/',                                      category: 'Industry' },
  { name: 'Unite AI',          url: 'https://unite.ai/feed',                                               category: 'Industry' },
  { name: 'Robusiness AI',     url: 'https://robusiness.ai/feed/',                                          category: 'Industry' },
  { name: 'AI Accelerator',    url: 'https://www.aiaccelerator.ai/feed/',                                  category: 'Industry' },
  { name: 'The Decoder',       url: 'https://the-decoder.com/feed/',                                        category: 'Industry' },
  { name: 'TechInPlainEnglish', url: 'https://techinplainenglish.com/feed/',                               category: 'Industry' },
  { name: 'AI Grimoire',       url: 'https://ai.grimoire.news/feed',                                       category: 'Industry' },
  { name: 'Anakin AI',         url: 'https://anakin.ai/blog/feed/',                                         category: 'Industry' },
  { name: 'Prompt Engineering', url: 'https://www.promptingguide.ai/blog/rss',                            category: 'Research' },
  { name: 'LangChain Labs',    url: 'https://blog.langchain.dev/rss/',                                     category: 'Framework' },
  { name: 'LlamaIndex Blog',    url: 'https://blog.llamaindex.ai/rss.xml',                                  category: 'Framework' },
  { name: 'AutoGPT Blog',      url: 'https://autogpt.net/feed/',                                            category: 'Framework' },
  { name: 'BabyAGI',           url: 'https://babyagi.org/feed/',                                            category: 'Framework' },
  { name: 'CrewAI Blog',       url: 'https://docs.crewai.com/rss',                                          category: 'Framework' },
  { name: 'Microsoft Research', url: 'https://www.microsoft.com/en-us/research/feed/',                   category: 'Research' },
  { name: 'Google Research',   url: 'https://blog.google/technology/ai/rss',                               category: 'Research' },
  { name: 'Meta Research',     url: 'https://research.facebook.com/feed',                                   category: 'Research' },
  { name: 'OpenRouter Blog',   url: 'https://openrouter.ai/blog/rss',                                      category: 'Tool Launch' },
  { name: 'Together AI',       url: 'https://www.together.ai/blog/rss',                                     category: 'Tool Launch' },
  { name: 'Anyscale',          url: 'https://www.anyscale.com/blog/rss',                                   category: 'Tool Launch' },
  { name: 'Modal Labs',        url: 'https://modal.com/blog/rss',                                           category: 'Tool Launch' },
  { name: 'Replicate',        url: 'https://replicate.com/blog/rss',                                       category: 'Tool Launch' },
  { name: 'RunPod',            url: 'https://blog.runpod.io/rss',                                           category: 'Tool Launch' },
  { name: 'Fal AI',            url: 'https://www.fal.ai/blog/rss',                                         category: 'Tool Launch' },
  { name: 'Lightning AI',      url: 'https://lightning.ai/blog/rss',                                        category: 'Tool Launch' },
  { name: 'Gradient',          url: 'https://gradient.ai/blog/rss',                                         category: 'Tool Launch' },
  { name: 'Beam AI',           url: 'https://www.beam.cloud/blog/rss',                                      category: 'Tool Launch' },
  { name: 'Baseten',           url: 'https://www.baseten.co/blog/rss',                                      category: 'Tool Launch' },
  { name: 'Forefront AI',      url: 'https://www.forefront.ai/blog/rss',                                    category: 'Tool Launch' },
  { name: 'Toolformer',       url: 'https://www.toolformer.dev/blog/rss',                                   category: 'Tool Launch' },
  { name: 'AI21 Playground',   url: 'https://www.ai21.com/playground/rss',                                  category: 'Tool Launch' },
  { name: 'Hugging Face Spaces', url: 'https://huggingface.co/spaces/feed',                                category: 'Open Source' },
  { name: 'Control AI',        url: 'https://control.ai/blog/rss',                                          category: 'Model Release' },
  { name: 'AI21 Jurassic',     url: 'https://www.ai21.com/jurassic/rss',                                    category: 'Model Release' },
  { name: 'Perplexity Blog',   url: 'https://www.perplexity.ai/blog/rss',                                  category: 'Model Release' },
  { name: 'Anyscale Endpoints', url: 'https://docs.anyscale.com/rss',                                      category: 'Tool Launch' },
  { name: 'Papers in Code',    url: 'https://www.papersincode.com/feed',                                   category: 'Research' },
  { name: 'ArXiv Sanity',      url: 'https://arxiv-sanity.com/rss',                                         category: 'Research' },
  { name: 'Hacker News AI',    url: 'https://hnrss.org/newest?q=AI',                                        category: 'Industry' },
  { name: 'Reddit r/MachineLearning', url: 'https://www.reddit.com/r/MachineLearning.rss',               category: 'Research' },
  { name: 'Reddit r/ArtificialIntelligence', url: 'https://www.reddit.com/r/ArtificialIntelligence.rss',  category: 'Industry' },
  { name: 'Reddit r/LocalLLaMA', url: 'https://www.reddit.com/r/LocalLLaMA.rss',                          category: 'Open Source' },
  { name: 'Product Hunt AI',   url: 'https://www.producthunt.com/feed/topics/ai',                         category: 'Tool Launch' },
  { name: 'Indie Hackers AI',  url: 'https://www.indiehackers.com/feed',                                   category: 'Tool Launch' },
  { name: 'Mlearning.ai',      url: 'https://mlearning.ai/feed/',                                           category: 'Research' },
  { name: 'SuperDataScience',  url: 'https://www.superdatascience.com/feed',                               category: 'Research' },
  { name: 'Data Science Weekly', url: 'https://www.datascienceweekly.org/feed',                           category: 'Research' },
  { name: 'Benedict Neo',      url: 'https://www.benedictneo.com/feed',                                     category: 'Research' },
  { name: 'Eugene Yan',        url: 'https://eugene-yan.com/feed',                                          category: 'Research' },
  { name: 'Chip Huyen',        url: 'https://chiphuyen.com/feeds/posts/default',                           category: 'Research' },
  { name: 'Jay Alammar',       url: 'https://jalammar.github.io/feed.xml',                                 category: 'Research' },
  { name: 'Chris Not.md',      url: 'https://chrisalbon.com/feed',                                         category: 'Research' },
  { name: 'Machine Learning Mastery', url: 'https://machinelearningmastery.com/feed/',                  category: 'Research' },
  { name: '砸壳',              url: 'https://www.iocoder.cn/rss/',                                          category: 'Research' },
];

const SAP_SOURCES = [
  { name: 'SAP News Center',   url: 'https://news.sap.com/feed/', product: 'Business AI' },
  { name: 'SAP Community AI',  url: 'https://community.sap.com/khhcw49343/rss/category?category.id=Artificial+Intelligence', product: 'Community' },
  { name: 'SAP BTP Blog',      url: 'https://blogs.sap.com/tag/sap-btp/feed/', product: 'BTP' },
  { name: 'SAP AI Core Blog',  url: 'https://blogs.sap.com/tag/sap-ai-core/feed/', product: 'AI Core' },
  { name: 'SAP Joule Blog',   url: 'https://blogs.sap.com/tag/joule/feed/', product: 'Joule' },
  { name: 'SAP AI Foundation', url: 'https://blogs.sap.com/tag/sap-ai-foundation/feed/', product: 'AI Foundation' },
  { name: 'SAP Datasphere',    url: 'https://blogs.sap.com/tag/datasphere/feed/', product: 'Datasphere' },
  { name: 'SAP Business AI',   url: 'https://blogs.sap.com/tag/business-ai/feed/', product: 'Business AI' },
  { name: 'SAP Generative AI', url: 'https://blogs.sap.com/tag/generative-ai/feed/', product: 'Generative AI' },
  { name: 'SAP Hana ML',       url: 'https://blogs.sap.com/tag/sap-hana-machine-learning/feed/', product: 'HANA ML' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function decodeEntities(str) {
  return str
    // Named entities first
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Decimal numeric entities  &#8217; → '
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(parseInt(code, 10)))
    // Hex numeric entities  &#x2019; → '
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i'))
    || xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return match ? decodeEntities(match[1].trim().replace(/<[^>]+>/g, '')) : '';
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

// ─── AI summarization (Groq → Anthropic → raw fallback) ──────────────────────

const SUMMARIZE_PROMPT = (title, content) =>
  `Summarize this AI/tech news in 2 sharp sentences (max 240 chars total). Lead with what's new, end with why it matters. No fluff.\n\nTitle: ${title}\nContent: ${content.slice(0, 800)}`;

async function summarizeWithGroq(title, rawDesc) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',   // free, fast, capable
        max_tokens: 120,
        temperature: 0.4,
        messages: [{ role: 'user', content: SUMMARIZE_PROMPT(title, rawDesc) }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

async function summarizeWithAnthropic(title, rawDesc) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
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
        messages: [{ role: 'user', content: SUMMARIZE_PROMPT(title, rawDesc) }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.content?.[0]?.text?.trim() ?? null;
  } catch {
    return null;
  }
}

async function aiSummarize(title, rawDesc) {
  if (!rawDesc) return '';
  // Try providers in priority order
  const result =
    (await summarizeWithGroq(title, rawDesc)) ??
    (await summarizeWithAnthropic(title, rawDesc)) ??
    truncate(rawDesc, 280);
  return result;
}

// ─── Main fetch logic ─────────────────────────────────────────────────────────

// const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
// const cutoff = new Date(Date.now() - THIRTY_DAYS_MS);
const cutoff = new Date('2026-01-01T00:00:00Z');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchAINews() {
    console.log('🔍 Fetching AI news from', AI_SOURCES.length, 'sources (since Jan 2026)...');
  const articles = [];
  let idx = 0;

  for (const source of AI_SOURCES) {
    console.log('  →', source.name);
    const xml = await fetchFeed(source.url);
    if (!xml) { console.log('    ✗ failed'); continue; }

    // Fetch all items per source, filter to since Jan 2026
    const items = extractItems(xml)
      .filter(item => {
        if (!item.pubDate) return true; // keep if no date
        const d = new Date(item.pubDate);
        return !isNaN(d.getTime()) && d >= cutoff;
      });

    for (const item of items) {
      const summary = await aiSummarize(item.title, item.desc);
      await sleep(80); // avoid Groq rate limit (30 req/min free tier)
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

    const items = extractItems(xml)
      .slice(0, 10)
      .filter(item => {
        if (!item.pubDate) return true;
        const d = new Date(item.pubDate);
        return !isNaN(d.getTime()) && d >= cutoff;
      });

    for (const item of items) {
      const summary = await aiSummarize(item.title, item.desc);
      await sleep(80);
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

function loadExisting(filePath) {
  try {
    if (!existsSync(filePath)) return [];
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function mergeArticles(fresh, existing) {
  const seenUrls = new Set(fresh.map((a) => a.sourceUrl));
  const oldOnly  = existing.filter((a) => !seenUrls.has(a.sourceUrl));
  const merged   = [...fresh, ...oldOnly];
  merged.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return merged.map((a, i) => ({ ...a, id: String(i + 1) }));
}

function mergeSAPUpdates(fresh, existing) {
  const digest  = fresh.find((u) => u.isWeeklyDigest);
  const freshNon = fresh.filter((u) => !u.isWeeklyDigest);
  const seenUrls = new Set(freshNon.map((u) => u.sourceUrl));
  const oldNon   = existing.filter((u) => !u.isWeeklyDigest && !seenUrls.has(u.sourceUrl));
  const merged   = [...freshNon, ...oldNon];
  merged.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const trimmed  = merged.map((u, i) => ({ ...u, id: String(i + 1) }));
  if (digest) trimmed.unshift({ ...digest, id: '0' });
  return trimmed;
}

async function main() {
  console.log('🚀 NeuralPulse daily fetch starting...\n');

  const articlesPath = resolve(ROOT, 'data/articles.json');
  const sapPath      = resolve(ROOT, 'data/sap-updates.json');

  // Ensure data/ directory exists
  mkdirSync(resolve(ROOT, 'data'), { recursive: true });

  const [freshArticles, freshSAP] = await Promise.all([
    fetchAINews(),
    fetchSAPNews(),
  ]);

  if (freshArticles.length > 0) {
    const existing = loadExisting(articlesPath);
    const merged   = mergeArticles(freshArticles, existing);
    writeFileSync(articlesPath, JSON.stringify(merged, null, 2));
    console.log(`\n💾 Wrote ${merged.length} articles (${freshArticles.length} new + ${merged.length - freshArticles.length} kept) → data/articles.json`);
  } else {
    console.log('\n⚠️  No articles fetched, keeping existing data.');
  }

  if (freshSAP.length > 0) {
    const existing = loadExisting(sapPath);
    const merged   = mergeSAPUpdates(freshSAP, existing);
    writeFileSync(sapPath, JSON.stringify(merged, null, 2));
    console.log(`💾 Wrote ${merged.length} SAP updates (${freshSAP.length} new + ${merged.length - freshSAP.length} kept) → data/sap-updates.json`);
  } else {
    console.log('⚠️  No SAP updates fetched, keeping existing data.');
  }

  console.log('\n✨ Done!');
}

main().catch(console.error);
