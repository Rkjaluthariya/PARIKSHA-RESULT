import React, { useState } from 'react';
import { Post } from '../types';
import { Sparkles, X, Loader2, CheckCircle2, FileText, Code2, ShieldCheck, AlertCircle } from 'lucide-react';

interface AIContentGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleGenerated: (newPost: Post) => void;
}

export const AIContentGeneratorModal: React.FC<AIContentGeneratorModalProps> = ({
  isOpen,
  onClose,
  onArticleGenerated,
}) => {
  const [postTitle, setPostTitle] = useState('SSC CHSL 2026 Online Form for 3,712 Posts');
  const [category, setCategory] = useState('latest-jobs');
  const [organization, setOrganization] = useState('Staff Selection Commission (SSC)');
  const [totalVacancies, setTotalVacancies] = useState('3712');
  const [qualification, setQualification] = useState('10+2 Intermediate Pass');
  const [additionalPrompt, setAdditionalPrompt] = useState('');

  const [loading, setLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postTitle,
          category,
          organization,
          totalVacancies,
          qualification,
          additionalPrompt,
        }),
      });

      const data = await res.json();

      if (data.success && data.article) {
        const article = data.article;
        // Ensure ID and fallback arrays
        const newPost: Post = {
          ...article,
          id: `ai-gen-${Date.now()}`,
          category: article.category || category,
          importantDates: article.importantDates || [],
          applicationFees: article.applicationFees || [],
          ageLimit: article.ageLimit || {},
          vacancies: article.vacancies || [],
          howToApplySteps: article.howToApplySteps || [],
          importantLinks: article.importantLinks || [],
          faqs: article.faqs || [],
          openGraph: article.openGraph || {
            title: article.title,
            description: article.shortInfo,
            type: 'article',
            url: `https://pariksha-result.vercel.app/${category}/${article.slug || 'post'}`
          },
          schemas: article.schemas || { faqSchema: {}, articleSchema: {}, breadcrumbSchema: {} }
        };

        setGeneratedPost(newPost);
      } else {
        throw new Error(data.error || 'Failed to generate article.');
      }
    } catch (err: any) {
      console.error('Error generating article:', err);
      setError(err.message || 'An error occurred while connecting to Gemini AI.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () => {
    if (generatedPost) {
      onArticleGenerated(generatedPost);
      onClose();
      setGeneratedPost(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-[#FF6B00] text-white p-4 sm:p-5 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-yellow-200 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">AI Sarkari Article & SEO Generator</h2>
              <p className="text-xs text-amber-100 font-medium">
                Auto-Write Human-Like Posts with 10–15 FAQs & JSON-LD Schemas (Gemini 3.6 Flash)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-full bg-black/10 hover:bg-black/20">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form or Preview */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {!generatedPost ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Exam / Post Title</label>
                  <input
                    type="text"
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] font-semibold"
                    placeholder="e.g. SSC CGL 2026 Online Form"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] font-semibold"
                  >
                    <option value="latest-jobs">Latest Jobs</option>
                    <option value="admit-card">Admit Card</option>
                    <option value="results">Results</option>
                    <option value="answer-key">Answer Key</option>
                    <option value="admissions">Admissions</option>
                    <option value="scholarships">Scholarships</option>
                    <option value="government-schemes">Government Schemes</option>
                    <option value="current-affairs">Current Affairs</option>
                    <option value="blog">Blog</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Organization Name (Optional)</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00]"
                    placeholder={category === 'blog' ? 'e.g. Pariksha Result (Optional)' : 'e.g. Railway Recruitment Board (RRB)'}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Vacancies</label>
                  <input
                    type="text"
                    value={totalVacancies}
                    onChange={(e) => setTotalVacancies(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00]"
                    placeholder="e.g. 17,727 or 60,244"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Qualification Required</label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00]"
                    placeholder="e.g. 10+2 Intermediate / Bachelor Degree in Any Stream"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Special Guidelines / Custom Context (Optional)</label>
                  <textarea
                    value={additionalPrompt}
                    onChange={(e) => setAdditionalPrompt(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00]"
                    placeholder="e.g. Include specific age limit as on 01/08/2026 and mention live photo upload requirement."
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900 font-medium space-y-1">
                <span className="font-bold flex items-center gap-1 text-[#FF6B00]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> What will be auto-generated:
                </span>
                <p>
                  ✓ 100% Unique Humanized Content • ✓ 10-12 Detailed FAQs • ✓ FAQ Schema (JSON-LD) • ✓ Article & Breadcrumb Schemas • ✓ SEO Meta Title/Desc • ✓ OpenGraph & Image Prompts
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-[#FF6B00] hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Gemini AI is Writing Article & Schemas...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-yellow-200" />
                    <span>Generate Complete Article & Schemas</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-emerald-800 uppercase">Article Successfully Generated!</div>
                  <h3 className="text-base font-black text-slate-900">{generatedPost.title}</h3>
                  <div className="text-xs text-emerald-700 font-semibold">
                    ✓ {generatedPost.faqs.length} FAQs Generated • ✓ FAQ & Article Schemas Ready • ✓ {generatedPost.plagiarismFreeScore}% Unique
                  </div>
                </div>
                <ShieldCheck className="w-10 h-10 text-emerald-600 flex-shrink-0" />
              </div>

              {/* Summary of Generated Content */}
              <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-700">SEO Meta Title:</span>
                  <div className="font-mono text-slate-900 bg-white p-2 rounded border border-slate-200 mt-0.5">{generatedPost.metaTitle}</div>
                </div>

                <div>
                  <span className="font-bold text-slate-700">Meta Description:</span>
                  <div className="text-slate-800 bg-white p-2 rounded border border-slate-200 mt-0.5">{generatedPost.metaDescription}</div>
                </div>

                <div>
                  <span className="font-bold text-slate-700">Short Info:</span>
                  <div className="text-slate-800 bg-white p-2 rounded border border-slate-200 mt-0.5">{generatedPost.shortInfo}</div>
                </div>

                <div>
                  <span className="font-bold text-slate-700">FAQs Count:</span>
                  <div className="font-bold text-emerald-700 mt-0.5">{generatedPost.faqs.length} Detailed Collapsible Questions</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGeneratedPost(null)}
                  className="w-1/2 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl"
                >
                  Edit Inputs & Regenerate
                </button>
                <button
                  onClick={handlePublish}
                  className="w-1/2 py-2.5 bg-[#0F4C81] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Publish Directly to Pariksha Result</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
