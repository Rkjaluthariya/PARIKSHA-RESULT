import React, { useState } from 'react';
import { Logo } from './Logo';
import { CategoryType, StateType } from '../types';
import { Search, Sparkles, MessageSquare, Bell, Menu, X, CheckCircle2, ChevronDown, Filter, Clock, ShieldCheck, Bookmark, Mic, MicOff, Languages, Send } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface HeaderProps {
  activeCategory: CategoryType | 'all';
  setActiveCategory: (cat: CategoryType | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedState: StateType;
  setSelectedState: (state: StateType) => void;
  onOpenAIGenerator: () => void;
  onOpenAutoFetch: () => void;
  onOpenCron: () => void;
  onOpenAIChat: () => void;
  onOpenAgeCalc?: () => void;
  onOpenSalaryCalc?: () => void;
  onOpenCutOffPredictor?: () => void;
  onOpenSyllabusChecklist?: () => void;
  onOpenPhotoResizer?: () => void;
  onOpenRankPredictor?: () => void;
  onOpenSitemap: () => void;
  onOpenAdmin: () => void;
  onOpenSavedItems?: () => void;
  onOpenPWAAlerts?: () => void;
  onOpenFeedback?: () => void;
  onOpenLegalPage?: (tab: 'terms' | 'privacy' | 'disclaimer' | 'contact') => void;
  savedCount?: number;
  isAdminMode?: boolean;
  onTriggerSync?: (type: 'current-affairs' | 'latest-jobs' | 'all') => void;
  language: 'en' | 'hi';
  onLanguageChange: (lang: 'en' | 'hi') => void;
}

const NAV_ITEMS: { id: CategoryType | 'all' | 'contact'; label: string; badge?: string; isSpecial?: boolean }[] = [
  { id: 'all', label: 'Home' },
  { id: 'latest-jobs', label: 'Latest Jobs', badge: '17K+' },
  { id: 'admit-card', label: 'Admit Card' },
  { id: 'results', label: 'Results', badge: 'LIVE' },
  { id: 'answer-key', label: 'Answer Key' },
  { id: 'admissions', label: 'Admissions' },
  { id: 'scholarships', label: 'Scholarships' },
  { id: 'current-affairs', label: 'Current Affairs' },
  { id: 'blog', label: 'Blog', badge: 'NEW' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'contact', label: 'Contact' }
];

const STATES: StateType[] = [
  'All India',
  'Uttar Pradesh',
  'Bihar',
  'Rajasthan',
  'Madhya Pradesh',
  'Delhi',
  'Haryana',
  'Maharashtra',
  'Punjab',
  'Jharkhand'
];

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  selectedState,
  setSelectedState,
  onOpenAIGenerator,
  onOpenAutoFetch,
  onOpenCron,
  onOpenAIChat,
  onOpenAgeCalc,
  onOpenSalaryCalc,
  onOpenCutOffPredictor,
  onOpenSyllabusChecklist,
  onOpenPhotoResizer,
  onOpenRankPredictor,
  onOpenSitemap,
  onOpenAdmin,
  onOpenSavedItems,
  onOpenPWAAlerts,
  onOpenFeedback,
  onOpenLegalPage,
  savedCount = 0,
  isAdminMode = false,
  onTriggerSync,
  language,
  onLanguageChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [logoClickCount, setLogoClickCount] = useState(0);

  const handleLogoClick = () => {
    setActiveCategory('all');
    const next = logoClickCount + 1;
    if (next >= 5) {
      setLogoClickCount(0);
      onOpenAdmin();
    } else {
      setLogoClickCount(next);
    }
    setTimeout(() => setLogoClickCount(0), 3000);
  };

  const toggleVoiceSearch = () => {
    setSpeechError(null);

    // If currently listening, stop recognition
    if (isListening && recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setSpeechError('Voice search is not supported by your current browser. Try Chrome or Edge!');
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'en-IN'; // Multi-lingual recognition for Indian search terms
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setSearchQuery(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone access denied. Please allow mic permissions in your browser.');
        } else if (event.error === 'no-speech') {
          setSpeechError('No speech detected. Please speak into your microphone and try again.');
        } else {
          setSpeechError(`Voice search notice: ${event.error}`);
        }
        setTimeout(() => setSpeechError(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognitionInstance(recognition);
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setSpeechError('Failed to access microphone for voice search.');
      setTimeout(() => setSpeechError(null), 4000);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm w-full max-w-full overflow-x-hidden">
      {/* 1. Live Breaking News Marquee Bar */}
      <div className="bg-[#0F4C81] text-white text-xs font-medium py-1.5 px-2.5 sm:px-4 overflow-hidden flex items-center justify-between gap-3 w-full max-w-full">
        <div className="flex items-center gap-2 overflow-hidden flex-1 max-w-full">
          <div className="flex items-center gap-1.5 bg-[#FF6B00] text-white px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider flex-shrink-0 animate-pulse">
            <Bell className="w-3 h-3" /> {language === 'hi' ? 'लाइव अपडेट' : 'Live Updates'}
          </div>
          <div className="overflow-hidden relative whitespace-nowrap w-full">
            <div className="inline-block animate-marquee tracking-wide text-slate-100">
              🔥 <span className="font-semibold text-amber-300">SSC CGL 2026:</span> {language === 'hi' ? '17,727 पदों के लिए ऑनलाइन फॉर्म 30 अगस्त तक सक्रिय' : 'Online Form for 17,727 Posts Active till 30 August'} &nbsp;&nbsp;|&nbsp;&nbsp; 
              🎓 <span className="font-semibold text-cyan-300">NEET UG 2026:</span> {language === 'hi' ? 'काउंसलिंग प्रक्रिया प्रारंभ' : 'Counselling Started'} &nbsp;&nbsp;|&nbsp;&nbsp;
              🏛️ <span className="font-semibold text-emerald-300">UPSC IAS 2026:</span> {language === 'hi' ? 'प्रारंभिक परीक्षा अधिसूचना जारी' : 'Prelims Notification Released'} &nbsp;&nbsp;|&nbsp;&nbsp;
              🚓 <span className="font-semibold text-amber-300">UP Police Constable:</span> {language === 'hi' ? 'एडमिट कार्ड एवं परीक्षा तिथि घोषित' : 'Admit Card & Exam Date Live'}
            </div>
          </div>
        </div>

        {/* Live Auto-Sync Badges & Telegram Community Links */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <a
            href="https://t.me/pariksha_result_official"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-black text-white bg-sky-500 hover:bg-sky-400 border border-sky-300/60 px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs transition-all hover:scale-105"
            title="Join Official Telegram Channel @pariksha_result_official"
          >
            <Send className="w-3 h-3 text-white" />
            <span className="hidden xs:inline">{language === 'hi' ? 'टेलीग्राम' : 'Telegram'}</span>
            <span className="xs:hidden">TG</span>
          </a>

          {isAdminMode && (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => onTriggerSync && onTriggerSync('current-affairs')}
                className="flex items-center gap-1 text-[10px] font-black text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 px-2 py-0.5 rounded-full transition-all"
                title="Click to force immediate 5-Minute Current Affairs update"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                <span>⚡ 5-Min CA Sync</span>
              </button>

              <button
                onClick={() => onTriggerSync && onTriggerSync('latest-jobs')}
                className="flex items-center gap-1 text-[10px] font-black text-emerald-300 hover:text-white bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 px-2 py-0.5 rounded-full transition-all"
                title="Click to force immediate 1-Hour Job update"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>🔴 1-Hour Job Sync</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Branding & Action Bar */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 py-3 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 w-full max-w-full overflow-hidden">
        {/* Brand Logo (5-click secret trigger for Admin Panel) */}
        <div className="cursor-pointer min-w-0 flex-1 sm:flex-none" onClick={handleLogoClick}>
          <Logo showTagline={true} language={language} />
        </div>

        {/* Global Search Box with Speech Recognition */}
        <div className="hidden md:flex flex-1 max-w-md relative flex-col">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              placeholder={isListening ? "🎙️ Listening... Speak now..." : getTranslation("Search Jobs, Admit Cards, Results, Cut Off...", language)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 ${searchQuery ? 'pr-20' : 'pr-12'} py-2 text-sm bg-slate-50 border ${
                isListening
                  ? 'border-red-500 ring-4 ring-red-400/60 bg-red-50/40 animate-pulse text-red-900 font-bold placeholder-red-400'
                  : 'border-slate-300 text-slate-800 placeholder-slate-400'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:bg-white transition-all font-medium`}
            />
            <Search className={`w-4 h-4 absolute left-3.5 ${isListening ? 'text-red-500 animate-bounce' : 'text-slate-400'}`} />
            
            {/* Animated Sound Wave Indicator inside Search Bar when listening */}
            {isListening && (
              <div className="absolute right-24 flex items-center gap-0.5 pointer-events-none">
                <span className="w-1 h-3 bg-red-500 animate-bounce rounded-full" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1 h-5 bg-red-600 animate-bounce rounded-full" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1 h-3 bg-red-500 animate-bounce rounded-full" style={{ animationDelay: '300ms' }}></span>
              </div>
            )}

            <div className="absolute right-2 flex items-center gap-1.5">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 px-1.5 py-0.5 rounded-full font-medium"
                >
                  Clear
                </button>
              )}

              {/* Voice Search Microphone Button */}
              <button
                type="button"
                onClick={toggleVoiceSearch}
                className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse shadow-lg ring-4 ring-red-400/80 scale-110'
                    : 'text-slate-500 hover:text-[#0F4C81] hover:bg-slate-200/80'
                }`}
                title={isListening ? 'Click to stop listening' : 'Voice Search (Click to speak query)'}
              >
                {isListening ? <MicOff className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4 text-[#0F4C81]" />}
              </button>
            </div>
          </div>

          {/* Active Voice Search Tooltip Banner */}
          {isListening && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xl z-50 flex items-center justify-between animate-fade-in border border-red-300">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <span>🎙️ Voice Search Active... Speak now (e.g. "SSC CGL", "Railway Result")</span>
              </div>
              <button onClick={toggleVoiceSearch} className="text-[10px] bg-red-900 hover:bg-red-950 px-2.5 py-1 rounded-md font-black shadow transition-transform hover:scale-105">
                Stop
              </button>
            </div>
          )}

          {speechError && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-amber-900 text-amber-100 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl z-50 border border-amber-500">
              ⚠️ {speechError}
            </div>
          )}
        </div>

        {/* Global Translation Toggle (English <-> Hindi) */}
        <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-300 shadow-xs" id="language-switcher-desktop">
          <button
            type="button"
            id="lang-btn-en"
            onClick={() => onLanguageChange('en')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
              language === 'en'
                ? 'bg-[#0F4C81] text-white shadow-sm ring-1 ring-blue-900/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
            title="Read full website in English"
          >
            <span>English</span>
          </button>
          <button
            type="button"
            id="lang-btn-hi"
            onClick={() => onLanguageChange('hi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
              language === 'hi'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm ring-1 ring-orange-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
            title="सम्पूर्ण वेबसाइट को हिन्दी में पढ़ें (Translate to Hindi)"
          >
            <Languages className={`w-3.5 h-3.5 ${language === 'hi' ? 'text-amber-200 animate-pulse' : 'text-slate-500'}`} />
            <span>हिन्दी</span>
          </button>
        </div>

        {/* Quick Action Buttons */}
        <div className="hidden xl:flex items-center gap-2">
          {/* Admin Control Panel & Developer Tools (Visible when isAdminMode is active) */}
          {isAdminMode && (
            <>
              {/* Cron Job Manager */}
              <button
                onClick={onOpenCron}
                className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-all transform hover:-translate-y-0.5 border border-indigo-500"
                title="Manage Automated Data Scraper"
              >
                <Clock className="w-3.5 h-3.5 text-indigo-300" />
                <span>Auto-Fetch Cron</span>
              </button>

              {/* Auto-Fetch Portal Article Rewriter */}
              <button
                onClick={onOpenAutoFetch}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg shadow-sm transition-all transform hover:-translate-y-0.5"
                title="Auto Fetch & Rewrite from GKToday, SarkariResult, RajSarkari & IndiaSarkari"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Auto-Fetch & Rewrite</span>
              </button>
            </>
          )}

          {/* Photo & Signature Resizer Tool */}
          <button
            onClick={onOpenPhotoResizer}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-black text-emerald-900 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 rounded-lg transition-all shadow-xs"
            title="Sarkari Photo & Signature Resizer Tool"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{language === 'hi' ? 'फोटो रीसाइज़र' : 'Photo Resizer'}</span>
          </button>

          {/* Exam Rank Predictor Tool */}
          <button
            onClick={onOpenRankPredictor}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-black text-indigo-900 bg-indigo-50 border border-indigo-300 hover:bg-indigo-100 rounded-lg transition-all shadow-xs"
            title="Sarkari Exam Rank Predictor (Bell Curve Estimation)"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>{language === 'hi' ? 'रैंक प्रेडिक्टर' : 'Rank Predictor'}</span>
          </button>

          {/* Job & Result Push Notification Bell */}
          <button
            onClick={onOpenPWAAlerts}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 hover:bg-amber-100 rounded-lg transition-all shadow-xs relative"
            title="Enable Instant Sarkari Job Push Notifications"
          >
            <Bell className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>{getTranslation("Push Alerts", language)}</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute top-1 right-1"></span>
          </button>

          {/* AI Career Assistant */}
          <button
            onClick={onOpenAIChat}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F4C81] bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-[#0F4C81]" />
            <span>{getTranslation("Ask AI Helpdesk", language)}</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-1.5">
          {/* Mobile Language Segmented Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200" id="language-switcher-mobile">
            <button
              type="button"
              id="lang-btn-mobile-en"
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 text-[11px] font-black rounded transition-all ${
                language === 'en'
                  ? 'bg-[#0F4C81] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              type="button"
              id="lang-btn-mobile-hi"
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-1 text-[11px] font-black rounded transition-all flex items-center gap-0.5 ${
                language === 'hi'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="हिन्दी (Hindi)"
            >
              <Languages className="w-3 h-3" />
              <span>HI</span>
            </button>
          </div>

          <button
            onClick={onOpenPWAAlerts}
            className="p-2 text-xs font-bold bg-amber-50 text-amber-800 rounded-lg shadow-sm border border-amber-300 relative"
            title="Job Push Alerts"
          >
            <Bell className="w-4 h-4 text-amber-600 animate-pulse" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 bg-slate-100 rounded-lg focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar with Speech Recognition */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative flex flex-col">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              placeholder={isListening ? "🎙️ Listening... Speak now..." : getTranslation("Search Sarkari Job, Result, Admit Card...", language)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 ${searchQuery ? 'pr-20' : 'pr-12'} py-2 text-sm bg-slate-50 border ${
                isListening
                  ? 'border-red-500 ring-4 ring-red-400/60 bg-red-50/40 animate-pulse text-red-900 font-bold placeholder-red-400'
                  : 'border-slate-300 text-slate-800 placeholder-slate-400'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81]`}
            />
            <Search className={`w-4 h-4 absolute left-3 ${isListening ? 'text-red-500 animate-bounce' : 'text-slate-400'}`} />
            
            {/* Animated Sound Wave Indicator inside Mobile Search Bar */}
            {isListening && (
              <div className="absolute right-20 flex items-center gap-0.5 pointer-events-none">
                <span className="w-1 h-2.5 bg-red-500 animate-bounce rounded-full" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1 h-4 bg-red-600 animate-bounce rounded-full" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1 h-2.5 bg-red-500 animate-bounce rounded-full" style={{ animationDelay: '300ms' }}></span>
              </div>
            )}

            <div className="absolute right-2 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[11px] text-slate-400 hover:text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded-full font-medium"
                >
                  Clear
                </button>
              )}

              {/* Mobile Voice Search Mic Button */}
              <button
                type="button"
                onClick={toggleVoiceSearch}
                className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse shadow-lg ring-4 ring-red-400/80 scale-110'
                    : 'text-slate-500 hover:text-[#0F4C81] hover:bg-slate-200'
                }`}
                title={isListening ? 'Stop Listening' : 'Search by Voice'}
              >
                {isListening ? <MicOff className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4 text-[#0F4C81]" />}
              </button>
            </div>
          </div>

          {/* Active Mobile Speech Recognition Indicator */}
          {isListening && (
            <div className="mt-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg flex items-center justify-between border border-red-300">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <span>🎙️ Voice Search Active... Speak now</span>
              </div>
              <button onClick={toggleVoiceSearch} className="text-[10px] bg-red-900 hover:bg-red-950 px-2 py-0.5 rounded font-black">
                Stop
              </button>
            </div>
          )}

          {speechError && (
            <div className="mt-1.5 bg-amber-900 text-amber-100 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md border border-amber-500">
              ⚠️ {speechError}
            </div>
          )}
        </div>
      </div>

      {/* 3. Category Navbar Menu */}
      <nav className="bg-[#0F4C81] text-white shadow-inner">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 py-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'contact') {
                      if (onOpenLegalPage) onOpenLegalPage('contact');
                      return;
                    }
                    setActiveCategory(item.id as CategoryType | 'all');
                  }}
                  className={`px-3 py-2 text-xs font-semibold rounded transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#FF6B00] text-white shadow-sm'
                      : 'text-slate-100 hover:bg-[#165a98] hover:text-white'
                  }`}
                >
                  <span>{getTranslation(item.label, language)}</span>
                  {item.badge && (
                    <span className="text-[9px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* State Filter Dropdown */}
          <div className="hidden lg:flex items-center gap-2 pl-4 py-1.5 border-l border-blue-700/60 flex-shrink-0">
            <Filter className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs font-semibold text-slate-200">{getTranslation("State:", language)}</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value as StateType)}
              className="bg-[#0B3A63] text-white text-xs font-medium px-2 py-1 rounded border border-blue-500/40 focus:outline-none cursor-pointer"
            >
              {STATES.map((st) => (
                <option key={st} value={st} className="bg-slate-900 text-white">
                  {getTranslation(st, language)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-white px-4 py-4 space-y-3 border-t border-slate-800">
          {/* Language Selector Row in Drawer */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'hi' ? 'भाषा (Language):' : 'Language:'}</span>
            </span>
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  onLanguageChange('en');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                  language === 'en'
                    ? 'bg-[#0F4C81] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => {
                  onLanguageChange('hi');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                  language === 'hi'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{getTranslation("State Jobs Filter", language)}</span>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value as StateType);
                setMobileMenuOpen(false);
              }}
              className="bg-slate-800 text-white text-xs px-2 py-1 rounded border border-slate-700"
            >
              {STATES.map((st) => (
                <option key={st} value={st}>{getTranslation(st, language)}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {NAV_ITEMS.map((item) => {
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (item.id === 'contact') {
                      if (onOpenLegalPage) onOpenLegalPage('contact');
                      return;
                    }
                    setActiveCategory(item.id as CategoryType | 'all');
                  }}
                  className={`px-3 py-2 text-xs font-medium text-left rounded flex items-center justify-between ${
                    activeCategory === item.id
                      ? 'bg-[#FF6B00] text-white font-bold'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  <span>{getTranslation(item.label, language)}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <a
              href="https://t.me/pariksha_result_official"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-black rounded-lg flex items-center justify-center gap-2 shadow-md border border-sky-400/50"
            >
              <Send className="w-4 h-4 text-white" />
              <span>{language === 'hi' ? '📢 ऑफिशियल टेलीग्राम चैनल ज्वाइन करें (@pariksha_result_official)' : '📢 Join Official Telegram Channel'}</span>
            </a>

            <button
              onClick={() => { if (onOpenPhotoResizer) onOpenPhotoResizer(); setMobileMenuOpen(false); }}
              className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-black rounded flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> {language === 'hi' ? '📸 सरकारी फोटो & सिग्नेचर रीसाइज़र' : '📸 Sarkari Photo & Signature Resizer'}
            </button>

            <button
              onClick={() => { if (onOpenRankPredictor) onOpenRankPredictor(); setMobileMenuOpen(false); }}
              className="w-full py-2 bg-gradient-to-r from-indigo-600 to-blue-700 text-white text-xs font-black rounded flex items-center justify-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" /> {language === 'hi' ? '📊 परीक्षा रैंक प्रेडिक्टर (बेल कर्व)' : '📊 Exam Rank Predictor (Bell Curve)'}
            </button>

            <button
              onClick={() => { if (onOpenPWAAlerts) onOpenPWAAlerts(); setMobileMenuOpen(false); }}
              className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black rounded flex items-center justify-center gap-2 shadow-sm"
            >
              <Bell className="w-4 h-4 text-slate-950" /> Instant Push Job Alerts (PWA)
            </button>
            {isAdminMode && (
              <>
                <button
                  onClick={() => { onOpenCron(); setMobileMenuOpen(false); }}
                  className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4 text-indigo-300" /> Auto-Fetch Cron Manager
                </button>
                <button
                  onClick={() => { onOpenAutoFetch(); setMobileMenuOpen(false); }}
                  className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" /> Auto-Fetch & Rewriter
                </button>
              </>
            )}
            <button
              onClick={() => { onOpenAIChat(); setMobileMenuOpen(false); }}
              className="w-full py-2 bg-[#0F4C81] text-white text-xs font-bold rounded flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Ask AI Career Counselor
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
