import React, { useState } from 'react';
import { Calculator, X, CheckCircle, AlertTriangle, Calendar, Info } from 'lucide-react';

interface AgeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgeCalculatorModal: React.FC<AgeCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [dob, setDob] = useState('2000-08-15');
  const [cutoffDate, setCutoffDate] = useState('2026-08-01');
  const [result, setResult] = useState<{ years: number; months: number; days: number } | null>({
    years: 25,
    months: 11,
    days: 17,
  });

  const calculateAge = () => {
    if (!dob || !cutoffDate) return;

    const birth = new Date(dob);
    const target = new Date(cutoffDate);

    if (birth > target) {
      alert('Date of Birth cannot be later than Cutoff Date!');
      return;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setResult({ years, months, days });
  };

  const EXAMS_ELIGIBILITY = [
    { name: 'SSC CGL 2026', minAge: 18, maxAge: 32 },
    { name: 'RRB NTPC 2026', minAge: 18, maxAge: 33 },
    { name: 'UP Police Constable', minAge: 18, maxAge: 25 },
    { name: 'UPSC Civil Services (IAS)', minAge: 21, maxAge: 32 },
    { name: 'SBI / IBPS PO', minAge: 20, maxAge: 30 },
    { name: 'Army Agniveer', minAge: 17.5, maxAge: 21 },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#0F4C81] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-300" />
            <h2 className="text-base font-black uppercase tracking-wider">Government Job Age Calculator</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-800 rounded-full text-blue-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
            <div>
              <label className="block text-slate-900 font-bold mb-1">Date of Birth (DOB)</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-900 font-bold mb-1">Age Cutoff Date</label>
              <input
                type="date"
                value={cutoffDate}
                onChange={(e) => setCutoffDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] font-bold text-slate-900"
              />
            </div>
          </div>

          <button
            onClick={calculateAge}
            className="w-full py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            <span>Calculate Exact Age</span>
          </button>

          {/* Age Result Box */}
          {result && (
            <div className="space-y-4">
              <div className="bg-blue-50 border-2 border-[#0F4C81] rounded-xl p-4 text-center space-y-1">
                <div className="text-xs font-bold text-slate-600 uppercase">Your Age on Cutoff Date ({cutoffDate}):</div>
                <div className="text-2xl font-black text-[#0F4C81]">
                  {result.years} <span className="text-sm font-semibold text-slate-600">Years</span>, {result.months}{' '}
                  <span className="text-sm font-semibold text-slate-600">Months</span>, {result.days}{' '}
                  <span className="text-sm font-semibold text-slate-600">Days</span>
                </div>
              </div>

              {/* Instant Exam Eligibility Matrix */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#FF6B00]" />
                  <span>Instant General Category Eligibility Status</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {EXAMS_ELIGIBILITY.map((exam) => {
                    const isEligible = result.years >= exam.minAge && result.years <= exam.maxAge;
                    return (
                      <div
                        key={exam.name}
                        className={`p-2.5 rounded-lg border flex items-center justify-between ${
                          isEligible ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-red-50 border-red-200 text-red-950'
                        }`}
                      >
                        <div>
                          <div className="font-bold">{exam.name}</div>
                          <div className="text-[10px] text-slate-600">
                            Allowed Age: {exam.minAge}-{exam.maxAge} Yrs
                          </div>
                        </div>

                        {isEligible ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Eligible
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Over/Under
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-3 text-center border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-1.5 bg-slate-700 text-white text-xs font-bold rounded-lg">
            Close Calculator
          </button>
        </div>

      </div>
    </div>
  );
};
