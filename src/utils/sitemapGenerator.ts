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
  'jharkhand'
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
export function generatePostsSitemapXml(baseUrl: string = BASE_URL, customPosts?: any[]): string {
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

# Sitemap Endpoints
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-pages.xml
Sitemap: ${baseUrl}/sitemap-posts.xml
Sitemap: ${baseUrl}/sitemap-news.xml
`;
}
