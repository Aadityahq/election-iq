import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { factCheckClaim } from '../services/geminiService';
import {
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import '../styles/fact-checker.css';

const EXAMPLE_CLAIMS = [
  'The Indian general election uses Electronic Voting Machines (EVMs).',
  'A candidate needs more than 50% of votes to win a Lok Sabha seat.',
  'The Election Commission of India was established in 1950.',
  'Voters in India can cast their ballot online.',
  'The minimum age to contest for Lok Sabha is 25 years.',
];

function getVerdictInfo(verdict) {
  const map = {
    true: { label: 'True', className: 'verdict-true', Icon: CheckCircle },
    mostly_true: { label: 'Mostly True', className: 'verdict-mostly-true', Icon: CheckCircle },
    partially_true: { label: 'Partially True', className: 'verdict-partial', Icon: AlertTriangle },
    misleading: { label: 'Misleading', className: 'verdict-misleading', Icon: AlertTriangle },
    false: { label: 'False', className: 'verdict-false', Icon: XCircle },
    unverifiable: { label: 'Unverifiable', className: 'verdict-unverifiable', Icon: HelpCircle },
  };
  return map[verdict] || map.unverifiable;
}

function FactChecker() {
  const [claim, setClaim] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);

  async function handleCheck(e) {
    e?.preventDefault();
    const text = claim.trim();
    if (!text || loading) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await factCheckClaim(text);
      setResult(data);
      setHistory((prev) => [{ claim: text, ...data, timestamp: Date.now() }, ...prev].slice(0, 10));
    } catch (err) {
      setError(err.message || 'Failed to fact-check. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleExample(example) {
    setClaim(example);
    inputRef.current?.focus();
  }

  function handleClear() {
    setClaim('');
    setResult(null);
    setError('');
    inputRef.current?.focus();
  }

  const verdictInfo = result ? getVerdictInfo(result.verdict) : null;

  return (
    <div className="fact-checker-page">
      <div className="fc-bg-orb fc-bg-orb-1" aria-hidden="true" />
      <div className="fc-bg-orb fc-bg-orb-2" aria-hidden="true" />

      <motion.div
        className="fc-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="fc-header-badge">AI-Powered Verification</div>
        <h1 className="fc-title">Election Fact Checker</h1>
        <p className="fc-subtitle">
          Enter any election-related claim and our AI will verify it with context and sources.
        </p>
      </motion.div>

      {/* ── Search Form ──────────────────────────────────────────── */}
      <motion.form
        className="fc-form"
        onSubmit={handleCheck}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45 }}
      >
        <div className="fc-input-row">
          <Search size={20} className="fc-search-icon" strokeWidth={1.8} />
          <input
            ref={inputRef}
            id="fact-check-input"
            type="text"
            className="fc-input"
            placeholder="Enter an election-related claim to verify…"
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            disabled={loading}
            autoComplete="off"
          />
          {claim && (
            <button type="button" className="fc-clear-btn" onClick={handleClear} aria-label="Clear">
              ✕
            </button>
          )}
          <motion.button
            type="submit"
            className="fc-submit-btn"
            disabled={!claim.trim() || loading}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {loading ? (
              <span className="fc-spinner" />
            ) : (
              <>
                <Search size={16} strokeWidth={1.8} />
                <span>Verify</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.form>

      {/* ── Example Chips ────────────────────────────────────────── */}
      <motion.div
        className="fc-examples"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <span className="fc-examples-label">Try:</span>
        {EXAMPLE_CLAIMS.map((ex, i) => (
          <button
            key={i}
            className="fc-example-chip"
            onClick={() => handleExample(ex)}
            disabled={loading}
          >
            {ex.length > 50 ? ex.slice(0, 48) + '…' : ex}
          </button>
        ))}
      </motion.div>

      {/* ── Error ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="fc-error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <AlertTriangle size={18} strokeWidth={1.8} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Result Card ──────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            className="fc-loading-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <div className="fc-loading-shimmer" />
            <div className="fc-loading-shimmer short" />
            <div className="fc-loading-shimmer medium" />
          </motion.div>
        )}

        {result && !loading && (
          <motion.div
            key="result"
            className="fc-result-card"
            initial={{ opacity: 0, scale: 0.97, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -14 }}
            transition={{ duration: 0.4 }}
          >
            {/* Verdict badge */}
            <div className={`fc-verdict-badge ${verdictInfo.className}`}>
              {React.createElement(verdictInfo.Icon, { size: 20, strokeWidth: 1.8 })}
              <span>{verdictInfo.label}</span>
            </div>

            {/* Claim */}
            <div className="fc-claim-block">
              <span className="fc-label">Claim</span>
              <p>{result.claim || claim}</p>
            </div>

            {/* Explanation */}
            <div className="fc-explanation-block">
              <span className="fc-label">Analysis</span>
              <p>{result.explanation}</p>
            </div>

            {/* Key facts */}
            {result.keyFacts && result.keyFacts.length > 0 && (
              <div className="fc-keyfacts-block">
                <span className="fc-label">Key Facts</span>
                <ul>
                  {result.keyFacts.map((fact, i) => (
                    <li key={i}>
                      <CheckCircle size={14} strokeWidth={1.8} />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Confidence */}
            {result.confidence && (
              <div className="fc-confidence-block">
                <span className="fc-label">Confidence</span>
                <div className="fc-confidence-bar-wrapper">
                  <motion.div
                    className={`fc-confidence-bar ${verdictInfo.className}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <span className="fc-confidence-pct">{result.confidence}%</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── History ───────────────────────────────────────────────── */}
      {history.length > 0 && (
        <motion.div
          className="fc-history"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="fc-history-title">Recent Checks</h3>
          <div className="fc-history-list">
            {history.map((item, i) => {
              const info = getVerdictInfo(item.verdict);
              return (
                <motion.button
                  key={item.timestamp}
                  className="fc-history-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    setClaim(item.claim);
                    setResult(item);
                    setError('');
                  }}
                >
                  <span className={`fc-history-dot ${info.className}`} />
                  <span className="fc-history-claim">{item.claim}</span>
                  <span className={`fc-history-badge ${info.className}`}>{info.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default FactChecker;
