/**
 * NeuralPulse — Local Update Script
 *
 * Runs the daily fetch locally, commits any new articles,
 * and pushes to GitHub — which triggers an automatic site rebuild.
 *
 * Usage:
 *   npm run update
 */

import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: 'inherit', ...opts });
}

console.log('🔄 NeuralPulse local update starting...\n');

// Step 1: Fetch latest news (reads .env.local automatically)
run('node scripts/fetch-news.mjs');

// Step 2: Check if data files changed
let changed = false;
try {
  execSync('git diff --quiet data/', { cwd: ROOT });
} catch {
  changed = true; // git diff exits 1 when there are changes
}

if (!changed) {
  console.log('\nℹ️  No new articles found — nothing to commit.\n');
  process.exit(0);
}

// Step 3: Commit and push → triggers GitHub Pages rebuild automatically
const timestamp = new Date().toUTCString();
console.log('\n📦 New articles found — committing...');
run('git add data/');
run(`git commit -m "chore: manual fetch ${timestamp}"`);

console.log('🚀 Pushing to GitHub (site rebuild will start automatically)...');
run('git push origin master');

console.log('\n✅ Done! The live site will update in ~2 minutes.');
console.log('   Check progress: https://github.com/xdrkzx1/neural-pulse/actions\n');
