import React, { useState, useEffect, useMemo } from 'react';
import { QuizQuestion } from '../types';
import { Award, CheckCircle2, XCircle, RotateCcw, Sparkles, HelpCircle, Loader2, RefreshCw, Clock, Zap, BookOpen, Check, ListChecks, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { INITIAL_QUIZ_QUESTIONS } from '../data/mockPosts';
import { FeedbackBox } from './FeedbackBox';

interface QuizSectionProps {
  questions?: QuizQuestion[];
  onAddGeneratedQuestions?: (newQuestions: QuizQuestion[]) => void;
  onRefreshQuiz?: () => void;
  onOpenFeedback?: () => void;
  language?: 'en' | 'hi';
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  questions = INITIAL_QUIZ_QUESTIONS,
  onAddGeneratedQuestions,
  onRefreshQuiz,
  onOpenFeedback,
  language = 'en',
}) => {
  const safeQuestions = useMemo(() => {
    return (questions && questions.length > 0) ? questions : INITIAL_QUIZ_QUESTIONS;
  }, [questions]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'quiz' | 'answer-key'>('quiz');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 10-Minute Countdown Timer State (600 seconds = 10 mins)
  const [secondsRemaining, setSecondsRemaining] = useState(() => {
    const nowSec = Math.floor(Date.now() / 1000);
    return 600 - (nowSec % 600);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const nowSec = Math.floor(Date.now() / 1000);
      const rem = 600 - (nowSec % 600);
      setSecondsRemaining(rem);

      if (rem === 600 || rem === 0) {
        if (onRefreshQuiz) {
          onRefreshQuiz();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onRefreshQuiz]);

  // Extract unique categories for subject tabs
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    set.add('All');
    safeQuestions.forEach((q) => {
      if (q.category) set.add(q.category);
    });
    return Array.from(set);
  }, [safeQuestions]);

  // Filter questions based on selected tab
  const filteredQuestions = useMemo(() => {
    if (selectedCategory === 'All') return safeQuestions;
    const res = safeQuestions.filter((q) => q.category === selectedCategory);
    return res.length > 0 ? res : safeQuestions;
  }, [safeQuestions, selectedCategory]);

  const safeIndex = Math.min(Math.max(0, currentIndex), Math.max(0, filteredQuestions.length - 1));
  const currentQ = filteredQuestions[safeIndex] || filteredQuestions[0] || safeQuestions[0];

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
  }, [selectedCategory]);

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === currentQ?.correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
  };

  const handleManualTriggerQuiz = async () => {
    setIsRefreshing(true);
    try {
      if (onRefreshQuiz) {
        await onRefreshQuiz();
      } else {
        const res = await fetch('/api/auto-sync/trigger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'quiz' })
        });
        const data = await res.json();
        if (data.success && data.addedQuiz && onAddGeneratedQuestions) {
          onAddGeneratedQuestions(data.addedQuiz);
        }
      }
      handleReset();
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const handleGenerateMoreAIQuestions = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: selectedCategory === 'All' ? 'Current Affairs 2026 & General Knowledge' : selectedCategory, count: 5 }),
      });
      const data = await res.json();
      if (data.success && data.questions && data.questions.length > 0) {
        if (onAddGeneratedQuestions) {
          onAddGeneratedQuestions(data.questions);
        }
        handleReset();
      }
    } catch (err) {
      console.error('Failed to generate quiz questions.');
    } finally {
      setLoadingAI(false);
    }
  };

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  if (!currentQ && filteredQuestions.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-5 sm:space-y-6 w-full max-w-full overflow-hidden box-border">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 font-black text-base sm:text-lg text-slate-900 leading-snug">
            <div className="p-2 bg-gradient-to-br from-[#0F4C81] to-blue-900 text-white rounded-xl shadow-xs">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <span>{language === 'hi' ? 'दैनिक करेंट अफेयर्स एवं सामान्य ज्ञान क्विज 2026' : 'Daily Current Affairs & General Knowledge Mock Test 2026'}</span>
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <Zap className="w-3 h-3 text-emerald-600 animate-pulse" />
              {language === 'hi' ? 'हर 10 मिनट में ऑटो-अपडेट' : 'Auto-Refreshes Every 10 Mins'}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            {language === 'hi'
              ? 'SSC CGL, Railway RRB NTPC, UPSC, Banking IBPS/SBI, Police एवं State PCS परीक्षाओं के लिए अति-महत्वपूर्ण प्रश्न'
              : 'Targeted High-Yield Questions for SSC CGL, Railway RRB, UPSC, Banking IBPS & State Competitive Exams'}
          </p>
        </div>

        {/* Action Controls & Countdown Timer */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Live 10-Minute Timer Badge */}
          <div className="bg-slate-900 text-amber-300 px-3 py-1.5 rounded-xl border border-amber-400/40 text-xs font-black flex items-center gap-1.5 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{language === 'hi' ? 'अगला सेट:' : 'Next Set in:'} <span className="text-white font-mono text-xs">{formattedTime}</span></span>
          </div>

          {/* Trigger Auto Sync */}
          <button
            onClick={handleManualTriggerQuiz}
            disabled={isRefreshing}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Fetch Fresh Questions Now"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#0F4C81] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? (language === 'hi' ? 'लोड हो रहा...' : 'Fetching...') : (language === 'hi' ? 'ताज़ा प्रश्न' : 'Refresh')}</span>
          </button>

          {/* AI Generator Button */}
          <button
            onClick={handleGenerateMoreAIQuestions}
            disabled={loadingAI}
            className="px-3.5 py-1.5 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {loadingAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />}
            <span>{loadingAI ? (language === 'hi' ? 'बन रहा है...' : 'Generating...') : (language === 'hi' ? '+ 5 नए AI प्रश्न' : '+ 5 AI Questions')}</span>
          </button>

          {/* Quiz Feedback Button */}
          <button
            onClick={() => {
              const el = document.getElementById('feedback-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('ring-4', 'ring-amber-400');
                setTimeout(() => el.classList.remove('ring-4', 'ring-amber-400'), 2000);
              } else if (onOpenFeedback) {
                onOpenFeedback();
              }
            }}
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer border border-amber-300"
            title="Leave Feedback or Report Error in Question"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-950" />
            <span>{language === 'hi' ? 'फीडबैक दें' : 'Quiz Feedback'}</span>
          </button>

          {/* Score Badge */}
          {viewMode === 'quiz' && (
            <span className="text-xs font-black bg-blue-50 text-[#0F4C81] border border-blue-200 px-3 py-1.5 rounded-xl">
              {language === 'hi' ? 'स्कोर' : 'Score'}: {score} / {filteredQuestions.length}
            </span>
          )}
        </div>
      </div>

      {/* Subject Tabs & Mode Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar text-xs font-bold">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0F4C81] text-white shadow-2xs font-black'
                  : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 text-xs font-bold self-start sm:self-auto flex-shrink-0">
          <button
            onClick={() => setViewMode('quiz')}
            className={`px-3 py-1 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'quiz' ? 'bg-[#FF6B00] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'लाइव मॉक टेस्ट' : 'Interactive Test'}</span>
          </button>
          <button
            onClick={() => setViewMode('answer-key')}
            className={`px-3 py-1 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'answer-key' ? 'bg-[#0F4C81] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'उत्तर कुंजी एवं व्याख्या' : 'Answer Key Sheet'}</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Interactive Flashcard Test */}
      {viewMode === 'quiz' && currentQ && (
        <div className="space-y-5">
          {/* Top Bar: Question Meta & Direct Palette Grid */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/60 p-3 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase text-[#0F4C81] bg-white px-2.5 py-1 rounded border border-blue-200 shadow-2xs">
                {currentQ.category || 'General Studies'}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {language === 'hi' ? `प्रश्न ${safeIndex + 1} / ${filteredQuestions.length}` : `Question ${safeIndex + 1} of ${filteredQuestions.length}`}
              </span>
            </div>

            {/* Quick Jump Question Palette */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full no-scrollbar">
              <span className="text-[11px] font-bold text-slate-500 mr-1 hidden md:inline">Jump:</span>
              {filteredQuestions.map((q, idx) => {
                const isCurrent = idx === safeIndex;
                const isSelected = selectedOption === idx;
                let chipClass = 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100';
                if (isCurrent) {
                  chipClass = 'bg-[#0F4C81] text-white font-black ring-2 ring-blue-400';
                }

                return (
                  <button
                    key={q.id || idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setSelectedOption(null);
                      setShowExplanation(false);
                    }}
                    className={`w-7 h-7 text-xs rounded-lg border font-mono flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${chipClass}`}
                    title={`Question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Prompt */}
          <div className="p-4 sm:p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 text-base sm:text-lg lg:text-xl font-bold leading-relaxed shadow-md">
            <span className="text-amber-400 font-mono mr-2">Q{safeIndex + 1}.</span>
            {currentQ.question}
          </div>

          {/* Options Grid (2 Columns on Desktop md:grid-cols-2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctAnswerIndex;
              let btnStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-300';

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs';
                } else if (isSelected) {
                  btnStyle = 'bg-red-50 border-red-500 text-red-950 font-bold shadow-2xs';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-75';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full p-4 text-left text-xs sm:text-sm lg:text-base rounded-xl border-2 transition-all flex items-center justify-between font-medium cursor-pointer shadow-2xs ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 ${
                      isSelected && isCorrect
                        ? 'bg-emerald-600 text-white'
                        : isSelected && !isCorrect
                        ? 'bg-red-600 text-white'
                        : isCorrect && selectedOption !== null
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-800 border border-slate-300'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </div>

                  {selectedOption !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 ml-2" />}
                  {selectedOption !== null && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className="p-4 sm:p-5 bg-blue-50/90 border border-blue-200 rounded-xl text-xs sm:text-sm text-blue-950 space-y-2 animate-fade-in shadow-2xs">
              <div className="font-bold text-[#0F4C81] flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-sm sm:text-base">
                  <HelpCircle className="w-4 h-4 text-[#FF6B00]" />
                  <span>{language === 'hi' ? 'उत्तर व्याख्या एवं संदर्भ (Answer Context):' : 'Answer Context & Detailed Explanation:'}</span>
                </div>
                {selectedOption !== null && (
                  <span className={`text-xs px-2.5 py-0.5 rounded font-black ${
                    selectedOption === currentQ.correctAnswerIndex
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    {selectedOption === currentQ.correctAnswerIndex
                      ? (language === 'hi' ? '✓ सही उत्तर' : '✓ Correct Choice')
                      : (language === 'hi' ? '✗ गलत उत्तर - सही विकल्प देखें' : '✗ Incorrect Choice')}
                  </span>
                )}
              </div>
              <p className="leading-relaxed font-medium text-slate-800 text-xs sm:text-sm">{currentQ.explanation}</p>
              {currentQ.optionExplanations && selectedOption !== null && currentQ.optionExplanations[selectedOption] && (
                <div className="pt-2 border-t border-blue-200 text-xs font-normal text-slate-700">
                  <span className="font-bold text-slate-900">{language === 'hi' ? 'चुने गए विकल्प का विश्लेषण: ' : 'Analysis of Selected Option: '}</span>
                  {currentQ.optionExplanations[selectedOption]}
                </div>
              )}

              <div className="pt-2 border-t border-blue-200/80 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                <span>{language === 'hi' ? 'क्या प्रश्न/उत्तर में कोई सुधार आवश्यक है?' : 'Notice any typo or mistake with this question?'}</span>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('feedback-section');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      el.classList.add('ring-4', 'ring-amber-400');
                      setTimeout(() => el.classList.remove('ring-4', 'ring-amber-400'), 2000);
                    }
                  }}
                  className="text-[#0F4C81] hover:text-[#FF6B00] font-bold underline flex items-center gap-1 cursor-pointer"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>{language === 'hi' ? 'फीडबैक दर्ज करें' : 'Leave Feedback'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (safeIndex > 0) {
                    setCurrentIndex(safeIndex - 1);
                    setSelectedOption(null);
                    setShowExplanation(false);
                  }
                }}
                disabled={safeIndex === 0}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'hi' ? 'पिछला' : 'Previous'}</span>
              </button>

              <button
                onClick={handleReset}
                className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                title="Reset test"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'hi' ? 'रीसेट' : 'Reset'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {safeIndex < filteredQuestions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-[#0F4C81] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>{language === 'hi' ? 'अगला प्रश्न' : 'Next Question'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{language === 'hi' ? 'पुन: टेस्ट दें' : 'Retake Test'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Complete Practice Set & Answer Key Sheet */}
      {viewMode === 'answer-key' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>{language === 'hi' ? 'सम्पूर्ण अभ्यास सेट एवं उत्तर कुंजी तालिका' : 'Complete Practice Questions & Official Explanations Sheet'}</span>
            </span>
            <span className="bg-white/10 px-2.5 py-1 rounded border border-white/20 text-xs">
              {filteredQuestions.length} {language === 'hi' ? 'प्रश्न उपलब्ध' : 'Questions'}
            </span>
          </div>

          <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white">
            {filteredQuestions.map((q, qIdx) => (
              <div key={q.id || qIdx} className="p-4 sm:p-5 space-y-3 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-bold text-slate-900 text-xs sm:text-sm leading-snug flex items-start gap-2">
                    <span className="bg-[#0F4C81] text-white px-2 py-0.5 rounded text-xs font-mono font-bold flex-shrink-0">
                      Q{qIdx + 1}
                    </span>
                    <span>{q.question}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#0F4C81] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 whitespace-nowrap flex-shrink-0">
                    {q.category}
                  </span>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, optIdx) => {
                    const isAns = optIdx === q.correctAnswerIndex;
                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-lg border flex items-center gap-2 font-medium ${
                          isAns
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          isAns ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-800'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isAns && <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="bg-blue-50/80 p-3 rounded-lg border border-blue-100 text-xs text-slate-800 space-y-1">
                  <span className="font-bold text-[#0F4C81]">{language === 'hi' ? 'उत्तर की व्याख्या:' : 'Explanation:'}</span>
                  <p className="text-slate-700 leading-relaxed font-medium">{q.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student Feedback Box */}
      <FeedbackBox
        targetType="quiz"
        targetId={currentQ?.id || 'quiz_section'}
        title={currentQ ? `Quiz Q${safeIndex + 1}: ${currentQ.question}` : 'Daily Quiz Practice'}
        language={language}
      />
    </div>
  );
};

