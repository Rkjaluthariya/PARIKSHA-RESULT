import React, { useState } from 'react';
import { X, TrendingUp, Target, Award, CheckCircle2, AlertTriangle, HelpCircle, ShieldAlert, Sparkles, BarChart2 } from 'lucide-react';

interface ExamCutOffPredictorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'hi';
}

interface ExamCutOffData {
  id: string;
  name: string;
  totalMarks: number;
  expected2026: { UR: number; EWS: number; OBC: number; SC: number; ST: number };
  cutOff2025: { UR: number; EWS: number; OBC: number; SC: number; ST: number };
  cutOff2024: { UR: number; EWS: number; OBC: number; SC: number; ST: number };
}

const EXAMS_DATA: ExamCutOffData[] = [
  {
    id: 'ssc-cgl',
    name: 'SSC CGL Tier-1 Exam',
    totalMarks: 200,
    expected2026: { UR: 146, EWS: 138, OBC: 142, SC: 124, ST: 114 },
    cutOff2025: { UR: 143, EWS: 135, OBC: 140, SC: 122, ST: 111 },
    cutOff2024: { UR: 139, EWS: 131, OBC: 136, SC: 118, ST: 108 },
  },
  {
    id: 'ssc-gd',
    name: 'SSC GD Constable Exam',
    totalMarks: 160,
    expected2026: { UR: 135, EWS: 128, OBC: 132, SC: 115, ST: 105 },
    cutOff2025: { UR: 132, EWS: 125, OBC: 129, SC: 112, ST: 102 },
    cutOff2024: { UR: 128, EWS: 120, OBC: 125, SC: 108, ST: 98 },
  },
  {
    id: 'rrb-rpf',
    name: 'Railway RPF SI & Constable',
    totalMarks: 120,
    expected2026: { UR: 92, EWS: 86, OBC: 89, SC: 78, ST: 72 },
    cutOff2025: { UR: 89, EWS: 83, OBC: 86, SC: 75, ST: 69 },
    cutOff2024: { UR: 85, EWS: 79, OBC: 82, SC: 71, ST: 65 },
  },
  {
    id: 'rrb-alp',
    name: 'Railway RRB ALP CBT-1',
    totalMarks: 75,
    expected2026: { UR: 52, EWS: 46, OBC: 49, SC: 40, ST: 35 },
    cutOff2025: { UR: 49, EWS: 43, OBC: 46, SC: 38, ST: 33 },
    cutOff2024: { UR: 46, EWS: 40, OBC: 43, SC: 35, ST: 30 },
  },
  {
    id: 'up-police',
    name: 'UP Police Constable Exam',
    totalMarks: 300,
    expected2026: { UR: 215, EWS: 204, OBC: 208, SC: 185, ST: 160 },
    cutOff2025: { UR: 210, EWS: 198, OBC: 204, SC: 180, ST: 155 },
    cutOff2024: { UR: 202, EWS: 190, OBC: 196, SC: 172, ST: 148 },
  },
  {
    id: 'raj-reet',
    name: 'Rajasthan REET Level-1 & 2',
    totalMarks: 150,
    expected2026: { UR: 110, EWS: 102, OBC: 106, SC: 94, ST: 88 },
    cutOff2025: { UR: 107, EWS: 99, OBC: 103, SC: 90, ST: 85 },
    cutOff2024: { UR: 102, EWS: 94, OBC: 98, SC: 85, ST: 80 },
  },
  {
    id: 'ibps-po',
    name: 'IBPS PO Prelims Exam',
    totalMarks: 100,
    expected2026: { UR: 58, EWS: 54, OBC: 56, SC: 48, ST: 42 },
    cutOff2025: { UR: 55, EWS: 51, OBC: 53, SC: 45, ST: 39 },
    cutOff2024: { UR: 52, EWS: 48, OBC: 50, SC: 42, ST: 36 },
  },
];

export const ExamCutOffPredictorModal: React.FC<ExamCutOffPredictorModalProps> = ({
  isOpen,
  onClose,
  language = 'en',
}) => {
  const [selectedExam, setSelectedExam] = useState<ExamCutOffData>(EXAMS_DATA[0]);
  const [userCategory, setUserCategory] = useState<'UR' | 'EWS' | 'OBC' | 'SC' | 'ST'>('UR');
  const [userMarks, setUserMarks] = useState<number | ''>('');
  const [predictedResult, setPredictedResult] = useState<{ zone: 'safe' | 'borderline' | 'low'; text: string; probability: string } | null>(null);

  if (!isOpen) return null;

  const handlePredict = () => {
    if (userMarks === '' || Number(userMarks) < 0) return;
    const score = Number(userMarks);
    const targetCutoff = selectedExam.expected2026[userCategory];

    if (score >= targetCutoff + 5) {
      setPredictedResult({
        zone: 'safe',
        text: language === 'hi' 
          ? `बधाई हो! आपका स्कोर (${score}/${selectedExam.totalMarks}) सुरक्षित कट-ऑफ स्कोर (${targetCutoff}) से ऊपर है। आपका चयन संभावना 95%+ है। मुख्य परीक्षा / फिजिकल की तैयारी तुरंत शुरू करें!` 
          : `Congratulations! Your score (${score}/${selectedExam.totalMarks}) exceeds the expected cut-off (${targetCutoff}). Selection probability is 95%+. Start Mains/Physical prep immediately!`,
        probability: '95%+ High Selection Chance'
      });
    } else if (score >= targetCutoff - 5) {
      setPredictedResult({
        zone: 'borderline',
        text: language === 'hi'
          ? `आपका स्कोर (${score}/${selectedExam.totalMarks}) कट-ऑफ रेखा (${targetCutoff}) के बेहद करीब है। नॉर्मलाइजेशन के बाद आपका नाम लिस्ट में आ सकता है। अगले चरण की तैयारी जारी रखें!`
          : `Your score (${score}/${selectedExam.totalMarks}) is right on the boundary line (${targetCutoff}). Normalization may boost your rank. Keep preparing for Tier-2!`,
        probability: '65-75% Moderate Chance'
      });
    } else {
      setPredictedResult({
        zone: 'low',
        text: language === 'hi'
          ? `आपका स्कोर (${score}/${selectedExam.totalMarks}) अनुमानित कट-ऑफ (${targetCutoff}) से कम है। घबराएं नहीं! आगामी SSC GD एवं भर्ती परीक्षाओं पर ध्यान केंद्रित करें।`
          : `Your score (${score}/${selectedExam.totalMarks}) is below the expected cutoff (${targetCutoff}). Don't worry! Focus on upcoming notifications.`,
        probability: 'Under 40% - Needs Improvement'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0F4C81] to-blue-950 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 rounded-xl border border-amber-400/30 text-amber-300">
              <TrendingUp className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                {language === 'hi' ? 'परीक्षा कट-ऑफ मार्क्स एवं सेफ स्कोर प्रेडिक्टर' : 'Exam Cut-Off Marks & Selection Predictor'}
                <span className="text-[10px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-full uppercase">3-Year Analysis</span>
              </h2>
              <p className="text-xs text-blue-200 font-medium mt-0.5">
                {language === 'hi' ? 'विगत वर्षों के कट-ऑफ रुझान एवं अपने अंक डालकर चयन संभावना जांचें' : 'Check Historical Category Cut-Offs & Predict Selection Chances'}
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

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Exam Selector */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              {language === 'hi' ? '1. अपनी लक्षित परीक्षा चुनें (Target Exam):' : '1. Choose Target Sarkari Exam:'}
            </label>
            <select
              value={selectedExam.id}
              onChange={(e) => {
                const found = EXAMS_DATA.find((x) => x.id === e.target.value);
                if (found) {
                  setSelectedExam(found);
                  setPredictedResult(null);
                }
              }}
              className="w-full bg-white text-slate-900 font-bold text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F4C81] focus:outline-none"
            >
              {EXAMS_DATA.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} (Max Marks: {ex.totalMarks})
                </option>
              ))}
            </select>
          </div>

          {/* Historical Cut-off Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-[#0F4C81]" />
                {selectedExam.name} - Category-wise Cut-Off History
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Total Marks: {selectedExam.totalMarks}</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0F4C81] text-white font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Year</th>
                    <th className="p-2.5 text-center bg-blue-900/40">UR (Gen)</th>
                    <th className="p-2.5 text-center">EWS</th>
                    <th className="p-2.5 text-center">OBC</th>
                    <th className="p-2.5 text-center">SC</th>
                    <th className="p-2.5 text-center">ST</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-bold text-slate-800">
                  <tr className="bg-emerald-50/50">
                    <td className="p-2.5 font-black text-emerald-900">2026 Expected 🎯</td>
                    <td className="p-2.5 text-center text-emerald-700 font-black">{selectedExam.expected2026.UR}</td>
                    <td className="p-2.5 text-center">{selectedExam.expected2026.EWS}</td>
                    <td className="p-2.5 text-center">{selectedExam.expected2026.OBC}</td>
                    <td className="p-2.5 text-center">{selectedExam.expected2026.SC}</td>
                    <td className="p-2.5 text-center">{selectedExam.expected2026.ST}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold">2025 Official</td>
                    <td className="p-2.5 text-center">{selectedExam.cutOff2025.UR}</td>
                    <td className="p-2.5 text-center">{selectedExam.cutOff2025.EWS}</td>
                    <td className="p-2.5 text-center">{selectedExam.cutOff2025.OBC}</td>
                    <td className="p-2.5 text-center">{selectedExam.cutOff2025.SC}</td>
                    <td className="p-2.5 text-center">{selectedExam.cutOff2025.ST}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold">2024 Official</td>
                    <td className="p-2.5 text-center">{selectedExam.cutOff2024.UR}</td>
                    <td className="p-2.5 text-center">{selectedExam.cutOff2024.EWS}</td>
                    <td className="p-2.5 text-center">{selectedExam.cutOff2024.OBC}</td>
                    <td className="p-2.5 text-center">{selectedExam.cutOff2024.SC}</td>
                    <td className="p-2.5 text-center">{selectedExam.cutOff2024.ST}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Safe Zone Marks Evaluator */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/80 p-4 rounded-xl border border-blue-200 space-y-4">
            <h3 className="text-xs font-black text-[#0F4C81] uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#0F4C81]" />
              {language === 'hi' ? '2. अपना मार्क्स डालकर सेफ जोन प्रेडिक्ट करें (Safe Zone Checker)' : '2. Enter Your Marks to Predict Selection Chance'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Category:</label>
                <select
                  value={userCategory}
                  onChange={(e) => setUserCategory(e.target.value as any)}
                  className="w-full bg-white text-slate-900 font-bold text-xs px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none"
                >
                  <option value="UR">UR / General</option>
                  <option value="EWS">EWS</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Your Score / Expected Marks:</label>
                <input
                  type="number"
                  placeholder={`Out of ${selectedExam.totalMarks}`}
                  value={userMarks}
                  onChange={(e) => setUserMarks(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-white text-slate-900 font-bold text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handlePredict}
                  className="w-full py-2 bg-[#0F4C81] hover:bg-blue-800 text-white font-black text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Predict Chance</span>
                </button>
              </div>
            </div>

            {/* Prediction Result Display */}
            {predictedResult && (
              <div
                className={`p-4 rounded-xl border shadow-md animate-fade-in space-y-2 ${
                  predictedResult.zone === 'safe'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : predictedResult.zone === 'borderline'
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {predictedResult.zone === 'safe' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : predictedResult.zone === 'borderline' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-rose-600" />
                    )}
                    <span className="font-black text-sm uppercase tracking-wide">
                      {predictedResult.probability}
                    </span>
                  </div>
                  <span className="text-[10px] bg-white/80 font-bold px-2 py-0.5 rounded border">
                    Target Cutoff: {selectedExam.expected2026[userCategory]}
                  </span>
                </div>
                <p className="text-xs font-semibold leading-relaxed">
                  {predictedResult.text}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
