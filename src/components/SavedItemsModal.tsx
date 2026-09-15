import React, { useState } from 'react';
import { Post, CurrentAffairsArticle } from '../types';
import {
  Bookmark,
  X,
  Trash2,
  ExternalLink,
  Calendar,
  Building,
  MapPin,
  Clock,
  Search,
  CheckCircle2,
  Share2,
  Briefcase,
  BookOpen,
  ArrowRight,
  Download
} from 'lucide-react';

interface SavedItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  currentAffairs: CurrentAffairsArticle[];
  bookmarkedPostIds: string[];
  bookmarkedCaIds: string[];
  onToggleBookmarkPost: (postId: string) => void;
  onToggleBookmarkCA: (caId: string) => void;
  onSelectPost: (post: Post) => void;
  onClearAll: () => void;
  language?: 'en' | 'hi';
}

export const SavedItemsModal: React.FC<SavedItemsModalProps> = ({
  isOpen,
  onClose,
  posts,
  currentAffairs,
  bookmarkedPostIds,
  bookmarkedCaIds,
  onToggleBookmarkPost,
  onToggleBookmarkCA,
  onSelectPost,
  onClearAll,
  language = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'ca'>('all');
  const [filterQuery, setFilterQuery] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);

  if (!isOpen) return null;

  const savedPosts = posts.filter((p) => bookmarkedPostIds.includes(p.id));
  const savedCA = currentAffairs.filter((c) => bookmarkedCaIds.includes(c.id));
  const totalSaved = savedPosts.length + savedCA.length;

  // Filtered lists
  const query = filterQuery.toLowerCase().trim();
  const filteredPosts = savedPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(query) ||
      p.organization.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
  );
  const filteredCA = savedCA.filter(
    (c) =>
      c.title.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query) ||
      c.summary.toLowerCase().includes(query)
  );

  const handleExportText = () => {
    let content = `PARIKSHA RESULT - MY SAVED ITEMS (${new Date().toLocaleDateString('en-IN')})\n`;
    content += `==============================================\n\n`;

    if (savedPosts.length > 0) {
      content += `--- SAVED JOBS & NOTIFICATIONS (${savedPosts.length}) ---\n`;
      savedPosts.forEach((p, idx) => {
        content += `${idx + 1}. ${p.title}\n`;
        content += `   Organization: ${p.organization} | State: ${p.state}\n`;
        content += `   Category: ${p.category} | Last Date: ${p.lastDate || 'N/A'}\n\n`;
      });
    }

    if (savedCA.length > 0) {
      content += `--- SAVED CURRENT AFFAIRS (${savedCA.length}) ---\n`;
      savedCA.forEach((c, idx) => {
        content += `${idx + 1}. ${c.title}\n`;
        content += `   Date: ${c.date} | Category: ${c.category}\n`;
        content += `   Summary: ${c.summary}\n\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_saved_jobs_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] border border-slate-200">
        {/* Header */}
        <div className="bg-[#0F4C81] text-white p-4 sm:p-5 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-400/40">
              <Bookmark className="w-6 h-6 fill-amber-300 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  {language === 'hi' ? 'मेरे सहेजे गए अपडेट' : 'My Saved Items'}
                </h2>
                <span className="bg-[#FF6B00] text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                  {totalSaved} {language === 'hi' ? 'सहेजे' : 'Saved'}
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium">
                {language === 'hi'
                  ? 'आपके बुकमार्क किए गए सरकारी नौकरी, एडमिट कार्ड और करेंट अफेयर्स।'
                  : 'Your bookmarked Sarkari Jobs, Admit Cards, and Current Affairs for fast reference.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-[#0F4C81] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{language === 'hi' ? 'सभी' : 'All Items'}</span>
              <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded-full font-bold">
                {totalSaved}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'jobs'
                  ? 'bg-white text-[#0F4C81] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'सरकारी नौकरियां' : 'Sarkari Jobs'}</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full font-bold">
                {savedPosts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('ca')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ca'
                  ? 'bg-white text-[#0F4C81] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'करेंट अफेयर्स' : 'Current Affairs'}</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
                {savedCA.length}
              </span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {totalSaved > 0 && (
              <>
                <button
                  onClick={handleExportText}
                  className="px-3 py-1.5 text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Export saved bookmarks to TXT file"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>{language === 'hi' ? 'डाउनलोड TXT' : 'Export'}</span>
                </button>

                <button
                  onClick={onClearAll}
                  className="px-3 py-1.5 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Remove all saved bookmarks"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>{language === 'hi' ? 'सभी हटाएं' : 'Clear All'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filter Search Input */}
        {totalSaved > 0 && (
          <div className="px-4 py-2.5 bg-white border-b border-slate-200">
            <div className="relative">
              <input
                type="text"
                placeholder={language === 'hi' ? 'सहेजे गए आइटम में खोजें...' : 'Search within your saved items...'}
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              {filterQuery && (
                <button
                  onClick={() => setFilterQuery('')}
                  className="absolute right-2.5 top-1.5 text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full cursor-pointer"
                >
                  {language === 'hi' ? 'साफ़ करें' : 'Clear'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Saved Content List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {totalSaved === 0 ? (
            <div className="text-center py-12 px-4 space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <Bookmark className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'hi' ? 'अभी कोई सहेजा गया आइटम नहीं है' : 'No Saved Items Yet'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {language === 'hi'
                    ? 'किसी भी सरकारी नौकरी, एडमिट कार्ड या करेंट अफेयर्स अपडेट पर बुकमार्क (★) आइकन पर क्लिक करके यहां सुरक्षित करें।'
                    : 'Click the Bookmark (★) icon on any Sarkari Job notification, Admit Card, or Current Affairs update to save it here for fast offline reference.'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Jobs Section */}
              {(activeTab === 'all' || activeTab === 'jobs') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                      <Briefcase className="w-4 h-4 text-[#0F4C81]" />
                      <span>{language === 'hi' ? 'सहेजी गई नौकरियां एवं अपडेट' : 'Bookmarked Jobs & Notifications'} ({filteredPosts.length})</span>
                    </div>
                  </div>

                  {filteredPosts.length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-2">
                      {language === 'hi' ? `"${filterQuery}" से मेल खाती कोई नौकरी नहीं मिली` : `No jobs matching "${filterQuery}"`}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredPosts.map((post, idx) => (
                        <div
                          key={`${post.id || 'p'}-${idx}`}
                          className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm hover:border-[#0F4C81] transition-all flex flex-col justify-between space-y-3 relative group"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                {language === 'hi' ? (
                                  post.category === 'latest-jobs' ? 'नवीनतम नौकरी' :
                                  post.category === 'results' ? 'परिणाम' :
                                  post.category === 'admit-card' ? 'प्रवेश पत्र' :
                                  post.category.replace('-', ' ')
                                ) : post.category.replace('-', ' ')}
                              </span>
                              <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                {language === 'hi' && post.state === 'All India' ? 'अखिल भारतीय' : post.state}
                              </span>
                            </div>

                            <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug mb-1">
                              {post.title}
                            </h4>

                            <div className="text-[11px] text-slate-500 font-medium truncate mb-2">
                              {post.organization}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              onClick={() => {
                                onSelectPost(post);
                                onClose();
                              }}
                              className="text-xs font-bold text-[#0F4C81] hover:text-[#FF6B00] flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>{language === 'hi' ? 'विवरण देखें' : 'View Details'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => onToggleBookmarkPost(post.id)}
                              className="p-1.5 text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                              title="Remove from saved"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>{language === 'hi' ? 'हटाएं' : 'Remove'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Current Affairs Section */}
              {(activeTab === 'all' || activeTab === 'ca') && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                      <BookOpen className="w-4 h-4 text-[#FF6B00]" />
                      <span>{language === 'hi' ? 'सहेजे गए करेंट अफेयर्स' : 'Bookmarked Current Affairs'} ({filteredCA.length})</span>
                    </div>
                  </div>

                  {filteredCA.length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-2">
                      {language === 'hi' ? `"${filterQuery}" से मेल खाता कोई करेंट अफेयर्स नहीं मिला` : `No current affairs matching "${filterQuery}"`}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredCA.map((ca, idx) => (
                        <div
                          key={`${ca.id || 'ca'}-${idx}`}
                          className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 shadow-sm space-y-2 relative"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-[#FF6B00] bg-orange-100 px-2 py-0.5 rounded">
                              {ca.category}
                            </span>
                            <span className="text-slate-500 font-semibold flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {ca.date}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 leading-snug">
                            {ca.title}
                          </h4>

                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {ca.summary}
                          </p>

                          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                            <span className="text-[10px] text-slate-400 font-medium italic">
                              {language === 'hi' ? 'ब्राउज़र में सुरक्षित' : 'Saved to local storage'}
                            </span>

                            <button
                              onClick={() => onToggleBookmarkCA(ca.id)}
                              className="p-1.5 text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                              title="Remove from saved"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>{language === 'hi' ? 'हटाएं' : 'Remove'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {language === 'hi'
                ? 'सहेजे गए अपडेट आपके ब्राउज़र की लोकल स्टोरेज में स्वचालित रूप से सुरक्षित रहते हैं।'
                : "Saved items automatically persist in your browser's local storage."}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'बंद करें' : 'Close Panel'}
          </button>
        </div>
      </div>
    </div>
  );
};
