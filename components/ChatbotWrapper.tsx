import { getArticles, getSAPUpdates } from '@/lib/getData';
import { Chatbot } from './Chatbot';

export function ChatbotWrapper() {
  const articles = getArticles().slice(0, 30);
  const sapUpdates = getSAPUpdates().filter((u) => !u.isWeeklyDigest).slice(0, 10);

  // Build compact context string for the system prompt
  const articleLines = articles
    .map((a) => `[${a.category}] ${a.title} — ${a.summary} (${a.source})`)
    .join('\n');

  const sapLines = sapUpdates
    .map((u) => `[SAP ${u.product}] ${u.title} — ${u.summary}`)
    .join('\n');

  const articleContext = `AI NEWS:\n${articleLines}\n\nSAP AI UPDATES:\n${sapLines}`;

  // Build the digest welcome message
  const topCats = articles.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1;
    return acc;
  }, {});
  const topCatsSorted = Object.entries(topCats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([cat, n]) => `${cat} (${n})`)
    .join(', ');

  const digestSummary = `👋 Hi! I'm NeuralPulse AI — your guide to today's AI & SAP news.\n\n📰 **Today's digest:** ${articles.length} articles tracked across ${topCatsSorted}.\n\n🔝 **Top story:** ${articles[0]?.title ?? 'No stories yet'}\n\nAsk me anything about AI or SAP — I'm grounded in today's latest articles.`;

  return <Chatbot articleContext={articleContext} digestSummary={digestSummary} />;
}
