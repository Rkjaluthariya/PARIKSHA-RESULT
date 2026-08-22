import { cleanTitleText as sanitizerCleanTitleText } from './ContentSanitizer';
import { toWebpUrl } from './webpConverter';

export function cleanTitleText(rawTitle: string): string {
  return sanitizerCleanTitleText(rawTitle);
}

const CATEGORY_IMAGE_MAP: Record<string, string[]> = {
  awas_housing: [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?fm=webp&q=75&fit=crop&w=1200"
  ],
  post_gds: [
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?fm=webp&q=75&fit=crop&w=1200"
  ],
  banking_jandhan: [
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?fm=webp&q=75&fit=crop&w=1200"
  ],
  railway_rrb: [
    "https://images.unsplash.com/photo-1474487548417-781cb71495f3?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1515165562839-978bbcf1b267?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1532105956626-9569c03602f6?fm=webp&q=75&fit=crop&w=1200"
  ],
  ssc_upsc_exams: [
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?fm=webp&q=75&fit=crop&w=1200"
  ],
  police_defence: [
    "https://images.unsplash.com/photo-1541872703-74c5e44368f9?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?fm=webp&q=75&fit=crop&w=1200"
  ],
  teaching_education: [
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?fm=webp&q=75&fit=crop&w=1200"
  ],
  schemes_yojana: [
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?fm=webp&q=75&fit=crop&w=1200"
  ],
  scholarships: [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?fm=webp&q=75&fit=crop&w=1200"
  ],
  results_merit: [
    "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1588072432836-e10032774350?fm=webp&q=75&fit=crop&w=1200"
  ],
  news_updates: [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?fm=webp&q=75&fit=crop&w=1200",
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?fm=webp&q=75&fit=crop&w=1200"
  ]
};

function getHashIndex(str: string, length: number): number {
  if (!str || length <= 0) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % length;
}

export function getTopicUnsplashImage(title: string = '', category: string = '', id: string = ''): string {
  const text = (title + ' ' + category + ' ' + id).toLowerCase();

  let pool: string[] = CATEGORY_IMAGE_MAP.news_updates;

  if (text.includes('awas') || text.includes('pmay') || text.includes('housing') || text.includes('house') || text.includes('makaan') || text.includes('building')) {
    pool = CATEGORY_IMAGE_MAP.awas_housing;
  } else if (text.includes('post office') || text.includes('gds') || text.includes('dak') || text.includes('postal') || text.includes('post recruitment') || text.includes('india post')) {
    pool = CATEGORY_IMAGE_MAP.post_gds;
  } else if (text.includes('jan dhan') || text.includes('pmjdy') || text.includes('bank') || text.includes('sbi') || text.includes('ibps') || text.includes('rbi') || text.includes('clerk') || text.includes('po ') || text.includes('account') || text.includes('loan') || text.includes('money') || text.includes('finance')) {
    pool = CATEGORY_IMAGE_MAP.banking_jandhan;
  } else if (text.includes('railway') || text.includes('rrb') || text.includes('ntpc') || text.includes('loco pilot') || text.includes('group d') || text.includes('train')) {
    pool = CATEGORY_IMAGE_MAP.railway_rrb;
  } else if (text.includes('ssc') || text.includes('upsc') || text.includes('cgl') || text.includes('cse') || text.includes('prelims') || text.includes('csat') || text.includes('blueprint') || text.includes('preparation') || text.includes('strategy') || text.includes('study')) {
    pool = CATEGORY_IMAGE_MAP.ssc_upsc_exams;
  } else if (text.includes('police') || text.includes('constable') || text.includes('si ') || text.includes('sub inspector') || text.includes('defense') || text.includes('army') || text.includes('navy') || text.includes('airforce')) {
    pool = CATEGORY_IMAGE_MAP.police_defence;
  } else if (text.includes('teacher') || text.includes('tgt') || text.includes('pgt') || text.includes('reet') || text.includes('tet') || text.includes('teaching') || text.includes('dsssb') || text.includes('school') || text.includes('college')) {
    pool = CATEGORY_IMAGE_MAP.teaching_education;
  } else if (text.includes('scheme') || text.includes('yojana') || text.includes('pm ') || text.includes('government-schemes') || text.includes('subsidy')) {
    pool = CATEGORY_IMAGE_MAP.schemes_yojana;
  } else if (text.includes('scholarship') || text.includes('nsp') || text.includes('fellowship')) {
    pool = CATEGORY_IMAGE_MAP.scholarships;
  } else if (text.includes('result') || text.includes('declared') || text.includes('score') || text.includes('merit list') || text.includes('admit card') || text.includes('answer key') || text.includes('cut off')) {
    pool = CATEGORY_IMAGE_MAP.results_merit;
  }

  const idx = getHashIndex(title + id, pool.length);
  return pool[idx];
}

export function generateH1ImageBanner(h1Title: string, category: string = 'SARKARI EXAM'): string {
  const cleanTitle = cleanTitleText(h1Title) || 'Pariksha Result Official Update 2026';
  const safeTitle = cleanTitle
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  const words = safeTitle.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    if ((currentLine + ' ' + word).length > 28) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += (currentLine ? ' ' : '') + word;
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  const displayLines = lines.slice(0, 3);

  const cleanCategory = (category || 'SARKARI EXAM').toUpperCase().replace(/[-_]/g, ' ');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F172A" />
        <stop offset="50%" stop-color="#1E293B" />
        <stop offset="100%" stop-color="#0F4C81" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#2563EB" />
        <stop offset="100%" stop-color="#38BDF8" />
      </linearGradient>
      <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#10B981" />
        <stop offset="100%" stop-color="#059669" />
      </linearGradient>
      <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.5"/>
      </filter>
    </defs>
    <rect width="1200" height="630" fill="url(#bgGrad)" />
    <circle cx="1080" cy="120" r="280" fill="#38BDF8" opacity="0.1" />
    <circle cx="120" cy="520" r="220" fill="#2563EB" opacity="0.1" />
    <rect x="0" y="618" width="1200" height="12" fill="url(#accentGrad)" />
    
    <rect x="50" y="50" width="1100" height="530" rx="24" fill="#1E293B" fill-opacity="0.8" stroke="#334155" stroke-width="2" filter="url(#shadowFilter)" />
    
    <rect x="90" y="85" width="220" height="42" rx="21" fill="url(#badgeGrad)" />
    <text x="200" y="112" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="800" text-anchor="middle" letter-spacing="0.5">
      PARIKSHA RESULT
    </text>

    <text x="1060" y="115" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800" text-anchor="end" letter-spacing="1">
      PARIKSHA RESULT 2026
    </text>

    ${displayLines.map((line, idx) => `
      <text x="90" y="${230 + (idx * 68)}" fill="#F8FAFC" font-family="system-ui, -apple-system, sans-serif" font-size="46" font-weight="900" letter-spacing="-0.5">
        ${line}
      </text>
    `).join('')}

    <line x1="90" y1="490" x2="1110" y2="490" stroke="#334155" stroke-width="2" />

    <text x="90" y="538" fill="#38BDF8" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700">
      ✓ Official Recruitment &amp; Exam Updates • Fast Notification Portal
    </text>

    <text x="1060" y="538" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" text-anchor="end">
      pariksha-result.vercel.app
    </text>
  </svg>`;

  try {
    const base64Svg = typeof btoa !== 'undefined'
      ? btoa(unescape(encodeURIComponent(svg)))
      : Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64Svg}`;
  } catch (e) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
}

export function getPostImage(post: any, options: { width?: number; quality?: number } = {}): string {
  if (!post) {
    return toWebpUrl(CATEGORY_IMAGE_MAP.news_updates[0], options);
  }

  const checkImg = (url: any) => {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (!trimmed || trimmed === 'null' || trimmed === 'undefined' || trimmed === 'false') return null;
    if (
      trimmed.startsWith('data:image/svg') ||
      trimmed.includes('svg+xml') ||
      trimmed.includes('%3Crect') ||
      trimmed.includes('100%25%20HUMANIZED') ||
      trimmed.includes('100% HUMANIZED') ||
      trimmed.includes('badgeGrad') ||
      trimmed.includes('PARIKSHA RESULT') ||
      trimmed.includes('SCHOLARSHIPS')
    ) {
      return null;
    }
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || (trimmed.startsWith('data:image/') && !trimmed.startsWith('data:image/svg'))) {
      return trimmed;
    }
    return null;
  };

  const validUrl = checkImg(post.heroImage) ||
                   checkImg(post.image) ||
                   checkImg(post.thumbnail) ||
                   checkImg(post.imageUrl) ||
                   checkImg(post.mediaContent) ||
                   checkImg(post.mediaThumbnail) ||
                   checkImg(post.enclosure) ||
                   checkImg(post.openGraph?.image) ||
                   checkImg(post.ogImage) ||
                   checkImg(post.schemas?.articleSchema?.image);

  const rawUrl = validUrl || getTopicUnsplashImage(post.title || '', post.category || '', post.id || post.slug || '');
  return toWebpUrl(rawUrl, { width: options.width || 800, quality: options.quality || 75 });
}

