/**
 * Pariksha Result - WebP Image Optimization & Conversion Utility
 * Converts large post images to WebP format to reduce payload sizes and improve page load speed.
 */

export interface WebpConvertOptions {
  width?: number;
  height?: number;
  quality?: number; // 1 - 100
  fit?: 'crop' | 'max' | 'fill' | 'scale';
  format?: 'webp' | 'avif' | 'jpg' | 'png';
}

/**
 * Checks if the current browser environment supports native WebP rendering
 */
export function isWebpSupported(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return true; // SSR default assumption
  }
  try {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
  } catch (e) {
    // Fallback assumption for modern browsers
  }
  return true;
}

/**
 * Converts any image URL into a WebP-optimized CDN URL or query parameter set
 */
export function toWebpUrl(rawUrl: string, options: WebpConvertOptions = {}): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return '';
  }

  const url = rawUrl.trim();
  const width = options.width || 800;
  const quality = options.quality || 75;
  const format = options.format || 'webp';
  const fit = options.fit || 'crop';

  // 1. Preserve SVG and Base64 Data URLs as-is
  if (
    url.startsWith('data:image/svg') ||
    url.startsWith('data:image/webp') ||
    url.includes('svg+xml')
  ) {
    return url;
  }

  // 2. Unsplash CDN Optimization
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('fm', format);
      parsed.searchParams.set('q', String(quality));
      parsed.searchParams.set('w', String(width));
      parsed.searchParams.set('fit', fit);
      parsed.searchParams.delete('auto');
      if (options.height) {
        parsed.searchParams.set('h', String(options.height));
      }
      return parsed.toString();
    } catch (e) {
      // String manipulation fallback if URL parsing fails
      let cleanUrl = url.replace(/auto=format/, `fm=${format}`).replace(/q=\d+/, `q=${quality}`);
      if (!cleanUrl.includes('fm=')) {
        cleanUrl += `${cleanUrl.includes('?') ? '&' : '?'}fm=${format}&q=${quality}&w=${width}&fit=${fit}`;
      }
      return cleanUrl;
    }
  }

  // 3. Cloudinary CDN Optimization
  if (url.includes('res.cloudinary.com')) {
    if (url.includes('/upload/')) {
      const params = `f_${format},q_auto:${quality > 80 ? 'good' : 'eco'},w_${width},c_${fit === 'crop' ? 'fill' : 'limit'}`;
      return url.replace('/upload/', `/upload/${params}/`);
    }
    return url;
  }

  // 4. Imgur CDN
  if (url.includes('i.imgur.com') && !url.endsWith('.gif')) {
    // Imgur supports suffix for sizes or simple .webp extension
    const extensionIndex = url.lastIndexOf('.');
    if (extensionIndex > 0) {
      return url.substring(0, extensionIndex) + '.webp';
    }
  }

  // 5. WordPress / Jetpack Photon CDN
  if (url.includes('i0.wp.com') || url.includes('i1.wp.com') || url.includes('i2.wp.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('format', format);
      parsed.searchParams.set('quality', String(quality));
      parsed.searchParams.set('w', String(width));
      parsed.searchParams.set('strip', 'all');
      return parsed.toString();
    } catch (e) {
      return url;
    }
  }

  // 6. Generic external URLs -> Route via internal image optimizer or append standard WebP query parameters
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // If it's an external third-party image, we can append formatting query hints or use our server endpoint
    if (!url.includes('format=') && !url.includes('fm=')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}fmt=webp&w=${width}&q=${quality}`;
    }
  }

  return url;
}

/**
 * Generates a responsive WebP srcset string with multiple width breakpoints
 */
export function getWebpSrcSet(rawUrl: string, widths: number[] = [320, 480, 640, 800, 1024, 1200], quality: number = 75): string {
  if (!rawUrl) return '';
  return widths
    .map((w) => {
      const webpUrl = toWebpUrl(rawUrl, { width: w, quality, format: 'webp' });
      return `${webpUrl} ${w}w`;
    })
    .join(', ');
}

/**
 * Generates a fallback standard (JPEG/PNG) responsive srcset string
 */
export function getFallbackSrcSet(rawUrl: string, widths: number[] = [320, 480, 640, 800, 1024, 1200], quality: number = 75): string {
  if (!rawUrl) return '';
  return widths
    .map((w) => {
      const fallbackUrl = toWebpUrl(rawUrl, { width: w, quality, format: 'jpg' });
      return `${fallbackUrl} ${w}w`;
    })
    .join(', ');
}

export interface ResponsiveImageOptions {
  widths?: number[];
  quality?: number;
  sizes?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2' | 'auto';
  fit?: 'crop' | 'max' | 'fill' | 'scale';
  defaultWidth?: number;
}

export interface ResponsiveImageSet {
  src: string;
  srcSet: string;
  webpSrcSet: string;
  sizes: string;
  width: number;
  height: number;
  aspectRatio: string;
  alt: string;
}

/**
 * Standard responsive breakpoints for Indian mobile networks & desktop viewports
 */
export const DEFAULT_RESPONSIVE_WIDTHS = [320, 480, 640, 768, 1024, 1200];
export const CARD_RESPONSIVE_WIDTHS = [280, 360, 480, 640, 800];
export const BANNER_RESPONSIVE_WIDTHS = [480, 768, 1024, 1200, 1600];

/**
 * Generates optimized 'sizes' attribute for responsive layouts
 */
export function getResponsiveSizes(type: 'card' | 'banner' | 'modal' | 'table' | 'thumbnail' = 'card'): string {
  switch (type) {
    case 'card':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 400px';
    case 'banner':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1200px';
    case 'modal':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 850px';
    case 'table':
    case 'thumbnail':
      return '(max-width: 640px) 80px, 120px';
    default:
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px';
  }
}

/**
 * Calculates standard dimensions based on aspect ratio
 */
export function calculateAspectRatioDimensions(
  width: number = 800,
  ratio: '16:9' | '4:3' | '1:1' | '3:2' | 'auto' = '16:9'
): { width: number; height: number; aspectRatio: string } {
  switch (ratio) {
    case '16:9':
      return { width, height: Math.round((width * 9) / 16), aspectRatio: '16/9' };
    case '4:3':
      return { width, height: Math.round((width * 3) / 4), aspectRatio: '4/3' };
    case '1:1':
      return { width, height: width, aspectRatio: '1/1' };
    case '3:2':
      return { width, height: Math.round((width * 2) / 3), aspectRatio: '3/2' };
    default:
      return { width, height: Math.round((width * 9) / 16), aspectRatio: '16/9' };
  }
}

/**
 * Comprehensive Responsive Image Set Helper
 * Generates WebP + Fallback srcset, sizes, and dimension metadata
 * for optimal mobile performance and Google Image SEO
 */
export function generateResponsiveImageSet(
  rawUrl: string,
  altText: string = 'Pariksha Result Recruitment Notification',
  options: ResponsiveImageOptions = {}
): ResponsiveImageSet {
  const widths = options.widths || DEFAULT_RESPONSIVE_WIDTHS;
  const quality = options.quality || 75;
  const defaultWidth = options.defaultWidth || 800;
  const aspectRatioType = options.aspectRatio || '16:9';
  const sizes = options.sizes || getResponsiveSizes('card');

  const { width, height, aspectRatio } = calculateAspectRatioDimensions(defaultWidth, aspectRatioType);

  const src = toWebpUrl(rawUrl, { width: defaultWidth, quality, format: 'webp' });
  const webpSrcSet = getWebpSrcSet(rawUrl, widths, quality);
  const srcSet = getFallbackSrcSet(rawUrl, widths, quality);

  return {
    src,
    srcSet,
    webpSrcSet,
    sizes,
    width,
    height,
    aspectRatio,
    alt: altText,
  };
}

/**
 * Client-side HTML5 Canvas utility to convert any loaded image (File, Blob, HTMLImageElement, or URL)
 * directly to a compressed WebP Base64 Data URL or Blob.
 */
export async function convertImageToWebpDataUrl(
  input: File | Blob | HTMLImageElement | string,
  maxWidth = 1200,
  maxHeight = 800,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const processCanvas = (img: HTMLImageElement) => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.naturalWidth || img.width || 800;
        let height = img.naturalHeight || img.height || 600;

        // Maintain aspect ratio while scaling down
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D Context not available'));
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to WebP data URL
        let webpDataUrl = canvas.toDataURL('image/webp', quality);

        // Fallback to jpeg if browser failed to produce image/webp
        if (!webpDataUrl.startsWith('data:image/webp')) {
          webpDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(webpDataUrl);
      } catch (err) {
        reject(err);
      }
    };

    if (typeof input === 'string') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => processCanvas(img);
      img.onerror = () => reject(new Error('Failed to load image for WebP conversion'));
      img.src = input;
    } else if (typeof input === 'object' && input !== null && 'tagName' in input && (input as HTMLElement).tagName === 'IMG') {
      const img = input as HTMLImageElement;
      if (img.complete && img.naturalWidth > 0) {
        processCanvas(img);
      } else {
        img.onload = () => processCanvas(img);
        img.onerror = () => reject(new Error('HTMLImageElement failed to load'));
      }
    } else if (typeof Blob !== 'undefined' && (input instanceof Blob || (typeof File !== 'undefined' && input instanceof File))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => processCanvas(img);
        img.onerror = () => reject(new Error('Blob image load error'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('FileReader error on image blob'));
      reader.readAsDataURL(input as Blob);
    } else {
      reject(new Error('Unsupported input type for WebP conversion'));
    }
  });
}
