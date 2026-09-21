import React, { useState } from 'react';
import { MessageSquare, Star, Send, CheckCircle2, Sparkles, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import { safeSetLocalStorage, safeGetLocalStorage } from '../utils/safeStorage';

interface FeedbackBoxProps {
  title?: string;
  targetId?: string; // e.g. post id or quiz id
  targetType?: 'blog' | 'quiz' | 'general' | 'current-affairs';
  language?: 'en' | 'hi';
}

export const FeedbackBox: React.FC<FeedbackBoxProps> = ({
  title,
  targetId = 'general',
  targetType = 'general',
  language = 'en',
}) => {
  const storageKey = `feedback_submitted_${targetType}_${targetId}`;
  
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(() => {
    return !!safeGetLocalStorage(storageKey, false);
  });

  const tags = language === 'hi' 
    ? ['बहुत उपयोगी (Very Helpful)', 'उत्कृष्ट व्याख्या (Great Explanation)', 'सुझाव (Suggestion)', 'त्रुटि सुधार (Typo / Error)', 'अन्य (Other)']
    : ['Very Helpful', 'Great Explanation', 'Needs Improvement', 'Typo / Error', 'Suggest New Topic'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 && !comment.trim() && !selectedTag) return;

    setIsSubmitting(true);

    const feedbackObj = {
      id: `fb_${Date.now()}`,
      targetId,
      targetType,
      rating,
      tag: selectedTag,
      comment: comment.trim(),
      name: userName.trim() || 'Anonymous Student',
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackObj),
      }).catch(() => null);
    } catch (err) {
      console.warn("Feedback API save notice:", err);
    }

    // Save to local storage list
    const existingList = safeGetLocalStorage<any[]>('all_user_feedbacks', []);
    existingList.unshift(feedbackObj);
    safeSetLocalStorage('all_user_feedbacks', existingList);
    safeSetLocalStorage(storageKey, true);

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div id="feedback-section" className="w-full bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 rounded-2xl border border-blue-200/80 p-5 sm:p-6 shadow-sm my-6 transition-all">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-blue-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#0F4C81] text-white rounded-xl shadow-xs">
            <MessageSquare className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
              {language === 'hi' ? 'आपकी राय / प्रतिक्रिया (User Feedback)' : 'Was this helpful? Leave Feedback'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {title ? `Feedback for: ${title.slice(0, 45)}...` : (language === 'hi' ? 'सामग्री को और बेहतर बनाने के लिए अपनी राय दें' : 'Help us improve our study materials & quiz content')}
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#0F4C81] bg-blue-100/80 px-2.5 py-1 rounded-full border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
          <span>{language === 'hi' ? 'परीक्षार्थियों की आवाज' : 'Student Feedback'}</span>
        </span>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-2 animate-fade-in">
          <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-black text-emerald-900">
            {language === 'hi' ? 'आपकी प्रतिक्रिया के लिए धन्यवाद!' : 'Thank you for your valuable feedback!'}
          </h4>
          <p className="text-xs text-emerald-700 font-medium">
            {language === 'hi'
              ? 'आपका फीडबैक सफलतापूर्वक दर्ज हो गया है। हम इसे जल्द समीक्षा करेंगे।'
              : 'Your response has been saved. We continuously update content based on student suggestions.'}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950 pt-1 cursor-pointer"
          >
            {language === 'hi' ? 'एक और फीडबैक दें' : 'Submit another feedback'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3.5 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700">
              {language === 'hi' ? 'इस पोस्ट / क्विज को रेट करें:' : 'Rate your experience:'}
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer focus:outline-hidden"
                    title={`Rate ${star} star`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        active ? 'fill-amber-400 text-amber-500' : 'text-slate-300 hover:text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
              {rating > 0 && (
                <span className="text-xs font-black text-amber-600 ml-2">
                  {rating}/5
                </span>
              )}
            </div>
          </div>

          {/* Quick Tag Pills */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              {language === 'hi' ? 'मुख्य श्रेणी चुनें (Select Tag):' : 'Choose a Feedback Category:'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTag(selectedTag === t ? '' : t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    selectedTag === t
                      ? 'bg-[#0F4C81] text-white border-[#0F4C81] shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Comment Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              {language === 'hi' ? 'अपना सुझाव या टिप्पणी लिखें:' : 'Detailed Comments or Suggestions:'}
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'क्या प्रश्न/लेख में कोई त्रुटि है या कोई सुधार चाहते हैं? यहाँ लिखें...'
                  : 'Let us know how we can make this question or article better...'
              }
              className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:ring-2 focus:ring-[#0F4C81] focus:outline-hidden resize-none"
            ></textarea>
          </div>

          {/* Name Optional & Submit */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={language === 'hi' ? 'आपका नाम (वैकल्पिक / Optional)' : 'Your Name (Optional)'}
              className="w-full sm:w-64 p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-[#0F4C81] focus:outline-hidden"
            />

            <button
              type="submit"
              disabled={isSubmitting || (rating === 0 && !comment.trim() && !selectedTag)}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#FF6B00] hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? (language === 'hi' ? 'भेजा जा रहा है...' : 'Sending...') : (language === 'hi' ? 'फीडबैक जमा करें' : 'Submit Feedback')}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
