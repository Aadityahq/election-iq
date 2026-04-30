import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAIResponse } from '../services/geminiService';
import { saveMessage, getMessages } from '../services/firebase';
import { generateSessionId } from '../utils/helpers';
import {
  Shield,
  ClipboardCheck,
  CheckCircle,
  BarChart3,
  Clock,
  Send,
  Mic,
  ArrowRight,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import '../styles/chat.css';

/* ─────────────────────────────────────────────────────────────────────────
   Lightweight markdown → React elements renderer
   Handles: **bold**, *italic*, numbered lists, bullet lists, line breaks
   ───────────────────────────────────────────────────────────────────────── */
function renderMarkdown(text) {
  // Split into paragraphs / list items
  const lines = text.split('\n');
  const elements = [];
  let key = 0;

  let listBuffer = [];
  let listType = null; // 'ol' | 'ul'

  const flushList = () => {
    if (!listBuffer.length) return;
    const Tag = listType;
    elements.push(
      React.createElement(
        Tag,
        { key: key++, className: `md-list md-${listType}` },
        listBuffer.map((item, i) =>
          React.createElement('li', { key: i }, renderInline(item))
        )
      )
    );
    listBuffer = [];
    listType = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    // Ordered list:  1. item
    const olMatch = line.match(/^\s*\d+\.\s+(.+)/);
    if (olMatch) {
      if (listType === 'ul') flushList();
      listType = 'ol';
      listBuffer.push(olMatch[1]);
      continue;
    }

    // Unordered list: - item  or • item
    const ulMatch = line.match(/^\s*[-•*]\s+(.+)/);
    if (ulMatch) {
      if (listType === 'ol') flushList();
      listType = 'ul';
      listBuffer.push(ulMatch[1]);
      continue;
    }

    // Empty line → flush list + add spacer
    if (!line.trim()) {
      flushList();
      elements.push(<span key={key++} className="md-br" />);
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={key++} className="md-p">
        {renderInline(line)}
      </p>
    );
  }

  flushList();
  return elements;
}

function renderInline(text) {
  // Bold **text** or __text__
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g);
  return parts.map((part, i) => {
    if (/^\*\*(.+)\*\*$/.test(part) || /^__(.+)__$/.test(part)) {
      const inner = part.slice(2, -2);
      return <strong key={i}>{inner}</strong>;
    }
    if (/^\*(.+)\*$/.test(part) || /^_(.+)_$/.test(part)) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

/* ─────────────────────────────────────────────────────────────────────────
   Constants
   ───────────────────────────────────────────────────────────────────────── */
const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'bot',
    text: "Hello! I'm **ElectionIQ** 🗳️ — your civic education guide.\n\nAsk me anything about how elections work: voter registration, polling, vote counting, and more!",
    timestamp: new Date(),
  },
];

const QUICK_ACTIONS = [
  { label: 'Register to vote', Icon: ClipboardCheck, query: 'How do I register to vote in India?' },
  { label: 'Voting day', Icon: CheckCircle, query: 'What happens on voting day?' },
  { label: 'Vote counting', Icon: BarChart3, query: 'How are votes counted in India?' },
  { label: 'Election timeline', Icon: Clock, query: 'Explain the election timeline step by step.' },
  { label: 'EVM & VVPAT', Icon: Shield, query: 'What is an EVM and VVPAT?' },
];

const LANG_MAP = {
  English: 'en-US',
  Hindi: 'hi-IN',
  Spanish: 'es-ES',
  French: 'fr-FR',
};

/* ─────────────────────────────────────────────────────────────────────────
   Chat Component
   ───────────────────────────────────────────────────────────────────────── */
function Chat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [lastFailedQuery, setLastFailedQuery] = useState(null);
  const [language, setLanguage] = useState('English');
  const [isListening, setIsListening] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const [attachedFiles, setAttachedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Load chat history on component mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const savedMessages = await getMessages(sessionId);
        if (savedMessages && savedMessages.length > 0) {
          // Convert saved messages to component format
          const formattedMessages = savedMessages.map((msg, idx) => ({
            id: idx,
            role: msg.sender === 'user' ? 'user' : 'bot',
            text: msg.message,
            timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
          }));
          
          // Preserve initial greeting and append history
          setMessages((prev) => {
            const initialGreeting = prev[0];
            return [initialGreeting, ...formattedMessages];
          });
        }
      } catch (err) {
        console.error('[Chat] Error loading history:', err);
        // Continue without history if load fails
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /* ── File handling ──────────────────────────────────────── */
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowed = ['image/png', 'image/jpeg', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'text/csv',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    const validFiles = files.filter(f => {
      if (!allowed.includes(f.type)) {
        setErrorBanner(`⚠️ ${f.name}: Unsupported file type. Use images, PDF, TXT, CSV, or DOC.`);
        return false;
      }
      if (f.size > maxSize) {
        setErrorBanner(`⚠️ ${f.name}: File too large (max 5MB).`);
        return false;
      }
      return true;
    });

    setAttachedFiles(prev => [...prev, ...validFiles].slice(0, 3)); // max 3 files
    e.target.value = ''; // reset input
  };

  const removeFile = (idx) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const getFilePreviewIcon = (file) => {
    if (file.type.startsWith('image/')) return ImageIcon;
    return FileText;
  };

  const sendMessage = useCallback(
    async (overrideText) => {
      const messageText = (overrideText ?? input).replace(/[<>]/g, '').trim();
      if ((!messageText && !attachedFiles.length) || loading) return;

      setErrorBanner('');
      setLastFailedQuery(null);
      setInput('');

      // Build user message with file info
      const fileNames = attachedFiles.map(f => f.name);
      const displayText = fileNames.length
        ? `${messageText || 'Attached files'}\n📎 ${fileNames.join(', ')}`
        : messageText;

      const userMsg = {
        id: Date.now(),
        role: 'user',
        text: displayText,
        files: attachedFiles.map(f => ({ name: f.name, type: f.type, size: f.size })),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      saveMessage(sessionId, displayText, 'user').catch(() => {});

      // Build context string for AI including file contents
      let contextText = messageText;
      for (const file of attachedFiles) {
        if (file.type.startsWith('text/') || file.type === 'application/pdf') {
          try {
            const text = await file.text();
            contextText += `\n\n[Attached file: ${file.name}]\n${text.slice(0, 2000)}`;
          } catch { /* skip unreadable files */ }
        } else if (file.type.startsWith('image/')) {
          contextText += `\n\n[User attached an image: ${file.name}]`;
        }
      }

      setAttachedFiles([]);
      setLoading(true);

      try {
        const reply = await getAIResponse(contextText, language);
        const botMsg = { id: Date.now() + 1, role: 'bot', text: reply, timestamp: new Date() };
        setMessages((prev) => [...prev, botMsg]);
        saveMessage(sessionId, reply, 'bot').catch(() => {});
      } catch (err) {
        console.error('[Chat] AI error:', err);
        const errMsg = err.message || '';
        const isQuota = errMsg.includes('429') || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('exhausted');

        setErrorBanner(
          isQuota
            ? '⚠️ AI quota reached — please wait a moment and retry, or try again in a few minutes.'
            : '⚠️ Could not reach ElectionIQ. Check your internet connection and retry.'
        );
        setLastFailedQuery(messageText);

        const errBotMsg = {
          id: Date.now() + 1,
          role: 'bot',
          text: isQuota
            ? "I'm temporarily rate-limited. Please wait a moment and hit **Retry** above."
            : "I ran into a connection issue. Please check your internet and try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errBotMsg]);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [input, loading, language, sessionId, attachedFiles]
  );

  const retryLast = () => {
    if (lastFailedQuery) {
      // Remove the last bot error message before retrying
      setMessages((prev) => prev.slice(0, -1));
      setErrorBanner('');
      sendMessage(lastFailedQuery);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVoiceInput = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('Voice input is not supported in your browser.');
      return;
    }
    const recognition = new SR();
    recognition.lang = LANG_MAP[language] || 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (e) => setInput(e.results[0][0].transcript);
    recognition.start();
  };

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
    setErrorBanner('');
    setLastFailedQuery(null);
  };

  return (
    <div className="chat-page-wrapper">
      <div className="chat-container">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="bot-avatar">
              <Shield size={18} strokeWidth={2} />
            </div>
            <div className="chat-header-info">
              <h2>ElectionIQ</h2>
              <div className="online-badge">
                <span className={`online-dot ${loading ? 'thinking' : ''}`} />
                {loading ? 'Thinking…' : 'AI-powered · Always available'}
              </div>
            </div>
          </div>

          <div className="header-controls">
            <label htmlFor="chat-language" className="sr-only">Language</label>
            <select
              id="chat-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-select"
            >
              <option value="English">🌐 EN</option>
              <option value="Hindi">🇮🇳 हिंदी</option>
              <option value="Spanish">🇪🇸 ES</option>
              <option value="French">🇫🇷 FR</option>
            </select>
            <button onClick={clearChat} className="clear-chat-btn" title="Clear conversation">
              Clear
            </button>
          </div>
        </div>

        {/* ── Error / Retry Banner ───────────────────────────── */}
        <AnimatePresence>
          {errorBanner && (
            <motion.div
              className="chat-error"
              role="alert"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <span>{errorBanner}</span>
              {lastFailedQuery && (
                <button className="retry-btn" onClick={retryLast}>
                  ↻ Retry
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Messages ──────────────────────────────────────── */}
        <div
          className="messages-container"
          aria-live="polite"
          aria-label="Conversation history"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className={`message ${msg.role}`}
              >
                {msg.role === 'bot' && (
                  <div className="msg-avatar bot-msg-avatar">
                    <Shield size={14} strokeWidth={2} />
                  </div>
                )}

                <div className="message-content">
                  <div className="message-body">
                    {renderMarkdown(msg.text)}
                  </div>
                  <span className="timestamp">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div className="msg-avatar user-msg-avatar">You</div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="message bot"
            >
              <div className="msg-avatar bot-msg-avatar">
                <Shield size={14} strokeWidth={2} />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Quick actions ──────────────────────────────────── */}
        <div className="quick-actions" aria-label="Suggested questions">
          <span className="quick-actions-label">Quick questions</span>
          {QUICK_ACTIONS.map((action) => {
            const ActionIcon = action.Icon;
            return (
              <button
                key={action.label}
                onClick={() => sendMessage(action.query)}
                className="action-btn"
                disabled={loading}
                aria-label={`Ask: ${action.query}`}
              >
                <ActionIcon size={14} strokeWidth={1.8} />
                {action.label}
              </button>
            );
          })}
        </div>

        {/* ── Input bar ─────────────────────────────────────── */}
        <div className="chat-input-area">
          {/* File preview strip */}
          <AnimatePresence>
            {attachedFiles.length > 0 && (
              <motion.div
                className="file-preview-strip"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                {attachedFiles.map((file, idx) => {
                  const FileIcon = getFilePreviewIcon(file);
                  return (
                    <div key={idx} className="file-preview-chip">
                      <FileIcon size={14} strokeWidth={1.8} />
                      <span className="file-preview-name">{file.name}</span>
                      <span className="file-preview-size">
                        {(file.size / 1024).toFixed(0)}KB
                      </span>
                      <button
                        className="file-remove-btn"
                        onClick={() => removeFile(idx)}
                        aria-label={`Remove ${file.name}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`input-group ${isListening ? 'listening' : ''}`}>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.txt,.csv,.doc,.docx"
              onChange={handleFileSelect}
              className="file-input-hidden"
              aria-hidden="true"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="attach-btn"
              title="Attach files (images, PDF, TXT — max 5MB)"
              aria-label="Attach files"
              disabled={loading || attachedFiles.length >= 3}
            >
              <Paperclip size={17} strokeWidth={1.8} />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? '🎙️ Listening…' : 'Ask about elections…'}
              className="chat-input"
              disabled={loading}
              aria-label="Type your question"
              maxLength={500}
            />
            <button
              onClick={startVoiceInput}
              className={`voice-btn ${isListening ? 'voice-btn--active' : ''}`}
              title="Voice input"
              aria-label="Start voice input"
            >
              <Mic size={17} strokeWidth={1.8} />
            </button>
            <button
              onClick={() => sendMessage()}
              className="send-btn"
              disabled={loading || (!input.trim() && !attachedFiles.length)}
              aria-label="Send message"
            >
              {loading
                ? <span className="send-spinner" />
                : <Send size={17} strokeWidth={1.8} />
              }
            </button>
          </div>
          <p className="input-hint">Press Enter to send · 📎 Attach images, PDFs, or text files (max 3)</p>
        </div>
      </div>
    </div>
  );
}

export default Chat;
