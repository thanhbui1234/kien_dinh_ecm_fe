'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { Sparkles, Send, Bot, RotateCcw, X, AlertCircle, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isError?: boolean;
}

const ZALO_LINK = 'https://zalo.me/0943676869';
const ZALO_PHONE = '0374 864 110';
const MAX_CHARS = 300;

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

        const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('*   ') || trimmed.startsWith('-   ');
        let contentText = line;
        if (isBullet) {
          contentText = trimmed.replace(/^[\*\-]\s+/, '');
        }

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
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [unreadCount, setUnreadCount] = useState(1);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mobilePanelStyle, setMobilePanelStyle] = useState<{ top: number; height: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const QUICK_SUGGESTIONS = [
    `💬 ${t('chat.zalo_banner_cta').replace(' →', '')}`,
    t('chat.suggestions.0'),
    t('chat.suggestions.1'),
    t('chat.suggestions.2'),
  ];

  useEffect(() => {
    setMounted(true);
    let sid = localStorage.getItem('ai_session_id');
    if (!sid) {
      sid = uuidv4();
      localStorage.setItem('ai_session_id', sid);
    }
    setSessionId(sid);

    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: t('chat.welcome_message'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setShowTooltip(true);
    const hideTimer = setTimeout(() => setShowTooltip(false), 10000);
    return () => clearTimeout(hideTimer);
  }, [mounted]);

  useEffect(() => {
    if (isOpen) setShowTooltip(false);
  }, [isOpen]);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 639px)').matches;
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 639px)').matches;
    const vv = window.visualViewport;
    if (!isOpen || !isMobile || !vv) {
      setMobilePanelStyle(null);
      return;
    }

    const TOP_OFFSET = 32;
    const BOTTOM_MARGIN = 16;

    const updateSize = () => {
      setMobilePanelStyle({
        top: vv.offsetTop + TOP_OFFSET,
        height: vv.height - TOP_OFFSET - BOTTOM_MARGIN,
      });
    };

    updateSize();
    vv.addEventListener('resize', updateSize);
    vv.addEventListener('scroll', updateSize);
    return () => {
      vv.removeEventListener('resize', updateSize);
      vv.removeEventListener('scroll', updateSize);
      setMobilePanelStyle(null);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleResetSession = () => {
    const newSid = uuidv4();
    setSessionId(newSid);
    localStorage.setItem('ai_session_id', newSid);
    setMessages([
      {
        id: uuidv4(),
        sender: 'ai',
        text: t('chat.reset_message'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();

    if (query.includes('Zalo') || query.toLowerCase().includes('zalo')) {
      window.open(ZALO_LINK, '_blank');
      return;
    }

    if (!query || loading) return;

    if (query.length > MAX_CHARS) {
      alert(t('chat.message_too_long'));
      return;
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { id: uuidv4(), sender: 'user', text: query, timestamp: time };

    setInput('');
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, sessionId }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        const aiMsg: Message = {
          id: uuidv4(),
          sender: 'ai',
          text: json.data?.reply || t('chat.fallback_thanks'),
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
            text: t('chat.rate_limit_error'),
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
            text: json.message || t('chat.system_error'),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isError: true,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          sender: 'ai',
          text: t('chat.network_error'),
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
    <div className="fixed bottom-6 right-6 z-[1001] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/50 sm:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            style={mobilePanelStyle ? { top: mobilePanelStyle.top, height: mobilePanelStyle.height, bottom: 'auto' } : undefined}
            className="fixed inset-x-3 top-8 bottom-4 z-50 rounded-3xl sm:static sm:inset-auto sm:mb-4 sm:h-[540px] sm:max-h-[82vh] sm:w-[350px] md:w-[385px] sm:rounded-2xl bg-white shadow-[0_12px_45px_rgba(79,70,229,0.22)] border border-indigo-100 flex flex-col origin-bottom-right overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white p-4 flex items-center justify-between shadow-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner shrink-0">
                  <Bot className="w-5 h-5 text-indigo-100" />
                </div>
                <div>
                  <h4 className="font-bold text-[14px] leading-tight m-0 flex items-center gap-1.5 text-white">
                    {t('chat.header_title')}
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[11px] text-indigo-100 font-medium">{t('chat.header_subtitle')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={ZALO_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={t('chat.zalo_button_title', { phone: ZALO_PHONE })}
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#0068FF] hover:bg-[#0052cc] text-white text-[11px] font-bold rounded-lg transition-colors shadow-sm no-underline"
                >
                  <span>Zalo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={handleResetSession}
                  title={t('chat.reset_button_title')}
                  className="p-1.5 text-indigo-100 hover:text-white hover:bg-white/15 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title={t('chat.close_button_title')}
                  className="p-1.5 text-indigo-100 hover:text-white hover:bg-white/15 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Zalo Banner */}
            <div className="bg-blue-50/90 border-b border-blue-100 px-3.5 py-2 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 text-[12px] text-blue-900 font-medium truncate">
                <span className="w-2 h-2 rounded-full bg-[#0068FF] shrink-0"></span>
                <span className="truncate">{t('chat.zalo_banner')}</span>
              </div>
              <a
                href={ZALO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#0068FF] hover:underline shrink-0 no-underline"
              >
                {t('chat.zalo_banner_cta')}
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
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm ${msg.sender === 'user'
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

              {loading && (
                <div className="flex flex-col items-start">
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1.5 text-slate-500">
                    <span className="text-[12px] font-medium text-indigo-600 mr-1">{t('chat.typing_indicator')}</span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}

              {messages.length <= 2 && !loading && (
                <div className="pt-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t('chat.suggestions_label')}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_SUGGESTIONS.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(sug)}
                        className={`text-[12px] rounded-full px-3 py-1 font-medium transition-colors text-left border ${
                          sug.toLowerCase().includes('zalo')
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
                    placeholder={t('chat.input_placeholder')}
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

      {/* Onboarding Tooltip */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mb-3 relative w-[260px] origin-bottom-right rounded-2xl border border-indigo-100 shadow-[0_16px_40px_rgba(79,70,229,0.25)]"
            role="status"
          >
            <div className="absolute -bottom-1.5 right-7 w-3 h-3 bg-white border-r border-b border-indigo-100 rotate-45" />

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-indigo-50">
              <button
                type="button"
                onClick={() => setShowTooltip(false)}
                aria-label={t('chat.close_suggestions')}
                className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-start gap-3 px-4 pt-4 pb-3.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/30">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="pt-0.5 pr-4">
                  <p className="text-[13.5px] font-semibold text-slate-800 leading-snug m-0">
                    {t('chat.tooltip_heading')}
                  </p>
                  <p className="text-[11.5px] text-slate-400 font-medium leading-snug m-0 mt-0.5">
                    {t('chat.tooltip_subtext')}
                  </p>
                </div>
              </div>

              <div className="h-1 w-full bg-indigo-100">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 10, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`relative ${isOpen ? 'hidden sm:block' : ''}`}>
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.55, 0.15, 0.55], scale: [1, 1.18, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-indigo-500 blur-md"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={t('chat.fab_aria_label')}
          className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 text-white rounded-full shadow-lg shadow-indigo-600/30 hover:scale-105 hover:shadow-xl hover:shadow-indigo-600/40 transition-all duration-300 group"
        >
          <Sparkles className="w-6 h-6 text-amber-300 group-hover:rotate-12 transition-transform duration-300 fill-amber-300" />

          <div
            title={t('chat.zalo_badge_title')}
            className="absolute -bottom-0.5 -left-0.5 w-5 h-5 rounded-full bg-[#0068FF] text-white flex items-center justify-center text-[9px] font-black border-2 border-white shadow-sm"
          >
            Z
          </div>

          {!isOpen && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 px-1.5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-extrabold text-slate-900 border-2 border-white shadow-sm">
              AI
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
