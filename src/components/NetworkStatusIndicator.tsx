import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const NetworkStatusIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  const [showRestoredToast, setShowRestoredToast] = useState<boolean>(false);
  const [dismissedOfflineBanner, setDismissedOfflineBanner] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setDismissedOfflineBanner(false);
      if (wasOffline) {
        setShowRestoredToast(true);
        const timer = setTimeout(() => {
          setShowRestoredToast(false);
        }, 4000);
        return () => clearTimeout(timer);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setShowRestoredToast(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return (
    <>
      {/* 1. Offline Mode Sticky / Floating Notification Banner */}
      {!isOnline && !dismissedOfflineBanner && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white text-xs font-semibold px-4 py-2.5 shadow-md flex items-center justify-between gap-3 border-b border-amber-700/50 relative z-50 animate-fadeIn">
          <div className="flex items-center gap-2.5 max-w-7xl mx-auto w-full">
            <div className="p-1 bg-amber-800/60 rounded-full flex-shrink-0 animate-pulse">
              <WifiOff className="w-4 h-4 text-amber-200" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-amber-100 uppercase tracking-wide text-[11px] bg-amber-900/60 px-2 py-0.5 rounded mr-2">
                ⚡ Offline Mode
              </span>
              <span className="text-white">
                You are currently offline. Showing cached Sarkari jobs, admit cards, and saved bookmarks.
              </span>
            </div>
            <button
              onClick={() => setDismissedOfflineBanner(true)}
              className="p-1 hover:bg-amber-700/60 rounded-md transition-colors text-amber-100 hover:text-white flex-shrink-0"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Connection Restored Toast (When user reconnects) */}
      {showRestoredToast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-800 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-slideDown">
          <div className="p-1 bg-emerald-500/20 rounded-full">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="font-extrabold text-emerald-100">🟢 Back Online</div>
            <div className="text-[11px] text-emerald-200 font-normal">Internet connection restored. Fetching latest updates...</div>
          </div>
          <button
            onClick={() => setShowRestoredToast(false)}
            className="p-1 hover:bg-emerald-700 rounded text-emerald-200 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
};

export const HeaderNetworkBadge: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold border transition-all select-none ${
        isOnline
          ? 'bg-emerald-50 text-emerald-700 border-emerald-300/80 shadow-xs'
          : 'bg-amber-100 text-amber-950 border-amber-400 animate-pulse shadow-sm'
      }`}
      title={isOnline ? 'Network Connected (Online)' : 'App is in Offline Mode (Using cached data)'}
    >
      {isOnline ? (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
          <Wifi className="w-3 h-3 text-emerald-600 flex-shrink-0" />
          <span>Online</span>
        </>
      ) : (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping flex-shrink-0"></span>
          <WifiOff className="w-3 h-3.5 text-amber-700 flex-shrink-0" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
};
