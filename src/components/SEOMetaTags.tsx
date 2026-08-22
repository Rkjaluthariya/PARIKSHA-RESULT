import React, { useEffect } from 'react';
import { Post, CategoryType } from '../types';
import { cleanTitleText } from '../utils/imageGenerator';

interface SEOMetaTagsProps {
  post?: Post | null;
  activeCategory?: CategoryType | 'all';
  pathname?: string;
  selectedState?: string;
}

const CATEGORY_SEO_DATA: Record<string, { title: string; description: string; keywords: string[] }> = {
  'latest-jobs': {
    title: 'Latest Sarkari Jobs & Government Vacancies 2026 | Pariksha Result',
    description: 'Explore latest government jobs (Sarkari Naukri), recruitment notifications, online application forms, eligibility criteria & direct links on Pariksha Result.',
    keywords: ['Latest Sarkari Jobs 2026', 'Government Vacancies', 'Sarkari Naukri Online Form', 'Bank Jobs', 'SSC Recruitment', 'Railway Jobs', 'Police Bharti']
  },
  'admit-card': {
    title: 'Sarkari Exam Admit Card & Hall Ticket 2026 | Pariksha Result',
    description: 'Download official admit cards, exam hall tickets, call letters, and exam center city slips for SSC, UPSC, Railway, Police, Banking & State Exams.',
    keywords: ['Sarkari Admit Card 2026', 'Hall Ticket Download', 'Call Letter', 'SSC Admit Card', 'Railway NTPC Admit Card', 'Police Constable Hall Ticket']
  },
  'results': {
    title: 'Sarkari Result 2026 - Latest Exam Results & Merit Lists | Pariksha Result',
    description: 'Check Sarkari Exam Results, merit lists, score cards, cut-off marks, and selection lists for all central and state government recruitment exams.',
    keywords: ['Sarkari Result 2026', 'Exam Results', 'Merit List PDF', 'Cut Off Marks', 'Score Card Download', 'SSC Result', 'Board Exam Results']
  },
  'answer-key': {
    title: 'Official Answer Key, Question Paper & Objection Link 2026 | Pariksha Result',
    description: 'Download official answer keys, question papers, response sheets, and submit online objections for all Sarkari exams.',
    keywords: ['Official Answer Key 2026', 'Question Paper Solution', 'Response Sheet', 'Objection Link', 'Tentative Answer Key']
  },
  'syllabus': {
    title: 'Exam Syllabus & Selection Exam Pattern 2026 | Pariksha Result',
    description: 'Download detailed syllabus PDF, exam pattern, subject-wise marks distribution, and preparation guide for government exams.',
    keywords: ['Sarkari Syllabus 2026', 'Exam Pattern', 'Subject Wise Syllabus', 'Selection Process', 'Exam Scheme']
  },
  'admissions': {
    title: 'Admission Online Forms, Entrance Exam & Counseling 2026 | Pariksha Result',
    description: 'Apply online for university admissions, entrance tests (JNVST, NTA, CUET, NEET, JEE, Polytechnic, ITI), and counseling schedules.',
    keywords: ['University Admissions 2026', 'Entrance Exam Form', 'CUET UG', 'NEET UG Counselling', 'JNVST Form', 'Polytechnic Admission']
  },
  'scholarships': {
    title: 'National & State Scholarships Online Form 2026 | Pariksha Result',
    description: 'Find Pre-Matric, Post-Matric, Higher Education & Merit-cum-Means scholarship schemes, eligibility, and direct application links on NSP.',
    keywords: ['National Scholarship Portal', 'NSP Form 2026', 'Post Matric Scholarship', 'Pre Matric Scholarship', 'Higher Education Stipend']
  },
  'government-schemes': {
    title: 'Government Schemes (Sarkari Yojana) 2026: Apply Online & Benefits | Pariksha Result',
    description: 'Latest welfare schemes, subsidy programs, financial assistance, and online application guidelines for central and state government schemes.',
    keywords: ['Sarkari Yojana 2026', 'Government Schemes', 'PM Kisan', 'Jan Dhan Yojana', 'Subsidies and Grants', 'Welfare Portal']
  },
  'current-affairs': {
    title: 'Daily Current Affairs 2026 in Hindi & English (दैनिक समसामयिकी) | Pariksha Result',
    description: 'Read daily national and international current affairs, monthly capsules, one-liner GK, and quiz questions for UPSC, SSC, Banking & Railway exams.',
    keywords: ['Daily Current Affairs 2026', 'दैनिक समसामयिकी', 'Current Affairs in Hindi', 'GK Updates', 'Monthly Current Affairs PDF']
  },
  'quiz': {
    title: 'Daily Online Quiz & Free Mock Tests 2026 (GK, Current Affairs, Reasoning) | Pariksha Result',
    description: 'Practice free online mock tests, daily GK quizzes, current affairs tests, and competitive exam questions with instant score and answer key.',
    keywords: ['Free Online Quiz 2026', 'Mock Test Series', 'Daily GK Quiz', 'Competitive Exam Practice', 'Live Quiz Test']
  },
  'blog': {
    title: 'Sarkari Exam Tips, Study Materials & Career Guidance | Pariksha Result Blog',
    description: 'Expert tips, preparation blueprints, interview guidance, and exam analysis for cracking competitive government exams.',
    keywords: ['Exam Preparation Tips', 'Career Guidance', 'How to Crack Govt Exams', 'Study Material', 'Pariksha Result Blog']
  }
};

export const SEOMetaTags: React.FC<SEOMetaTagsProps> = ({
  post,
  activeCategory = 'all',
  pathname = '/',
  selectedState = 'All India',
}) => {
  useEffect(() => {
    const baseUrl = 'https://pariksha-result.vercel.app';
    
    // Clean pathname
    let cleanPath = pathname || '/';
    if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
      cleanPath = cleanPath.slice(0, -1);
    }

    let titleToSet = "Pariksha Result 2026 - Latest Sarkari Result, Online Form, Admit Card & Answer Key";
    let descriptionToSet = "Get latest Sarkari Result, Sarkari Exam notifications, Online Forms, Admit Cards, Answer Keys, Current Affairs & Syllabus updates on Pariksha Result 2026.";
    let keywordsToSet = "Pariksha Result 2026, Sarkari Result, Latest Jobs, Admit Card, Answer Key, Government Job Online Form, SSC, Railway, Banking";
    let canonicalUrl = `${baseUrl}${cleanPath === '/' ? '/' : cleanPath}`;
    let ogType = "website";

    // 1. Specific Post Active
    if (post) {
      const cat = post.category || 'latest-jobs';
      const slug = post.slug || post.id;
      canonicalUrl = `${baseUrl}/${cat}/${slug}`;
      titleToSet = post.metaTitle || `${cleanTitleText(post.title)} - ${post.organization} | Pariksha Result`;
      descriptionToSet = post.metaDescription || post.shortInfo || (post.fullDescription ? post.fullDescription.slice(0, 160) : '') || descriptionToSet;
      keywordsToSet = post.keywords && post.keywords.length > 0 ? post.keywords.join(', ') : keywordsToSet;
      ogType = "article";
    } 
    // 2. State Filter Page
    else if (cleanPath.startsWith('/state/')) {
      const stateName = cleanPath.replace('/state/', '').replace(/-/g, ' ');
      titleToSet = `Sarkari Jobs & Results in ${stateName.toUpperCase()} 2026 | Pariksha Result`;
      descriptionToSet = `Find latest government jobs, admit cards, exam results, and notifications for ${stateName} state recruitment on Pariksha Result.`;
      canonicalUrl = `${baseUrl}${cleanPath}`;
    }
    // 3. Category Page Active
    else if (activeCategory && activeCategory !== 'all' && CATEGORY_SEO_DATA[activeCategory]) {
      const catData = CATEGORY_SEO_DATA[activeCategory];
      titleToSet = catData.title;
      descriptionToSet = catData.description;
      keywordsToSet = catData.keywords.join(', ');
      canonicalUrl = `${baseUrl}/${activeCategory}`;
    }
    // 4. Utility / Static Pages
    else if (cleanPath === '/age-calculator') {
      titleToSet = "Sarkari Age Calculator Tool 2026 (Exact Age in Years, Months, Days) | Pariksha Result";
      descriptionToSet = "Calculate your exact age as on cutoff date for government job online applications, exams, and eligibility criteria.";
      canonicalUrl = `${baseUrl}/age-calculator`;
    } else if (cleanPath === '/privacy-policy') {
      titleToSet = "Privacy Policy | Pariksha Result";
      descriptionToSet = "Official Privacy Policy of Pariksha Result detailing user data protection, privacy terms, cookies, and security.";
      canonicalUrl = `${baseUrl}/privacy-policy`;
    } else if (cleanPath === '/terms-conditions') {
      titleToSet = "Terms and Conditions | Pariksha Result";
      descriptionToSet = "Terms of service and usage conditions for Pariksha Result online portal.";
      canonicalUrl = `${baseUrl}/terms-conditions`;
    } else if (cleanPath === '/disclaimer') {
      titleToSet = "Disclaimer | Pariksha Result";
      descriptionToSet = "Official disclaimer regarding recruitment information, informational sources, and accuracy on Pariksha Result.";
      canonicalUrl = `${baseUrl}/disclaimer`;
    } else if (cleanPath === '/contact-us') {
      titleToSet = "Contact Us & Feedback | Pariksha Result";
      descriptionToSet = "Contact the Pariksha Result editorial team for recruitment queries, corrections, support, and feedback.";
      canonicalUrl = `${baseUrl}/contact-us`;
    }

    // Set Document Title
    document.title = cleanTitleText(titleToSet);

    // Helpers
    const setMetaTag = (attr: 'name' | 'property', attrVal: string, contentVal: string) => {
      let element = document.querySelector(`meta[${attr}="${attrVal}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    const setCanonicalLink = (url: string) => {
      let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
      }
      element.setAttribute('href', url);
    };

    const setJsonLdScript = (id: string, jsonObj: object) => {
      let script = document.getElementById(id) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonObj, null, 2);
    };

    const removeScript = (id: string) => {
      const script = document.getElementById(id);
      if (script) script.remove();
    };

    // Apply Meta Tags
    setMetaTag('name', 'description', descriptionToSet);
    setMetaTag('name', 'keywords', keywordsToSet);
    setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMetaTag('name', 'googlebot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setCanonicalLink(canonicalUrl);

    // OpenGraph & Twitter
    const imageUrl = `${baseUrl}/android-chrome-512x512.png`;
    setMetaTag('property', 'og:site_name', 'Pariksha Result');
    setMetaTag('property', 'og:title', titleToSet);
    setMetaTag('property', 'og:description', descriptionToSet);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', imageUrl);

    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', titleToSet);
    setMetaTag('name', 'twitter:description', descriptionToSet);
    setMetaTag('name', 'twitter:image', imageUrl);

    // Structured Data (JSON-LD)
    if (post) {
      if (post.category === 'latest-jobs' || post.totalVacancies) {
        const jobSchema = {
          "@context": "https://schema.org",
          "@type": "JobPosting",
          "title": post.title,
          "description": post.shortInfo || post.metaDescription,
          "identifier": {
            "@type": "PropertyValue",
            "name": post.organization,
            "value": post.id
          },
          "datePosted": post.postDate || "2026-08-17",
          "validThrough": post.lastDate || "2026-12-31",
          "employmentType": "FULL_TIME",
          "hiringOrganization": {
            "@type": "Organization",
            "name": post.organization,
            "sameAs": baseUrl,
            "logo": imageUrl
          },
          "jobLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressRegion": post.state || "All India",
              "addressCountry": "IN"
            }
          },
          "totalVacancies": post.totalVacancies || "1"
        };
        setJsonLdScript('seo-schema-main', jobSchema);
      } else {
        const articleSchema = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.shortInfo || post.metaDescription,
          "datePublished": post.postDate || "2026-08-17",
          "author": {
            "@type": "Organization",
            "name": post.organization || "Pariksha Result Editorial Team"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Pariksha Result",
            "logo": {
              "@type": "ImageObject",
              "url": imageUrl
            }
          }
        };
        setJsonLdScript('seo-schema-main', articleSchema);
      }

      // Breadcrumb Schema
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": `${baseUrl}/` },
          { "@type": "ListItem", "position": 2, "name": (post.category || 'Jobs').toUpperCase().replace(/-/g, ' '), "item": `${baseUrl}/${post.category}` },
          { "@type": "ListItem", "position": 3, "name": post.title, "item": canonicalUrl }
        ]
      };
      setJsonLdScript('seo-schema-breadcrumb', breadcrumbSchema);
    } else {
      // Home / Category WebSite Schema
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Pariksha Result",
        "alternateName": ["ParikshaResult", "Pariksha Result 2026", "Pariksha Result Official Portal"],
        "url": baseUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}/?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      };
      setJsonLdScript('seo-schema-main', websiteSchema);
      removeScript('seo-schema-breadcrumb');
    }

  }, [post, activeCategory, pathname, selectedState]);

  return null;
};
