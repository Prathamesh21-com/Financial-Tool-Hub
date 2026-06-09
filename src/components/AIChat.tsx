import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Minimize2, Sparkles, User } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { sendMessageToAI, type ChatMessage } from '../ai/aiService';

export default function AIChat() {
  const { aiChatOpen, setAiChatOpen } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `🙏 **Namaste!** I'm **Artha AI**, your financial learning companion!\n\nI can help you understand:\n• How calculators work and what results mean\n• Indian financial instruments (SIP, FD, PPF, etc.)\n• Investment concepts and strategies\n• Budget planning and money management\n\nWhat would you like to learn today? 🚀`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    "How does SIP work?",
    "Explain compound interest",
    "What is FIRE movement?",
    "How to save tax in India?",
    "Emergency fund advice",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (aiChatOpen && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [aiChatOpen, minimized]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setInput('');
    const userMsg: ChatMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await sendMessageToAI(messages, messageText);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ I had trouble connecting. Please check your internet connection and try again!'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
      .replace(/•/g, '•');
  };

  return (
    <AnimatePresence>
      {aiChatOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 right-4 z-[100] w-full max-w-sm"
          style={{ maxHeight: minimized ? 'auto' : '600px' }}
        >
          <div className="glass rounded-2xl border border-white/10 overflow-hidden flex flex-col"
            style={{ height: minimized ? 'auto' : '600px', boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.2)' }}>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10"
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))' }}>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                >
                  <Sparkles size={16} className="text-white" />
                </motion.div>
                <div>
                  <div className="font-semibold text-white text-sm">Artha AI</div>
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    />
                    <span className="text-xs text-emerald-400">Financial Learning Assistant</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setMinimized(!minimized)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                  <Minimize2 size={14} />
                </button>
                <button onClick={() => setAiChatOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                  <X size={14} />
                </button>
              </div>
            </div>

            {!minimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
                        msg.role === 'user'
                          ? 'bg-indigo-500'
                          : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                      }`}>
                        {msg.role === 'user' ? <User size={13} className="text-white" /> : <Bot size={13} className="text-white" />}
                      </div>
                      <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'text-white rounded-tr-sm'
                          : 'text-slate-200 rounded-tl-sm'
                      }`} style={{
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg, #6366f1, #a855f7)'
                          : 'rgba(255,255,255,0.05)',
                        border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.08)' : 'none'
                      }}>
                        <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                      </div>
                    </motion.div>
                  ))}

                  {loading && (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)' }}>
                        <Bot size={13} className="text-white" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl rounded-tl-sm"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <motion.div className="flex gap-1.5">
                          {[0, 1, 2].map(i => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                {messages.length <= 2 && (
                  <div className="px-4 pb-2">
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.map(s => (
                        <button key={s} onClick={() => sendMessage(s)}
                          className="text-xs px-3 py-1.5 rounded-full text-indigo-300 transition-all hover:text-white"
                          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      placeholder="Ask about finance..."
                      className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = 'rgba(99,102,241,0.5)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || loading}
                      className="p-2.5 rounded-xl transition-all disabled:opacity-40"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                    >
                      <Send size={16} className="text-white" />
                    </motion.button>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 text-center">Educational only. Not financial advice.</p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
