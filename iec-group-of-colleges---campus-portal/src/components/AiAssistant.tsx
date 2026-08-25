import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User as UserIcon, 
  Compass, 
  BookOpen, 
  Copy, 
  Check, 
  RotateCcw, 
  AlertCircle, 
  Cpu, 
  Layers, 
  Lightbulb,
  X
} from 'lucide-react';
import { AiMode, AiMessage, User } from '../types';

interface AiAssistantProps {
  user: User | null;
  initialPrompt?: string;
  onClose?: () => void;
  isFloating?: boolean;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  user,
  initialPrompt = '',
  onClose,
  isFloating = false
}) => {
  const [mode, setMode] = useState<AiMode>('campus');
  const [inputQuery, setInputQuery] = useState(initialPrompt);
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I am your **IEC Campus Intelligent Assistant**.\n\nI can help you navigate **Block E**, locate specialized laboratories, check **Lost & Found** status, explain campus regulations, or assist with your **engineering and STEM** academic queries.\n\nHow can I help you today?",
      mode: 'campus',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      setInputQuery(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const campusPresets = [
    "What facilities and labs are located in Block E?",
    "Where is the NVIDIA AI & Deep Learning Research Lab?",
    "How do I claim a lost scientific calculator or item?",
    "What are the central library working hours and rules?"
  ];

  const generalPresets = [
    "Explain Dijkstra's shortest path algorithm with Python code",
    "How does Transformer self-attention work mathematically?",
    "Help me debug an SQL recursive query",
    "Explain the difference between TCP and UDP in computer networks"
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AiMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      mode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend, mode })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'AI server failed to respond');
      }

      const aiMsg: AiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        mode: data.mode || mode,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: AiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ **Service Notice:** ${err.message || 'Unable to reach the campus AI intelligence service. Please verify server connection.'}`,
        mode,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: "Conversation history cleared. Ready for your next query!",
        mode,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <motion.div
      id="ai-assistant-container"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden ${
        isFloating ? 'h-[620px] max-h-[85vh]' : 'min-h-[580px] max-h-[750px]'
      }`}
    >
      {/* Header & Dual Mode Switcher */}
      <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400"
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>IEC Campus AI Intelligence</span>
              <span className="px-2 py-0.5 bg-red-500/15 text-red-400 text-[10px] font-bold rounded-full">
                Gemini 3.7 Flash
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Server-side verified answers • AKTU College Code 090
            </p>
          </div>
        </div>

        {/* Mode Selector & Actions */}
        <div className="flex items-center gap-2">
          {/* Dual Mode Switcher with Layout Animation */}
          <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl relative">
            <button
              onClick={() => setMode('campus')}
              className={`relative py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer select-none ${
                mode === 'campus' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grounded in Block E, buildings, lost & found, and campus regulations"
            >
              {mode === 'campus' && (
                <motion.div
                  layoutId="ai-mode-pill"
                  className="absolute inset-0 bg-red-600 rounded-lg shadow-md -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
              <Compass className="w-3.5 h-3.5" />
              <span>Campus Guide</span>
            </button>
            <button
              onClick={() => setMode('general')}
              className={`relative py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer select-none ${
                mode === 'general' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Engineering formulas, programming assistance, and academic problem solving"
            >
              {mode === 'general' && (
                <motion.div
                  layoutId="ai-mode-pill"
                  className="absolute inset-0 bg-amber-600 rounded-lg shadow-md -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
              <BookOpen className="w-3.5 h-3.5" />
              <span>STEM Academic</span>
            </button>
          </div>

          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl cursor-pointer"
              aria-label="Close Assistant"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Mode Clarification Banner */}
      <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          {mode === 'campus' ? (
            <span><strong>Campus Grounded Mode:</strong> Cites official IEC directory facts, labs, and rules.</span>
          ) : (
            <span><strong>Academic Mode:</strong> Solves programming algorithms, mechanics, and mathematics.</span>
          )}
        </span>
        <button
          onClick={handleClear}
          className="text-slate-500 hover:text-slate-300 flex items-center gap-1 text-[10px] cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 mt-0.5 shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 relative group ${
                    isUser
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white rounded-tr-none shadow-lg'
                      : 'bg-slate-950/80 border border-slate-800/90 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  {/* Content formatting */}
                  <div className="whitespace-pre-line text-slate-100 font-sans">
                    {msg.content}
                  </div>

                  {/* Footer metadata & Copy button */}
                  <div className={`flex items-center justify-between text-[10px] pt-1 ${
                    isUser ? 'text-red-200' : 'text-slate-500 border-t border-slate-800/80 mt-2'
                  }`}>
                    <span>{msg.timestamp} • {msg.mode === 'campus' ? 'Campus Mode' : 'Academic STEM'}</span>

                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="text-slate-400 hover:text-slate-200 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5 shadow-md">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl rounded-tl-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-red-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-red-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-400 ml-2">Formulating verified response...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold shrink-0">
          Suggested:
        </span>
        {(mode === 'campus' ? campusPresets : generalPresets).map((preset, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSend(preset)}
            className="py-1 px-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
          >
            {preset}
          </motion.button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              mode === 'campus'
                ? "Ask about Block E, labs, lost items, fees, admissions..."
                : "Ask about programming, algorithms, physics, calculus..."
            }
            className="flex-1 py-3 px-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-2xl shadow-lg shadow-red-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            aria-label="Send Query"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};
