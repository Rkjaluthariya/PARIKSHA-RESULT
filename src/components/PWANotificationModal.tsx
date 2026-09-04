import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Smartphone, Download, CheckCircle2, ShieldCheck, X, Sparkles, Send, Volume2 } from 'lucide-react';
import {
  getNotificationStatus,
  requestNotificationPermission,
  unsubscribeNotifications,
  sendTestPushNotification,
  promptPWAInstall,
  isStandalonePWA,
  NotificationStatus
} from '../utils/pwaServiceWorker';

interface PWANotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWANotificationModal: React.FC<PWANotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [status, setStatus] = useState<NotificationStatus>({
    supported: true,
    permission: 'default',
    subscribed: false,
    swRegistered: false
  });
  const [loading, setLoading] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [standalone, setStandalone] = useState(false);

  // Topics preferences
  const [topics, setTopics] = useState({
    jobs: true,
    results: true,
    admitCards: true,
    answerKeys: true,
    currentAffairs: false
  });

  useEffect(() => {
    if (isOpen) {
      updateStatus();
      setStandalone(isStandalonePWA());
    }
  }, [isOpen]);

  const updateStatus = () => {
    const s = getNotificationStatus();
    setStatus(s);
  };

  if (!isOpen) return null;

  const handleToggleSubscribe = async () => {
    setLoading(true);
    if (status.permission === 'granted' && status.subscribed) {
      unsubscribeNotifications();
      updateStatus();
    } else {
      const success = await requestNotificationPermission();
      if (success) {
        setTestSent(true);
        setTimeout(() => setTestSent(false), 5000);
      }
      updateStatus();
    }
    setLoading(false);
  };

  const handleSendTest = async () => {
    setLoading(true);
    if (status.permission !== 'granted') {
      const ok = await requestNotificationPermission();
      if (!ok) {
        setLoading(false);
        return;
      }
    }

    const success = await sendTestPushNotification({
      title: '🚨 SSC CGL 2026 Notification Released!',
      body: 'Staff Selection Commission has announced 17,727 vacancies. Click here to check eligibility and apply online.',
      url: '/'
    });

    if (success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 5000);
    }
    setLoading(false);
  };

  const handleInstallPWA = async () => {
    await promptPWAInstall();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl text-white relative">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0F4C81] via-[#0D416F] to-slate-900 p-4 sm:p-5 border-b border-blue-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 border border-amber-400/40 p-2 rounded-xl text-amber-300">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-300 tracking-wide">
                Instant Job & Result Push Alerts
              </h3>
              <p className="text-xs text-slate-300">PWA & Browser Push Notification Settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Main Permission Box */}
          <div className={`p-4 rounded-2xl border transition-all ${
            status.permission === 'granted' && status.subscribed
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
              : 'bg-slate-800/80 border-slate-700 text-slate-200'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {status.permission === 'granted' && status.subscribed ? (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Push Alerts Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold">
                      <BellOff className="w-3.5 h-3.5" /> Push Alerts Disabled
                    </span>
                  )}
                  {status.swRegistered && (
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-mono">
                      Service Worker Ready
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-medium leading-relaxed pt-1">
                  Get real-time push notifications on your phone or desktop as soon as Sarkari Results, Cut-Off marks, Admit Cards, or 10,000+ Government job vacancies are published.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={handleToggleSubscribe}
                disabled={loading}
                className={`px-4 py-2 rounded-xl font-black text-xs transition-all shadow-md flex items-center gap-2 ${
                  status.permission === 'granted' && status.subscribed
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 transform hover:scale-105'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>
                  {status.permission === 'granted' && status.subscribed
                    ? 'Disable Push Alerts'
                    : 'Enable Instant Push Notifications'}
                </span>
              </button>

              {status.permission === 'granted' && (
                <button
                  onClick={handleSendTest}
                  disabled={loading}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5"
                  title="Send a sample Sarkari result alert to test your device"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Push Alert</span>
                </button>
              )}
            </div>

            {testSent && (
              <div className="mt-3 bg-emerald-900/80 border border-emerald-500 text-emerald-200 text-xs font-bold p-2.5 rounded-xl flex items-center gap-2 animate-fade-in">
                <Volume2 className="w-4 h-4 text-emerald-300 animate-bounce" />
                <span>Test Notification Dispatched! Check your device notification tray.</span>
              </div>
            )}
          </div>

          {/* Topic Preferences */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Choose What You Want To Receive:
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { key: 'jobs', label: 'Latest Government Jobs' },
                { key: 'results', label: 'Sarkari Results & Cut-Offs' },
                { key: 'admitCards', label: 'Admit Cards & Exam Dates' },
                { key: 'answerKeys', label: 'Answer Keys & Scorecards' },
                { key: 'currentAffairs', label: 'Daily Current Affairs Quiz' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60 cursor-pointer hover:border-amber-400/40 transition-all">
                  <input
                    type="checkbox"
                    checked={(topics as any)[key]}
                    onChange={(e) => setTopics({ ...topics, [key]: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-slate-200">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* PWA App Installation Box */}
          <div className="bg-gradient-to-r from-blue-950/80 to-slate-900 border border-blue-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs sm:text-sm font-extrabold text-white">
                  Install Mobile & Desktop App (PWA)
                </h4>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                {standalone
                  ? 'App is running in Standalone PWA mode with offline caching!'
                  : 'Install Pariksha Result 2026 directly on your phone home screen without App Store.'}
              </p>
            </div>

            {!standalone && (
              <button
                onClick={handleInstallPWA}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 flex-shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Install App</span>
              </button>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Privacy Protected • Zero Spam
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
