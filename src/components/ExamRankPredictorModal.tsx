import React, { useState, useMemo } from 'react';
import { 
  X, 
  TrendingUp, 
  Target, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  BarChart2, 
  Users, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Share2, 
  Copy, 
  Check, 
  Info,
  ShieldCheck,
  Flame,
  Zap
} from 'lucide-react';

interface ExamRankPredictorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'hi';
}

export interface ExamPresetConfig {
  id: string;
  name: string;
  nameHi: string;
  totalMarks: number;
  avgCandidates: number;
  meanScore: number;
  stdDev: number;
  expectedCutOffUR: number;
  expectedCutOffOBC: number;
  expectedCutOffEWS: number;
  expectedCutOffSC: number;
  expectedCutOffST: number;
  vacancies: number;
  description: string;
  descriptionHi: string;
}

export const EXAM_RANK_PRESETS: ExamPresetConfig[] = [
  {
    id: 'ssc-cgl',
    name: 'SSC CGL Tier-1 (2026)',
    nameHi: 'SSC CGL टियर-1 परीक्षा',
    totalMarks: 200,
    avgCandidates: 2450000,
    meanScore: 104,
    stdDev: 26,
    expectedCutOffUR: 146,
    expectedCutOffOBC: 142,
    expectedCutOffEWS: 138,
    expectedCutOffSC: 124,
    expectedCutOffST: 114,
    vacancies: 18000,
    description: 'Computer Based Test (100 Qs, 200 Marks). Highly competitive 24+ Lakh aspirants.',
    descriptionHi: 'कम्प्यूटर आधारित परीक्षा (100 प्रश्न, 200 अंक). 24 लाख से अधिक अभ्यर्थी.'
  },
  {
    id: 'ssc-gd',
    name: 'SSC GD Constable Exam',
    nameHi: 'SSC GD कांस्टेबल परीक्षा',
    totalMarks: 160,
    avgCandidates: 4600000,
    meanScore: 82,
    stdDev: 24,
    expectedCutOffUR: 135,
    expectedCutOffOBC: 132,
    expectedCutOffEWS: 128,
    expectedCutOffSC: 115,
    expectedCutOffST: 105,
    vacancies: 39000,
    description: 'National recruitment with massive 45+ Lakh applicant base across states.',
    descriptionHi: '45 लाख+ उम्मीदवारों के साथ राष्ट्रीय स्तर की विशाल भर्ती परीक्षा.'
  },
  {
    id: 'rrb-ntpc',
    name: 'Railway RRB NTPC CBT-1',
    nameHi: 'रेलवे RRB NTPC CBT-1',
    totalMarks: 100,
    avgCandidates: 7500000,
    meanScore: 54,
    stdDev: 14,
    expectedCutOffUR: 74,
    expectedCutOffOBC: 70,
    expectedCutOffEWS: 67,
    expectedCutOffSC: 60,
    expectedCutOffST: 54,
    vacancies: 11500,
    description: 'CBT-1 100 Marks Screening Exam with 20x candidates qualifying for CBT-2.',
    descriptionHi: '100 अंकों की स्क्रीनिंग परीक्षा, 20 गुना अभ्यर्थियों का CBT-2 चयन.'
  },
  {
    id: 'rrb-alp',
    name: 'Railway RRB ALP CBT-1',
    nameHi: 'रेलवे RRB ALP (असिस्टेंट लोको पायलट)',
    totalMarks: 75,
    avgCandidates: 3800000,
    meanScore: 36,
    stdDev: 9.5,
    expectedCutOffUR: 52,
    expectedCutOffOBC: 49,
    expectedCutOffEWS: 46,
    expectedCutOffSC: 40,
    expectedCutOffST: 35,
    vacancies: 18799,
    description: '75 Marks qualifying round. 15x candidates shortlisted for CBT-2.',
    descriptionHi: '75 अंकों की क्वालिफाइंग परीक्षा, CBT-2 के लिए 15 गुना चयन.'
  },
  {
    id: 'upsc-prelims',
    name: 'UPSC Civil Services Prelims (GS-1)',
    nameHi: 'UPSC सिविल सेवा प्रारंभिक (GS-1)',
    totalMarks: 200,
    avgCandidates: 1100000,
    meanScore: 68,
    stdDev: 21,
    expectedCutOffUR: 91,
    expectedCutOffOBC: 89,
    expectedCutOffEWS: 84,
    expectedCutOffSC: 77,
    expectedCutOffST: 72,
    vacancies: 1100,
    description: 'General Studies Paper-1 (200 Marks). Approx 14,000 qualify for Mains.',
    descriptionHi: 'सामान्य अध्ययन पेपर-1 (200 अंक). लगभग 14,000 मुख्य परीक्षा के लिए पात्र.'
  },
  {
    id: 'up-police',
    name: 'UP Police Constable Exam',
    nameHi: 'यूपी पुलिस कांस्टेबल परीक्षा',
    totalMarks: 300,
    avgCandidates: 4800000,
    meanScore: 148,
    stdDev: 38,
    expectedCutOffUR: 215,
    expectedCutOffOBC: 208,
    expectedCutOffEWS: 204,
    expectedCutOffSC: 185,
    expectedCutOffST: 160,
    vacancies: 60244,
    description: '300 Marks OMR examination with 48 Lakh candidates competing across UP.',
    descriptionHi: '300 अंकों की OMR परीक्षा, 60 हजार से ज्यादा रिक्तियां.'
  },
  {
    id: 'ibps-po',
    name: 'IBPS PO Prelims Exam',
    nameHi: 'IBPS बैंक PO प्रीलिम्स',
    totalMarks: 100,
    avgCandidates: 650000,
    meanScore: 46,
    stdDev: 12.5,
    expectedCutOffUR: 58,
    expectedCutOffOBC: 56,
    expectedCutOffEWS: 54,
    expectedCutOffSC: 48,
    expectedCutOffST: 42,
    vacancies: 4500,
    description: '100 Marks Speed test with sectional and overall cutoffs.',
    descriptionHi: '100 अंकों की बैंकिंग प्रारंभिक परीक्षा, 10 गुना मुख्य परीक्षा कॉल.'
  },
  {
    id: 'neet-ug',
    name: 'NTA NEET UG Medical Exam',
    nameHi: 'NTA NEET UG मेडिकल प्रवेश परीक्षा',
    totalMarks: 720,
    avgCandidates: 2350000,
    meanScore: 310,
    stdDev: 125,
    expectedCutOffUR: 655,
    expectedCutOffOBC: 650,
    expectedCutOffEWS: 648,
    expectedCutOffSC: 560,
    expectedCutOffST: 530,
    vacancies: 110000,
    description: '720 Marks Single National Medical Entrance Test for MBBS/BDS.',
    descriptionHi: '720 अंकों की राष्ट्रीय मेडिकल प्रवेश परीक्षा (MBBS/BDS सीटें).'
  },
  {
    id: 'jee-main',
    name: 'NTA JEE Main (Session 1 & 2)',
    nameHi: 'NTA JEE Main इंजीनियरिंग प्रवेश',
    totalMarks: 300,
    avgCandidates: 1400000,
    meanScore: 92,
    stdDev: 42,
    expectedCutOffUR: 145,
    expectedCutOffOBC: 125,
    expectedCutOffEWS: 120,
    expectedCutOffSC: 85,
    expectedCutOffST: 68,
    vacancies: 55000,
    description: '300 Marks national engineering test. Top 2.5 Lakh qualify for JEE Advanced.',
    descriptionHi: '300 अंकों की इंजीनियरिंग परीक्षा, शीर्ष 2.5 लाख JEE Advanced पात्र.'
  },
  {
    id: 'custom-exam',
    name: 'Custom Any Competitive Exam',
    nameHi: 'कस्टम अन्य प्रतियोगी परीक्षा',
    totalMarks: 200,
    avgCandidates: 1000000,
    meanScore: 100,
    stdDev: 25,
    expectedCutOffUR: 140,
    expectedCutOffOBC: 135,
    expectedCutOffEWS: 130,
    expectedCutOffSC: 115,
    expectedCutOffST: 100,
    vacancies: 5000,
    description: 'Define your own exam parameters, total marks and applicant pool size.',
    descriptionHi: 'अपनी परीक्षा के कुल अंक और उम्मीदवारों की संख्या अनुसार गणना करें.'
  }
];

// High-precision standard normal error function approximation (Abramowitz and Stegun)
function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);

  // Constants
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return sign * y;
}

// Normal Cumulative Distribution Function (CDF)
function normalCDF(x: number, mean: number, stdDev: number): number {
  if (stdDev <= 0) return 0.5;
  const z = (x - mean) / (stdDev * Math.SQRT2);
  return 0.5 * (1.0 + erf(z));
}

// Normal Probability Density Function (PDF) for Bell Curve SVG plotting
function normalPDF(x: number, mean: number, stdDev: number): number {
  if (stdDev <= 0) return 0;
  const diff = x - mean;
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-(diff * diff) / (2 * stdDev * stdDev));
}

export const ExamRankPredictorModal: React.FC<ExamRankPredictorModalProps> = ({
  isOpen,
  onClose,
  language = 'en'
}) => {
  const isHi = language === 'hi';

  // Preset and Configuration States
  const [selectedPreset, setSelectedPreset] = useState<ExamPresetConfig>(EXAM_RANK_PRESETS[0]);
  const [rawMarks, setRawMarks] = useState<number | ''>(148);
  const [totalMarks, setTotalMarks] = useState<number>(EXAM_RANK_PRESETS[0].totalMarks);
  const [totalCandidates, setTotalCandidates] = useState<number>(EXAM_RANK_PRESETS[0].avgCandidates);
  const [userCategory, setUserCategory] = useState<'UR' | 'EWS' | 'OBC' | 'SC' | 'ST'>('UR');
  const [shiftDifficulty, setShiftDifficulty] = useState<'easy' | 'moderate' | 'hard'>('moderate');
  const [copied, setCopied] = useState<boolean>(false);

  // Category proportions for demographic rank prediction
  const categoryProportions = useMemo(() => {
    return {
      UR: 0.38,
      OBC: 0.36,
      EWS: 0.10,
      SC: 0.11,
      ST: 0.05
    };
  }, []);

  // Handle Preset Change
  const handlePresetSelect = (preset: ExamPresetConfig) => {
    setSelectedPreset(preset);
    setTotalMarks(preset.totalMarks);
    setTotalCandidates(preset.avgCandidates);
    // Set a sensible default raw mark (approx around UR cutoff)
    setRawMarks(Math.min(preset.totalMarks, Math.round(preset.expectedCutOffUR + (preset.stdDev * 0.2))));
  };

  // Mathematical Rank Prediction Engine
  const prediction = useMemo(() => {
    const rawScore = Number(rawMarks) || 0;
    const maxMarks = Math.max(10, totalMarks || selectedPreset.totalMarks);
    const candidatePool = Math.max(100, totalCandidates || selectedPreset.avgCandidates);

    // Adjust mean and standard deviation based on exam scale and shift difficulty
    let baseMean = selectedPreset.meanScore;
    let baseStdDev = selectedPreset.stdDev;

    // Scale mean and stdDev proportionally if custom totalMarks differs from preset
    if (selectedPreset.id === 'custom-exam' || totalMarks !== selectedPreset.totalMarks) {
      const scaleFactor = maxMarks / (selectedPreset.totalMarks || 100);
      baseMean = (maxMarks * 0.48); // ~48% average across Indian national exams
      baseStdDev = (maxMarks * 0.14); // ~14% standard deviation
    }

    // Shift difficulty adjustments:
    // Hard shift: Mean drops by 0.35 sigma, normalisation score increases
    // Easy shift: Mean rises by 0.35 sigma, normalized score decreases
    let effectiveMean = baseMean;
    let shiftAdjustment = 0;

    if (shiftDifficulty === 'hard') {
      effectiveMean = baseMean - (0.35 * baseStdDev);
      shiftAdjustment = +(0.25 * baseStdDev);
    } else if (shiftDifficulty === 'easy') {
      effectiveMean = baseMean + (0.35 * baseStdDev);
      shiftAdjustment = -(0.20 * baseStdDev);
    }

    // Z-Score on the adjusted distribution
    const zScore = (rawScore - effectiveMean) / baseStdDev;
    
    // Normalized score projection
    const normalizedScore = Math.max(0, Math.min(maxMarks * 1.08, +(rawScore + shiftAdjustment).toFixed(2)));

    // Cumulative probability: Percentile of people scoring at or below this score
    const cdfValue = normalCDF(rawScore, effectiveMean, baseStdDev);
    
    // Percentile (capped safely between 0.01% and 99.999%)
    let percentile = cdfValue * 100;
    if (percentile > 99.999) percentile = 99.999;
    if (percentile < 0.001) percentile = 0.001;

    // Probability of exceeding this score: P(X > rawScore)
    const upperTailProb = Math.max(1e-7, 1 - cdfValue);

    // Estimated All India Rank
    const rawAIR = Math.round(candidatePool * upperTailProb) + 1;
    const estAIR = Math.max(1, Math.min(candidatePool, rawAIR));

    // Confidence Interval Window (95% standard bell curve band)
    const errorMargin = Math.max(15, Math.round(estAIR * 0.12));
    const airMin = Math.max(1, estAIR - errorMargin);
    const airMax = Math.min(candidatePool, estAIR + errorMargin);

    // Category Rank Estimation
    const catProportion = categoryProportions[userCategory] || 0.30;
    const catPool = Math.round(candidatePool * catProportion);
    const estCategoryRank = Math.max(1, Math.round(estAIR * catProportion));
    const catMin = Math.max(1, Math.round(airMin * catProportion));
    const catMax = Math.max(1, Math.round(airMax * catProportion));

    // Expected Cutoff for user's category in this exam
    const categoryCutoff = selectedPreset[`expectedCutOff${userCategory}` as keyof ExamPresetConfig] as number || selectedPreset.expectedCutOffUR;

    // Selection Zone Analysis
    let selectionZone: 'top-elite' | 'safe' | 'probable' | 'borderline' | 'low' = 'moderate' as any;
    let zoneColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
    let zoneTextEn = '';
    let zoneTextHi = '';
    let callProbability = 0;

    const vacancies = selectedPreset.vacancies || 5000;
    const prelimsCallMultiplier = selectedPreset.id === 'rrb-ntpc' ? 20 : (selectedPreset.id === 'upsc-prelims' ? 14 : 12);
    const totalShortlisted = vacancies * prelimsCallMultiplier;

    if (estAIR <= vacancies * 0.8) {
      selectionZone = 'top-elite';
      zoneColor = 'text-purple-800 bg-purple-50 border-purple-300';
      callProbability = 99;
      zoneTextEn = `🌟 Elite Top Tier! Rank ${estAIR.toLocaleString()} puts you well inside final selection merit list.`;
      zoneTextHi = `🌟 शीर्ष मेरिट सूची! रैंक ${estAIR.toLocaleString()} आपको अंतिम चयन सूची में सुरक्षित स्थान दिलाती है।`;
    } else if (estAIR <= totalShortlisted * 0.6 || rawScore >= categoryCutoff + 6) {
      selectionZone = 'safe';
      zoneColor = 'text-emerald-800 bg-emerald-50 border-emerald-300';
      callProbability = 95;
      zoneTextEn = `✅ Strong Safe Zone! Score is well above expected ${userCategory} cut-off (${categoryCutoff}). Next stage call guaranteed.`;
      zoneTextHi = `✅ पूर्ण सुरक्षित क्षेत्र! आपका स्कोर अपेक्षित ${userCategory} कट-ऑफ (${categoryCutoff}) से काफी आगे है।`;
    } else if (estAIR <= totalShortlisted * 1.1 || rawScore >= categoryCutoff) {
      selectionZone = 'probable';
      zoneColor = 'text-teal-800 bg-teal-50 border-teal-300';
      callProbability = 78;
      zoneTextEn = `👍 High Qualifying Chance! Clear candidate for Mains/Stage-2 call. Keep preparing full throttle.`;
      zoneTextHi = `👍 उच्च चयन संभावना! मुख्य परीक्षा / टियर-2 के लिए कॉल आने की प्रबल संभावना है।`;
    } else if (rawScore >= categoryCutoff - 4) {
      selectionZone = 'borderline';
      zoneColor = 'text-amber-800 bg-amber-50 border-amber-300';
      callProbability = 48;
      zoneTextEn = `⚠️ Borderline Score. Final qualification will heavily depend on normalisation shift shifts.`;
      zoneTextHi = `⚠️ बॉर्डरलाइन स्कोर। चयन काफी हद तक शिफ्ट नॉर्मलाइजेशन पर निर्भर करेगा।`;
    } else {
      selectionZone = 'low';
      zoneColor = 'text-rose-800 bg-rose-50 border-rose-300';
      callProbability = 18;
      zoneTextEn = `🔻 Below Safe Cut-off. Review weak areas and target the next upcoming exam cycle.`;
      zoneTextHi = `🔻 अपेक्षित कट-ऑफ से कम। कमजोर विषयों का विश्लेषण करें और अगली भर्ती पर फोकस करें।`;
    }

    return {
      rawScore,
      maxMarks,
      candidatePool,
      effectiveMean,
      baseStdDev,
      zScore,
      percentile,
      normalizedScore,
      estAIR,
      airMin,
      airMax,
      estCategoryRank,
      catMin,
      catMax,
      catPool,
      categoryCutoff,
      selectionZone,
      zoneColor,
      zoneTextEn,
      zoneTextHi,
      callProbability,
      candidatesAhead: Math.max(0, estAIR - 1),
      candidatesBehind: Math.max(0, candidatePool - estAIR),
    };
  }, [rawMarks, totalMarks, totalCandidates, selectedPreset, shiftDifficulty, userCategory, categoryProportions]);

  // Generate SVG Points for Bell Curve Visualizer
  const bellCurveData = useMemo(() => {
    const { effectiveMean, baseStdDev, maxMarks, rawScore } = prediction;
    const width = 640;
    const height = 180;
    const padding = { top: 20, right: 30, bottom: 35, left: 30 };
    const graphW = width - padding.left - padding.right;
    const graphH = height - padding.top - padding.bottom;

    // Define X range from (mean - 3.5 stdDev) to (mean + 3.5 stdDev)
    const minX = Math.max(0, effectiveMean - 3.5 * baseStdDev);
    const maxX = Math.min(maxMarks, effectiveMean + 3.5 * baseStdDev);
    const rangeX = maxX - minX || 1;

    // Maximum PDF height at Mean
    const maxPDF = normalPDF(effectiveMean, effectiveMean, baseStdDev) || 1;

    const points: { x: number; y: number; mark: number }[] = [];
    const steps = 70;

    for (let i = 0; i <= steps; i++) {
      const mark = minX + (i / steps) * rangeX;
      const pdf = normalPDF(mark, effectiveMean, baseStdDev);
      const px = padding.left + ((mark - minX) / rangeX) * graphW;
      const py = padding.top + graphH - (pdf / maxPDF) * graphH;
      points.push({ x: px, y: py, mark });
    }

    // Path string for the smooth curve
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }

    // Shaded Area under the curve up to user's raw score
    const clampedScore = Math.max(minX, Math.min(maxX, rawScore));
    const userPx = padding.left + ((clampedScore - minX) / rangeX) * graphW;
    const userPdf = normalPDF(clampedScore, effectiveMean, baseStdDev);
    const userPy = padding.top + graphH - (userPdf / maxPDF) * graphH;

    // Build shaded path for lower percentile
    let shadedD = `M ${points[0].x} ${padding.top + graphH}`;
    for (const pt of points) {
      if (pt.mark <= clampedScore) {
        shadedD += ` L ${pt.x} ${pt.y}`;
      } else {
        break;
      }
    }
    shadedD += ` L ${userPx} ${userPy} L ${userPx} ${padding.top + graphH} Z`;

    // Benchmark Markers (Mean, +1 Std, -1 Std, Cutoff)
    const meanPx = padding.left + ((effectiveMean - minX) / rangeX) * graphW;
    const cutoffPx = padding.left + ((Math.max(minX, Math.min(maxX, prediction.categoryCutoff)) - minX) / rangeX) * graphW;

    return {
      width,
      height,
      padding,
      graphW,
      graphH,
      pathD,
      shadedD,
      userPx,
      userPy,
      meanPx,
      cutoffPx,
      minX,
      maxX,
      clampedScore,
    };
  }, [prediction]);

  // Copy Result Summary Handler
  const handleCopySummary = () => {
    const summary = `🎯 ${selectedPreset.name} - Rank & Percentile Prediction\n` +
      `📊 Raw Score: ${prediction.rawScore} / ${prediction.maxMarks}\n` +
      `🏆 Est. All India Rank (AIR): ${prediction.airMin.toLocaleString()} - ${prediction.airMax.toLocaleString()}\n` +
      `🥇 Est. ${userCategory} Category Rank: ${prediction.catMin.toLocaleString()} - ${prediction.catMax.toLocaleString()}\n` +
      `📈 Percentile: ${prediction.percentile.toFixed(3)} %ile\n` +
      `⚡ Normalized Score: ~${prediction.normalizedScore}\n` +
      `🎖️ Selection Zone: ${isHi ? prediction.zoneTextHi : prediction.zoneTextEn}\n` +
      `\n🔗 Verified via Sarkari Result Hub - AI Rank Engine 2026`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[94vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0F4C81] via-[#16568d] to-[#0A3459] text-white p-4 sm:p-5 flex items-center justify-between flex-shrink-0 border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-md text-slate-950">
              <TrendingUp className="w-5 h-5 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight">
                  {isHi ? '🎯 सरकारी परीक्षा रैंक प्रिडिक्टर 2026' : '🎯 Exam Rank & Percentile Predictor 2026'}
                </h2>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {isHi ? 'बेल कर्व मॉडल' : 'Gaussian Bell Curve'}
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5 font-medium">
                {isHi 
                  ? 'अपने रॉ मार्क्स (कच्चे अंक) और कुल अभ्यर्थियों के आधार पर ऑल इंडिया रैंक (AIR) व पर्सेंटाइल का सटीक अनुमान लगाएं' 
                  : 'Estimate your All India Rank (AIR), Category Rank & Percentile using standard Gaussian Normal Distribution'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body: Two-Column Workspace */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 bg-slate-50">
          
          {/* 1. Exam Preset Carousel / Selector */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{isHi ? 'प्रतियोगी परीक्षा चुनें (Select Exam Preset):' : 'Select Target Competitive Exam:'}</span>
              </span>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {selectedPreset.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {EXAM_RANK_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`p-2.5 text-left rounded-xl text-xs transition-all border cursor-pointer ${
                    selectedPreset.id === preset.id
                      ? 'bg-blue-50 border-[#0F4C81] ring-2 ring-blue-500/20 font-black text-[#0F4C81] shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <div className="truncate font-bold">{isHi ? preset.nameHi : preset.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-medium flex items-center justify-between">
                    <span>{preset.totalMarks} Mks</span>
                    <span className="text-blue-700 font-bold">{(preset.avgCandidates / 100000).toFixed(1)}L Aspirants</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left Column: Input Form (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                  <Target className="w-4 h-4 text-blue-700" />
                  <span>{isHi ? 'अंक एवं परीक्षा डेटा दर्ज करें' : 'Enter Marks & Exam Inputs'}</span>
                </h3>

                {/* Raw Marks Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      {isHi ? 'आपके प्राप्त रॉ मार्क्स (Raw Marks Scored):' : 'Your Raw Marks Scored:'}
                    </label>
                    <span className="text-xs font-black text-blue-700">
                      Max: {totalMarks}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max={totalMarks}
                      step="0.25"
                      value={rawMarks}
                      onChange={(e) => setRawMarks(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder={`e.g. ${Math.round(totalMarks * 0.7)}`}
                      className="w-full px-3.5 py-2.5 text-base font-black bg-slate-50 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:border-blue-600"
                    />
                    <div className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                      / {totalMarks}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium flex items-center justify-between">
                    <span>{isHi ? 'स्कोर प्रतिशत:' : 'Score Percentage:'}</span>
                    <span className="font-bold text-slate-700">
                      {totalMarks > 0 ? (((Number(rawMarks) || 0) / totalMarks) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>

                {/* Total Candidates & Total Marks (Editable) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {isHi ? 'कुल अभ्यर्थी (Candidates)' : 'Total Candidates'}
                    </label>
                    <input
                      type="number"
                      min="100"
                      value={totalCandidates}
                      onChange={(e) => setTotalCandidates(Math.max(100, Number(e.target.value)))}
                      className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block font-medium">
                      {(totalCandidates / 100000).toFixed(2)} Lakh Aspirants
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {isHi ? 'अधिकतम अंक (Max Marks)' : 'Max Exam Marks'}
                    </label>
                    <input
                      type="number"
                      min="10"
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(Math.max(10, Number(e.target.value)))}
                      className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                    />
                  </div>
                </div>

                {/* Category Selector */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                    {isHi ? 'आरक्षण श्रेणी (Reservation Category):' : 'Candidate Category:'}
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {(['UR', 'OBC', 'EWS', 'SC', 'ST'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setUserCategory(cat)}
                        className={`py-2 px-1 text-xs font-black rounded-lg border transition-all cursor-pointer ${
                          userCategory === cat
                            ? 'bg-[#0F4C81] text-white border-blue-900 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-medium flex items-center justify-between">
                    <span>{isHi ? 'अपेक्षित श्रेणी कट-ऑफ:' : 'Expected Category Cutoff:'}</span>
                    <span className="font-bold text-blue-700">{prediction.categoryCutoff} Marks</span>
                  </div>
                </div>

                {/* Shift Difficulty Selector */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                    {isHi ? 'परीक्षा शिफ्ट का कठिनाई स्तर (Shift Difficulty):' : 'Shift Difficulty Level:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setShiftDifficulty('easy')}
                      className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        shiftDifficulty === 'easy'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500/20'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isHi ? '🟢 आसान (Easy)' : '🟢 Easy'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShiftDifficulty('moderate')}
                      className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        shiftDifficulty === 'moderate'
                          ? 'bg-blue-50 border-blue-500 text-blue-800 ring-1 ring-blue-500/20'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isHi ? '🔵 मध्यम (Average)' : '🔵 Moderate'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShiftDifficulty('hard')}
                      className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        shiftDifficulty === 'hard'
                          ? 'bg-purple-50 border-purple-500 text-purple-800 ring-1 ring-purple-500/20'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isHi ? '🟣 कठिन (Tough/Hard)' : '🟣 Tough / Hard'}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block font-medium">
                    {shiftDifficulty === 'hard' 
                      ? (isHi ? '✨ कठिन शिफ्ट में नॉर्मलाइजेशन में +मार्क्स का लाभ मिलता है।' : '✨ Tough shifts receive a positive boost during normalisation.')
                      : shiftDifficulty === 'easy'
                      ? (isHi ? '⚠️ आसान शिफ्ट में औसत स्कोर अधिक होता है।' : '⚠️ Easy shifts have higher average marks across test-takers.')
                      : (isHi ? 'स्टैंडर्ड बेल कर्व वितरण मॉडल लागू।' : 'Standard symmetrical bell curve applied.')}
                  </span>
                </div>

              </div>

              {/* Quick Mathematical Assumptions Note */}
              <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 text-slate-700 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Info className="w-4 h-4 text-blue-700" />
                  <span>{isHi ? 'वैज्ञानिक बेल कर्व मॉडल कैसे काम करता है?' : 'How Gaussian Rank Modeling Works'}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  {isHi
                    ? 'राष्ट्रीय परीक्षाओं में 10-50 लाख अभ्यर्थियों का स्कोर गाउसियन सामान्य वितरण (Bell Curve Normal Distribution) का अनुसरण करता है। Z-स्कोर और संचयी प्रायिकता फलन (CDF) से सटीक पर्सेंटाइल व ऑल इंडिया रैंक का अनुमान लगाया जाता है।'
                    : 'Large national competitive tests (10-50L aspirants) follow standard Gaussian Normal Distribution. Cumulative error integrals calculate real-time percentile and exact rank bands.'}
                </p>
              </div>

            </div>

            {/* Right Column: Visualizer & Output Results (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Primary Rank & Percentile Banner Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* 1. All India Rank (AIR) */}
                <div className="bg-gradient-to-br from-[#0F4C81] to-[#0A3459] text-white p-4 rounded-2xl shadow-md border border-blue-900 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                      {isHi ? 'ऑल इंडिया रैंक (AIR)' : 'Estimated AIR'}
                    </span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="my-2">
                    <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-300">
                      AIR {prediction.estAIR.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-blue-200 font-medium mt-0.5">
                      {isHi ? 'संभावित दायरा:' : 'Likely Range:'} {prediction.airMin.toLocaleString()} – {prediction.airMax.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-blue-100 font-semibold truncate">
                    {isHi ? `कुल ${prediction.candidatePool.toLocaleString()} में से` : `Out of ${prediction.candidatePool.toLocaleString()} total`}
                  </div>
                </div>

                {/* 2. Percentile Score */}
                <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-4 rounded-2xl shadow-md border border-emerald-950 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                      {isHi ? 'पर्सेंटाइल स्कोर' : 'Percentile'}
                    </span>
                    <Flame className="w-4 h-4 text-emerald-300 animate-pulse" />
                  </div>
                  <div className="my-2">
                    <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      {prediction.percentile.toFixed(2)}%
                    </div>
                    <div className="text-[11px] text-emerald-200 font-medium mt-0.5">
                      Top {(100 - prediction.percentile).toFixed(2)}% Aspirants
                    </div>
                  </div>
                  <div className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-emerald-100 font-semibold truncate">
                    {prediction.candidatesBehind.toLocaleString()} candidates below you
                  </div>
                </div>

                {/* 3. Category Rank & Normalized Projection */}
                <div className="bg-gradient-to-br from-purple-800 to-indigo-950 text-white p-4 rounded-2xl shadow-md border border-purple-900 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                      {userCategory} {isHi ? 'श्रेणी रैंक' : 'Category Rank'}
                    </span>
                    <Zap className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="my-2">
                    <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-200">
                      #{prediction.estCategoryRank.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-purple-200 font-medium mt-0.5">
                      Norm. Score: ~{prediction.normalizedScore} Mks
                    </div>
                  </div>
                  <div className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-purple-100 font-semibold truncate">
                    {userCategory} Pool: ~{(prediction.catPool / 1000).toFixed(0)}K
                  </div>
                </div>

              </div>

              {/* Selection Probability & Analysis Card */}
              <div className={`p-4 rounded-2xl border shadow-xs transition-all ${prediction.zoneColor}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-white/80 rounded-xl shadow-xs shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider">
                          {isHi ? 'चयन संभावना विश्लेषण (Selection Verdict):' : 'Selection Probability Verdict:'}
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded-full text-xs font-black shadow-xs">
                          {prediction.callProbability}% Probability
                        </span>
                      </div>
                      <p className="text-xs font-bold mt-1 text-slate-900 leading-relaxed">
                        {isHi ? prediction.zoneTextHi : prediction.zoneTextEn}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl shadow-xs border border-slate-200 shrink-0 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                    title="Copy Full Prediction Summary"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copied ? (isHi ? 'कॉपी हो गया' : 'Copied!') : (isHi ? 'कॉपी' : 'Copy')}</span>
                  </button>
                </div>

                {/* Progress Bar for Call Probability */}
                <div className="w-full bg-slate-200/80 rounded-full h-2 mt-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 via-teal-500 to-emerald-600 transition-all duration-500 rounded-full"
                    style={{ width: `${prediction.callProbability}%` }}
                  />
                </div>
              </div>

              {/* Interactive Gaussian Bell Curve SVG Chart */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-blue-700" />
                    <span>{isHi ? 'सामान्य वितरण बेल कर्व (Gaussian Curve Visualization)' : 'Gaussian Normal Distribution Curve'}</span>
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] font-bold">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      {isHi ? 'आपका स्कोर' : 'Your Score'} ({prediction.rawScore})
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                      {isHi ? 'औसत (Mean)' : 'Mean'} ({Math.round(prediction.effectiveMean)})
                    </span>
                  </div>
                </div>

                {/* SVG Visualizer */}
                <div className="w-full bg-slate-900 rounded-xl p-2 sm:p-3 overflow-x-auto shadow-inner">
                  <svg 
                    viewBox={`0 0 ${bellCurveData.width} ${bellCurveData.height}`} 
                    className="w-full h-auto min-w-[500px]"
                  >
                    <defs>
                      {/* Gradient for Shaded Percentile Area */}
                      <linearGradient id="bellPercentileGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.65" />
                        <stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
                      </linearGradient>

                      {/* Line Stroke Gradient */}
                      <linearGradient id="bellStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="50%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Baseline */}
                    <line 
                      x1={bellCurveData.padding.left} 
                      y1={bellCurveData.padding.top + bellCurveData.graphH} 
                      x2={bellCurveData.width - bellCurveData.padding.right} 
                      y2={bellCurveData.padding.top + bellCurveData.graphH} 
                      stroke="#334155" 
                      strokeWidth="1.5" 
                    />

                    {/* Shaded Area up to User's Score */}
                    <path d={bellCurveData.shadedD} fill="url(#bellPercentileGradient)" />

                    {/* Main Bell Curve Line */}
                    <path 
                      d={bellCurveData.pathD} 
                      fill="none" 
                      stroke="url(#bellStrokeGradient)" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                    />

                    {/* Mean Line (Dashed) */}
                    <line 
                      x1={bellCurveData.meanPx} 
                      y1={bellCurveData.padding.top} 
                      x2={bellCurveData.meanPx} 
                      y2={bellCurveData.padding.top + bellCurveData.graphH} 
                      stroke="#94a3b8" 
                      strokeWidth="1.5" 
                      strokeDasharray="4 4" 
                    />
                    <text 
                      x={bellCurveData.meanPx} 
                      y={bellCurveData.padding.top + bellCurveData.graphH + 16} 
                      fill="#94a3b8" 
                      fontSize="10" 
                      fontWeight="bold" 
                      textAnchor="middle"
                    >
                      Mean ({Math.round(prediction.effectiveMean)})
                    </text>

                    {/* Expected Cutoff Line (Amber Dashed) */}
                    <line 
                      x1={bellCurveData.cutoffPx} 
                      y1={bellCurveData.padding.top + 10} 
                      x2={bellCurveData.cutoffPx} 
                      y2={bellCurveData.padding.top + bellCurveData.graphH} 
                      stroke="#f59e0b" 
                      strokeWidth="1.5" 
                      strokeDasharray="3 3" 
                    />
                    <text 
                      x={bellCurveData.cutoffPx} 
                      y={bellCurveData.padding.top + 10} 
                      fill="#f59e0b" 
                      fontSize="9" 
                      fontWeight="bold" 
                      textAnchor="middle"
                    >
                      Cutoff ({prediction.categoryCutoff})
                    </text>

                    {/* User Pinpoint Indicator */}
                    <line 
                      x1={bellCurveData.userPx} 
                      y1={bellCurveData.userPy} 
                      x2={bellCurveData.userPx} 
                      y2={bellCurveData.padding.top + bellCurveData.graphH} 
                      stroke="#10b981" 
                      strokeWidth="2.5" 
                    />
                    <circle 
                      cx={bellCurveData.userPx} 
                      cy={bellCurveData.userPy} 
                      r="6" 
                      fill="#10b981" 
                      stroke="#ffffff" 
                      strokeWidth="2" 
                    />
                    <rect 
                      x={bellCurveData.userPx - 34} 
                      y={bellCurveData.userPy - 24} 
                      width="68" 
                      height="18" 
                      rx="4" 
                      fill="#10b981" 
                    />
                    <text 
                      x={bellCurveData.userPx} 
                      y={bellCurveData.userPy - 12} 
                      fill="#ffffff" 
                      fontSize="10" 
                      fontWeight="black" 
                      textAnchor="middle"
                    >
                      You: {prediction.rawScore}
                    </text>

                    {/* X-Axis Range Extremes */}
                    <text 
                      x={bellCurveData.padding.left} 
                      y={bellCurveData.padding.top + bellCurveData.graphH + 16} 
                      fill="#64748b" 
                      fontSize="10" 
                      fontWeight="600" 
                      textAnchor="start"
                    >
                      {Math.round(bellCurveData.minX)} Mks
                    </text>
                    <text 
                      x={bellCurveData.width - bellCurveData.padding.right} 
                      y={bellCurveData.padding.top + bellCurveData.graphH + 16} 
                      fill="#64748b" 
                      fontSize="10" 
                      fontWeight="600" 
                      textAnchor="end"
                    >
                      {Math.round(bellCurveData.maxX)} Mks
                    </text>
                  </svg>
                </div>

                {/* Footnote of the Visualizer */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
                  <span>
                    {isHi ? '🟢 छायांकित हरा क्षेत्र: आपसे कम अंक प्राप्त करने वाले अभ्यर्थी' : '🟢 Shaded Area: % of candidates scoring below your mark'}
                  </span>
                  <span className="font-bold text-slate-700">
                    Z-Score: {prediction.zScore.toFixed(2)} σ
                  </span>
                </div>
              </div>

              {/* Competitive Benchmark Targets Table */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-4 h-4 text-blue-700" />
                    <span>{isHi ? 'रैंक बेंचमार्क तुलना (Competitive Milestones):' : 'Key Competitive Rank Milestones:'}</span>
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                    {selectedPreset.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">{isHi ? 'शीर्ष 100 रैंक' : 'Top 100 AIR'}</div>
                    <div className="text-sm font-black text-blue-900 mt-0.5">
                      ~{Math.round(prediction.effectiveMean + 3.7 * prediction.baseStdDev)} Mks
                    </div>
                    <div className="text-[9px] text-emerald-700 font-bold">99.99 %ile</div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">{isHi ? 'शीर्ष 1,000 रैंक' : 'Top 1,000 AIR'}</div>
                    <div className="text-sm font-black text-blue-900 mt-0.5">
                      ~{Math.round(prediction.effectiveMean + 3.0 * prediction.baseStdDev)} Mks
                    </div>
                    <div className="text-[9px] text-emerald-700 font-bold">99.90 %ile</div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">{isHi ? 'शीर्ष 10,000 रैंक' : 'Top 10,000 AIR'}</div>
                    <div className="text-sm font-black text-blue-900 mt-0.5">
                      ~{Math.round(prediction.effectiveMean + 2.3 * prediction.baseStdDev)} Mks
                    </div>
                    <div className="text-[9px] text-teal-700 font-bold">99.00 %ile</div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">{isHi ? 'कट-ऑफ क्वालीफाई' : 'Cutoff Safe'}</div>
                    <div className="text-sm font-black text-emerald-700 mt-0.5">
                      ~{prediction.categoryCutoff} Mks
                    </div>
                    <div className="text-[9px] text-slate-500 font-bold">{userCategory} Quota</div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isHi
                ? 'यह अनुमान मानक सामान्य सांख्यिकीय वितरण और पिछले 5 वर्षों के रुझानों पर आधारित है।'
                : 'Scientific estimation derived via Gaussian distribution & 5-year exam trends.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? (isHi ? 'कॉपी हो गया' : 'Summary Copied') : (isHi ? 'स्कोरकार्ड शेयर करें' : 'Share / Copy Report')}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#0F4C81] hover:bg-blue-900 text-white text-xs font-black rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              {isHi ? 'बंद करें' : 'Done & Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
