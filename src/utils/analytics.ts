import { Post } from '../types';

export const ANALYTICS_STORAGE_KEY = 'pariksha_analytics';

export interface AnalyticsEvent {
  id: string;
  type: 'impression' | 'click' | 'link_click';
  postId: string;
  postTitle: string;
  category: string;
  timestamp: string;
  source?: string;
}

export interface CategoryMetric {
  impressions: number;
  clicks: number;
  linkClicks: number;
  ctr: number;
}

export interface PostMetric {
  title: string;
  category: string;
  impressions: number;
  clicks: number;
  linkClicks: number;
  ctr: number;
}

export interface ParikshaAnalyticsData {
  totalImpressions: number;
  totalClicks: number;
  totalLinkClicks: number;
  byCategory: Record<string, CategoryMetric>;
  byPost: Record<string, PostMetric>;
  events: AnalyticsEvent[];
  lastUpdated: string;
}

const DEFAULT_ANALYTICS: ParikshaAnalyticsData = {
  totalImpressions: 0,
  totalClicks: 0,
  totalLinkClicks: 0,
  byCategory: {},
  byPost: {},
  events: [],
  lastUpdated: new Date().toISOString(),
};

/**
 * Retrieves analytics state from localStorage ('pariksha_analytics')
 */
export function getAnalyticsData(): ParikshaAnalyticsData {
  if (typeof window === 'undefined' || !window.localStorage) {
    return DEFAULT_ANALYTICS;
  }
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!raw) return DEFAULT_ANALYTICS;
    const parsed = JSON.parse(raw);
    return {
      totalImpressions: parsed.totalImpressions || 0,
      totalClicks: parsed.totalClicks || 0,
      totalLinkClicks: parsed.totalLinkClicks || 0,
      byCategory: parsed.byCategory || {},
      byPost: parsed.byPost || {},
      events: Array.isArray(parsed.events) ? parsed.events : [],
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };
  } catch (e) {
    console.warn('Failed to parse pariksha_analytics data:', e);
    return DEFAULT_ANALYTICS;
  }
}

/**
 * Saves analytics state to localStorage ('pariksha_analytics')
 */
export function saveAnalyticsData(data: ParikshaAnalyticsData): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    // Keep max 150 recent events to stay lightweight
    const prunedEvents = data.events.slice(-150);
    const payload = {
      ...data,
      events: prunedEvents,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('Failed to save pariksha_analytics:', e);
  }
}

/**
 * Tracks a post impression (when post card is rendered/viewed)
 */
export function trackPostImpression(post: Partial<Post>, source: string = 'feed'): void {
  if (!post || (!post.id && !post.title)) return;
  
  const postId = String(post.id || post.slug || post.title);
  const title = post.title || 'Untitled Post';
  const category = post.category || 'Uncategorized';

  const data = getAnalyticsData();
  data.totalImpressions += 1;

  // Category aggregate
  if (!data.byCategory[category]) {
    data.byCategory[category] = { impressions: 0, clicks: 0, linkClicks: 0, ctr: 0 };
  }
  data.byCategory[category].impressions += 1;
  const cat = data.byCategory[category];
  cat.ctr = cat.impressions > 0 ? Number(((cat.clicks / cat.impressions) * 100).toFixed(1)) : 0;

  // Post aggregate
  if (!data.byPost[postId]) {
    data.byPost[postId] = { title, category, impressions: 0, clicks: 0, linkClicks: 0, ctr: 0 };
  }
  data.byPost[postId].impressions += 1;
  const p = data.byPost[postId];
  p.ctr = p.impressions > 0 ? Number(((p.clicks / p.impressions) * 100).toFixed(1)) : 0;

  // Record Event
  data.events.push({
    id: `imp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    type: 'impression',
    postId,
    postTitle: title,
    category,
    timestamp: new Date().toISOString(),
    source,
  });

  saveAnalyticsData(data);
}

/**
 * Tracks a post click (when user opens post details / modal)
 */
export function trackPostClick(post: Partial<Post>, source: string = 'card_click'): void {
  if (!post || (!post.id && !post.title)) return;

  const postId = String(post.id || post.slug || post.title);
  const title = post.title || 'Untitled Post';
  const category = post.category || 'Uncategorized';

  const data = getAnalyticsData();
  data.totalClicks += 1;

  // Category aggregate
  if (!data.byCategory[category]) {
    data.byCategory[category] = { impressions: 1, clicks: 0, linkClicks: 0, ctr: 0 };
  }
  data.byCategory[category].clicks += 1;
  const cat = data.byCategory[category];
  cat.ctr = cat.impressions > 0 ? Number(((cat.clicks / cat.impressions) * 100).toFixed(1)) : 0;

  // Post aggregate
  if (!data.byPost[postId]) {
    data.byPost[postId] = { title, category, impressions: 1, clicks: 0, linkClicks: 0, ctr: 0 };
  }
  data.byPost[postId].clicks += 1;
  const p = data.byPost[postId];
  p.ctr = p.impressions > 0 ? Number(((p.clicks / p.impressions) * 100).toFixed(1)) : 0;

  // Record Event
  data.events.push({
    id: `clk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    type: 'click',
    postId,
    postTitle: title,
    category,
    timestamp: new Date().toISOString(),
    source,
  });

  saveAnalyticsData(data);
}

/**
 * Tracks an external important link click (Apply Online, Notification PDF, etc.)
 */
export function trackImportantLinkClick(post: Partial<Post>, linkTitle: string = 'Important Link'): void {
  if (!post || (!post.id && !post.title)) return;

  const postId = String(post.id || post.slug || post.title);
  const title = post.title || 'Untitled Post';
  const category = post.category || 'Uncategorized';

  const data = getAnalyticsData();
  data.totalLinkClicks += 1;

  // Category aggregate
  if (!data.byCategory[category]) {
    data.byCategory[category] = { impressions: 1, clicks: 1, linkClicks: 0, ctr: 100 };
  }
  data.byCategory[category].linkClicks += 1;

  // Post aggregate
  if (!data.byPost[postId]) {
    data.byPost[postId] = { title, category, impressions: 1, clicks: 1, linkClicks: 0, ctr: 100 };
  }
  data.byPost[postId].linkClicks += 1;

  // Record Event
  data.events.push({
    id: `lnk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    type: 'link_click',
    postId,
    postTitle: title,
    category,
    timestamp: new Date().toISOString(),
    source: linkTitle,
  });

  saveAnalyticsData(data);
}

/**
 * Resets all pariksha_analytics data
 */
export function resetAnalyticsData(): ParikshaAnalyticsData {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem(ANALYTICS_STORAGE_KEY);
  }
  return DEFAULT_ANALYTICS;
}
