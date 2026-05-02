import React from 'react';
import { Shield } from 'lucide-react';

function ChatHeader({ language, setLanguage, loading, clearChat }) {
  return (
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
  );
}

export default ChatHeader;