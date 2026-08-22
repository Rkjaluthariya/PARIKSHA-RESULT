import { getTranslation } from '../utils/translations';
import React from 'react';
import { CategoryType, Post } from '../types';
import { Award, FileText, Briefcase, Key, ShieldCheck, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onSelectCategory: (cat: CategoryType) => void;
  onOpenAIGenerator?: () => void;
  onOpenAutoFetch?: () => void;
  onSearchTag?: (tag: string) => void;
  posts?: Post[];
  language?: 'en' | 'hi';
}

const isIndependenceThemeActive = (): boolean => {
  // Check URL override for easy preview and testing
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const themeOverride = params.get('theme') || params.get('preview');
    if (themeOverride === 'independence') {
      return true;
    }
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 1-indexed, August is 8
  const day = today.getDate();

  const isIndependenceTheme =
    year === 2026 &&
    month === 8 &&
    day >= 13 &&
    day <= 15;

  return isIndependenceTheme;
};

const IndianFlag: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
  return (
    <div className="relative flex items-end justify-center select-none pt-2">
      <style>{`
        @keyframes flag-wave {
          0% { transform: rotate(0deg) translateY(0px) skewY(0deg); }
          25% { transform: rotate(0.8deg) translateY(-2px) skewY(0.8deg); }
          50% { transform: rotate(0deg) translateY(-3px) skewY(0deg); }
          75% { transform: rotate(-0.8deg) translateY(-1px) skewY(-0.8deg); }
          100% { transform: rotate(0deg) translateY(0px) skewY(0deg); }
        }
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 10px rgba(251, 146, 60, 0.2), 0 0 18px rgba(255, 255, 255, 0.1), 0 0 10px rgba(74, 222, 128, 0.2);
          }
          50% {
            box-shadow: 0 0 18px rgba(251, 146, 60, 0.35), 0 0 25px rgba(255, 255, 255, 0.2), 0 0 18px rgba(74, 222, 128, 0.35);
          }
        }
        .animate-flag-wave {
          animation: flag-wave 3.2s ease-in-out infinite;
          transform-origin: left center;
        }
        .animate-glow-pulse {
          animation: glow-pulse 2.8s ease-in-out infinite;
        }
      `}</style>
      
      {/* Flag Group with pole and flag */}
      <div className={`relative flex items-stretch ${isMobile ? 'h-24' : 'h-32 sm:h-36 md:h-40'}`}>
        {/* Flag Pole */}
        <div className={`bg-gradient-to-r from-slate-400 via-slate-100 to-slate-500 rounded-t-full relative z-20 shadow-md ${isMobile ? 'w-1' : 'w-1.5 sm:w-2'}`}>
          {/* Golden Finial */}
          <div className={`bg-gradient-to-tr from-amber-600 via-yellow-200 to-amber-500 rounded-full absolute border border-amber-300 shadow-sm ${
            isMobile 
              ? 'w-2.5 h-2.5 -top-2 -left-[3px]' 
              : 'w-3.5 h-3.5 sm:w-4 sm:h-4 -top-3 sm:-top-3.5 -left-[4px] sm:-left-[5px]'
          }`}></div>
        </div>

        {/* Flag Canvas */}
        <div className={`animate-flag-wave flex flex-col rounded-r-md overflow-hidden relative z-10 origin-left border border-white/10 animate-glow-pulse ${
          isMobile 
            ? 'w-32 h-[64px]' 
            : 'w-44 h-[88px] sm:w-48 sm:h-[96px] md:w-56 md:h-[112px]'
        }`}>
          {/* Saffron Stripe */}
          <div className="bg-[#FF9933] flex-1 w-full"></div>
          {/* White Stripe */}
          <div className="bg-[#FFFFFF] flex-1 w-full flex items-center justify-center relative">
            {/* Ashoka Chakra */}
            <svg viewBox="0 0 100 100" className={`text-[#000080] ${isMobile ? 'w-5 h-5' : 'w-7 h-7 sm:w-8 sm:h-8'}`} xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="4.5" />
              <circle cx="50" cy="50" r="7.5" fill="currentColor" />
              {/* 24 spokes */}
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 360) / 24;
                const x2 = 50 + 42 * Math.cos((angle * Math.PI) / 180);
                const y2 = 50 + 42 * Math.sin((angle * Math.PI) / 180);
                return (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={x2}
                    y2={y2}
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                );
              })}
            </svg>
          </div>
          {/* Green Stripe */}
          <div className="bg-[#138808] flex-1 w-full"></div>
        </div>
      </div>
    </div>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectCategory,
  language = 'en',
}) => {
  const isIndependenceActive = isIndependenceThemeActive();
  const isHindi = language === 'hi';

  const badgeText = isHindi ? "🇮🇳 15 अगस्त 2026 • स्वतंत्रता दिवस" : "🇮🇳 15 AUGUST 2026 • INDEPENDENCE DAY";
  const headingText = isHindi ? "🇮🇳 स्वतंत्रता दिवस 2026 की हार्दिक शुभकामनाएं" : "🇮🇳 Happy Independence Day 2026";
  const subtitleText = isHindi ? "भारत की स्वतंत्रता के 80 वर्ष का उत्सव" : "Celebrating 80 Years of India's Independence";
  const patrioticText = isHindi ? "वन्दे मातरम् • जय हिन्द 🇮🇳" : "Vande Mataram • Jai Hind 🇮🇳";

  return (
    <div className={`relative overflow-hidden shadow-lg border-b w-full max-w-full text-white py-6 sm:py-8 px-3 sm:px-4 transition-all duration-500 ${
      isIndependenceActive 
        ? 'bg-[#0B2545] border-b-2 border-orange-500/50' 
        : 'bg-gradient-to-b from-[#0F4C81] via-[#0D416F] to-[#0A3459] border-b border-blue-900'
    }`}>
      {/* Background Style Declarations for Independence Day theme animations */}
      {isIndependenceActive && (
        <style>{`
          @keyframes tricolour-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes slow-spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
          @keyframes particle-float-1 {
            0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
            50% { transform: translateY(-25px) translateX(12px) scale(1.15); opacity: 0.7; }
          }
          @keyframes particle-float-2 {
            0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.25; }
            50% { transform: translateY(-18px) translateX(-15px) scale(0.9); opacity: 0.6; }
          }
        `}</style>
      )}

      {/* Background Subtle Geometry & Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0"></div>

      {isIndependenceActive && (
        <>
          {/* Subtle moving tricolour background wave/gradient flow */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-color-dodge transition-opacity duration-700 z-0"
            style={{
              background: 'linear-gradient(-45deg, rgba(255, 153, 51, 0.25) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(19, 136, 8, 0.25) 100%)',
              backgroundSize: '400% 400%',
              animation: 'tricolour-flow 12s ease infinite'
            }}
          />

          {/* Saffron Glow (Top Left) */}
          <div className="absolute -top-32 -left-20 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[#FF9933]/15 blur-[80px] sm:blur-[120px] pointer-events-none z-0" />

          {/* White Glow (Center/Right) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-white/5 blur-[60px] sm:blur-[90px] pointer-events-none z-0" />

          {/* Green Glow (Bottom Right) */}
          <div className="absolute -bottom-32 -right-20 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[#138808]/12 blur-[80px] sm:blur-[120px] pointer-events-none z-0" />

          {/* Subtle Ashoka Chakra decorative pattern watermark centered */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.035] sm:opacity-[0.05] pointer-events-none select-none z-0">
            <svg viewBox="0 0 100 100" className="w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] text-white animate-slow-spin" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="50" r="8" fill="currentColor" />
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 360) / 24;
                const x2 = 50 + 45 * Math.cos((angle * Math.PI) / 180);
                const y2 = 50 + 45 * Math.sin((angle * Math.PI) / 180);
                return (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={x2}
                    y2={y2}
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>
          </div>

          {/* Floating Tricolour Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div 
              className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FF9933]/50 blur-[0.5px]"
              style={{
                top: '15%',
                left: '20%',
                animation: 'particle-float-1 8s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#138808]/45 blur-[0.5px]"
              style={{
                bottom: '20%',
                left: '15%',
                animation: 'particle-float-2 9s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/60"
              style={{
                top: '25%',
                right: '25%',
                animation: 'particle-float-2 7s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF9933]/40 blur-[0.5px]"
              style={{
                bottom: '15%',
                right: '30%',
                animation: 'particle-float-1 10s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute w-2 h-2 rounded-full bg-[#138808]/40"
              style={{
                top: '12%',
                right: '10%',
                animation: 'particle-float-1 11s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute w-2 h-2 rounded-full bg-white/50"
              style={{
                bottom: '10%',
                left: '8%',
                animation: 'particle-float-2 8s ease-in-out infinite'
              }}
            />
          </div>
        </>
      )}

      <div className="max-w-7xl mx-auto relative z-10 space-y-6 sm:space-y-8">
        {/* Main Headline & Optional Tricolour Flag */}
        <div className={`mx-auto ${isIndependenceActive ? 'max-w-6xl md:grid md:grid-cols-12 md:gap-8 md:items-center text-center md:text-left' : 'text-center max-w-4xl'} space-y-4 transition-all duration-300`}>
          
          {/* On mobile, if Independence theme is active, we render the flag first so it sits ABOVE the heading/badge */}
          {isIndependenceActive && (
            <div className="block md:hidden flex justify-center items-center mb-1 relative z-10">
              <IndianFlag isMobile={true} />
            </div>
          )}

          <div className={`${isIndependenceActive ? 'md:col-span-8 space-y-3' : 'space-y-3'}`}>
            {isIndependenceActive ? (
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-orange-500/20 via-white/10 to-green-500/20 border border-orange-500/40 text-[#FF9933] px-2.5 py-1 sm:px-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm">
                <span className="text-white">🇮🇳</span>
                <span className="text-[#FF9933] font-black">{badgeText}</span>
                <span className="text-white">🇮🇳</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-500/20 border border-blue-300/30 text-amber-300 px-2.5 py-1 sm:px-3 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span>{getTranslation('Fastest & Verified Sarkari Updates Portal', language)}</span>
              </div>
            )}

            <h1 className="text-xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              {isIndependenceActive ? headingText : getTranslation("India's Trusted Government Job & Exam Updates Portal", language)}
            </h1>

            {isIndependenceActive && (
              <p className="text-sm sm:text-base md:text-lg font-bold text-amber-300 tracking-wide">
                {subtitleText}
              </p>
            )}

            <p className="text-xs sm:text-sm md:text-base text-slate-200 font-medium leading-relaxed max-w-3xl mx-auto md:mx-0">
              {getTranslation('Get the latest ', language)} <span className="text-amber-300 font-bold">{getTranslation('Government Jobs', language)}</span>, <span className="text-amber-300 font-bold">{getTranslation('Admit Card', language)}</span>, <span className="text-amber-300 font-bold">{getTranslation('Results', language)}</span>, <span className="text-amber-300 font-bold">{getTranslation('ANSWER KEY', language)}</span>, <span className="text-amber-300 font-bold">{getTranslation('Admissions', language)}</span>, <span className="text-amber-300 font-bold">{getTranslation('Scholarships', language)}</span>{getTranslation(', Current Affairs, and Exam Notifications in one place.', language)}
            </p>

            {isIndependenceActive && (
              <div className="pt-2">
                <p className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-green-400 tracking-wider inline-block">
                  {patrioticText}
                </p>
              </div>
            )}
          </div>

          {/* On desktop/tablet, we render the flag in the right column */}
          {isIndependenceActive && (
            <div className="hidden md:flex md:col-span-4 justify-center items-center relative z-10">
              <IndianFlag isMobile={false} />
            </div>
          )}
        </div>

        {/* 4-Box Sarkari Highlight Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-6xl mx-auto">
          {/* Box 1: Results */}
          <div
            onClick={() => onSelectCategory('results')}
            className="group cursor-pointer bg-gradient-to-br from-emerald-600 to-emerald-800 border border-emerald-400/30 rounded-xl p-4 text-white shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">{getTranslation('Exam Declared', language)}</span>
              <Award className="w-6 h-6 text-emerald-200 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">{getTranslation('Results', language).toUpperCase()}</h3>
            <p className="text-[11px] text-emerald-100 mt-1 font-medium">{getTranslation('RRB NTPC, SSC CGL, State Board & Police Cutoff', language)}</p>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 mt-3 pt-2 border-t border-emerald-500/40">
              <span>{getTranslation('View All Results', language)}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Box 2: Admit Card */}
          <div
            onClick={() => onSelectCategory('admit-card')}
            className="group cursor-pointer bg-gradient-to-br from-amber-600 to-orange-700 border border-amber-400/30 rounded-xl p-4 text-white shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200">{getTranslation('Hall Ticket', language)}</span>
              <FileText className="w-6 h-6 text-amber-200 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-black text-white group-hover:text-yellow-200 transition-colors">{getTranslation('Admit Card', language).toUpperCase()}</h3>
            <p className="text-[11px] text-amber-100 mt-1 font-medium">{getTranslation('UP Police, SSC Tier 1, NEET, Army Agniveer', language)}</p>
            <div className="flex items-center gap-1 text-[11px] font-bold text-yellow-200 mt-3 pt-2 border-t border-amber-500/40">
              <span>{getTranslation('Download Admit Cards', language)}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Box 3: Latest Jobs */}
          <div
            onClick={() => onSelectCategory('latest-jobs')}
            className="group cursor-pointer bg-gradient-to-br from-blue-600 to-indigo-800 border border-blue-400/30 rounded-xl p-4 text-white shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">{getTranslation('Active Forms', language)}</span>
              <Briefcase className="w-6 h-6 text-blue-200 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">{getTranslation('Latest Jobs', language).toUpperCase()}</h3>
            <p className="text-[11px] text-blue-100 mt-1 font-medium">{getTranslation('SSC, Railway, Banking, UPSC IAS, Defense 2026', language)}</p>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 mt-3 pt-2 border-t border-blue-500/40">
              <span>{getTranslation('Explore Vacancies', language)}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Box 4: Answer Key */}
          <div
            onClick={() => onSelectCategory('answer-key')}
            className="group cursor-pointer bg-gradient-to-br from-purple-700 to-indigo-900 border border-purple-400/30 rounded-xl p-4 text-white shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-200">{getTranslation('Keys & Objections', language)}</span>
              <Key className="w-6 h-6 text-purple-200 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">{getTranslation('ANSWER KEY', language)}</h3>
            <p className="text-[11px] text-purple-100 mt-1 font-medium">{getTranslation('Bihar Police, SSC CHSL, CUET Official Keys', language)}</p>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 mt-3 pt-2 border-t border-purple-500/40">
              <span>{getTranslation('Check Answer Keys', language)}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

