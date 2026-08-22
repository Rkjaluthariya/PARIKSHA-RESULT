import React from 'react';
import { Post } from '../types';
import { Calendar, Building, MapPin, Users, ArrowRight, Clock, ShieldCheck, Sparkles, Bookmark } from 'lucide-react';
import { getPostImage, cleanTitleText, getTopicUnsplashImage, generateH1ImageBanner } from '../utils/imageGenerator';
import { WebpImage } from './WebpImage';
import { SafeText, sanitizeAndDecodeText } from '../hooks/useSafeTextRenderer';

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (postId: string) => void;
  language?: 'en' | 'hi';
  translatedCache?: Record<string, any>;
}

export const PostCard = React.memo(function PostCard({
  post,
  onClick,
  isBookmarked = false,
  onToggleBookmark,
  language = 'en',
  translatedCache,
}: PostCardProps) {
  const isJob = post.category === 'latest-jobs';
  const isResult = post.category === 'results';
  const isAdmit = post.category === 'admit-card';

  const cacheKey = `post_${post.id}`;
  const isTranslated = language === 'hi' && translatedCache?.[cacheKey];

  const displayTitle = isTranslated
    ? translatedCache[cacheKey].title
    : sanitizeAndDecodeText(cleanTitleText(post.title)) || 'Official Recruitment Update';

  const displayOrg = isTranslated ? translatedCache[cacheKey].organization : post.organization;
  const displayShortInfo = isTranslated ? translatedCache[cacheKey].shortInfo : post.shortInfo;

  const thumbnailUrl = getPostImage(post, { width: 600, quality: 75 });

  return (
    <div
      onClick={() => onClick(post)}
      className="group bg-white rounded-xl border border-slate-200 hover:border-[#0F4C81] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between relative"
    >
      {/* Thumbnail Header Image */}
      <div className="w-full h-44 bg-slate-100 overflow-hidden relative">
        <WebpImage
          src={thumbnailUrl}
          alt={post.imageAltText || displayTitle || post.organization || 'Official recruitment notification banner'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          targetWidth={600}
          quality={75}
          fallbackSrc={getTopicUnsplashImage(displayTitle, post.category, post.id)}
          onError={(e) => {
            const target = e.currentTarget;
            const stage = parseInt(target.dataset.fallbackStage || '0', 10);
            if (stage === 0) {
              target.dataset.fallbackStage = '1';
              target.src = getTopicUnsplashImage(displayTitle, post.category, post.id);
            } else if (stage === 1) {
              target.dataset.fallbackStage = '2';
              target.src = generateH1ImageBanner(displayTitle, post.category);
            }
          }}
        />
        {/* Absolute Badges over Image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs ${
            isJob ? 'bg-blue-600 text-white' :
            isResult ? 'bg-emerald-600 text-white' :
            isAdmit ? 'bg-amber-500 text-white' : 'bg-slate-600 text-white'
          }`}>
            {language === 'hi' ? (
              isJob ? 'नवीनतम नौकरी' :
              isResult ? 'परीक्षा परिणाम' :
              isAdmit ? 'प्रवेश पत्र' :
              post.category.replace('-', ' ')
            ) : post.category.replace('-', ' ')}
          </span>
          <span className="text-[10px] font-semibold bg-white/95 text-slate-800 px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
            <MapPin className="w-2.5 h-2.5 text-slate-500" />
            {language === 'hi' && post.state === 'All India' ? 'अखिल भारतीय' : post.state}
          </span>
        </div>

        {/* Bookmark Absolute over Image */}
        {onToggleBookmark && (
          <div className="absolute top-3 right-3 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(post.id);
              }}
              className={`p-1.5 rounded-lg transition-all shadow-xs ${
                isBookmarked
                  ? 'bg-amber-500 text-white border border-amber-400'
                  : 'bg-white/90 text-slate-600 hover:text-amber-600 hover:bg-white'
              }`}
              title={isBookmarked ? (language === 'hi' ? 'सहेजा गया हटाएं' : 'Remove Bookmark') : (language === 'hi' ? 'सहेजें' : 'Save to My Items')}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white text-white' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {post.totalVacancies && (
                <span className="text-xs font-black text-[#FF6B00] bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {typeof post.totalVacancies === 'number' ? post.totalVacancies.toLocaleString('en-IN') : post.totalVacancies} {language === 'hi' ? 'पद' : 'Posts'}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <SafeText
            as="h3"
            content={displayTitle}
            className="text-sm font-bold text-slate-900 group-hover:text-[#0F4C81] transition-colors line-clamp-2 leading-snug mb-2 block"
          />

          {/* Organization */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mb-3">
            <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <SafeText content={displayOrg} className="truncate" />
          </div>

          {/* Short Info */}
          <SafeText
            as="p"
            content={displayShortInfo}
            className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3 block"
          />
        </div>

        {/* Footer Info & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{language === 'hi' ? 'दिनांक:' : 'Post Date:'} {post.postDate}</span>
          </div>

          {post.lastDate && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
              <Clock className="w-3 h-3 text-red-500" />
              <span>{language === 'hi' ? 'अंतिम:' : 'Last:'} {post.lastDate}</span>
            </div>
          )}

          <div className="text-xs font-bold text-[#0F4C81] group-hover:text-[#FF6B00] flex items-center gap-1 transition-colors">
            <span>{language === 'hi' ? 'विवरण देखें' : 'View Post'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
});
