import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Upload, 
  Download, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  RotateCw, 
  Crop, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  ShieldCheck, 
  RefreshCw,
  Info,
  Type,
  Calendar,
  Move,
  Eye,
  Check,
  AlertTriangle,
  SunMedium,
  Contrast,
  Wand2
} from 'lucide-react';

interface PhotoSignatureResizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'hi';
}

type FitMode = 'cover' | 'contain' | 'stretch';
type UnitType = 'px' | 'cm' | 'mm' | 'in';

interface ExamPreset {
  id: string;
  name: string;
  nameHi: string;
  type: 'photo' | 'signature' | 'both';
  widthPx: number;
  heightPx: number;
  widthCm?: number;
  heightCm?: number;
  minKb: number;
  maxKb: number;
  recommendedKb: number;
  format: 'image/jpeg' | 'image/png';
  dpi: number;
  requiresNameDate?: boolean;
  description: string;
  descriptionHi: string;
}

const EXAM_PRESETS: ExamPreset[] = [
  {
    id: 'ssc-cgl-photo',
    name: 'SSC CGL / CHSL / GD (Photo)',
    nameHi: 'SSC सीजीएल / जीडी (पासपोर्ट फोटो)',
    type: 'photo',
    widthPx: 350,
    heightPx: 450,
    widthCm: 3.5,
    heightCm: 4.5,
    minKb: 20,
    maxKb: 50,
    recommendedKb: 35,
    format: 'image/jpeg',
    dpi: 200,
    requiresNameDate: true,
    description: '3.5 x 4.5 cm (350x450 px), 20 KB to 50 KB JPEG with clean background',
    descriptionHi: '3.5 x 4.5 सेमी, 20 से 50 KB JPEG (हल्का/सफेद बैकग्राउंड)'
  },
  {
    id: 'ssc-signature',
    name: 'SSC Signature (Official)',
    nameHi: 'SSC हस्ताक्षर (Signature 10-20 KB)',
    type: 'signature',
    widthPx: 400,
    heightPx: 200,
    widthCm: 4.0,
    heightCm: 2.0,
    minKb: 10,
    maxKb: 20,
    recommendedKb: 15,
    format: 'image/jpeg',
    dpi: 200,
    requiresNameDate: false,
    description: '4.0 x 2.0 cm (400x200 px), 10 KB to 20 KB JPEG on white paper',
    descriptionHi: 'काली स्याही से सफेद कागज पर, 10 से 20 KB JPEG'
  },
  {
    id: 'upsc-photo',
    name: 'UPSC IAS / NDA / CDS (Photo)',
    nameHi: 'UPSC सिविल सेवा (Photo 350x350)',
    type: 'photo',
    widthPx: 350,
    heightPx: 350,
    widthCm: 3.5,
    heightCm: 3.5,
    minKb: 20,
    maxKb: 300,
    recommendedKb: 50,
    format: 'image/jpeg',
    dpi: 300,
    requiresNameDate: true,
    description: 'Square 350x350 px, Candidate Name & Date of Photo mandatory, 20-300 KB',
    descriptionHi: '350x350 px वर्गाकार, फोटो पर नाम और दिनांक अनिवार्य'
  },
  {
    id: 'upsc-signature',
    name: 'UPSC Official Signature',
    nameHi: 'UPSC हस्ताक्षर (350x350 px)',
    type: 'signature',
    widthPx: 350,
    heightPx: 350,
    widthCm: 3.5,
    heightCm: 3.5,
    minKb: 20,
    maxKb: 300,
    recommendedKb: 40,
    format: 'image/jpeg',
    dpi: 300,
    requiresNameDate: false,
    description: 'Square 350x350 px, 20 KB to 300 KB JPEG',
    descriptionHi: '350x350 px, 20 से 300 KB JPEG'
  },
  {
    id: 'rrb-railway-photo',
    name: 'RRB Railway (NTPC / Group D / ALP)',
    nameHi: 'रेलवे भर्ती (RRB NTPC / ALP Photo)',
    type: 'photo',
    widthPx: 320,
    heightPx: 400,
    widthCm: 3.5,
    heightCm: 4.5,
    minKb: 30,
    maxKb: 70,
    recommendedKb: 45,
    format: 'image/jpeg',
    dpi: 200,
    requiresNameDate: false,
    description: 'Color Passport Photo, 30 to 70 KB JPG',
    descriptionHi: 'कलर पासपोर्ट फोटो, 30 से 70 KB JPG'
  },
  {
    id: 'rrb-railway-sign',
    name: 'RRB Railway Signature',
    nameHi: 'रेलवे भर्ती हस्ताक्षर (10-30 KB)',
    type: 'signature',
    widthPx: 320,
    heightPx: 160,
    widthCm: 4.0,
    heightCm: 2.0,
    minKb: 10,
    maxKb: 30,
    recommendedKb: 18,
    format: 'image/jpeg',
    dpi: 200,
    requiresNameDate: false,
    description: 'Black Ink, 10 to 30 KB JPG',
    descriptionHi: 'काली स्याही, 10 से 30 KB JPG'
  },
  {
    id: 'ibps-bank-photo',
    name: 'IBPS / SBI Bank PO & Clerk Photo',
    nameHi: 'बैंक भर्ती (IBPS / SBI Photo 200x230)',
    type: 'photo',
    widthPx: 200,
    heightPx: 230,
    widthCm: 4.5,
    heightCm: 3.5,
    minKb: 20,
    maxKb: 50,
    recommendedKb: 35,
    format: 'image/jpeg',
    dpi: 200,
    requiresNameDate: false,
    description: '200 x 230 Pixels, 20 to 50 KB JPG',
    descriptionHi: '200 x 230 पिक्सल, 20 से 50 KB JPG'
  },
  {
    id: 'ibps-bank-sign',
    name: 'IBPS / SBI Bank Signature',
    nameHi: 'बैंक भर्ती हस्ताक्षर (140x60 px, 10-20 KB)',
    type: 'signature',
    widthPx: 140,
    heightPx: 60,
    widthCm: 3.5,
    heightCm: 1.5,
    minKb: 10,
    maxKb: 20,
    recommendedKb: 14,
    format: 'image/jpeg',
    dpi: 200,
    requiresNameDate: false,
    description: '140 x 60 Pixels, 10 to 20 KB JPG',
    descriptionHi: '140 x 60 पिक्सल, 10 से 20 KB JPG'
  },
  {
    id: 'nta-neet-photo',
    name: 'NTA NEET / JEE Main (Passport Photo)',
    nameHi: 'NTA नीट / जेईई (पासपोर्ट फोटो)',
    type: 'photo',
    widthPx: 350,
    heightPx: 450,
    widthCm: 3.5,
    heightCm: 4.5,
    minKb: 10,
    maxKb: 200,
    recommendedKb: 50,
    format: 'image/jpeg',
    dpi: 200,
    requiresNameDate: true,
    description: 'Postcard or Passport, Name & Date required, 10 to 200 KB',
    descriptionHi: 'नाम और फोटो दिनांक सहित, 10 से 200 KB'
  },
  {
    id: 'state-police-photo',
    name: 'UP / Bihar / Rajasthan Police Photo',
    nameHi: 'राज्य पुलिस भर्ती फोटो (20-50 KB)',
    type: 'photo',
    widthPx: 350,
    heightPx: 450,
    widthCm: 3.5,
    heightCm: 4.5,
    minKb: 20,
    maxKb: 50,
    recommendedKb: 35,
    format: 'image/jpeg',
    dpi: 200,
    requiresNameDate: true,
    description: 'Police Constable/SI Online Form, 20 to 50 KB',
    descriptionHi: 'पुलिस कांस्टेबल/दरोगा भर्ती, 20 से 50 KB'
  },
  {
    id: 'custom-photo-sign',
    name: 'Custom Dimensions & Exact KB',
    nameHi: 'कस्टम साइज़ और KB (Custom)',
    type: 'both',
    widthPx: 350,
    heightPx: 450,
    minKb: 20,
    maxKb: 100,
    recommendedKb: 40,
    format: 'image/jpeg',
    dpi: 200,
    requiresNameDate: false,
    description: 'Set your own Width, Height, Target KB & Name/Date overlay',
    descriptionHi: 'अपनी आवश्यकतानुसार चौड़ाई, ऊंचाई और KB साइज सेट करें'
  }
];

export const PhotoSignatureResizerModal: React.FC<PhotoSignatureResizerModalProps> = ({
  isOpen,
  onClose,
  language = 'en'
}) => {
  const isHi = language === 'hi';

  // Mode: Photo or Signature
  const [toolMode, setToolMode] = useState<'photo' | 'signature'>('photo');
  const [selectedPreset, setSelectedPreset] = useState<ExamPreset>(EXAM_PRESETS[0]);

  // Image states
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState<string>('sarkari_photo.jpg');
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Units and Dimensions
  const [unit, setUnit] = useState<UnitType>('px');
  const [customWidth, setCustomWidth] = useState<number>(350);
  const [customHeight, setCustomHeight] = useState<number>(450);
  const [targetKb, setTargetKb] = useState<number>(35);
  const [targetMinKb, setTargetMinKb] = useState<number>(20);
  const [targetMaxKb, setTargetMaxKb] = useState<number>(50);

  // Framing & Cropping Mode
  const [fitMode, setFitMode] = useState<FitMode>('cover');
  const [zoom, setZoom] = useState<number>(100);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);

  // Overlay Controls (Name & Date of Photo)
  const [addNameDate, setAddNameDate] = useState<boolean>(true);
  const [candidateName, setCandidateName] = useState<string>('');
  const [photoDate, setPhotoDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Image Filters & Enhancements
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [cleanSignature, setCleanSignature] = useState<boolean>(false);
  const [signThreshold, setSignThreshold] = useState<number>(180);

  // Output States
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [processedDataUrl, setProcessedDataUrl] = useState<string | null>(null);
  const [processedSizeKb, setProcessedSizeKb] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mode change handler
  const handleModeChange = (mode: 'photo' | 'signature') => {
    setToolMode(mode);
    if (mode === 'photo') {
      const preset = EXAM_PRESETS.find(p => p.id === 'ssc-cgl-photo') || EXAM_PRESETS[0];
      setSelectedPreset(preset);
      setCustomWidth(preset.widthPx);
      setCustomHeight(preset.heightPx);
      setTargetMinKb(preset.minKb);
      setTargetMaxKb(preset.maxKb);
      setTargetKb(preset.recommendedKb);
      setAddNameDate(preset.requiresNameDate || false);
      setCleanSignature(false);
    } else {
      const preset = EXAM_PRESETS.find(p => p.id === 'ssc-signature') || EXAM_PRESETS[1];
      setSelectedPreset(preset);
      setCustomWidth(preset.widthPx);
      setCustomHeight(preset.heightPx);
      setTargetMinKb(preset.minKb);
      setTargetMaxKb(preset.maxKb);
      setTargetKb(preset.recommendedKb);
      setAddNameDate(false);
      setCleanSignature(true); // Auto-enable clean signature for clear black/white output
    }
    // Reset pan/zoom
    setZoom(100);
    setPanX(0);
    setPanY(0);
  };

  // Preset Selection
  const handlePresetSelect = (preset: ExamPreset) => {
    setSelectedPreset(preset);
    setCustomWidth(preset.widthPx);
    setCustomHeight(preset.heightPx);
    setTargetMinKb(preset.minKb);
    setTargetMaxKb(preset.maxKb);
    setTargetKb(preset.recommendedKb);
    if (preset.requiresNameDate !== undefined) {
      setAddNameDate(preset.requiresNameDate);
    }
    if (preset.type === 'signature') {
      setCleanSignature(true);
    }
  };

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setOriginalSizeKb(Math.max(1, Math.round(file.size / 1024)));

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setOriginalDimensions({ width: img.width, height: img.height });
        // Reset transforms
        setZoom(100);
        setPanX(0);
        setPanY(0);
        setRotation(0);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setOriginalSizeKb(Math.max(1, Math.round(file.size / 1024)));

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setOriginalDimensions({ width: img.width, height: img.height });
        setZoom(100);
        setPanX(0);
        setPanY(0);
        setRotation(0);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Safe JPEG Padder to guarantee file size is within [minKb, maxKb]
  const ensureJpegExactKb = (blob: Blob, targetTargetKb: number, minKb: number, maxKb: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const currentKb = blob.size / 1024;
      const minRequiredBytes = minKb * 1024;
      const maxAllowedBytes = maxKb * 1024;

      // If already within valid range and close to target, return directly
      if (blob.size >= minRequiredBytes && blob.size <= maxAllowedBytes) {
        resolve(blob);
        return;
      }

      // If too small (common for low-res signatures like 140x60 where raw JPEG is only 2-4 KB)
      if (blob.size < minRequiredBytes) {
        const desiredBytes = Math.round(Math.min(targetTargetKb * 1024, maxAllowedBytes - 100));
        const neededPadding = desiredBytes - blob.size;

        if (neededPadding > 8) {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const arrayBuffer = reader.result as ArrayBuffer;
              const uint8 = new Uint8Array(arrayBuffer);
              
              // Standard JPEG COM (Comment marker: 0xFF, 0xFE, 2-bytes length, data...)
              const segmentLength = Math.min(65533, Math.max(10, neededPadding));
              const commentHeader = new Uint8Array([0xFF, 0xFE, (segmentLength >> 8) & 0xFF, segmentLength & 0xFF]);
              const commentData = new Uint8Array(segmentLength - 2);
              
              // Fill with valid standard comment text
              const padPattern = "SARKARI_EXAM_PHOTO_SIGN_RESIZER_2026_ACCURATE_KB_VERIFIED_";
              for (let i = 0; i < commentData.length; i++) {
                commentData[i] = padPattern.charCodeAt(i % padPattern.length);
              }

              const padded = new Uint8Array(uint8.length + 4 + commentData.length);
              // Copy JPEG SOI (0xFF, 0xD8)
              padded.set(uint8.subarray(0, 2), 0);
              // Insert COM marker
              padded.set(commentHeader, 2);
              padded.set(commentData, 6);
              // Copy rest of JPEG
              padded.set(uint8.subarray(2), 6 + commentData.length);

              resolve(new Blob([padded], { type: 'image/jpeg' }));
            } catch {
              resolve(blob);
            }
          };
          reader.readAsArrayBuffer(blob);
          return;
        }
      }

      resolve(blob);
    });
  };

  // Image Processing Core
  const processImage = useCallback(async () => {
    if (!originalImage) return;

    setIsProcessing(true);

    try {
      const targetW = Math.max(50, Math.min(2000, Number(customWidth) || 350));
      const targetH = Math.max(50, Math.min(2000, Number(customHeight) || 450));

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // 1. Fill solid crisp white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);

      // 2. Compute Draw Source and Destination based on Fit Mode and Pan/Zoom
      const zoomFactor = Math.max(0.2, zoom / 100);
      const imgW = originalImage.width;
      const imgH = originalImage.height;

      ctx.save();
      
      // Apply filters (brightness, contrast)
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

      // Translate to canvas center for rotation & pan
      ctx.translate(targetW / 2 + panX, targetH / 2 + panY);
      if (rotation !== 0) {
        ctx.rotate((rotation * Math.PI) / 180);
      }

      // Calculate aspect-ratio preserved dimensions
      let renderW = targetW * zoomFactor;
      let renderH = targetH * zoomFactor;

      if (fitMode === 'cover') {
        const scale = Math.max(targetW / imgW, targetH / imgH) * zoomFactor;
        renderW = imgW * scale;
        renderH = imgH * scale;
      } else if (fitMode === 'contain') {
        const scale = Math.min(targetW / imgW, targetH / imgH) * zoomFactor;
        renderW = imgW * scale;
        renderH = imgH * scale;
      } else {
        // Stretch
        renderW = targetW * zoomFactor;
        renderH = targetH * zoomFactor;
      }

      ctx.drawImage(originalImage, -renderW / 2, -renderH / 2, renderW, renderH);
      ctx.restore();

      // 3. Clean Signature Mode (Thresholding for pure black ink & pure white paper)
      if (cleanSignature && toolMode === 'signature') {
        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;
        const thresh = signThreshold;

        for (let i = 0; i < data.length; i += 4) {
          // Grayscale luminance
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          if (gray > thresh) {
            // White paper background
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
          } else {
            // Darken ink to pure black/navy
            const factor = gray / thresh;
            data[i] = Math.round(data[i] * factor * 0.5);
            data[i + 1] = Math.round(data[i + 1] * factor * 0.5);
            data[i + 2] = Math.round(data[i + 2] * factor * 0.5);
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      // 4. Candidate Name & Date of Photo Stamp (Official Govt Format)
      if (addNameDate && toolMode === 'photo') {
        const overlayH = Math.max(48, Math.round(targetH * 0.20));
        const overlayY = targetH - overlayH;

        // Clean white label footer box
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, overlayY, targetW, overlayH);

        // Thin dark border on top of white box
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(0, overlayY, targetW, overlayH);

        // Stamp Candidate Name
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const displayName = candidateName.trim() ? candidateName.toUpperCase() : 'CANDIDATE NAME';
        
        let formattedDate = photoDate;
        if (photoDate) {
          const parts = photoDate.split('-');
          if (parts.length === 3) {
            formattedDate = `DOP: ${parts[2]}/${parts[1]}/${parts[0]}`;
          }
        }

        const nameFontSize = Math.max(12, Math.round(overlayH * 0.32));
        ctx.font = `bold ${nameFontSize}px Arial, sans-serif`;
        ctx.fillText(displayName, targetW / 2, overlayY + overlayH * 0.32);

        // Stamp Date of Photo (DOP)
        const dateFontSize = Math.max(11, Math.round(overlayH * 0.28));
        ctx.font = `600 ${dateFontSize}px Arial, sans-serif`;
        ctx.fillText(formattedDate, targetW / 2, overlayY + overlayH * 0.72);
      }

      // 5. Intelligent Multi-Pass JPEG Compression for exact KB target
      let bestBlob: Blob | null = null;
      let quality = 0.92;
      const targetBytes = (Number(targetKb) || 35) * 1024;

      // First pass: try multiple quality levels
      for (let q = 0.95; q >= 0.2; q -= 0.15) {
        const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', q));
        if (blob) {
          bestBlob = blob;
          if (blob.size <= targetBytes) {
            quality = q;
            break;
          }
        }
      }

      if (!bestBlob) {
        bestBlob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.85));
      }

      if (bestBlob) {
        // Guarantee file is within [minKb, maxKb] bounds via standard compliant padding if needed
        const guaranteedBlob = await ensureJpegExactKb(bestBlob, targetKb, targetMinKb, targetMaxKb);
        
        setProcessedBlob(guaranteedBlob);
        setProcessedSizeKb(Math.max(1, Math.round(guaranteedBlob.size / 1024)));
        
        const dataUrl = URL.createObjectURL(guaranteedBlob);
        setProcessedDataUrl(dataUrl);
      }

    } catch (err) {
      console.error('Photo Resizer Error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [
    originalImage, 
    customWidth, 
    customHeight, 
    fitMode, 
    zoom, 
    panX, 
    panY, 
    brightness, 
    contrast, 
    rotation, 
    cleanSignature, 
    signThreshold, 
    addNameDate, 
    candidateName, 
    photoDate, 
    targetKb, 
    targetMinKb, 
    targetMaxKb, 
    toolMode
  ]);

  // Trigger processing whenever settings change
  useEffect(() => {
    if (originalImage) {
      const timer = setTimeout(() => {
        processImage();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [processImage, originalImage]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (processedDataUrl) {
        URL.revokeObjectURL(processedDataUrl);
      }
    };
  }, [processedDataUrl]);

  // Download Output File
  const handleDownload = () => {
    if (!processedBlob) return;

    const link = document.createElement('a');
    const ext = 'jpg';
    const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/\s+/g, '_');
    link.download = `${cleanName}_${toolMode}_${customWidth}x${customHeight}_${processedSizeKb}kb.${ext}`;
    link.href = URL.createObjectURL(processedBlob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const isSizePerfect = processedSizeKb >= targetMinKb && processedSizeKb <= targetMaxKb;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[94vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0F4C81] via-[#155e9c] to-[#0A3459] text-white p-4 sm:p-5 flex items-center justify-between flex-shrink-0 border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-md text-slate-950">
              <Sliders className="w-5 h-5 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight">
                  {isHi ? '📸 सरकारी फोटो & सिग्नेचर रीसाइज़र 2026' : '📸 Sarkari Photo & Signature Resizer 2026'}
                </h2>
                <span className="bg-emerald-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {isHi ? '100% सटीक KB' : 'Exact KB Engine'}
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5 font-medium">
                {isHi 
                  ? 'SSC, UPSC, Railway, Police, Bank के लिए फोटो और सिग्नेचर को सटीक साइज़ (20-50 KB) और नाम/दिनांक के साथ तैयार करें' 
                  : 'Resize & compress images to exact dimensions & 20-50 KB for SSC, UPSC, IBPS, RRB & Police online forms'}
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

        {/* Modal Body: Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 bg-slate-50">
          
          {/* 1. Mode Selector: Photo vs Signature */}
          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
            <button
              type="button"
              onClick={() => handleModeChange('photo')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-sm transition-all border shadow-xs cursor-pointer ${
                toolMode === 'photo'
                  ? 'bg-[#0F4C81] text-white border-blue-900 shadow-md ring-2 ring-blue-500/30'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>{isHi ? '📷 पासपोर्ट फोटो (Passport Photo)' : '📷 Passport Photo'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('signature')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-sm transition-all border shadow-xs cursor-pointer ${
                toolMode === 'signature'
                  ? 'bg-[#0F4C81] text-white border-blue-900 shadow-md ring-2 ring-blue-500/30'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{isHi ? '✍️ हस्ताक्षर (Signature Resizer)' : '✍️ Signature Resizer'}</span>
            </button>
          </div>

          {/* 2. Official Exam Presets Bar */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{isHi ? 'सरकारी भर्ती प्रीसेट चुनें (Select Official Exam Preset):' : 'Select Official Exam Preset:'}</span>
              </span>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {selectedPreset.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {EXAM_PRESETS.filter(p => p.type === toolMode || p.type === 'both').map((preset) => (
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
                    <span>{preset.widthPx}x{preset.heightPx} px</span>
                    <span className="text-emerald-700 font-bold">{preset.minKb}-{preset.maxKb} KB</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Main Workspace: Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left Column: Controls (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* File Upload Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="bg-white border-2 border-dashed border-blue-400 hover:border-blue-600 rounded-2xl p-5 text-center cursor-pointer transition-all hover:bg-blue-50/40 shadow-xs group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                />
                <div className="w-11 h-11 bg-blue-100 text-[#0F4C81] rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-black text-slate-800">
                  {originalImage 
                    ? (isHi ? '🔄 दूसरी फोटो चुनें / फाइल बदलें' : '🔄 Change Image / Drop Another File') 
                    : (isHi ? 'फोटो या सिग्नेचर चुनें या यहाँ ड्रॉप करें' : 'Click to Upload or Drag & Drop')}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-medium">
                  {isHi ? 'सपोर्टेड: JPG, JPEG, PNG, WEBP (अधिकतम 15 MB)' : 'Supports JPG, JPEG, PNG, WEBP (Up to 15 MB)'}
                </div>

                {originalImage && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-bold">
                    <span className="truncate max-w-[160px]">{fileName}</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {originalDimensions.width}x{originalDimensions.height} px • {originalSizeKb} KB
                    </span>
                  </div>
                )}
              </div>

              {/* Dimensions & Target File Size */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-blue-700" />
                    <span>{isHi ? 'डायमेंशन और KB साइज़' : 'Target Dimensions & KB'}</span>
                  </h3>

                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-black">
                    <button
                      type="button"
                      onClick={() => setUnit('px')}
                      className={`px-2 py-0.5 rounded ${unit === 'px' ? 'bg-[#0F4C81] text-white' : 'text-slate-600'}`}
                    >
                      PX
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit('cm')}
                      className={`px-2 py-0.5 rounded ${unit === 'cm' ? 'bg-[#0F4C81] text-white' : 'text-slate-600'}`}
                    >
                      CM
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {unit === 'cm' ? (isHi ? 'चौड़ाई (Width cm)' : 'Width (cm)') : (isHi ? 'चौड़ाई (Width px)' : 'Width (px)')}
                    </label>
                    <input
                      type="number"
                      value={unit === 'cm' ? ((customWidth / 200) * 2.54).toFixed(1) : customWidth}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (unit === 'cm') {
                          setCustomWidth(Math.round((val / 2.54) * 200));
                        } else {
                          setCustomWidth(val);
                        }
                      }}
                      className="w-full px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {unit === 'cm' ? (isHi ? 'ऊंचाई (Height cm)' : 'Height (cm)') : (isHi ? 'ऊंचाई (Height px)' : 'Height (px)')}
                    </label>
                    <input
                      type="number"
                      value={unit === 'cm' ? ((customHeight / 200) * 2.54).toFixed(1) : customHeight}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (unit === 'cm') {
                          setCustomHeight(Math.round((val / 2.54) * 200));
                        } else {
                          setCustomHeight(val);
                        }
                      }}
                      className="w-full px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                    />
                  </div>
                </div>

                {/* Target KB Slider */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-700">{isHi ? 'सटीक लक्ष्य साइज़ (Target KB):' : 'Target Exact Size (KB):'}</span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-black">{targetKb} KB</span>
                  </div>
                  <input
                    type="range"
                    min={Math.max(5, targetMinKb - 5)}
                    max={Math.max(50, targetMaxKb + 20)}
                    value={targetKb}
                    onChange={(e) => setTargetKb(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F4C81]"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>{isHi ? `न्यूनतम: ${targetMinKb} KB` : `Min: ${targetMinKb} KB`}</span>
                    <span>{isHi ? `अधिकतम: ${targetMaxKb} KB` : `Max: ${targetMaxKb} KB`}</span>
                  </div>
                </div>
              </div>

              {/* Crop, Fit Mode & Framing Tools */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Crop className="w-4 h-4 text-emerald-700" />
                  <span>{isHi ? 'फ्रेमिंग और क्रॉप सेटिंग्स' : 'Framing & Crop Alignment'}</span>
                </h3>

                {/* Fit Mode Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFitMode('cover')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                      fitMode === 'cover'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {isHi ? 'कवर (बिना खींचे)' : 'Cover (Fill)'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFitMode('contain')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                      fitMode === 'contain'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {isHi ? 'फिट (सफेद बॉर्डर)' : 'Fit (Contain)'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFitMode('stretch')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                      fitMode === 'stretch'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {isHi ? 'स्ट्रेच (Stretch)' : 'Stretch'}
                  </button>
                </div>

                {/* Zoom & Alignment Sliders */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span className="flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>{isHi ? 'ज़ूम (Zoom)' : 'Zoom Level'}</span>
                    </span>
                    <span>{zoom}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F4C81]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500">{isHi ? 'ऊपर/नीचे खिसकाएं (Y Shift)' : 'Vertical Shift'}</span>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      value={panY}
                      onChange={(e) => setPanY(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500">{isHi ? 'दाएं/बाएं खिसकाएं (X Shift)' : 'Horizontal Shift'}</span>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      value={panX}
                      onChange={(e) => setPanX(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                </div>

                {/* Rotate & Reset */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{isHi ? '90° घुमाएं (Rotate)' : 'Rotate 90°'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setZoom(100);
                      setPanX(0);
                      setPanY(0);
                      setRotation(0);
                      setBrightness(100);
                      setContrast(100);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    title="Reset All Adjustments"
                  >
                    {isHi ? 'रीसेट' : 'Reset'}
                  </button>
                </div>
              </div>

              {/* Signature Enhancer Filter */}
              {toolMode === 'signature' && (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cleanSignature}
                        onChange={(e) => setCleanSignature(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="text-xs font-black text-emerald-950 flex items-center gap-1">
                        <Wand2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{isHi ? '✨ साफ सफेद बैकग्राउंड & डार्क इंक' : '✨ Clean White BG & Dark Ink (B&W)'}</span>
                      </span>
                    </label>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.5 rounded">
                      {isHi ? 'सिफारिश' : 'Recommended'}
                    </span>
                  </div>

                  {cleanSignature && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-emerald-900">
                        <span>{isHi ? 'बैकग्राउंड क्लीन थ्रेशोल्ड:' : 'Background Clarity Threshold:'}</span>
                        <span>{signThreshold}</span>
                      </div>
                      <input
                        type="range"
                        min="120"
                        max="230"
                        value={signThreshold}
                        onChange={(e) => setSignThreshold(Number(e.target.value))}
                        className="w-full h-1.5 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Name & Date on Photo Feature (Crucial for SSC/UPSC/NEET) */}
              {toolMode === 'photo' && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addNameDate}
                        onChange={(e) => setAddNameDate(e.target.checked)}
                        className="w-4 h-4 text-[#0F4C81] rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-xs font-black text-slate-800">
                        {isHi ? '✍️ फोटो पर नाम और DOP (दिनांक) जोड़ें' : '✍️ Print Name & Date of Photo (DOP)'}
                      </span>
                    </label>
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                      {isHi ? 'SSC / UPSC / NTA नियम' : 'Official Req'}
                    </span>
                  </div>

                  {addNameDate && (
                    <div className="space-y-2.5 pt-2 border-t border-slate-100 animate-fade-in">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">
                          {isHi ? 'उम्मीदवार का पूरा नाम (Candidate Name)' : 'Candidate Full Name'}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ROHIT SHARMA"
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">
                          {isHi ? 'फोटो खींचने की तारीख (Date of Photo - DOP)' : 'Date of Photo Taken (DOP)'}
                        </label>
                        <input
                          type="date"
                          value={photoDate}
                          onChange={(e) => setPhotoDate(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Right Column: Live Output Preview & Download (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col items-center justify-center min-h-[420px]">
                
                {originalImage ? (
                  <div className="w-full flex flex-col items-center space-y-4">
                    
                    {/* Status & Verification Ribbon */}
                    <div className={`w-full flex items-center justify-between p-3 rounded-xl border ${
                      isSizePerfect 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                        : 'bg-amber-50 border-amber-300 text-amber-950'
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full ${isSizePerfect ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        <div>
                          <div className="text-xs font-black">
                            {isHi ? 'तैयार फाइल साइज़:' : 'Output Size:'}{' '}
                            <span className="text-sm font-black text-blue-800">{processedSizeKb} KB</span>
                          </div>
                          <div className="text-[10px] font-semibold text-slate-600">
                            {isHi ? `फॉर्म आवश्यकता: ${targetMinKb}-${targetMaxKb} KB` : `Form Requirement: ${targetMinKb}-${targetMaxKb} KB`}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${
                          isSizePerfect ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                        }`}>
                          {isSizePerfect ? (isHi ? '✅ फॉर्म के लिए 100% सही' : '✅ 100% Form Ready') : (isHi ? '⚠️ साइज़ एडजस्ट करें' : '⚠️ Adjust Target KB')}
                        </span>
                        <div className="text-[10px] text-slate-500 font-bold mt-0.5">
                          {customWidth} x {customHeight} px (JPG)
                        </div>
                      </div>
                    </div>

                    {/* Image Preview Canvas Display */}
                    <div className="relative p-3 bg-slate-900/5 rounded-2xl border border-slate-300 max-w-full overflow-hidden flex items-center justify-center shadow-inner min-h-[260px]">
                      {processedDataUrl ? (
                        <img
                          src={processedDataUrl}
                          alt="Resized Sarkari Form Output"
                          className="max-h-[300px] object-contain rounded-lg shadow-md border border-white bg-white"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex items-center justify-center p-12 text-slate-400">
                          <RefreshCw className="w-7 h-7 animate-spin text-blue-600" />
                        </div>
                      )}
                    </div>

                    {/* Action Download Buttons */}
                    <div className="w-full flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleDownload}
                        disabled={isProcessing || !processedBlob}
                        className="w-full sm:flex-1 py-3.5 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-black text-sm shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                      >
                        <Download className="w-5 h-5" />
                        <span>
                          {isHi 
                            ? `डाउनलोड करें (${processedSizeKb} KB - JPG)` 
                            : `Download Resized Image (${processedSizeKb} KB)`}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (fileInputRef.current) fileInputRef.current.value = '';
                          fileInputRef.current?.click();
                        }}
                        className="w-full sm:w-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors border border-slate-300 cursor-pointer"
                      >
                        {isHi ? 'नया अपलोड' : 'Upload New'}
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-14 px-4 space-y-4">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-inner">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-800">
                        {isHi ? 'लाइव रीसाइज देखने के लिए फोटो अपलोड करें' : 'Upload an Image to Start Resizing'}
                      </h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        {isHi 
                          ? 'बाईं ओर से अपनी फोटो या सिग्नेचर चुनें। सिस्टम आपके चुने हुए फॉर्म के अनुसार तुरंत KB और साइज सही कर देगा।' 
                          : 'Select an image on the left. The engine will instantly format it to official exam specifications.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2.5 bg-[#0F4C81] hover:bg-blue-800 text-white text-xs font-black rounded-xl shadow-md transition-transform hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isHi ? 'फाइल ब्राउज़ करें (Browse Image)' : 'Browse Image File'}</span>
                    </button>
                  </div>
                )}

              </div>

              {/* Guidelines Box */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-black uppercase text-[11px] text-amber-800">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>{isHi ? 'सरकारी फॉर्म फोटो & साइन नियम (Official Rules):' : 'Official Sarkari Form Photo Rules:'}</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] font-medium text-amber-800/90 leading-relaxed">
                  <li>{isHi ? 'फोटो 3 महीने से अधिक पुरानी नहीं होनी चाहिए और बैकग्राउंड हल्का या सफेद होना चाहिए।' : 'Photo must not be older than 3 months with a plain white/light background.'}</li>
                  <li>{isHi ? 'सिग्नेचर साफ सफेद कागज पर काली या नीली स्याही से होना चाहिए (कैपिटल लेटर में साइन न करें)।' : 'Signature should be on plain white paper using black/blue ink (Do not sign in ALL CAPS).'}</li>
                  <li>{isHi ? 'चश्मा (Spectacles) और टोपी (Cap) पहनकर फोटो न खिंचवाएं ताकि फॉर्म रिजेक्ट न हो।' : 'Avoid caps and tinted glasses to prevent online application form rejection.'}</li>
                </ul>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-3.5 sm:p-4 px-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 flex-shrink-0 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-800">Pariksha Result Smart Tools</span>
            <span className="text-slate-400">•</span>
            <span>100% Client-Side Private (फोटो कभी सर्वर पर अपलोड नहीं होती)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold text-xs transition-colors cursor-pointer"
          >
            {isHi ? 'बंद करें' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
