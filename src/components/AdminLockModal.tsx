import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, Eye, EyeOff, AlertCircle, X, CheckCircle2, KeyRound, ShieldAlert } from 'lucide-react';

interface AdminLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: () => void;
}

export const AdminLockModal: React.FC<AdminLockModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  useEffect(() => {
    if (lockoutSeconds > 0) {
      const timer = setTimeout(() => setLockoutSeconds(s => s - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutSeconds]);

  if (!isOpen) return null;

  const secretKeyParam = localStorage.getItem('pariksha_admin_secret_url_key') || 'k=x9';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    setErrorMsg('');

    const cleanPin = pinInput.trim();

    if (!cleanPin) {
      setErrorMsg('Please enter Admin Security PIN.');
      return;
    }

    // Stored custom PIN if any
    const customPin = localStorage.getItem('pariksha_admin_custom_pin')?.trim() || 
                      localStorage.getItem('pariksha_admin_custom_password')?.trim();

    // Valid PINs (Default 9929833)
    const validPins = [
      '9929833',
      customPin
    ].filter(Boolean);

    if (validPins.includes(cleanPin)) {
      const now = Date.now();
      localStorage.setItem('pariksha_admin_authenticated', 'true');
      localStorage.setItem('pariksha_admin_login_time', now.toString());
      localStorage.setItem('pariksha_admin_mode', 'true');
      
      setFailedAttempts(0);
      onUnlockSuccess();
      setPinInput('');
    } else {
      const newCount = failedAttempts + 1;
      setFailedAttempts(newCount);
      if (newCount >= 3) {
        setLockoutSeconds(60);
        setErrorMsg('⛔ Anti-Brute-Force Alert: 3 failed attempts! Access locked for 60 seconds.');
      } else {
        setErrorMsg(`Incorrect PIN! Attempt ${newCount}/3. Access Denied.`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl relative text-white">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950/50 to-slate-900 p-5 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 border border-amber-500/40 p-2.5 rounded-xl text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-amber-300 tracking-wide">Admin Security Shield</h3>
              <p className="text-xs text-slate-400">Short URL Obfuscation & PIN Gate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleVerify} className="p-6 space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Hacker Defense & Short URL Guard Active</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-300">
              Standard <code className="bg-slate-800 text-amber-300 px-1 rounded">/admin</code> URLs are obfuscated to prevent brute-force hacking. Secret link: <code className="bg-slate-800 text-amber-300 px-1 rounded">/?{secretKeyParam}</code>
            </p>
          </div>

          {/* PIN Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase text-amber-300 tracking-wider block">
              Enter Admin Security PIN
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                placeholder="Enter PIN (e.g. 9929833)"
                value={pinInput}
                disabled={lockoutSeconds > 0}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setErrorMsg('');
                }}
                autoFocus
                maxLength={20}
                className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-bold text-center text-base tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder-slate-600 font-mono disabled:opacity-50"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-amber-400 transition-colors"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {lockoutSeconds > 0 && (
            <div className="bg-red-950/90 border border-red-500 p-3 rounded-xl text-red-200 text-xs font-mono text-center font-bold animate-pulse">
              ⛔ Too many failed attempts. Try again in {lockoutSeconds}s.
            </div>
          )}

          {errorMsg && lockoutSeconds === 0 && (
            <div className="bg-red-950/80 border border-red-500/60 p-3 rounded-xl text-red-200 text-xs font-bold flex items-center gap-2 animate-bounce">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={lockoutSeconds > 0}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>{lockoutSeconds > 0 ? `Locked (${lockoutSeconds}s)` : 'Unlock Admin Panel'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
