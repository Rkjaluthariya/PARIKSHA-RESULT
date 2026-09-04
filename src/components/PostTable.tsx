import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Post } from '../types';
import { PostCard } from './PostCard';
import { Award, FileText, Briefcase, ChevronRight, ArrowUpDown, Clock, Calendar, Building, Check, SortAsc, SortDesc, ChevronDown, GraduationCap, DollarSign, Key, BookOpen, Landmark } from 'lucide-react';
import { cleanTitleText } from '../utils/imageGenerator';
import { SafeText, sanitizeAndDecodeText } from '../hooks/useSafeTextRenderer';
import { getTranslation } from '../utils/translations';

interface PostTableProps {
  posts: Post[];
  activeCategory?: string;
  onSelectPost: (post: Post) => void;
  onSelectCategory: (cat: any) => void;
  bookmarkedPostIds?: string[];
  onToggleBookmarkPost?: (postId: string) => void;
  isLoading?: boolean;
  language?: 'en' | 'hi';
  onTranslateItem?: (itemId: string, itemType: 'post' | 'ca', itemData: any) => Promise<any>;
  translatedCache?: Record<string, any>;
}

export const PostTableSkeleton: React.FC<{ showTables?: boolean }> = ({ showTables = true }) => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Sorting Toolbar Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-200/80"></div>
          <div className="space-y-1.5">
            <div className="w-36 h-3.5 bg-slate-200/90 rounded"></div>
            <div className="w-24 h-2.5 bg-slate-200/60 rounded"></div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-24 h-8 bg-slate-200/80 rounded-lg"></div>
          <div className="w-32 h-8 bg-slate-200/80 rounded-lg"></div>
          <div className="w-28 h-8 bg-slate-200/80 rounded-lg"></div>
        </div>
      </div>

      {/* 3-Column Sarkari Table Grid Skeleton */}
      {showTables && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((col) => (
            <div key={col} className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="bg-slate-200/80 px-4 py-3 flex items-center justify-between">
                <div className="w-28 h-4 bg-slate-300/80 rounded"></div>
                <div className="w-14 h-3 bg-slate-300/60 rounded"></div>
              </div>
              <div className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5, 6].map((row) => (
                  <div key={row} className="p-3 flex items-start justify-between gap-2">
                    <div className="space-y-2 flex-1">
                      <div className="w-5/6 h-3.5 bg-slate-200/90 rounded"></div>
                      <div className="flex gap-2">
                        <div className="w-14 h-3 bg-slate-100 rounded"></div>
                        <div className="w-20 h-3 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-slate-200/80 rounded flex-shrink-0"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid of Skeleton Post Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="w-48 h-5 bg-slate-200/90 rounded"></div>
          <div className="w-32 h-3 bg-slate-200/60 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((card) => (
            <div key={card} className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex justify-between items-center">
                <div className="w-20 h-4 bg-slate-200/80 rounded-full"></div>
                <div className="w-16 h-3 bg-slate-100 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-4 bg-slate-200/90 rounded"></div>
                <div className="w-3/4 h-4 bg-slate-200/80 rounded"></div>
              </div>
              <div className="w-1/2 h-3 bg-slate-100 rounded"></div>
              <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center">
                <div className="w-24 h-3 bg-slate-100 rounded"></div>
                <div className="w-16 h-6 bg-slate-200/80 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

type SortOption = 'recent' | 'deadline' | 'organization';
type SortOrder = 'asc' | 'desc';

// Helper function to safely convert diverse date strings to timestamp
const parseDateString = (dateStr?: string): number => {
  if (!dateStr) return 0;
  const trimmed = dateStr.trim();
  // Format: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(trimmed).getTime();
  }
  // Format: DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
    const [day, month, year] = trimmed.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getTime();
  }
  // Standard Date parser fallback
  const parsed = Date.parse(trimmed);
  if (!isNaN(parsed)) return parsed;
  return 0;
};

export const PostTable = React.memo(function PostTable({
  posts,
  activeCategory = 'all',
  onSelectPost,
  onSelectCategory,
  bookmarkedPostIds = [],
  onToggleBookmarkPost,
  isLoading = false,
  language = 'en',
  onTranslateItem,
  translatedCache,
}: PostTableProps) {
  const INITIAL_BATCH = 12;
  const BATCH_SIZE = 12;

  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(INITIAL_BATCH);
  }, [activeCategory, sortBy, sortOrder]);

  // Attach passive event listeners for touch/scroll to prevent main-thread blocking on budget mobile devices
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    const passiveOpts: AddEventListenerOptions = { passive: true };
    const noopHandler = () => {};

    container.addEventListener('touchstart', noopHandler, passiveOpts);
    container.addEventListener('touchmove', noopHandler, passiveOpts);
    container.addEventListener('wheel', noopHandler, passiveOpts);
    container.addEventListener('scroll', noopHandler, passiveOpts);

    const toolbarEl = toolbarRef.current;
    if (toolbarEl) {
      toolbarEl.addEventListener('touchstart', noopHandler, passiveOpts);
      toolbarEl.addEventListener('touchmove', noopHandler, passiveOpts);
      toolbarEl.addEventListener('wheel', noopHandler, passiveOpts);
      toolbarEl.addEventListener('scroll', noopHandler, passiveOpts);
    }

    return () => {
      container.removeEventListener('touchstart', noopHandler);
      container.removeEventListener('touchmove', noopHandler);
      container.removeEventListener('wheel', noopHandler);
      container.removeEventListener('scroll', noopHandler);

      if (toolbarEl) {
        toolbarEl.removeEventListener('touchstart', noopHandler);
        toolbarEl.removeEventListener('touchmove', noopHandler);
        toolbarEl.removeEventListener('wheel', noopHandler);
        toolbarEl.removeEventListener('scroll', noopHandler);
      }
    };
  }, []);

  const showTables = activeCategory === 'all';

  // Real-Time Sorted Posts Memo (MUST be called unconditionally before early returns)
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (sortBy === 'recent') {
        const dateA = parseDateString(a.postDate);
        const dateB = parseDateString(b.postDate);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      }
      if (sortBy === 'deadline') {
        const dateA = parseDateString(a.lastDate);
        const dateB = parseDateString(b.lastDate);
        if (!dateA) return 1;
        if (!dateB) return -1;
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (sortBy === 'organization') {
        const orgA = (a.organization || '').toLowerCase();
        const orgB = (b.organization || '').toLowerCase();
        return sortOrder === 'asc' ? orgA.localeCompare(orgB) : orgB.localeCompare(orgA);
      }
      return 0;
    });
  }, [posts, sortBy, sortOrder]);

  const displayedPosts = useMemo(() => {
    return sortedPosts.slice(0, visibleCount);
  }, [sortedPosts, visibleCount]);

  // IntersectionObserver for infinite scrolling / lazy loading more posts
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const sentinel = loadMoreRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          setVisibleCount((prev) => {
            if (prev < sortedPosts.length) {
              return Math.min(prev + BATCH_SIZE, sortedPosts.length);
            }
            return prev;
          });
        }
      },
      {
        root: null,
        rootMargin: '300px',
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [sortedPosts.length, visibleCount]);

  const latestJobs = useMemo(() => sortedPosts.filter((p) => p.category === 'latest-jobs'), [sortedPosts]);
  const admitCards = useMemo(() => sortedPosts.filter((p) => p.category === 'admit-card'), [sortedPosts]);
  const results = useMemo(() => sortedPosts.filter((p) => p.category === 'results'), [sortedPosts]);
  const answerKeys = useMemo(() => sortedPosts.filter((p) => p.category === 'answer-key'), [sortedPosts]);
  const admissions = useMemo(() => sortedPosts.filter((p) => p.category === 'admissions'), [sortedPosts]);
  const scholarships = useMemo(() => sortedPosts.filter((p) => p.category === 'scholarships'), [sortedPosts]);
  const syllabus = useMemo(() => sortedPosts.filter((p) => p.category === 'syllabus'), [sortedPosts]);
  const govtSchemes = useMemo(() => sortedPosts.filter((p) => p.category === 'government-schemes'), [sortedPosts]);

  useEffect(() => {
    if (language === 'hi' && onTranslateItem) {
      // Gather posts displayed either in grid or in the 6 tables
      const postsToTranslate = showTables 
        ? [...latestJobs.slice(0, 7), ...admitCards.slice(0, 7), ...results.slice(0, 7), ...answerKeys.slice(0, 5), ...admissions.slice(0, 5), ...scholarships.slice(0, 5)]
        : displayedPosts;

      const untranslated = postsToTranslate
        .filter(post => post && !translatedCache?.[`post_${post.id}`])
        .slice(0, 10);

      untranslated.forEach(post => {
        onTranslateItem(post.id, 'post', post).catch(() => {});
      });
    }
  }, [language, displayedPosts, showTables, latestJobs, admitCards, results, answerKeys, admissions, scholarships, translatedCache, onTranslateItem]);

  if (isLoading) {
    return <PostTableSkeleton showTables={showTables} />;
  }

  // Handle setting sort type with smart default direction
  const handleSortChange = (option: SortOption) => {
    if (sortBy === option) {
      // Toggle order direction if clicking the same option
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(option);
      // Smart defaults: 'deadline' defaults to asc (nearest deadline first), 'organization' to asc (A-Z), 'recent' to desc (newest first)
      if (option === 'deadline') setSortOrder('asc');
      else if (option === 'organization') setSortOrder('asc');
      else setSortOrder('desc');
    }
  };

  // Category Banner Information Helper
  const getCategoryHeader = () => {
    switch (activeCategory) {
      case 'admit-card':
        return {
          title: language === 'hi' ? '📄 एडमिट कार्ड एवं हॉल टिकट 2026' : '📄 Official Admit Cards & Hall Tickets 2026',
          subtitle: language === 'hi' ? 'परीक्षा हॉल टिकट, प्रवेश पत्र और कॉल लेटर तुरंत डाउनलोड करें' : 'Download official exam hall tickets, call letters & exam city intimation slips',
          color: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
        };
      case 'results':
        return {
          title: language === 'hi' ? '🏆 सरकारी परीक्षा परिणाम एवं कटऑफ 2026' : '🏆 Declared Exam Results, Scorecards & Cutoffs 2026',
          subtitle: language === 'hi' ? 'मेरिट सूची, स्कोरकार्ड और चयन सूची ऑनलाइन देखें' : 'View official selection lists, merit scorecards & cutoff marks',
          color: 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white'
        };
      case 'answer-key':
        return {
          title: language === 'hi' ? '🔑 आंसर की एवं उत्तर तालिका 2026' : '🔑 Official Answer Keys & Objection Sheets 2026',
          subtitle: language === 'hi' ? 'आधिकारिक उत्तर कुंजी और रिस्पॉन्स शीट डाउनलोड करें' : 'Download official candidate response sheets & submit online question challenges',
          color: 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white'
        };
      case 'admissions':
        return {
          title: language === 'hi' ? '🎓 कॉलेज प्रवेश एवं काउंसलिंग फॉर्म 2026' : '🎓 Central & State College Admissions & Counseling 2026',
          subtitle: language === 'hi' ? 'विश्वविद्यालय प्रवेश परीक्षा, सीट आवंटन और ऑनलाइन काउंसलिंग' : 'Explore university entrance forms, college choice filling & seat allotment lists',
          color: 'bg-gradient-to-r from-blue-700 to-indigo-900 text-white'
        };
      case 'scholarships':
        return {
          title: language === 'hi' ? '💰 छात्रवृत्ति एवं शुल्क प्रतिपूर्ति योजनाएं 2026' : '💰 National & State Scholarships & Financial Aid 2026',
          subtitle: language === 'hi' ? 'प्री-मैट्रिक, पोस्ट-मैट्रिक छात्रवृत्ति और शुल्क रीइंबर्समेंट आवेदन' : 'Apply online for pre-matric, post-matric scholarships & student fee waivers',
          color: 'bg-gradient-to-r from-emerald-800 to-green-900 text-white'
        };
      case 'syllabus':
        return {
          title: language === 'hi' ? '📚 परीक्षा पाठ्यक्रम एवं एग्जाम पैटर्न 2026' : '📚 Official Exam Syllabus & Pattern PDF 2026',
          subtitle: language === 'hi' ? 'विषयवार सिलेबस, अंक योजना और physical मानदंड' : 'Download detailed subject-wise curriculums, marking schemes & exam patterns',
          color: 'bg-gradient-to-r from-slate-800 to-slate-900 text-white'
        };
      case 'government-schemes':
        return {
          title: language === 'hi' ? '🏛️ सरकारी जन-कल्याणकारी योजनाएं 2026' : '🏛️ Government Welfare Schemes & Citizen Portals 2026',
          subtitle: language === 'hi' ? 'किसान सम्मान निधि, लाडली बहना एवं प्रत्यक्ष लाभ अंतरण योजनाएं' : 'Check beneficiary lists, status tracking & direct benefit transfers (DBT)',
          color: 'bg-gradient-to-r from-cyan-800 to-blue-900 text-white'
        };
      case 'latest-jobs':
        return {
          title: language === 'hi' ? '💼 नवीनतम सरकारी नौकरियां एवं भर्तियां 2026' : '💼 Latest Sarkari Naukri & Government Jobs 2026',
          subtitle: language === 'hi' ? 'केंद्र एवं राज्य सरकार के ऑनलाइन आवेदन पत्र' : 'Apply online for Central & State Government vacancies',
          color: 'bg-gradient-to-r from-[#0F4C81] to-blue-900 text-white'
        };
      default:
        return null;
    }
  };

  const categoryBanner = getCategoryHeader();

  return (
    <div
      ref={tableContainerRef}
      className="space-y-8"
      style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
    >
      {/* Category Specific Header Banner */}
      {!showTables && categoryBanner && (
        <div className={`rounded-2xl p-5 sm:p-6 shadow-md ${categoryBanner.color} space-y-2 relative overflow-hidden`}>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                {categoryBanner.title}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-100/90 mt-1">
                {categoryBanner.subtitle}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-bold whitespace-nowrap self-start sm:self-auto">
              {sortedPosts.length} {language === 'hi' ? 'सत्यापित अपडेट्स उपलब्ध' : 'Verified Updates Available'}
            </div>
          </div>
        </div>
      )}

      {/* Real-time Sorting Toolbar */}
      <div
        ref={toolbarRef}
        className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{ touchAction: 'pan-x', overscrollBehaviorX: 'contain', WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 text-amber-700 rounded-lg">
            <ArrowUpDown className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-900 uppercase tracking-wide block">
              {getTranslation('Real-Time Opportunity Sorting', language)}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {language === 'hi' ? `${sortedPosts.length} सरकारी अपडेट्स को तुरंत छाँटें` : `Sort ${sortedPosts.length} government updates instantly`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Option 1: Most Recent */}
          <button
            onClick={() => handleSortChange('recent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              sortBy === 'recent'
                ? 'bg-[#0F4C81] text-white shadow-sm ring-2 ring-[#0F4C81]/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{getTranslation('Most Recent', language)}</span>
            {sortBy === 'recent' && (
              <span className="ml-0.5 text-[10px]">
                {sortOrder === 'desc' ? '↓' : '↑'}
              </span>
            )}
          </button>

          {/* Option 2: Application Deadline */}
          <button
            onClick={() => handleSortChange('deadline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              sortBy === 'deadline'
                ? 'bg-[#0F4C81] text-white shadow-sm ring-2 ring-[#0F4C81]/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{getTranslation('Application Deadline', language)}</span>
            {sortBy === 'deadline' && (
              <span className="ml-0.5 text-[10px]">
                {sortOrder === 'asc' ? '↑ (Nearest)' : '↓'}
              </span>
            )}
          </button>

          {/* Option 3: Organization Name */}
          <button
            onClick={() => handleSortChange('organization')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              sortBy === 'organization'
                ? 'bg-[#0F4C81] text-white shadow-sm ring-2 ring-[#0F4C81]/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>{getTranslation('Organization Name', language)}</span>
            {sortBy === 'organization' && (
              <span className="ml-0.5 text-[10px]">
                {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
              </span>
            )}
          </button>

          {/* Sort Order Direction Toggle */}
          <button
            onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all text-xs font-bold flex items-center gap-1 border border-slate-200"
            title="Toggle sort direction"
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Multi-Column Desktop Sarkari Grid */}
      {showTables && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Latest Jobs */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-[#0F4C81] text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider">
                  <Briefcase className="w-4 h-4 text-amber-300" />
                  <span>{getTranslation('Latest Jobs', language)}</span>
                </div>
                <button
                  onClick={() => onSelectCategory('latest-jobs')}
                  className="text-[11px] font-bold text-amber-300 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{getTranslation('View All', language)} ({latestJobs.length})</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-slate-100 flex-1">
                {latestJobs.slice(0, 7).map((post, idx) => {
                  const cacheKey = `post_${post.id}`;
                  const isTranslated = language === 'hi' && translatedCache?.[cacheKey];
                  const displayTitle = isTranslated ? translatedCache[cacheKey].title : cleanTitleText(post.title);
                  return (
                    <div
                      key={`${post.id || 'job'}-${idx}`}
                      onClick={() => onSelectPost(post)}
                      className="p-3 hover:bg-slate-50 transition-colors cursor-pointer group flex items-start gap-2 justify-between"
                    >
                      <div className="space-y-1">
                        <SafeText
                          content={displayTitle}
                          className="text-xs font-bold text-slate-900 group-hover:text-[#0F4C81] transition-colors leading-snug block"
                        />
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold flex-wrap">
                          <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200/60">
                            {post.state}
                          </span>
                          {post.lastDate && (
                            <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                              {getTranslation('Deadline', language)}: {post.lastDate}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-white bg-[#FF6B00] px-2 py-1 rounded flex-shrink-0 hover:bg-orange-600">
                        {getTranslation('Apply', language)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Admit Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-[#FF6B00] text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-yellow-200" />
                  <span>{getTranslation('Admit Card', language)}</span>
                </div>
                <button
                  onClick={() => onSelectCategory('admit-card')}
                  className="text-[11px] font-bold text-yellow-200 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{getTranslation('View All', language)} ({admitCards.length})</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-slate-100 flex-1">
                {admitCards.slice(0, 7).map((post, idx) => {
                  const cacheKey = `post_${post.id}`;
                  const isTranslated = language === 'hi' && translatedCache?.[cacheKey];
                  const displayTitle = isTranslated ? translatedCache[cacheKey].title : cleanTitleText(post.title);
                  const displayOrg = isTranslated ? translatedCache[cacheKey].organization : post.organization;
                  return (
                    <div
                      key={`${post.id || 'admit'}-${idx}`}
                      onClick={() => onSelectPost(post)}
                      className="p-3 hover:bg-slate-50 transition-colors cursor-pointer group flex items-start gap-2 justify-between"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-[#FF6B00] transition-colors leading-snug">
                          {displayTitle}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">
                          {displayOrg}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-white bg-[#0F4C81] px-2 py-1 rounded flex-shrink-0 hover:bg-blue-900">
                        {getTranslation('Download', language)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 3: Results */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-emerald-700 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider">
                  <Award className="w-4 h-4 text-emerald-200" />
                  <span>{getTranslation('Results', language)}</span>
                </div>
                <button
                  onClick={() => onSelectCategory('results')}
                  className="text-[11px] font-bold text-emerald-200 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{getTranslation('View All', language)} ({results.length})</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-slate-100 flex-1">
                {results.slice(0, 7).map((post, idx) => {
                  const cacheKey = `post_${post.id}`;
                  const isTranslated = language === 'hi' && translatedCache?.[cacheKey];
                  const displayTitle = isTranslated ? translatedCache[cacheKey].title : cleanTitleText(post.title);
                  return (
                    <div
                      key={`${post.id || 'res'}-${idx}`}
                      onClick={() => onSelectPost(post)}
                      className="p-3 hover:bg-slate-50 transition-colors cursor-pointer group flex items-start gap-2 justify-between"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                          {displayTitle}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">
                          {getTranslation('Declared on', language)} {post.postDate}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-white bg-emerald-600 px-2 py-1 rounded flex-shrink-0 hover:bg-emerald-700">
                        {getTranslation('Check', language)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Secondary 3-Column Grid for Answer Key, Admissions, Scholarships */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 4: Answer Key */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-purple-800 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider">
                  <Key className="w-4 h-4 text-purple-200" />
                  <span>{getTranslation('Answer Key', language)}</span>
                </div>
                <button
                  onClick={() => onSelectCategory('answer-key')}
                  className="text-[11px] font-bold text-purple-200 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{getTranslation('View All', language)} ({answerKeys.length})</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-slate-100 flex-1">
                {answerKeys.slice(0, 5).map((post, idx) => {
                  const cacheKey = `post_${post.id}`;
                  const isTranslated = language === 'hi' && translatedCache?.[cacheKey];
                  const displayTitle = isTranslated ? translatedCache[cacheKey].title : cleanTitleText(post.title);
                  const displayOrg = isTranslated ? (translatedCache[cacheKey].organization || post.organization) : post.organization;
                  return (
                    <div
                      key={`${post.id || 'key'}-${idx}`}
                      onClick={() => onSelectPost(post)}
                      className="p-3 hover:bg-slate-50 transition-colors cursor-pointer group flex items-start gap-2 justify-between"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                          {displayTitle}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">
                          {displayOrg}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-white bg-purple-600 px-2 py-1 rounded flex-shrink-0 hover:bg-purple-700">
                        {language === 'hi' ? 'देखें' : 'View Key'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 5: Admissions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-blue-900 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4 text-blue-200" />
                  <span>{getTranslation('Admissions', language)}</span>
                </div>
                <button
                  onClick={() => onSelectCategory('admissions')}
                  className="text-[11px] font-bold text-blue-200 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{getTranslation('View All', language)} ({admissions.length})</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-slate-100 flex-1">
                {admissions.slice(0, 5).map((post, idx) => {
                  const cacheKey = `post_${post.id}`;
                  const isTranslated = language === 'hi' && translatedCache?.[cacheKey];
                  const displayTitle = isTranslated ? translatedCache[cacheKey].title : cleanTitleText(post.title);
                  const displayOrg = isTranslated ? (translatedCache[cacheKey].organization || post.organization) : post.organization;
                  return (
                    <div
                      key={`${post.id || 'adm'}-${idx}`}
                      onClick={() => onSelectPost(post)}
                      className="p-3 hover:bg-slate-50 transition-colors cursor-pointer group flex items-start gap-2 justify-between"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
                          {displayTitle}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">
                          {post.lastDate ? `${language === 'hi' ? 'अंतिम तिथि:' : 'Deadline:'} ${post.lastDate}` : displayOrg}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-white bg-blue-700 px-2 py-1 rounded flex-shrink-0 hover:bg-blue-800">
                        {language === 'hi' ? 'आवेदन' : 'Apply'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 6: Scholarships */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-teal-800 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider">
                  <DollarSign className="w-4 h-4 text-teal-200" />
                  <span>{getTranslation('Scholarships', language)}</span>
                </div>
                <button
                  onClick={() => onSelectCategory('scholarships')}
                  className="text-[11px] font-bold text-teal-200 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{getTranslation('View All', language)} ({scholarships.length})</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-slate-100 flex-1">
                {scholarships.slice(0, 5).map((post, idx) => {
                  const cacheKey = `post_${post.id}`;
                  const isTranslated = language === 'hi' && translatedCache?.[cacheKey];
                  const displayTitle = isTranslated ? translatedCache[cacheKey].title : cleanTitleText(post.title);
                  const displayOrg = isTranslated ? (translatedCache[cacheKey].organization || post.organization) : post.organization;
                  return (
                    <div
                      key={`${post.id || 'sch'}-${idx}`}
                      onClick={() => onSelectPost(post)}
                      className="p-3 hover:bg-slate-50 transition-colors cursor-pointer group flex items-start gap-2 justify-between"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                          {displayTitle}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">
                          {post.lastDate ? `${language === 'hi' ? 'अंतिम तिथि:' : 'Last Date:'} ${post.lastDate}` : displayOrg}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-white bg-teal-700 px-2 py-1 rounded flex-shrink-0 hover:bg-teal-800">
                        {language === 'hi' ? 'आवेदन' : 'Apply'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of All Recent Posts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#0F4C81] rounded-sm"></span>
            {activeCategory === 'all' ? getTranslation('All Live Notifications & Updates', language) : `${getTranslation(activeCategory.replace('-', ' '), language).toUpperCase()} ${getTranslation('Updates', language)}`}
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {getTranslation('Sorted by', language)} <strong className="text-[#0F4C81] font-bold capitalize">{sortBy === 'recent' ? getTranslation('Most Recent', language) : (sortBy === 'deadline' ? getTranslation('Application Deadline', language) : getTranslation('Organization Name', language))}</strong> ({sortedPosts.length} {getTranslation('updates', language)})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedPosts.map((post, idx) => (
            <div
              key={`${post.id || 'p'}-${idx}`}
              style={{ contentVisibility: 'auto', containIntrinsicSize: '0 320px' }}
            >
              <PostCard
                post={post}
                onClick={onSelectPost}
                isBookmarked={bookmarkedPostIds.includes(post.id)}
                onToggleBookmark={onToggleBookmarkPost}
                language={language}
                translatedCache={translatedCache}
              />
            </div>
          ))}
        </div>

        {sortedPosts.length > visibleCount && (
          <div
            ref={loadMoreRef}
            className="flex flex-col items-center justify-center py-8 gap-2.5 text-slate-500"
          >
            <div className="w-7 h-7 border-3 border-[#0F4C81] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-slate-700 tracking-wide">
              {language === 'hi' ? 'और अपडेट लोड हो रहे हैं...' : 'Loading more updates...'}
            </span>
            <button
              onClick={() => setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, sortedPosts.length))}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F4C81] text-xs font-bold rounded-lg border border-slate-200/80 transition-all cursor-pointer"
            >
              {language === 'hi' ? 'मैन्युअल रूप से लोड करें' : 'Click to load manually'} ({sortedPosts.length - visibleCount} {language === 'hi' ? 'शेष' : 'remaining'})
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

