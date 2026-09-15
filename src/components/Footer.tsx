import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Mail, Globe, Heart, ExternalLink, Send, MessageSquare } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface FooterProps {
  onSelectCategory: (cat: any) => void;
  onOpenAdmin?: () => void;
  onOpenPWAAlerts?: () => void;
  onOpenFeedback?: () => void;
  onOpenLegalPage?: (tab: 'terms' | 'privacy' | 'disclaimer' | 'contact') => void;
  onOpenSalaryCalc?: () => void;
  onOpenCutOffPredictor?: () => void;
  onOpenSyllabusChecklist?: () => void;
  onOpenAgeCalc?: () => void;
  onOpenPhotoResizer?: () => void;
  onOpenRankPredictor?: () => void;
  isAdminMode?: boolean;
  language?: 'en' | 'hi';
}

export const Footer: React.FC<FooterProps> = ({ 
  onSelectCategory, 
  onOpenAdmin, 
  onOpenPWAAlerts, 
  onOpenFeedback, 
  onOpenLegalPage, 
  onOpenSalaryCalc,
  onOpenCutOffPredictor,
  onOpenSyllabusChecklist,
  onOpenAgeCalc,
  onOpenPhotoResizer,
  onOpenRankPredictor,
  isAdminMode, 
  language = 'en' 
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-10 pb-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Top Footer Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="bg-white p-2.5 rounded-xl inline-block">
              <Logo showTagline={false} language={language} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {getTranslation("India's premier portal for verified Government Job notifications, Exam Results, Admit Cards, Answer Keys, Current Affairs, and Admission alerts.", language)}
            </p>

            {/* Aspirant Tools SEO Links */}
            <div className="pt-2 space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
                🛠️ {language === 'hi' ? 'स्मार्ट कैंडिडेट टूल' : 'Aspirant Smart Tools'}
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
                <a
                  href="/tools/photo-signature-resizer"
                  onClick={(e) => { e.preventDefault(); onOpenPhotoResizer?.(); }}
                  className="bg-slate-800 hover:bg-slate-700 text-emerald-300 px-2 py-0.5 rounded border border-slate-700 transition-colors"
                >
                  Photo Resizer
                </a>
                <a
                  href="/tools/exam-rank-predictor"
                  onClick={(e) => { e.preventDefault(); onOpenRankPredictor?.(); }}
                  className="bg-slate-800 hover:bg-slate-700 text-indigo-300 px-2 py-0.5 rounded border border-slate-700 transition-colors"
                >
                  Rank Predictor
                </a>
                <a
                  href="/tools/sarkari-salary-calculator"
                  onClick={(e) => { e.preventDefault(); onOpenSalaryCalc?.(); }}
                  className="bg-slate-800 hover:bg-slate-700 text-teal-300 px-2 py-0.5 rounded border border-slate-700 transition-colors"
                >
                  Salary Calc
                </a>
                <a
                  href="/tools/exam-cut-off-predictor"
                  onClick={(e) => { e.preventDefault(); onOpenCutOffPredictor?.(); }}
                  className="bg-slate-800 hover:bg-slate-700 text-blue-300 px-2 py-0.5 rounded border border-slate-700 transition-colors"
                >
                  Cut-Off Predictor
                </a>
                <a
                  href="/tools/syllabus-checklist"
                  onClick={(e) => { e.preventDefault(); onOpenSyllabusChecklist?.(); }}
                  className="bg-slate-800 hover:bg-slate-700 text-purple-300 px-2 py-0.5 rounded border border-slate-700 transition-colors"
                >
                  Syllabus Tracker
                </a>
                <a
                  href="/tools/age-calculator"
                  onClick={(e) => { e.preventDefault(); onOpenAgeCalc?.(); }}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-2 py-0.5 rounded border border-slate-700 transition-colors"
                >
                  Age Calculator
                </a>
              </div>
            </div>
          </div>

          {/* Quick Category Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase text-white tracking-wider">{getTranslation("Fast Links", language)}</h4>
            <ul className="space-y-1.5 text-xs font-medium text-slate-400">
              <li>
                <button onClick={() => onSelectCategory('latest-jobs')} className="hover:text-amber-400 transition-colors">
                  {getTranslation("Latest Government Jobs", language)}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('admit-card')} className="hover:text-amber-400 transition-colors">
                  {getTranslation("Download Exam Admit Cards", language)}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('results')} className="hover:text-amber-400 transition-colors">
                  {getTranslation("Check Sarkari Results & Cutoff", language)}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('answer-key')} className="hover:text-amber-400 transition-colors">
                  {getTranslation("Answer Keys & Objections", language)}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('scholarships')} className="hover:text-amber-400 transition-colors">
                  {getTranslation("Govt Scholarships Scheme", language)}
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Organizations */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase text-white tracking-wider">{getTranslation("Top Recruiters", language)}</h4>
            <ul className="space-y-1.5 text-xs font-medium text-slate-400">
              <li>{getTranslation("Staff Selection Commission (SSC)", language)}</li>
              <li>{getTranslation("Railway Recruitment Board (RRB)", language)}</li>
              <li>{getTranslation("Union Public Service Commission (UPSC)", language)}</li>
              <li>{getTranslation("Uttar Pradesh Police Board (UPPRPB)", language)}</li>
              <li>{getTranslation("Central Selection Board of Constable (CSBC Bihar)", language)}</li>
              <li>{getTranslation("Institute of Banking Personnel Selection (IBPS)", language)}</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase text-white tracking-wider">{getTranslation("Pages & Legal Info", language)}</h4>
            <ul className="space-y-1.5 text-xs font-medium text-slate-400">
              {onOpenLegalPage && (
                <>
                  <li>
                    <button onClick={() => onOpenLegalPage('privacy')} className="hover:text-amber-400 transition-colors">
                      {getTranslation("Privacy Policy", language)}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onOpenLegalPage('terms')} className="hover:text-amber-400 transition-colors">
                      {getTranslation("Terms & Conditions", language)}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onOpenLegalPage('disclaimer')} className="hover:text-amber-400 transition-colors">
                      {getTranslation("Disclaimer & Official Sources", language)}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onOpenLegalPage('contact')} className="hover:text-amber-400 transition-colors">
                      {getTranslation("Contact Us & Helpdesk", language)}
                    </button>
                  </li>
                </>
              )}
              {onOpenFeedback && (
                <li>
                  <button onClick={onOpenFeedback} className="text-amber-400 font-bold hover:text-amber-300 transition-colors flex items-center gap-1">
                    <span>💬 {language === 'hi' ? 'छात्र फीडबैक दर्ज करें' : 'Submit Feedback & Suggestions'}</span>
                  </button>
                </li>
              )}
            </ul>
            <div className="pt-2 space-y-2">
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://t.me/pariksha_result_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-black transition-all shadow-sm border border-sky-400/40 hover:scale-105"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'Telegram चैनल' : 'Telegram Channel'}</span>
                </a>
              </div>

              <div>
                <a href="mailto:parikshaa.results@gmail.com" className="text-[11px] text-slate-300 font-semibold hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" /> parikshaa.results@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Disclaimer Box - Mandatory as requested in prompt */}
        <div id="contact-section" className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 text-xs text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase text-[11px] tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{getTranslation("Disclaimer", language)}</span>
          </div>
          <p className="leading-relaxed font-medium">
            {getTranslation("Pariksha Result is an independent educational information portal. We are not affiliated with any government organization. Candidates should always verify information from the respective official website before taking any action.", language)}
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-2">
          <div 
            onDoubleClick={onOpenAdmin}
            className="cursor-default select-none"
            title="Double-click for Admin Access"
          >
            {getTranslation("© 2026 Pariksha Result. All Rights Reserved.", language)}
          </div>
          <div className="flex items-center gap-3 text-[11px] flex-wrap justify-center sm:justify-end">
            {onOpenPWAAlerts && (
              <button
                type="button"
                onClick={onOpenPWAAlerts}
                className="text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30"
              >
                <span>{getTranslation("🔔 Job Push Alerts (PWA)", language)}</span>
              </button>
            )}
            <span>{getTranslation("Fastest Government Job, Result & Current Affairs Updates", language)}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
