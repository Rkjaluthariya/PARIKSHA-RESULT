import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, HelpCircle } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Namaste! I am your Pariksha AI Career Counselor. Ask me anything about Govt Job Eligibility, Exam Patterns, Age Relaxations, Syllabus, or Important Dates!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, retryAttempt, isOpen]);

  const SUGGESTED_QUESTIONS = [
    'Am I eligible for SSC CGL 2026 if born in 1999?',
    'What is the exam pattern for UP Police Constable?',
    'What are the age relaxation rules for OBC candidates in RRB NTPC?',
    'Which top 5 Sarkari forms are active for Graduates right now?',
  ];

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: query }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);
    setRetryAttempt(0);

    const MAX_RETRIES = 3;
    let success = false;
    let replyText = '';

    // Attempt initial connection (attempt 0) and up to 3 reconnect attempts (attempts 1, 2, 3)
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        setRetryAttempt(attempt);
        // Staggered backoff before reconnecting (e.g. 1000ms, 1500ms, 2000ms)
        await sleep(1000 + (attempt - 1) * 500);
      }

      try {
        const res = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userMessage: query,
            history: newMessages.slice(0, -1),
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const data = await res.json();
        if (data.success && data.reply) {
          replyText = data.reply;
          success = true;
          break; // Success, exit retry loop
        } else {
          throw new Error(data.error || 'Failed to get response');
        }
      } catch (err: any) {
        console.warn(`[AI Chat] Attempt ${attempt === 0 ? 'initial' : `reconnect #${attempt}`} failed:`, err.message || err);
      }
    }

    if (success && replyText) {
      setMessages([...newMessages, { role: 'model', text: replyText }]);
    } else {
      // Only show error message after all 3 reconnect attempts have failed
      setMessages([
        ...newMessages,
        { role: 'model', text: 'Sorry, I encountered a connection issue. Please try again.' },
      ]);
    }

    setRetryAttempt(0);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col my-auto h-[82vh] border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#0F4C81] text-white p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#FF6B00] flex items-center justify-center text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider">Pariksha AI Career Counselor</h2>
              <p className="text-[10px] text-blue-200">Ask eligibility, cutoffs, syllabus & exam updates</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-800 rounded-full text-blue-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Quick Questions */}
        <div className="bg-slate-100 p-2.5 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase flex-shrink-0">Suggestions:</span>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] font-medium bg-white hover:bg-blue-50 text-slate-700 hover:text-[#0F4C81] px-2.5 py-1 rounded-full border border-slate-200 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-slate-50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 max-w-[88%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  m.role === 'user' ? 'bg-[#FF6B00] text-white' : 'bg-[#0F4C81] text-white'
                }`}
              >
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap font-medium shadow-sm ${
                  m.role === 'user'
                    ? 'bg-[#FF6B00] text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 items-center text-xs text-slate-500 font-medium">
              <div className="w-7 h-7 rounded-full bg-[#0F4C81] text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#0F4C81]" />
                <span>
                  {retryAttempt > 0
                    ? `Reconnecting (attempt ${retryAttempt} of 3)...`
                    : 'Analyzing rules & typing answer...'}
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 flex-shrink-0">
          <input
            type="text"
            placeholder="Type your exam question or age query..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F4C81] font-medium"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-[#0F4C81] hover:bg-blue-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
