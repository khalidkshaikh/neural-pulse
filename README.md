# NeuralPulse — AI & SAP AI Intelligence Platform

> The Bloomberg terminal for AI news. Automated daily intelligence on model releases, AI tools, open-source repos, and SAP AI ecosystem updates.

## Features

- **Daily AI News** — Automated aggregation from 13+ AI news sources
- **AI Tools Tracker** — New product and tool launches
- **Open Source AI** — Trending GitHub repositories
- **SAP AI Hub** — Joule, AI Core, Generative AI Hub, and Business AI updates
- **Daily auto-fetch** via GitHub Actions (7 AM UTC)
- **AI-powered summaries** via Claude Haiku (optional)

## Tech Stack

- **Frontend**: Next.js 16 (App Router, Static Site Generation)
- **Styling**: Tailwind CSS with custom glassmorphism design system
- **Data**: RSS/API aggregation via GitHub Actions
- **Hosting**: Vercel (auto-deploys on every data push)
- **CI/CD**: GitHub Actions

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm run dev
```

### 3. Fetch real news data (optional)
```bash
# With AI summaries (set ANTHROPIC_API_KEY first)
ANTHROPIC_API_KEY=your_key node scripts/fetch-news.mjs

# Without AI (free, uses RSS content directly)
node scripts/fetch-news.mjs
```

## Deployment (Vercel + GitHub Actions)

### Step 1: Push to GitHub
```bash
git push origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Click Deploy — it's pre-configured via `vercel.json`

### Step 3: Add GitHub Secrets (for auto-fetch)
In your GitHub repo → Settings → Secrets → Actions:

| Secret | Required | Description |
|--------|----------|-------------|
| `ANTHROPIC_API_KEY` | Optional | For AI-powered article summaries (Claude Haiku) |
| `VERCEL_DEPLOY_HOOK` | Optional | Vercel webhook URL to force rebuild after data update |

### Step 4: Get your Vercel Deploy Hook
1. Vercel project → Settings → Git → Deploy Hooks
2. Create hook named `GitHub Actions`
3. Copy the URL → add as `VERCEL_DEPLOY_HOOK` secret in GitHub

### Auto-fetch Schedule
The GitHub Action runs at **7:00 AM UTC daily**. You can also trigger it manually via the Actions tab.

## Data Flow

```
GitHub Action (cron: 7am UTC)
  └─ node scripts/fetch-news.mjs
       ├─ Fetch 13 AI RSS feeds
       ├─ Fetch 5 SAP RSS feeds
       ├─ Summarize with Claude Haiku (if API key set)
       ├─ Write data/articles.json
       └─ Write data/sap-updates.json
           └─ git commit + push
               └─ Vercel auto-deploys (via GitHub integration or deploy hook)
```

## Adding/Removing Sources

Edit `scripts/fetch-news.mjs` — find the `AI_SOURCES` or `SAP_SOURCES` arrays at the top and add/remove entries:

```js
{ name: 'My Source', url: 'https://example.com/feed.xml', category: 'Industry' },
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Claude API key for AI summaries (optional) |
| `NEXT_PUBLIC_APP_URL` | Public URL of the deployed app |
