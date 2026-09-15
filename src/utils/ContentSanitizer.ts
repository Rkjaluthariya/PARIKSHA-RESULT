/**
 * Centralized Content Sanitization & Entity Decoding Utility
 * Provides robust regex-based functions to strip HTML tags, decode HTML entities,
 * sanitize strings, and truncate text cleanly across data ingestion and frontend rendering layers.
 */

/**
 * Strips all HTML tags (such as <a>, <font>, <div>, <p>, <span>, <script>, <style>, etc.) from a string.
 */
export function stripHtmlTags(str: string | null | undefined): string {
  if (!str || typeof str !== 'string') return '';

  let temp = str;

  // Remove CDATA wrappers
  temp = temp.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1');

  // Remove script and style elements and their inner content
  temp = temp.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  temp = temp.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  temp = temp.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');
  temp = temp.replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '');
  temp = temp.replace(/<embed[^>]*>[\s\S]*?<\/embed>/gi, '');

  // Remove inline event handlers and javascript: URIs
  temp = temp.replace(/javascript\s*:/gi, '');
  temp = temp.replace(/\s*on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // Strip all HTML tags completely
  temp = temp.replace(/<[^>]*>/g, '');

  return temp;
}

/**
 * Decodes standard named, decimal, and hexadecimal HTML entities (e.g., &nbsp;, &amp;, &lt;, &gt;, &#39;, &#8217;).
 * Performs multi-pass decoding to resolve double or triple-encoded entities (e.g. &amp;lt;a href...).
 */
export function decodeHtmlEntities(str: string | null | undefined): string {
  if (!str || typeof str !== 'string') return '';

  let temp = str;

  // Multi-pass entity decoding (up to 3 passes to handle nested encoding)
  for (let pass = 0; pass < 3; pass++) {
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
      .replace(/&#x27;/gi, "'")
      .replace(/&ndash;/gi, '-')
      .replace(/&mdash;/gi, '—')
      .replace(/&lsquo;/gi, "'")
      .replace(/&rsquo;/gi, "'")
      .replace(/&ldquo;/gi, '"')
      .replace(/&rdquo;/gi, '"')
      .replace(/&hellip;/gi, '...')
      .replace(/&copy;/gi, '©')
      .replace(/&reg;/gi, '®')
      .replace(/&trade;/gi, '™')
      // Decimal numeric entities like &#8217; or &#128221;
      .replace(/&#([0-9]+);/g, (_, dec) => {
        try {
          const num = parseInt(dec, 10);
          return num && num > 0 && num <= 0x10FFFF ? String.fromCodePoint(num) : '';
        } catch {
          return '';
        }
      })
      // Hexadecimal numeric entities like &#x1F43D;
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
        try {
          const num = parseInt(hex, 16);
          return num && num > 0 && num <= 0x10FFFF ? String.fromCodePoint(num) : '';
        } catch {
          return '';
        }
      });
  }

  return temp;
}

/**
 * Main Sanitization Function: Strips HTML tags, decodes HTML entities,
 * removes replacement characters (\uFFFD), Private Use Area characters (\uE000-\uF8FF) that render as ,
 * non-breaking unicode spaces (\u00A0), zero-width spaces (\u200B, \uFEFF), collapses spaces, and trims.
 */
export function sanitizeAndDecodeText(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') return '';

  // Step 1: Strip HTML tags, CDATA, and scripts
  let cleaned = stripHtmlTags(input);

  // Step 2: Decode HTML entities
  cleaned = decodeHtmlEntities(cleaned);

  // Step 3: Repair corrupted characters (Rupee symbol, contractions, etc.)
  cleaned = cleaned
    // e.g. "Rs.  10,000" or "Rs10000" -> "₹ 10,000"
    .replace(/(?:Rs\.?|INR)\s*[\uFFFD]/gi, '₹')
    // Any replacement char followed by digit is usually a Rupee symbol
    .replace(/[\uFFFD]\s*(?=\d)/g, '₹')
    // Any replacement char between digits is usually a hyphen or dot
    .replace(/(\d)\s*[\uFFFD]\s*(\d)/g, '$1-$2')
    // Common words in government updates
    .replace(/Sarkari\s*[\uFFFD]\s*Result/gi, 'Sarkari Result')
    .replace(/Sarkari\s*[\uFFFD]\s*Naukri/gi, 'Sarkari Naukri')
    .replace(/Pariksha\s*[\uFFFD]\s*Result/gi, 'Pariksha Result')
    // English contractions/possessives
    .replace(/([a-zA-Z])\s*[\uFFFD]\s*([a-zA-Z])/g, (match, p1, p2) => {
      const combined = (p1 + p2).toLowerCase();
      if (combined === 'nt' || combined === 'll' || combined === 're' || combined === 've' || combined === 's') {
        return `${p1}'${p2}`; // don't, I'll, you're, we've, India's
      }
      return `${p1} ${p2}`; // fallback to space
    });

  // Step 4: Remove remaining replacement chars (\uFFFD), PUA chars (\uE000-\uF8FF), non-breaking unicode spaces (\u00A0), zero-width spaces, collapse whitespace, and trim
  cleaned = cleaned
    .replace(/[\uFFFD\uE000-\uF8FF\uFEFF\u200B\u00A0]/g, ' ')
    // Clean unpaired UTF-16 surrogates (emoji halves)
    .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
}

/**
 * Clean title text by sanitizing HTML/entities and stripping Markdown formatting,
 * as well as leading replacement characters, brackets, and emojis.
 */
export function cleanTitleText(rawTitle: string | null | undefined): string {
  if (!rawTitle) return '';
  let sanitized = sanitizeAndDecodeText(rawTitle);
  
  // Strip markdown formatting, leading emojis, and bracket alerts to prevent any broken UI characters
  sanitized = sanitized
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Strip leading replacement characters and common leading emojis/hashes
    .replace(/^[\uFFFD\uE000-\uF8FF\uFEFF\u200B\u00A0#\s📝🔴🏆🎟️🔑🎓🏫📢⚡⭐🔥📍📌]+/, '')
    // Strip common leading bracket alerts like [1-Hour Update] if they contain broken characters, but keeping them if clean is handled nicely.
    // Let's strip the leading emoji space if any:
    .replace(/^\s+/, '')
    .trim();

  return sanitized;
}

/**
 * Safely truncates a sanitized string to max length without breaking words, appending an ellipsis if needed.
 */
export function truncateText(
  str: string | null | undefined,
  maxLength: number = 150,
  ellipsis: string = '...'
): string {
  const sanitized = sanitizeAndDecodeText(str);
  if (!sanitized) return '';
  if (sanitized.length <= maxLength) return sanitized;

  const truncated = sanitized.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace).trim() + ellipsis;
  }

  return truncated.trim() + ellipsis;
}

/**
 * Checks if a string contains prohibited HTML tags or dangerous inline script attributes.
 */
export function containsProhibitedHtml(input: string | null | undefined): boolean {
  if (!input || typeof input !== 'string') return false;
  const prohibitedPattern = /<[^>]+>|&[a-z0-9#]+;|javascript:|on[a-z]+=/i;
  return prohibitedPattern.test(input);
}
