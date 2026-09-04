import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CurrentAffairsArticle } from '../types';
import { Calendar, Download, Bookmark, CheckCircle2, RefreshCw, Zap, Search, Filter, ArrowRight, Sparkles, Languages } from 'lucide-react';
import { AdsterraAd } from './AdsterraAd';
import { cleanTitleText } from '../utils/imageGenerator';
import { sanitizeAndDecodeText, SafeText, useSafeTextRenderer } from '../hooks/useSafeTextRenderer';
import { getTranslation } from '../utils/translations';

function parseAndCleanArticleClient(art: CurrentAffairsArticle): any {
  if (!art) return null;

  let rawTitle = art.title || '';
  let rawSummary = art.summary || '';
  let rawContent = (art as any).fullContent || (art as any).content || art.summary || '';
  let category = art.category || 'General GK';
  let date = art.date || (art as any).publishedAt || '';
  let source = (art as any).source || 'GK Today';
  let sourceUrl = (art as any).sourceUrl || (art as any).link || '';
  let publishedAt = (art as any).publishedAt || art.date || '';
  let syncedAt = (art as any).syncedAt || '';
  
  let keyHighlights = (art as any).keyHighlights || art.keyPoints || [];

  const findHref = (s: string) => {
    if (!s) return null;
    let decoded = s;
    for (let p = 0; p < 3; p++) {
      if (!decoded.includes('&')) break;
      decoded = decoded.replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"');
    }
    const m = decoded.match(/href=["']([^"']+)["']/i);
    return m ? m[1] : null;
  };

  const findFontText = (s: string) => {
    if (!s) return null;
    let decoded = s;
    for (let p = 0; p < 3; p++) {
      if (!decoded.includes('&')) break;
      decoded = decoded.replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"');
    }
    const m = decoded.match(/<font[^>]*>([\s\S]*?)<\/font>/i);
    return m ? m[1].replace(/<[^>]*>/g, '').trim() : null;
  };

  const urlFromTitle = findHref(rawTitle);
  const urlFromSummary = findHref(rawSummary);
  const urlFromContent = findHref(rawContent);

  if (!sourceUrl || sourceUrl.includes('<a') || sourceUrl.includes('&lt;')) {
    sourceUrl = urlFromTitle || urlFromSummary || urlFromContent || '';
  }

  const fontFromSummary = findFontText(rawSummary);
  const fontFromTitle = findFontText(rawTitle);
  if (fontFromSummary) source = fontFromSummary;
  else if (fontFromTitle) source = fontFromTitle;

  let title = sanitizeAndDecodeText(rawTitle);
  let summary = sanitizeAndDecodeText(rawSummary);
  source = sanitizeAndDecodeText(source);

  if (title.endsWith(' - GK Today')) {
    title = title.substring(0, title.length - 11).trim();
    if (!source || source === 'GK Today') source = 'GK Today';
  } else if (title.endsWith(' - Google News')) {
    title = title.substring(0, title.length - 14).trim();
    if (!source) source = 'Google News';
  } else if (title.endsWith(' - SarkariResult.Com')) {
    title = title.substring(0, title.length - 20).trim();
    if (!source) source = 'SarkariResult.Com';
  }

  if (summary.endsWith(' - GK Today')) {
    summary = summary.substring(0, summary.length - 11).trim();
  } else if (summary.endsWith(' - Google News')) {
    summary = summary.substring(0, summary.length - 14).trim();
  } else if (summary.endsWith(' - SarkariResult.Com')) {
    summary = summary.substring(0, summary.length - 20).trim();
  }

  if (!summary || summary === title || summary.length < 15) {
    summary = `Latest exam-oriented update on ${title}. Crucial topic covering ${category} for competitive exams.`;
  }

  let finalHighlights: string[] = [];
  if (Array.isArray(keyHighlights)) {
    finalHighlights = keyHighlights
      .map(kh => sanitizeAndDecodeText(kh))
      .filter(kh => kh && kh.length > 5 && !kh.includes('http://') && !kh.includes('https://'));
  }

  if (finalHighlights.length === 0) {
    finalHighlights = [
      `Important update regarding ${title}.`,
      `Relevant for upcoming SSC, Railway, Civil Services, and state-level exams.`,
      `Key subject under the ${category} category.`
    ];
  }

  // Remove duplicates
  finalHighlights = finalHighlights.filter(kh => {
    const khLower = kh.toLowerCase();
    const summaryLower = summary.toLowerCase();
    const titleLower = title.toLowerCase();
    return !summaryLower.includes(khLower) && !khLower.includes(summaryLower) && !titleLower.includes(khLower);
  });

  if (finalHighlights.length < 2) {
    finalHighlights.push(`This is a critical subject for exam preparation under the ${category} segment.`);
    finalHighlights.push(`Candidates are advised to note down key facts and dates related to ${title}.`);
  }

  if (finalHighlights.length > 4) {
    finalHighlights = finalHighlights.slice(0, 4);
  }

  return {
    ...art,
    title,
    summary,
    category,
    date: date || publishedAt,
    keyPoints: finalHighlights,
    keyHighlights: finalHighlights,
    source,
    sourceUrl,
    publishedAt: publishedAt || date,
    syncedAt
  };
}

interface CurrentAffairsSectionProps {
  articles: CurrentAffairsArticle[];
  onTriggerSync?: (type: 'current-affairs' | 'latest-jobs' | 'all') => void;
  bookmarkedCaIds?: string[];
  onToggleBookmarkCA?: (caId: string) => void;
  isHomePage?: boolean;
  limit?: number;
  onViewAll?: () => void;
  isLoading?: boolean;
  language?: 'en' | 'hi';
  onTranslateItem?: (itemId: string, itemType: 'post' | 'ca', itemData: any) => Promise<any>;
  translatedCache?: Record<string, any>;
}

export const CurrentAffairsSkeleton: React.FC<{ isHomePage?: boolean; limit?: number }> = ({
  isHomePage = false,
  limit = 5,
}) => {
  const skeletonCount = isHomePage ? limit : 6;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-2">
          <div className="w-52 h-6 bg-slate-200/90 rounded-md"></div>
          <div className="w-64 h-3 bg-slate-200/60 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-28 h-8 bg-slate-200/80 rounded-xl"></div>
          <div className="w-24 h-8 bg-slate-200/80 rounded-xl"></div>
        </div>
      </div>

      {/* Search & Filter Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-80 h-9 bg-slate-100 rounded-xl"></div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-20 h-8 bg-slate-100 rounded-lg flex-shrink-0"></div>
          ))}
        </div>
      </div>

      {/* Cards Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-24 h-4 bg-slate-200/90 rounded-md"></div>
              <div className="w-16 h-3 bg-slate-200/60 rounded"></div>
            </div>
            <div className="space-y-1.5">
              <div className="w-full h-4 bg-slate-200/90 rounded"></div>
              <div className="w-4/5 h-4 bg-slate-200/80 rounded"></div>
            </div>
            <div className="w-full h-12 bg-slate-100 rounded-lg"></div>
            <div className="pt-2.5 border-t border-slate-200/70 flex items-center justify-between">
              <div className="w-20 h-3 bg-slate-200/70 rounded"></div>
              <div className="w-16 h-6 bg-slate-200/80 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CurrentAffairsSection: React.FC<CurrentAffairsSectionProps> = ({
  articles,
  onTriggerSync,
  bookmarkedCaIds = [],
  onToggleBookmarkCA,
  isHomePage = false,
  limit = 5,
  onViewAll,
  isLoading = false,
  language = 'en',
  onTranslateItem,
  translatedCache,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSyncing, setIsSyncing] = useState(false);
  const [translatingIds, setTranslatingIds] = useState<Record<string, boolean>>({});

  const sectionContainerRef = useRef<HTMLDivElement | null>(null);
  const filterScrollRef = useRef<HTMLDivElement | null>(null);

  // Passive touch & scroll event listeners to prevent main-thread blocking on budget mobile devices
  useEffect(() => {
    const container = sectionContainerRef.current;
    if (!container) return;

    const passiveOpts: AddEventListenerOptions = { passive: true };
    const noop = () => {};

    container.addEventListener('touchstart', noop, passiveOpts);
    container.addEventListener('touchmove', noop, passiveOpts);
    container.addEventListener('wheel', noop, passiveOpts);
    container.addEventListener('scroll', noop, passiveOpts);

    const filterEl = filterScrollRef.current;
    if (filterEl) {
      filterEl.addEventListener('touchstart', noop, passiveOpts);
      filterEl.addEventListener('touchmove', noop, passiveOpts);
      filterEl.addEventListener('wheel', noop, passiveOpts);
      filterEl.addEventListener('scroll', noop, passiveOpts);
    }

    return () => {
      container.removeEventListener('touchstart', noop);
      container.removeEventListener('touchmove', noop);
      container.removeEventListener('wheel', noop);
      container.removeEventListener('scroll', noop);

      if (filterEl) {
        filterEl.removeEventListener('touchstart', noop);
        filterEl.removeEventListener('touchmove', noop);
        filterEl.removeEventListener('wheel', noop);
        filterEl.removeEventListener('scroll', noop);
      }
    };
  }, []);

  const handleTranslateCard = async (artId: string, artData: any) => {
    if (!onTranslateItem) return;
    setTranslatingIds(prev => ({ ...prev, [artId]: true }));
    await onTranslateItem(artId, 'ca', artData);
    setTranslatingIds(prev => ({ ...prev, [artId]: false }));
  };

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category)))];

  // Helper function to safely convert diverse date strings to timestamp for current affairs
  const parseCaDate = (dateStr?: string): number => {
    if (!dateStr) return 0;
    const trimmed = dateStr.trim();
    // Format: YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      return new Date(trimmed).getTime();
    }
    // Format: DD/MM/YYYY
    const dmMatch = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (dmMatch) {
      const [, day, month, year] = dmMatch;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getTime();
    }
    // Standard Date parser fallback
    const parsed = Date.parse(trimmed);
    if (!isNaN(parsed)) return parsed;
    return 0;
  };

  // Filter articles and sort them newest-first
  const filteredArticles = useMemo(() => {
    const filtered = articles.filter((art) => {
      const summaryText = art.summary || '';
      const matchesSearch =
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        summaryText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
      return matchesSearch && matchesCat;
    });

    return [...filtered].sort((a, b) => {
      const dateA = parseCaDate(a.date || (a as any).publishedAt || (a as any).syncedAt);
      const dateB = parseCaDate(b.date || (b as any).publishedAt || (b as any).syncedAt);
      return dateB - dateA;
    });
  }, [articles, searchTerm, selectedCategory]);

  // Limit articles on homepage
  const displayedArticles = isHomePage
    ? filteredArticles.slice(0, limit)
    : filteredArticles;

  React.useEffect(() => {
    if (language === 'hi' && displayedArticles.length > 0 && onTranslateItem) {
      const untranslated = displayedArticles
        .map(rawArt => parseAndCleanArticleClient(rawArt))
        .filter(art => art && !translatedCache?.[`ca_${art.id}`])
        .slice(0, 5);

      untranslated.forEach(art => {
        onTranslateItem(art.id, 'ca', art).catch(() => {});
      });
    }
  }, [language, displayedArticles, translatedCache, onTranslateItem]);

  if (isLoading) {
    return <CurrentAffairsSkeleton isHomePage={isHomePage} limit={limit} />;
  }

  const handleManualSync = async () => {
    if (onTriggerSync) {
      setIsSyncing(true);
      await onTriggerSync('current-affairs');
      setTimeout(() => setIsSyncing(false), 800);
    }
  };

  return (
    <div
      ref={sectionContainerRef}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6"
      style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 font-black text-base text-slate-900">
            <Bookmark className="w-5 h-5 text-[#FF6B00]" />
            <span>
              {isHomePage ? getTranslation('Latest Current Affairs & GK Updates', language) : getTranslation('Latest Current Affairs', language) + ` (${articles.length})`}
            </span>

            {isHomePage ? (
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 shadow-2xs">
                <Zap className="w-3 h-3 text-amber-600 animate-pulse" />
                {getTranslation('Top 5 Recent Updates', language)}
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                <Zap className="w-3 h-3 text-emerald-600 animate-pulse" />
                {getTranslation('Auto-Sync Active (5 Mins)', language)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {isHomePage && onViewAll && (
            <button
              onClick={onViewAll}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{getTranslation('View All', language)} ({articles.length})</span>
            </button>
          )}

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 flex-shrink-0 transition-all"
            title="Fetch latest Current Affairs updates"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? getTranslation('Syncing...', language) : `⚡ ${getTranslation('Sync Current Affairs', language)}`}</span>
          </button>

          <button
            onClick={() => alert('Downloading August 2026 Monthly Current Affairs PDF Digest...')}
            className="px-3.5 py-2 bg-[#0F4C81] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 flex-shrink-0 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>{getTranslation('Download PDF', language)}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar - Full view or when user searches */}
      {(!isHomePage || searchTerm) && (
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <div className="relative w-full sm:w-72 flex-shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Current Affairs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-xs"
            />
          </div>

          <div
            ref={filterScrollRef}
            className="flex items-center gap-2 w-full overflow-x-auto pb-1 sm:pb-0 scrollbar-none"
            style={{ touchAction: 'pan-x', overscrollBehaviorX: 'contain', WebkitOverflowScrolling: 'touch' }}
          >
            <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {displayedArticles.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-xs font-bold text-slate-500">No Current Affairs found matching search criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="mt-2 text-xs font-bold text-amber-600 underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedArticles.map((rawArt, index) => {
            const art = parseAndCleanArticleClient(rawArt);
            if (!art) return null;
            const isSaved = bookmarkedCaIds.includes(art.id);
            const cacheKey = `ca_${art.id}`;
            const isTranslated = language === 'hi' && translatedCache?.[cacheKey];
            const isTranslating = translatingIds[art.id];

            const displayedTitle = isTranslated ? translatedCache[cacheKey].title : art.title;
            const displayedSummary = isTranslated ? translatedCache[cacheKey].shortInfo : art.summary;
            const displayedKeyPoints = isTranslated && translatedCache[cacheKey].fullDescription
              ? translatedCache[cacheKey].fullDescription.split('\n').filter(Boolean)
              : art.keyPoints;

            return (
              <div
                key={`${art.id || 'ca'}-${index}`}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 hover:bg-slate-50 hover:border-amber-300 transition-all space-y-4 relative overflow-hidden group shadow-sm flex flex-col justify-between"
                style={{ contentVisibility: 'auto', containIntrinsicSize: '0 250px' }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs pr-12">
                    <span className="font-bold text-[#FF6B00] bg-orange-100/80 border border-orange-200 px-2 py-0.5 rounded">
                      {art.category}
                    </span>
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {art.date}
                    </span>
                  </div>

                  {onToggleBookmarkCA && (
                    <button
                      type="button"
                      onClick={() => onToggleBookmarkCA(art.id)}
                      className={`absolute top-3 right-3 p-1.5 rounded-lg transition-all ${
                        isSaved
                          ? 'bg-amber-100 text-amber-700 border border-amber-300'
                          : 'bg-white text-slate-400 hover:text-amber-600 border border-slate-200 shadow-xs'
                      }`}
                      title={isSaved ? 'Remove Bookmark' : 'Save Current Affairs'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500 text-amber-600' : ''}`} />
                    </button>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    {art.id.includes('auto') && (
                      <span className="inline-block bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                        ⚡ Auto-Synced Update
                      </span>
                    )}

                    {language === 'hi' && (
                      <button
                        onClick={() => handleTranslateCard(art.id, art)}
                        disabled={isTranslating}
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition-all border ${
                          isTranslated
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                        }`}
                      >
                        <Languages className={`w-2.5 h-2.5 ${isTranslating ? 'animate-spin' : ''}`} />
                        <span>{isTranslating ? getTranslation('Translating...', language) : isTranslated ? getTranslation('Hindi', language) : getTranslation('Translate', language)}</span>
                      </button>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-700 transition-colors">
                    {displayedTitle}
                  </h3>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {displayedSummary}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200/80 text-xs text-slate-700">
                    <div className="font-bold text-slate-900">{language === 'hi' ? 'परीक्षा के मुख्य बिंदु:' : 'Key Highlights for Exam:'}</div>
                    {displayedKeyPoints.map((kp: string, i: number) => (
                      <div key={i} className="flex items-start gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{kp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500 font-semibold mt-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>{getTranslation('Source:', language)} <span className="text-slate-800 font-bold">{art.source}</span></span>
                    {art.syncedAt && (
                      <span className="text-slate-400">
                        • Synced on {new Date(art.syncedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </span>
                    )}
                  </div>
                  
                  {art.sourceUrl && (
                    <a
                      href={art.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold rounded-lg border border-amber-300 shadow-3xs transition-all break-all self-stretch sm:self-auto justify-center text-center text-[10px]"
                    >
                      <span>{getTranslation('Read Original Source', language)}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Adsterra Current Affairs Bottom Sponsored Ad Block */}
      <AdsterraAd type="rectangle" label="Sponsored GK & Exam Preparation Ad" />

      {/* Footer view all bar for homepage */}
      {isHomePage && articles.length > (limit || 5) && (
        <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-amber-50/60 to-orange-50/60 p-3.5 rounded-xl border border-amber-200/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Zap className="w-4 h-4 text-amber-600 animate-bounce" />
            <span>{language === 'hi' ? `कुल ${articles.length} करंट अफेयर्स में से शीर्ष 5 हालिया अपडेट दिखाए जा रहे हैं।` : `Showing top 5 recent updates out of ${articles.length} total Current Affairs items.`}</span>
          </div>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="px-4 py-2 bg-[#0F4C81] hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all flex-shrink-0"
            >
              <span>{getTranslation('View All', language)} ({articles.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

