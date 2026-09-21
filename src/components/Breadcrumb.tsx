import React from 'react';
import { Home, ChevronRight, Layers, Tag, MapPin, FileText, Sparkles } from 'lucide-react';
import { CategoryType, Post } from '../types';
import { getTranslation } from '../utils/translations';

export interface BreadcrumbItem {
  name: string;
  nameHi?: string;
  url?: string;
  onClick?: () => void;
  isCurrent?: boolean;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  activeCategory?: CategoryType | 'all';
  selectedState?: string;
  searchQuery?: string;
  post?: Post | null;
  language?: 'en' | 'hi';
  onNavigateHome?: () => void;
  onSelectCategory?: (category: CategoryType | 'all') => void;
  onClearSearch?: () => void;
  onClearState?: () => void;
  className?: string;
}

const CATEGORY_NAMES: Record<string, { en: string; hi: string }> = {
  'latest-jobs': { en: 'Latest Jobs', hi: 'सरकारी नौकरियां' },
  'admit-card': { en: 'Admit Card', hi: 'एडमिट कार्ड' },
  'results': { en: 'Results', hi: 'परीक्षा परिणाम' },
  'answer-key': { en: 'Answer Key', hi: 'उत्तर कुंजी' },
  'syllabus': { en: 'Syllabus', hi: 'सिलेबस' },
  'admissions': { en: 'Admissions', hi: 'प्रवेश सूचना' },
  'scholarships': { en: 'Scholarships', hi: 'छात्रवृत्ति' },
  'government-schemes': { en: 'Govt Schemes', hi: 'सरकारी योजनाएं' },
  'current-affairs': { en: 'Current Affairs', hi: 'दैनिक समसामयिकी' },
  'quiz': { en: 'Daily Quiz', hi: 'ऑनलाइन क्विज़' },
  'blog': { en: 'Exam Guide & Updates', hi: 'परीक्षा गाइड व लेख' },
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  activeCategory,
  selectedState = 'All India',
  searchQuery = '',
  post,
  language = 'en',
  onNavigateHome,
  onSelectCategory,
  onClearSearch,
  onClearState,
  className = '',
}) => {
  // Compute breadcrumb trail dynamically if items are not directly passed
  const computedItems: BreadcrumbItem[] = React.useMemo(() => {
    if (items && items.length > 0) {
      return items;
    }

    const trail: BreadcrumbItem[] = [
      {
        name: 'Home',
        nameHi: 'होम',
        url: '/',
        onClick: onNavigateHome,
        icon: <Home className="w-3.5 h-3.5 text-slate-500 hover:text-[#0F4C81]" />,
      },
    ];

    // If viewing a single post
    if (post) {
      const catInfo = CATEGORY_NAMES[post.category] || {
        en: post.category.replace('-', ' '),
        hi: post.category.replace('-', ' '),
      };

      trail.push({
        name: catInfo.en,
        nameHi: catInfo.hi,
        url: `/#category-${post.category}`,
        onClick: onSelectCategory ? () => onSelectCategory(post.category as CategoryType) : undefined,
        icon: <Layers className="w-3.5 h-3.5 text-amber-500" />,
      });

      if (post.state && post.state !== 'All India') {
        trail.push({
          name: post.state,
          nameHi: post.state,
          icon: <MapPin className="w-3 h-3 text-emerald-500" />,
        });
      }

      trail.push({
        name: post.title,
        nameHi: (post as any).titleHi || post.title,
        isCurrent: true,
        icon: <FileText className="w-3.5 h-3.5 text-[#FF6B00]" />,
      });

      return trail;
    }

    // Category Level
    if (activeCategory && activeCategory !== 'all') {
      const catInfo = CATEGORY_NAMES[activeCategory] || {
        en: activeCategory.replace('-', ' '),
        hi: activeCategory.replace('-', ' '),
      };

      const hasSubFilters = (selectedState && selectedState !== 'All India') || Boolean(searchQuery);

      trail.push({
        name: catInfo.en,
        nameHi: catInfo.hi,
        url: `/#category-${activeCategory}`,
        onClick: hasSubFilters && onSelectCategory ? () => onSelectCategory(activeCategory) : undefined,
        isCurrent: !hasSubFilters,
        icon: <Layers className="w-3.5 h-3.5 text-amber-500" />,
      });
    }

    // State Filter Level
    if (selectedState && selectedState !== 'All India') {
      trail.push({
        name: selectedState,
        nameHi: selectedState,
        onClick: onClearState,
        isCurrent: !searchQuery,
        icon: <MapPin className="w-3.5 h-3.5 text-emerald-500" />,
      });
    }

    // Search Query Level
    if (searchQuery) {
      trail.push({
        name: `Search: "${searchQuery}"`,
        nameHi: `खोज: "${searchQuery}"`,
        onClick: onClearSearch,
        isCurrent: true,
        icon: <Tag className="w-3.5 h-3.5 text-purple-500" />,
      });
    }

    // If currently on Home root with no filters
    if (trail.length === 1) {
      trail[0].isCurrent = true;
    }

    return trail;
  }, [items, activeCategory, selectedState, searchQuery, post, language, onNavigateHome, onSelectCategory, onClearSearch, onClearState]);

  // Construct JSON-LD Structured Data for Google Search Crawler
  const jsonLdData = React.useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pariksha-results.web.app';
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: computedItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: language === 'hi' && item.nameHi ? item.nameHi : item.name,
        item: item.url ? `${origin}${item.url.startsWith('/') ? item.url : `/${item.url}`}` : undefined,
      })),
    };
  }, [computedItems, language]);

  return (
    <nav
      aria-label="Breadcrumb"
      className={`bg-slate-50/90 hover:bg-slate-50 transition-colors border border-slate-200/80 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-xs ${className}`}
    >
      {/* Hidden JSON-LD Script for Search Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs text-slate-600 font-medium"
      >
        {computedItems.map((item, index) => {
          const isLast = index === computedItems.length - 1 || item.isCurrent;
          const displayName = language === 'hi' && item.nameHi ? item.nameHi : item.name;

          return (
            <li
              key={`${item.name}-${index}`}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center gap-1.5 sm:gap-2 min-w-0"
            >
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" aria-hidden="true" />
              )}

              {isLast ? (
                <span
                  itemProp="name"
                  aria-current="page"
                  className="flex items-center gap-1.5 font-bold text-[#0F4C81] bg-blue-50/80 border border-blue-200/60 px-2.5 py-0.5 rounded-md truncate max-w-[200px] sm:max-w-[350px] md:max-w-[500px]"
                  title={displayName}
                >
                  {item.icon}
                  <span className="truncate">{displayName}</span>
                  {computedItems.length === 1 && (
                    <span className="text-[10px] text-emerald-600 font-extrabold ml-1 bg-emerald-100/80 px-1.5 py-0.2 rounded-full hidden xs:inline">
                      Live Portal
                    </span>
                  )}
                </span>
              ) : item.onClick ? (
                <button
                  type="button"
                  itemProp="item"
                  onClick={item.onClick}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-[#0F4C81] hover:bg-slate-200/60 px-2 py-0.5 rounded-md transition-colors font-medium truncate max-w-[160px] sm:max-w-[220px]"
                  title={`Navigate to ${displayName}`}
                >
                  {item.icon}
                  <span itemProp="name" className="truncate">{displayName}</span>
                </button>
              ) : item.url ? (
                <a
                  itemProp="item"
                  href={item.url}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-[#0F4C81] hover:bg-slate-200/60 px-2 py-0.5 rounded-md transition-colors font-medium truncate max-w-[160px] sm:max-w-[220px]"
                  title={`Navigate to ${displayName}`}
                >
                  {item.icon}
                  <span itemProp="name" className="truncate">{displayName}</span>
                </a>
              ) : (
                <span
                  itemProp="name"
                  className="flex items-center gap-1.5 text-slate-600 font-medium truncate max-w-[160px]"
                >
                  {item.icon}
                  <span className="truncate">{displayName}</span>
                </span>
              )}

              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
