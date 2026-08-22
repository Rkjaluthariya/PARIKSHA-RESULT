const fs = require('fs');
const path = require('path');

const mockPostsPath = path.join(__dirname, '..', 'src', 'data', 'mockPosts.ts');
let content = fs.readFileSync(mockPostsPath, 'utf8');

const CATEGORY_IMAGE_MAP = {
  police: [
    "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&w=1200&q=80"
  ],
  teaching: [
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80"
  ],
  railway: [
    "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1515165562839-978bbcf1b267?auto=format&fit=crop&w=1200&q=80"
  ],
  banking: [
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=1200&q=80"
  ],
  schemes: [
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?auto=format&fit=crop&w=1200&q=80"
  ],
  scholarships: [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80"
  ],
  admissions: [
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80"
  ],
  exams: [
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
  ],
  results: [
    "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80"
  ]
};

function getHashIndex(str, length) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % length;
}

function getUnsplashImage(title, category, id) {
  const text = ((title || '') + ' ' + (category || '') + ' ' + (id || '')).toLowerCase();
  let pool = CATEGORY_IMAGE_MAP.exams;

  if (text.includes('police') || text.includes('constable') || text.includes('defense') || text.includes('army')) {
    pool = CATEGORY_IMAGE_MAP.police;
  } else if (text.includes('teacher') || text.includes('tgt') || text.includes('pgt') || text.includes('reet') || text.includes('dsssb')) {
    pool = CATEGORY_IMAGE_MAP.teaching;
  } else if (text.includes('railway') || text.includes('rrb') || text.includes('ntpc')) {
    pool = CATEGORY_IMAGE_MAP.railway;
  } else if (text.includes('bank') || text.includes('sbi') || text.includes('ibps')) {
    pool = CATEGORY_IMAGE_MAP.banking;
  } else if (text.includes('scheme') || text.includes('yojana') || text.includes('pm ')) {
    pool = CATEGORY_IMAGE_MAP.schemes;
  } else if (text.includes('scholarship') || text.includes('nsp')) {
    pool = CATEGORY_IMAGE_MAP.scholarships;
  } else if (text.includes('admission') || text.includes('school') || text.includes('jnvst')) {
    pool = CATEGORY_IMAGE_MAP.admissions;
  } else if (text.includes('result') || text.includes('score') || text.includes('merit list') || text.includes('admit card')) {
    pool = CATEGORY_IMAGE_MAP.results;
  }

  const idx = getHashIndex((title || '') + (id || ''), pool.length);
  return pool[idx];
}

// Replace any data:image/svg+xml in mockPosts.ts with valid Unsplash image
const regex = /"image":\s*"data:image\/svg\+xml;utf8,[^"]+"/g;
content = content.replace(regex, (match) => {
  return `"image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80"`;
});

// Replace "heroImage": "data:image/svg..."
const heroRegex = /"heroImage":\s*"data:image\/svg\+xml;utf8,[^"]+"/g;
content = content.replace(heroRegex, (match) => {
  return `"heroImage": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80"`;
});

fs.writeFileSync(mockPostsPath, content, 'utf8');
console.log('Successfully cleaned data:image/svg+xml from mockPosts.ts');
