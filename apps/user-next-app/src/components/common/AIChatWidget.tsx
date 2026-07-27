'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { Sparkles, Send, Bot, RotateCcw, X, AlertCircle, ExternalLink, PhoneCall } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isError?: boolean;
}

const ZALO_LINK = 'https://zalo.me/0374864110';
const ZALO_PHONE = '0374 864 110';

const QUICK_SUGGESTIONS = [
  '💬 Chat Zalo với Kỹ thuật viên',
  'Máy phay CNC nổi bật?',
  'Địa chỉ showroom ở đâu?',
  'Tư vấn mua máy tiện CNC',
];

const MAX_CHARS = 300;

// Helper function to format Markdown bold (**text**) and bullet lists (* item)
function renderFormattedContent(text: string) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed break-words">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1" />;
        }

        // Check if line is a bullet point (* or -)
        const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('*   ') || trimmed.startsWith('-   ');
        let contentText = line;
        if (isBullet) {
          contentText = trimmed.replace(/^[\*\-]\s+/, '');
        }

        // Parse **bold text**
        const parts = contentText.split(/(\*\*.*?\*\*)/g);
        const renderedParts = parts.map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={partIdx} className="font-semibold text-slate-900">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-0.5 my-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5"></span>
              <div className="flex-1">{renderedParts}</div>
            </div>
          );
        }

        return <div key={lineIdx}>{renderedParts}</div>;
      })}
    </div>
  );
}

export default function AIChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session ID from localStorage or generate new uuid
  useEffect(() => {
    setMounted(true);
    let sid = localStorage.getItem('ai_session_id');
    if (!sid) {
      sid = uuidv4();
      localStorage.setItem('ai_session_id', sid);
    }
    setSessionId(sid);

    // Initial greeting if empty
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: 'Xin chào! Tôi là Trợ lý AI của Máy Công Cụ Thanh Bằng. Bạn cần tư vấn sản phẩm hay hỗ trợ kỹ thuật gì cứ hỏi tôi nhé! 🤖✨',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, []);

  // Auto scroll to bottom of message list
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Reset conversation session
  const handleResetSession = () => {
    const newSid = uuidv4();
    setSessionId(newSid);
    localStorage.setItem('ai_session_id', newSid);
    setMessages([
      {
        id: uuidv4(),
        sender: 'ai',
        text: 'Đã làm mới cuộc hội thoại. Bạn muốn tìm hiểu thông tin gì tiếp theo?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();

    // If clicking Zalo suggestion
    if (query.includes('Chat Zalo')) {
      window.open(ZALO_LINK, '_blank');
      return;
    }

    if (!query || loading) return;

    if (query.length > MAX_CHARS) {
      alert(`Câu hỏi quá dài. Vui lòng nhập tối đa ${MAX_CHARS} ký tự.`);
      return;
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: uuidv4(),
      sender: 'user',
      text: query,
      timestamp: time,
    };

    setInput('');
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          sessionId: sessionId,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        const aiMsg: Message = {
          id: uuidv4(),
          sender: 'ai',
          text: json.data?.reply || 'Cảm ơn câu hỏi của bạn!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (json.data?.sessionId) {
          setSessionId(json.data.sessionId);
          localStorage.setItem('ai_session_id', json.data.sessionId);
        }
      } else if (res.status === 429) {
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            sender: 'ai',
            text: '⚠️ Bạn đã gửi câu hỏi quá nhanh hoặc vượt quá giới hạn lượt dùng trong ngày (20 câu/ngày). Vui lòng thử lại sau ít phút hoặc nhắn Zalo hỗ trợ nhé!',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isError: true,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            sender: 'ai',
            text: json.message || 'Hệ thống đang bận. Vui lòng thử lại sau.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isError: true,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          sender: 'ai',
          text: 'Không thể kết nối tới máy chủ AI. Vui lòng kiểm tra lại kết nối mạng.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="mb-4 bg-white rounded-2xl shadow-[0_12px_45px_rgba(79,70,229,0.22)] border border-indigo-100 w-[350px] sm:w-[385px] h-[540px] max-h-[82vh] flex flex-col origin-bottom-right overflow-hidden relative"
          >
            {/* Header - Indigo/Purple Gradient */}
            <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white p-4 flex items-center justify-between shadow-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner shrink-0">
                  <Bot className="w-5 h-5 text-indigo-100" />
                </div>
                <div>
                  <h4 className="font-bold text-[14px] leading-tight m-0 flex items-center gap-1.5 text-white">
                    Trợ lý AI & Hỗ trợ
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[11px] text-indigo-100 font-medium">Sẵn sàng 24/7</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Zalo Direct Button in Header */}
                <a
                  href={ZALO_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Chat Zalo trực tiếp (${ZALO_PHONE})`}
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#0068FF] hover:bg-[#0052cc] text-white text-[11px] font-bold rounded-lg transition-colors shadow-sm no-underline"
                >
                  <span>Zalo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={handleResetSession}
                  title="Làm mới cuộc hội thoại"
                  className="p-1.5 text-indigo-100 hover:text-white hover:bg-white/15 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Đóng"
                  className="p-1.5 text-indigo-100 hover:text-white hover:bg-white/15 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Zalo Banner Top Bar */}
            <div className="bg-blue-50/90 border-b border-blue-100 px-3.5 py-2 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 text-[12px] text-blue-900 font-medium truncate">
                <span className="w-2 h-2 rounded-full bg-[#0068FF] shrink-0"></span>
                <span className="truncate">Cần tư vấn ngay với Kỹ thuật viên?</span>
              </div>
              <a
                href={ZALO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#0068FF] hover:underline shrink-0 no-underline"
              >
                Nhắn Zalo →
              </a>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : msg.isError
                        ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-none flex items-start gap-1.5'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none shadow-slate-100'
                    }`}
                  >
                    {msg.isError && <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                    {msg.sender === 'user' ? (
                      <div className="whitespace-pre-line break-words">{msg.text}</div>
                    ) : (
                      renderFormattedContent(msg.text)
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex flex-col items-start">
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1.5 text-slate-500">
                    <span className="text-[12px] font-medium text-indigo-600 mr-1">AI đang suy nghĩ</span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}

              {/* Quick Prompt Suggestions */}
              {messages.length <= 2 && !loading && (
                <div className="pt-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gợi ý hỗ trợ nhanh:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_SUGGESTIONS.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(sug)}
                        className={`text-[12px] rounded-full px-3 py-1 font-medium transition-colors text-left border ${
                          sug.includes('Zalo')
                            ? 'bg-blue-50 text-[#0068FF] border-blue-200 hover:bg-blue-100 font-bold'
                            : 'bg-indigo-50/80 text-indigo-700 border-indigo-200/60 hover:bg-indigo-100'
                        }`}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-100 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={input}
                    maxLength={MAX_CHARS}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Hỏi AI về máy phay, tiện, bảo hành..."
                    className="w-full pl-3.5 pr-9 py-2 rounded-xl bg-slate-100/80 border border-slate-200 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-medium">
                    {input.length}/{MAX_CHARS}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-md shadow-indigo-500/20 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Mở Trợ lý AI & Hỗ trợ Zalo"
        className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 text-white rounded-full shadow-lg shadow-indigo-600/30 hover:scale-105 hover:shadow-xl hover:shadow-indigo-600/40 transition-all duration-300 group"
      >
        <Sparkles className="w-6 h-6 text-amber-300 group-hover:rotate-12 transition-transform duration-300 fill-amber-300" />

        {/* Small Zalo Icon Badge on Bottom-Left of Button */}
        <div
          title="Tích hợp Zalo"
          className="absolute -bottom-0.5 -left-0.5 w-5 h-5 rounded-full bg-[#0068FF] text-white flex items-center justify-center text-[9px] font-black border-2 border-white shadow-sm"
        >
          Z
        </div>

        {/* Unread / Notification Badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 px-1.5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-extrabold text-slate-900 border-2 border-white shadow-sm">
            AI
          </span>
        )}
      </button>
    </div>
  );
}
