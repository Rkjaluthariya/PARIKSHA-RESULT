import fs from 'fs';
import path from 'path';
import {
  generateMasterSitemapIndex,
  generatePagesSitemapXml,
  generatePostsSitemapXml,
  generateNewsSitemapXml,
  generateRssFeedXml,
  generateRobotsTxt,
  BASE_URL
} from '../src/utils/sitemapGenerator';
import { INITIAL_POSTS } from '../src/data/mockPosts';

const publicDir = path.join(process.cwd(), 'public');
const distDir = path.join(process.cwd(), 'dist');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Remove stale chunked sitemaps if any exist
['sitemap-1.xml', 'sitemap-2.xml', 'sitemap-3.xml', 'sitemap-4.xml'].forEach((file) => {
  const pPath = path.join(publicDir, file);
  if (fs.existsSync(pPath)) {
    fs.unlinkSync(pPath);
    console.log(`[Sitemap] Removed stale ${file}`);
  }
  const dPath = path.join(distDir, file);
  if (fs.existsSync(dPath)) {
    fs.unlinkSync(dPath);
  }
});

// 2. Generate clean, valid XML files
const sitemapIndex = generateMasterSitemapIndex(BASE_URL);
const sitemapPages = generatePagesSitemapXml(BASE_URL);
const sitemapPosts = generatePostsSitemapXml(BASE_URL, INITIAL_POSTS);
const sitemapNews = generateNewsSitemapXml(BASE_URL, INITIAL_POSTS);
const rssFeedXml = generateRssFeedXml(BASE_URL, INITIAL_POSTS);
const robotsTxt = generateRobotsTxt(BASE_URL);

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndex, 'utf8');
fs.writeFileSync(path.join(publicDir, 'sitemap-pages.xml'), sitemapPages, 'utf8');
fs.writeFileSync(path.join(publicDir, 'sitemap-posts.xml'), sitemapPosts, 'utf8');
fs.writeFileSync(path.join(publicDir, 'sitemap-news.xml'), sitemapNews, 'utf8');
fs.writeFileSync(path.join(publicDir, 'rss.xml'), rssFeedXml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');

console.log(`✅ [Sitemap] Successfully generated static sitemaps & RSS in public/:`);
console.log(`   - /sitemap.xml (Master Index)`);
console.log(`   - /sitemap-pages.xml (Category & Hubs)`);
console.log(`   - /sitemap-posts.xml (${INITIAL_POSTS.length} Job Posts)`);
console.log(`   - /sitemap-news.xml (Google News)`);
console.log(`   - /rss.xml (RSS 2.0 Feed)`);
console.log(`   - /robots.txt`);

// Also copy to dist if dist exists
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapIndex, 'utf8');
  fs.writeFileSync(path.join(distDir, 'sitemap-pages.xml'), sitemapPages, 'utf8');
  fs.writeFileSync(path.join(distDir, 'sitemap-posts.xml'), sitemapPosts, 'utf8');
  fs.writeFileSync(path.join(distDir, 'sitemap-news.xml'), sitemapNews, 'utf8');
  fs.writeFileSync(path.join(distDir, 'rss.xml'), rssFeedXml, 'utf8');
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
}
