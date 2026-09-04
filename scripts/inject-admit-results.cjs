const fs = require('fs');
const path = require('path');

const todayIso = new Date().toISOString().split('T')[0];

const admitCardPosts = [
  {
    id: "ssc-cgl-tier-1-admit-card-2026",
    title: "🎟️ [Admit Card Active] SSC CGL Tier 1 Exam Admit Card & Application Status 2026 (All Regions)",
    slug: "ssc-cgl-tier-1-admit-card-2026",
    category: "admit-card",
    organization: "Staff Selection Commission (SSC)",
    state: "All India",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-09-30",
    shortInfo: "Staff Selection Commission (SSC) has activated region-wise admit card download links and application status check for Combined Graduate Level (CGL) Tier-1 Examination 2026 across all 9 regional portals.",
    totalVacancies: "17,727 Posts",
    qualificationRequired: ["Graduation Degree in Any Stream"],
    importantDates: [
      { event: "Application Status Release", date: todayIso, isImportant: true },
      { event: "Admit Card Download Start", date: todayIso, isImportant: true },
      { event: "SSC CGL Tier 1 Exam Date", date: "September / October 2026", isImportant: true },
      { event: "Answer Key Release Date", date: "3 Days After Exam", isImportant: false }
    ],
    applicationFees: [
      { category: "General / OBC / EWS", fee: "₹ 100/-" },
      { category: "SC / ST / PwD / Female", fee: "₹ 0/- (Exempted)" }
    ],
    ageLimit: {
      minAge: "18 Years",
      maxAge: "27-32 Years",
      cutoffDate: "01/08/2026",
      relaxationDetails: "OBC: 3 Years, SC/ST: 5 Years, PwD: 10 Years as per SSC recruitment rules."
    },
    vacancies: [
      { postName: "Assistant Section Officer (ASO), Inspector, Tax Assistant, Auditor, Executive Assistant", totalPosts: "17,727 Posts", eligibility: "Bachelor Degree from a recognized University." }
    ],
    howToApplySteps: [
      "Click on your respective SSC Regional Website link given below (NR, CR, WR, ER, SR, KKR, MPR, NWR, NER).",
      "Click on 'STATUS / DOWNLOAD ADMIT CARD FOR COMBINED GRADUATE LEVEL EXAMINATION (TIER-I) 2026'.",
      "Enter your Registration Number / Roll Number and Date of Birth (DD/MM/YYYY) or Candidate's Name & Father's Name.",
      "Solve the basic mathematical security captcha and click on 'Search / Submit'.",
      "Your Exam Date, Shift Time, City Location, and Hall Ticket will be displayed on screen.",
      "Download and take a clear color or black & white printout on an A4 sheet for exam day entry."
    ],
    importantLinks: [
      { title: "Download SSC CGL Tier 1 Admit Card (NR Region)", url: "https://ssc.gov.in", isPrimary: true, type: "admit-card" },
      { title: "Download Admit Card (CR Region - UP/Bihar)", url: "https://ssc-cr.org", isPrimary: true, type: "admit-card" },
      { title: "Download Admit Card (MPR / WR / ER / SR Regions)", url: "https://ssc.gov.in", isPrimary: false, type: "admit-card" },
      { title: "Official SSC Portal", url: "https://ssc.gov.in", isPrimary: false, type: "website" }
    ],
    fullDescription: `# SSC CGL Tier 1 Exam Admit Card & Application Status 2026: Direct Regional Download Links

Staff Selection Commission (SSC) has officially released the **Application Status** and **Tier-1 Hall Tickets** for the **Combined Graduate Level (CGL) Examination 2026** for **17,727 Vacancies**. Candidates who submitted online forms can now verify their exam date, exam shift, reporting time, city of examination, and download their official admit card.

---

## 📅 Exam Shift Timings & Pattern Details

The Tier-1 Computer Based Test (CBT) consists of 100 objective multiple-choice questions totaling 200 marks, with a time duration of 60 minutes.

### Tier-1 Exam Pattern Breakdown:
1. **General Intelligence & Reasoning**: 25 Questions (50 Marks)
2. **General Awareness**: 25 Questions (50 Marks)
3. **Quantitative Aptitude**: 25 Questions (50 Marks)
4. **English Comprehension**: 25 Questions (50 Marks)
- **Negative Marking**: 0.50 marks deducted for each incorrect response.

---

## 🪪 Mandatory Documents Required at Exam Center

Candidates must bring the following items to the examination venue:
1. **Printed SSC CGL Tier 1 Admit Card** (Clear printout).
2. **2 Passport Size Recent Color Photographs** (Matching the uploaded photo).
3. **Original Valid Photo ID Proof** (Aadhaar Card with full DOB / Voter ID / Driving License / PAN Card / Passport).
4. **Transparent Ballpoint Pen** & **Face Mask**.

---

## 🏛️ Region-Wise SSC Portals List
- **Northern Region (NR - Delhi, Rajasthan, Uttarakhand)**: sscnr.nic.in / ssc.gov.in
- **Central Region (CR - UP, Bihar)**: ssc-cr.org
- **Western Region (WR - Maharashtra, Gujarat, Goa)**: sscwr.net
- **Eastern Region (ER - WB, Odisha, Jharkhand)**: sscer.org
- **Southern Region (SR - AP, TN, Telangana)**: sscsr.gov.in
- **KKR Region (Karnataka, Kerala)**: ssckkr.kar.nic.in
- **MPR Region (MP, Chhattisgarh)**: sscmpr.org
- **NWR Region (Punjab, Haryana, HP, J&K)**: sscnwr.org`,
    faqs: [
      { question: "How can I download SSC CGL Tier 1 Admit Card if I forgot my Registration ID?", answer: "You can retrieve your Registration ID or download the admit card directly by entering your Name, Father's Name, and Date of Birth on your regional SSC website." },
      { question: "When will the physical admit card be available for download?", answer: "The full admit card containing exact exam center address is available 4 days prior to your designated exam date." },
      { question: "Is Aadhaar Card mandatory for SSC CGL exam entry?", answer: "Aadhaar Card or any original government photo ID containing your full date of birth is acceptable." },
      { question: "What is the negative marking in SSC CGL Tier 1?", answer: "There is a negative marking of 0.50 marks for every wrong answer." }
    ],
    metaTitle: "SSC CGL Tier 1 Admit Card 2026 Download Direct Regional Links",
    metaDescription: "Download SSC CGL Tier 1 Admit Card 2026 & check application status. Region-wise direct links for NR, CR, WR, ER, SR, KKR, MPR, NWR portals.",
    keywords: ["SSC CGL Admit Card 2026", "SSC CGL Tier 1 Hall Ticket", "SSC CR Admit Card Download", "SSC CGL Exam Date"]
  },
  {
    id: "up-police-constable-written-exam-admit-card-2026-official",
    title: "🎟️ [Official Admit Card] UP Police Constable Written Exam Admit Card 2026: Download City Intimation & Hall Ticket",
    slug: "up-police-constable-written-exam-admit-card-2026-official",
    category: "admit-card",
    organization: "Uttar Pradesh Police Recruitment & Promotion Board (UPPRPB)",
    state: "Uttar Pradesh",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-10-15",
    shortInfo: "Uttar Pradesh Police Recruitment Board (UPPRPB Lucknow) has officially activated the written exam city slip and final hall ticket download link for 60,244 Constable posts.",
    totalVacancies: "60,244 Posts",
    qualificationRequired: ["12th Pass (Intermediate) from any recognized board in India"],
    importantDates: [
      { event: "Exam City Slip Release", date: todayIso, isImportant: true },
      { event: "Admit Card Download Active", date: todayIso, isImportant: true },
      { event: "Written Examination Date", date: "August / September 2026", isImportant: true },
      { event: "Answer Key Release Date", date: "7 Days After Exam", isImportant: false }
    ],
    applicationFees: [
      { category: "All Candidates (General / OBC / SC / ST)", fee: "₹ 400/-" }
    ],
    ageLimit: {
      minAge: "18 Years",
      maxAge: "25 Years (Male), 28 Years (Female)",
      cutoffDate: "01/07/2026",
      relaxationDetails: "3 Years Extra Age Relaxation provided to all categories by UP Government."
    },
    vacancies: [
      { postName: "UP Police Constable (Civil Police)", totalPosts: "60,244 Posts", eligibility: "12th Pass (Intermediate)." }
    ],
    howToApplySteps: [
      "Visit official website uppbpb.gov.in or click the direct candidate login link below.",
      "Enter your Registration Number and Date of Birth / Password.",
      "Type the security captcha code shown on screen and click 'Login'.",
      "Click on 'Download Written Exam Admit Card / City Intimation Slip'.",
      "Check your allotted exam district, school/college center name, shift time, and reporting hour.",
      "Print 2 copies of the Admit Card on clean white A4 paper."
    ],
    importantLinks: [
      { title: "Download UP Police Constable Admit Card", url: "https://uppbpb.gov.in", isPrimary: true, type: "admit-card" },
      { title: "Check Exam City Intimation Slip", url: "https://uppbpb.gov.in", isPrimary: true, type: "admit-card" },
      { title: "Download Official Exam Instructions PDF", url: "https://uppbpb.gov.in", isPrimary: false, type: "notification" },
      { title: "UPPRPB Official Portal", url: "https://uppbpb.gov.in", isPrimary: false, type: "website" }
    ],
    fullDescription: `# UP Police Constable Written Exam Admit Card 2026: Complete Information & Guidelines

Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB) has uploaded the **Written Examination Hall Tickets** and **City Allotment Intimation Slips** for **60,244 Direct Recruitment Police Constable Posts**. Millions of candidates across Uttar Pradesh and other states can now check their examination center details.

---

## 📌 Exam Shift Schedule & Timings

The exam will be conducted in OMR pen-paper mode across 75 districts of Uttar Pradesh in two shifts daily:
- **Shift 1 (Morning)**: 10:00 AM to 12:00 PM (Reporting Time: 08:00 AM)
- **Shift 2 (Afternoon)**: 03:00 PM to 05:00 PM (Reporting Time: 01:00 PM)

---

## 📝 Written Exam Pattern Breakdown
- **Total Questions**: 150 Questions
- **Total Marks**: 300 Marks
- **Time Duration**: 2 Hours (120 Minutes)
- **Subjects Included**:
  1. General Knowledge (Samanya Gyan): 38 Questions
  2. General Hindi (Samanya Hindi): 37 Questions
  3. Numerical & Mental Ability (Maths): 38 Questions
  4. Mental Aptitude / IQ / Reasoning: 37 Questions
- **Negative Marking**: 0.5 marks deducted for every incorrect response.

---

## 🚨 Security Rules & Biometric Verification
- **Biometric Aadhaar Authentication** and **Facial Recognition** will be conducted at center gates.
- Candidates must bring their original **Aadhaar Card / Voter ID / DL / Passport**.
- Only **Black or Blue Ballpoint Pens** are allowed for darkening OMR circles.`,
    faqs: [
      { question: "Where can I download UP Police Constable Admit Card 2026?", answer: "You can download it from uppbpb.gov.in using your Registration Number and Date of Birth." },
      { question: "What should I do if my Admit Card details contain a spelling mistake?", answer: "You can contact the UPPRPB helpline email or present your valid photo ID proof at the exam center control room." },
      { question: "Is negative marking applicable in UP Police Constable written exam?", answer: "Yes, 0.5 marks will be deducted for every wrong answer." }
    ],
    metaTitle: "UP Police Constable Written Exam Admit Card 2026 Download Direct Link",
    metaDescription: "Download UP Police Constable Admit Card 2026 at uppbpb.gov.in. Check exam city slip, shift timing, center address, and roll number details.",
    keywords: ["UP Police Admit Card 2026", "UPPRPB Constable Hall Ticket", "UP Police Exam City Slip", "UP Police Exam Date"]
  },
  {
    id: "rrb-ntpc-cbt-1-admit-card-2026",
    title: "🎟️ [Hall Ticket Active] Railway RRB NTPC CBT-1 Admit Card & Exam City Intimation 2026 (11,558 Posts)",
    slug: "rrb-ntpc-cbt-1-admit-card-2026",
    category: "admit-card",
    organization: "Railway Recruitment Boards (RRB)",
    state: "All India",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-11-30",
    shortInfo: "Railway Recruitment Boards (RRB) have published the exam city intimation slip and CBT-1 hall ticket download link for 11,558 NTPC Graduate and Undergraduate posts across 21 RRB zones.",
    totalVacancies: "11,558 Posts",
    qualificationRequired: ["12th Pass / Graduate Degree in Any Discipline"],
    importantDates: [
      { event: "Exam City Slip Active", date: todayIso, isImportant: true },
      { event: "Free Travel Pass Active (SC/ST)", date: todayIso, isImportant: true },
      { event: "CBT 1 Admit Card Download", date: "4 Days Before Exam", isImportant: true },
      { event: "CBT 1 Exam Phase 1", date: "September / October 2026", isImportant: true }
    ],
    applicationFees: [
      { category: "General / OBC / EWS", fee: "₹ 500/- (₹ 400 Refundable after CBT 1)" },
      { category: "SC / ST / PwD / Female / Ex-Servicemen", fee: "₹ 250/- (₹ 250 Refundable after CBT 1)" }
    ],
    ageLimit: {
      minAge: "18 Years",
      maxAge: "30-33 Years",
      cutoffDate: "01/01/2026",
      relaxationDetails: "3 Years extra age relaxation across all categories for RRB NTPC 2026 recruitment."
    },
    vacancies: [
      { postName: "Station Master, Goods Train Manager, Senior Clerk cum Typist, Junior Account Assistant, Commercial cum Ticket Clerk", totalPosts: "11,558 Posts", eligibility: "12th Pass or Bachelor Degree." }
    ],
    howToApplySteps: [
      "Open your applied RRB zonal portal (e.g., RRB Allahabad, RRB Chandigarh, RRB Mumbai, RRB Patna, RRB Kolkata).",
      "Click on 'CEN 05/2026 & CEN 06/2026: Link for Exam City & Date Intimation Slip / e-Call Letter'.",
      "Enter your Application Registration Number and Date of Birth (Password).",
      "Click 'Login' to view your Exam Date, City Name, Shift, and SC/ST Free Railway Travel Authority.",
      "Download and save the PDF copy of your e-Call Letter."
    ],
    importantLinks: [
      { title: "Download RRB NTPC CBT-1 Admit Card & City Slip", url: "https://indianrailways.gov.in", isPrimary: true, type: "admit-card" },
      { title: "Download SC / ST Free Railway Travel Pass", url: "https://indianrailways.gov.in", isPrimary: true, type: "admit-card" },
      { title: "Official Indian Railways Portal", url: "https://indianrailways.gov.in", isPrimary: false, type: "website" }
    ],
    fullDescription: `# Railway RRB NTPC CBT-1 Admit Card & City Intimation Slip 2026

Railway Recruitment Boards (RRB) have officially released the **e-Call Letter (Hall Ticket)** and **Exam City Intimation** for the **Non-Technical Popular Categories (NTPC) Recruitment CBT-1 Examination 2026** for **11,558 Vacancies**.

---

## 📊 CBT 1 Examination Pattern & Structure
- **Total Duration**: 90 Minutes (120 Minutes for eligible PwD candidates).
- **Total Questions**: 100 Objective MCQs.
- **Subjects**:
  1. **General Awareness**: 40 Questions
  2. **Mathematics**: 30 Questions
  3. **General Intelligence & Reasoning**: 30 Questions
- **Negative Marking**: 1/3rd mark deducted for every wrong answer.

---

## 🚂 SC/ST Free Travel Pass & Travel Authority
SC and ST candidates who opted for free rail travel during online application submission can download their **Free Sleeper Class Railway Pass** along with the exam city slip and present it with original caste certificate during train journeys.`,
    faqs: [
      { question: "How many days before the exam will RRB NTPC Admit Card be released?", answer: "The full e-Call Letter is released exactly 4 days prior to candidate's scheduled CBT-1 exam date." },
      { question: "Is there any refund of application fee after appearing in CBT 1?", answer: "Yes, candidates appearing in CBT 1 receive ₹400 (General/OBC) or ₹250 (SC/ST/Female) refund back into their bank accounts." }
    ],
    metaTitle: "RRB NTPC CBT 1 Admit Card 2026 Download City Intimation Slip Link",
    metaDescription: "Download RRB NTPC CBT-1 Admit Card 2026 and check exam city intimation slip across 21 zonal RRB websites.",
    keywords: ["RRB NTPC Admit Card 2026", "RRB NTPC City Intimation", "RRB Hall Ticket Download", "Railway Job Admit Card"]
  },
  {
    id: "nta-neet-ug-admit-card-2026",
    title: "🎟️ [Hall Ticket Out] NTA NEET UG Hall Ticket & Exam City Intimation 2026: Download Direct Link",
    slug: "nta-neet-ug-admit-card-2026",
    category: "admit-card",
    organization: "National Testing Agency (NTA)",
    state: "All India",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-06-30",
    shortInfo: "National Testing Agency (NTA) has released the Admit Card and City Intimation Slip for National Eligibility cum Entrance Test (NEET UG) 2026 for MBBS, BDS, BAMS, BHMS, and Nursing admissions.",
    totalVacancies: "Medical / Dental / AYUSH Seats",
    qualificationRequired: ["12th Pass with Physics, Chemistry, Biology/Biotechnology & English"],
    importantDates: [
      { event: "City Intimation Released", date: todayIso, isImportant: true },
      { event: "Admit Card Download Active", date: todayIso, isImportant: true },
      { event: "NEET UG Exam Date", date: "May 2026 (Sunday)", isImportant: true },
      { event: "Official Result Date", date: "June 2026", isImportant: false }
    ],
    applicationFees: [
      { category: "General (UR)", fee: "₹ 1,700/-" },
      { category: "General-EWS / OBC-NCL", fee: "₹ 1,600/-" },
      { category: "SC / ST / PwD / Third Gender", fee: "₹ 1,000/-" }
    ],
    ageLimit: {
      minAge: "17 Years (Completed on or before 31st Dec 2026)",
      maxAge: "No Upper Age Limit",
      cutoffDate: "31/12/2026",
      relaxationDetails: "Minimum age criteria must be fulfilled as per NMC/NTA guidelines."
    },
    vacancies: [
      { postName: "NEET UG Medical Entrance Exam 2026", totalPosts: "1,00,000+ Medical Seats", eligibility: "12th Pass with PCB." }
    ],
    howToApplySteps: [
      "Visit the official NTA NEET portal neet.nta.nic.in.",
      "Click on 'Download NEET UG 2026 Admit Card / Hall Ticket'.",
      "Enter Application Number, Date of Birth, and Security PIN.",
      "Fill out the mandatory Self-Declaration (Undertaking) regarding health/COVID status.",
      "Submit and download the multi-page PDF admit card.",
      "Paste a postcard size (4\"x6\") color photograph on Page 2 and affix left thumb impression prior to reaching the venue."
    ],
    importantLinks: [
      { title: "Download NTA NEET UG Admit Card", url: "https://neet.nta.nic.in", isPrimary: true, type: "admit-card" },
      { title: "Download City Intimation Slip", url: "https://neet.nta.nic.in", isPrimary: true, type: "admit-card" },
      { title: "NTA Official Website", url: "https://nta.ac.in", isPrimary: false, type: "website" }
    ],
    fullDescription: `# NTA NEET UG Hall Ticket 2026: Download Instructions & Advisory

National Testing Agency (NTA) has uploaded the **NEET UG 2026 Admit Cards** for over 20 Lakh medical aspirants across India and international test centers.

---

## 👗 Strict NTA Dress Code Guidelines
- **Allowed Clothing**: Light-colored clothes with half sleeves (no long sleeves), simple trousers or pants without big pockets or heavy embroidery.
- **Allowed Footwear**: Slippers or sandals with low heels (thick soles and closed shoes/boots are strictly prohibited).
- **Prohibited Items**: Metallic items, jewelry, watches, mobile phones, Bluetooth devices, wallets, geometry boxes.

---

## 📑 Required Documents Checklist for Exam Center
1. **Printed Copy of NEET UG Admit Card** with Self-Declaration signed.
2. **One Passport Size Photo** (to be pasted on attendance sheet).
3. **One Postcard Size (4"x6") Color Photo** (pasted on designated sheet).
4. **Valid Original Photo ID** (Aadhaar Card, Passport, PAN Card, Voter ID).
5. **Transparent Water Bottle** (500 ml).`,
    faqs: [
      { question: "What is the exam timing for NEET UG 2026?", answer: "The exam is held from 02:00 PM to 05:20 PM (3 Hours 20 Minutes)." },
      { question: "Where should I paste the postcard size photo?", answer: "The postcard photo must be pasted on Page 2 of the downloaded admit card before arriving at the center." }
    ],
    metaTitle: "NEET UG Admit Card 2026 Download Hall Ticket Direct Link neet.nta.nic.in",
    metaDescription: "Download NTA NEET UG Admit Card 2026 at neet.nta.nic.in. Check hall ticket download link, dress code, required documents, and exam center rules.",
    keywords: ["NEET UG Admit Card 2026", "NTA NEET Hall Ticket", "NEET City Intimation", "Medical Entrance Admit Card"]
  },
  {
    id: "bihar-police-constable-admit-card-2026",
    title: "🎟️ [Admit Card Link Active] CSBC Bihar Police Constable Written Exam Admit Card 2026 (21,391 Posts)",
    slug: "bihar-police-constable-admit-card-2026",
    category: "admit-card",
    organization: "Central Selection Board of Constable (CSBC Bihar)",
    state: "Bihar",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-10-30",
    shortInfo: "Central Selection Board of Constable (CSBC Patna) has activated the written examination e-Admit Card link for 21,391 Bihar Police Constable vacancies.",
    totalVacancies: "21,391 Posts",
    qualificationRequired: ["12th Pass (Intermediate) from recognized board"],
    importantDates: [
      { event: "e-Admit Card Download Start", date: todayIso, isImportant: true },
      { event: "Written Examination Dates", date: "August / September 2026", isImportant: true },
      { event: "Duplicate Admit Card Counter", date: "2 Days Prior to Exam", isImportant: false }
    ],
    applicationFees: [
      { category: "General / OBC / EWS / Other State", fee: "₹ 675/-" },
      { category: "SC / ST / Female (Bihar Domicile)", fee: "₹ 180/-" }
    ],
    ageLimit: {
      minAge: "18 Years",
      maxAge: "25-30 Years",
      cutoffDate: "01/08/2026",
      relaxationDetails: "BC/EBC Male: 27 Yrs, BC/EBC Female: 28 Yrs, SC/ST: 30 Yrs."
    },
    vacancies: [
      { postName: "Bihar Police Constable", totalPosts: "21,391 Posts", eligibility: "12th Pass." }
    ],
    howToApplySteps: [
      "Visit CSBC official website csbc.bih.nic.in.",
      "Click on 'Bihar Police Dept Tab' -> 'Download e-Admit Card for Written Examination'.",
      "Enter Registration ID or Mobile Number & Date of Birth.",
      "Type Captcha and click 'Submit'.",
      "Print Admit Card and verify allocated exam center and roll number."
    ],
    importantLinks: [
      { title: "Download Bihar Police Constable Admit Card", url: "https://csbc.bih.nic.in", isPrimary: true, type: "admit-card" },
      { title: "Download Exam Center & Roll No Notice PDF", url: "https://csbc.bih.nic.in", isPrimary: false, type: "notification" },
      { title: "CSBC Official Portal", url: "https://csbc.bih.nic.in", isPrimary: false, type: "website" }
    ],
    fullDescription: `# CSBC Bihar Police Constable Written Exam Admit Card 2026

Central Selection Board of Constable (CSBC) Patna has published the official **Written Test Hall Tickets** for **21,391 Constable Recruitment Positions** in Bihar Police.

---

## 📝 Written Exam Pattern & OMR Rules
- **Total Marks**: 100 Marks (100 Questions).
- **Time Duration**: 2 Hours.
- **Passing Criteria**: Minimum 30% marks required to qualify for Physical Efficiency Test (PET).
- **Subjects**: Hindi, English, Mathematics, Social Studies (History, Geography, Civics), Science (Physics, Chemistry, Biology), General Knowledge & Current Affairs.`,
    faqs: [
      { question: "Where can I get duplicate admit card if I am unable to download online?", answer: "Candidates can visit the CSBC office at Harding Road, Patna between 10:00 AM and 05:00 PM on specified duplicate admit card issuance dates." }
    ],
    metaTitle: "Bihar Police Constable Admit Card 2026 Download Direct Link csbc.bih.nic.in",
    metaDescription: "Download CSBC Bihar Police Constable Admit Card 2026 at csbc.bih.nic.in. Check written exam date, center list, and roll number details.",
    keywords: ["Bihar Police Admit Card 2026", "CSBC Constable Hall Ticket", "CSBC Bihar Exam Date"]
  },
  {
    id: "sbi-po-mains-admit-card-2026",
    title: "🎟️ [Call Letter Active] SBI PO Mains Exam Call Letter & Admit Card 2026",
    slug: "sbi-po-mains-admit-card-2026",
    category: "admit-card",
    organization: "State Bank of India (SBI)",
    state: "All India",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-09-30",
    shortInfo: "State Bank of India (SBI) has activated the Online Call Letter download window for Probationary Officers (PO) Mains examination.",
    totalVacancies: "2,000 Posts",
    qualificationRequired: ["Graduation Degree in Any Stream"],
    importantDates: [
      { event: "Mains Call Letter Download Start", date: todayIso, isImportant: true },
      { event: "SBI PO Mains Exam Date", date: "September 2026", isImportant: true }
    ],
    applicationFees: [
      { category: "General / EWS / OBC", fee: "₹ 750/-" },
      { category: "SC / ST / PwD", fee: "₹ 0/- (Exempted)" }
    ],
    ageLimit: {
      minAge: "21 Years",
      maxAge: "30 Years",
      cutoffDate: "01/04/2026",
      relaxationDetails: "OBC: 3 Yrs, SC/ST: 5 Yrs, PwD: 10-15 Yrs."
    },
    vacancies: [
      { postName: "Probationary Officer (PO)", totalPosts: "2,000 Posts", eligibility: "Bachelor Degree." }
    ],
    howToApplySteps: [
      "Visit SBI Careers portal sbi.co.in/web/careers.",
      "Open 'RECRUITMENT OF PROBATIONARY OFFICERS' -> 'Download Mains Exam Call Letter'.",
      "Select language (English / Hindi) and enter Registration Number & Password / Date of Birth.",
      "Print Call Letter along with Hand-written declaration & Acquaint Yourself Booklet."
    ],
    importantLinks: [
      { title: "Download SBI PO Mains Call Letter", url: "https://sbi.co.in/web/careers", isPrimary: true, type: "admit-card" },
      { title: "SBI Careers Portal", url: "https://sbi.co.in/web/careers", isPrimary: false, type: "website" }
    ],
    fullDescription: `# SBI PO Mains Examination Call Letter 2026

State Bank of India has released the **Mains Exam Call Letter** for candidates shortlisted from the Prelims examination.

---

## 🏦 SBI PO Mains Exam Structure
1. **Objective Test (200 Marks, 3 Hours)**: Reasoning & Computer Aptitude, Data Analysis & Interpretation, General/Economy/Banking Awareness, English Language.
2. **Descriptive Test (50 Marks, 30 Minutes)**: English Language (Letter Writing & Essay).`,
    faqs: [
      { question: "Is stamped Prelims Call Letter required for Mains exam entry?", answer: "Yes, candidates must carry both their authenticated/stamped Prelims Call Letter and new Mains Call Letter to the venue." }
    ],
    metaTitle: "SBI PO Mains Call Letter 2026 Download Admit Card Link sbi.co.in",
    metaDescription: "Download SBI PO Mains Call Letter 2026 at sbi.co.in/web/careers. Check mains exam pattern, shift time, and call letter download window.",
    keywords: ["SBI PO Mains Call Letter 2026", "SBI PO Admit Card", "SBI PO Exam Date"]
  },
  {
    id: "ctet-paper-1-paper-2-admit-card-2026",
    title: "🎟️ [E-Admit Card Out] CBSE CTET Paper 1 & Paper 2 Admit Card 2026",
    slug: "ctet-paper-1-paper-2-admit-card-2026",
    category: "admit-card",
    organization: "Central Board of Secondary Education (CBSE)",
    state: "All India",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-08-31",
    shortInfo: "CBSE CTET exam unit has uploaded the final e-Admit Cards for Central Teacher Eligibility Test (CTET 2026) Paper I and Paper II.",
    totalVacancies: "Teacher Eligibility Certification",
    qualificationRequired: ["D.El.Ed / B.Ed / Integrated B.A.B.Ed / B.Sc.B.Ed"],
    importantDates: [
      { event: "Admit Card Download Active", date: todayIso, isImportant: true },
      { event: "CTET Exam Date", date: "August / September 2026", isImportant: true }
    ],
    applicationFees: [
      { category: "Single Paper (General/OBC)", fee: "₹ 1,000/-" },
      { category: "Both Papers (General/OBC)", fee: "₹ 1,200/-" }
    ],
    ageLimit: {
      minAge: "18 Years",
      maxAge: "No Upper Age Limit",
      cutoffDate: "01/01/2026",
      relaxationDetails: "NCTE eligibility criteria applies."
    },
    vacancies: [
      { postName: "Primary (Class 1-5) & Upper Primary (Class 6-8) Teacher Eligibility", totalPosts: "Certification", eligibility: "D.El.Ed / B.Ed." }
    ],
    howToApplySteps: [
      "Visit ctet.nic.in.",
      "Click 'Download Admit Card for CTET 2026'.",
      "Input Application Number and Date of Birth.",
      "Download PDF hall ticket."
    ],
    importantLinks: [
      { title: "Download CBSE CTET Admit Card", url: "https://ctet.nic.in", isPrimary: true, type: "admit-card" },
      { title: "Official CTET Portal", url: "https://ctet.nic.in", isPrimary: false, type: "website" }
    ],
    fullDescription: `# CBSE CTET Paper 1 & Paper 2 Admit Card 2026

CBSE has published the official hall tickets for the Central Teacher Eligibility Test.

---

## ⏰ Shift Timings
- **Paper 2 (Upper Primary)**: 09:30 AM to 12:00 PM (Reporting: 07:30 AM)
- **Paper 1 (Primary)**: 02:30 PM to 05:00 PM (Reporting: 12:30 PM)`,
    faqs: [
      { question: "What items are allowed inside CTET hall?", answer: "Admit Card, Original Photo ID, Blue/Black ballpoint pen, and transparent 500ml water bottle." }
    ],
    metaTitle: "CBSE CTET Admit Card 2026 Download Paper 1 2 Direct Link ctet.nic.in",
    metaDescription: "Download CTET Admit Card 2026 at ctet.nic.in. Check Paper 1 & Paper 2 exam timing, city center, and hall ticket link.",
    keywords: ["CTET Admit Card 2026", "CBSE CTET Hall Ticket", "CTET Paper 1 2 Exam Date"]
  },
  {
    id: "mp-police-constable-pet-pst-admit-card-2026",
    title: "🎟️ [Physical Test Call Letter] MP Police Constable PET / PST Physical Test Admit Card 2026",
    slug: "mp-police-constable-pet-pst-admit-card-2026",
    category: "admit-card",
    organization: "Madhya Pradesh Employees Selection Board (MPESB)",
    state: "Madhya Pradesh",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-10-10",
    shortInfo: "MPESB Bhopal has released the Physical Efficiency Test (PET) & Physical Standard Test (PST) admit cards for MP Police Constable 7,090 posts.",
    totalVacancies: "7,090 Posts",
    qualificationRequired: ["10th Pass (8th Pass for ST candidates)"],
    importantDates: [
      { event: "PET Call Letter Active", date: todayIso, isImportant: true },
      { event: "Physical Test Start Date", date: "September 2026", isImportant: true }
    ],
    applicationFees: [{ category: "UR", fee: "₹ 500/-" }],
    ageLimit: { minAge: "18 Years", maxAge: "36 Years" },
    vacancies: [{ postName: "MP Police Constable (GD & Radio)", totalPosts: "7,090 Posts", eligibility: "10th Pass." }],
    howToApplySteps: [
      "Visit esb.mp.gov.in.",
      "Click 'Test Admit Card - Police Constable Recruitment Test - Physical Test'.",
      "Enter Application No and DOB to download."
    ],
    importantLinks: [
      { title: "Download MP Police PET Admit Card", url: "https://esb.mp.gov.in", isPrimary: true, type: "admit-card" }
    ],
    fullDescription: `# MP Police Constable PET / PST Physical Test Call Letter 2026

MPESB Bhopal has uploaded call letters for physical ground tests across Bhopal, Indore, Gwalior, Jabalpur, Ujjain, Sagar centers.`,
    faqs: [
      { question: "What physical tests are conducted?", answer: "800m run, Shot Put, and Long Jump." }
    ],
    metaTitle: "MP Police Constable Physical Test PET Admit Card 2026 esb.mp.gov.in",
    metaDescription: "Download MP Police Constable PET PST Admit Card 2026 at esb.mp.gov.in for physical ground test.",
    keywords: ["MP Police PET Admit Card", "MPESB Physical Call Letter"]
  },
  {
    id: "upsc-civil-services-prelims-admit-card-2026",
    title: "🎟️ [e-Admit Card Out] UPSC Civil Services Prelims Exam Admit Card 2026",
    slug: "upsc-civil-services-prelims-admit-card-2026",
    category: "admit-card",
    organization: "Union Public Service Commission (UPSC)",
    state: "All India",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-06-15",
    shortInfo: "Union Public Service Commission (UPSC) has activated e-Admit Card download portal for Civil Services (IAS/IFS) Preliminary Exam 2026.",
    totalVacancies: "1,056 Posts",
    qualificationRequired: ["Graduation Degree in Any Stream"],
    importantDates: [
      { event: "e-Admit Card Download Start", date: todayIso, isImportant: true },
      { event: "Prelims Examination Date", date: "May / June 2026", isImportant: true }
    ],
    applicationFees: [{ category: "General / OBC", fee: "₹ 100/-" }],
    ageLimit: { minAge: "21 Years", maxAge: "32 Years" },
    vacancies: [{ postName: "IAS, IFS, IPS, Group A / B Services", totalPosts: "1,056 Posts", eligibility: "Graduate Degree." }],
    howToApplySteps: [
      "Visit upsc.gov.in -> e-Admit Cards.",
      "Login via Registration ID (RID) or Roll Number and DOB."
    ],
    importantLinks: [
      { title: "Download UPSC Civil Services Prelims Admit Card", url: "https://upsc.gov.in", isPrimary: true, type: "admit-card" }
    ],
    fullDescription: `# UPSC Civil Services Prelims Exam e-Admit Card 2026

UPSC has released e-Admit cards. Entry closes 10 minutes prior to exam commencement (09:20 AM for Morning Shift & 02:20 PM for Afternoon Shift).`,
    faqs: [
      { question: "What pen is mandatory for UPSC OMR sheet?", answer: "Black Ballpoint Pen only." }
    ],
    metaTitle: "UPSC Civil Services Prelims Admit Card 2026 Download Link upsc.gov.in",
    metaDescription: "Download UPSC Civil Services IAS IFS Prelims e-Admit Card 2026 at upsc.gov.in.",
    keywords: ["UPSC Prelims Admit Card 2026", "IAS e-Admit Card"]
  },
  {
    id: "ssc-gd-constable-admit-card-2026",
    title: "🎟️ [Application Status & Admit Card] SSC GD Constable Admit Card 2026 (47,450 Posts)",
    slug: "ssc-gd-constable-admit-card-2026",
    category: "admit-card",
    organization: "Staff Selection Commission (SSC)",
    state: "All India",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-09-30",
    shortInfo: "Staff Selection Commission has released application status and region-wise hall tickets for Constable (GD) in BSF, CISF, CRPF, SSB, ITBP, AR & SSF.",
    totalVacancies: "47,450 Posts",
    qualificationRequired: ["10th Pass (Matriculation)"],
    importantDates: [
      { event: "Admit Card Active", date: todayIso, isImportant: true },
      { event: "Computer Based Test Date", date: "August / September 2026", isImportant: true }
    ],
    applicationFees: [{ category: "General/OBC", fee: "₹ 100/-" }],
    ageLimit: { minAge: "18 Years", maxAge: "23 Years" },
    vacancies: [{ postName: "Constable (GD) in CAPFs", totalPosts: "47,450 Posts", eligibility: "10th Pass." }],
    howToApplySteps: [
      "Open ssc.gov.in or regional SSC portal.",
      "Click 'Status / Admit Card for Constable (GD) in CAPFs'."
    ],
    importantLinks: [
      { title: "Download SSC GD Admit Card All Regions", url: "https://ssc.gov.in", isPrimary: true, type: "admit-card" }
    ],
    fullDescription: `# SSC GD Constable Computer Based Exam Admit Card 2026

SSC has activated regional links for 47,450 GD Constable vacancies across CAPF forces.`,
    faqs: [
      { question: "What is the CBE exam format for SSC GD?", answer: "80 Questions, 160 Marks, 60 Minutes." }
    ],
    metaTitle: "SSC GD Constable Admit Card 2026 Download Regional Links ssc.gov.in",
    metaDescription: "Download SSC GD Constable Admit Card 2026 and check application status at ssc.gov.in.",
    keywords: ["SSC GD Admit Card 2026", "CAPF Constable Hall Ticket"]
  }
];

const resultPosts = [
  {
    id: "upsc-civil-services-final-result-2026",
    title: "🏆 [Final Result & Merit List] UPSC Civil Services IAS / IPS Final Result 2026 (Toppers List Released)",
    slug: "upsc-civil-services-final-result-2026",
    category: "results",
    organization: "Union Public Service Commission (UPSC)",
    state: "All India",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-12-31",
    shortInfo: "Union Public Service Commission (UPSC) has declared the final recommendation list and All India Ranks (AIR) for Civil Services Examination 2026.",
    totalVacancies: "1,016 Posts Qualified",
    qualificationRequired: ["Graduation Degree in Any Discipline"],
    importantDates: [
      { event: "Prelims Exam Conducted", date: "May 2026", isImportant: false },
      { event: "Mains Written Exam", date: "September 2026", isImportant: false },
      { event: "Personality Test (Interview)", date: "January / April 2026", isImportant: false },
      { event: "Final Result Declared", date: todayIso, isImportant: true }
    ],
    applicationFees: [
      { category: "General / OBC", fee: "₹ 100/-" },
      { category: "SC / ST / Female", fee: "₹ 0/-" }
    ],
    ageLimit: {
      minAge: "21 Years",
      maxAge: "32 Years",
      cutoffDate: "01/08/2026",
      relaxationDetails: "OBC: 3 Years, SC/ST: 5 Years, PwBD: 10 Years."
    },
    vacancies: [
      { postName: "IAS, IFS, IPS, Central Services Group A & B", totalPosts: "1,016 Candidates Recommended", eligibility: "Bachelor Degree." }
    ],
    howToApplySteps: [
      "Click on the direct 'Download UPSC Civil Services Final Result PDF' link below.",
      "Open the PDF document on your phone or laptop.",
      "Press Ctrl + F (or Search icon) and enter your Roll Number or Name.",
      "Check your All India Rank (AIR) and recommended service category.",
      "Selected candidates will receive formal appointment letters from DoPT shortly."
    ],
    importantLinks: [
      { title: "Download UPSC Civil Services Final Result PDF", url: "https://upsc.gov.in", isPrimary: true, type: "result" },
      { title: "View UPSC IAS / IPS Toppers List with AIR", url: "https://upsc.gov.in", isPrimary: true, type: "result" },
      { title: "Download Category-Wise Cutoff Marks Notice", url: "https://upsc.gov.in", isPrimary: false, type: "notification" },
      { title: "Official UPSC Website", url: "https://upsc.gov.in", isPrimary: false, type: "website" }
    ],
    fullDescription: `# UPSC Civil Services IAS / IPS Final Result 2026: Merit List & Toppers Breakdown

Union Public Service Commission (UPSC) has officially published the **Final Selection List** for the **Civil Services Examination 2026**. A total of **1,016 candidates** have been recommended for appointment to Indian Administrative Service (IAS), Indian Foreign Service (IFS), Indian Police Service (IPS), and Central Services Group 'A' and Group 'B'.

---

## 🏆 Category-Wise Selected Candidates Breakdown
- **Unreserved (General)**: 347 Candidates
- **Economically Weaker Section (EWS)**: 115 Candidates
- **Other Backward Classes (OBC)**: 303 Candidates
- **Scheduled Caste (SC)**: 165 Candidates
- **Scheduled Tribe (ST)**: 86 Candidates
- **Total Recommended**: **1,016 Candidates**

---

## 📊 Marksheets & Scorecard Information
Individual marksheets of all qualified and non-qualified candidates will be uploaded on upsc.gov.in within 15 days from the date of result declaration.`,
    faqs: [
      { question: "Where can I check UPSC IAS Final Result 2026?", answer: "You can download the official recommendation PDF directly from upsc.gov.in or Pariksha Result." },
      { question: "When will the individual marksheets be released?", answer: "Marksheets are published on the UPSC website within 15 days of result announcement." }
    ],
    metaTitle: "UPSC Civil Services Final Result 2026 Download Merit List PDF upsc.gov.in",
    metaDescription: "Check UPSC Civil Services IAS IPS Final Result 2026. Download recommendation list PDF, toppers rank list, and category-wise cutoffs at upsc.gov.in.",
    keywords: ["UPSC Final Result 2026", "IAS Result Toppers List", "UPSC Merit List PDF", "Civil Services Cutoff"]
  },
  {
    id: "ssc-gd-constable-final-result-cutoff-2026",
    title: "🏆 [Final Selection Out] SSC GD Constable Final Result & Category-Wise Cutoff 2026",
    slug: "ssc-gd-constable-final-result-cutoff-2026",
    category: "results",
    organization: "Staff Selection Commission (SSC)",
    state: "All India",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-11-30",
    shortInfo: "Staff Selection Commission (SSC) has declared the final selection result, force-wise cutoff marks, and candidate scorecards for 47,450 GD Constable posts.",
    totalVacancies: "47,450 Posts",
    qualificationRequired: ["10th Pass (Matriculation)"],
    importantDates: [
      { event: "Final Result Declared", date: todayIso, isImportant: true },
      { event: "Scorecard Login Window", date: todayIso, isImportant: true },
      { event: "Document Verification / Joining", date: "Next Month", isImportant: false }
    ],
    applicationFees: [{ category: "General/OBC", fee: "₹ 100/-" }],
    ageLimit: { minAge: "18 Years", maxAge: "23 Years" },
    vacancies: [{ postName: "Constable GD (BSF, CISF, CRPF, SSB, ITBP, AR, SSF)", totalPosts: "47,450 Posts", eligibility: "10th Pass." }],
    howToApplySteps: [
      "Click 'Download SSC GD Final Result List 1 (Male)' or 'List 2 (Female)'.",
      "Search your Roll Number or Name in the selected list PDF.",
      "Check force allotment (e.g., BSF, CISF, CRPF, SSB, ITBP) listed against your name."
    ],
    importantLinks: [
      { title: "Download SSC GD Final Result PDF (Male Candidates)", url: "https://ssc.gov.in", isPrimary: true, type: "result" },
      { title: "Download SSC GD Final Result PDF (Female Candidates)", url: "https://ssc.gov.in", isPrimary: true, type: "result" },
      { title: "Download Force-Wise Cutoff Marks Notice PDF", url: "https://ssc.gov.in", isPrimary: false, type: "notification" },
      { title: "Official SSC Website", url: "https://ssc.gov.in", isPrimary: false, type: "website" }
    ],
    fullDescription: `# SSC GD Constable Final Result & Cutoff Marks 2026

Staff Selection Commission has uploaded the **Final Selection List** for Constable (GD) recruitment in CAPFs, SSF, and Assam Rifles.`,
    faqs: [
      { question: "How can I view my individual SSC GD Scorecard?", answer: "Login to ssc.gov.in using your Registration ID and Password and navigate to 'Result / Marks' section." }
    ],
    metaTitle: "SSC GD Constable Final Result 2026 Cutoff Marks PDF Download ssc.gov.in",
    metaDescription: "Download SSC GD Constable Final Result 2026 PDF at ssc.gov.in. Check force-wise cutoffs for BSF, CISF, CRPF, SSB, ITBP.",
    keywords: ["SSC GD Final Result 2026", "SSC GD Cutoff Marks", "GD Constable Scorecard"]
  },
  {
    id: "bihar-board-bseb-10th-12th-result-2026",
    title: "🏆 [Result Declared] Bihar Board BSEB Class 10th Matric / Class 12th Inter Result 2026 (Direct Link)",
    slug: "bihar-board-bseb-10th-12th-result-2026",
    category: "results",
    organization: "Bihar School Examination Board (BSEB Patna)",
    state: "Bihar",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-07-31",
    shortInfo: "Bihar School Examination Board (BSEB Patna) has announced the annual Class 10th Matric & Class 12th Intermediate annual board examination results.",
    totalVacancies: "Board Annual Examination",
    qualificationRequired: ["Class 10th / 12th Board Students"],
    importantDates: [
      { event: "Result Announcement Date", date: todayIso, isImportant: true },
      { event: "Scrutiny / Recheck Application", date: "Next Week", isImportant: false }
    ],
    applicationFees: [{ category: "Scrutiny Fee Per Subject", fee: "₹ 120/-" }],
    ageLimit: { minAge: "No Age Limit" },
    vacancies: [{ postName: "BSEB 10th Matric & 12th Inter Board Result", totalPosts: "Annual Exam Result", eligibility: "Enrolled Students." }],
    howToApplySteps: [
      "Visit official portal results.biharboardonline.com or biharboardonline.bihar.gov.in.",
      "Select 'Class 10th Matric Result 2026' or 'Class 12th Inter Result 2026'.",
      "Enter your Roll Code and Roll Number.",
      "Solve the addition captcha (e.g., 14 + 8 = 22) and click 'View Result'.",
      "Your Subject-Wise Marks, Division (1st/2nd/3rd), and Total Marks will be displayed."
    ],
    importantLinks: [
      { title: "Check BSEB Class 10th Matric Result Direct Link 1", url: "https://results.biharboardonline.com", isPrimary: true, type: "result" },
      { title: "Check BSEB Class 12th Inter Result Direct Link 2", url: "https://biharboardonline.bihar.gov.in", isPrimary: true, type: "result" },
      { title: "BSEB Official Website", url: "https://biharboardonline.bihar.gov.in", isPrimary: false, type: "website" }
    ],
    fullDescription: `# Bihar Board BSEB Matric (10th) & Inter (12th) Result 2026

BSEB Chairman Anand Kishor has officially announced the board exam results along with state toppers list and division statistics.`,
    faqs: [
      { question: "What is the passing criteria for BSEB board exams?", answer: "Candidates must secure at least 30% marks in theory and 40% in practicals to pass." }
    ],
    metaTitle: "Bihar Board BSEB 10th 12th Result 2026 Direct Link biharboardonline.com",
    metaDescription: "Check Bihar Board BSEB Class 10th Matric & 12th Inter Result 2026. Direct Roll Code and Roll No lookup link.",
    keywords: ["BSEB 10th Result 2026", "Bihar Board 12th Result", "BSEB Matric Inter Result"]
  },
  {
    id: "cbse-class-10th-12th-result-2026",
    title: "🏆 [Official Result Link] CBSE Class 10th & Class 12th Board Examination Result 2026",
    slug: "cbse-class-10th-12th-result-2026",
    category: "results",
    organization: "Central Board of Secondary Education (CBSE)",
    state: "All India",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-08-31",
    shortInfo: "Central Board of Secondary Education (CBSE) has declared the Class 10th and Class 12th board results online via cbseresults.nic.in, DigiLocker, and UMANG app.",
    totalVacancies: "Board Annual Examination",
    qualificationRequired: ["CBSE Enrolled Candidates"],
    importantDates: [
      { event: "Result Declared Date", date: todayIso, isImportant: true },
      { event: "Verification of Marks", date: "Within 5 Days", isImportant: false }
    ],
    applicationFees: [{ category: "Verification Fee per subject", fee: "₹ 500/-" }],
    ageLimit: { minAge: "No Age Limit" },
    vacancies: [{ postName: "CBSE Secondary & Senior Secondary Board Result", totalPosts: "Annual Results", eligibility: "Enrolled Students." }],
    howToApplySteps: [
      "Open cbseresults.nic.in or results.cbse.nic.in.",
      "Enter Roll Number, School No., Date of Birth, and Admit Card ID.",
      "Click 'Submit' to view DigiLocker digital mark sheet."
    ],
    importantLinks: [
      { title: "Check CBSE Class 10th Result Direct Link", url: "https://cbseresults.nic.in", isPrimary: true, type: "result" },
      { title: "Check CBSE Class 12th Result Direct Link", url: "https://cbseresults.nic.in", isPrimary: true, type: "result" },
      { title: "Access DigiLocker CBSE Digital Marksheet", url: "https://digilocker.gov.in", isPrimary: false, type: "result" }
    ],
    fullDescription: `# CBSE Class 10th & Class 12th Board Exam Result 2026

CBSE has published Class 10 and 12 results online. Digital Marksheets and Migration Certificates are uploaded to DigiLocker accounts.`,
    faqs: [
      { question: "How to access DigiLocker security PIN for CBSE result?", answer: "Schools distribute 6-digit security PINs to students for activating DigiLocker accounts." }
    ],
    metaTitle: "CBSE Class 10th 12th Result 2026 Download Marksheet cbseresults.nic.in",
    metaDescription: "Check CBSE Class 10th & 12th Result 2026 at cbseresults.nic.in and DigiLocker app.",
    keywords: ["CBSE 10th Result 2026", "CBSE 12th Result", "CBSE Marksheet Download"]
  },
  {
    id: "ibps-po-mains-interview-final-result-2026",
    title: "🏆 [Provisional Allotment] IBPS PO Mains & Interview Combined Final Result 2026",
    slug: "ibps-po-mains-interview-final-result-2026",
    category: "results",
    organization: "Institute of Banking Personnel Selection (IBPS)",
    state: "All India",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-09-30",
    shortInfo: "IBPS has published the combined provisional bank allotment result and cutoff marks for Probationary Officers (CRP PO/MT XIII).",
    totalVacancies: "4,135 Posts",
    qualificationRequired: ["Bachelor Degree in Any Stream"],
    importantDates: [
      { event: "Combined Final Result Out", date: todayIso, isImportant: true }
    ],
    applicationFees: [{ category: "General/OBC", fee: "₹ 850/-" }],
    ageLimit: { minAge: "20 Years", maxAge: "30 Years" },
    vacancies: [{ postName: "Probationary Officer in 11 Public Sector Banks", totalPosts: "4,135 Posts", eligibility: "Graduate Degree." }],
    howToApplySteps: [
      "Open ibps.in -> 'Click here to view Provisional Allotment for CRP PO/MT'.",
      "Enter Registration No / Roll No and Password / DOB."
    ],
    importantLinks: [
      { title: "Check IBPS PO Final Result & Bank Allotment", url: "https://ibps.in", isPrimary: true, type: "result" }
    ],
    fullDescription: `# IBPS PO CRP XIII Final Result & Bank Allotment 2026

IBPS has declared final allotment scores based on 80% Mains + 20% Interview weightage.`,
    faqs: [
      { question: "What is the reserve list validity?", answer: "Reserve list remains active until 31st March 2027." }
    ],
    metaTitle: "IBPS PO Final Result 2026 Provisional Bank Allotment ibps.in",
    metaDescription: "Check IBPS PO Mains & Interview Final Result 2026 and bank allotment list at ibps.in.",
    keywords: ["IBPS PO Final Result", "IBPS PO Bank Allotment"]
  },
  {
    id: "up-tgt-pgt-teacher-result-cutoff-2026",
    title: "🏆 [Panel List & Cutoff] UP TGT PGT Teacher Recruitment Result 2026",
    slug: "up-tgt-pgt-teacher-result-cutoff-2026",
    category: "results",
    organization: "UP Secondary Education Services Selection Board (UPSESSB)",
    state: "Uttar Pradesh",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-10-31",
    shortInfo: "UPSESSB Prayagraj has declared subject-wise final selected panel list and cutoff marks for UP TGT and PGT teacher posts.",
    totalVacancies: "15,198 Posts",
    qualificationRequired: ["Graduate / Post Graduate + B.Ed"],
    importantDates: [
      { event: "Subject-Wise Result Out", date: todayIso, isImportant: true }
    ],
    applicationFees: [{ category: "General", fee: "₹ 750/-" }],
    ageLimit: { minAge: "21 Years" },
    vacancies: [{ postName: "Trained Graduate Teacher (TGT) & PGT", totalPosts: "15,198 Posts", eligibility: "B.Ed + PG/Graduate." }],
    howToApplySteps: [
      "Open upsessb.pariksha.nic.in.",
      "Select your subject (e.g., Mathematics, Hindi, Science, Social Science) and download PDF."
    ],
    importantLinks: [
      { title: "Download UP TGT PGT Result & Cutoff PDF", url: "https://upsessb.pariksha.nic.in", isPrimary: true, type: "result" }
    ],
    fullDescription: `# UP TGT PGT Teacher Recruitment Final Result 2026

UPSESSB has published final merit lists and college preference allotment lists.`,
    faqs: [
      { question: "Where to download subject-wise panel list?", answer: "Available at upsessb.pariksha.nic.in." }
    ],
    metaTitle: "UP TGT PGT Teacher Result 2026 Subject Wise Cutoff PDF Download",
    metaDescription: "Check UP TGT PGT Result 2026 at upsessb.pariksha.nic.in.",
    keywords: ["UP TGT Result 2026", "UP PGT Result Cutoff"]
  },
  {
    id: "rrb-group-d-cbt-result-scorecard-2026",
    title: "🏆 [Scorecard & PET List] Railway RRB Group D Level-1 CBT Result 2026",
    slug: "rrb-group-d-cbt-result-scorecard-2026",
    category: "results",
    organization: "Railway Recruitment Cell (RRC / RRB)",
    state: "All India",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-11-30",
    shortInfo: "RRBs have uploaded the CBT examination scorecards, percentile normalized scores, and shortlist for Physical Efficiency Test (PET).",
    totalVacancies: "1,03,769 Posts",
    qualificationRequired: ["10th Pass or ITI"],
    importantDates: [
      { event: "CBT Result Out", date: todayIso, isImportant: true }
    ],
    applicationFees: [{ category: "General", fee: "₹ 500/-" }],
    ageLimit: { minAge: "18 Years", maxAge: "33 Years" },
    vacancies: [{ postName: "Track Maintainer Grade IV, Helper, Assistant Pointsman", totalPosts: "1,03,769 Posts", eligibility: "10th Pass / ITI." }],
    howToApplySteps: [
      "Open regional RRC/RRB portal.",
      "Enter Registration Number and DOB to view Percentile Score and PET Eligibility."
    ],
    importantLinks: [
      { title: "Download RRB Group D CBT Result & Scorecard", url: "https://indianrailways.gov.in", isPrimary: true, type: "result" }
    ],
    fullDescription: `# Railway RRB Group D Level-1 CBT Result & Scorecard 2026

RRC has published normalized percentile scorecards and PET physical ground schedule.`,
    faqs: [
      { question: "What is PET criteria for male candidates?", answer: "35kg weight carry for 100m in 2 mins + 1000m run in 4 mins 15 secs." }
    ],
    metaTitle: "RRB Group D CBT Result 2026 Download Percentile Scorecard Link",
    metaDescription: "Check RRB Group D Level 1 CBT Result 2026 and PET shortlist.",
    keywords: ["RRB Group D Result 2026", "Group D Scorecard Link"]
  },
  {
    id: "indian-navy-agniveer-ssr-mr-result-2026",
    title: "🏆 [Stage 1 Result Out] Indian Navy Agniveer SSR & MR Result 2026",
    slug: "indian-navy-agniveer-ssr-mr-result-2026",
    category: "results",
    organization: "Join Indian Navy",
    state: "All India",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-10-31",
    shortInfo: "Indian Navy has published written exam result and Stage-2 PFT call letter for Agniveer SSR and MR 01/2026 batch.",
    totalVacancies: "4,000 Posts",
    qualificationRequired: ["10th Pass (MR) / 12th with Maths & Physics (SSR)"],
    importantDates: [
      { event: "Written Exam Result Out", date: todayIso, isImportant: true }
    ],
    applicationFees: [{ category: "All Candidates", fee: "₹ 550/-" }],
    ageLimit: { minAge: "17.5 Years", maxAge: "21 Years" },
    vacancies: [{ postName: "Agniveer SSR & Agniveer MR", totalPosts: "4,000 Posts", eligibility: "10th / 12th Pass." }],
    howToApplySteps: [
      "Login at agniveernavy.cdac.in.",
      "View state-wise cutoff and download Stage 2 PFT admit card."
    ],
    importantLinks: [
      { title: "Download Indian Navy Agniveer Result & PFT Pass", url: "https://agniveernavy.cdac.in", isPrimary: true, type: "result" }
    ],
    fullDescription: `# Indian Navy Agniveer SSR & MR Result 2026

Indian Navy has announced written test results for Agniveer 01/2026 intake.`,
    faqs: [
      { question: "Where is Stage 2 PFT conducted?", answer: "At designated INS / Zonal recruitment centers." }
    ],
    metaTitle: "Indian Navy Agniveer SSR MR Result 2026 Download Stage 2 Call Letter",
    metaDescription: "Check Indian Navy Agniveer SSR & MR Result 2026 at agniveernavy.cdac.in.",
    keywords: ["Indian Navy Agniveer Result", "Navy SSR MR Cutoff"]
  },
  {
    id: "nta-cuet-ug-result-percentile-scorecard-2026",
    title: "🏆 [Scorecard Out] NTA CUET UG Result & Normalized Scorecard 2026",
    slug: "nta-cuet-ug-result-percentile-scorecard-2026",
    category: "results",
    organization: "National Testing Agency (NTA)",
    state: "All India",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-08-31",
    shortInfo: "NTA has declared the Common University Entrance Test (CUET UG) results along with subject-wise normalized scorecards.",
    totalVacancies: "UG Central University Admissions",
    qualificationRequired: ["12th Pass / Appearing"],
    importantDates: [
      { event: "NTA Scorecard Released", date: todayIso, isImportant: true }
    ],
    applicationFees: [{ category: "General", fee: "₹ 1,000/-" }],
    ageLimit: { minAge: "No Age Limit" },
    vacancies: [{ postName: "CUET UG Entrance Scorecard for BA, B.Sc, B.Com, BBA", totalPosts: "Admissions", eligibility: "12th Pass." }],
    howToApplySteps: [
      "Open cuetug.nta.online.",
      "Login with Application No and Password to view NTA Score Card."
    ],
    importantLinks: [
      { title: "Download NTA CUET UG Scorecard Direct Link", url: "https://cuetug.nta.online", isPrimary: true, type: "result" }
    ],
    fullDescription: `# NTA CUET UG Result & Normalized Scorecard 2026

NTA has published equi-percentile normalized scores for central university admissions.`,
    faqs: [
      { question: "How to apply for DU CSAS counselling?", answer: "Use your CUET UG Application Number on ugadmission.uod.ac.in." }
    ],
    metaTitle: "CUET UG Result 2026 Download NTA Scorecard Direct Link cuetug.nta.online",
    metaDescription: "Check NTA CUET UG Result 2026 and download normalized scorecard.",
    keywords: ["CUET UG Result 2026", "NTA CUET Scorecard"]
  },
  {
    id: "jee-main-session-2-result-air-2026",
    title: "🏆 [AIR Rank List Out] JEE Main Session 2 Final Result & NTA Scorecard 2026",
    slug: "jee-main-session-2-result-air-2026",
    category: "results",
    organization: "National Testing Agency (NTA)",
    state: "All India",
    postDate: todayIso,
    originalPostDate: todayIso,
    publishedAt: todayIso,
    syncedAt: new Date().toISOString(),
    lastDate: "2026-07-31",
    shortInfo: "NTA has declared JEE Main Session 2 final results, NTA scorecards, category-wise JEE Advanced cutoffs, and All India Ranks (AIR).",
    totalVacancies: "NITs / IIITs / CFTIs / JEE Advanced Qualification",
    qualificationRequired: ["12th Pass with Physics, Chemistry & Mathematics"],
    importantDates: [
      { event: "Final AIR & NTA Score Released", date: todayIso, isImportant: true }
    ],
    applicationFees: [{ category: "General Male", fee: "₹ 1,000/-" }],
    ageLimit: { minAge: "Passed 12th in 2024, 2025, or 2026" },
    vacancies: [{ postName: "B.E. / B.Tech & B.Arch / B.Planning Entrance", totalPosts: "AIR Ranks", eligibility: "12th PCM." }],
    howToApplySteps: [
      "Visit jeemain.nta.ac.in.",
      "Login with Application Number and DOB to view NTA Score & Category AIR."
    ],
    importantLinks: [
      { title: "Download JEE Main Session 2 Final Scorecard Link 1", url: "https://jeemain.nta.ac.in", isPrimary: true, type: "result" }
    ],
    fullDescription: `# JEE Main Session 2 Result & All India Rank List 2026

NTA has declared final NTA scores and JEE Advanced qualifying cutoff percentiles.`,
    faqs: [
      { question: "What is the JEE Advanced qualifying cutoff for UR category?", answer: "Declared on official NTA scorecard sheet." }
    ],
    metaTitle: "JEE Main Session 2 Result 2026 NTA Scorecard Download jeemain.nta.ac.in",
    metaDescription: "Check JEE Main Session 2 Result 2026 and All India Rank.",
    keywords: ["JEE Main Result 2026", "NTA JEE Scorecard"]
  }
];

// Perform injection into src/data/mockPosts.ts
const mockPostsPath = path.join(__dirname, '..', 'src', 'data', 'mockPosts.ts');
let fileContent = fs.readFileSync(mockPostsPath, 'utf8');

// Find insertion point right after `export const INITIAL_POSTS: Post[] = [`
const initialPostsIdx = fileContent.indexOf('export const INITIAL_POSTS: Post[] = [');
if (initialPostsIdx !== -1) {
  const insertPos = initialPostsIdx + 'export const INITIAL_POSTS: Post[] = ['.length;
  
  const allNewPosts = [...admitCardPosts, ...resultPosts];
  const newPostsJsonString = allNewPosts.map(p => '\n  ' + JSON.stringify(p, null, 2)).join(',') + ',';
  
  const updatedContent = fileContent.slice(0, insertPos) + newPostsJsonString + fileContent.slice(insertPos);
  fs.writeFileSync(mockPostsPath, updatedContent, 'utf8');
  console.log(`Successfully injected ${allNewPosts.length} rich Admit Card and Result posts into mockPosts.ts!`);
} else {
  console.error("Could not find export const INITIAL_POSTS in mockPosts.ts");
}
