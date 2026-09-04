import { getTranslation } from './utils/translations';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Post, CategoryType, StateType, QuizQuestion } from './types';
import { INITIAL_POSTS, INITIAL_QUIZ_QUESTIONS, INITIAL_CURRENT_AFFAIRS, dedupeById } from './data/mockPosts';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PostTable } from './components/PostTable';
import { PostDetailModal } from './components/PostDetailModal';
import { AIContentGeneratorModal } from './components/AIContentGeneratorModal';
import { AutoFetchPortalModal } from './components/AutoFetchPortalModal';
import { CronSchedulerModal } from './components/CronSchedulerModal';
import { SitemapModal } from './components/SitemapModal';
import { AgeCalculatorModal } from './components/AgeCalculatorModal';
import { SarkariSalaryCalculatorModal } from './components/SarkariSalaryCalculatorModal';
import { ExamCutOffPredictorModal } from './components/ExamCutOffPredictorModal';
import { SyllabusChecklistModal } from './components/SyllabusChecklistModal';
import { PhotoSignatureResizerModal } from './components/PhotoSignatureResizerModal';
import { ExamRankPredictorModal } from './components/ExamRankPredictorModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AdminLockModal } from './components/AdminLockModal';
import { SavedItemsModal } from './components/SavedItemsModal';
import { PWANotificationModal } from './components/PWANotificationModal';
import { LegalPageModal, LegalPageType } from './components/LegalPageModal';
import { GlobalFeedbackModal } from './components/GlobalFeedbackModal';
import { EligibilityChecker } from './components/EligibilityChecker';
import { QuizSection } from './components/QuizSection';
import { CurrentAffairsSection } from './components/CurrentAffairsSection';
import { Footer } from './components/Footer';
import { Breadcrumb } from './components/Breadcrumb';
import { SEOMetaTags } from './components/SEOMetaTags';
import { NetworkStatusIndicator } from './components/NetworkStatusIndicator';
import { AdsterraAd } from './components/AdsterraAd';
import { Search, Sparkles, Filter, RefreshCw, Layers, Globe, Bookmark, BookOpen } from 'lucide-react';
import { filterOlderThanOneYear } from './utils/dateFilter';
import { safeSetLocalStorage, safeGetLocalStorage } from './utils/safeStorage';
import { normalizePostsList } from './utils/categoryFix';
import { usePrefetchRecentPosts } from './hooks/usePrefetchRecentPosts';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const safeDedupe = useCallback(<T extends { id: string }>(items: T[]): T[] => {
    if (!Array.isArray(items)) return [];
    if (typeof dedupeById === 'function') {
      return dedupeById(items);
    }
    const seen = new Set<string>();
    return items.filter(item => {
      if (!item || !item.id) return false;
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, []);

  const [posts, setPosts] = useState<Post[]>(() => {
    const defaultPosts = Array.isArray(INITIAL_POSTS) ? INITIAL_POSTS : [];
    try {
      const parsed = safeGetLocalStorage<Post[]>('pariksha_cached_posts', []);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cachedIds = new Set(parsed.map((p: any) => p?.id).filter(Boolean));
        const missingInitial = defaultPosts.filter((p) => p && p.id && !cachedIds.has(p.id));
        const combined = [...parsed, ...missingInitial];
        return safeDedupe(filterOlderThanOneYear(normalizePostsList(combined)));
      }
    } catch (e) {
      console.error('Failed to load cached posts from localStorage:', e);
    }
    return safeDedupe(filterOlderThanOneYear(normalizePostsList(defaultPosts)));
  });

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() => {
    return Array.isArray(INITIAL_QUIZ_QUESTIONS) ? INITIAL_QUIZ_QUESTIONS : [];
  });

  const [currentAffairs, setCurrentAffairs] = useState(() => {
    const defaultCA = Array.isArray(INITIAL_CURRENT_AFFAIRS) ? INITIAL_CURRENT_AFFAIRS : [];
    try {
      const parsed = safeGetLocalStorage<any[]>('pariksha_cached_current_affairs', []);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cachedIds = new Set(parsed.map((ca: any) => ca?.id).filter(Boolean));
        const missingInitial = defaultCA.filter((ca) => ca && ca.id && !cachedIds.has(ca.id));
        const combined = [...parsed, ...missingInitial];
        return safeDedupe(filterOlderThanOneYear(combined));
      }
    } catch (e) {
      console.error('Failed to load cached current affairs from localStorage:', e);
    }
    return safeDedupe(filterOlderThanOneYear(defaultCA));
  });
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'all'>('all');
  const [selectedState, setSelectedState] = useState<StateType>('All India');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected post for detail modal
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Sync state with URL
  useEffect(() => {
    const path = location.pathname.split('/').filter(Boolean);
    if (path.length === 0) {
      setActiveCategory('all');
      setSelectedPost(null);
    } else if (path.length === 1) {
      const rawCat = path[0];
      if (rawCat === 'privacy-policy') {
        setLegalPageTab('privacy');
        setLegalPageOpen(true);
      } else if (rawCat === 'terms-conditions' || rawCat === 'terms') {
        setLegalPageTab('terms');
        setLegalPageOpen(true);
      } else if (rawCat === 'disclaimer') {
        setLegalPageTab('disclaimer');
        setLegalPageOpen(true);
      } else if (rawCat === 'contact-us' || rawCat === 'contact') {
        setLegalPageTab('contact');
        setLegalPageOpen(true);
      } else if (rawCat === 'age-calculator') {
        setAgeCalcOpen(true);
      } else {
        const normalizedCat = (rawCat === 'quizzes' || rawCat === 'quiz') ? 'quiz' : rawCat;
        setActiveCategory(normalizedCat as CategoryType);
        setSelectedPost(null);
      }
    } else if (path.length === 2) {
      const segment0 = path[0];
      const segment1 = path[1];

      if (segment0 === 'state') {
        const formattedState = segment1.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        setSelectedState(formattedState as StateType);
        setActiveCategory('all');
        setSelectedPost(null);
      } else if (segment0 === 'tools') {
        if (segment1.includes('photo-resizer') || segment1.includes('photo-signature-resizer')) {
          setPhotoResizerOpen(true);
        } else if (segment1.includes('rank-predictor')) {
          setRankPredictorOpen(true);
        } else if (segment1.includes('salary-calculator')) {
          setSalaryCalcOpen(true);
        } else if (segment1.includes('cut-off-predictor') || segment1.includes('cutoff-predictor')) {
          setCutOffPredictorOpen(true);
        } else if (segment1.includes('syllabus-checklist') || segment1.includes('syllabus-tracker')) {
          setSyllabusChecklistOpen(true);
        } else if (segment1.includes('age-calculator')) {
          setAgeCalcOpen(true);
        }
      } else {
        const normalizedCat = (segment0 === 'quizzes' || segment0 === 'quiz') ? 'quiz' : segment0;
        setActiveCategory(normalizedCat as CategoryType);
        const post = posts.find((p) => 
          p && (p.slug === segment1 || p.id === segment1 || p.slug?.toLowerCase() === segment1.toLowerCase())
        );
        if (post) {
          setSelectedPost(post);
        } else {
          setSelectedPost(null);
        }
      }
    }
  }, [location.pathname, posts]);

  const handleCategoryChange = (cat: CategoryType | 'all') => {
    if (cat === 'all') {
      navigate('/');
    } else {
      navigate(`/${cat}`);
    }
  };

  const handlePostChange = (post: Post | null) => {
    if (post) {
      navigate(`/${post.category}/${post.slug}`);
    } else {
      if (activeCategory === 'all') {
        navigate('/');
      } else {
        navigate(`/${activeCategory}`);
      }
    }
  };

  // Modals state
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);
  const [autoFetchOpen, setAutoFetchOpen] = useState(false);
  const [cronOpen, setCronOpen] = useState(false);
  const [sitemapOpen, setSitemapOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [ageCalcOpen, setAgeCalcOpen] = useState(false);
  const [salaryCalcOpen, setSalaryCalcOpen] = useState(false);
  const [cutOffPredictorOpen, setCutOffPredictorOpen] = useState(false);
  const [syllabusChecklistOpen, setSyllabusChecklistOpen] = useState(false);
  const [photoResizerOpen, setPhotoResizerOpen] = useState(false);
  const [rankPredictorOpen, setRankPredictorOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminLockOpen, setAdminLockOpen] = useState(false);
  const [savedItemsOpen, setSavedItemsOpen] = useState(false);
  const [pwaAlertsOpen, setPwaAlertsOpen] = useState(false);
  const [legalPageOpen, setLegalPageOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [legalPageTab, setLegalPageTab] = useState<LegalPageType>('privacy');

  // Candidate Smart Tool URL Router Handlers
  const handleOpenPhotoResizer = useCallback(() => {
    setPhotoResizerOpen(true);
    if (typeof window !== 'undefined' && !window.location.pathname.includes('photo-signature-resizer') && !window.location.pathname.includes('photo-resizer')) {
      window.history.pushState(null, '', '/tools/photo-signature-resizer');
    }
  }, []);

  const handleClosePhotoResizer = useCallback(() => {
    setPhotoResizerOpen(false);
    if (typeof window !== 'undefined' && (window.location.pathname.includes('photo-signature-resizer') || window.location.pathname.includes('photo-resizer') || window.location.pathname.includes('signature-resizer'))) {
      window.history.pushState(null, '', '/');
    }
  }, []);

  const handleOpenRankPredictor = useCallback(() => {
    setRankPredictorOpen(true);
    if (typeof window !== 'undefined' && !window.location.pathname.includes('rank-predictor')) {
      window.history.pushState(null, '', '/tools/exam-rank-predictor');
    }
  }, []);

  const handleCloseRankPredictor = useCallback(() => {
    setRankPredictorOpen(false);
    if (typeof window !== 'undefined' && window.location.pathname.includes('rank-predictor')) {
      window.history.pushState(null, '', '/');
    }
  }, []);

  const handleOpenSalaryCalc = useCallback(() => {
    setSalaryCalcOpen(true);
    if (typeof window !== 'undefined' && !window.location.pathname.includes('salary-calculator')) {
      window.history.pushState(null, '', '/tools/sarkari-salary-calculator');
    }
  }, []);

  const handleCloseSalaryCalc = useCallback(() => {
    setSalaryCalcOpen(false);
    if (typeof window !== 'undefined' && window.location.pathname.includes('salary-calculator')) {
      window.history.pushState(null, '', '/');
    }
  }, []);

  const handleOpenCutOffPredictor = useCallback(() => {
    setCutOffPredictorOpen(true);
    if (typeof window !== 'undefined' && !window.location.pathname.includes('cut-off-predictor')) {
      window.history.pushState(null, '', '/tools/exam-cut-off-predictor');
    }
  }, []);

  const handleCloseCutOffPredictor = useCallback(() => {
    setCutOffPredictorOpen(false);
    if (typeof window !== 'undefined' && (window.location.pathname.includes('cut-off-predictor') || window.location.pathname.includes('cutoff-predictor'))) {
      window.history.pushState(null, '', '/');
    }
  }, []);

  const handleOpenSyllabusChecklist = useCallback(() => {
    setSyllabusChecklistOpen(true);
    if (typeof window !== 'undefined' && !window.location.pathname.includes('syllabus-checklist')) {
      window.history.pushState(null, '', '/tools/syllabus-checklist');
    }
  }, []);

  const handleCloseSyllabusChecklist = useCallback(() => {
    setSyllabusChecklistOpen(false);
    if (typeof window !== 'undefined' && (window.location.pathname.includes('syllabus-checklist') || window.location.pathname.includes('syllabus-tracker'))) {
      window.history.pushState(null, '', '/');
    }
  }, []);

  const handleOpenAgeCalc = useCallback(() => {
    setAgeCalcOpen(true);
    if (typeof window !== 'undefined' && !window.location.pathname.includes('age-calculator')) {
      window.history.pushState(null, '', '/tools/age-calculator');
    }
  }, []);

  const handleCloseAgeCalc = useCallback(() => {
    setAgeCalcOpen(false);
    if (typeof window !== 'undefined' && window.location.pathname.includes('age-calculator')) {
      window.history.pushState(null, '', '/');
    }
  }, []);

  // Listen for direct URL entry and popstate browser navigation for candidate tool routes
  useEffect(() => {
    const checkToolRoutes = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname;
      if (path.includes('photo-signature-resizer') || path.includes('photo-resizer') || path.includes('signature-resizer')) {
        setPhotoResizerOpen(true);
      } else if (path.includes('rank-predictor')) {
        setRankPredictorOpen(true);
      } else if (path.includes('salary-calculator')) {
        setSalaryCalcOpen(true);
      } else if (path.includes('cut-off-predictor') || path.includes('cutoff-predictor')) {
        setCutOffPredictorOpen(true);
      } else if (path.includes('syllabus-checklist') || path.includes('syllabus-tracker')) {
        setSyllabusChecklistOpen(true);
      } else if (path.includes('age-calculator')) {
        setAgeCalcOpen(true);
      }
    };

    checkToolRoutes();
    window.addEventListener('popstate', checkToolRoutes);
    return () => window.removeEventListener('popstate', checkToolRoutes);
  }, []);

  // Check Admin Authentication Status (with 15 minute session expiry)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const isAuth = localStorage.getItem('pariksha_admin_authenticated') === 'true' ||
                     sessionStorage.getItem('pariksha_admin_authenticated') === 'true';
      if (!isAuth) return false;
      const loginTime = localStorage.getItem('pariksha_admin_login_time');
      if (loginTime && (Date.now() - parseInt(loginTime, 10)) > 15 * 60 * 1000) {
        localStorage.removeItem('pariksha_admin_authenticated');
        localStorage.removeItem('pariksha_admin_login_time');
        return false;
      }
      return true;
    } catch {
      return false;
    }
  });

  // Admin Mode State (Hidden from public users, accessible via ?admin=secret, Ctrl+Shift+A, or 5-click logo trigger)
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      const isAuth = localStorage.getItem('pariksha_admin_authenticated') === 'true' ||
                     sessionStorage.getItem('pariksha_admin_authenticated') === 'true';
      const loginTime = localStorage.getItem('pariksha_admin_login_time');
      if (isAuth && loginTime && (Date.now() - parseInt(loginTime, 10)) <= 15 * 60 * 1000) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });

  // Check session validity & auto-logout if 15 minutes expired
  const checkAdminSessionValidity = useCallback(() => {
    try {
      const isAuth = localStorage.getItem('pariksha_admin_authenticated') === 'true' ||
                     sessionStorage.getItem('pariksha_admin_authenticated') === 'true';
      if (!isAuth) return false;

      const loginTimeStr = localStorage.getItem('pariksha_admin_login_time');
      if (!loginTimeStr) return true;

      const loginTime = parseInt(loginTimeStr, 10);
      const elapsed = Date.now() - loginTime;

      if (elapsed > 15 * 60 * 1000) { // 15 Minutes Session Expired
        localStorage.removeItem('pariksha_admin_authenticated');
        localStorage.removeItem('pariksha_admin_login_time');
        localStorage.removeItem('pariksha_admin_mode');
        sessionStorage.removeItem('pariksha_admin_authenticated');

        setIsAdminAuthenticated(false);
        setIsAdminMode(false);
        setAdminOpen(false);

        setToastNotification({
          message: '🔒 Admin session expired after 15 minutes. Please log in again.',
          type: 'job'
        });
        setTimeout(() => setToastNotification(null), 5000);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  // Periodic Admin Session Check
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAdminAuthenticated) {
        checkAdminSessionValidity();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isAdminAuthenticated, checkAdminSessionValidity]);

  // Global Keyboard Shortcut: Ctrl + Shift + A (Opens Admin Lock Modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleOpenAdminWithCheck();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Intercept Obfuscated Short Admin URL triggers (?k=x9, ?key=px9, ?adm=sec, etc.)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const storedSecretKey = localStorage.getItem('pariksha_admin_secret_url_key')?.trim() || 'k=x9';
    
    // Extract key name and value from stored string (e.g., 'k=x9' -> paramName 'k', paramVal 'x9')
    const keyParts = storedSecretKey.split('=');
    const secretParamName = keyParts[0] || 'k';
    const secretParamVal = keyParts[1] || 'x9';

    const matchSecretUrl = urlParams.get(secretParamName) === secretParamVal ||
                           urlParams.get('k') === 'x9' ||
                           urlParams.get('key') === 'px9' ||
                           urlParams.get('adm') === 'sec' ||
                           urlParams.get('admin') === 'secret' ||
                           urlParams.get('admin') === 'true' ||
                           window.location.pathname.includes('/admin') ||
                           window.location.hash.includes('admin');
    
    if (matchSecretUrl) {
      if (checkAdminSessionValidity()) {
        setIsAdminMode(true);
        setAdminOpen(true);
      } else {
        setAdminLockOpen(true);
      }
    }
  }, [location, checkAdminSessionValidity]);

  const handleOpenAdminWithCheck = () => {
    if (checkAdminSessionValidity()) {
      setIsAdminMode(true);
      setAdminOpen(true);
    } else {
      setAdminLockOpen(true);
    }
  };

  const handleExitAdminMode = () => {
    setIsAdminMode(false);
    setIsAdminAuthenticated(false);
    setAdminOpen(false);
    try {
      localStorage.removeItem('pariksha_admin_mode');
      localStorage.removeItem('pariksha_admin_authenticated');
      sessionStorage.removeItem('pariksha_admin_authenticated');
    } catch (e) {}
  };

  // Bookmark / Saved Items state persisted in localStorage
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pariksha_bookmarked_posts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarkedCaIds, setBookmarkedCaIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pariksha_bookmarked_ca');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [language, setLanguage] = useState<'en' | 'hi'>(() => {
    try {
      const saved = localStorage.getItem('pariksha_language');
      const resolved = (saved === 'hi' || saved === 'en') ? saved : 'en';
      if (typeof document !== 'undefined') {
        document.documentElement.lang = resolved;
      }
      return resolved;
    } catch {
      return 'en';
    }
  });

  const handleLanguageChange = useCallback((newLang: 'en' | 'hi') => {
    setLanguage(newLang);
    try {
      localStorage.setItem('pariksha_language', newLang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLang;
      }
    } catch (e) {
      console.error('Failed to persist language change:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('pariksha_language', language);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = language;
      }
    } catch (e) {}
  }, [language]);

  const [translatedCache, setTranslatedCache] = useState<Record<string, any>>(() => {
    try {
      const saved = localStorage.getItem('pariksha_translated_cache');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pariksha_translated_cache', JSON.stringify(translatedCache));
    } catch (e) {}
  }, [translatedCache]);

  const handleTranslateItem = async (itemId: string, itemType: 'post' | 'ca', itemData: any) => {
    const cacheKey = `${itemType}_${itemId}`;
    if (translatedCache[cacheKey]) {
      return translatedCache[cacheKey];
    }
    try {
      const payload: Record<string, string> = {};
      if (itemType === 'post') {
        payload.title = itemData.title || '';
        payload.organization = itemData.organization || '';
        payload.shortInfo = itemData.shortInfo || '';
        payload.fullDescription = itemData.fullDescription || '';
      } else {
        payload.title = itemData.title || '';
        payload.shortInfo = itemData.summary || '';
        payload.fullDescription = Array.isArray(itemData.keyPoints) ? itemData.keyPoints.join('\n') : (itemData.keyPoints || '');
      }

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.translation) {
        setTranslatedCache(prev => ({
          ...prev,
          [cacheKey]: data.translation
        }));
        return data.translation;
      }
    } catch (error) {
      console.error('Translation error:', error);
    }
    return null;
  };

  // Idle Pre-fetching: Warms the details, banners, and translations of top 5 recent posts when user is idle on homepage
  const isAnyModalOpen = Boolean(
    selectedPost ||
    aiGeneratorOpen ||
    autoFetchOpen ||
    cronOpen ||
    sitemapOpen ||
    aiChatOpen ||
    ageCalcOpen ||
    adminOpen ||
    adminLockOpen ||
    savedItemsOpen ||
    pwaAlertsOpen ||
    legalPageOpen ||
    feedbackModalOpen
  );

  usePrefetchRecentPosts(posts, {
    activeCategory,
    isModalOpen: isAnyModalOpen,
    language,
    onTranslateItem: handleTranslateItem,
    maxPosts: 5,
    idleDelayMs: 1200
  });

  useEffect(() => {
    safeSetLocalStorage('pariksha_bookmarked_posts', bookmarkedPostIds);
  }, [bookmarkedPostIds]);

  useEffect(() => {
    safeSetLocalStorage('pariksha_bookmarked_ca', bookmarkedCaIds);
  }, [bookmarkedCaIds]);

  // Persist posts to localStorage for instant offline/cached rendering
  useEffect(() => {
    if (posts && posts.length > 0) {
      safeSetLocalStorage('pariksha_cached_posts', posts);
    }
  }, [posts]);

  // Persist current affairs to localStorage for instant offline/cached rendering
  useEffect(() => {
    if (currentAffairs && currentAffairs.length > 0) {
      safeSetLocalStorage('pariksha_cached_current_affairs', currentAffairs);
    }
  }, [currentAffairs]);

  const handleToggleBookmarkPost = (postId: string) => {
    setBookmarkedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleToggleBookmarkCA = (caId: string) => {
    setBookmarkedCaIds((prev) =>
      prev.includes(caId) ? prev.filter((id) => id !== caId) : [...prev, caId]
    );
  };

  const handleClearAllBookmarks = () => {
    if (window.confirm('Are you sure you want to clear all saved items?')) {
      setBookmarkedPostIds([]);
      setBookmarkedCaIds([]);
    }
  };

  // Auto-Sync Toast Notification State
  const [toastNotification, setToastNotification] = useState<{ message: string; type: 'ca' | 'job' | 'blog' } | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Fetch Auto-Synced Data from Server (Parallel fetch with immediate localStorage cache updates)
  const fetchAutoSyncData = useCallback(async () => {
    try {
      const [caRes, postsRes, quizRes] = await Promise.all([
        fetch('/api/current-affairs').catch(() => null),
        fetch('/api/posts').catch(() => null),
        fetch('/api/quizzes').catch(() => null)
      ]);

      if (caRes && caRes.ok) {
        const caData = await caRes.json();
        if (caData.success && caData.currentAffairs?.length > 0) {
          setCurrentAffairs(prev => {
            const existingIds = new Set(prev.map(item => item.id));
            const newItems = caData.currentAffairs.filter((item: any) => !existingIds.has(item.id));
            const updated = newItems.length > 0 ? [...newItems, ...prev] : prev;
            const filteredUpdated = dedupeById(filterOlderThanOneYear(updated));
            safeSetLocalStorage('pariksha_cached_current_affairs', filteredUpdated);
            if (newItems.length > 0) {
              setToastNotification({
                message: `⚡ [5-Min Auto-Sync] ${newItems.length} new Current Affairs update added!`,
                type: 'ca'
              });
              setTimeout(() => setToastNotification(null), 5000);
            }
            return filteredUpdated;
          });
        }
      }

      if (postsRes && postsRes.ok) {
        const postsData = await postsRes.json();
        if (postsData.success && Array.isArray(postsData.posts) && postsData.posts.length > 0) {
          setPosts(prev => {
            const serverPosts: Post[] = postsData.posts;
            const existingIds = new Set((prev || []).map(p => p.id));
            const newPosts = serverPosts.filter(p => p && p.id && !existingIds.has(p.id));
            
            // Merge existing and server posts, giving server posts updated precedence
            const postsMap = new Map<string, Post>();
            (prev || []).forEach(p => { if (p && p.id) postsMap.set(p.id, p); });
            serverPosts.forEach(p => { if (p && p.id) postsMap.set(p.id, p); });

            const mergedList = Array.from(postsMap.values());
            const filteredUpdated = dedupeById(filterOlderThanOneYear(normalizePostsList(mergedList)));
            safeSetLocalStorage('pariksha_cached_posts', filteredUpdated);

            if (newPosts.length > 0) {
              const hasBlog = newPosts.some((p: any) => p.category === 'blog');
              setToastNotification({
                message: hasBlog 
                  ? `⚡ [Auto-Blog Engine] New Full SEO Blog Article auto-published!`
                  : `🔴 [Auto-Sync] ${newPosts.length} new Sarkari update added!`,
                type: hasBlog ? 'blog' : 'job'
              });
              setTimeout(() => setToastNotification(null), 5000);
            }
            return filteredUpdated;
          });
        }
      }

      if (quizRes && quizRes.ok) {
        const quizData = await quizRes.json();
        if (quizData.success && quizData.quizzes?.length > 0) {
          setQuizQuestions(prev => {
            const existingIds = new Set(prev.map(q => q.id));
            const newQuizzes = quizData.quizzes.filter((q: any) => !existingIds.has(q.id));
            if (newQuizzes.length > 0) {
              return [...newQuizzes, ...prev];
            }
            return prev;
          });
        }
      }
    } catch (err) {
      console.warn("Auto-sync polling error:", err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const handleRefreshQuizQuestions = async () => {
    try {
      const res = await fetch('/api/auto-sync/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'quiz' })
      });
      const data = await res.json();
      if (data.success && data.addedQuiz && data.addedQuiz.length > 0) {
        setQuizQuestions(prev => {
          const existingIds = new Set(prev.map(q => q.id));
          const fresh = data.addedQuiz.filter((q: any) => !existingIds.has(q.id));
          return [...fresh, ...prev];
        });
      }
    } catch (err) {
      console.error('Failed to auto refresh quiz questions:', err);
    }
  };

  // Trigger Manual Auto-Sync
  const handleTriggerSync = async (type: 'current-affairs' | 'latest-jobs' | 'all') => {
    try {
      const res = await fetch('/api/auto-sync/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      if (res.ok) {
        await fetchAutoSyncData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Mount Effect & Interval Polling (Optimized 2-minute polling to reduce background activity)
  useEffect(() => {
    fetchAutoSyncData();
    const pollInterval = setInterval(fetchAutoSyncData, 120000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [fetchAutoSyncData]);

  // Handle new AI generated article publish
  const handleArticleGenerated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    handlePostChange(newPost); // Open immediately in modal
    // Trigger Telegram Channel Broadcast
    fetch('/api/telegram/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post: newPost })
    }).catch(err => {
      console.warn('Auto Telegram broadcast on publish:', err);
    });
  };

  // Handle new AI quiz questions added
  const handleAddQuizQuestions = (newQuestions: QuizQuestion[]) => {
    setQuizQuestions([...quizQuestions, ...newQuestions]);
  };

  // Filter posts (Memoized for high performance with crash-proof error handling)
  const filteredPosts = useMemo(() => {
    try {
      const query = (searchQuery || '').toLowerCase().trim();
      let basePosts = [...posts];

      // If on Home Page, only include the 5 most recently added blog posts
      if (activeCategory === 'all') {
        const nonBlogs = basePosts.filter((p) => p && p.category !== 'blog');
        const blogs = basePosts.filter((p) => p && p.category === 'blog');

        const parseDate = (dateStr?: string) => {
          if (!dateStr) return 0;
          const trimmed = dateStr.trim();
          if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
            return new Date(trimmed).getTime();
          }
          if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
            const [day, month, year] = trimmed.split('/');
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getTime();
          }
          const parsed = Date.parse(trimmed);
          return isNaN(parsed) ? 0 : parsed;
        };

        const sortedBlogs = [...blogs].sort((a, b) => parseDate(b.postDate) - parseDate(a.postDate));
        const top5Blogs = sortedBlogs.slice(0, 5);
        basePosts = [...nonBlogs, ...top5Blogs];
      }

      return basePosts.filter((post) => {
        if (!post) return false;

        let categoryMatch = false;
        if (activeCategory === 'all') {
          categoryMatch = true;
        } else if (post.category === activeCategory) {
          categoryMatch = true;
        } else {
          const titleLower = (post.title || '').toLowerCase();
          if (activeCategory === 'admit-card' && (titleLower.includes('admit') || titleLower.includes('hall ticket') || titleLower.includes('call letter'))) categoryMatch = true;
          if (activeCategory === 'results' && (titleLower.includes('result') || titleLower.includes('scorecard') || titleLower.includes('merit list'))) categoryMatch = true;
          if (activeCategory === 'answer-key' && (titleLower.includes('answer key') || titleLower.includes('response sheet'))) categoryMatch = true;
          if (activeCategory === 'admissions' && (titleLower.includes('admission') || titleLower.includes('counseling') || titleLower.includes('seat allotment'))) categoryMatch = true;
          if (activeCategory === 'scholarships' && (titleLower.includes('scholarship') || titleLower.includes('stipend') || titleLower.includes('fee reimbursement'))) categoryMatch = true;
          if (activeCategory === 'syllabus' && (titleLower.includes('syllabu') || titleLower.includes('exam pattern'))) categoryMatch = true;
          if (activeCategory === 'government-schemes' && (titleLower.includes('yojana') || titleLower.includes('scheme') || titleLower.includes('pension'))) categoryMatch = true;
        }

        const stateMatch =
          selectedState === 'All India' ||
          !post.state ||
          post.state === 'All India' ||
          post.state === selectedState;

        if (!query) return categoryMatch && stateMatch;

        const titleStr = typeof post.title === 'string' ? post.title : '';
        const orgStr = typeof post.organization === 'string' ? post.organization : '';
        const shortInfoStr = typeof post.shortInfo === 'string' ? post.shortInfo : '';
        const keywordsArr = Array.isArray(post.keywords) ? post.keywords : [];

        const searchMatch =
          titleStr.toLowerCase().includes(query) ||
          orgStr.toLowerCase().includes(query) ||
          shortInfoStr.toLowerCase().includes(query) ||
          keywordsArr.some((k) => typeof k === 'string' && k.toLowerCase().includes(query));

        return categoryMatch && stateMatch && searchMatch;
      });
    } catch (error) {
      console.error('Critical error in filteredPosts computation:', error);
      try {
        return posts.filter((post) => {
          if (!post) return false;
          const categoryMatch = activeCategory === 'all' || post.category === activeCategory;
          const stateMatch = selectedState === 'All India' || post.state === selectedState;
          return categoryMatch && stateMatch;
        });
      } catch {
        return [];
      }
    }
  }, [posts, activeCategory, selectedState, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans antialiased flex flex-col selection:bg-amber-200 selection:text-slate-900 w-full max-w-full overflow-x-hidden">
      
      {/* Network Status Indicator (Offline Mode & Online Restored Toast) */}
      <NetworkStatusIndicator />

      {/* Dynamic SEO & Meta Tags Manager */}
      <SEOMetaTags
        post={selectedPost}
        activeCategory={activeCategory}
        pathname={typeof window !== 'undefined' ? window.location.pathname : '/'}
        selectedState={selectedState}
      />

      {/* Top Admin Active Status Banner */}
      {isAdminMode && (
        <div className="bg-slate-900 text-amber-400 text-xs px-4 py-2 border-b border-amber-500/30 flex flex-wrap items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2 font-black">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>🛡️ ADMIN MODE ACTIVE — PIN Authenticated (Restricted from public users)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAdminOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1 rounded-lg font-black text-[11px] transition-all shadow-sm"
            >
              Open Admin Dashboard
            </button>
            <button
              onClick={handleExitAdminMode}
              className="bg-slate-800 hover:bg-red-900/60 text-slate-200 hover:text-red-200 px-2.5 py-1 rounded-lg font-bold text-[11px] border border-slate-700 transition-colors"
              title="Lock Admin Access & Logout"
            >
              🔒 Lock & Exit Admin
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        activeCategory={activeCategory}
        setActiveCategory={handleCategoryChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        onOpenAIGenerator={() => setAiGeneratorOpen(true)}
        onOpenAutoFetch={() => setAutoFetchOpen(true)}
        onOpenCron={() => setCronOpen(true)}
        onOpenAIChat={() => setAiChatOpen(true)}
        onOpenAgeCalc={handleOpenAgeCalc}
        onOpenSalaryCalc={handleOpenSalaryCalc}
        onOpenCutOffPredictor={handleOpenCutOffPredictor}
        onOpenSyllabusChecklist={handleOpenSyllabusChecklist}
        onOpenPhotoResizer={handleOpenPhotoResizer}
        onOpenRankPredictor={handleOpenRankPredictor}
        onOpenSitemap={() => setSitemapOpen(true)}
        onOpenAdmin={handleOpenAdminWithCheck}
        onOpenSavedItems={() => setSavedItemsOpen(true)}
        onOpenPWAAlerts={() => setPwaAlertsOpen(true)}
        onOpenFeedback={() => setFeedbackModalOpen(true)}
        onOpenLegalPage={(tab) => {
          setLegalPageTab(tab);
          setLegalPageOpen(true);
        }}
        savedCount={bookmarkedPostIds.length + bookmarkedCaIds.length}
        isAdminMode={isAdminMode}
        onTriggerSync={handleTriggerSync}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      {/* Floating Auto-Sync Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white p-3.5 px-4 rounded-xl shadow-2xl border border-amber-400/50 flex items-center gap-3 animate-bounce max-w-md">
          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${toastNotification.type === 'ca' ? 'bg-amber-400 animate-ping' : toastNotification.type === 'blog' ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400 animate-ping'}`} />
          <div className="text-xs font-black text-amber-200">
            {toastNotification.message}
          </div>
          <button onClick={() => setToastNotification(null)} className="text-slate-400 hover:text-white font-bold ml-auto text-xs px-1">✕</button>
        </div>
      )}

      {/* Hero Section (Main Portal Banner) */}
      {activeCategory === 'all' && !searchQuery && (
        <HeroSection
          posts={posts}
          onSelectCategory={handleCategoryChange}
          onOpenAIGenerator={() => setAiGeneratorOpen(true)}
          onOpenAutoFetch={() => setAutoFetchOpen(true)}
          onSearchTag={(tag) => setSearchQuery(tag)}
          language={language}
          onOpenSalaryCalc={handleOpenSalaryCalc}
          onOpenCutOffPredictor={handleOpenCutOffPredictor}
          onOpenSyllabusChecklist={handleOpenSyllabusChecklist}
          onOpenAgeCalc={handleOpenAgeCalc}
          onOpenPhotoResizer={handleOpenPhotoResizer}
          onOpenRankPredictor={handleOpenRankPredictor}
        />
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-4 py-4 sm:py-8 space-y-6 sm:space-y-10 flex-1 w-full max-w-full overflow-x-hidden">
        
        {/* SEO Breadcrumb Navigation Bar */}
        <Breadcrumb
          activeCategory={activeCategory}
          selectedState={selectedState}
          searchQuery={searchQuery}
          language={language}
          onNavigateHome={() => {
            handleCategoryChange('all');
            setSelectedState('All India');
            setSearchQuery('');
          }}
          onSelectCategory={(cat) => handleCategoryChange(cat)}
          onClearSearch={() => setSearchQuery('')}
          onClearState={() => setSelectedState('All India')}
        />

        {/* Compact Ad-Blocker/DNS Detection Banner (Shown once at the top of the main page) */}
        <AdsterraAd isNoticeOnly={true} />

        {/* Category Header Title when filtering */}
        {(activeCategory !== 'all' || searchQuery || selectedState !== 'All India') && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-black text-[#0F4C81] capitalize tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#FF6B00]" />
                {activeCategory === 'all' ? getTranslation('Search Results', language) : getTranslation(activeCategory.replace('-', ' '), language)}
                {selectedState !== 'All India' && <span className="text-slate-500 font-normal">({selectedState})</span>}
              </h1>
              {searchQuery && (
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {getTranslation('Showing results matching keyword:', language)} "<span className="font-bold text-slate-800">{searchQuery}</span>"
                </p>
              )}
            </div>
            <button
              onClick={() => {
                handleCategoryChange('all');
                setSelectedState('All India');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{getTranslation('Reset All Filters', language)}</span>
            </button>
          </div>
        )}

        {/* Dedicated Quiz View (When category is quiz) */}
        {activeCategory === 'quiz' ? (
          <div className="space-y-8">
            <QuizSection
              questions={quizQuestions}
              onAddGeneratedQuestions={handleAddQuizQuestions}
              onRefreshQuiz={handleRefreshQuizQuestions}
              onOpenFeedback={() => setFeedbackModalOpen(true)}
              language={language}
            />

            {/* Current Affairs Revision List underneath Quiz */}
            {currentAffairs && currentAffairs.length > 0 && (
              <div className="pt-6 border-t border-slate-200">
                <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#FF6B00]" />
                  <span>{language === 'hi' ? 'क्विज अभ्यास के लिए नवीनतम करेंट अफेयर्स नोट्स' : 'Daily Current Affairs Revision Notes for Govt Exam Practice'}</span>
                </h2>
                <CurrentAffairsSection
                  articles={currentAffairs}
                  onTriggerSync={handleTriggerSync}
                  bookmarkedCaIds={bookmarkedCaIds}
                  onToggleBookmarkCA={handleToggleBookmarkCA}
                  isHomePage={true}
                  limit={6}
                  onViewAll={() => handleCategoryChange('current-affairs')}
                  isLoading={isLoadingData}
                  language={language}
                  onTranslateItem={handleTranslateItem}
                  translatedCache={translatedCache}
                />
              </div>
            )}
          </div>
        ) : activeCategory === 'current-affairs' ? (
          <div className="space-y-8">
            <CurrentAffairsSection
              articles={currentAffairs}
              onTriggerSync={handleTriggerSync}
              bookmarkedCaIds={bookmarkedCaIds}
              onToggleBookmarkCA={handleToggleBookmarkCA}
              isHomePage={false}
              isLoading={isLoadingData}
              language={language}
              onTranslateItem={handleTranslateItem}
              translatedCache={translatedCache}
            />

            {/* Also show any Current Affairs Blog/Job posts if available */}
            {filteredPosts.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  <span>{getTranslation('Related Current Affairs & Exam Notification Posts', language)}</span>
                </h2>
                <PostTable
                  posts={filteredPosts}
                  activeCategory={activeCategory}
                  onSelectPost={handlePostChange}
                  onSelectCategory={handleCategoryChange}
                  bookmarkedPostIds={bookmarkedPostIds}
                  onToggleBookmarkPost={handleToggleBookmarkPost}
                  isLoading={isLoadingData}
                  language={language}
                  onTranslateItem={handleTranslateItem}
                  translatedCache={translatedCache}
                />
              </div>
            )}
          </div>
        ) : (
          <>
            {/* 3-Column Sarkari Tables & Posts Grid */}
            <PostTable
              posts={filteredPosts}
              activeCategory={activeCategory}
              onSelectPost={handlePostChange}
              onSelectCategory={handleCategoryChange}
              bookmarkedPostIds={bookmarkedPostIds}
              onToggleBookmarkPost={handleToggleBookmarkPost}
              isLoading={isLoadingData}
              language={language}
              onTranslateItem={handleTranslateItem}
              translatedCache={translatedCache}
            />

            {/* Single Fast-Loading Page Ad Unit */}
            <AdsterraAd type="rectangle" label="Sponsored Sarkari Updates" />

            {/* Eligibility Checker on Home Page */}
            {activeCategory === 'all' && (
              <EligibilityChecker
                posts={posts}
                onSelectPost={handlePostChange}
                language={language}
                translatedCache={translatedCache}
              />
            )}

            {/* Current Affairs Home Widget - Top 5 Updates Only (Placed in original lower position on home view) */}
            {activeCategory === 'all' && (
              <CurrentAffairsSection
                articles={currentAffairs}
                onTriggerSync={handleTriggerSync}
                bookmarkedCaIds={bookmarkedCaIds}
                onToggleBookmarkCA={handleToggleBookmarkCA}
                isHomePage={true}
                limit={5}
                onViewAll={() => handleCategoryChange('current-affairs')}
                isLoading={isLoadingData}
                language={language}
                onTranslateItem={handleTranslateItem}
                translatedCache={translatedCache}
              />
            )}

            {/* Quiz Section on Home Page */}
            {activeCategory === 'all' && (
              <QuizSection
                questions={quizQuestions}
                onAddGeneratedQuestions={handleAddQuizQuestions}
                onRefreshQuiz={handleRefreshQuizQuestions}
                onOpenFeedback={() => setFeedbackModalOpen(true)}
                language={language}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={handleCategoryChange}
        onOpenAdmin={handleOpenAdminWithCheck}
        onOpenPWAAlerts={() => setPwaAlertsOpen(true)}
        onOpenFeedback={() => setFeedbackModalOpen(true)}
        onOpenLegalPage={(tab) => {
          setLegalPageTab(tab);
          setLegalPageOpen(true);
        }}
        onOpenSalaryCalc={handleOpenSalaryCalc}
        onOpenCutOffPredictor={handleOpenCutOffPredictor}
        onOpenSyllabusChecklist={handleOpenSyllabusChecklist}
        onOpenAgeCalc={handleOpenAgeCalc}
        onOpenPhotoResizer={handleOpenPhotoResizer}
        onOpenRankPredictor={handleOpenRankPredictor}
        isAdminMode={isAdminMode}
        language={language}
      />

      {/* MODALS */}
      {/* 1. Article Detail View Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => handlePostChange(null)}
          allPosts={posts}
          onSelectPost={handlePostChange}
          isBookmarked={bookmarkedPostIds.includes(selectedPost.id)}
          onToggleBookmark={handleToggleBookmarkPost}
          language={language}
          onLanguageChange={handleLanguageChange}
          onTranslateItem={handleTranslateItem}
          translatedCache={translatedCache}
        />
      )}

      {/* 2. Auto Fetch & Rewrite Portal Feeds Modal */}
      {autoFetchOpen && (
        <AutoFetchPortalModal
          isOpen={autoFetchOpen}
          onClose={() => setAutoFetchOpen(false)}
          onArticleGenerated={handleArticleGenerated}
        />
      )}

      {cronOpen && (
        <CronSchedulerModal
          isOpen={cronOpen}
          onClose={() => setCronOpen(false)}
          onBatchGenerated={(newPosts) => {
            setPosts(prev => [...newPosts, ...prev]);
          }}
        />
      )}

      {/* 3. XML Sitemap Inspector Modal */}
      {sitemapOpen && (
        <SitemapModal
          isOpen={sitemapOpen}
          onClose={() => setSitemapOpen(false)}
        />
      )}

      {/* 4. AI Article Generator Modal */}
      {aiGeneratorOpen && (
        <AIContentGeneratorModal
          isOpen={aiGeneratorOpen}
          onClose={() => setAiGeneratorOpen(false)}
          onArticleGenerated={handleArticleGenerated}
        />
      )}

      {/* 5. Age Calculator Modal */}
      {ageCalcOpen && (
        <AgeCalculatorModal
          isOpen={ageCalcOpen}
          onClose={handleCloseAgeCalc}
        />
      )}

      {/* 5.1. Sarkari Salary Calculator Modal */}
      {salaryCalcOpen && (
        <SarkariSalaryCalculatorModal
          isOpen={salaryCalcOpen}
          onClose={handleCloseSalaryCalc}
          language={language}
        />
      )}

      {/* 5.2. Exam Cut-Off Marks Predictor Modal */}
      {cutOffPredictorOpen && (
        <ExamCutOffPredictorModal
          isOpen={cutOffPredictorOpen}
          onClose={handleCloseCutOffPredictor}
          language={language}
        />
      )}

      {/* 5.3. Exam Syllabus Checklist & Progress Tracker Modal */}
      {syllabusChecklistOpen && (
        <SyllabusChecklistModal
          isOpen={syllabusChecklistOpen}
          onClose={handleCloseSyllabusChecklist}
          language={language}
        />
      )}

      {/* 5.4. Sarkari Photo & Signature Resizer Modal */}
      {photoResizerOpen && (
        <PhotoSignatureResizerModal
          isOpen={photoResizerOpen}
          onClose={handleClosePhotoResizer}
          language={language}
        />
      )}

      {/* 5.5. Exam Rank Predictor (Bell Curve Estimation) Modal */}
      {rankPredictorOpen && (
        <ExamRankPredictorModal
          isOpen={rankPredictorOpen}
          onClose={handleCloseRankPredictor}
          language={language}
        />
      )}

      {/* 6. AI Career Assistant Modal */}
      {aiChatOpen && (
        <AIAssistantModal
          isOpen={aiChatOpen}
          onClose={() => setAiChatOpen(false)}
        />
      )}

      {/* 6.5. Admin PIN / Password Lock Modal */}
      {adminLockOpen && (
        <AdminLockModal
          isOpen={adminLockOpen}
          onClose={() => setAdminLockOpen(false)}
          onUnlockSuccess={() => {
            setIsAdminAuthenticated(true);
            setIsAdminMode(true);
            setAdminLockOpen(false);
            setAdminOpen(true);
          }}
        />
      )}

      {/* 7. Admin Control Panel Modal */}
      {adminOpen && (
        <AdminPanelModal
          isOpen={adminOpen}
          onClose={() => setAdminOpen(false)}
          posts={posts}
          onUpdatePosts={setPosts}
          currentAffairs={currentAffairs}
          onUpdateCurrentAffairs={setCurrentAffairs}
          onTriggerSync={handleTriggerSync}
          onOpenAIGenerator={() => setAiGeneratorOpen(true)}
          onOpenAutoFetch={() => setAutoFetchOpen(true)}
          onOpenCron={() => setCronOpen(true)}
          onOpenSitemap={() => setSitemapOpen(true)}
        />
      )}

      {/* 8. My Saved Items Modal */}
      {savedItemsOpen && (
        <SavedItemsModal
          isOpen={savedItemsOpen}
          onClose={() => setSavedItemsOpen(false)}
          posts={posts}
          currentAffairs={currentAffairs}
          bookmarkedPostIds={bookmarkedPostIds}
          bookmarkedCaIds={bookmarkedCaIds}
          onToggleBookmarkPost={handleToggleBookmarkPost}
          onToggleBookmarkCA={handleToggleBookmarkCA}
          onSelectPost={(post) => {
            setSavedItemsOpen(false);
            handlePostChange(post);
          }}
          onClearAll={handleClearAllBookmarks}
          language={language}
        />
      )}

      {/* 9. PWA Push Notification Settings Modal */}
      {pwaAlertsOpen && (
        <PWANotificationModal
          isOpen={pwaAlertsOpen}
          onClose={() => setPwaAlertsOpen(false)}
        />
      )}

      {/* 10. Legal Pages Modal (Terms, Privacy, Disclaimer, Contact) */}
      {legalPageOpen && (
        <LegalPageModal
          isOpen={legalPageOpen}
          initialTab={legalPageTab}
          onClose={() => setLegalPageOpen(false)}
        />
      )}

      {/* 11. Global Feedback Modal */}
      {feedbackModalOpen && (
        <GlobalFeedbackModal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          language={language}
        />
      )}
    </div>
  );
}
