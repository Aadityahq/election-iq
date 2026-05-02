import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { renderMarkdown } from '../../utils/markdownRenderer.jsx';

function Message({ msg }) {
  return (
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
  );
}

export default Message;