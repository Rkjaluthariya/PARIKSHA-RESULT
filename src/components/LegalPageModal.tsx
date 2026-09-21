import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, Mail, AlertTriangle, CheckCircle2, X, Send, MapPin, Phone, Building2 } from 'lucide-react';

export type LegalPageType = 'terms' | 'privacy' | 'disclaimer' | 'contact';

interface LegalPageModalProps {
  isOpen: boolean;
  initialTab?: LegalPageType;
  onClose: () => void;
}

export const LegalPageModal: React.FC<LegalPageModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<LegalPageType>(initialTab);
  
  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Job Update Correction');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    
    const subject = encodeURIComponent(`[Pariksha Result Inquiry] ${contactSubject}`);
    const body = encodeURIComponent(
      `Name: ${contactName}\n` +
      `Email: ${contactEmail}\n` +
      `Subject: ${contactSubject}\n\n` +
      `Message:\n${contactMessage}`
    );
    const mailtoUrl = `mailto:parikshaa.results@gmail.com?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoUrl;

    setContactSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setContactSubmitted(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full h-[90vh] max-h-[750px] flex flex-col overflow-hidden shadow-2xl text-white relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0F4C81] to-slate-900 p-4 sm:p-5 border-b border-blue-900/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 border border-amber-400/40 p-2 rounded-xl text-amber-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-300 tracking-wide">
                Pariksha Result — Legal & Information Center
              </h3>
              <p className="text-xs text-slate-300">Terms, Privacy Policy, Disclaimer & Support</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="bg-slate-950 border-b border-slate-800 px-3 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto flex-shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'terms'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms & Conditions</span>
          </button>

          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'disclaimer'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Disclaimer</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'contact'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact Us</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-lg font-black text-amber-300 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-400" />
                  <span>Privacy Policy — Pariksha Result 2026</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Last Updated: August 2026</p>
              </div>

              <div className="space-y-4">
                <section className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-2">
                  <h3 className="font-extrabold text-white text-sm">1. Introduction</h3>
                  <p>
                    At <strong>Pariksha Result 2026</strong> (accessible at <code className="text-amber-300 font-mono">pariksha-result.vercel.app</code>), the privacy of our visitors is one of our top priorities. This Privacy Policy document contains types of information that is collected and recorded by Pariksha Result and how we use it.
                  </p>
                </section>

                <section className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-2">
                  <h3 className="font-extrabold text-white text-sm">2. Information We Collect & Local Storage</h3>
                  <p>
                    Pariksha Result operates as a modern Web App and Progressive Web Application (PWA). We minimize data collection:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                    <li><strong>Local Bookmarks & Saved Items:</strong> Your bookmarked Sarkari job posts, syllabus files, and current affairs articles are stored locally inside your web browser’s <code className="text-amber-300 font-mono">localStorage</code>. They are never transmitted to external servers.</li>
                    <li><strong>Push Notification Permissions:</strong> If you explicitly opt-in to receive Push Notifications, a anonymous browser push token is registered locally to dispatch real-time alerts for exam results and job updates.</li>
                    <li><strong>Log Files:</strong> Like standard web servers, we maintain server logs including IP addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and number of clicks for performance diagnostics.</li>
                  </ul>
                </section>

                <section className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-2">
                  <h3 className="font-extrabold text-white text-sm">3. Cookies & Advertising Partners</h3>
                  <p>
                    Pariksha Result may display third-party advertisements (such as Google AdSense or compliant ad networks) to support site maintenance. Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons in their respective advertisements and links that appear on Pariksha Result.
                  </p>
                </section>

                <section className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-2">
                  <h3 className="font-extrabold text-white text-sm">4. Data Security & Children's Privacy</h3>
                  <p>
                    We implement standard SSL encryption (<code className="text-emerald-400 font-mono">HTTPS</code>) to protect data integrity. Pariksha Result does not knowingly collect any Personal Identifiable Information from children under the age of 13.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-lg font-black text-amber-300 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span>Terms and Conditions</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Please read these terms carefully before using our portal</p>
              </div>

              <div className="space-y-4">
                <section className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-2">
                  <h3 className="font-extrabold text-white text-sm">1. Acceptance of Terms</h3>
                  <p>
                    By accessing and using <strong>Pariksha Result</strong>, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this portal.
                  </p>
                </section>

                <section className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-2">
                  <h3 className="font-extrabold text-white text-sm">2. Portal Purpose & Content Accuracy</h3>
                  <p>
                    Pariksha Result provides news, summaries, exam syllabus breakdowns, admit card download links, and result updates for various competitive examinations in India (e.g., SSC, UPSC, RRB, Banking, State Police, Defense).
                  </p>
                  <p className="text-amber-200 font-semibold bg-amber-950/40 p-2.5 rounded-lg border border-amber-500/30">
                    ⚠️ While we strive to ensure absolute accuracy, official notifications published on government websites (e.g., ssc.gov.in, upsc.gov.in, rrbcdg.gov.in) remain the sole legal authority.
                  </p>
                </section>

                <section className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-2">
                  <h3 className="font-extrabold text-white text-sm">3. Intellectual Property & Fair Use</h3>
                  <p>
                    All logos, official organization names (e.g. SSC, UPSC, IBPS), and trademark references belong to their respective government bodies and institutions. Content compiled on Pariksha Result is intended for candidate educational awareness under Fair Use guidelines.
                  </p>
                </section>

                <section className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-2">
                  <h3 className="font-extrabold text-white text-sm">4. Limitation of Liability</h3>
                  <p>
                    Pariksha Result shall not be held responsible for any loss, delay in online form submission, technical error on third-party government servers, or discrepancy in examination dates. Candidates are strongly advised to cross-check official PDF notifications.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 3: DISCLAIMER */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-lg font-black text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>Important Legal Disclaimer</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Official Non-Affiliation Notice</p>
              </div>

              <div className="space-y-4">
                <div className="bg-amber-950/60 border-2 border-amber-500/60 p-4 sm:p-5 rounded-2xl text-amber-100 space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 text-amber-300 font-black text-sm uppercase">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <span>No Government Affiliation Declaration</span>
                  </div>
                  <p className="font-medium leading-relaxed">
                    <strong>Pariksha Result (pariksha-result.vercel.app) is an independent, non-government educational web portal.</strong> We are NOT associated, affiliated, authorized, endorsed by, or in any way officially connected with the Government of India, any State Government, Union Public Service Commission (UPSC), Staff Selection Commission (SSC), Railway Recruitment Board (RRB), or any other government institution.
                  </p>
                </div>

                <section className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-2">
                  <h3 className="font-extrabold text-white text-sm">Primary Information Sources</h3>
                  <p>
                    All job vacancy details, exam schedules, admit card links, and answer keys aggregated on this site are sourced from publicly available official government recruitment portals, including:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300 pt-1">
                    <li className="bg-slate-900 p-2 rounded border border-slate-700">• SSC Portal: ssc.gov.in</li>
                    <li className="bg-slate-900 p-2 rounded border border-slate-700">• UPSC Portal: upsc.gov.in</li>
                    <li className="bg-slate-900 p-2 rounded border border-slate-700">• Indian Railways: indianrailways.gov.in</li>
                    <li className="bg-slate-900 p-2 rounded border border-slate-700">• NTA Exams: nta.ac.in</li>
                    <li className="bg-slate-900 p-2 rounded border border-slate-700">• UP Police: uppbpb.gov.in</li>
                    <li className="bg-slate-900 p-2 rounded border border-slate-700">• Bihar CSBC: csbc.bih.nic.in</li>
                  </ul>
                </section>

                <section className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-2">
                  <h3 className="font-extrabold text-white text-sm">No Legal Guarantee</h3>
                  <p>
                    While we maintain rigorous double-verification standards, candidates must always verify details from the original official PDF advertisement before making payments or submitting online applications.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT US */}
          {activeTab === 'contact' && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-lg font-black text-amber-300 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-amber-400" />
                  <span>Contact Us & Helpdesk</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Have a query, job correction, or feedback? Send us a message.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Left Info Column */}
                <div className="md:col-span-1 space-y-3">
                  <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl space-y-3">
                    <div className="flex items-center gap-2.5 text-amber-300 font-bold text-xs uppercase">
                      <Mail className="w-4 h-4 text-amber-400" /> Official Email
                    </div>
                    <p className="text-xs font-mono text-slate-200 break-all bg-slate-900 p-2 rounded border border-slate-700/60">
                      parikshaa.results@gmail.com
                    </p>
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2.5 text-amber-300 font-bold text-xs uppercase">
                      <Building2 className="w-4 h-4 text-amber-400" /> Portal Office
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Pariksha Result Media Desk,<br />
                      New Delhi - 110001, India
                    </p>
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2.5 text-amber-300 font-bold text-xs uppercase">
                      <Phone className="w-4 h-4 text-amber-400" /> Response Time
                    </div>
                    <p className="text-xs text-slate-300">
                      We respond to all candidate inquiries, correction notices, and DMCA requests within <strong>24–48 hours</strong>.
                    </p>
                  </div>
                </div>

                {/* Right Form Column */}
                <div className="md:col-span-2 bg-slate-800/60 border border-slate-700 p-4 sm:p-5 rounded-2xl">
                  {contactSubmitted ? (
                    <div className="bg-emerald-950/80 border border-emerald-500/60 p-6 rounded-xl text-center space-y-3 animate-fade-in">
                      <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-black text-emerald-300">Message Received Successfully!</h4>
                      <p className="text-xs text-emerald-100 max-w-sm mx-auto">
                        Thank you for reaching out. Our support team will review your message regarding <strong>"{contactSubject}"</strong> and follow up via email shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <h4 className="font-extrabold text-white text-sm">Send Direct Inquiry / Correction Request</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300">Your Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh Kumar"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300">Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. ramesh@gmail.com"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Subject Category</label>
                        <select
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        >
                          <option value="Job Update Correction">Job Notification Correction Request</option>
                          <option value="Broken Official Link">Report Broken Download Link</option>
                          <option value="Admit Card / Result Query">Admit Card or Result Issue</option>
                          <option value="DMCA Copyright Notice">DMCA / Copyright Notice</option>
                          <option value="Advertising & Partnership">Advertising & Sponsorship</option>
                          <option value="General Feedback">General Feedback</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Detailed Message *</label>
                        <textarea
                          rows={4}
                          required
                          placeholder="Describe your query or mention the job post title you are referencing..."
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                      >
                        <Send className="w-4 h-4 text-slate-950" />
                        <span>Submit Inquiry</span>
                      </button>
                    </form>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 flex-shrink-0">
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Pariksha Result Official Legal Pages
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
