import React, { useState, useEffect } from 'react';
import { X, BookOpen, CheckSquare, Square, Award, Sparkles, CheckCircle2, RotateCcw, ListChecks } from 'lucide-react';

interface SyllabusChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'hi';
}

interface SyllabusExam {
  id: string;
  name: string;
  subjects: {
    subjectName: string;
    topics: string[];
  }[];
}

const SYLLABUS_DATA: SyllabusExam[] = [
  {
    id: 'ssc-cgl-gd',
    name: 'SSC CGL / SSC GD Syllabus Checklist',
    subjects: [
      {
        subjectName: 'Quantitative Aptitude (Mathematics)',
        topics: [
          'Number System & Simplification',
          'Percentage, Profit & Loss',
          'Ratio & Proportion, Average',
          'Simple Interest & Compound Interest',
          'Time, Work & Pipes',
          'Speed, Distance & Train Problems',
          'Algebra & Geometry Formulas',
          'Data Interpretation (DI Bar & Pie)'
        ]
      },
      {
        subjectName: 'General Intelligence & Reasoning',
        topics: [
          'Analogy & Classification',
          'Coding-Decoding',
          'Blood Relations & Direction Sense',
          'Syllogism & Statement-Conclusion',
          'Series (Number & Letter)',
          'Non-Verbal Pattern Completion & Paper Folding'
        ]
      },
      {
        subjectName: 'General Awareness & Current Affairs',
        topics: [
          'Indian History (Ancient, Medieval, Modern)',
          'Indian Polity & Constitution Articles',
          'Geography (Rivers, Mountains, States)',
          'General Science (Physics, Chemistry, Biology)',
          'Last 6 Months Current Affairs & Govt Schemes'
        ]
      }
    ]
  },
  {
    id: 'railway-rpf-ntpc',
    name: 'Railway RPF / RRB NTPC Syllabus Checklist',
    subjects: [
      {
        subjectName: 'General Science (PCB)',
        topics: [
          'Physics Units, Laws of Motion & Energy',
          'Chemical Reactions, Periodic Table & Acids/Bases',
          'Human Physiology, Diseases & Vitamins',
          'Environmental Science & Ecology'
        ]
      },
      {
        subjectName: 'Mathematics',
        topics: [
          'BODMAS & Decimals/Fractions',
          'LCM & HCF',
          'Mensuration 2D/3D',
          'Trigonometry & Elementary Statistics'
        ]
      },
      {
        subjectName: 'General Awareness',
        topics: [
          'Indian Railways History & Facts',
          'Current Events & Sports Honors',
          'Indian Art, Culture & Heritage'
        ]
      }
    ]
  },
  {
    id: 'police-constable',
    name: 'State Police Constable / Sub-Inspector',
    subjects: [
      {
        subjectName: 'General Knowledge & State Affairs',
        topics: [
          'State History & Geographical Map',
          'Police Admin & Crime Control Regulations',
          'Indian Constitution & Fundamental Rights',
          'Static GK & Famous Personalities'
        ]
      },
      {
        subjectName: 'General Hindi / English',
        topics: [
          'संधि, समास एवं उपसर्ग-प्रत्यय',
          'पर्यायवाची, विलोम शब्द एवं अनेकार्थी',
          'मुहावरे एवं लोकोक्तियां',
          'वाक्य संशोधन एवं त्रुटि मार्जन'
        ]
      }
    ]
  }
];

export const SyllabusChecklistModal: React.FC<SyllabusChecklistModalProps> = ({
  isOpen,
  onClose,
  language = 'en',
}) => {
  const [selectedExam, setSelectedExam] = useState<SyllabusExam>(SYLLABUS_DATA[0]);
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});

  // Load saved checked status from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pariksha_syllabus_checklist');
      if (saved) {
        setCompletedTopics(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  if (!isOpen) return null;

  const toggleTopic = (topicKey: string) => {
    const next = { ...completedTopics, [topicKey]: !completedTopics[topicKey] };
    setCompletedTopics(next);
    try {
      localStorage.setItem('pariksha_syllabus_checklist', JSON.stringify(next));
    } catch (e) {}
  };

  const resetExamProgress = () => {
    const updated = { ...completedTopics };
    selectedExam.subjects.forEach(sub => {
      sub.topics.forEach(t => {
        delete updated[`${selectedExam.id}_${t}`];
      });
    });
    setCompletedTopics(updated);
    try {
      localStorage.setItem('pariksha_syllabus_checklist', JSON.stringify(updated));
    } catch (e) {}
  };

  // Calculate Progress Percentage for current exam
  let totalCount = 0;
  let doneCount = 0;
  selectedExam.subjects.forEach(sub => {
    sub.topics.forEach(t => {
      totalCount++;
      if (completedTopics[`${selectedExam.id}_${t}`]) doneCount++;
    });
  });

  const progressPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-[#0F4C81] to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/20 rounded-xl border border-teal-400/30 text-teal-300">
              <BookOpen className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                {language === 'hi' ? 'पाठ्यक्रम विषयवार चेकलिस्ट एवं ट्रैकर' : 'Exam Syllabus Checklist & Progress Tracker'}
                <span className="text-[10px] bg-teal-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">Prep Tracker</span>
              </h2>
              <p className="text-xs text-teal-200 font-medium mt-0.5">
                {language === 'hi' ? 'परीक्षा सिलेबस के विषयों को पूरा करके अपनी तैयारी का प्रतिशत ट्रैक करें' : 'Check off completed topics & monitor your overall syllabus preparation status'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Controls & Progress Bar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-[220px]">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Select Exam Syllabus:
                </label>
                <select
                  value={selectedExam.id}
                  onChange={(e) => {
                    const found = SYLLABUS_DATA.find(s => s.id === e.target.value);
                    if (found) setSelectedExam(found);
                  }}
                  className="w-full bg-white text-slate-900 font-bold text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                >
                  {SYLLABUS_DATA.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetExamProgress}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Reset completed topics for this exam"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Progress</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4 text-[#0F4C81]" />
                  Preparation Progress ({doneCount}/{totalCount} Topics Covered)
                </span>
                <span className="text-[#0F4C81] font-black">{progressPercent}% Completed</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                <div
                  className="h-full bg-gradient-to-r from-[#0F4C81] to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Subject Wise Checklists */}
          <div className="space-y-4">
            {selectedExam.subjects.map((sub, sIdx) => (
              <div key={sIdx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="bg-[#0F4C81]/10 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-xs font-black text-[#0F4C81] uppercase tracking-wider">
                    {sub.subjectName}
                  </h3>
                  <span className="text-[10px] bg-white font-bold text-slate-600 px-2 py-0.5 rounded border">
                    {sub.topics.length} Key Topics
                  </span>
                </div>

                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sub.topics.map((t, tIdx) => {
                    const key = `${selectedExam.id}_${t}`;
                    const isChecked = !!completedTopics[key];
                    return (
                      <button
                        key={tIdx}
                        type="button"
                        onClick={() => toggleTopic(key)}
                        className={`p-2.5 rounded-lg border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
                            : 'bg-slate-50/70 border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <span className={`text-xs font-bold leading-tight ${isChecked ? 'line-through text-emerald-800 opacity-90' : ''}`}>
                          {t}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
