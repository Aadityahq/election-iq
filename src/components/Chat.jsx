import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAIResponse } from '../services/geminiService';
import { saveMessage, getMessages } from '../services/firebase';
import { generateSessionId } from '../utils/helpers';
import { renderMarkdown } from '../utils/markdownRenderer.jsx';
import ChatHeader from './Chat/ChatHeader';
import QuickActions from './Chat/QuickActions';
import ErrorBanner from './Chat/ErrorBanner';
import InputArea from './Chat/InputArea';
import Message from './Chat/Message';
import { getFilePreviewIcon } from './Chat/helpers';
import { Shield } from 'lucide-react';

import '../styles/chat.css';

/* ─────────────────────────────────────────────────────────────────────────
    Chat Component - Refactored for better maintainability
    ───────────────────────────────────────────────────────────────────────── */
function Chat() {
  const [messages, setMessages] = useState([]);
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

  // Initialize with greeting message
  useEffect(() => {
    setMessages([{
      id: 1,
      role: 'bot',
      text: "Hello! I'm **ElectionIQ** 🗳️ — your civic education guide.\n\nAsk me anything about how elections work: voter registration, polling, vote counting, and more!",
      timestamp: new Date(),
    }]);
  }, []);

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

  // Scroll to bottom when messages change
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

   const sendMessage = useCallback(
     async (overrideText) => {
       const messageText = String((overrideText ?? input) || '').replace(/[<>]/g, '').trim();
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
    setMessages([{
      id: 1,
      role: 'bot',
      text: "Hello! I'm **ElectionIQ** 🗳️ — your civic education guide.\n\nAsk me anything about how elections work: voter registration, polling, vote counting, and more!",
      timestamp: new Date(),
    }]);
    setErrorBanner('');
    setLastFailedQuery(null);
  };

  return (
    <div className="chat-page-wrapper">
      <div className="chat-container">
        <ChatHeader 
          language={language} 
          setLanguage={setLanguage} 
          loading={loading} 
          clearChat={clearChat} 
        />
        
        {/* ── Error / Retry Banner ───────────────────────────── */}
        <ErrorBanner 
          errorBanner={errorBanner} 
          lastFailedQuery={lastFailedQuery} 
          retryLast={retryLast} 
        />
        
        {/* ── Messages ──────────────────────────────────────── */}
        <div
          className="messages-container"
          aria-live="polite"
          aria-label="Conversation history"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <Message key={msg.id} msg={msg} />
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
        <QuickActions 
          sendMessage={sendMessage} 
          loading={loading} 
        />

        {/* ── Input bar ─────────────────────────────────────── */}
        <InputArea 
          input={input} 
          setInput={setInput} 
          handleFileSelect={handleFileSelect} 
          fileInputRef={fileInputRef} 
          inputRef={inputRef} 
          startVoiceInput={startVoiceInput} 
          sendMessage={sendMessage} 
          attachedFiles={attachedFiles} 
          removeFile={removeFile} 
          isListening={isListening} 
          loading={loading}
          getFilePreviewIcon={getFilePreviewIcon}
        />
      </div>
    </div>
  );
}

// Language map constant
const LANG_MAP = {
  English: 'en-US',
  Hindi: 'hi-IN',
  Spanish: 'es-ES',
  French: 'fr-FR',
};

export default Chat;