import fs from 'fs';
import path from 'path';
import { INITIAL_POSTS } from '../data/mockPosts';
import { filterOlderThanOneYear } from './dateFilter';

export const BASE_URL = "https://pariksha-result.vercel.app";

export const escapeXml = (str: string): string => {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  image?: {
    loc: string;
    title: string;
  };
}

// 1. Core Category & Hub Pages
export const CORE_PAGES: Array<{ path: string; priority: string; changefreq: 'daily' | 'weekly' | 'monthly' }> = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: '/latest-jobs', priority: '0.95', changefreq: 'daily' },
  { path: '/admit-card', priority: '0.95', changefreq: 'daily' },
  { path: '/results', priority: '0.95', changefreq: 'daily' },
  { path: '/answer-key', priority: '0.95', changefreq: 'daily' },
  { path: '/syllabus', priority: '0.90', changefreq: 'daily' },
  { path: '/admissions', priority: '0.90', changefreq: 'daily' },
  { path: '/scholarships', priority: '0.90', changefreq: 'daily' },
  { path: '/government-schemes', priority: '0.90', changefreq: 'daily' },
  { path: '/current-affairs', priority: '0.90', changefreq: 'daily' },
  { path: '/quiz', priority: '0.90', changefreq: 'daily' },
  { path: '/blog', priority: '0.85', changefreq: 'weekly' },
  { path: '/tools/photo-signature-resizer', priority: '0.85', changefreq: 'weekly' },
  { path: '/tools/exam-rank-predictor', priority: '0.85', changefreq: 'weekly' },
  { path: '/tools/sarkari-salary-calculator', priority: '0.85', changefreq: 'weekly' },
  { path: '/tools/exam-cut-off-predictor', priority: '0.85', changefreq: 'weekly' },
  { path: '/tools/syllabus-checklist', priority: '0.85', changefreq: 'weekly' },
  { path: '/tools/age-calculator', priority: '0.85', changefreq: 'weekly' },
  { path: '/age-calculator', priority: '0.80', changefreq: 'weekly' },
  { path: '/privacy-policy', priority: '0.50', changefreq: 'monthly' },
  { path: '/terms-conditions', priority: '0.50', changefreq: 'monthly' },
  { path: '/disclaimer', priority: '0.50', changefreq: 'monthly' },
  { path: '/contact-us', priority: '0.60', changefreq: 'monthly' },
];

export const STATE_HUBS = [
  'uttar-pradesh',
  'bihar',
  'rajasthan',
  'madhya-pradesh',
  'delhi',
  'haryana',
  'punjab',
  'maharashtra',
  'jharkhand',
  'west-bengal',
  'gujarat',
  'uttarakhand',
  'chhattisgarh'
];

/**
 * Generate sitemap-pages.xml
 */
export function generatePagesSitemapXml(baseUrl: string = BASE_URL): string {
  const today = new Date().toISOString().split('T')[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Core Category Pages
  CORE_PAGES.forEach((item) => {
    const loc = item.path === '' ? `${baseUrl}/` : `${baseUrl}${item.path}`;
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(loc)}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // State Hubs
  STATE_HUBS.forEach((st) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/state/${st}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.80</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}

/**
 * Generate sitemap-posts.xml with all verified Sarkari Posts
 */
export function generatePostsSitemapXml(baseUrl: string = BASE_URL, customPosts?: any[], customCA?: any[], customQuizzes?: any[]): string {
  const today = new Date().toISOString().split('T')[0];
  const postList = customPosts || INITIAL_POSTS;
  const filtered = filterOlderThanOneYear(postList);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  const seenUrls = new Set<string>();

  filtered.forEach((post) => {
    if (!post || !post.id) return;
    const cat = post.category || 'latest-jobs';
    const slug = post.slug || post.id;
    const loc = `${baseUrl}/${cat}/${slug}`;
    if (seenUrls.has(loc)) return;
    seenUrls.add(loc);

    // Format lastmod
    let lastmod = today;
    if (post.postDate && /^\d{4}-\d{2}-\d{2}$/.test(post.postDate)) {
      lastmod = post.postDate;
    } else if (post.lastDate && /^\d{4}-\d{2}-\d{2}$/.test(post.lastDate)) {
      lastmod = post.lastDate;
    }

    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(loc)}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.85</priority>\n`;
    xml += `    <image:image>\n`;
    xml += `      <image:loc>${baseUrl}/android-chrome-512x512.png</image:loc>\n`;
    xml += `      <image:title>${escapeXml(post.title || 'Pariksha Result Update')}</image:title>\n`;
    xml += `    </image:image>\n`;
    xml += `  </url>\n`;
  });

  // Current Affairs
  if (Array.isArray(customCA)) {
    filterOlderThanOneYear(customCA).forEach((ca: any) => {
      if (!ca || !ca.id) return;
      const loc = `${baseUrl}/current-affairs/${ca.id}`;
      if (seenUrls.has(loc)) return;
      seenUrls.add(loc);
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(loc)}</loc>\n`;
      xml += `    <lastmod>${ca.date || today}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.80</priority>\n`;
      xml += `  </url>\n`;
    });
  }

  // Quizzes
  if (Array.isArray(customQuizzes)) {
    customQuizzes.forEach((quiz: any) => {
      if (!quiz || !quiz.id) return;
      const loc = `${baseUrl}/quizzes/${quiz.id}`;
      if (seenUrls.has(loc)) return;
      seenUrls.add(loc);
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(loc)}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.75</priority>\n`;
      xml += `  </url>\n`;
    });
  }

  xml += `</urlset>`;
  return xml;
}

/**
 * Generate sitemap-news.xml for Google News
 */
export function generateNewsSitemapXml(baseUrl: string = BASE_URL, customPosts?: any[]): string {
  const today = new Date().toISOString().split('T')[0];
  const postList = customPosts || INITIAL_POSTS;
  const filtered = filterOlderThanOneYear(postList).slice(0, 50); // Top 50 recent updates

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

  filtered.forEach((post) => {
    if (!post || !post.id) return;
    const cat = post.category || 'latest-jobs';
    const slug = post.slug || post.id;
    const loc = `${baseUrl}/${cat}/${slug}`;
    const pubDate = post.postDate ? `${post.postDate}T09:00:00+05:30` : `${today}T09:00:00+05:30`;

    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(loc)}</loc>\n`;
    xml += `    <news:news>\n`;
    xml += `      <news:publication>\n`;
    xml += `        <news:name>Pariksha Result</news:name>\n`;
    xml += `        <news:language>hi</news:language>\n`;
    xml += `      </news:publication>\n`;
    xml += `      <news:publication_date>${pubDate}</news:publication_date>\n`;
    xml += `      <news:title>${escapeXml(post.title)}</news:title>\n`;
    xml += `    </news:news>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}

/**
 * Generate Master Sitemap Index (sitemap.xml)
 */
export function generateMasterSitemapIndex(baseUrl: string = BASE_URL): string {
  const today = new Date().toISOString().split('T')[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <sitemap>\n`;
  xml += `    <loc>${baseUrl}/sitemap-pages.xml</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `  </sitemap>\n`;
  xml += `  <sitemap>\n`;
  xml += `    <loc>${baseUrl}/sitemap-posts.xml</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `  </sitemap>\n`;
  xml += `  <sitemap>\n`;
  xml += `    <loc>${baseUrl}/sitemap-news.xml</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `  </sitemap>\n`;
  xml += `</sitemapindex>`;
  return xml;
}

/**
 * Generate full combined sitemap.xml for legacy search crawlers
 */
export function generateFullCombinedSitemapXml(baseUrl: string = BASE_URL, customPosts?: any[]): string {
  const today = new Date().toISOString().split('T')[0];
  const postList = customPosts || INITIAL_POSTS;
  const filtered = filterOlderThanOneYear(postList);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  // Core pages
  CORE_PAGES.forEach((item) => {
    const loc = item.path === '' ? `${baseUrl}/` : `${baseUrl}${item.path}`;
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(loc)}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // State Hubs
  STATE_HUBS.forEach((st) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/state/${st}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.80</priority>\n`;
    xml += `  </url>\n`;
  });

  // Posts
  const seenUrls = new Set<string>();
  filtered.forEach((post) => {
    if (!post || !post.id) return;
    const cat = post.category || 'latest-jobs';
    const slug = post.slug || post.id;
    const loc = `${baseUrl}/${cat}/${slug}`;
    if (seenUrls.has(loc)) return;
    seenUrls.add(loc);

    let lastmod = today;
    if (post.postDate && /^\d{4}-\d{2}-\d{2}$/.test(post.postDate)) {
      lastmod = post.postDate;
    }

    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(loc)}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.85</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}

/**
 * Generate robots.txt
 */
export function generateRobotsTxt(baseUrl: string = BASE_URL): string {
  return `# Pariksha Result Robots Directive
User-agent: *
Allow: /
Allow: /favicon*
Allow: /android-chrome*
Allow: /apple-touch-icon*
Allow: /rss.xml
Disallow: /api/
Disallow: /admin
Disallow: /?k=*
Disallow: /?adm=*

User-agent: Googlebot
Allow: /

User-agent: Googlebot-News
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

# Sitemap & Feed Endpoints
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-pages.xml
Sitemap: ${baseUrl}/sitemap-posts.xml
Sitemap: ${baseUrl}/sitemap-news.xml
Sitemap: ${baseUrl}/rss.xml
`;
}

/**
 * Generate static rss.xml RSS 2.0 Feed for Google Search Console & Feed Readers
 */
export function generateRssFeedXml(baseUrl: string = BASE_URL, customPosts?: any[]): string {
  const postList = customPosts || INITIAL_POSTS;
  const filtered = filterOlderThanOneYear(postList).slice(0, 30);
  const nowUtc = new Date().toUTCString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n`;
  xml += `  <channel>\n`;
  xml += `    <title>Pariksha Result 2026 - Latest Sarkari Jobs, Results &amp; Admit Card</title>\n`;
  xml += `    <link>${baseUrl}</link>\n`;
  xml += `    <description>Official real-time notifications for latest Sarkari Naukri, Admit Card, Results, Answer Key, Syllabus &amp; Schemes.</description>\n`;
  xml += `    <language>hi-IN</language>\n`;
  xml += `    <lastBuildDate>${nowUtc}</lastBuildDate>\n`;
  xml += `    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />\n`;

  filtered.forEach((post) => {
    if (!post || !post.id) return;
    const cat = post.category || 'latest-jobs';
    const slug = post.slug || post.id;
    const link = `${baseUrl}/${cat}/${slug}`;
    const title = post.title || 'Sarkari Job Notification';
    const desc = post.shortInfo || post.fullDescription?.substring(0, 200) || 'Check latest notification details on Pariksha Result.';
    const pubDate = post.postDate ? new Date(post.postDate).toUTCString() : nowUtc;

    xml += `    <item>\n`;
    xml += `      <title>${escapeXml(title)}</title>\n`;
    xml += `      <link>${escapeXml(link)}</link>\n`;
    xml += `      <guid isPermaLink="true">${escapeXml(link)}</guid>\n`;
    xml += `      <description>${escapeXml(desc)}</description>\n`;
    xml += `      <pubDate>${pubDate}</pubDate>\n`;
    if (post.category) {
      xml += `      <category>${escapeXml(post.category)}</category>\n`;
    }
    xml += `    </item>\n`;
  });

  xml += `  </channel>\n`;
  xml += `</rss>`;
  return xml;
}

/**
 * Ping Google and Bing with updated sitemap location
 */
export async function pingSearchEngines(baseUrl: string = BASE_URL): Promise<{ google: boolean; bing: boolean }> {
  const sitemapUrl = encodeURIComponent(`${baseUrl}/sitemap.xml`);
  const results = { google: false, bing: false };

  try {
    const googleRes = await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`);
    results.google = googleRes.ok;
    console.log(`[SEO] Google sitemap ping response: ${googleRes.status}`);
  } catch (err: any) {
    console.log(`[SEO] Google sitemap ping skipped/failed: ${err.message}`);
  }

  try {
    const bingRes = await fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`);
    results.bing = bingRes.ok;
    console.log(`[SEO] Bing sitemap ping response: ${bingRes.status}`);
  } catch (err: any) {
    console.log(`[SEO] Bing sitemap ping skipped/failed: ${err.message}`);
  }

  return results;
}

