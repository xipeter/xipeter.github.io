export type PageType = 
  | 'homepage'
  | 'articles'
  | 'article'
  | 'news'
  | 'news-item'
  | 'tools'
  | 'tool'
  | 'promos'
  | 'promo'
  | 'topics'
  | 'topic'
  | 'about'
  | 'contact'
  | 'privacy-policy'
  | 'terms'
  | 'editorial-policy'
  | 'affiliate-disclosure'
  | 'search'
  | '404';

export interface AdEligibilityConfig {
  eligible: boolean;
  slotPositions: string[];
  reason?: string;
}

export function getAdEligibility(pageType: PageType, hasContent: boolean = true): AdEligibilityConfig {
  const adEligiblePages: Record<PageType, { eligible: boolean; reason?: string }> = {
    homepage: { eligible: true },
    articles: { eligible: true },
    article: { eligible: true },
    news: { eligible: true },
    'news-item': { eligible: true },
    tools: { eligible: true },
    tool: { eligible: true },
    promos: { eligible: true },
    promo: { eligible: true },
    topics: { eligible: false, reason: 'Topic aggregation page' },
    topic: { eligible: true },
    about: { eligible: false, reason: 'Trust/Policy page' },
    contact: { eligible: false, reason: 'Contact page' },
    'privacy-policy': { eligible: false, reason: 'Legal page' },
    terms: { eligible: false, reason: 'Legal page' },
    'editorial-policy': { eligible: false, reason: 'Policy page' },
    'affiliate-disclosure': { eligible: false, reason: 'Disclosure page' },
    search: { eligible: false, reason: 'Search results' },
    '404': { eligible: false, reason: 'Error page' }
  };

  const config = adEligiblePages[pageType];
  
  if (!config.eligible) {
    return {
      eligible: false,
      slotPositions: [],
      reason: config.reason
    };
  }

  if (!hasContent) {
    return {
      eligible: false,
      slotPositions: [],
      reason: 'Insufficient content'
    };
  }

  return {
    eligible: true,
    slotPositions: getSlotPositions(pageType)
  };
}

function getSlotPositions(pageType: PageType): string[] {
  const positions: Record<PageType, string[]> = {
    homepage: ['top', 'sidebar', 'bottom'],
    articles: ['sidebar', 'bottom'],
    article: ['sidebar', 'bottom', 'in-article'],
    news: ['sidebar', 'bottom'],
    'news-item': ['sidebar', 'bottom'],
    tools: ['sidebar', 'bottom'],
    tool: ['sidebar', 'bottom'],
    promos: ['sidebar', 'bottom'],
    promo: ['sidebar', 'bottom'],
    topics: [],
    topic: ['sidebar', 'bottom'],
    about: [],
    contact: [],
    'privacy-policy': [],
    terms: [],
    'editorial-policy': [],
    'affiliate-disclosure': [],
    search: [],
    '404': []
  };

  return positions[pageType];
}

export const AD_SLOT_IDS = {
  top: 'adsense-top',
  sidebar: 'adsense-sidebar', 
  bottom: 'adsense-bottom',
  'in-article': 'adsense-in-article'
} as const;