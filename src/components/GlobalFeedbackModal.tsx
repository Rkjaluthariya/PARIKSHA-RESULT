import React from 'react';
import { X, MessageSquare, Sparkles } from 'lucide-react';
import { FeedbackBox } from './FeedbackBox';

interface GlobalFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'hi';
  targetType?: 'blog' | 'quiz' | 'general' | 'current-affairs';
  targetId?: string;
  title?: string;
}

export const GlobalFeedbackModal: React.FC<GlobalFeedbackModalProps> = ({
  isOpen,
  onClose,
  language = 'en',
  targetType = 'general',
  targetId = 'general_user_feedback',
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative my-8 animate-scaleUp">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0F4C81] to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-400/30">
              <MessageSquare className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-black flex items-center gap-2">
                <span>{language === 'hi' ? 'छात्र प्रतिक्रिया एवं सुझाव' : 'Student Feedback & Suggestions'}</span>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Live
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {language === 'hi' ? 'ब्लॉग, क्विज़ और परीक्षा अपडेट सुधार हेतु अपनी राय दें' : 'Help us improve blogs, quiz questions, and study materials'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-xl transition-colors text-slate-300 hover:text-white"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 bg-slate-50 max-h-[80vh] overflow-y-auto">
          <FeedbackBox
            targetType={targetType}
            targetId={targetId}
            title={title || (language === 'hi' ? 'सामान्य पोर्टल फीडबैक' : 'General Portal Feedback')}
            language={language}
          />
        </div>
      </div>
    </div>
  );
};
