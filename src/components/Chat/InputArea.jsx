import React from 'react';
import { Paperclip, Mic, Send, X } from 'lucide-react';

function InputArea({ 
  input, 
  setInput, 
  handleFileSelect, 
  fileInputRef, 
  inputRef, 
  startVoiceInput, 
  sendMessage, 
  attachedFiles, 
  removeFile, 
  isListening, 
  loading,
  getFilePreviewIcon
}) {
  return (
    <div className="chat-input-area">
      {/* File preview strip */}
      {attachedFiles.length > 0 && (
        <div className="file-preview-strip">
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
        </div>
      )}

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
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
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
          onClick={sendMessage}
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
  );
}

export default InputArea;