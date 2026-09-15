import React from 'react';
import { getTranslation } from '../utils/translations';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  language?: 'en' | 'hi';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showTagline = false, language = 'en' }) => {
  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {/* SVG Icon with Shield + Graduation Cap + Checkmark integrated into letter 'P' */}
      <div className="relative w-8 h-8 sm:w-11 sm:h-11 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F4C81" />
              <stop offset="100%" stopColor="#0A3459" />
            </linearGradient>
            <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B00" />
              <stop offset="100%" stopColor="#E05B00" />
            </linearGradient>
          </defs>

          {/* Shield Emblem Base */}
          <path
            d="M 50 10 L 88 24 C 88 62 66 84 50 94 C 34 84 12 62 12 24 Z"
            fill="url(#shieldGrad)"
          />

          {/* Outer Border Highlight */}
          <path
            d="M 50 14 L 84 27 C 84 60 63 80 50 89 C 37 80 16 60 16 27 Z"
            fill="none"
            stroke="#1D6FB8"
            strokeWidth="2.5"
            opacity="0.6"
          />

          {/* Letter P shape formed in center */}
          <path
            d="M 36 30 L 36 72 M 36 30 L 58 30 C 67 30 73 36 73 44 C 73 52 67 58 58 58 L 36 58"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Graduation Cap on top of P */}
          <path
            d="M 50 18 L 74 27 L 50 34 L 26 27 Z"
            fill="url(#orangeGrad)"
          />
          <path
            d="M 33 30 L 33 38 C 33 42 67 42 67 38 L 67 30"
            fill="none"
            stroke="url(#orangeGrad)"
            strokeWidth="2"
          />

          {/* Golden Checkmark integrated inside loop of P */}
          <path
            d="M 46 45 L 52 51 L 62 39"
            fill="none"
            stroke="#FF6B00"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1 font-black text-lg sm:text-2xl tracking-tight leading-none text-slate-900">
          <span className="text-[#0F4C81]">PARIKSHA</span>
          <span className="text-[#FF6B00]">RESULT</span>
          <span className="inline-block w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
        </div>
        {showTagline && (
          <span className="hidden sm:block text-[11px] font-semibold text-slate-500 tracking-wide mt-1">
            {getTranslation("Fastest Government Job, Result & Current Affairs Updates", language)}
          </span>
        )}
      </div>
    </div>
  );
};
