export type NewsCategory =
  | 'Model Release'
  | 'Tool Launch'
  | 'Research'
  | 'Open Source'
  | 'SAP AI'
  | 'Industry'
  | 'Framework';

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body?: string;
  category: NewsCategory;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  featured?: boolean;
  imageGradient?: string;
}

export interface AITool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  platform: ('Web' | 'API' | 'Open Source' | 'Desktop' | 'CLI')[];
  launchDate: string;
  upvotes: number;
  url: string;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  accentColor: string;
}

export interface OpenSourceRepo {
  id: string;
  name: string;
  owner: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  starsToday: number;
  category: string;
  tags: string[];
  url: string;
  lastUpdated: string;
  license: string;
}

export type SAPProduct = 'Joule' | 'AI Core' | 'Generative AI Hub' | 'Business AI' | 'BTP' | 'Community';

export interface SAPUpdate {
  id: string;
  title: string;
  summary: string;
  product: SAPProduct;
  updateType: 'Release' | 'Feature' | 'Announcement' | 'Deep Dive' | 'Community';
  publishedAt: string;
  sourceUrl: string;
  isNew?: boolean;
  isWeeklyDigest?: boolean;
  tags: string[];
}
