import { getTranslation } from '../utils/translations';
import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';

interface AdsterraAdProps {
  type?: 'banner' | 'rectangle' | 'native' | 'all';
  className?: string;
  label?: string;
  isNoticeOnly?: boolean;
  language?: 'en' | 'hi';
}

export const AdsterraAd: React.FC<AdsterraAdProps> = ({
  type = 'rectangle',
  className = '',
  label = 'Sponsored Advertisement',
  isNoticeOnly = false,
  language = 'en'
}) => {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (isNoticeOnly) {
      // Non-blocking background check for Ad-Blocker/DNS filter
      const testUrl = 'https://www.highperformanceformat.com/ecd9b269002ec51a8109676ba6433bf5/invoke.js';
      fetch(new Request(testUrl, { method: 'HEAD', mode: 'no-cors' }))
        .then(() => setIsBlocked(false))
        .catch(() => setIsBlocked(true));
    }
  }, [isNoticeOnly]);

  const getAdHtml = (adType: 'banner' | 'rectangle' | 'native' | 'all') => {
    const preconnects = `
  <link rel="preconnect" href="https://www.highperformanceformat.com" crossorigin />
  <link rel="dns-prefetch" href="https://www.highperformanceformat.com" />
  <link rel="preconnect" href="https://pl30730799.effectivecpmnetwork.com" crossorigin />
  <link rel="dns-prefetch" href="https://pl30730799.effectivecpmnetwork.com" />`;

    if (adType === 'banner') {
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">${preconnects}
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f8fafc;
      font-family: system-ui, -apple-system, sans-serif;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : 'f042802cf53bf3e02e799f722e2bf3bc',
      'format' : 'iframe',
      'height' : 50,
      'width' : 320,
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://www.highperformanceformat.com/f042802cf53bf3e02e799f722e2bf3bc/invoke.js"></script>
</body>
</html>`;
    }

    if (adType === 'native') {
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">${preconnects}
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f8fafc;
      font-family: system-ui, -apple-system, sans-serif;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <script async="async" data-cfasync="false" src="https://pl30730799.effectivecpmnetwork.com/031148a077bd1831a92f637d8e38d124/invoke.js"></script>
  <div id="container-031148a077bd1831a92f637d8e38d124"></div>
</body>
</html>`;
    }

    // Default 'rectangle' (300x250)
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">${preconnects}
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f8fafc;
      font-family: system-ui, -apple-system, sans-serif;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : 'ecd9b269002ec51a8109676ba6433bf5',
      'format' : 'iframe',
      'height' : 250,
      'width' : 300,
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://www.highperformanceformat.com/ecd9b269002ec51a8109676ba6433bf5/invoke.js"></script>
</body>
</html>`;
  };

  if (isNoticeOnly) {
    if (!isBlocked) return null;
    return (
      <div className={`bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-left shadow-2xs w-full max-w-full overflow-hidden box-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}>
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-amber-900 leading-none">{getTranslation('Ad-Blocker or Private DNS Active', language)}</p>
            <p className="text-[11px] text-amber-800 font-medium leading-normal">
              {getTranslation('Brave Shields, Ad-Blockers, or Private DNS (AdGuard/NextDNS) are filtering some updates. Turn them off or try Incognito mode/mobile data for best performance.', language)}
            </p>
          </div>
        </div>
        <button 
          onClick={() => {
            const testUrl = 'https://www.highperformanceformat.com/ecd9b269002ec51a8109676ba6433bf5/invoke.js';
            fetch(new Request(testUrl, { method: 'HEAD', mode: 'no-cors' }))
              .then(() => setIsBlocked(false))
              .catch(() => setIsBlocked(true));
          }}
          className="text-[10px] bg-white text-amber-700 hover:bg-amber-100 border border-amber-300 hover:border-amber-400 px-3 py-1 rounded-lg flex items-center justify-center gap-1.5 font-bold cursor-pointer transition-all self-end sm:self-auto flex-shrink-0 shadow-3xs active:scale-95"
        >
          <RefreshCw className="w-3 h-3" />
          <span>{getTranslation('Verify Connection', language)}</span>
        </button>
      </div>
    );
  }

  const dimensions =
    type === 'banner'
      ? { width: 320, height: 50 }
      : type === 'native'
      ? { width: '100%', height: 160 }
      : { width: 300, height: 250 };

  return (
    <div className={`my-2.5 sm:my-4 flex flex-col items-center justify-center bg-slate-50/90 border border-slate-200/80 rounded-xl p-2 sm:p-3 shadow-2xs w-full max-w-full overflow-hidden box-border ${className}`}>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1 w-full max-w-[320px] justify-center overflow-hidden">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 animate-pulse"></span>
        <span className="truncate">{getTranslation(label, language)}</span>
      </div>
      <div className="bg-white p-1 rounded-lg border border-slate-200 w-full max-w-[320px] overflow-hidden flex items-center justify-center box-border min-h-[50px]">
        <iframe
          title={`Adsterra ${type} Ad`}
          srcDoc={getAdHtml(type)}
          width={dimensions.width}
          height={dimensions.height}
          loading="eager"
          style={{ border: 'none', overflow: 'hidden', maxWidth: '100%', width: '100%' }}
          scrolling="no"
        />
      </div>
    </div>
  );
};

