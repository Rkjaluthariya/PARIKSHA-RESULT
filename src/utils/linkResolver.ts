import { Post } from '../types';

// Competitor domain blacklist that should NEVER be shown or linked
const COMPETITOR_DOMAINS = [
  'sarkariresult.com',
  'rajsarkariresult.com',
  'indiasarkarinaukri.com',
  'studygovthelp.in',
  'sarkari-result.com',
  'freejobalert.com',
  'sarkariexam.com',
  'rojgarresult.com',
  'jagranjosh.com',
  'testbook.com',
  'oliveboard.in',
  'adda247.com',
  'fastjobsearchers.com',
  'govtjobguru.in',
];

// Mapping of major organizations to their authentic official portals
const OFFICIAL_PORTAL_MAP: Record<string, { official: string; apply?: string; notices?: string }> = {
  // Central Agencies
  ssc: {
    official: 'https://ssc.gov.in',
    apply: 'https://ssc.gov.in',
    notices: 'https://ssc.gov.in/notices',
  },
  upsc: {
    official: 'https://upsc.gov.in',
    apply: 'https://upsconline.nic.in',
    notices: 'https://upsc.gov.in/examinations/active-examinations',
  },
  nta: {
    official: 'https://nta.ac.in',
    apply: 'https://examinationservices.nic.in',
    notices: 'https://nta.ac.in/NoticeArchive',
  },
  rrb: {
    official: 'https://rrbapply.gov.in',
    apply: 'https://rrbapply.gov.in',
    notices: 'https://indianrailways.gov.in',
  },
  railway: {
    official: 'https://rrbapply.gov.in',
    apply: 'https://rrbapply.gov.in',
    notices: 'https://indianrailways.gov.in',
  },
  ibps: {
    official: 'https://ibps.in',
    apply: 'https://ibps.in',
    notices: 'https://ibps.in',
  },
  sbi: {
    official: 'https://sbi.co.in/web/careers',
    apply: 'https://sbi.co.in/web/careers/current-openings',
    notices: 'https://sbi.co.in/web/careers',
  },
  rbi: {
    official: 'https://opportunities.rbi.org.in',
    apply: 'https://opportunities.rbi.org.in',
    notices: 'https://rbi.org.in',
  },
  nabard: {
    official: 'https://nabard.org/careers-notices.aspx',
    apply: 'https://nabard.org',
    notices: 'https://nabard.org',
  },
  drdo: {
    official: 'https://drdo.gov.in/careers',
    apply: 'https://rac.gov.in',
    notices: 'https://drdo.gov.in',
  },
  isro: {
    official: 'https://isro.gov.in/Careers.html',
    apply: 'https://apps.isac.gov.in',
    notices: 'https://isro.gov.in',
  },
  indiapost: {
    official: 'https://indiapostgdsonline.gov.in',
    apply: 'https://indiapostgdsonline.gov.in',
    notices: 'https://indiapost.gov.in',
  },
  gds: {
    official: 'https://indiapostgdsonline.gov.in',
    apply: 'https://indiapostgdsonline.gov.in',
    notices: 'https://indiapost.gov.in',
  },
  ctet: {
    official: 'https://ctet.nic.in',
    apply: 'https://ctet.nic.in',
    notices: 'https://ctet.nic.in',
  },
  cbse: {
    official: 'https://cbse.gov.in',
    apply: 'https://cbseit.in',
    notices: 'https://cbse.gov.in',
  },
  aiims: {
    official: 'https://aiimsexams.ac.in',
    apply: 'https://aiimsexams.ac.in',
    notices: 'https://aiimsexams.ac.in',
  },
  cisf: {
    official: 'https://rect.cisf.gov.in',
    apply: 'https://rect.cisf.gov.in',
    notices: 'https://cisf.gov.in',
  },
  crpf: {
    official: 'https://rect.crpf.gov.in',
    apply: 'https://rect.crpf.gov.in',
    notices: 'https://crpf.gov.in',
  },
  bsf: {
    official: 'https://rectt.bsf.gov.in',
    apply: 'https://rectt.bsf.gov.in',
    notices: 'https://bsf.gov.in',
  },
  itbp: {
    official: 'https://recruitment.itbpolice.nic.in',
    apply: 'https://recruitment.itbpolice.nic.in',
    notices: 'https://itbpolice.nic.in',
  },
  army: {
    official: 'https://joinindianarmy.nic.in',
    apply: 'https://joinindianarmy.nic.in',
    notices: 'https://joinindianarmy.nic.in',
  },
  navy: {
    official: 'https://joinindiannavy.gov.in',
    apply: 'https://joinindiannavy.gov.in',
    notices: 'https://joinindiannavy.gov.in',
  },
  airforce: {
    official: 'https://agnipathvayu.cdac.in',
    apply: 'https://agnipathvayu.cdac.in',
    notices: 'https://indianairforce.nic.in',
  },
  bob: {
    official: 'https://bankofbaroda.in/careers',
    apply: 'https://bankofbaroda.in/careers/current-opportunities',
    notices: 'https://bankofbaroda.in',
  },
  pnb: {
    official: 'https://pnbindia.in/recruitments.aspx',
    apply: 'https://pnbindia.in',
    notices: 'https://pnbindia.in',
  },

  // State Agencies - Rajasthan
  rpsc: {
    official: 'https://rpsc.rajasthan.gov.in',
    apply: 'https://sso.rajasthan.gov.in',
    notices: 'https://rpsc.rajasthan.gov.in/news',
  },
  rsmssb: {
    official: 'https://rsmssb.rajasthan.gov.in',
    apply: 'https://sso.rajasthan.gov.in',
    notices: 'https://rsmssb.rajasthan.gov.in/page?menu=Notifications',
  },
  rssb: {
    official: 'https://rsmssb.rajasthan.gov.in',
    apply: 'https://sso.rajasthan.gov.in',
    notices: 'https://rsmssb.rajasthan.gov.in/page?menu=Notifications',
  },
  reet: {
    official: 'https://rajeduboard.rajasthan.gov.in',
    apply: 'https://rajeduboard.rajasthan.gov.in',
    notices: 'https://rajeduboard.rajasthan.gov.in',
  },
  rajasthanpolice: {
    official: 'https://police.rajasthan.gov.in',
    apply: 'https://sso.rajasthan.gov.in',
    notices: 'https://police.rajasthan.gov.in/recruitment',
  },

  // State Agencies - Uttar Pradesh
  upsssc: {
    official: 'https://upsssc.gov.in',
    apply: 'https://upsssc.gov.in',
    notices: 'https://upsssc.gov.in',
  },
  uppsc: {
    official: 'https://uppsc.up.nic.in',
    apply: 'https://uppsc.up.nic.in',
    notices: 'https://uppsc.up.nic.in',
  },
  uppbpb: {
    official: 'https://uppbpb.gov.in',
    apply: 'https://uppbpb.gov.in',
    notices: 'https://uppbpb.gov.in',
  },
  uppolice: {
    official: 'https://uppbpb.gov.in',
    apply: 'https://uppbpb.gov.in',
    notices: 'https://uppbpb.gov.in',
  },

  // State Agencies - Bihar
  bpsc: {
    official: 'https://bpsc.bih.nic.in',
    apply: 'https://onlinebpsc.bihar.gov.in',
    notices: 'https://bpsc.bih.nic.in',
  },
  bssc: {
    official: 'https://bssc.bihar.gov.in',
    apply: 'https://onlinebssc.com',
    notices: 'https://bssc.bihar.gov.in',
  },
  csbc: {
    official: 'https://csbc.bih.nic.in',
    apply: 'https://csbc.bih.nic.in',
    notices: 'https://csbc.bih.nic.in',
  },

  // State Agencies - MP & Others
  mpesb: {
    official: 'https://esb.mp.gov.in',
    apply: 'https://esb.mponline.gov.in',
    notices: 'https://esb.mp.gov.in',
  },
  mppsc: {
    official: 'https://mppsc.mp.gov.in',
    apply: 'https://mponline.gov.in',
    notices: 'https://mppsc.mp.gov.in',
  },
  hssc: {
    official: 'https://hssc.gov.in',
    apply: 'https://hssc.gov.in',
    notices: 'https://hssc.gov.in',
  },
  hpsc: {
    official: 'https://hpsc.gov.in',
    apply: 'https://hpsc.gov.in',
    notices: 'https://hpsc.gov.in',
  },
  ukpsc: {
    official: 'https://psc.uk.gov.in',
    apply: 'https://ukpscnet.in',
    notices: 'https://psc.uk.gov.in',
  },
};

/**
 * Checks if a given URL belongs to a competitor spam/clone domain homepage
 */
export function isCompetitorUrl(url: string | undefined): boolean {
  if (!url || typeof url !== 'string') return true;
  const lower = url.toLowerCase().trim();
  if (!lower || lower === '#' || lower === 'javascript:void(0)' || lower === 'javascript:;') return true;

  // Direct file downloads (PDF, DOC, ZIP, Images, etc.) are never competitor spam homepages
  if (/\.(pdf|doc|docx|xls|xlsx|zip|rar|jpg|jpeg|png)(\?.*)?$/i.test(lower) || lower.includes('/wp-content/uploads/') || lower.includes('/pdf/') || lower.includes('/downloads/')) {
    return false;
  }

  return COMPETITOR_DOMAINS.some(domain => lower.includes(domain));
}

/**
 * Finds matching official portal for a post based on its title, organization, or board
 */
export function resolveOfficialAgencyPortal(post: Partial<Post>): { official: string; apply: string; notices: string } {
  const text = `${post.title || ''} ${post.organization || ''} ${post.slug || ''} ${post.id || ''}`.toLowerCase();

  for (const [key, mapping] of Object.entries(OFFICIAL_PORTAL_MAP)) {
    if (text.includes(key)) {
      return {
        official: mapping.official,
        apply: mapping.apply || mapping.official,
        notices: mapping.notices || mapping.official,
      };
    }
  }

  // State fallback
  if (text.includes('rajasthan')) {
    return {
      official: 'https://rsmssb.rajasthan.gov.in',
      apply: 'https://sso.rajasthan.gov.in',
      notices: 'https://rpsc.rajasthan.gov.in',
    };
  }
  if (text.includes('uttar pradesh') || text.includes('up ')) {
    return {
      official: 'https://upsssc.gov.in',
      apply: 'https://upsssc.gov.in',
      notices: 'https://uppsc.up.nic.in',
    };
  }
  if (text.includes('bihar')) {
    return {
      official: 'https://bpsc.bih.nic.in',
      apply: 'https://onlinebpsc.bihar.gov.in',
      notices: 'https://bssc.bihar.gov.in',
    };
  }

  // Default Central Govt Portal
  return {
    official: 'https://www.india.gov.in',
    apply: 'https://ssc.gov.in',
    notices: 'https://www.india.gov.in/my-government/schemes',
  };
}

/**
 * Ensures an Important Link URL is clean, valid, and preserves authentic fetched links & PDFs
 */
export function getSafeOfficialLink(
  link: { title?: string; url?: string; type?: string; isPrimary?: boolean },
  post: Partial<Post>
): string {
  const rawUrl = (link.url || '').trim();
  const linkTitle = (link.title || '').toLowerCase();
  const linkType = (link.type || '').toLowerCase();

  // 1. If rawUrl is a valid http/https URL:
  if (rawUrl && (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))) {
    // If it's a direct document/PDF file or NOT a competitor spam homepage, use rawUrl directly!
    if (!isCompetitorUrl(rawUrl) || /\.(pdf|doc|docx|xls|xlsx|zip|rar|jpg|jpeg|png)(\?.*)?$/i.test(rawUrl) || rawUrl.includes('/uploads/') || rawUrl.includes('/pdf/')) {
      return rawUrl;
    }
  }

  // 2. Otherwise, derive the authentic official agency portal based on agency and link purpose
  const agency = resolveOfficialAgencyPortal(post);

  if (linkTitle.includes('apply') || linkTitle.includes('online form') || linkTitle.includes('registration') || linkType === 'apply') {
    return agency.apply;
  }
  if (linkTitle.includes('notification') || linkTitle.includes('advertisement') || linkTitle.includes('pdf') || linkType === 'notification') {
    return agency.notices;
  }
  if (linkTitle.includes('website') || linkTitle.includes('portal') || linkTitle.includes('official') || linkType === 'website') {
    return agency.official;
  }
  if (linkTitle.includes('result') || linkTitle.includes('merit') || linkTitle.includes('cut off') || linkType === 'result') {
    return agency.official;
  }
  if (linkTitle.includes('admit card') || linkTitle.includes('hall ticket') || linkType === 'admit-card') {
    return agency.official;
  }
  if (linkTitle.includes('answer key') || linkTitle.includes('response sheet') || linkType === 'answer-key') {
    return agency.official;
  }

  return agency.official;
}
