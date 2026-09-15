import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import {
  Globe,
  Sparkles,
  X,
  Loader2,
  CheckCircle2,
  Code2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  FileText,
  AlertCircle,
  Zap,
  Tag,
  Table,
  ListOrdered,
  Calendar,
  Users,
  CheckSquare,
  Database,
  Link2
} from 'lucide-react';

interface AutoFetchPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleGenerated: (newPost: Post) => void;
}

interface FeedItem {
  id: string;
  source: string;
  category: string;
  title: string;
  snippet: string;
  publishedDate: string;
}

export const AutoFetchPortalModal: React.FC<AutoFetchPortalModalProps> = ({
  isOpen,
  onClose,
  onArticleGenerated,
}) => {
  const [selectedPortal, setSelectedPortal] = useState<string>('studygovthelp.in');
  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [loadingFeeds, setLoadingFeeds] = useState(false);

  const [selectedFeed, setSelectedFeed] = useState<FeedItem | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState('latest-jobs');
  const [customRawContent, setCustomRawContent] = useState('');
  const [directUrl, setDirectUrl] = useState('');

  const [rewriting, setRewriting] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<Post | null>(null);
  const [showJsonSchema, setShowJsonSchema] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch feeds from server
  useEffect(() => {
    if (isOpen) {
      fetchPortalFeeds();
    }
  }, [isOpen]);

  const fetchPortalFeeds = async () => {
    setLoadingFeeds(true);
    try {
      const res = await fetch('/api/portal-feeds');
      const data = await res.json();
      if (data.success && data.feeds) {
        setFeeds(data.feeds);
      }
    } catch (err) {
      console.error('Failed to load portal feeds:', err);
    } finally {
      setLoadingFeeds(false);
    }
  };

  const handleSelectFeedToRewrite = (feed: FeedItem) => {
    setSelectedFeed(feed);
    setCustomTitle(feed.title);
    setCustomCategory(feed.category);
    setCustomRawContent(feed.snippet);
  };

  const handleStartAutoFetchAndRewrite = async (e: React.FormEvent) => {
    e.preventDefault();
    setRewriting(true);
    setError(null);

    const sourcePortalName = selectedFeed ? selectedFeed.source : (selectedPortal !== 'all' ? selectedPortal : 'studygovthelp.in');

    try {
      const res = await fetch('/api/auto-fetch-rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourcePortal: sourcePortalName,
          topicTitle: customTitle || 'Latest Government Recruitment 2026',
          rawContent: customRawContent || customTitle,
          url: directUrl,
          category: customCategory,
        }),
      });

      const data = await res.json();
      if (data.success && data.article) {
        const article = data.article;
        const newPost: Post = {
          ...article,
          id: `auto-fetch-${Date.now()}`,
          category: article.category || customCategory,
          importantDates: article.importantDates || [],
          applicationFees: article.applicationFees || [],
          ageLimit: article.ageLimit || {},
          vacancies: article.vacancies || [],
          selectionProcess: article.selectionProcess || [],
          howToApplySteps: article.howToApplySteps || [],
          importantLinks: article.importantLinks || [],
          faqs: article.faqs || [],
          openGraph: article.openGraph || {
            title: article.title,
            description: article.shortInfo,
            type: 'article',
            url: `https://pariksha-result.vercel.app/${customCategory}/${article.slug || 'post'}`
          },
          schemas: article.schemas || { faqSchema: {}, articleSchema: {}, breadcrumbSchema: {} }
        };

        setGeneratedPost(newPost);
      } else {
        throw new Error(data.error || 'Failed to auto-fetch and rewrite content.');
      }
    } catch (err: any) {
      console.error('Error in auto fetch & rewrite:', err);
      setError(err.message || 'An error occurred during AI processing.');
    } finally {
      setRewriting(false);
    }
  };

  const handlePublishPost = () => {
    if (generatedPost) {
      onArticleGenerated(generatedPost);
      onClose();
      setGeneratedPost(null);
    }
  };

  const filteredFeeds = feeds.filter(f => selectedPortal === 'all' || f.source === selectedPortal);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F4C81] via-blue-900 to-[#FF6B00] text-white p-4 sm:p-5 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <span>StudyGovtHelp & Multi-Portal DOM Extractor</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded uppercase">
                  Robust DOM Tables & Lists Strategy
                </span>
              </h2>
              <p className="text-xs text-blue-100 font-medium">
                CSS Selector Mapping for <span className="font-bold text-amber-300">StudyGovtHelp.in</span> tables (<code className="bg-black/20 px-1 rounded">&lt;table&gt;, &lt;tbody&gt;, &lt;tr&gt;, &lt;td&gt;</code>) & list structures (<code className="bg-black/20 px-1 rounded">&lt;ul&gt;, &lt;ol&gt;</code>)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-full bg-black/20">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {!generatedPost ? (
            <div className="space-y-6">
              
              {/* Target Sources Selector Bar */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  1. Choose Target Source Portal
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'studygovthelp.in', label: 'StudyGovtHelp.in (DOM Tables & Lists)' },
                    { id: 'gktoday.in', label: 'GKToday (Current Affairs)' },
                    { id: 'sarkariresult.com', label: 'SarkariResult (Jobs/Results)' },
                    { id: 'indiasarkarinaukri.com', label: 'IndiaSarkariNaukri' },
                    { id: 'rajsarkariresult.com', label: 'RajSarkariResult (State)' },
                    { id: 'all', label: 'All Portals' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPortal(p.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        selectedPortal === p.id
                          ? 'bg-[#0F4C81] text-white border-[#0F4C81]'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed Items Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    2. Pick Live Feed or Enter Direct StudyGovtHelp Article URL
                  </label>
                  <button
                    onClick={fetchPortalFeeds}
                    className="text-[11px] font-bold text-[#0F4C81] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingFeeds ? 'animate-spin' : ''}`} /> Refresh Feeds
                  </button>
                </div>

                {loadingFeeds ? (
                  <div className="p-6 text-center text-xs text-slate-500 font-medium flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#0F4C81]" />
                    <span>Fetching live updates from portals...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
                    {filteredFeeds.map((item) => {
                      const isSelected = selectedFeed?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectFeedToRewrite(item)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1 ${
                            isSelected
                              ? 'bg-amber-50 border-[#FF6B00] shadow-sm'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-[#0F4C81] bg-blue-100 px-1.5 py-0.5 rounded">
                              {item.source}
                            </span>
                            <span className="text-slate-500 font-semibold">{item.publishedDate}</span>
                          </div>
                          <div className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                            {item.title}
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-1">{item.snippet}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Direct StudyGovtHelp URL Input */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5">
                <label className="block text-xs font-bold text-[#0F4C81] uppercase flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#FF6B00]" />
                  Direct StudyGovtHelp.in Article URL Importer (DOM CSS Selector Extractor)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={directUrl}
                    onChange={(e) => setDirectUrl(e.target.value)}
                    placeholder="https://studygovthelp.in/ssc-gd-constable-2026-recruitment-form/"
                    className="flex-1 px-3 py-2 text-xs border border-blue-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] bg-white text-slate-900 font-medium"
                  />
                  {directUrl && (
                    <button
                      type="button"
                      onClick={() => setDirectUrl('')}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-blue-900 font-medium">
                  When a URL is provided, Cheerio DOM selectors extract table rows (<code className="font-mono text-amber-700">&lt;tr&gt;</code>, <code className="font-mono text-amber-700">&lt;td&gt;</code>) and list items (<code className="font-mono text-amber-700">&lt;li&gt;</code>) into standardized JSON schema objects.
                </p>
              </div>

              {/* Form Input for Auto-Rewrite */}
              <form onSubmit={handleStartAutoFetchAndRewrite} className="space-y-4 pt-2 border-t border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Topic / Article Title to Rewrite
                    </label>
                    <input
                      type="text"
                      required={!directUrl}
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] font-semibold text-slate-900"
                      placeholder="e.g. SSC GD Constable Notification 2026 or Rajasthan CET Form"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] font-bold"
                    >
                      <option value="latest-jobs">Latest Jobs</option>
                      <option value="admit-card">Admit Card</option>
                      <option value="results">Results</option>
                      <option value="answer-key">Answer Key</option>
                      <option value="current-affairs">Current Affairs</option>
                      <option value="scholarships">Scholarships</option>
                      <option value="admissions">Admissions</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Raw Extract / Content Snippet / Raw HTML (Optional)
                    </label>
                    <textarea
                      value={customRawContent}
                      onChange={(e) => setCustomRawContent(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00]"
                      placeholder="Paste raw text, HTML snippet, or news points extracted from source portal..."
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="bg-gradient-to-r from-blue-50 to-amber-50 p-3 rounded-xl border border-blue-200 text-xs text-slate-800 space-y-1">
                  <div className="font-bold text-[#0F4C81] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                    Structured Extraction & Enhancement Guarantees:
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-[11px] font-medium text-slate-700">
                    <li className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> CSS Selector DOM Table Extractor
                    </li>
                    <li className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Standardized JSON Schema Output
                    </li>
                    <li className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Important Dates & Fee Tables
                    </li>
                    <li className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Vacancy & Eligibility Rows
                    </li>
                    <li className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Selection Process Stages
                    </li>
                    <li className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Data Integrity Preserved
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={rewriting || (!customTitle.trim() && !directUrl.trim())}
                  className="w-full py-3 bg-gradient-to-r from-[#0F4C81] to-[#FF6B00] hover:from-blue-900 hover:to-orange-600 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {rewriting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Extracting DOM Tables & Structuring JSON Article...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 text-amber-300" />
                      <span>Extract DOM & Generate Standardized JSON Post</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Success Card */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>DOM Selection Successful — Standardized JSON Schema Ready!</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900">{generatedPost.title}</h3>
                  <div className="text-xs text-emerald-700 font-semibold flex items-center gap-3 flex-wrap">
                    <span>✓ {generatedPost.importantDates?.length || 0} Important Dates Extracted</span>
                    <span>✓ {generatedPost.vacancies?.length || 0} Vacancies Breakdown</span>
                    <span>✓ {generatedPost.selectionProcess?.length || 0} Selection Stages</span>
                    <span>✓ {generatedPost.faqs?.length || 0} FAQs</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowJsonSchema(!showJsonSchema)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 flex-shrink-0 shadow-sm"
                >
                  <Code2 className="w-4 h-4" />
                  <span>{showJsonSchema ? 'Hide JSON Schema' : 'Inspect JSON Schema'}</span>
                </button>
              </div>

              {/* JSON Schema Inspection View */}
              {showJsonSchema && (
                <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl border border-slate-700 font-mono text-xs overflow-x-auto max-h-80 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-slate-800">
                    <span className="font-bold flex items-center gap-1">
                      <Database className="w-3.5 h-3.5 text-amber-400" /> Standardized Post JSON Object Representation
                    </span>
                    <button onClick={() => navigator.clipboard.writeText(JSON.stringify(generatedPost, null, 2))} className="hover:text-white">
                      Copy JSON
                    </button>
                  </div>
                  <pre>{JSON.stringify(generatedPost, null, 2)}</pre>
                </div>
              )}

              {/* Extracted DOM Structure Data Integrity Preview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Important Dates Extracted Card */}
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0F4C81]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#FF6B00]" />
                      Important Dates ({generatedPost.importantDates?.length || 0} Extracted)
                    </span>
                    <span className="text-[10px] bg-blue-200 text-blue-900 px-1.5 py-0.5 rounded font-mono">
                      &lt;table&gt; mapped
                    </span>
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1 text-xs">
                    {generatedPost.importantDates && generatedPost.importantDates.length > 0 ? (
                      generatedPost.importantDates.map((d, i) => (
                        <div key={i} className="flex items-center justify-between p-1.5 bg-white rounded border border-blue-100">
                          <span className="font-semibold text-slate-800">{d.event}</span>
                          <span className="font-bold text-[#0F4C81]">{d.date}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 italic text-[11px]">No date rows detected in table</p>
                    )}
                  </div>
                </div>

                {/* Vacancy & Eligibility Breakdown Card */}
                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#FF6B00]" />
                      Vacancy Details ({generatedPost.vacancies?.length || 0} Posts Mapped)
                    </span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-mono">
                      &lt;tr&gt; &lt;td&gt; mapped
                    </span>
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1 text-xs">
                    {generatedPost.vacancies && generatedPost.vacancies.length > 0 ? (
                      generatedPost.vacancies.map((v, i) => (
                        <div key={i} className="p-1.5 bg-white rounded border border-amber-100 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{v.postName}</span>
                            <span className="font-black text-[#FF6B00] bg-amber-100 px-1.5 py-0.2 rounded text-[10px]">
                              {v.totalPosts} Posts
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-1">{v.eligibility}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 italic text-[11px]">No multi-column vacancy rows detected</p>
                    )}
                  </div>
                </div>

                {/* Selection Process Extracted Card */}
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span className="flex items-center gap-1.5">
                      <ListOrdered className="w-4 h-4 text-emerald-600" />
                      Selection Process Stages ({generatedPost.selectionProcess?.length || 0} Stages)
                    </span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-mono">
                      &lt;ul&gt; &lt;ol&gt; mapped
                    </span>
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1 text-xs">
                    {generatedPost.selectionProcess && generatedPost.selectionProcess.length > 0 ? (
                      generatedPost.selectionProcess.map((s: any, i: number) => (
                        <div key={i} className="p-1.5 bg-white rounded border border-emerald-100 flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                            {s.stepNumber || i + 1}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900">{typeof s === 'string' ? s : s.stageName}</div>
                            {typeof s === 'object' && s.description && (
                              <p className="text-[11px] text-slate-600 line-clamp-1">{s.description}</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 italic text-[11px]">No selection stages detected in lists</p>
                    )}
                  </div>
                </div>

                {/* Application Fees & Age Limits Card */}
                <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                    <span className="flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-purple-600" />
                      Application Fees & Age Limits
                    </span>
                    <span className="text-[10px] bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded font-mono">
                      Key/Value mapped
                    </span>
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1 text-xs">
                    <div className="grid grid-cols-2 gap-1 text-[11px] bg-white p-1.5 rounded border border-purple-100">
                      <div><span className="font-bold text-slate-700">Min Age:</span> {generatedPost.ageLimit?.minAge || 'N/A'}</div>
                      <div><span className="font-bold text-slate-700">Max Age:</span> {generatedPost.ageLimit?.maxAge || 'N/A'}</div>
                    </div>
                    {generatedPost.applicationFees && generatedPost.applicationFees.length > 0 && (
                      <div className="space-y-1 pt-1">
                        {generatedPost.applicationFees.map((f, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px] p-1 bg-white rounded border border-purple-100">
                            <span className="text-slate-700 font-medium">{f.category}</span>
                            <span className="font-bold text-purple-900">{f.fee}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setGeneratedPost(null)}
                  className="w-1/2 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors"
                >
                  Import Another URL / Feed
                </button>
                <button
                  onClick={handlePublishPost}
                  className="w-1/2 py-3 bg-[#0F4C81] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Publish Directly to Pariksha Result Portal</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
