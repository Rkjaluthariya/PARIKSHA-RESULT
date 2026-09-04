import React, { useState } from 'react';
import { Post } from '../types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AdsterraAd } from './AdsterraAd';
import { FeedbackBox } from './FeedbackBox';
import { getPostImage, cleanTitleText, getTopicUnsplashImage, generateH1ImageBanner } from '../utils/imageGenerator';
import { WebpImage } from './WebpImage';
import { toWebpUrl } from '../utils/webpConverter';
import { SafeText, sanitizeAndDecodeText } from '../hooks/useSafeTextRenderer';
import { getTranslation } from '../utils/translations';
import { Breadcrumb } from './Breadcrumb';
import { SEOMetaTags } from './SEOMetaTags';
import { getOrCreatePostFaqs } from '../utils/highCtrSeo';
import { getSafeOfficialLink } from '../utils/linkResolver';
import { trackImportantLinkClick } from '../utils/analytics';
import {
  X,
  Calendar,
  Building,
  Users,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Code2,
  FileText,
  Sparkles,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Info,
  HelpCircle,
  Tag,
  Bookmark,
  Languages,
  Award,
  MessageSquare,
  Send,
  MessageCircle
} from 'lucide-react';

interface PostDetailModalProps {
  post: Post | null;
  onClose: () => void;
  allPosts: Post[];
  onSelectPost: (post: Post) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (postId: string) => void;
  language?: 'en' | 'hi';
  onLanguageChange?: (lang: 'en' | 'hi') => void;
  onTranslateItem?: (itemId: string, itemType: 'post' | 'ca', itemData: any) => Promise<any>;
  translatedCache?: Record<string, any>;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  onClose,
  allPosts,
  onSelectPost,
  isBookmarked = false,
  onToggleBookmark,
  language = 'en',
  onLanguageChange,
  onTranslateItem,
  translatedCache,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showSharePreview, setShowSharePreview] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  const [localTranslated, setLocalTranslated] = useState<any>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  React.useEffect(() => {
    if (language === 'hi' && post) {
      const cacheKey = `post_${post.id}`;
      if (translatedCache && translatedCache[cacheKey]) {
        setLocalTranslated(translatedCache[cacheKey]);
      } else if (onTranslateItem) {
        setIsTranslating(true);
        onTranslateItem(post.id, 'post', post).then((res) => {
          if (res) {
            setLocalTranslated(res);
          }
          setIsTranslating(false);
        });
      }
    } else {
      setLocalTranslated(null);
    }
  }, [language, post, translatedCache, onTranslateItem]);

  const displayedTitle = (language === 'hi' && localTranslated?.title) ? localTranslated.title : cleanTitleText(post?.title || '');
  const displayedOrg = (language === 'hi' && localTranslated?.organization) ? localTranslated.organization : post?.organization || '';
  const displayedShortInfo = (language === 'hi' && localTranslated?.shortInfo) ? localTranslated.shortInfo : post?.shortInfo || '';
  const displayedDesc = (language === 'hi' && localTranslated?.fullDescription) ? localTranslated.fullDescription : post?.fullDescription || '';

  const relatedPosts = allPosts
    .filter((p) => p.id !== post?.id && (p.category === post?.category || p.state === post?.state))
    .slice(0, 3);

  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 md:p-6 animate-fade-in">
      <SEOMetaTags post={post} />
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[92vh] border border-slate-200 animate-slide-up">
        
        {/* Top Header Bar */}
        <div className="bg-[#0F4C81] text-white p-3.5 sm:p-5 flex flex-col gap-3 flex-shrink-0">
          {/* Top Control Bar: Badges on left, Save & Close buttons on right */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="bg-[#FF6B00] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider shadow-sm text-[10px] sm:text-xs">
                {post.category.replace('-', ' ')}
              </span>
              <span className="bg-blue-800 text-blue-100 px-2 py-0.5 rounded font-semibold border border-blue-700/50 text-[10px] sm:text-xs">
                {post.state}
              </span>
              <span className="text-blue-200 text-[10px] sm:text-xs font-medium bg-blue-900/40 px-2 py-0.5 rounded border border-blue-700/30">
                {language === 'hi' ? 'प्रकाशित तिथि:' : 'Published:'} {post.postDate}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Modal-Specific Language Segmented Selector */}
              {onLanguageChange && (
                <div className="flex items-center bg-blue-950/60 p-0.5 rounded-xl border border-blue-600/50">
                  <button
                    type="button"
                    onClick={() => onLanguageChange('en')}
                    className={`px-2.5 py-1 rounded-lg font-black text-xs transition-all ${
                      language === 'en'
                        ? 'bg-white text-[#0F4C81] shadow-xs'
                        : 'text-blue-200 hover:text-white'
                    }`}
                    title="Read in English"
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => onLanguageChange('hi')}
                    className={`px-2.5 py-1 rounded-lg font-black text-xs transition-all flex items-center gap-1 ${
                      language === 'hi'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                        : 'text-blue-200 hover:text-white'
                    }`}
                    title="हिन्दी में पढ़ें (Translate to Hindi)"
                  >
                    <Languages className={`w-3.5 h-3.5 ${language === 'hi' ? 'text-amber-200 animate-pulse' : ''}`} />
                    <span>हिन्दी</span>
                  </button>
                </div>
              )}

              {onToggleBookmark && (
                <button
                  onClick={() => onToggleBookmark(post.id)}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                    isBookmarked
                      ? 'bg-amber-400 text-slate-900 border border-amber-300'
                      : 'bg-blue-800/80 text-white hover:bg-blue-700 border border-blue-600/60'
                  }`}
                  title={isBookmarked ? 'Saved in My Items' : 'Save to My Items'}
                >
                  <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isBookmarked ? 'fill-slate-900 text-slate-900' : 'text-amber-300'}`} />
                  <span className="text-[11px] sm:text-xs">{isBookmarked ? getTranslation('Saved', language) : getTranslation('Save Job', language)}</span>
                </button>
              )}



              {/* Quick Feedback Scroll Button */}
              <button
                onClick={() => {
                  const el = document.getElementById('feedback-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.classList.add('ring-4', 'ring-amber-400');
                    setTimeout(() => el.classList.remove('ring-4', 'ring-amber-400'), 2000);
                  }
                }}
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-sm border border-amber-300 cursor-pointer"
                title="Leave Feedback for this article"
              >
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950" />
                <span className="text-[11px] sm:text-xs">{language === 'hi' ? 'फीडबैक' : 'Feedback'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 text-blue-100 hover:text-white bg-blue-800/60 hover:bg-blue-800 rounded-full transition-colors"
                title="Close Modal"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Title & Organization Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pt-1">
            <SafeText
              as="h1"
              content={displayedTitle}
              className="text-base sm:text-xl md:text-2xl font-black text-white leading-snug break-words flex-1 block"
            />

            {/* Shifted Organization Box */}
            <div className="bg-blue-950/70 border border-blue-400/30 rounded-xl px-3 py-1.5 text-left md:text-right self-start md:self-end w-full md:w-auto">
              <span className="text-[10px] font-extrabold uppercase text-blue-200 tracking-wider block">
                {getTranslation('Organization / Dept', language)}
              </span>
              <SafeText
                content={displayedOrg}
                className="text-xs sm:text-sm font-black text-amber-300 block line-clamp-2 md:truncate md:max-w-[240px]"
              />
            </div>
          </div>
        </div>

        {/* Translating Status Banner */}
        {isTranslating && (
          <div className="bg-orange-50 border-b border-orange-100 px-4 py-2 text-xs text-orange-800 flex items-center gap-2 font-bold animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
            <span>कृपया प्रतीक्षा करें, हिंदी में अनुवाद किया जा रहा है... / Translating content to Hindi...</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* SEO Breadcrumb Navigation Bar */}
          <Breadcrumb
            post={post}
            language={language}
            onNavigateHome={onClose}
          />

          {/* Sarkari Post Content */}
          <div className="space-y-6">
              
              {/* Featured Image Banner with 16:9 Discover Ratio */}
              <div className="w-full aspect-[16/9] relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900">
                <WebpImage 
                  src={getPostImage(post, { width: 1200, quality: 85 })} 
                  alt={post.imageAltText || cleanTitleText(post.title) || post.organization || 'Official recruitment notification banner'}
                  className="w-full h-full object-cover"
                  loading="eager"
                  targetWidth={1200}
                  quality={85}
                  fallbackSrc={getTopicUnsplashImage(cleanTitleText(post.title), post.category, post.id)}
                  onError={(e) => {
                    const target = e.currentTarget;
                    const stage = parseInt(target.dataset.fallbackStage || '0', 10);
                    if (stage === 0) {
                      target.dataset.fallbackStage = '1';
                      target.src = getTopicUnsplashImage(cleanTitleText(post.title), post.category, post.id);
                    } else if (stage === 1) {
                      target.dataset.fallbackStage = '2';
                      target.src = generateH1ImageBanner(cleanTitleText(post.title), post.category);
                    }
                  }}
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                  <span className="bg-[#0F4C81]/90 backdrop-blur-xs text-white text-[11px] font-black px-2.5 py-1 rounded-lg border border-white/20 shadow-xs uppercase">
                    ⚡ {post.category.replace('-', ' ')}
                  </span>
                  {post.state && (
                    <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-lg shadow-xs">
                      📍 {post.state}
                    </span>
                  )}
                </div>
              </div>

              {/* Google Discover Key Highlights Overview Grid */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 border border-blue-100 rounded-2xl p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-blue-100">
                  <h3 className="text-xs sm:text-sm font-black text-[#0F4C81] uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                    <span>{language === 'hi' ? 'भर्ती / परीक्षा मुख्य विवरण (Key Highlights)' : 'Recruitment Highlights At A Glance'}</span>
                  </h3>
                  <span className="text-[10px] sm:text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified 2026
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-100 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🏢 {language === 'hi' ? 'विभाग / संस्था' : 'Authority'}</span>
                    <span className="font-extrabold text-slate-900 line-clamp-1 mt-0.5 text-xs sm:text-sm">{displayedOrg || 'Govt Department'}</span>
                  </div>
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-100 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">👥 {language === 'hi' ? 'कुल पद (Vacancies)' : 'Total Vacancies'}</span>
                    <span className="font-extrabold text-[#FF6B00] mt-0.5 text-xs sm:text-sm block">{post.totalVacancies ? `${post.totalVacancies} Posts` : 'Various Vacancies'}</span>
                  </div>
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-100 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">📅 {language === 'hi' ? 'अंतिम तिथि / स्थिति' : 'Last Date / Status'}</span>
                    <span className="font-extrabold text-rose-600 mt-0.5 text-xs sm:text-sm block">{post.lastDate || 'Active Update'}</span>
                  </div>
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-100 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🎓 {language === 'hi' ? 'योग्यता' : 'Qualification'}</span>
                    <span className="font-extrabold text-slate-800 line-clamp-1 mt-0.5">
                      {Array.isArray(post.qualificationRequired) ? post.qualificationRequired.join(', ') : (post.qualificationRequired || '10th / 12th / Graduate')}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-100 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🎂 {language === 'hi' ? 'आयु सीमा' : 'Age Limit'}</span>
                    <span className="font-extrabold text-slate-800 mt-0.5 block">
                      {post.ageLimit?.minAge ? `${post.ageLimit.minAge}-${post.ageLimit.maxAge || 35} Yrs` : '18 - 35 Years'}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-100 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">📍 {language === 'hi' ? 'जॉब लोकेशन' : 'Location'}</span>
                    <span className="font-extrabold text-[#0F4C81] mt-0.5 block">{post.state || 'All India'}</span>
                  </div>
                </div>
              </div>

              {/* 1-Click Viral Community & Social Share Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WhatsApp Viral Share Card */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🔥 *${cleanTitleText(post.title)}*\n🏢 *${post.organization}*\n👥 कुल पद: ${post.totalVacancies || 'Various'}\n📅 अंतिम तिथि: ${post.lastDate || 'Check Notification'}\n\n👉 Direct Apply & Details:\n${window.location.origin}/${post.category}/${post.slug || post.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white p-3 sm:p-4 rounded-2xl shadow-md transition-all hover:scale-[1.01] flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-black text-xs sm:text-sm">{language === 'hi' ? 'व्हाट्सएप पर शेयर करें' : 'Share on WhatsApp'}</div>
                      <div className="text-[11px] text-emerald-100">{language === 'hi' ? 'दोस्तों के साथ ग्रुप में भेजें' : 'Send direct job details to study groups'}</div>
                    </div>
                  </div>
                  <span className="bg-white text-emerald-800 text-xs font-black px-2.5 py-1 rounded-lg group-hover:bg-emerald-50 shadow-xs">
                    Share
                  </span>
                </a>

                {/* Telegram Official Channel Card */}
                <a
                  href="https://t.me/pariksha_result_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white p-3 sm:p-4 rounded-2xl shadow-md transition-all hover:scale-[1.01] flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Send className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-black text-xs sm:text-sm">{language === 'hi' ? 'टेलीग्राम चैनल से जुड़ें' : 'Join Telegram Channel'}</div>
                      <div className="text-[11px] text-sky-100">{language === 'hi' ? 'ताजा सरकारी रिजल्ट सबसे पहले' : 'Get fastest alerts on your mobile'}</div>
                    </div>
                  </div>
                  <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-1 rounded-lg group-hover:bg-amber-300 shadow-xs">
                    Join Free
                  </span>
                </a>
              </div>

              {/* Short Info Box */}
              <div className="bg-amber-50 border-l-4 border-[#FF6B00] p-4 rounded-r-xl space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-900 uppercase tracking-wide">
                  <Info className="w-4 h-4 text-[#FF6B00]" />
                  <span>{getTranslation('Short Information', language)}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {displayedShortInfo}
                </p>
              </div>

              {/* Full Description (Markdown) */}
              {displayedDesc && (
                <div className="prose prose-sm sm:prose-base prose-slate max-w-none prose-headings:text-[#0F4C81] prose-a:text-[#FF6B00] prose-img:rounded-xl">
                  <Markdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      img: ({ node, src, alt, ...props }) => (
                        <WebpImage
                          src={toWebpUrl(src || '', { width: 800, quality: 75 })}
                          alt={alt || cleanTitleText(post.title) || 'Official recruitment article graphic'}
                          className="rounded-xl border border-slate-200 shadow-sm max-w-full h-auto my-3"
                          loading="lazy"
                          targetWidth={800}
                          quality={75}
                          fallbackSrc={getTopicUnsplashImage(cleanTitleText(post.title), post.category, post.id)}
                          onError={(e) => {
                            const target = e.currentTarget;
                            const stage = parseInt(target.dataset.fallbackStage || '0', 10);
                            if (stage === 0) {
                              target.dataset.fallbackStage = '1';
                              target.src = getTopicUnsplashImage(cleanTitleText(post.title), post.category, post.id);
                            } else if (stage === 1) {
                              target.dataset.fallbackStage = '2';
                              target.src = generateH1ImageBanner(cleanTitleText(post.title), post.category);
                            }
                          }}
                          {...props}
                        />
                      )
                    }}
                  >
                    {displayedDesc}
                  </Markdown>
                </div>
              )}

              {/* Single Fast-Loading Article Ad Unit */}
              {(post.category === 'blog' || post.category === 'current-affairs') && (
                <AdsterraAd type="rectangle" label="Sponsored Content" />
              )}

              {/* Important Dates & Application Fee Tables */}
              {(post.importantDates?.length > 0 || post.applicationFees?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Important Dates Table */}
                  {post.importantDates?.length > 0 && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-[#0F4C81] text-white px-3.5 py-2.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-300" />
                        <span>{getTranslation('Important Dates', language)}</span>
                      </div>
                      <div className="divide-y divide-slate-100 text-xs">
                        {post.importantDates.map((item, idx) => (
                          <div key={idx} className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                            <span className="font-semibold text-slate-700">{item.event}</span>
                            <span className={`font-bold ${item.isImportant ? 'text-red-600 bg-red-50 px-2 py-0.5 rounded' : 'text-slate-900'}`}>
                              {item.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Application Fee Table */}
                  {post.applicationFees?.length > 0 && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-[#FF6B00] text-white px-3.5 py-2.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                        <Users className="w-4 h-4 text-yellow-200" />
                        <span>{getTranslation('Application Fee', language)}</span>
                      </div>
                      <div className="divide-y divide-slate-100 text-xs">
                        {post.applicationFees.map((item, idx) => (
                          <div key={idx} className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                            <span className="font-semibold text-slate-700">{item.category}</span>
                            <span className="font-bold text-emerald-700">{item.fee}</span>
                          </div>
                        ))}
                        <div className="p-2.5 bg-slate-50 text-[11px] text-slate-500 italic">
                          Payment Mode: Net Banking, Credit Card, Debit Card, UPI or SBI Challan Fee Mode Only.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Age Limit & Relaxation */}
              {(post.ageLimit?.minAge || post.ageLimit?.maxAge || post.ageLimit?.relaxationDetails) && (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-[#0F4C81] uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-[#FF6B00]" />
                    <span>{getTranslation('Age Limit', language)}</span>
                    {post.ageLimit.cutoffDate && (
                      <span className="text-[11px] font-semibold text-slate-500">
                        (As on {post.ageLimit.cutoffDate})
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-800">
                    {post.ageLimit.minAge && <div>Minimum Age: <span className="text-[#0F4C81] font-bold">{post.ageLimit.minAge}</span></div>}
                    {post.ageLimit.maxAge && <div>Maximum Age: <span className="text-[#0F4C81] font-bold">{post.ageLimit.maxAge}</span></div>}
                  </div>
                  {post.ageLimit.relaxationDetails && (
                    <p className="text-xs text-slate-600 italic">
                      {post.ageLimit.relaxationDetails}
                    </p>
                  )}
                </div>
              )}

              {/* Vacancies & Eligibility Table */}
              {post.vacancies?.length > 0 && (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-slate-800 text-white px-4 py-2.5 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                    <span>{getTranslation('Vacancy Details & Eligibility', language)}</span>
                    {post.totalVacancies && (
                      <span className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded font-black text-xs">
                        Total: {post.totalVacancies} Posts
                      </span>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Post Name</th>
                          <th className="p-3">Total Posts</th>
                          <th className="p-3">Eligibility & Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {post.vacancies.map((v, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-[#0F4C81]">
                              <div>{v.postName}</div>
                              {v.payScale && (
                                <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Pay: {v.payScale}</div>
                              )}
                            </td>
                            <td className="p-3 font-bold text-[#FF6B00]">
                              <div>{v.totalPosts}</div>
                              {v.categoryWiseBreakup && typeof v.categoryWiseBreakup === 'object' && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {Object.entries(v.categoryWiseBreakup).map(([cat, count]) => (
                                    <span key={cat} className="text-[9px] bg-slate-200 text-slate-700 px-1 py-0.2 rounded">
                                      {cat}: {count}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td className="p-3 text-slate-700 leading-relaxed">
                              <div>{v.eligibility}</div>
                              {v.qualification && (
                                <div className="text-[11px] font-semibold text-[#0F4C81] mt-1">Qualification: {v.qualification}</div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Selection Process / Examination Stages Section */}
              {post.selectionProcess && post.selectionProcess.length > 0 && (
                <div className="border border-purple-200 rounded-xl p-4 bg-purple-50/40 space-y-3 shadow-sm">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-purple-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>{getTranslation('Selection Process / Examination Stages', language)}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {post.selectionProcess.map((step, idx) => {
                      const isObj = typeof step === 'object' && step !== null;
                      const stageName = isObj ? (step.stageName || (step as any).stepName || (step as any).title) : String(step);
                      const description = isObj ? step.description : null;
                      const marks = isObj ? step.marks : null;
                      const nature = isObj ? step.qualifyingNature : null;
                      const stepNum = isObj && step.stepNumber ? step.stepNumber : idx + 1;

                      return (
                        <div key={idx} className="p-3 bg-white border border-purple-100 rounded-lg flex items-start gap-2.5 shadow-2xs">
                          <span className="w-6 h-6 rounded-full bg-purple-700 text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                            {stepNum}
                          </span>
                          <div className="space-y-1 flex-1">
                            <div className="font-extrabold text-slate-900 text-xs flex flex-wrap items-center gap-2">
                              <span>{stageName}</span>
                              {nature && (
                                <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded border border-purple-200">
                                  {nature}
                                </span>
                              )}
                              {marks && (
                                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200">
                                  {marks} Marks
                                </span>
                              )}
                            </div>
                            {description && (
                              <p className="text-[11px] text-slate-600 leading-snug font-medium">
                                {description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* How to Apply Steps */}
              {post.howToApplySteps && post.howToApplySteps.length > 0 && (
                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F4C81] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{getTranslation('How to Fill Online Application Form', language)}</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700 font-medium">
                    {post.howToApplySteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0F4C81] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Important Direct Links Table */}
              {post.importantLinks?.length > 0 && (
                <div className="border-2 border-[#0F4C81] rounded-xl overflow-hidden shadow-md">
                  <div className="bg-[#0F4C81] text-white px-4 py-3 font-black text-sm uppercase tracking-wider flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-amber-300" />
                    <span>{getTranslation('Important Links', language)}</span>
                  </div>
                  <div className="divide-y divide-slate-200 bg-white">
                    {post.importantLinks.map((link, idx) => {
                      const safeUrl = getSafeOfficialLink(link, post);
                      return (
                        <div key={idx} className="p-3 flex items-center justify-between gap-4 hover:bg-blue-50/50 transition-colors">
                          <span className="font-bold text-xs text-slate-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#FF6B00]"></span>
                            {link.title}
                          </span>
                          <a
                            href={safeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackImportantLinkClick(post, link.title)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0 shadow-sm ${
                              link.isPrimary
                                ? 'bg-[#FF6B00] hover:bg-orange-600 text-white'
                                : 'bg-[#0F4C81] hover:bg-blue-900 text-white'
                            }`}
                          >
                            <span>{getTranslation('Click Here', language)}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* High-CTR FAQs Collapsible Accordion Section (Schema.org Aligned) */}
              {(() => {
                const faqsToRender = getOrCreatePostFaqs(post);
                if (!faqsToRender || faqsToRender.length === 0) return null;
                return (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                        <HelpCircle className="w-4.5 h-4.5 text-[#0F4C81]" />
                        Frequently Asked Questions (FAQs - {faqsToRender.length} Questions)
                      </h3>
                    </div>

                    <div className="space-y-2">
                      {faqsToRender.map((faq, idx) => {
                        const isOpen = openFaqIndex === idx;
                        return (
                          <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                              className="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between gap-3 text-xs font-bold text-slate-800"
                            >
                              <span className="flex items-center gap-2">
                                <span className="text-[#FF6B00]">Q{idx + 1}.</span>
                                {faq.question}
                              </span>
                              {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                            </button>
                            {isOpen && (
                              <div className="p-3.5 bg-white text-xs text-slate-700 leading-relaxed border-t border-slate-100 font-medium whitespace-pre-line">
                                {faq.answer}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Related Posts Section */}
              {relatedPosts.length > 0 && (
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    {post.category === 'blog' || post.category === 'current-affairs' ? 'Related Articles' : 'Related Exam Notifications'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {relatedPosts.map((rp) => (
                      <div
                        key={rp.id}
                        onClick={() => onSelectPost(rp)}
                        className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg cursor-pointer transition-all space-y-1"
                      >
                        <div className="text-xs font-bold text-slate-900 line-clamp-2">{rp.title}</div>
                        <div className="text-[10px] text-slate-500">{rp.organization}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Student Feedback Box */}
              <FeedbackBox
                targetType={post.category === 'blog' ? 'blog' : 'general'}
                targetId={post.id}
                title={displayedTitle || post.title}
                language={language}
              />

            </div>

        </div>

        {/* High-Conversion Sticky Bottom Action Bar */}
        <div className="bg-slate-900 border-t border-slate-800 p-3 sm:p-4 flex items-center justify-between gap-2.5 sm:gap-4 flex-shrink-0">
          {/* Primary Action Button (Apply Online / Official Link) */}
          {(() => {
            const primaryLink = post.importantLinks && post.importantLinks.length > 0 
              ? (post.importantLinks.find(l => l.isPrimary) || post.importantLinks[0])
              : null;
            if (!primaryLink) return null;
            const safeUrl = getSafeOfficialLink(primaryLink, post);
            return (
              <a
                href={safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackImportantLinkClick(post, primaryLink.title)}
                className="bg-gradient-to-r from-[#FF6B00] to-orange-600 hover:from-orange-500 hover:to-orange-600 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all hover:scale-105 flex-shrink-0"
              >
                <span>{primaryLink.title || (language === 'hi' ? 'सीधा आवेदन / लिंक' : 'Apply / Check Details')}</span>
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            );
          })()}

          {/* Social Community & Share Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto flex-wrap justify-end">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🔥 *${cleanTitleText(post.title)}*\n🏢 *${post.organization}*\n👥 पद: ${post.totalVacancies || 'Various'}\n\n👉 Direct Apply/Check:\n${window.location.origin}/${post.category}/${post.slug || post.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <a
              href="https://t.me/pariksha_result_official"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              title="Join Telegram Channel"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Telegram</span>
            </a>

            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/${post.category}/${post.slug || post.id}`);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-slate-700"
              title="Copy Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? (language === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (language === 'hi' ? 'लिंक' : 'Copy Link')}</span>
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors"
            >
              {language === 'hi' ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
