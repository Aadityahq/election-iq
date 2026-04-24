import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAIResponse } from '../services/geminiService';
import { saveMessage } from '../services/firebase';
import { generateSessionId } from '../utils/helpers';
import UiIcon from './UiIcon';
import '../styles/chat.css';

function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: 'Hello! I\'m ElectionIQ. I\'m here to help you understand how elections work in simple, easy-to-follow steps. What would you like to learn about?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('English');
  const [sessionId] = useState(() => generateSessionId());
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const cleanedInput = input.replace(/[<>]/g, '').trim();
    if (!cleanedInput) return;

    setError('');

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      text: cleanedInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    await saveMessage(sessionId, cleanedInput, 'user');

    setInput('');
    setLoading(true);

    try {
      const reply = await getAIResponse(cleanedInput, language);
      const botMessage = {
        id: messages.length + 2,
        role: 'bot',
        text: reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      await saveMessage(sessionId, reply, 'bot');
    } catch (err) {
      console.error('Error:', err);
      setError('Could not connect to AI. Please try again.');
      const errorMessage = {
        id: messages.length + 2,
        role: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    setInput(action);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>
          <UiIcon name="chat" size={20} />
          <span>ElectionIQ Chat</span>
        </h2>
        <div className="header-controls">
          <label htmlFor="chat-language" className="sr-only">Preferred language</label>
          <select
            id="chat-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
            aria-label="Select response language"
          >
            <option value="English">English</option>
            <option value="Hindi">हिंदी</option>
            <option value="Spanish">Español</option>
            <option value="French">Français</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="chat-error" role="alert">
          {error}
        </div>
      )}

      <div className="messages-container" aria-live="polite" aria-label="Conversation history">
        {messages.map((msg, idx) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`message ${msg.role}`}
          >
            <div className="message-content">
              <p>{msg.text}</p>
              <span className="timestamp">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="message bot"
          >
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-actions" aria-label="Quick suggested questions">
        <button
          onClick={() => handleQuickAction('How do I register to vote?')}
          className="action-btn"
          aria-label="Quick ask: How do I register to vote"
        >
          <UiIcon name="registration" size={16} />
          <span>Register</span>
        </button>
        <button
          onClick={() => handleQuickAction('What happens on voting day?')}
          className="action-btn"
          aria-label="Quick ask: What happens on voting day"
        >
          <UiIcon name="voting" size={16} />
          <span>Vote</span>
        </button>
        <button
          onClick={() => handleQuickAction('How are votes counted?')}
          className="action-btn"
          aria-label="Quick ask: How are votes counted"
        >
          <UiIcon name="counting" size={16} />
          <span>Counting</span>
        </button>
        <button
          onClick={() => handleQuickAction('Explain the election timeline')}
          className="action-btn"
          aria-label="Quick ask: Explain the election timeline"
        >
          <UiIcon name="timeline" size={16} />
          <span>Timeline</span>
        </button>
      </div>

      <div className="chat-input-area">
        <div className="input-group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about elections..."
            className="chat-input"
            disabled={loading}
            aria-label="Ask a question about elections"
          />
          <button onClick={startVoiceInput} className="voice-btn" title="Voice input" aria-label="Start voice input">
            <UiIcon name="voice" size={18} />
          </button>
          <button
            onClick={sendMessage}
            className="send-btn"
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            {loading ? '...' : <UiIcon name="arrowRight" size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
