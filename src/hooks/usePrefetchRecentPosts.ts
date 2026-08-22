import { useEffect, useRef, useState, useCallback } from 'react';
import { Post, CategoryType } from '../types';
import { getPostImage } from '../utils/imageGenerator';

interface UsePrefetchRecentPostsOptions {
  activeCategory: CategoryType | 'all';
  isModalOpen?: boolean;
  language?: 'en' | 'hi';
  onTranslateItem?: (itemId: string, itemType: 'post' | 'ca', itemData: any) => Promise<any>;
  maxPosts?: number;
  idleDelayMs?: number;
  enabled?: boolean;
}

interface UsePrefetchRecentPostsReturn {
  isIdle: boolean;
  isPrefetching: boolean;
  prefetchedIds: string[];
  triggerPrefetchNow: () => void;
}

// In-memory global set to prevent duplicate pre-fetching across renders
const GLOBAL_PREFETCHED_CACHE = new Set<string>();
const IMAGE_CACHE = new Map<string, HTMLImageElement>();

/**
 * Safely parse date strings into epoch milliseconds for recency sorting
 */
function parsePostDate(dateStr?: string): number {
  if (!dateStr) return 0;
  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(trimmed).getTime();
  }
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
    const [day, month, year] = trimmed.split('/');
    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10)).getTime();
  }
  const parsed = Date.parse(trimmed);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Custom Hook: usePrefetchRecentPosts
 * Pre-fetches the details, banners, and bilingual translations of the 5 most recent
 * posts when the user is idle on the homepage to ensure near-instant page load times
 * upon clicking job or result notifications.
 */
export function usePrefetchRecentPosts(
  posts: Post[],
  options: UsePrefetchRecentPostsOptions
): UsePrefetchRecentPostsReturn {
  const {
    activeCategory,
    isModalOpen = false,
    language = 'en',
    onTranslateItem,
    maxPosts = 5,
    idleDelayMs = 1200,
    enabled = true
  } = options;

  const [isIdle, setIsIdle] = useState(false);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [prefetchedIds, setPrefetchedIds] = useState<string[]>(() =>
    Array.from(GLOBAL_PREFETCHED_CACHE)
  );

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleCallbackRef = useRef<number | null>(null);
  const isPrefetchingRef = useRef(false);

  /**
   * Pre-fetch executor: runs in background during idle time
   */
  const executePrefetch = useCallback(async () => {
    if (!enabled || isPrefetchingRef.current || !posts || posts.length === 0) {
      return;
    }

    // Check Data Saver mode
    const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
    const isSaveData = nav?.connection?.saveData === true;

    // 1. Sort posts by recency to pick the top most recent items
    const sortedPosts = [...posts]
      .filter((p) => Boolean(p && (p.id || p.slug)))
      .sort((a, b) => {
        const timeA = parsePostDate(a.postDate);
        const timeB = parsePostDate(b.postDate);
        return timeB - timeA;
      });

    const targetPosts = sortedPosts.slice(0, maxPosts);
    const newPrefetched: string[] = [];

    isPrefetchingRef.current = true;
    setIsPrefetching(true);

    try {
      for (const post of targetPosts) {
        const postKey = post.id || post.slug;
        if (!postKey) continue;

        // Skip if already prefetched
        if (GLOBAL_PREFETCHED_CACHE.has(postKey)) {
          newPrefetched.push(postKey);
          continue;
        }

        // 2. Pre-fetch and pre-cache Banner Images in memory (zero modal render flicker)
        if (!isSaveData) {
          try {
            const imgUrl = getPostImage(post);
            if (imgUrl && !imgUrl.startsWith('data:') && !IMAGE_CACHE.has(imgUrl)) {
              const img = new Image();
              img.decoding = 'async';
              img.src = imgUrl;
              IMAGE_CACHE.set(imgUrl, img);
            }
          } catch {
            // Ignore image pre-load errors silently
          }
        }

        // 3. Pre-fetch Translations if language is Hindi
        if (language === 'hi' && onTranslateItem) {
          try {
            await onTranslateItem(post.id, 'post', post);
          } catch {
            // Translation will gracefully fallback on click
          }
        }

        // 4. Pre-fetch Browser Link Hints (DNS / Preload for post details)
        if (typeof document !== 'undefined') {
          try {
            const canonicalPath = `/${post.category || 'latest-jobs'}/${post.slug || post.id}`;
            const existingLink = document.querySelector(`link[rel="prefetch"][href="${canonicalPath}"]`);
            if (!existingLink) {
              const link = document.createElement('link');
              link.rel = 'prefetch';
              link.href = canonicalPath;
              link.as = 'fetch';
              document.head.appendChild(link);
            }
          } catch {
            // Non-critical hint
          }
        }

        GLOBAL_PREFETCHED_CACHE.add(postKey);
        newPrefetched.push(postKey);

        // Small yield between items to preserve smooth 60fps UI
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      setPrefetchedIds(Array.from(GLOBAL_PREFETCHED_CACHE));
    } catch (err) {
      console.warn('[usePrefetchRecentPosts] Idle pre-fetch error:', err);
    } finally {
      isPrefetchingRef.current = false;
      setIsPrefetching(false);
    }
  }, [posts, maxPosts, language, onTranslateItem, enabled]);

  /**
   * Activity listener to detect when user becomes idle on homepage
   */
  useEffect(() => {
    // Only prefetch when enabled, on homepage, and no modal is active
    if (!enabled || activeCategory !== 'all' || isModalOpen) {
      setIsIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      return;
    }

    const resetIdleTimer = () => {
      setIsIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true);

        // Schedule prefetching on browser idle phase
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          idleCallbackRef.current = (window as any).requestIdleCallback(
            () => {
              executePrefetch();
            },
            { timeout: 3000 }
          );
        } else {
          executePrefetch();
        }
      }, idleDelayMs);
    };

    // Listen to user interaction signals
    const events: Array<keyof WindowEventMap> = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll'
    ];

    events.forEach((evt) => {
      window.addEventListener(evt, resetIdleTimer, { passive: true });
    });

    // Initial start
    resetIdleTimer();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (idleCallbackRef.current && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleCallbackRef.current);
      }
      events.forEach((evt) => {
        window.removeEventListener(evt, resetIdleTimer);
      });
    };
  }, [activeCategory, isModalOpen, idleDelayMs, enabled, executePrefetch]);

  return {
    isIdle,
    isPrefetching,
    prefetchedIds,
    triggerPrefetchNow: executePrefetch
  };
}
