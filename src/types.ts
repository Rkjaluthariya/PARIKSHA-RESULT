export type CategoryType = 
  | 'latest-jobs' 
  | 'admit-card' 
  | 'results' 
  | 'answer-key' 
  | 'admissions' 
  | 'scholarships' 
  | 'current-affairs' 
  | 'quiz' 
  | 'government-schemes'
  | 'syllabus'
  | 'blog';

export type StateType = 
  | 'All India'
  | 'Uttar Pradesh'
  | 'Bihar'
  | 'Rajasthan'
  | 'Madhya Pradesh'
  | 'Delhi'
  | 'Haryana'
  | 'Maharashtra'
  | 'Punjab'
  | 'Jharkhand'
  | 'Karnataka'
  | 'Other';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ImportantDate {
  event: string;
  date: string;
  isImportant?: boolean;
  details?: string;
}

export interface ApplicationFee {
  category: string;
  fee: string;
}

export interface AgeLimit {
  minAge?: string;
  maxAge?: string;
  cutoffDate?: string;
  relaxationDetails?: string;
}

export interface VacancyDetail {
  postName: string;
  totalPosts: number | string;
  eligibility: string;
  qualification?: string;
  categoryWiseBreakup?: Record<string, string | number>;
  payScale?: string;
}

export interface SelectionStep {
  stepNumber?: number;
  stageName: string;
  description?: string;
  marks?: string | number;
  qualifyingNature?: string;
}

export interface DirectLink {
  title: string;
  url: string;
  isPrimary?: boolean;
  type?: 'apply' | 'notification' | 'result' | 'results' | 'admit' | 'admit-card' | 'answer' | 'answer-key' | 'website' | 'official_website' | 'official-website' | 'status' | 'syllabus' | 'login' | 'registration' | 'download' | 'other';
}

export interface SchemaMarkup {
  faqSchema: object;
  articleSchema: object;
  breadcrumbSchema: object;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  category: CategoryType;
  sourceUrl?: string;
  organization?: string;
  state: StateType;
  postDate?: string;
  lastDate?: string;
  shortInfo: string;
  totalVacancies?: number | string;
  qualificationRequired?: string[];
  
  // Tables & Structured Sections
  importantDates?: ImportantDate[];
  applicationFees?: ApplicationFee[];
  ageLimit?: AgeLimit;
  vacancies?: VacancyDetail[];
  selectionProcess?: (SelectionStep | string)[];
  howToApplySteps?: string[];
  importantLinks?: DirectLink[];
  
  // Content & SEO
  fullDescription: string;
  faqs?: FAQItem[];
  
  // Metadata & Schemas
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  featuredImagePrompt?: string;
  imageAltText?: string;
  heroImage?: string;
  openGraph?: {
    title: string;
    description: string;
    type: string;
    url: string;
    image?: string;
    siteName?: string;
  };
  schemas?: SchemaMarkup;
  plagiarismFreeScore?: number;
  aiHumanizedScore?: number;
  relatedPostIds?: string[];
  views?: number;
  image?: string;
  thumbnail?: string;
  imageUrl?: string;
  canonical_hash?: string;
  originalPostDate?: string;
  publishedAt?: string;
  syncedAt?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  optionExplanations?: string[];
  category: string;
}

export interface CurrentAffairsArticle {
  id: string;
  title: string;
  date: string;
  category: string;
  summary?: string;
  keyPoints?: string[];
  fullContent?: string;
  keyHighlights?: string[];
  source?: string;
  sourceUrl?: string;
  publishedAt?: string;
  syncedAt?: string;
  image?: string;
  heroImage?: string;
  thumbnail?: string;
  imageUrl?: string;
  shortInfo?: string;
  canonical_hash?: string;
}
