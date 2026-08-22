import React, { useState, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Image,
  Upload,
  Table,
  Eye,
  Edit3,
  Columns,
  Quote,
  Minus,
  Code,
  Sparkles
} from 'lucide-react';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label = 'Content (Markdown Supported)',
  value,
  onChange,
  placeholder = 'Write blog/post content here...',
  rows = 8
}) => {
  const [viewMode, setViewMode] = useState<'edit' | 'source' | 'preview' | 'split'>('edit');
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  
  // Link Modal States
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Image Modal States
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to insert text at current selection cursor
  const insertTextAtCursor = (beforeText: string, afterText: string = '', defaultInside: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + beforeText + defaultInside + afterText);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || defaultInside;
    const replacement = beforeText + selected + afterText;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + beforeText.length,
        start + beforeText.length + selected.length
      );
    }, 50);
  };

  // Quick Formatting Actions
  const handleBold = () => insertTextAtCursor('**', '**', 'bold text');
  const handleItalic = () => insertTextAtCursor('*', '*', 'italic text');
  const handleHeading1 = () => insertTextAtCursor('\n# ', '\n', 'Heading 1');
  const handleHeading2 = () => insertTextAtCursor('\n## ', '\n', 'Heading 2');
  const handleHeading3 = () => insertTextAtCursor('\n### ', '\n', 'Heading 3');
  const handleBulletList = () => insertTextAtCursor('\n- ', '\n- Second item\n', 'First item');
  const handleNumberedList = () => insertTextAtCursor('\n1. ', '\n2. Second item\n', 'First item');
  const handleQuote = () => insertTextAtCursor('\n> ', '\n', 'Important quote or note');
  const handleHorizontalRule = () => insertTextAtCursor('\n\n---\n\n', '');
  const handleCodeBlock = () => insertTextAtCursor('\n```\n', '\n```\n', '// Code snippet here');
  const handleTable = () => insertTextAtCursor(
    '\n| Header 1 | Header 2 | Header 3 |\n| :--- | :---: | ---: |\n| Cell 1 | Cell 2 | Cell 3 |\n| Cell 4 | Cell 5 | Cell 6 |\n\n',
    ''
  );

  // Handle Link Insertion
  const handleOpenLinkModal = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const selected = value.substring(textarea.selectionStart, textarea.selectionEnd);
      if (selected) setLinkText(selected);
    }
    setShowLinkModal(true);
  };

  const handleApplyLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl) return;
    const text = linkText.trim() || 'Link Text';
    insertTextAtCursor(`[${text}](`, `)`, linkUrl);
    setLinkText('');
    setLinkUrl('');
    setShowLinkModal(false);
  };

  // Handle Image Insertion
  const handleApplyImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;
    const alt = imageAlt.trim() || 'Image Banner';
    insertTextAtCursor(`![${alt}](`, `)`, imageUrl);
    setImageUrl('');
    setImageAlt('');
    setShowImageModal(false);
  };

  // Handle Image File Upload (Base64)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Image file size is too large (max 3MB allowed). Please select a smaller image or use an image URL.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        setImageUrl(base64Url);
        if (!imageAlt) setImageAlt(file.name.replace(/\.[^/.]+$/, ""));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {/* Editor Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 text-white px-3 py-2 rounded-t-xl border border-slate-800">
        <label className="font-bold text-xs flex items-center gap-1.5 text-amber-300">
          <Edit3 className="w-3.5 h-3.5" />
          <span>{label}</span>
        </label>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
              viewMode === 'edit' ? 'bg-amber-500 text-slate-950 shadow font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Visual</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('source')}
            className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
              viewMode === 'source' ? 'bg-amber-500 text-slate-950 shadow font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>HTML/Source</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
              viewMode === 'preview' ? 'bg-amber-500 text-slate-950 shadow font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`hidden md:flex px-2.5 py-1 rounded items-center gap-1 transition-all ${
              viewMode === 'split' ? 'bg-amber-500 text-slate-950 shadow font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Columns className="w-3 h-3" />
            <span>Split View</span>
          </button>
        </div>
      </div>

      {/* Formatting Toolbar (Active in Edit & Split modes) */}
      {(viewMode === 'edit' || viewMode === 'split') && (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-100 border-x border-slate-300 text-slate-800 text-xs shadow-inner">
          <button
            type="button"
            onClick={handleBold}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-900 font-bold flex items-center gap-1"
            title="Bold (**text**)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleItalic}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-900 font-bold"
            title="Italic (*text*)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-slate-300 mx-1"></div>

          <button
            type="button"
            onClick={handleHeading1}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-900 font-bold"
            title="Heading 1 (# Heading)"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleHeading2}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-900 font-bold"
            title="Heading 2 (## Heading)"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleHeading3}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-900 font-bold"
            title="Heading 3 (### Heading)"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-slate-300 mx-1"></div>

          <button
            type="button"
            onClick={handleBulletList}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-900 font-bold flex items-center gap-1 bg-amber-100/80 hover:bg-amber-200 border border-amber-300"
            title="Bullet Point (- List item)"
          >
            <List className="w-3.5 h-3.5 text-amber-900" />
            <span className="text-[10px] font-black text-amber-950">Bullets</span>
          </button>

          <button
            type="button"
            onClick={handleNumberedList}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-900 font-bold"
            title="Numbered List (1. List item)"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-slate-300 mx-1"></div>

          {/* Hyperlink Button */}
          <button
            type="button"
            onClick={handleOpenLinkModal}
            className="p-1.5 hover:bg-slate-200 rounded text-blue-700 font-bold flex items-center gap-1 bg-blue-50 border border-blue-200"
            title="Insert Hyperlink [Text](URL)"
          >
            <Link className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black">Link</span>
          </button>

          {/* Image Upload/Link Button */}
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="p-1.5 hover:bg-slate-200 rounded text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 border border-emerald-300"
            title="Insert Image / Upload (![Alt](URL))"
          >
            <Image className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] font-black">Add Image</span>
          </button>

          <div className="w-px h-4 bg-slate-300 mx-1"></div>

          <button
            type="button"
            onClick={handleTable}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-900 font-bold"
            title="Insert Table"
          >
            <Table className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleQuote}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-900 font-bold"
            title="Blockquote (> Quote)"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleCodeBlock}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-900 font-bold"
            title="Code Block (``` code ```)"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleHorizontalRule}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-900 font-bold"
            title="Horizontal Line (---)"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Editor & Preview Display Body */}
      <div className={`grid ${viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2 gap-3' : 'grid-cols-1'}`}>
        
        {/* TEXTAREA INPUT */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 border border-slate-300 rounded-b-xl font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none leading-relaxed bg-white text-slate-900 shadow-inner"
          />
        )}

        {/* RAW HTML / SOURCE CODE MODE */}
        {viewMode === 'source' && (
          <div className="space-y-1">
            <div className="bg-slate-800 text-slate-200 px-3 py-1.5 rounded-t-lg text-[10px] font-mono flex items-center justify-between">
              <span>Raw HTML &amp; Markdown Code Mode (No auto-stripping)</span>
              <span>{value ? value.length : 0} bytes</span>
            </div>
            <textarea
              ref={textareaRef}
              rows={Math.max(rows + 4, 14)}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste or write raw HTML, tables, Markdown, image tags, or full article source..."
              className="w-full p-3 border-2 border-slate-800 rounded-b-xl font-mono text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none leading-relaxed bg-slate-950 text-emerald-400 shadow-2xl selection:bg-cyan-800 selection:text-white"
            />
          </div>
        )}

        {/* LIVE MARKDOWN PREVIEW */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="border border-slate-300 bg-slate-50 rounded-b-xl p-4 overflow-y-auto max-h-[350px] space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Live Formatted Render Preview
              </span>
              <span>{value.length} Characters</span>
            </div>

            <div className="markdown-body text-xs leading-relaxed text-slate-800 space-y-2">
              {value.trim() ? (
                <Markdown remarkPlugins={[remarkGfm]}>{value}</Markdown>
              ) : (
                <p className="text-slate-400 italic text-center py-6">
                  Nothing to preview yet. Write or format text using the toolbar above!
                </p>
              )}
            </div>
          </div>
        )}

      </div>

      {/* MODAL: HYPERLINK INSERTION */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Link className="w-4 h-4 text-blue-600" />
                <span>Insert Hyperlink (हाइपरलिंक जोड़ें)</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyLink} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Display Text (लिंक का नाम)</label>
                <input
                  type="text"
                  placeholder="e.g. Official Notification PDF"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target URL (वेबसाइट लिंक / URL)</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/notification.pdf"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-mono text-blue-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow"
                >
                  Insert Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: IMAGE INSERTION / UPLOAD */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Image className="w-4 h-4 text-emerald-600" />
                <span>Insert or Upload Image (इमेज अपलोड / लिंक)</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyImage} className="space-y-4 text-xs">
              {/* Option A: Local File Upload */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-2">
                <label className="font-bold text-emerald-950 block text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Option A: Upload Image File from Computer / Mobile</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Image File to Upload</span>
                </button>
              </div>

              <div className="text-center font-bold text-slate-400 text-[10px] uppercase">--- OR ---</div>

              {/* Option B: Image Web URL */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Option B: Image Web URL (इमेज लिंक)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or https://domain.com/banner.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image Alt Text / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Official Notification Banner"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-medium"
                />
              </div>

              {/* Image Preview Box */}
              {imageUrl && (
                <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Image Preview:</span>
                  <img
                    src={imageUrl}
                    alt={imageAlt || "Uploaded Content Preview"}
                    className="max-h-32 w-full object-contain rounded border border-slate-300"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = 'true';
                        target.style.display = 'none';
                      }
                    }}
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!imageUrl}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow disabled:opacity-50"
                >
                  Insert Image Into Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
