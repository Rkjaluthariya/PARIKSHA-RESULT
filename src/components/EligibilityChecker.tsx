import React, { useState } from 'react';
import { Post, StateType } from '../types';
import { PostCard } from './PostCard';
import { Filter, CheckCircle2, GraduationCap, Building2 } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface EligibilityCheckerProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  language?: 'en' | 'hi';
  translatedCache?: Record<string, any>;
}

const QUALIFICATIONS_EN = [
  '10th Pass (Matriculation)',
  '10+2 Intermediate (12th Pass)',
  'Bachelor Degree (Graduation)',
  'Post Graduation (Master Degree)',
  'B.Tech / B.E. (Engineering)',
  'B.Ed / D.El.Ed (Teaching)',
  'ITI / Diploma'
];

const QUALIFICATIONS_HI = [
  { val: '10th Pass (Matriculation)', label: '10वीं पास (मैट्रिक)' },
  { val: '10+2 Intermediate (12th Pass)', label: '12वीं पास (इंटरमीडिएट)' },
  { val: 'Bachelor Degree (Graduation)', label: 'स्नातक डिग्री (ग्रेजुएशन)' },
  { val: 'Post Graduation (Master Degree)', label: 'परास्नातक (पोस्ट ग्रेजुएशन)' },
  { val: 'B.Tech / B.E. (Engineering)', label: 'बीटेक / बीई (इंजीनियरिंग)' },
  { val: 'B.Ed / D.El.Ed (Teaching)', label: 'बी.एड / डी.एल.एड (शिक्षक)' },
  { val: 'ITI / Diploma', label: 'आईटीआई / डिप्लोमा' }
];

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  posts,
  onSelectPost,
  language = 'en',
  translatedCache
}) => {
  const [selectedQualification, setSelectedQualification] = useState('');
  const [selectedState, setSelectedState] = useState<StateType>('All India');
  const [hasChecked, setHasChecked] = useState(false);

  const filteredPosts = posts.filter((post) => {
    if (!selectedQualification) return false;

    // Qualification match
    const qualMatch =
      post.qualificationRequired?.some((q) =>
        q.toLowerCase().includes(selectedQualification.toLowerCase().split(' ')[0])
      ) ||
      post.shortInfo.toLowerCase().includes(selectedQualification.toLowerCase().split(' ')[0]) ||
      post.vacancies.some((v) =>
        v.eligibility.toLowerCase().includes(selectedQualification.toLowerCase().split(' ')[0])
      );

    // State match
    const stateMatch = selectedState === 'All India' || post.state === selectedState;

    return qualMatch && stateMatch;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="max-w-md">
          <div className="flex items-center gap-2 font-black text-base text-slate-900">
            <GraduationCap className="w-5 h-5 text-[#FF6B00]" />
            <span>{language === 'hi' ? 'सरकारी नौकरी पात्रता जांच (Eligibility Matcher)' : 'Sarkari Job Eligibility Matcher'}</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {language === 'hi'
              ? 'अपनी योग्यता और राज्य चुनें और जानें कि आप किन सरकारी नौकरियों के लिए पात्र हैं।'
              : 'Select your qualifications and state to check which government jobs you are eligible to apply for.'}
          </p>
        </div>

        {/* Filters and Trigger Button */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-700">{language === 'hi' ? 'शैक्षणिक योग्यता:' : 'Qualification:'}</span>
            <select
              value={selectedQualification}
              onChange={(e) => {
                setSelectedQualification(e.target.value);
                setHasChecked(false); // require click to refresh or show
              }}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#0F4C81]"
            >
              <option value="">{language === 'hi' ? '-- योग्यता चुनें --' : '-- Choose Qualification --'}</option>
              {language === 'hi'
                ? QUALIFICATIONS_HI.map((q) => (
                    <option key={q.val} value={q.val}>{q.label}</option>
                  ))
                : QUALIFICATIONS_EN.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-700">{language === 'hi' ? 'राज्य:' : 'State:'}</span>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value as StateType);
                setHasChecked(false); // require click to refresh or show
              }}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#0F4C81]"
            >
              <option value="All India">{language === 'hi' ? 'अखिल भारतीय (All India)' : 'All India'}</option>
              <option value="Uttar Pradesh">{language === 'hi' ? 'उत्तर प्रदेश' : 'Uttar Pradesh'}</option>
              <option value="Bihar">{language === 'hi' ? 'बिहार' : 'Bihar'}</option>
              <option value="Rajasthan">{language === 'hi' ? 'राजस्थान' : 'Rajasthan'}</option>
              <option value="Madhya Pradesh">{language === 'hi' ? 'मध्य प्रदेश' : 'Madhya Pradesh'}</option>
              <option value="Delhi">{language === 'hi' ? 'दिल्ली' : 'Delhi'}</option>
              <option value="Haryana">{language === 'hi' ? 'हरियाणा' : 'Haryana'}</option>
            </select>
          </div>

          <button
            onClick={() => setHasChecked(true)}
            className="px-4 py-1.5 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'पात्रता जांचें' : 'Check Eligibility'}</span>
          </button>
        </div>
      </div>

      {/* Matching Posts Grid - Only display when checked */}
      {hasChecked && (
        <div className="pt-4 border-t border-slate-100 space-y-4 animate-fade-in">
          {!selectedQualification ? (
            <div className="p-6 text-center bg-amber-50 rounded-xl border border-dashed border-amber-300 text-amber-800 text-xs font-semibold">
              {language === 'hi'
                ? 'पात्रता जांचने के लिए कृपया ऊपर दिए गए ड्रॉपडाउन से अपनी शैक्षणिक योग्यता चुनें।'
                : 'Please select a specific qualification from the dropdown above first to check your eligibility.'}
            </div>
          ) : (
            <>
              <div className="text-xs font-bold text-slate-600 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {language === 'hi'
                      ? `आपकी योग्यता के अनुसार ${filteredPosts.length} सरकारी नौकरियां उपलब्ध हैं:`
                      : `Found ${filteredPosts.length} matching job opportunities for your criteria (${selectedQualification}):`}
                  </span>
                </div>
                <button
                  onClick={() => setHasChecked(false)}
                  className="text-xs text-[#0F4C81] hover:underline font-bold cursor-pointer"
                >
                  {language === 'hi' ? 'परिणाम छिपाएं' : 'Hide Results'}
                </button>
              </div>

              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onClick={onSelectPost}
                      language={language}
                      translatedCache={translatedCache}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs font-medium space-y-1">
                  <p>{language === 'hi' ? 'वर्तमान में इस योग्यता और राज्य के लिए कोई भर्ती उपलब्ध नहीं है।' : 'No specific jobs found matching this combination currently.'}</p>
                  <button
                    onClick={() => {
                      setSelectedQualification('');
                      setSelectedState('All India');
                      setHasChecked(false);
                    }}
                    className="text-[#0F4C81] font-bold underline cursor-pointer"
                  >
                    {language === 'hi' ? 'फ़िल्टर रीसेट करें' : 'Reset Filters'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
