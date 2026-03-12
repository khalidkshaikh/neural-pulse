/**
 * getData.ts — reads from data/ JSON files (populated daily by the fetch script).
 * Falls back to mockData when JSON files are empty (first run / dev mode).
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { NewsArticle, SAPUpdate, AITool, OpenSourceRepo } from './types';
import {
  newsArticles as mockArticles,
  sapUpdates as mockSAPUpdates,
  aiTools as mockTools,
  openSourceRepos as mockRepos,
} from './mockData';

function loadJson<T>(fileName: string, fallback: T[]): T[] {
  try {
    const filePath = join(process.cwd(), 'data', fileName);
    if (!existsSync(filePath)) return fallback;
    const raw = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw) as T[];
    return Array.isArray(data) && data.length > 0 ? data : fallback;
  } catch {
    return fallback;
  }
}

export function getArticles(): NewsArticle[] {
  return loadJson<NewsArticle>('articles.json', mockArticles);
}

export function getSAPUpdates(): SAPUpdate[] {
  return loadJson<SAPUpdate>('sap-updates.json', mockSAPUpdates);
}

export function getTools(): AITool[] {
  return loadJson<AITool>('tools.json', mockTools);
}

export function getRepos(): OpenSourceRepo[] {
  return mockRepos;
}
