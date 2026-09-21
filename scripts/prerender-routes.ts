import fs from 'fs';
import path from 'path';
import { INITIAL_POSTS, INITIAL_CURRENT_AFFAIRS } from '../src/data/mockPosts';
import { generateHighCtrTitle, generateHighCtrDescription, getOrCreatePostFaqs } from '../src/utils/highCtrSeo';
import { cleanTitleText } from '../src/utils/imageGenerator';

const BASE_URL = 'https://pariksha-result.vercel.app';
const distDir = path.join(process.cwd(), 'dist');
const templatePath = path.join(distDir, 'index.html');

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const CATEGORY_META: Record<string, { title: string; description: string; name: string }> = {
  'latest-jobs': {
    name: 'Latest Jobs',
    title: 'Latest Sarkari Jobs 2026 - Online Form & Government Vacancies | Pariksha Result',
    description: 'Explore latest government jobs (Sarkari Naukri), recruitment notifications, online application forms, eligibility criteria & direct links on Pariksha Result.'
  },
  'admit-card': {
    name: 'Admit Card',
    title: 'Sarkari Exam Admit Card & Hall Ticket 2026 Download | Pariksha Result',
    description: 'Download official admit cards, exam hall tickets, call letters, and exam center city slips for SSC, UPSC, Railway, Police, Banking & State Exams.'
  },
  'results': {
    name: 'Sarkari Result',
    title: 'Sarkari Result 2026 - Latest Exam Results & Merit Lists | Pariksha Result',
    description: 'Check Sarkari Exam Results, merit lists, score cards, cut-off marks, and selection lists for all central and state government recruitment exams.'
  },
  'answer-key': {
    name: 'Answer Key',
    title: 'Official Answer Key, Question Paper & Objection Link 2026 | Pariksha Result',
    description: 'Download official answer keys, question papers, response sheets, and submit online objections for all Sarkari exams.'
  },
  'syllabus': {
    name: 'Syllabus',
    title: 'Exam Syllabus & Selection Exam Pattern 2026 PDF Download | Pariksha Result',
    description: 'Download detailed syllabus PDF, exam pattern, subject-wise marks distribution, and preparation guide for government exams.'
  },
  'admissions': {
    name: 'Admissions',
    title: 'Admission Online Forms, Entrance Exam & Counseling 2026 | Pariksha Result',
    description: 'Apply online for university admissions, entrance tests (JNVST, NTA, CUET, NEET, JEE, Polytechnic, ITI), and counseling schedules.'
  },
  'scholarships': {
    name: 'Scholarships',
    title: 'National & State Scholarships Online Form 2026 | Pariksha Result',
    description: 'Find Pre-Matric, Post-Matric, Higher Education & Merit-cum-Means scholarship schemes, eligibility, and direct application links on NSP.'
  },
  'government-schemes': {
    name: 'Government Schemes',
    title: 'Government Schemes (Sarkari Yojana) 2026: Apply Online & Beneficiary List | Pariksha Result',
    description: 'Latest welfare schemes, subsidy programs, financial assistance, and online application guidelines for central and state government schemes.'
  },
  'current-affairs': {
    name: 'Current Affairs',
    title: 'Daily Current Affairs 2026 in Hindi & English (दैनिक समसामयिकी) | Pariksha Result',
    description: 'Read daily national and international current affairs, monthly capsules, one-liner GK, and quiz questions for UPSC, SSC, Banking & Railway exams.'
  },
  'quiz': {
    name: 'Mock Tests & Quiz',
    title: 'Daily Online Quiz & Free Mock Tests 2026 (GK, Current Affairs) | Pariksha Result',
    description: 'Practice free online mock tests, daily GK quizzes, current affairs tests, and competitive exam questions with instant score and answer key.'
  },
  'blog': {
    name: 'Sarkari Blog & Guidance',
    title: 'Sarkari Exam Tips, Study Materials & Career Guidance | Pariksha Result Blog',
    description: 'Expert tips, preparation blueprints, interview guidance, and exam analysis for cracking competitive government exams.'
  }
};

const STATE_NAMES: Record<string, string> = {
  'uttar-pradesh': 'Uttar Pradesh (UP)',
  'bihar': 'Bihar',
  'rajasthan': 'Rajasthan',
  'madhya-pradesh': 'Madhya Pradesh (MP)',
  'delhi': 'Delhi (NCT)',
  'haryana': 'Haryana',
  'maharashtra': 'Maharashtra',
  'west-bengal': 'West Bengal',
  'all-india': 'All India / Central Government'
};

const TOOLS_META: Record<string, { title: string; description: string; name: string }> = {
  'photo-signature-resizer': {
    name: 'Online Photo & Signature Resizer',
    title: 'Sarkari Photo & Signature Resizer (20KB - 50KB KB Converter) | Pariksha Result',
    description: 'Easily resize passport photos, signatures, and thumb impressions to exact KB and pixel dimensions for SSC, UPSC, Railway, and State Exam online application forms.'
  },
  'exam-rank-predictor': {
    name: 'Sarkari Exam Rank Predictor',
    title: 'Sarkari Exam Rank Predictor 2026: Calculate All India Rank & Percentile | Pariksha Result',
    description: 'Predict your expected All India Rank (AIR), category rank, and qualifying percentile based on your raw exam marks and category.'
  },
  'sarkari-salary-calculator': {
    name: '7th Pay Commission Salary Calculator',
    title: '7th Pay Commission Sarkari Salary Calculator 2026: In-Hand Pay & Allowances | Pariksha Result',
    description: 'Calculate in-hand net salary, gross pay, DA (Dearness Allowance), HRA, and NPS deductions for Pay Level 1 to 14 government employees.'
  },
  'exam-cut-off-predictor': {
    name: 'Exam Cut Off Marks Predictor',
    title: 'Expected Exam Cut Off Marks Predictor 2026: Safe Score Analysis | Pariksha Result',
    description: 'Analyze category-wise expected cut off marks (General, OBC, EWS, SC, ST) and safe scores for major competitive exams.'
  },
  'syllabus-checklist': {
    name: 'Syllabus Checklist Tracker',
    title: 'Interactive Syllabus Checklist & Revision Tracker 2026 | Pariksha Result',
    description: 'Track your subject-wise syllabus completion progress, mark topics completed, and schedule revisions with the interactive tracker.'
  },
  'age-calculator': {
    name: 'Sarkari Job Age Calculator',
    title: 'Sarkari Job Age Calculator as on Cutoff Date (Years, Months, Days) | Pariksha Result',
    description: 'Calculate your exact age in years, months, and days as on the official recruitment notification cutoff date.'
  }
};

function generatePostHtmlBody(post: any, canonicalUrl: string): string {
  const cleanTitle = cleanTitleText(post.title || '');
  const org = post.organization || 'Government Department / Exam Authority';
  const state = post.state || 'All India';
  const vac = post.totalVacancies ? `${post.totalVacancies}` : 'Various Posts';
  const postDate = post.postDate || '2026-09-15';
  const lastDate = post.lastDate || 'As per notification';
  const shortInfo = (post.shortInfo || '').replace(/<[^>]*>/g, '');
  const faqs = getOrCreatePostFaqs(post);

  let qualStr = 'As per official recruitment rules';
  if (Array.isArray(post.qualificationRequired) && post.qualificationRequired.length > 0) {
    qualStr = post.qualificationRequired.join(', ');
  } else if (typeof post.qualificationRequired === 'string' && post.qualificationRequired.trim()) {
    qualStr = post.qualificationRequired;
  }

  let importantDatesRows = '';
  if (Array.isArray(post.importantDates) && post.importantDates.length > 0) {
    importantDatesRows = post.importantDates.map((d: any) => `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 10px 12px; font-weight: 600; color: #1E293B;">${escapeHtml(d.event || '')}</td>
        <td style="padding: 10px 12px; color: ${d.isImportant ? '#DC2626' : '#2563EB'}; font-weight: 700;">${escapeHtml(d.date || '')}</td>
      </tr>
    `).join('');
  } else {
    importantDatesRows = `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 10px 12px; font-weight: 600; color: #1E293B;">Application Start Date</td>
        <td style="padding: 10px 12px; color: #2563EB; font-weight: 700;">Available in Notification</td>
      </tr>
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 10px 12px; font-weight: 600; color: #1E293B;">Last Date to Apply</td>
        <td style="padding: 10px 12px; color: #DC2626; font-weight: 700;">${escapeHtml(lastDate)}</td>
      </tr>
    `;
  }

  let applicationFeesRows = '';
  if (Array.isArray(post.applicationFees) && post.applicationFees.length > 0) {
    applicationFeesRows = post.applicationFees.map((f: any) => `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 10px 12px; font-weight: 600; color: #1E293B;">${escapeHtml(f.category || '')}</td>
        <td style="padding: 10px 12px; color: #047857; font-weight: 700;">${escapeHtml(f.fee || '')}</td>
      </tr>
    `).join('');
  } else {
    applicationFeesRows = `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 10px 12px; font-weight: 600; color: #1E293B;">General / OBC / EWS</td>
        <td style="padding: 10px 12px; color: #047857; font-weight: 700;">₹ 0/- to ₹ 600/- (As per rules)</td>
      </tr>
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 10px 12px; font-weight: 600; color: #1E293B;">SC / ST / PH</td>
        <td style="padding: 10px 12px; color: #047857; font-weight: 700;">Exempted / Concessional</td>
      </tr>
    `;
  }

  let vacanciesRows = '';
  if (Array.isArray(post.vacancies) && post.vacancies.length > 0) {
    vacanciesRows = post.vacancies.map((v: any) => `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 10px 12px; font-weight: 600; color: #1E293B;">${escapeHtml(v.postName || cleanTitle)}</td>
        <td style="padding: 10px 12px; font-weight: 700; color: #2563EB;">${escapeHtml(String(v.totalPosts || vac))}</td>
        <td style="padding: 10px 12px; color: #475569;">${escapeHtml(v.eligibility || qualStr)}</td>
      </tr>
    `).join('');
  } else {
    vacanciesRows = `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 10px 12px; font-weight: 600; color: #1E293B;">${escapeHtml(cleanTitle)}</td>
        <td style="padding: 10px 12px; font-weight: 700; color: #2563EB;">${escapeHtml(vac)}</td>
        <td style="padding: 10px 12px; color: #475569;">${escapeHtml(qualStr)}</td>
      </tr>
    `;
  }

  let stepsList = '';
  if (Array.isArray(post.howToApplySteps) && post.howToApplySteps.length > 0) {
    stepsList = post.howToApplySteps.map((s: string) => `<li style="margin-bottom: 8px; line-height: 1.6;">${escapeHtml(s)}</li>`).join('');
  } else {
    stepsList = `
      <li style="margin-bottom: 8px;">Check the eligibility criteria and official notification details carefully.</li>
      <li style="margin-bottom: 8px;">Visit the official website or click the Direct Apply Online link below.</li>
      <li style="margin-bottom: 8px;">Fill in the online application form with valid details and contact number.</li>
      <li style="margin-bottom: 8px;">Upload scanned photograph, signature, and educational certificates in required formats.</li>
      <li style="margin-bottom: 8px;">Pay the examination fee via Net Banking, Debit Card, Credit Card, or UPI and print final receipt.</li>
    `;
  }

  let linksRows = '';
  if (Array.isArray(post.importantLinks) && post.importantLinks.length > 0) {
    linksRows = post.importantLinks.map((l: any) => `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 12px; font-weight: 700; color: #1E293B;">${escapeHtml(l.title || 'Official Link')}</td>
        <td style="padding: 12px; text-align: right;">
          <a href="${escapeHtml(l.url || '#')}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 8px 16px; background: #0F4C81; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 13px;">
            Click Here &rarr;
          </a>
        </td>
      </tr>
    `).join('');
  } else {
    linksRows = `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 12px; font-weight: 700; color: #1E293B;">Official Website</td>
        <td style="padding: 12px; text-align: right;">
          <a href="${canonicalUrl}" style="display: inline-block; padding: 8px 16px; background: #0F4C81; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 13px;">
            Visit Portal &rarr;
          </a>
        </td>
      </tr>
    `;
  }

  let faqsHtml = '';
  if (faqs && faqs.length > 0) {
    faqsHtml = `
      <section style="margin-top: 32px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
        <h2 style="font-size: 18px; color: #0F4C81; margin-top: 0; margin-bottom: 16px; border-bottom: 2px solid #CBD5E1; padding-bottom: 6px;">Frequently Asked Questions (FAQs)</h2>
        ${faqs.map((f: any) => `
          <div style="margin-bottom: 14px;">
            <h3 style="font-size: 15px; font-weight: 700; color: #1E293B; margin: 0 0 4px 0;">Q: ${escapeHtml(f.question)}</h3>
            <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.5;">Ans: ${escapeHtml(f.answer)}</p>
          </div>
        `).join('')}
      </section>
    `;
  }

  return `
    <header style="background: #0F4C81; color: #ffffff; padding: 20px 16px; text-align: center;">
      <a href="/" style="color: #ffffff; text-decoration: none; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Pariksha Result 2026</a>
      <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Official Sarkari Result, Online Form, Admit Card & Answer Key Portal</p>
    </header>

    <main style="max-width: 900px; margin: 0 auto; padding: 24px 16px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1E293B;">
      <!-- Breadcrumbs -->
      <nav style="font-size: 13px; color: #64748B; margin-bottom: 16px;">
        <a href="/" style="color: #0F4C81; text-decoration: none;">Home</a> &raquo;
        <a href="/${escapeHtml(post.category || 'latest-jobs')}" style="color: #0F4C81; text-decoration: none;">${escapeHtml(CATEGORY_META[post.category || 'latest-jobs']?.name || 'Latest Jobs')}</a> &raquo;
        <span style="color: #334155;">${escapeHtml(cleanTitle)}</span>
      </nav>

      <article style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <h1 style="font-size: 24px; line-height: 1.3; color: #0F4C81; margin-top: 0; margin-bottom: 12px; font-weight: 800;">
          ${escapeHtml(cleanTitle)}
        </h1>

        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; font-size: 12px;">
          <span style="background: #EFF6FF; color: #1D4ED8; padding: 4px 10px; border-radius: 6px; font-weight: 700;">🏢 ${escapeHtml(org)}</span>
          <span style="background: #F0FDF4; color: #15803D; padding: 4px 10px; border-radius: 6px; font-weight: 700;">📍 ${escapeHtml(state)}</span>
          <span style="background: #FEF3C7; color: #B45309; padding: 4px 10px; border-radius: 6px; font-weight: 700;">👥 ${escapeHtml(vac)} Vacancies</span>
          <span style="background: #F1F5F9; color: #475569; padding: 4px 10px; border-radius: 6px;">📅 Post Date: ${escapeHtml(postDate)}</span>
        </div>

        ${shortInfo ? `<div style="background: #F8FAFC; border-left: 4px solid #0F4C81; padding: 14px; margin-bottom: 24px; font-size: 14px; line-height: 1.6; color: #334155;">${escapeHtml(shortInfo)}</div>` : ''}

        <!-- Important Dates & Application Fee Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 24px;">
          <div style="border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;">
            <div style="background: #0F4C81; color: #ffffff; padding: 10px 14px; font-weight: 700; font-size: 15px;">🗓️ Important Dates</div>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tbody>
                ${importantDatesRows}
              </tbody>
            </table>
          </div>

          <div style="border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;">
            <div style="background: #0F4C81; color: #ffffff; padding: 10px 14px; font-weight: 700; font-size: 15px;">💳 Application Fee</div>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tbody>
                ${applicationFeesRows}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Age Limit -->
        <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 14px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 6px 0; font-size: 15px; color: #92400E; font-weight: 700;">🎯 Age Limit Criteria (as on cutoff date):</h3>
          <p style="margin: 0; font-size: 13px; color: #78350F; line-height: 1.5;">
            Minimum Age: <strong>${escapeHtml(post.ageLimit?.minAge || '18 Years')}</strong> | 
            Maximum Age: <strong>${escapeHtml(post.ageLimit?.maxAge || 'As per rules')}</strong>. 
            ${escapeHtml(post.ageLimit?.relaxationDetails || 'Age relaxation extra as per recruitment rules.')}
          </p>
        </div>

        <!-- Vacancy Details & Eligibility Table -->
        <div style="margin-bottom: 24px; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;">
          <div style="background: #0F4C81; color: #ffffff; padding: 10px 14px; font-weight: 700; font-size: 15px;">📋 Vacancy Details &amp; Eligibility Criteria</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #F1F5F9; border-bottom: 2px solid #CBD5E1; text-align: left;">
                <th style="padding: 10px 12px; color: #334155;">Post Name</th>
                <th style="padding: 10px 12px; color: #334155;">Total Posts</th>
                <th style="padding: 10px 12px; color: #334155;">Eligibility Qualification</th>
              </tr>
            </thead>
            <tbody>
              ${vacanciesRows}
            </tbody>
          </table>
        </div>

        <!-- How To Apply -->
        <div style="margin-bottom: 24px;">
          <h2 style="font-size: 18px; color: #0F4C81; margin-bottom: 12px; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px;">📝 How to Fill Online Application Form</h2>
          <ol style="padding-left: 20px; font-size: 14px; color: #334155; line-height: 1.6; margin: 0;">
            ${stepsList}
          </ol>
        </div>

        <!-- Important Direct Links Table -->
        <div style="margin-bottom: 24px; border: 2px solid #0F4C81; border-radius: 8px; overflow: hidden;">
          <div style="background: #0F4C81; color: #ffffff; padding: 12px 16px; font-weight: 800; font-size: 16px; text-align: center;">
            🔗 Important Useful Links &amp; Direct Actions
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tbody>
              ${linksRows}
            </tbody>
          </table>
        </div>

        ${faqsHtml}
      </article>

      <!-- Quick Category Navigation Footer -->
      <footer style="margin-top: 32px; text-align: center; font-size: 13px; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 20px;">
        <p style="margin-bottom: 8px;">Explore more on Pariksha Result 2026:</p>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;">
          <a href="/latest-jobs" style="color: #0F4C81; text-decoration: none; font-weight: 600;">Latest Jobs</a> &bull;
          <a href="/results" style="color: #0F4C81; text-decoration: none; font-weight: 600;">Results</a> &bull;
          <a href="/admit-card" style="color: #0F4C81; text-decoration: none; font-weight: 600;">Admit Card</a> &bull;
          <a href="/answer-key" style="color: #0F4C81; text-decoration: none; font-weight: 600;">Answer Key</a> &bull;
          <a href="/syllabus" style="color: #0F4C81; text-decoration: none; font-weight: 600;">Syllabus</a> &bull;
          <a href="/current-affairs" style="color: #0F4C81; text-decoration: none; font-weight: 600;">Current Affairs</a>
        </div>
      </footer>
    </main>
  `;
}

function generateCategoryHtmlBody(categoryKey: string, posts: any[]): string {
  const meta = CATEGORY_META[categoryKey] || {
    name: categoryKey,
    title: `${categoryKey} - Pariksha Result`,
    description: `Latest ${categoryKey} updates.`
  };

  const filtered = posts.filter(p => p.category === categoryKey || (categoryKey === 'latest-jobs' && !p.category));
  const postList = filtered.slice(0, 40);

  const listItems = postList.map(p => `
    <tr style="border-bottom: 1px solid #E2E8F0;">
      <td style="padding: 12px 14px;">
        <a href="/${escapeHtml(p.category || 'latest-jobs')}/${escapeHtml(p.slug || p.id)}" style="font-weight: 700; color: #0F4C81; text-decoration: none; font-size: 14px;">
          ${escapeHtml(cleanTitleText(p.title || ''))}
        </a>
        <div style="font-size: 12px; color: #64748B; margin-top: 3px;">
          🏢 ${escapeHtml(p.organization || 'Govt Department')} &bull; 📍 ${escapeHtml(p.state || 'All India')}
        </div>
      </td>
      <td style="padding: 12px 14px; font-weight: 700; color: #2563EB; font-size: 13px; white-space: nowrap;">
        ${escapeHtml(p.totalVacancies ? `${p.totalVacancies} Posts` : 'Check Post')}
      </td>
      <td style="padding: 12px 14px; text-align: right; white-space: nowrap;">
        <a href="/${escapeHtml(p.category || 'latest-jobs')}/${escapeHtml(p.slug || p.id)}" style="display: inline-block; padding: 6px 14px; background: #0F4C81; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 12px;">
          View Details &rarr;
        </a>
      </td>
    </tr>
  `).join('');

  return `
    <header style="background: #0F4C81; color: #ffffff; padding: 24px 16px; text-align: center;">
      <a href="/" style="color: #ffffff; text-decoration: none; font-size: 24px; font-weight: 800;">Pariksha Result 2026</a>
      <h1 style="margin: 8px 0 4px 0; font-size: 20px; font-weight: 700;">${escapeHtml(meta.name)}</h1>
      <p style="margin: 0; font-size: 13px; opacity: 0.9; max-width: 600px; margin: 0 auto;">${escapeHtml(meta.description)}</p>
    </header>

    <main style="max-width: 1000px; margin: 0 auto; padding: 24px 16px; font-family: system-ui, -apple-system, sans-serif; color: #1E293B;">
      <nav style="font-size: 13px; color: #64748B; margin-bottom: 16px;">
        <a href="/" style="color: #0F4C81; text-decoration: none;">Home</a> &raquo;
        <span style="color: #334155;">${escapeHtml(meta.name)}</span>
      </nav>

      <section style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="background: #F8FAFC; border-bottom: 2px solid #E2E8F0; padding: 12px 16px; font-weight: 800; color: #0F4C81; font-size: 15px;">
          Showing ${filtered.length} Active ${escapeHtml(meta.name)} Notifications
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            ${listItems || '<tr><td style="padding: 20px; text-align: center; color: #64748B;">No notifications available at this time.</td></tr>'}
          </tbody>
        </table>
      </section>
    </main>
  `;
}

function generateStateHtmlBody(stateSlug: string, posts: any[]): string {
  const stateName = STATE_NAMES[stateSlug] || stateSlug.replace(/-/g, ' ').toUpperCase();
  const filtered = posts.filter(p => (p.state || '').toLowerCase().includes(stateSlug.replace(/-/g, ' ')));

  const listItems = filtered.slice(0, 30).map(p => `
    <tr style="border-bottom: 1px solid #E2E8F0;">
      <td style="padding: 12px 14px;">
        <a href="/${escapeHtml(p.category || 'latest-jobs')}/${escapeHtml(p.slug || p.id)}" style="font-weight: 700; color: #0F4C81; text-decoration: none; font-size: 14px;">
          ${escapeHtml(cleanTitleText(p.title || ''))}
        </a>
        <div style="font-size: 12px; color: #64748B; margin-top: 3px;">
          🏢 ${escapeHtml(p.organization || 'State Department')} &bull; 👥 ${escapeHtml(p.totalVacancies ? `${p.totalVacancies} Posts` : 'Various')}
        </div>
      </td>
      <td style="padding: 12px 14px; text-align: right; white-space: nowrap;">
        <a href="/${escapeHtml(p.category || 'latest-jobs')}/${escapeHtml(p.slug || p.id)}" style="display: inline-block; padding: 6px 14px; background: #0F4C81; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 12px;">
          View &rarr;
        </a>
      </td>
    </tr>
  `).join('');

  return `
    <header style="background: #0F4C81; color: #ffffff; padding: 24px 16px; text-align: center;">
      <a href="/" style="color: #ffffff; text-decoration: none; font-size: 24px; font-weight: 800;">Pariksha Result 2026</a>
      <h1 style="margin: 8px 0 4px 0; font-size: 20px; font-weight: 700;">${escapeHtml(stateName)} Sarkari Jobs &amp; Results 2026</h1>
      <p style="margin: 0; font-size: 13px; opacity: 0.9;">Latest Government Recruitment, Police Bharti, Teacher Vacancy &amp; Results in ${escapeHtml(stateName)}</p>
    </header>

    <main style="max-width: 1000px; margin: 0 auto; padding: 24px 16px; font-family: system-ui, -apple-system, sans-serif;">
      <nav style="font-size: 13px; color: #64748B; margin-bottom: 16px;">
        <a href="/" style="color: #0F4C81; text-decoration: none;">Home</a> &raquo;
        <span style="color: #334155;">${escapeHtml(stateName)}</span>
      </nav>

      <section style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;">
        <div style="background: #F8FAFC; border-bottom: 2px solid #E2E8F0; padding: 12px 16px; font-weight: 800; color: #0F4C81; font-size: 15px;">
          Latest ${escapeHtml(stateName)} Government Job Notifications
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            ${listItems || '<tr><td style="padding: 20px; text-align: center; color: #64748B;">No state notifications found.</td></tr>'}
          </tbody>
        </table>
      </section>
    </main>
  `;
}

function generateToolHtmlBody(toolSlug: string, allPosts: any[]): string {
  const meta = TOOLS_META[toolSlug] || {
    name: toolSlug,
    title: `${toolSlug} - Pariksha Result`,
    description: 'Free Sarkari Exam Utility Tool.'
  };

  let specificToolContent = '';

  if (toolSlug === 'photo-signature-resizer') {
    specificToolContent = `
      <div style="text-align: left; margin-top: 24px;">
        <h3 style="color: #0F4C81; font-size: 18px; margin-bottom: 12px;">📌 Official Examination Photo &amp; Signature Dimensions Guide (2026)</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; border: 1px solid #CBD5E1;">
          <thead>
            <tr style="background: #F1F5F9; text-align: left;">
              <th style="padding: 10px; border: 1px solid #CBD5E1;">Exam Board</th>
              <th style="padding: 10px; border: 1px solid #CBD5E1;">Photo Size (KB)</th>
              <th style="padding: 10px; border: 1px solid #CBD5E1;">Photo Dimensions</th>
              <th style="padding: 10px; border: 1px solid #CBD5E1;">Signature Size (KB)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #CBD5E1; font-weight: 700;">SSC (CGL, CHSL, GD, MTS)</td>
              <td style="padding: 10px; border: 1px solid #CBD5E1; color: #166534; font-weight: 600;">20 KB to 50 KB</td>
              <td style="padding: 10px; border: 1px solid #CBD5E1;">3.5 cm x 4.5 cm (138x177 px)</td>
              <td style="padding: 10px; border: 1px solid #CBD5E1; color: #166534; font-weight: 600;">10 KB to 20 KB</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #CBD5E1; font-weight: 700;">UPSC (Civil Services, NDA, CDS)</td>
              <td style="padding: 10px; border: 1px solid #CBD5E1; color: #166534; font-weight: 600;">20 KB to 300 KB</td>
              <td style="padding: 10px; border: 1px solid #CBD5E1;">350 x 350 to 1000 x 1000 px</td>
              <td style="padding: 10px; border: 1px solid #CBD5E1; color: #166534; font-weight: 600;">20 KB to 300 KB</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #CBD5E1; font-weight: 700;">Railway RRB (NTPC, Group D, ALP)</td>
              <td style="padding: 10px; border: 1px solid #CBD5E1; color: #166534; font-weight: 600;">30 KB to 70 KB</td>
              <td style="padding: 10px; border: 1px solid #CBD5E1;">35 mm x 45 mm (JPEG)</td>
              <td style="padding: 10px; border: 1px solid #CBD5E1; color: #166534; font-weight: 600;">30 KB to 70 KB</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #CBD5E1; font-weight: 700;">IBPS / SBI (PO, Clerk, SO)</td>
              <td style="padding: 10px; border: 1px solid #CBD5E1; color: #166534; font-weight: 600;">20 KB to 50 KB</td>
              <td style="padding: 10px; border: 1px solid #CBD5E1;">200 x 230 Pixels</td>
              <td style="padding: 10px; border: 1px solid #CBD5E1; color: #166534; font-weight: 600;">10 KB to 20 KB</td>
            </tr>
          </tbody>
        </table>

        <h3 style="color: #0F4C81; font-size: 16px; margin-bottom: 8px;">📋 How to Resize Photo &amp; Signature Online for Sarkari Form:</h3>
        <ol style="font-size: 14px; line-height: 1.6; color: #334155; padding-left: 20px;">
          <li>Click the <strong>Choose File</strong> button and upload your passport size photo or scanned signature.</li>
          <li>Select the target file size (e.g. 20 KB to 50 KB for SSC, or enter custom KB).</li>
          <li>Set the width and height in pixels or centimeters if required by your exam board.</li>
          <li>Click <strong>Resize &amp; Compress</strong> to instantly download the 100% compliant image.</li>
        </ol>
      </div>
    `;
  } else if (toolSlug === 'sarkari-salary-calculator') {
    specificToolContent = `
      <div style="text-align: left; margin-top: 24px;">
        <h3 style="color: #0F4C81; font-size: 18px; margin-bottom: 12px;">📊 7th Pay Commission Salary Structure (Pay Matrix Level 1 to 14)</h3>
        <p style="font-size: 14px; color: #334155; line-height: 1.6;">
          Government salary in India is calculated based on the 7th Central Pay Commission (CPC) recommendations. Key salary components include:
        </p>
        <ul style="font-size: 14px; line-height: 1.6; color: #334155; padding-left: 20px;">
          <li><strong>Basic Pay:</strong> Base pay assigned to your Pay Band &amp; Grade Pay level.</li>
          <li><strong>Dearness Allowance (DA):</strong> Central Dearness Allowance rate (currently 50%+).</li>
          <li><strong>House Rent Allowance (HRA):</strong> Categorized by City Tier (X: 30%, Y: 20%, Z: 10%).</li>
          <li><strong>Transport Allowance (TPTA):</strong> Allowance with DA on TPTA for commuting.</li>
          <li><strong>Deductions:</strong> NPS (National Pension Scheme 10% of Basic + DA), CGEGIS, and Professional Tax.</li>
        </ul>
      </div>
    `;
  } else if (toolSlug === 'age-calculator') {
    specificToolContent = `
      <div style="text-align: left; margin-top: 24px;">
        <h3 style="color: #0F4C81; font-size: 18px; margin-bottom: 12px;">🎯 Sarkari Job Age Eligibility &amp; Cutoff Calculation Rules</h3>
        <p style="font-size: 14px; color: #334155; line-height: 1.6;">
          Most recruitment notifications specify a critical reference date (e.g. 01/01/2026 or 01/08/2026). This calculator computes your exact completed years, months, and days to verify your qualification without manual calculation errors.
        </p>
      </div>
    `;
  } else {
    specificToolContent = `
      <div style="text-align: left; margin-top: 24px;">
        <h3 style="color: #0F4C81; font-size: 18px; margin-bottom: 12px;">💡 About ${escapeHtml(meta.name)}</h3>
        <p style="font-size: 14px; color: #334155; line-height: 1.6;">
          This interactive tool is provided free of charge by Pariksha Result to help competitive exam aspirants calculate eligibility, analyze trends, track preparation, and complete online application forms effortlessly.
        </p>
      </div>
    `;
  }

  // Related Tools Navigation List
  const otherToolsList = Object.entries(TOOLS_META)
    .map(([slug, t]) => `<li><a href="/tools/${slug}" style="color: #0F4C81; text-decoration: none; font-weight: 600;">${escapeHtml(t.name)}</a></li>`)
    .join('');

  // Top Jobs Links
  const topJobs = allPosts.slice(0, 8).map(p => `
    <li><a href="/${escapeHtml(p.category || 'latest-jobs')}/${escapeHtml(p.slug || p.id)}" style="color: #0F4C81; text-decoration: none;">${escapeHtml(cleanTitleText(p.title || ''))}</a></li>
  `).join('');

  return `
    <header style="background: #0F4C81; color: #ffffff; padding: 24px 16px; text-align: center;">
      <a href="/" style="color: #ffffff; text-decoration: none; font-size: 24px; font-weight: 800;">Pariksha Result 2026</a>
      <h1 style="margin: 8px 0 4px 0; font-size: 22px; font-weight: 700;">${escapeHtml(meta.name)}</h1>
      <p style="margin: 0; font-size: 13px; opacity: 0.9; max-width: 650px; margin: 0 auto;">${escapeHtml(meta.description)}</p>
    </header>

    <main style="max-width: 950px; margin: 0 auto; padding: 24px 16px; font-family: system-ui, -apple-system, sans-serif;">
      <nav style="font-size: 13px; color: #64748B; margin-bottom: 20px;">
        <a href="/" style="color: #0F4C81; text-decoration: none;">Home</a> &raquo;
        <a href="/tools/photo-signature-resizer" style="color: #0F4C81; text-decoration: none;">Candidate Tools</a> &raquo;
        <span style="color: #334155;">${escapeHtml(meta.name)}</span>
      </nav>

      <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 24px;">
        <h2 style="font-size: 20px; color: #0F4C81; margin-top: 0;">${escapeHtml(meta.name)} (Online Interactive Tool)</h2>
        <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 16px;">
          ${escapeHtml(meta.description)}
        </p>
        
        <div style="padding: 16px; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; color: #1E40AF; font-size: 13px; margin-bottom: 20px;">
          🚀 <strong>Interactive Tool Active:</strong> Select your files or options above to compute results in real-time.
        </div>

        ${specificToolContent}
      </div>

      <!-- Quick Navigation Matrix -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px;">
          <h4 style="margin: 0 0 10px 0; color: #0F4C81; font-size: 15px;">🛠️ All Free Candidate Tools</h4>
          <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.8;">
            ${otherToolsList}
          </ul>
        </div>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px;">
          <h4 style="margin: 0 0 10px 0; color: #0F4C81; font-size: 15px;">🔥 Latest Trending Recruitment</h4>
          <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.8;">
            ${topJobs}
          </ul>
        </div>
      </div>

      <footer style="margin-top: 32px; text-align: center; font-size: 13px; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 20px;">
        <a href="/" style="color: #0F4C81; font-weight: 700; text-decoration: none;">&larr; Back to Pariksha Result Home</a> |
        <a href="/sitemap" style="color: #0F4C81; font-weight: 600; text-decoration: none;">HTML Sitemap</a> |
        <a href="/latest-jobs" style="color: #0F4C81; font-weight: 600; text-decoration: none;">Latest Jobs</a>
      </footer>
    </main>
  `;
}

function writeStaticHtml(relativeRoute: string, htmlContent: string) {
  // e.g. /latest-jobs/ssc-cgl-2026 -> dist/latest-jobs/ssc-cgl-2026/index.html & dist/latest-jobs/ssc-cgl-2026.html
  const cleanRoute = relativeRoute.replace(/^\/+/, '').replace(/\/+$/, '');
  const dirPath = path.join(distDir, cleanRoute);
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // 1. Write as index.html inside the directory
  fs.writeFileSync(path.join(dirPath, 'index.html'), htmlContent, 'utf8');

  // 2. Also write as .html file in parent directory for cleanUrls support
  if (cleanRoute.includes('/')) {
    const parentDir = path.dirname(path.join(distDir, cleanRoute));
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(path.join(distDir, `${cleanRoute}.html`), htmlContent, 'utf8');
  }
}

export function prerenderAllRoutes() {
  if (!fs.existsSync(templatePath)) {
    console.error(`[Prerender] Error: Template ${templatePath} not found! Run 'vite build' first.`);
    return;
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf8');
  console.log(`[Prerender] Starting SSG Static Pre-rendering for search engine indexing...`);

  let count = 0;

  // 1. Pre-render All 220+ Individual Posts
  for (const post of INITIAL_POSTS) {
    if (!post) continue;
    const cat = (post.category || 'latest-jobs').trim();
    const slug = (post.slug || post.id || '').trim();
    if (!slug) continue;

    const route = `/${cat}/${slug}`;
    const canonicalUrl = `${BASE_URL}${route}`;
    const title = generateHighCtrTitle(post);
    const description = generateHighCtrDescription(post);
    const bodyHtml = generatePostHtmlBody(post, canonicalUrl);
    const faqs = getOrCreatePostFaqs(post);

    let pageHtml = baseHtml;

    // Replace Title
    pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/gi, `<title>${escapeHtml(title)}</title>`);

    // Replace Meta Description
    pageHtml = pageHtml.replace(/<meta name="description" content="[\s\S]*?"\s*\/?>/gi, `<meta name="description" content="${escapeHtml(description)}" />`);

    // Ensure Canonical Tag
    if (pageHtml.includes('rel="canonical"')) {
      pageHtml = pageHtml.replace(/<link rel="canonical" href="[\s\S]*?"\s*\/?>/gi, `<link rel="canonical" href="${canonicalUrl}" />`);
    } else {
      pageHtml = pageHtml.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
    }

    // Replace OpenGraph & Twitter
    pageHtml = pageHtml.replace(/<meta property="og:title" content="[\s\S]*?"\s*\/?>/gi, `<meta property="og:title" content="${escapeHtml(title)}" />`);
    pageHtml = pageHtml.replace(/<meta property="og:description" content="[\s\S]*?"\s*\/?>/gi, `<meta property="og:description" content="${escapeHtml(description)}" />`);
    pageHtml = pageHtml.replace(/<meta property="og:url" content="[\s\S]*?"\s*\/?>/gi, `<meta property="og:url" content="${canonicalUrl}" />`);

    // Inject JobPosting / Breadcrumb / FAQ Schema
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": BASE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": CATEGORY_META[cat]?.name || 'Latest Jobs',
          "item": `${BASE_URL}/${cat}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": cleanTitleText(post.title || ''),
          "item": canonicalUrl
        }
      ]
    };

    const jobPostingLd = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": cleanTitleText(post.title || ''),
      "description": description,
      "datePosted": (post.postDate || '2026-09-15') + 'T00:00:00+05:30',
      "validThrough": (post.lastDate && post.lastDate.includes('2026') ? '2026-12-31T23:59:59+05:30' : '2026-10-31T23:59:59+05:30'),
      "employmentType": "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": post.organization || 'Government Department',
        "sameAs": canonicalUrl
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": post.state || 'All India',
          "addressCountry": "IN"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": "21700 - 69100",
          "unitText": "MONTH"
        }
      }
    };

    let schemaInjections = `
    <script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>
    <script type="application/ld+json">${JSON.stringify(jobPostingLd)}</script>
    `;

    if (faqs && faqs.length > 0) {
      const faqLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      };
      schemaInjections += `\n    <script type="application/ld+json">${JSON.stringify(faqLd)}</script>`;
    }

    pageHtml = pageHtml.replace('</head>', `${schemaInjections}\n</head>`);

    // Inject semantic content into <div id="root">
    pageHtml = pageHtml.replace(/<div id="root">[\s\S]*?<\/div>\s*<script type="module"/i, `<div id="root">\n${bodyHtml}\n</div>\n    <script type="module"`);

    writeStaticHtml(route, pageHtml);
    count++;
  }

  // 2. Pre-render All Category Hub Pages
  for (const [catKey, catInfo] of Object.entries(CATEGORY_META)) {
    const route = `/${catKey}`;
    const canonicalUrl = `${BASE_URL}${route}`;
    const bodyHtml = generateCategoryHtmlBody(catKey, INITIAL_POSTS);

    let pageHtml = baseHtml;
    pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/gi, `<title>${escapeHtml(catInfo.title)}</title>`);
    pageHtml = pageHtml.replace(/<meta name="description" content="[\s\S]*?"\s*\/?>/gi, `<meta name="description" content="${escapeHtml(catInfo.description)}" />`);
    pageHtml = pageHtml.replace(/<meta property="og:title" content="[\s\S]*?"\s*\/?>/gi, `<meta property="og:title" content="${escapeHtml(catInfo.title)}" />`);
    pageHtml = pageHtml.replace(/<meta property="og:description" content="[\s\S]*?"\s*\/?>/gi, `<meta property="og:description" content="${escapeHtml(catInfo.description)}" />`);
    pageHtml = pageHtml.replace(/<meta property="og:url" content="[\s\S]*?"\s*\/?>/gi, `<meta property="og:url" content="${canonicalUrl}" />`);

    if (pageHtml.includes('rel="canonical"')) {
      pageHtml = pageHtml.replace(/<link rel="canonical" href="[\s\S]*?"\s*\/?>/gi, `<link rel="canonical" href="${canonicalUrl}" />`);
    } else {
      pageHtml = pageHtml.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
    }

    pageHtml = pageHtml.replace(/<div id="root">[\s\S]*?<\/div>\s*<script type="module"/i, `<div id="root">\n${bodyHtml}\n</div>\n    <script type="module"`);

    writeStaticHtml(route, pageHtml);
    count++;
  }

  // 3. Pre-render All State Hub Pages
  for (const stateSlug of Object.keys(STATE_NAMES)) {
    const route = `/state/${stateSlug}`;
    const canonicalUrl = `${BASE_URL}${route}`;
    const stateName = STATE_NAMES[stateSlug];
    const title = `${stateName} Sarkari Jobs & Results 2026 - Latest Notifications | Pariksha Result`;
    const description = `Find all latest government recruitment, police bharti, teacher jobs, admit cards, and results for ${stateName} on Pariksha Result.`;
    const bodyHtml = generateStateHtmlBody(stateSlug, INITIAL_POSTS);

    let pageHtml = baseHtml;
    pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/gi, `<title>${escapeHtml(title)}</title>`);
    pageHtml = pageHtml.replace(/<meta name="description" content="[\s\S]*?"\s*\/?>/gi, `<meta name="description" content="${escapeHtml(description)}" />`);
    pageHtml = pageHtml.replace(/<meta property="og:url" content="[\s\S]*?"\s*\/?>/gi, `<meta property="og:url" content="${canonicalUrl}" />`);

    if (pageHtml.includes('rel="canonical"')) {
      pageHtml = pageHtml.replace(/<link rel="canonical" href="[\s\S]*?"\s*\/?>/gi, `<link rel="canonical" href="${canonicalUrl}" />`);
    } else {
      pageHtml = pageHtml.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
    }

    pageHtml = pageHtml.replace(/<div id="root">[\s\S]*?<\/div>\s*<script type="module"/i, `<div id="root">\n${bodyHtml}\n</div>\n    <script type="module"`);

    writeStaticHtml(route, pageHtml);
    count++;
  }

  // 4. Pre-render All Candidate Tools
  for (const [toolSlug, toolInfo] of Object.entries(TOOLS_META)) {
    const route = `/tools/${toolSlug}`;
    const canonicalUrl = `${BASE_URL}${route}`;
    const bodyHtml = generateToolHtmlBody(toolSlug, INITIAL_POSTS);

    let pageHtml = baseHtml;
    pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/gi, `<title>${escapeHtml(toolInfo.title)}</title>`);
    pageHtml = pageHtml.replace(/<meta name="description" content="[\s\S]*?"\s*\/?>/gi, `<meta name="description" content="${escapeHtml(toolInfo.description)}" />`);
    pageHtml = pageHtml.replace(/<meta property="og:title" content="[\s\S]*?"\s*\/?>/gi, `<meta property="og:title" content="${escapeHtml(toolInfo.title)}" />`);
    pageHtml = pageHtml.replace(/<meta property="og:description" content="[\s\S]*?"\s*\/?>/gi, `<meta property="og:description" content="${escapeHtml(toolInfo.description)}" />`);
    pageHtml = pageHtml.replace(/<meta property="og:url" content="[\s\S]*?"\s*\/?>/gi, `<meta property="og:url" content="${canonicalUrl}" />`);

    if (pageHtml.includes('rel="canonical"')) {
      pageHtml = pageHtml.replace(/<link rel="canonical" href="[\s\S]*?"\s*\/?>/gi, `<link rel="canonical" href="${canonicalUrl}" />`);
    } else {
      pageHtml = pageHtml.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
    }

    pageHtml = pageHtml.replace(/<div id="root">[\s\S]*?<\/div>\s*<script type="module"/i, `<div id="root">\n${bodyHtml}\n</div>\n    <script type="module"`);

    writeStaticHtml(route, pageHtml);
    count++;
  }

  // 5. Pre-render HTML Sitemap (/sitemap)
  const sitemapRoute = `/sitemap`;
  const sitemapCanonical = `${BASE_URL}/sitemap`;
  const sitemapTitle = `Complete HTML Sitemap & Directory 2026 | Pariksha Result`;
  const sitemapDesc = `Browse the complete directory of Sarkari Result, Latest Jobs, Admit Cards, Answer Keys, State Hubs, and Candidate Tools on Pariksha Result.`;

  const toolsHtmlLinks = Object.entries(TOOLS_META).map(([slug, t]) => `
    <li style="margin-bottom: 6px;"><a href="/tools/${slug}" style="color: #0F4C81; text-decoration: none; font-weight: 600;">${escapeHtml(t.name)}</a></li>
  `).join('');

  const catHtmlLinks = Object.entries(CATEGORY_META).map(([slug, c]) => `
    <li style="margin-bottom: 6px;"><a href="/${slug}" style="color: #0F4C81; text-decoration: none; font-weight: 600;">${escapeHtml(c.name)}</a></li>
  `).join('');

  const stateHtmlLinks = Object.entries(STATE_NAMES).map(([slug, sName]) => `
    <li style="margin-bottom: 6px;"><a href="/state/${slug}" style="color: #0F4C81; text-decoration: none; font-weight: 600;">${escapeHtml(sName)} Jobs</a></li>
  `).join('');

  const allPostsHtmlLinks = INITIAL_POSTS.map(p => `
    <li style="margin-bottom: 8px;"><a href="/${escapeHtml(p.category || 'latest-jobs')}/${escapeHtml(p.slug || p.id)}" style="color: #0F4C81; text-decoration: none;">${escapeHtml(cleanTitleText(p.title || ''))}</a> <span style="font-size: 11px; color: #64748B;">(${escapeHtml(p.organization || 'Govt')})</span></li>
  `).join('');

  const sitemapBodyHtml = `
    <header style="background: #0F4C81; color: #ffffff; padding: 24px 16px; text-align: center;">
      <a href="/" style="color: #ffffff; text-decoration: none; font-size: 24px; font-weight: 800;">Pariksha Result 2026</a>
      <h1 style="margin: 8px 0 4px 0; font-size: 22px; font-weight: 700;">HTML Sitemap &amp; Website Directory</h1>
      <p style="margin: 0; font-size: 13px; opacity: 0.9;">Complete index of all sarkari exams, tools, notifications, and portal categories</p>
    </header>

    <main style="max-width: 1000px; margin: 0 auto; padding: 24px 16px; font-family: system-ui, -apple-system, sans-serif;">
      <nav style="font-size: 13px; color: #64748B; margin-bottom: 20px;">
        <a href="/" style="color: #0F4C81; text-decoration: none;">Home</a> &raquo;
        <span style="color: #334155;">HTML Sitemap</span>
      </nav>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px;">
        <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 18px;">
          <h2 style="font-size: 16px; color: #0F4C81; margin-top: 0; margin-bottom: 12px; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px;">🛠️ Free Candidate Tools</h2>
          <ul style="padding-left: 18px; margin: 0; font-size: 13px;">${toolsHtmlLinks}</ul>
        </div>
        <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 18px;">
          <h2 style="font-size: 16px; color: #0F4C81; margin-top: 0; margin-bottom: 12px; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px;">📂 Main Categories</h2>
          <ul style="padding-left: 18px; margin: 0; font-size: 13px;">${catHtmlLinks}</ul>
        </div>
        <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 18px;">
          <h2 style="font-size: 16px; color: #0F4C81; margin-top: 0; margin-bottom: 12px; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px;">📍 State Job Portals</h2>
          <ul style="padding-left: 18px; margin: 0; font-size: 13px;">${stateHtmlLinks}</ul>
        </div>
      </div>

      <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px;">
        <h2 style="font-size: 18px; color: #0F4C81; margin-top: 0; margin-bottom: 16px; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px;">📄 All Active Sarkari Job &amp; Result Notifications (${INITIAL_POSTS.length})</h2>
        <ul style="padding-left: 20px; margin: 0; font-size: 13px; line-height: 1.6;">
          ${allPostsHtmlLinks}
        </ul>
      </div>

      <footer style="margin-top: 32px; text-align: center; font-size: 13px; color: #64748B;">
        <a href="/" style="color: #0F4C81; font-weight: 700; text-decoration: none;">&larr; Return to Home</a> |
        <a href="/sitemap.xml" style="color: #0F4C81; font-weight: 600; text-decoration: none;">XML Sitemap Feed</a>
      </footer>
    </main>
  `;

  let sitemapPageHtml = baseHtml;
  sitemapPageHtml = sitemapPageHtml.replace(/<title>[\s\S]*?<\/title>/gi, `<title>${escapeHtml(sitemapTitle)}</title>`);
  sitemapPageHtml = sitemapPageHtml.replace(/<meta name="description" content="[\s\S]*?"\s*\/?>/gi, `<meta name="description" content="${escapeHtml(sitemapDesc)}" />`);
  sitemapPageHtml = sitemapPageHtml.replace(/<meta property="og:url" content="[\s\S]*?"\s*\/?>/gi, `<meta property="og:url" content="${sitemapCanonical}" />`);

  if (sitemapPageHtml.includes('rel="canonical"')) {
    sitemapPageHtml = sitemapPageHtml.replace(/<link rel="canonical" href="[\s\S]*?"\s*\/?>/gi, `<link rel="canonical" href="${sitemapCanonical}" />`);
  } else {
    sitemapPageHtml = sitemapPageHtml.replace('</head>', `  <link rel="canonical" href="${sitemapCanonical}" />\n</head>`);
  }

  sitemapPageHtml = sitemapPageHtml.replace(/<div id="root">[\s\S]*?<\/div>\s*<script type="module"/i, `<div id="root">\n${sitemapBodyHtml}\n</div>\n    <script type="module"`);

  writeStaticHtml(sitemapRoute, sitemapPageHtml);
  count++;

  console.log(`✅ [Prerender Complete] Pre-rendered ${count} unique static HTML routes for Googlebot & Vercel deployment!`);
}

prerenderAllRoutes();
