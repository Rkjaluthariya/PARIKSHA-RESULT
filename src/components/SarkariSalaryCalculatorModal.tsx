import React, { useState } from 'react';
import { X, Calculator, DollarSign, Download, CheckCircle, HelpCircle, Building2, ShieldCheck, Sparkles, Copy } from 'lucide-react';

interface SarkariSalaryCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'hi';
}

interface PayLevelData {
  level: string;
  gradePay: string;
  postExample: string;
  basicPay: number;
}

const PAY_LEVELS: PayLevelData[] = [
  { level: 'Level 1', gradePay: '1800 GP', postExample: 'Group D, MTS, Peon, Attendant', basicPay: 18000 },
  { level: 'Level 2', gradePay: '1900 GP', postExample: 'LDC, Junior Clerk, Constable, Driver', basicPay: 19900 },
  { level: 'Level 3', gradePay: '2000 GP', postExample: 'Head Constable, Forest Guard', basicPay: 21700 },
  { level: 'Level 4', gradePay: '2400 GP', postExample: 'Data Entry Operator, Tax Assistant, ASI', basicPay: 25500 },
  { level: 'Level 5', gradePay: '2800 GP', postExample: 'Senior Clerk, Accountant, Sub Inspector (Dept)', basicPay: 29200 },
  { level: 'Level 6', gradePay: '4200 GP', postExample: 'Sub Inspector (SI), Primary Teacher (PRT), Revenue Inspector', basicPay: 35400 },
  { level: 'Level 7', gradePay: '4600 GP', postExample: 'Inspector (Income Tax/Excise), TGT Teacher, Assistant Section Officer (ASO)', basicPay: 44900 },
  { level: 'Level 8', gradePay: '4800 GP', postExample: 'Assistant Audit Officer (AAO), PGT Teacher', basicPay: 47600 },
  { level: 'Level 9', gradePay: '5400 GP', postExample: 'Section Officer, Tehsildar', basicPay: 53100 },
  { level: 'Level 10', gradePay: '5400 GP (Gazetted)', postExample: 'Assistant Commissioner, DSP, SDM, Assistant Professor', basicPay: 56100 },
  { level: 'Level 11', gradePay: '6600 GP', postExample: 'Deputy Commissioner, Major, Senior Specialist', basicPay: 67700 },
  { level: 'Level 12', gradePay: '7600 GP', postExample: 'Joint Commissioner, Director, Lieutenant Colonel', basicPay: 78800 },
  { level: 'Level 13', gradePay: '8700 GP', postExample: 'DIG, Chief Engineer, Colonel', basicPay: 123100 },
  { level: 'Level 14', gradePay: '10000 GP', postExample: 'IAS / IPS (Collector), Joint Secretary, Brigadier', basicPay: 144200 },
];

export const SarkariSalaryCalculatorModal: React.FC<SarkariSalaryCalculatorModalProps> = ({
  isOpen,
  onClose,
  language = 'en',
}) => {
  const [selectedLevel, setSelectedLevel] = useState<PayLevelData>(PAY_LEVELS[5]); // Default Level 6 (SI/PRT)
  const [cityClass, setCityClass] = useState<'X' | 'Y' | 'Z'>('Y'); // Default Tier-2 city
  const [customBasicPay, setCustomBasicPay] = useState<number | ''>('');
  const [daPercent, setDaPercent] = useState<number>(50); // Current 7th Pay Commission DA (50%)
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const effectiveBasic = customBasicPay !== '' && Number(customBasicPay) > 0 ? Number(customBasicPay) : selectedLevel.basicPay;

  // HRA Rates: X = 30%, Y = 20%, Z = 10%
  const hraPercent = cityClass === 'X' ? 30 : cityClass === 'Y' ? 20 : 10;
  const hraAmount = Math.round((effectiveBasic * hraPercent) / 100);

  // DA Amount (50%)
  const daAmount = Math.round((effectiveBasic * daPercent) / 100);

  // Transport Allowance (TA) approximation
  const baseTa = cityClass === 'X' ? 3600 : 1800;
  const taAmount = Math.round(baseTa + (baseTa * daPercent) / 100);

  // Gross Monthly Earnings
  const grossSalary = effectiveBasic + daAmount + hraAmount + taAmount;

  // NPS Deduction (10% of Basic + DA)
  const npsDeduction = Math.round(((effectiveBasic + daAmount) * 10) / 100);

  // Approx Professional Tax (PT)
  const ptDeduction = 200;

  // Total Deductions
  const totalDeductions = npsDeduction + ptDeduction;

  // Net In-Hand Monthly Salary
  const netInHandSalary = grossSalary - totalDeductions;

  // Annual Package (CTC approx)
  const annualSalary = grossSalary * 12;

  const copyBreakdownText = () => {
    const text = `💰 7th Pay Commission Salary Breakdown (${selectedLevel.level} - ${cityClass} Class City)\n` +
      `🏢 Post Example: ${selectedLevel.postExample}\n` +
      `----------------------------------------\n` +
      `🔹 Basic Pay: ₹${effectiveBasic.toLocaleString('en-IN')}\n` +
      `🔹 Dearness Allowance (DA ${daPercent}%): ₹${daAmount.toLocaleString('en-IN')}\n` +
      `🔹 House Rent Allowance (HRA ${hraPercent}%): ₹${hraAmount.toLocaleString('en-IN')}\n` +
      `🔹 Transport Allowance (TA): ₹${taAmount.toLocaleString('en-IN')}\n` +
      `----------------------------------------\n` +
      `💵 Gross Monthly Earnings: ₹${grossSalary.toLocaleString('en-IN')}\n` +
      `🔻 NPS Contribution (10%): -₹${npsDeduction.toLocaleString('en-IN')}\n` +
      `🔻 Professional Tax: -₹${ptDeduction}\n` +
      `----------------------------------------\n` +
      `✅ NET IN-HAND MONTHLY SALARY: ₹${netInHandSalary.toLocaleString('en-IN')}\n` +
      `📈 Approx Annual CTC: ₹${annualSalary.toLocaleString('en-IN')} / Year\n\n` +
      `Calculated on Pariksha Result (pariksha-result.vercel.app)`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F4C81] via-[#145a96] to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 rounded-xl border border-amber-400/30 text-amber-300">
              <Calculator className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                {language === 'hi' ? '7th Pay Commission सरकारी सैलरी कैलकुलेटर' : '7th Pay Commission Sarkari Salary Calculator'}
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">2026 Updated</span>
              </h2>
              <p className="text-xs text-blue-200 font-medium mt-0.5">
                {language === 'hi' ? 'Basic Pay, DA (50%), HRA & NPS Deductions के साथ सटिक In-Hand सैलरी जाने' : 'Calculate exact Monthly In-Hand Salary & Deductions for Group A, B, C & D Posts'}
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
          {/* Controls Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {/* Pay Level Selection */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {language === 'hi' ? '1. पद एवं पे-लेवल (Pay Level / Grade Pay)' : '1. Select Pay Level & Post Grade'}
              </label>
              <select
                value={selectedLevel.level}
                onChange={(e) => {
                  const found = PAY_LEVELS.find((p) => p.level === e.target.value);
                  if (found) {
                    setSelectedLevel(found);
                    setCustomBasicPay('');
                  }
                }}
                className="w-full bg-white text-slate-800 text-sm font-bold px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F4C81] focus:outline-none"
              >
                {PAY_LEVELS.map((lvl) => (
                  <option key={lvl.level} value={lvl.level}>
                    {lvl.level} ({lvl.gradePay}) - {lvl.postExample}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 italic">
                Example: <span className="font-semibold text-slate-700">{selectedLevel.postExample}</span>
              </p>
            </div>

            {/* City Category (X, Y, Z) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {language === 'hi' ? '2. शहर की श्रेणी (City Category)' : '2. Posting City Category'}
              </label>
              <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border border-slate-300">
                {(['X', 'Y', 'Z'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCityClass(cat)}
                    className={`py-1.5 text-xs font-black rounded transition-all ${
                      cityClass === cat
                        ? 'bg-[#0F4C81] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat} City
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500">
                {cityClass === 'X' ? 'Tier-1 Metro (30% HRA)' : cityClass === 'Y' ? 'Tier-2 Capital (20% HRA)' : 'Tier-3 Town (10% HRA)'}
              </p>
            </div>
          </div>

          {/* Quick Custom Basic Pay Input */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50/70 p-3 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#0F4C81]" />
              <span className="text-xs font-bold text-slate-800">
                {language === 'hi' ? 'मूल वेतन (Basic Pay):' : 'Entry Basic Pay:'}
              </span>
              <span className="text-sm font-black text-[#0F4C81]">
                ₹{effectiveBasic.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Custom Basic (Optional):</span>
              <input
                type="number"
                placeholder={`e.g. ${selectedLevel.basicPay}`}
                value={customBasicPay}
                onChange={(e) => setCustomBasicPay(e.target.value ? Number(e.target.value) : '')}
                className="w-32 bg-white text-xs font-bold px-2.5 py-1 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0F4C81]"
              />
            </div>
          </div>

          {/* Salary Computation Display Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Earnings Column */}
            <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                <span className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  {language === 'hi' ? 'मासिक भत्ते (Monthly Allowances)' : 'Monthly Allowances (+)'}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Earnings</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span>Basic Pay</span>
                  <span className="font-bold text-slate-900">₹{effectiveBasic.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-1">
                    Dearness Allowance (DA)
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1 rounded">{daPercent}%</span>
                  </span>
                  <span className="font-bold text-slate-900">₹{daAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-1">
                    House Rent Allowance (HRA)
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1 rounded">{hraPercent}%</span>
                  </span>
                  <span className="font-bold text-slate-900">₹{hraAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center text-slate-700">
                  <span>Transport Allowance (TA + DA on TA)</span>
                  <span className="font-bold text-slate-900">₹{taAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-2 border-t border-emerald-200 flex justify-between items-center font-black text-sm text-emerald-950">
                  <span>Gross Monthly Salary</span>
                  <span className="text-emerald-700">₹{grossSalary.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Deductions Column */}
            <div className="bg-rose-50/60 rounded-xl p-4 border border-rose-200 space-y-3">
              <div className="flex items-center justify-between border-b border-rose-200/80 pb-2">
                <span className="text-xs font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  {language === 'hi' ? 'मासिक कटौती (Monthly Deductions)' : 'Monthly Deductions (-)'}
                </span>
                <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">Deductions</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-1">
                    National Pension System (NPS)
                    <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-1 rounded">10%</span>
                  </span>
                  <span className="font-bold text-rose-700">-₹{npsDeduction.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center text-slate-700">
                  <span>Professional Tax (PT)</span>
                  <span className="font-bold text-rose-700">-₹{ptDeduction}</span>
                </div>

                <div className="flex justify-between items-center text-slate-400 italic">
                  <span>CGHS / Medical Scheme</span>
                  <span>-₹0 (Govt Paid)</span>
                </div>

                <div className="pt-8 border-t border-rose-200 flex justify-between items-center font-black text-sm text-rose-950">
                  <span>Total Deductions</span>
                  <span className="text-rose-700">-₹{totalDeductions.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Final Net In-Hand Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-[#0F4C81] to-blue-950 text-white p-4 rounded-xl shadow-lg border border-blue-900 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {language === 'hi' ? 'खाते में आने वाली कुल मासिक इन-हैंड सैलरी:' : 'Net In-Hand Monthly Salary (Bank Deposit):'}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  ₹{netInHandSalary.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-blue-200 font-semibold">/ Month</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Approx Annual Package (Gross CTC): <span className="font-bold text-amber-300">₹{annualSalary.toLocaleString('en-IN')} / Year</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyBreakdownText}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                {isCopied ? <CheckCircle className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Copied Details!' : 'Copy Breakdown'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
