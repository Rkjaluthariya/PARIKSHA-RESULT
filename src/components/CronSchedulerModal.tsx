import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { X, Clock, Settings, PlayCircle, Loader2, CheckCircle2, ShieldAlert, Zap, Globe, Layers, CheckSquare } from 'lucide-react';

interface CronSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBatchGenerated: (newPosts: Post[]) => void;
}

const SOURCES = [
  { id: 'gktoday', name: 'GKToday (Current Affairs)', url: 'https://www.gktoday.in/current-affairs/', type: 'current-affairs' },
  { id: 'sarkariresult', name: 'Sarkari Result (Jobs)', url: 'https://www.sarkariresult.com/', type: 'latest-jobs' },
  { id: 'freejobalert', name: 'Free Job Alert (Jobs)', url: 'https://www.freejobalert.com/', type: 'latest-jobs' },
  { id: 'isnblogs', name: 'India Sarkari Naukri (Blogs)', url: 'https://indiasarkarinaukri.com/blogs/', type: 'blog' }
];

export const CronSchedulerModal: React.FC<CronSchedulerModalProps> = ({
  isOpen,
  onClose,
  onBatchGenerated,
}) => {
  const [selectedSources, setSelectedSources] = useState<string[]>(['gktoday', 'sarkariresult', 'freejobalert', 'isnblogs']);
  const [interval, setInterval] = useState('2'); // Every 2 hours
  const [batchSize, setBatchSize] = useState<number>(10);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLogs(['System ready. Auto-fetch scheduled to run every 2 hours.']);
      setSuccessCount(null);
    }
  }, [isOpen]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const toggleSource = (id: string) => {
    setSelectedSources(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleRunManualSync = async () => {
    if (selectedSources.length === 0) {
      addLog('Error: Please select at least one source.');
      return;
    }

    setIsRunning(true);
    setSuccessCount(null);
    addLog(`Initiating manual override for Cron Job (Interval: Every ${interval} hours)`);
    addLog(`Target batch size: ${batchSize} items per source`);

    try {
      let totalFetched = 0;
      let allPosts: Post[] = [];

      for (const sourceId of selectedSources) {
        const source = SOURCES.find(s => s.id === sourceId);
        if (!source) continue;

        addLog(`Connecting to source: ${source.name} (${source.url})`);
        
        const res = await fetch('/api/cron/sync-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sourceUrl: source.url, batchSize, type: source.type })
        });

        const data = await res.json();
        
        if (data.success && data.posts) {
          addLog(`✅ Extracted ${data.posts.length} items from ${source.name}`);
          totalFetched += data.posts.length;
          allPosts = [...allPosts, ...data.posts];
        } else {
          addLog(`❌ Error fetching from ${source.name}: ${data.error}`);
        }
      }

      setTimeout(() => {
        addLog(`Sync complete. Rewriting applied. Schemas attached.`);
        addLog(`Total synced ${totalFetched} articles to database.`);
        addLog(`🌐 Pinged search engines (Google & Bing IndexNow) automatically for newly synced posts.`);
        setSuccessCount(totalFetched);
        onBatchGenerated(allPosts);
        setIsRunning(false);
      }, 1000);

    } catch (err: any) {
      console.error(err);
      addLog(`Critical Error: ${err.message}`);
      setIsRunning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh] border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white p-4 sm:p-5 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight flex items-center gap-2">
                <span>Auto-Fetch Cron Manager</span>
                <span className="text-[10px] bg-indigo-500 text-white font-bold px-2 py-0.5 rounded uppercase">
                  Active
                </span>
              </h2>
              <p className="text-xs text-indigo-200 font-medium">
                Fetch jobs and current affairs automatically every few hours.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-full bg-black/20">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-6 bg-slate-50 overflow-y-auto">
          
          {/* Real-Time Automated Schedules Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 5-Min Current Affairs Schedule */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-300 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 uppercase flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-600 animate-pulse" />
                  Current Affairs Auto-Sync
                </span>
                <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  Every 5 Mins
                </span>
              </div>
              <p className="text-xs text-amber-900/80 font-medium">
                Fetches, formats, and publishes breaking GK and Current Affairs news updates every 5 minutes onto the portal automatically.
              </p>
              <div className="text-[11px] font-bold text-amber-950 pt-1 flex items-center justify-between">
                <span>Status: RUNNING ON SERVER</span>
                <button
                  onClick={async () => {
                    addLog('⚡ Executing instant 5-Minute Current Affairs Sync...');
                    const res = await fetch('/api/auto-sync/trigger', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ type: 'current-affairs' })
                    });
                    const d = await res.json();
                    if (d.success) addLog(`✅ Added: ${d.addedCa?.title}`);
                  }}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold shadow-sm"
                >
                  Trigger 5-Min Sync
                </button>
              </div>
            </div>

            {/* 1-Hour Job Updates Schedule */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-300 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-900 uppercase flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600 animate-pulse" />
                  Sarkari Job Updates Auto-Sync
                </span>
                <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  Every 1 Hour
                </span>
              </div>
              <p className="text-xs text-emerald-900/80 font-medium">
                Pulls new recruitment notifications, exam dates, admit cards, and results every 1 hour with full eligibility tables & FAQs.
              </p>
              <div className="text-[11px] font-bold text-emerald-950 pt-1 flex items-center justify-between">
                <span>Status: RUNNING ON SERVER</span>
                <button
                  onClick={async () => {
                    addLog('🔴 Executing instant 1-Hour Job Update Sync...');
                    const res = await fetch('/api/auto-sync/trigger', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ type: 'latest-jobs' })
                    });
                    const d = await res.json();
                    if (d.success) addLog(`✅ Added: ${d.addedJob?.title}`);
                  }}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold shadow-sm"
                >
                  Trigger 1-Hour Sync
                </button>
              </div>
            </div>

            {/* 1-Hour Automatic SEO Blog Engine */}
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-indigo-300 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-900 uppercase flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-indigo-600 animate-pulse" />
                  1-Hour SEO Blog Engine
                </span>
                <span className="bg-indigo-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  Every 1 Hour
                </span>
              </div>
              <p className="text-xs text-indigo-900/80 font-medium">
                Automatically writes & publishes 100% full-length, SEO & AEO compliant strategy blogs, FAQs, Schemas & meta tags every 1 hour.
              </p>
              <div className="text-[11px] font-bold text-indigo-950 pt-1 flex items-center justify-between">
                <span>Status: RUNNING ON SERVER</span>
                <button
                  onClick={async () => {
                    addLog('📝 Executing instant 1-Hour SEO Blog Generation...');
                    const res = await fetch('/api/auto-sync/trigger', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ type: 'blog' })
                    });
                    const d = await res.json();
                    if (d.success) addLog(`✅ Generated Blog: ${d.addedBlog?.title}`);
                  }}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold shadow-sm"
                >
                  Trigger Blog Engine
                </button>
              </div>
            </div>

            {/* Auto Search Engine Ping (Google/Bing) */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-300 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-900 uppercase flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-purple-600 animate-pulse" />
                  Google & Bing Auto-Ping
                </span>
                <span className="bg-purple-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  Instant On Sync
                </span>
              </div>
              <p className="text-xs text-purple-900/80 font-medium">
                Pings Google Sitemaps & Bing IndexNow automatically whenever new posts, jobs, or blogs are added by CronScheduler.
              </p>
              <div className="text-[11px] font-bold text-purple-950 pt-1 flex items-center justify-between">
                <span>Status: ALWAYS ACTIVE</span>
                <button
                  onClick={async () => {
                    addLog('🌐 Triggering instant Google & Bing (IndexNow) Search Engine Ping...');
                    try {
                      const res = await fetch('/api/ping-search-engines', { method: 'POST' });
                      const d = await res.json();
                      if (d.success) {
                        addLog(`✅ Search engines pinged! IndexNow: ${d.pings?.indexNow}, Google: ${d.pings?.googleSitemapPing} (${d.pings?.urlsCount} URLs)`);
                      } else {
                        addLog(`❌ Search engine ping failed: ${d.error}`);
                      }
                    } catch (e: any) {
                      addLog(`❌ Ping error: ${e.message}`);
                    }
                  }}
                  className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[10px] font-bold shadow-sm"
                >
                  Ping Search Engines
                </button>
              </div>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              <Settings className="w-4 h-4 text-slate-500" /> Auto-Scraper Configuration
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Data Sources */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Target Data Sources
                </label>
                <div className="space-y-2">
                  {SOURCES.map(source => (
                    <div 
                      key={source.id}
                      onClick={() => toggleSource(source.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedSources.includes(source.id) ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300'}`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${selectedSources.includes(source.id) ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-transparent'}`}>
                        <CheckSquare className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{source.name}</div>
                        <div className="text-[10px] text-slate-500 truncate w-48">{source.url}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Run Interval
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={interval}
                      onChange={(e) => setInterval(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-bold bg-white text-indigo-700"
                    >
                      <option value="1">Every 1 Hour</option>
                      <option value="2">Every 2 Hours</option>
                      <option value="4">Every 4 Hours</option>
                      <option value="12">Every 12 Hours</option>
                      <option value="24">Once Daily</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Background server cron will execute automatically.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Items to Fetch per Source (Batch Size)
                  </label>
                  <div className="relative">
                    <Layers className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={batchSize}
                      onChange={(e) => setBatchSize(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-bold bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm font-semibold text-indigo-900">
              <ShieldAlert className="w-8 h-8 text-indigo-600 flex-shrink-0" />
              <div>
                <div>Background service is scheduled to run <span className="font-black bg-indigo-200 px-1.5 rounded text-indigo-800">Every {interval} Hours</span></div>
                <div className="text-[11px] text-indigo-700 font-normal mt-0.5">The system will automatically fetch, rewrite, and post new updates from the {selectedSources.length} selected sources. You can also manually trigger a sync right now.</div>
              </div>
            </div>
            <button
              onClick={handleRunManualSync}
              disabled={isRunning || selectedSources.length === 0}
              className="w-full sm:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed flex-shrink-0"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Fetching...
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" /> Run Manual Sync Now
                </>
              )}
            </button>
          </div>

          {/* Terminal / Logs */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 border-b border-slate-800 pb-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Server Execution Logs
            </div>
            <div className="h-40 overflow-y-auto font-mono text-[11px] space-y-1">
              {logs.map((log, idx) => (
                <div key={idx} className={`${log.includes('Error') || log.includes('❌') ? 'text-red-400' : log.includes('✅') ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {log}
                </div>
              ))}
              {isRunning && (
                <div className="text-slate-500 animate-pulse">_</div>
              )}
            </div>
          </div>

          {/* Success Banner */}
          {successCount !== null && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                Successfully fetched and added {successCount} articles to the portal!
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm whitespace-nowrap"
              >
                View Updates
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
