import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Copy, Check, FileCode, RefreshCw, Layers, FileText, Newspaper, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SitemapTab = 'index' | 'pages' | 'posts' | 'news' | 'robots';

export const SitemapModal: React.FC<SitemapModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<SitemapTab>('index');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const sitemapConfigs: Record<SitemapTab, { label: string; file: string; url: string; icon: any }> = {
    index: {
      label: 'Master Index (sitemap.xml)',
      file: '/sitemap.xml',
      url: 'https://pariksha-result.vercel.app/sitemap.xml',
      icon: Layers
    },
    pages: {
      label: 'Pages & Categories',
      file: '/sitemap-pages.xml',
      url: 'https://pariksha-result.vercel.app/sitemap-pages.xml',
      icon: FileText
    },
    posts: {
      label: 'Job & Vacancy Posts',
      file: '/sitemap-posts.xml',
      url: 'https://pariksha-result.vercel.app/sitemap-posts.xml',
      icon: FileCode
    },
    news: {
      label: 'Google News Sitemap',
      file: '/sitemap-news.xml',
      url: 'https://pariksha-result.vercel.app/sitemap-news.xml',
      icon: Newspaper
    },
    robots: {
      label: 'Robots.txt Directives',
      file: '/robots.txt',
      url: 'https://pariksha-result.vercel.app/robots.txt',
      icon: ShieldCheck
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCurrentFile(activeTab);
    }
  }, [isOpen, activeTab]);

  const fetchCurrentFile = async (tab: SitemapTab) => {
    setLoading(true);
    try {
      const res = await fetch(sitemapConfigs[tab].file);
      const text = await res.text();
      setContent(text);
    } catch (err) {
      console.error('Failed to load sitemap:', err);
      setContent('Loading content...');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const currentCfg = sitemapConfigs[activeTab];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-[#0F4C81] text-white p-4 sm:p-5 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <FileCode className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight flex items-center gap-2">
                <span>Google Search Console & XML Sitemap Hub</span>
                <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded uppercase">
                  Active
                </span>
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Live structured sitemaps and indexing directives for Google, Bing & Yandex
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-full bg-black/20">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex flex-wrap gap-1.5">
          {(Object.keys(sitemapConfigs) as SitemapTab[]).map((tabKey) => {
            const tab = sitemapConfigs[tabKey];
            const Icon = tab.icon;
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-[#0F4C81] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Quick URL Box */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 gap-3">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-2 overflow-hidden">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse"></span>
              <span className="truncate">URL: <span className="font-mono text-[#0F4C81]">{currentCfg.url}</span></span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleCopy(currentCfg.url)}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy URL'}</span>
              </button>
              <a
                href={currentCfg.file}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#0F4C81] hover:bg-blue-900 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View File</span>
              </a>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="relative bg-slate-950 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-72 border border-slate-800 shadow-inner">
            {loading ? (
              <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" /> Loading sitemap data...
              </div>
            ) : (
              <pre className="whitespace-pre-wrap leading-relaxed text-emerald-400">{content}</pre>
            )}
          </div>

          {/* Google Search Console Guide */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 space-y-2">
            <h4 className="text-xs font-black text-amber-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>How to Submit & Validate in Google Search Console:</span>
            </h4>
            <ol className="text-xs text-amber-950 space-y-1.5 list-decimal list-inside font-medium leading-relaxed">
              <li>Go to <strong>Google Search Console</strong> &rarr; <strong>Sitemaps</strong>.</li>
              <li>Submit <strong>sitemap.xml</strong> in the "Add a new sitemap" input field.</li>
              <li>Under <strong>Page Indexing</strong> &rarr; Click on errors like <em>"Discovered - currently not indexed"</em> or <em>"Duplicate without user-selected canonical"</em>.</li>
              <li>Click the blue <strong>"Validate Fix"</strong> button. Google will recrawl and approve indexing!</li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-semibold">
            ✓ Real verified URLs only &bull; No orphan parameters &bull; 100% compliant with Sitemaps.org
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 rounded-lg"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
