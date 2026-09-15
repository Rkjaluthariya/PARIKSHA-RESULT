import { Post, CategoryType, FAQItem } from '../types';
import { cleanTitleText } from './imageGenerator';

/**
 * Generate High-CTR "Click-Magnet" SEO Meta Titles for Google Search
 * Incorporates high-intent keywords: Out/Declared, Direct Link, PDF Download, Cut Off, 2026
 */
export function generateHighCtrTitle(post: Post): string {
  const cleanTitle = cleanTitleText(post.title || '').trim();
  const year = '2026';

  // If the user already provided an explicit custom metaTitle with power words, use it
  if (post.metaTitle && (post.metaTitle.includes('Direct Link') || post.metaTitle.includes('Out') || post.metaTitle.includes('PDF'))) {
    return post.metaTitle;
  }

  const category = post.category || 'latest-jobs';

  switch (category) {
    case 'results':
      return `${cleanTitle} Result ${year} Out: Check Merit List PDF, Cut Off Marks & Direct Link`;
    case 'admit-card':
      return `${cleanTitle} Admit Card ${year} (Direct Link): Download Hall Ticket & Exam Center Slip`;
    case 'latest-jobs':
      return post.totalVacancies
        ? `${cleanTitle} Recruitment ${year}: Apply Online for ${post.totalVacancies} Posts, Eligibility & Notification PDF`
        : `${cleanTitle} Online Form ${year} Active: Apply Online, Eligibility & Official Notification PDF`;
    case 'answer-key':
      return `${cleanTitle} Answer Key ${year} Released: Download Question Paper PDF & Response Sheet Link`;
    case 'syllabus':
      return `${cleanTitle} Syllabus & Exam Pattern ${year} PDF Download: Subject-Wise Marks & Scheme`;
    case 'admissions':
      return `${cleanTitle} Admission ${year}: Online Form, Entrance Exam Date, Eligibility & Apply Link`;
    case 'scholarships':
      return `${cleanTitle} Scholarship ${year}: Apply Online Form, Eligibility, Amount & Status Check`;
    case 'government-schemes':
      return `${cleanTitle} Yojana ${year}: Check Beneficiary List, Eligibility & Online Registration Form`;
    case 'current-affairs':
      return `${cleanTitle}: Daily Current Affairs & GK Quiz for Sarkari Exams`;
    case 'quiz':
      return `${cleanTitle}: Free Online Mock Test & Practice Questions with Solutions`;
    case 'blog':
      return `${cleanTitle} - Preparation Tips, Cut Off Analysis & Complete Guide`;
    default:
      return `${cleanTitle} ${year} | Official Notification, Direct Link & Updates - Pariksha Result`;
  }
}

/**
 * Generate High-CTR Meta Description for Google Search
 * Focuses on direct answers, eligibility, key dates, vacancies, and clear call-to-action
 */
export function generateHighCtrDescription(post: Post): string {
  const cleanTitle = cleanTitleText(post.title || '').trim();
  const org = post.organization || 'Official Department';
  const vacancies = post.totalVacancies ? `for ${post.totalVacancies} vacancies` : '';
  const lastDate = post.lastDate ? `Last Date: ${post.lastDate}.` : '';

  switch (post.category) {
    case 'results':
      return `${cleanTitle} Result 2026 has been announced by ${org}. Download Scorecard, Category-wise Cut Off Marks, and Selection Merit List PDF through direct active link here.`;
    case 'admit-card':
      return `${cleanTitle} Admit Card 2026 / Hall Ticket is now live. Check your exam date, shift timings, roll number and download call letter city intimation slip directly.`;
    case 'latest-jobs':
      return `${org} invites online applications for ${cleanTitle} ${vacancies}. Check age limit, educational qualification, salary pay scale, fee details & apply online before last date. ${lastDate}`;
    case 'answer-key':
      return `Download official ${cleanTitle} Answer Key 2026 and response sheet PDF. Verify question paper solutions, calculate expected marks and submit online objections before due date.`;
    case 'syllabus':
      return `Get complete ${cleanTitle} Syllabus 2026 and exam pattern in Hindi/English PDF. Check section-wise marks weightage, negative marking rules and recommended preparation strategy.`;
    case 'admissions':
      return `${cleanTitle} Admission 2026 registration opened by ${org}. Check eligibility criteria, entrance test syllabus, seat matrix, counseling schedule & submit online form here.`;
    case 'scholarships':
      return `Apply online for ${cleanTitle} Scholarship 2026. Check income eligibility, required documents, scholarship amount benefits, and application tracking status.`;
    case 'government-schemes':
      return `${cleanTitle} (Sarkari Yojana 2026): Check new beneficiary list name, financial benefits, required eligibility criteria & step-by-step registration process.`;
    default:
      return post.shortInfo || post.metaDescription || `Get latest official updates for ${cleanTitle} 2026 by ${org}. Check notification PDF, direct links, eligibility, and step-by-step guide on Pariksha Result.`;
  }
}

/**
 * Generates 4-6 smart structured FAQs for any exam/post if missing
 * Ensures rich schema microdata on Google Search
 */
export function getOrCreatePostFaqs(post: Post): FAQItem[] {
  if (post.faqs && post.faqs.length > 0) {
    return post.faqs;
  }

  const cleanTitle = cleanTitleText(post.title || '');
  const org = post.organization || 'Department Authority';
  const year = '2026';
  const qualificationStr = post.qualificationRequired && post.qualificationRequired.length > 0
    ? post.qualificationRequired.join(', ')
    : ((post as any).qualification || '');

  const defaultFaqs: FAQItem[] = [];

  if (post.category === 'results') {
    defaultFaqs.push(
      {
        question: `When was ${cleanTitle} Result ${year} released?`,
        answer: `${cleanTitle} Result has been officially announced. Candidates can check their scorecard and qualifying status directly on the official portal or through Pariksha Result direct links.`,
      },
      {
        question: `How can I download the ${cleanTitle} Merit List PDF and Cut Off marks?`,
        answer: `Visit the official website or click the direct 'Download Result / Merit List' button on this page. Search your Roll Number or Registration Number in the PDF to check selection status.`,
      },
      {
        question: `What details are required to check ${cleanTitle} Scorecard?`,
        answer: `You will need your Registration ID / Application Number and Date of Birth (Password) along with the captcha code to log in and view your marks.`,
      },
      {
        question: `What is the next stage after qualifying ${cleanTitle}?`,
        answer: `Shortlisted candidates will be invited for Document Verification (DV), Physical Test, or Next Phase Interview depending on the official recruitment selection rules.`,
      }
    );
  } else if (post.category === 'admit-card') {
    defaultFaqs.push(
      {
        question: `How to download ${cleanTitle} Admit Card ${year}?`,
        answer: `Click on the 'Download Admit Card / Hall Ticket' link on this page, enter your Application Number and Date of Birth, and print 2 colored copies for the examination hall.`,
      },
      {
        question: `What documents are required to carry with ${cleanTitle} Hall Ticket?`,
        answer: `Candidates must carry a printed copy of the Admit Card, original Photo ID proof (Aadhar Card/Voter ID/PAN Card), two passport-size photos, and adhere to exam center reporting time.`,
      },
      {
        question: `What should I do if there is a mistake in my ${cleanTitle} Admit Card?`,
        answer: `Immediately contact the ${org} helpline or examination authority helpdesk with your registration receipt for correction before the exam date.`,
      }
    );
  } else if (post.category === 'latest-jobs') {
    defaultFaqs.push(
      {
        question: `What is the last date to apply online for ${cleanTitle} Recruitment ${year}?`,
        answer: post.lastDate
          ? `The last date to submit online application form for ${cleanTitle} is ${post.lastDate}. Candidates are advised to apply early to avoid last-minute server rush.`
          : `Please check the official notification dates above and submit your application before the closing deadline.`,
      },
      {
        question: `How many vacancies are released for ${cleanTitle}?`,
        answer: post.totalVacancies
          ? `A total of ${post.totalVacancies} vacancies have been notified by ${org} for this recruitment.`
          : `Various posts and vacancies have been announced. Please refer to the vacancy distribution table above.`,
      },
      {
        question: `What is the educational qualification and age limit for ${cleanTitle}?`,
        answer: qualificationStr
          ? `Educational Qualification: ${qualificationStr}. Age limits and category relaxations are as per government reservation rules.`
          : `Candidates should fulfill the minimum educational qualification and age criteria specified in the official notification.`,
      },
      {
        question: `How to apply online for ${cleanTitle}?`,
        answer: `1. Visit the official portal or click 'Apply Online' on this page.\n2. Complete New User Registration.\n3. Fill in personal & academic details.\n4. Upload photograph & signature.\n5. Pay the application fee and print the final confirmation page.`,
      }
    );
  } else if (post.category === 'answer-key') {
    defaultFaqs.push(
      {
        question: `How to check official ${cleanTitle} Answer Key ${year}?`,
        answer: `Click on the 'Download Answer Key & Response Sheet' direct link provided above, log in with your credentials, and cross-verify your marked answers against the official key.`,
      },
      {
        question: `How can I challenge or submit objection against ${cleanTitle} Answer Key?`,
        answer: `Candidates can raise online objections through the official portal objection link by selecting the question ID, submitting valid proof/reference, and paying the prescribed fee per question before the deadline.`,
      }
    );
  } else {
    defaultFaqs.push(
      {
        question: `What is the official source of information for ${cleanTitle}?`,
        answer: `All information for ${cleanTitle} is verified from official notifications published by ${org} and verified government portals.`,
      },
      {
        question: `How do I stay updated with latest notifications for ${cleanTitle}?`,
        answer: `You can join our Official Telegram Channel (@pariksha_result_official) to receive instant notifications on your mobile.`,
      }
    );
  }

  return defaultFaqs;
}

