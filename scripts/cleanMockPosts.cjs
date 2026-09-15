const fs = require('fs');
const path = require('path');

const mockFilePath = path.join(__dirname, '../src/data/mockPosts.ts');
let fileContent = fs.readFileSync(mockFilePath, 'utf8');

function sanitizeText(str) {
  if (!str || typeof str !== 'string') return '';
  let temp = str;
  for (let i = 0; i < 3; i++) {
    if (!temp.includes('&')) break;
    temp = temp
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&apos;/gi, "'")
      .replace(/&#x2F;/gi, '/')
      .replace(/&#x27;/gi, "'");
  }

  temp = temp.replace(/<[^>]*>/g, '');
  temp = temp.replace(/\uFFFD/g, '').replace(/\s+/g, ' ').trim();
  
  // Strip trailing - SarkariResult.Com or - GK Today
  temp = temp
    .replace(/\s*-\s*SarkariResult\.Com$/i, '')
    .replace(/\s*-\s*GK Today$/i, '')
    .replace(/\s*-\s*Google News$/i, '')
    .trim();

  return temp;
}

function extractHref(str) {
  if (!str || typeof str !== 'string') return null;
  let decoded = str;
  for (let i = 0; i < 3; i++) {
    if (!decoded.includes('&')) break;
    decoded = decoded.replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"');
  }
  const m = decoded.match(/href=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

console.log("Cleaning mockPosts.ts...");

// Regex replace for SVG badges in mockPosts
fileContent = fileContent.replace(/%3Crect%20x%3D%2290%22%20y%3D%2290%22%20width%3D%22340%22%20height%3D%2246%22%20rx%3D%2223%22%20fill%3D%22url\(%23badgeGrad\)%22%20%2F%3E\s*%3Ctext%20x%3D%22260%22%20y%3D%22119%22[^%]*%3E[^%]*%3C%2Ftext%3E/g, '');

fs.writeFileSync(mockFilePath, fileContent, 'utf8');
console.log("Finished basic cleaning pass on mockPosts.ts");
