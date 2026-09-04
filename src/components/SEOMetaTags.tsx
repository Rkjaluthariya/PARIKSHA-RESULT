import React, { useEffect } from 'react';
import { Post, CategoryType } from '../types';
import { cleanTitleText } from '../utils/imageGenerator';
import { generateHighCtrTitle, generateHighCtrDescription, getOrCreatePostFaqs } from '../utils/highCtrSeo';

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

// Helper functions for Google Rich Snippets & Schema Generation
function formatIsoDate(dateStr?: string, fallbackDaysOffset = 0): string {
  if (!dateStr || typeof dateStr !== 'string') {
    const d = new Date();
    d.setDate(d.getDate() + fallbackDaysOffset);
    return d.toISOString();
  }

  const trimmed = dateStr.trim();
  if (!trimmed) {
    const d = new Date();
    d.setDate(d.getDate() + fallbackDaysOffset);
    return d.toISOString();
  }

  // DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}T23:59:59+05:30`;
  }

  // YYYY-MM-DD
  const ymdMatch = trimmed.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const month = ymdMatch[2].padStart(2, '0');
    const day = ymdMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}T23:59:59+05:30`;
  }

  const parsed = Date.parse(trimmed);
  if (!isNaN(parsed)) {
    const d = new Date(parsed);
    if (fallbackDaysOffset !== 0) {
      d.setDate(d.getDate() + fallbackDaysOffset);
    }
    return d.toISOString();
  }

  const fallback = new Date();
  fallback.setDate(fallback.getDate() + fallbackDaysOffset);
  return fallback.toISOString();
}

function generateJobPostingHtmlDescription(post: Post): string {
  const org = post.organization || 'Government Department / Exam Authority';
  const title = cleanTitleText(post.title);
  const vac = post.totalVacancies ? `${post.totalVacancies}` : 'Various Posts';
  const state = post.state || 'All India';
  
  let qual = 'As per official recruitment notification rules';
  if (Array.isArray(post.qualificationRequired) && post.qualificationRequired.length > 0) {
    qual = post.qualificationRequired.join(', ');
  } else if (typeof post.qualificationRequired === 'string' && (post.qualificationRequired as string).trim()) {
    qual = post.qualificationRequired;
  }

  const lastDate = post.lastDate || 'Refer to official portal closing deadline';

  let html = `<p><strong>${org}</strong> has officially announced recruitment notification for <strong>${title}</strong> (${state}) for <strong>${vac}</strong> vacancies. Interested and eligible candidates can check job details, educational qualification, age limit, selection criteria, salary scale, and apply online before the last date.</p>`;

  html += `<h3>Recruitment Summary:</h3>`;
  html += `<ul>`;
  html += `<li><strong>Organization:</strong> ${org}</li>`;
  html += `<li><strong>Post Name:</strong> ${title}</li>`;
  html += `<li><strong>Total Vacancies:</strong> ${vac}</li>`;
  html += `<li><strong>Job Location:</strong> ${state}</li>`;
  html += `<li><strong>Educational Qualification:</strong> ${qual}</li>`;
  html += `<li><strong>Last Date to Apply:</strong> ${lastDate}</li>`;
  html += `<li><strong>Application Mode:</strong> Online</li>`;
  html += `</ul>`;

  if (post.shortInfo) {
    html += `<p><strong>Short Information:</strong> ${post.shortInfo.replace(/<[^>]*>/g, '')}</p>`;
  }

  if (post.ageLimit && (post.ageLimit.minAge || post.ageLimit.maxAge)) {
    html += `<p><strong>Age Limit:</strong> Minimum Age: ${post.ageLimit.minAge || '18 Years'}, Maximum Age: ${post.ageLimit.maxAge || '35 Years'}. Age relaxation applicable as per government reservation rules.</p>`;
  }

  if (post.applicationFees && post.applicationFees.length > 0) {
    html += `<p><strong>Application Fee:</strong> `;
    html += post.applicationFees.map(f => `${f.category}: ${f.fee}`).join(' | ');
    html += `</p>`;
  }

  if (post.howToApplySteps && post.howToApplySteps.length > 0) {
    html += `<h3>How to Apply Online Step-by-Step:</h3><ol>`;
    post.howToApplySteps.forEach(step => {
      html += `<li>${step.replace(/<[^>]*>/g, '')}</li>`;
    });
    html += `</ol>`;
  }

  return html;
}

function extractSalaryMonetaryAmount(post: Post) {
  const textContent = `${post.shortInfo || ''} ${post.fullDescription || ''} ${JSON.stringify(post.vacancies || [])}`;
  const match = textContent.match(/(?:Rs\.?|INR|Pay Scale|Salary|Pay Level)[\s\:\-]*([0-9,]{4,})\s*(?:to|\-|\b)\s*([0-9,]{4,})?/i);
  if (match && match[1]) {
    const minVal = parseInt(match[1].replace(/,/g, ''), 10);
    const maxVal = match[2] ? parseInt(match[2].replace(/,/g, ''), 10) : minVal * 2;
    if (!isNaN(minVal) && minVal >= 5000) {
      return {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": minVal,
          "maxValue": maxVal > minVal ? maxVal : minVal * 2,
          "unitText": "MONTH"
        }
      };
    }
  }
  return undefined;
}

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
      titleToSet = generateHighCtrTitle(post);
      descriptionToSet = generateHighCtrDescription(post);
      keywordsToSet = post.keywords && post.keywords.length > 0 ? post.keywords.join(', ') : `${cleanTitleText(post.title)}, Sarkari Result 2026, Direct Link, Merit List, Cut Off Marks, ${post.organization || ''}`;
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
    // 4. Utility / Dedicated Tool Pages
    else if (cleanPath.includes('salary-calculator')) {
      titleToSet = "7th Pay Sarkari Salary Calculator 2026 (In-Hand Pay, DA 53%, HRA) | Pariksha Result";
      descriptionToSet = "Calculate exact 7th Pay Commission government job in-hand salary, basic pay, DA at 53%, HRA by city category (X, Y, Z), and NPS deductions for central & state govt employees.";
      keywordsToSet = "Sarkari Salary Calculator 2026, 7th Pay Salary Calculator, In Hand Salary Calculator, Basic Pay Level 1 to 14, DA 53 Percent, HRA Rate City X Y Z, Govt Job Salary Breakdown";
      canonicalUrl = `${baseUrl}/tools/sarkari-salary-calculator`;
    } else if (cleanPath.includes('cut-off-predictor') || cleanPath.includes('cutoff-predictor')) {
      titleToSet = "Sarkari Exam Cut-Off Marks & Selection Chance Predictor 2026 | Pariksha Result";
      descriptionToSet = "Predict your selection chances and check 3-year historical cut-off marks for SSC CGL, SSC GD, Railway RPF, RRB ALP, UP Police, REET, and IBPS PO exams.";
      keywordsToSet = "Exam Cut Off Predictor 2026, Sarkari Cut Off Marks, SSC CGL Tier 1 Expected Cutoff, SSC GD Safe Score, Railway RPF SI Cut Off, Selection Chance Calculator";
      canonicalUrl = `${baseUrl}/tools/exam-cut-off-predictor`;
    } else if (cleanPath.includes('syllabus-checklist') || cleanPath.includes('syllabus-tracker')) {
      titleToSet = "Sarkari Exam Syllabus Checklist & Progress Tracker 2026 | Pariksha Result";
      descriptionToSet = "Track your subject-wise exam preparation progress topic by topic for SSC, Railway RPF, Bank, and State Police Constable exams with interactive progress percentages.";
      keywordsToSet = "Sarkari Syllabus Checklist 2026, Exam Prep Progress Tracker, Subject Wise Syllabus Checklist, SSC CGL Math Syllabus, Reasoning Topics Tracker, Science Syllabus PDF";
      canonicalUrl = `${baseUrl}/tools/syllabus-checklist`;
    } else if (cleanPath.includes('age-calculator')) {
      titleToSet = "Sarkari Job Age Calculator 2026 (Exact Age in Years, Months, Days) | Pariksha Result";
      descriptionToSet = "Calculate your exact age as on cutoff date for government job online applications, exams, and eligibility criteria checks.";
      keywordsToSet = "Sarkari Age Calculator Tool 2026, Govt Job Eligibility Age Calculator, Age as on Cutoff Date, Years Months Days Age Calculator";
      canonicalUrl = `${baseUrl}/tools/age-calculator`;
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
    const imageUrl = post?.heroImage || post?.image || post?.thumbnail || `${baseUrl}/android-chrome-512x512.png`;
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

    // Structured Data (JSON-LD Injection for Google Rich Snippets)
    if (post) {
      const cleanTitle = cleanTitleText(post.title);
      const isJobPost = post.category === 'latest-jobs' || Boolean(post.totalVacancies) || (post.vacancies && post.vacancies.length > 0);

      // 1. DYNAMIC JobPosting SCHEMA (Google Jobs Rich Snippet Compliant)
      if (isJobPost) {
        const qualificationStr = Array.isArray(post.qualificationRequired) && post.qualificationRequired.length > 0
          ? post.qualificationRequired.join(', ')
          : (post.qualificationRequired || "10th / 12th / ITI / Diploma / Graduation / Post Graduation");

        const jobPostingSchema: Record<string, any> = {
          "@context": "https://schema.org",
          "@type": "JobPosting",
          "title": cleanTitle,
          "description": generateJobPostingHtmlDescription(post),
          "identifier": {
            "@type": "PropertyValue",
            "name": post.organization || "Government Recruitment Authority",
            "value": post.id || post.slug
          },
          "datePosted": formatIsoDate(post.postDate || post.publishedAt || post.syncedAt, 0),
          "validThrough": formatIsoDate(post.lastDate, 90),
          "employmentType": "FULL_TIME",
          "hiringOrganization": {
            "@type": "Organization",
            "name": post.organization || "Government Department / Exam Authority",
            "sameAs": post.sourceUrl || baseUrl,
            "logo": `${baseUrl}/android-chrome-512x512.png`
          },
          "jobLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": post.organization || "Government Exam Authority",
              "addressLocality": post.state && post.state !== 'All India' ? post.state : "New Delhi",
              "addressRegion": post.state || "All India",
              "postalCode": "110001",
              "addressCountry": "IN"
            }
          },
          "applicantLocationRequirements": {
            "@type": "Country",
            "name": "IN"
          },
          "totalVacancies": typeof post.totalVacancies === 'number' ? post.totalVacancies : (parseInt(String(post.totalVacancies || '1')) || 1),
          "directApply": true,
          "educationRequirements": {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": qualificationStr
          },
          "url": canonicalUrl,
          "mainEntityOfPage": canonicalUrl
        };

        const salaryObj = extractSalaryMonetaryAmount(post);
        if (salaryObj) {
          jobPostingSchema["baseSalary"] = salaryObj;
        }

        setJsonLdScript('seo-schema-job', jobPostingSchema);
      } else {
        removeScript('seo-schema-job');
      }

      // 2. DYNAMIC NewsArticle / Article SCHEMA
      const isNewsArticle = post.category === 'current-affairs' || post.category === 'results' || post.category === 'admit-card' || post.category === 'answer-key';
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": isNewsArticle ? "NewsArticle" : "Article",
        "headline": cleanTitle,
        "description": generateHighCtrDescription(post),
        "image": [
          imageUrl
        ],
        "datePublished": formatIsoDate(post.postDate || post.publishedAt || post.syncedAt, 0),
        "dateModified": formatIsoDate(post.syncedAt || post.postDate || post.publishedAt, 0),
        "author": {
          "@type": "Organization",
          "name": post.organization || "Pariksha Result Editorial Team",
          "url": baseUrl
        },
        "publisher": {
          "@type": "Organization",
          "name": "Pariksha Result",
          "url": baseUrl,
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/android-chrome-512x512.png`
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonicalUrl
        }
      };
      setJsonLdScript('seo-schema-article', articleSchema);

      // 3. DYNAMIC FAQPage SCHEMA (High CTR Rich Search Snippets)
      const faqsList = getOrCreatePostFaqs(post);
      if (faqsList && faqsList.length > 0) {
        const faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqsList.map((faq) => ({
            "@type": "Question",
            "name": faq.question.replace(/<[^>]*>/g, '').trim(),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer.replace(/<[^>]*>/g, '').trim()
            }
          }))
        };
        setJsonLdScript('seo-schema-faq', faqSchema);
      } else {
        removeScript('seo-schema-faq');
      }

      // 4. DYNAMIC BreadcrumbList SCHEMA
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": `${baseUrl}/` },
          { "@type": "ListItem", "position": 2, "name": (post.category || 'latest-jobs').toUpperCase().replace(/-/g, ' '), "item": `${baseUrl}/${post.category}` },
          { "@type": "ListItem", "position": 3, "name": cleanTitle, "item": canonicalUrl }
        ]
      };
      setJsonLdScript('seo-schema-breadcrumb', breadcrumbSchema);

      // Clean default main website schema when on post detail view
      removeScript('seo-schema-main');

    } else {
      // Home / Category Page WebSite Schema
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
      removeScript('seo-schema-job');
      removeScript('seo-schema-article');
      removeScript('seo-schema-breadcrumb');
      removeScript('seo-schema-faq');
    }

  }, [post, activeCategory, pathname, selectedState]);

  return null;
};
