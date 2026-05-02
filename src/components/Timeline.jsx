import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { electionPhases } from '../data/quizData';
import {
  Clock,
  ClipboardCheck,
  Users,
  Vote,
  BarChart3,
  Award,
  Shield,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import '../styles/timeline.css';

const PHASE_COLORS = [
  { from: '#2563eb', to: '#3b82f6', glow: 'rgba(37,99,235,0.25)' },
  { from: '#0ea5e9', to: '#38bdf8', glow: 'rgba(14,165,233,0.25)' },
  { from: '#6366f1', to: '#818cf8', glow: 'rgba(99,102,241,0.25)' },
  { from: '#0891b2', to: '#22d3ee', glow: 'rgba(8,145,178,0.25)' },
  { from: '#1d4ed8', to: '#60a5fa', glow: 'rgba(29,78,216,0.25)' },
  { from: '#7c3aed', to: '#a78bfa', glow: 'rgba(124,58,237,0.25)' },
];

const PHASE_ICONS = [ClipboardCheck, Users, Vote, BarChart3, Award, CheckCircle];

const PHASE_DATES = [
  'Jan – Mar 2024',
  'Apr 1–15, 2024',
  'Apr 16 – May 30, 2024',
  'Jun 1–7, 2024',
  'Jun 8–10, 2024',
  'Jun 11 – Jul 31, 2024',
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

function Timeline() {
  const [activePhase, setActivePhase] = useState(null);

  const togglePhase = (id) => {
    setActivePhase((prev) => (prev === id ? null : id));
  };

  return (
    <div className="timeline-page">
      {/* ── Page header ── */}
      <motion.div
        className="timeline-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="timeline-hero-icon">
          <Clock size={26} strokeWidth={1.8} />
        </div>
        <div>
          <h1 className="timeline-title">Election Timeline</h1>
          <p className="timeline-subtitle">
            Every step of the democratic process, explained — from registration to inauguration.
          </p>
        </div>
      </motion.div>

      {/* ── Progress bar ── */}
      <motion.div
        className="timeline-progress-bar"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {electionPhases.map((phase, idx) => {
          const color = PHASE_COLORS[idx % PHASE_COLORS.length];
          return (
            <button
              key={phase.id}
              className={`progress-step ${activePhase === phase.id ? 'active' : ''}`}
              onClick={() => togglePhase(phase.id)}
              style={{ '--step-color': color.from }}
              title={phase.name}
            >
              <span className="progress-dot" />
              <span className="progress-label">{idx + 1}</span>
            </button>
          );
        })}
        <div className="progress-track" />
      </motion.div>

      {/* ── Vertical stepper ── */}
      <motion.div
        className="phases-stepper"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {electionPhases.map((phase, idx) => {
          const color = PHASE_COLORS[idx % PHASE_COLORS.length];
          const isActive = activePhase === phase.id;
          const isLast = idx === electionPhases.length - 1;

          return (
            <motion.div
              key={phase.id}
              className={`stepper-item ${isActive ? 'stepper-item--active' : ''}`}
              variants={itemVariants}
            >
              {/* ── Connector line ── */}
              {!isLast && (
                <div
                  className="stepper-connector"
                  style={{ '--line-color': color.from }}
                />
              )}

              {/* ── Step node ── */}
              <button
                className="stepper-node"
                style={{
                  background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
                  boxShadow: `0 0 ${isActive ? 20 : 12}px ${color.glow}`,
                }}
                onClick={() => togglePhase(phase.id)}
                aria-expanded={isActive}
                aria-label={`Phase ${idx + 1}: ${phase.name}`}
              >
              {React.createElement(PHASE_ICONS[idx % PHASE_ICONS.length], { size: 20, strokeWidth: 1.8 })}
              </button>

              {/* ── Card ── */}
              <div className="stepper-card-wrap">
                <button
                  className={`stepper-card ${isActive ? 'stepper-card--active' : ''}`}
                  onClick={() => togglePhase(phase.id)}
                  style={{ '--card-color': color.from }}
                >
                  {/* Phase number badge */}
                  <span
                    className="phase-badge"
                    style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
                  >
                    Phase {idx + 1}
                  </span>

                  <div className="stepper-card-top">
                    <div className="stepper-card-text">
                      <h3 className="stepper-card-title">{phase.name}</h3>
                      <p className="stepper-card-desc">{phase.description}</p>
                    </div>
                    <div className="stepper-card-meta">
                      <div className="meta-chip meta-chip--duration">
                        <Clock size={13} strokeWidth={2} />
                        {phase.duration}
                      </div>
                      <div className="meta-chip meta-chip--date">
                        {PHASE_DATES[idx]}
                      </div>
                    </div>
                  </div>

                  <div className="stepper-expand-icon" aria-hidden="true">
                    <motion.span
                      animate={{ rotate: isActive ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ display: 'inline-block' }}
                    >
                      ▾
                    </motion.span>
                  </div>
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="stepper-details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        className="stepper-details-inner"
                        style={{ borderColor: color.from }}
                      >
                        <p>{phase.details}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Bottom info cards ── */}
      <motion.div
        className="timeline-info-row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.4 }}
      >
        <div className="info-card">
          <div className="info-card-icon" style={{ background: 'rgba(37,99,235,0.08)', color: '#2563eb' }}>
            <Shield size={20} strokeWidth={1.8} />
          </div>
          <div>
            <h4>Free &amp; Fair</h4>
             <p>India&#39;s Election Commission ensures every vote is counted transparently.</p>
          </div>
        </div>
        <div className="info-card">
          <div className="info-card-icon" style={{ background: 'rgba(22,163,74,0.08)', color: '#16a34a' }}>
            <CheckCircle size={20} strokeWidth={1.8} />
          </div>
          <div>
            <h4>Your Vote Matters</h4>
             <p>Over 900 million eligible voters participate in India&#39;s general elections.</p>
          </div>
        </div>
        <div className="info-card">
          <div className="info-card-icon" style={{ background: 'rgba(217,119,6,0.08)', color: '#d97706' }}>
            <TrendingUp size={20} strokeWidth={1.8} />
          </div>
          <div>
            <h4>Technology-Backed</h4>
            <p>EVMs and VVPAT systems ensure accuracy and auditability of results.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Timeline;
