import React from 'react';
import { motion } from 'framer-motion';

function ErrorBanner({ errorBanner, lastFailedQuery, retryLast }) {
  if (!errorBanner) return null;

  return (
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
  );
}

export default ErrorBanner;