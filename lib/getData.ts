/**
 * getData.ts — reads from data/ JSON files (populated daily by the fetch script).
 * Falls back to mockData when JSON files are empty (first run / dev mode).
 */

import type { NewsArticle, SAPUpdate, AITool, OpenSourceRepo } from './types';
import {
  newsArticles as mockArticles,
  sapUpdates as mockSAPUpdates,
  aiTools as mockTools,
  openSourceRepos as mockRepos,
} from './mockData';

function loadJson<T>(path: string, fallback: T[]): T[] {
  try {
    // Dynamic require for server-side reads at build time
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const data = require(path) as T[];
    return Array.isArray(data) && data.length > 0 ? data : fallback;
  } catch {
    return fallback;
  }
}

export function getArticles(): NewsArticle[] {
  return loadJson<NewsArticle>('../data/articles.json', mockArticles);
}

export function getSAPUpdates(): SAPUpdate[] {
  return loadJson<SAPUpdate>('../data/sap-updates.json', mockSAPUpdates);
}

export function getTools(): AITool[] {
  return loadJson<AITool>('../data/tools.json', mockTools);
}

export function getRepos(): OpenSourceRepo[] {
  return mockRepos; // GitHub trending via future scraper; use mock for now
}
