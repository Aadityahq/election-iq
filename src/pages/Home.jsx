import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ClipboardCheck,
  Clock,
  HelpCircle,
  MapPin,
  Sparkles,
  Mic,
  ArrowRight,
  Zap,
  BarChart3,
  Globe,
  Search,
  Shield,
  Users,
  CheckCircle,
} from 'lucide-react';
import CountrySelector from '../components/CountrySelector';
import '../styles/home.css';

/* ── Lightweight card (CSS-only hover, no per-pixel re-renders) */
function SpotlightCard({ children, className = '', ...props }) {
  return (
    <motion.div className={`spotlight-card ${className}`} {...props}>
      {children}
    </motion.div>
  );
}

/* ── Animated counter (Lovable-style) ─────────────────────── */
function AnimatedStat({ value, label, suffix = '' }) {
  return (
    <motion.div
      className="hero-stat-item"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        className="hero-stat-number"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {value}{suffix}
      </motion.span>
      <span className="hero-stat-label">{label}</span>
    </motion.div>
  );
}

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: 'AI Chat Assistant',
      description: 'Get instant answers about elections, registration, and civic processes with AI-powered responses.',
      color: '#2563eb',
      bg: '#eff6ff',
      path: '/chat',
      label: 'Start chatting',
    },
    {
      icon: Clock,
      title: 'Election Timeline',
      description: 'Visual step-by-step breakdown of every election phase from announcement to results.',
      color: '#0891b2',
      bg: '#ecfeff',
      path: '/timeline',
      label: 'View timeline',
    },
    {
      icon: HelpCircle,
      title: 'Interactive Quiz',
      description: 'Test and reinforce your knowledge with smart quizzes and instant explanations.',
      color: '#7c3aed',
      bg: '#f5f3ff',
      path: '/quiz',
      label: 'Take quiz',
    },
    {
      icon: MapPin,
      title: 'Polling Locator',
      description: 'Find your nearest polling station with integrated Maps and one-tap directions.',
      color: '#059669',
      bg: '#ecfdf5',
      path: '/map',
      label: 'Find stations',
    },
    {
      icon: Search,
      title: 'Fact Checker',
      description: 'Verify election claims instantly with AI analysis, key facts, and confidence scores.',
      color: '#dc2626',
      bg: '#fef2f2',
      path: '/fact-checker',
      label: 'Check facts',
    },
    {
      icon: Mic,
      title: 'Voice Input',
      description: 'Ask questions hands-free with speech recognition for better accessibility.',
      color: '#d97706',
      bg: '#fffbeb',
      path: '/chat',
      label: 'Try voice',
    },
  ];

  const stagger = {
    container: {
      hidden: {},
      show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
    },
    item: {
      hidden: { opacity: 0, y: 24 },
      show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } },
    },
  };

  return (
    <div className="home-page">
      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.span
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Zap size={14} />
            AI-Powered Civic Learning
          </motion.span>

          <h1 className="hero-title">
            Understand Elections
            <br />
            <span className="hero-title-gradient">with AI Clarity</span>
          </h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Learn voter registration, election phases, vote counting, and results
            through interactive AI chat, visual timelines, and smart quizzes.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 12px 28px rgba(37,99,235,0.35)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/chat')}
              className="btn btn-primary btn-glow"
            >
              <Sparkles size={16} />
              Start Learning
              <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/quiz')}
              className="btn btn-secondary"
            >
              <HelpCircle size={16} />
              Take Quiz
            </motion.button>
          </motion.div>

          {/* Tech stack pills */}
          <motion.div
            className="hero-tech-stack"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { icon: Zap, label: 'Gemini AI' },
              { icon: Globe, label: 'Maps API' },
              { icon: Shield, label: 'Firebase' },
              { icon: BarChart3, label: 'Real-time' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="tech-pill">
                <Icon size={13} strokeWidth={1.8} />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Chat Preview (Gemini-style) ────────────────────── */}
        <motion.aside
          className="chat-preview"
          initial={{ opacity: 0, x: 40, rotateY: -5 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          aria-label="Chat preview"
        >
          <div className="preview-header">
            <div className="preview-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <p><Shield size={14} strokeWidth={2} /> ElectionIQ</p>
          </div>
          <div className="preview-body">
            <motion.div
              className="bubble bubble-user"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              How do I register to vote?
            </motion.div>
            <motion.div
              className="bubble bubble-bot"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              <strong>To register as a voter in India:</strong>
              <br />1. Check eligibility (18+ Indian citizen)
              <br />2. Submit Form 6 with ID + address proof
              <br />3. Verify your name in the voter list
            </motion.div>
            <motion.div
              className="typing-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              <span></span><span></span><span></span>
            </motion.div>
          </div>
          <div className="preview-footer">
            <div className="preview-input-fake">
              Ask about elections…
            </div>
          </div>
        </motion.aside>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────── */}
      <motion.section
        className="stats-bar"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <AnimatedStat value="6" suffix="+" label="Interactive Tools" />
        <div className="stats-divider" />
        <AnimatedStat value="5" suffix="+" label="Google Services" />
        <div className="stats-divider" />
        <AnimatedStat value="20" suffix="+" label="Quiz Questions" />
        <div className="stats-divider" />
        <AnimatedStat value="5" label="Languages" />
      </motion.section>

      {/* ── Features Grid (Lovable-style spotlight cards) ───── */}
      <section className="features-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-badge">Features</span>
          <h2>Everything you need to learn about elections</h2>
          <p>Built with cutting-edge Google AI and Maps integration for an intuitive learning experience.</p>
        </motion.div>

        <motion.div
          className="features-grid"
          variants={stagger.container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div key={idx} variants={stagger.item}>
                <SpotlightCard
                  className="feature-card feature-card--clickable"
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  onClick={() => navigate(feature.path)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Go to ${feature.title}`}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(feature.path)}
                >
                  <div className="feature-icon" style={{ background: feature.bg, color: feature.color }}>
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <span className="feature-cta" style={{ color: feature.color }}>
                    {feature.label}
                    <ArrowRight size={14} />
                  </span>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── How it Works ─────────────────────────────────────── */}
      <section className="how-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-badge">How It Works</span>
          <h2>Get started in 3 simple steps</h2>
        </motion.div>

        <div className="steps-row">
          {[
            { step: '01', title: 'Ask a Question', desc: 'Type or speak your election-related question to our AI assistant.', icon: Sparkles, color: '#2563eb' },
            { step: '02', title: 'Get AI Insights', desc: 'Receive clear, structured answers with verified election data.', icon: CheckCircle, color: '#059669' },
            { step: '03', title: 'Test & Verify', desc: 'Take quizzes, fact-check claims, and find your polling station.', icon: Shield, color: '#7c3aed' },
          ].map((item, idx) => {
            const StepIcon = item.icon;
            return (
              <motion.div
                key={idx}
                className="step-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12, duration: 0.5 }}
                whileHover={{ y: -4 }}
              >
                <div className="step-number" style={{ color: item.color }}>{item.step}</div>
                <div className="step-icon-wrap" style={{ background: `${item.color}10`, color: item.color }}>
                  <StepIcon size={24} strokeWidth={1.6} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Country Selector ─────────────────────────────────── */}
      <CountrySelector />

      {/* ── CTA ──────────────────────────────────────────────── */}
      <motion.section
        className="cta-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="cta-inner">
          <h2>Ready to Learn About Elections?</h2>
          <p>Choose how you want to get started:</p>
          <div className="cta-buttons">
            {[
              { path: '/chat', label: 'Chat with AI', icon: Sparkles },
              { path: '/timeline', label: 'View Timeline', icon: Clock },
              { path: '/fact-checker', label: 'Fact Check', icon: Search },
              { path: '/map', label: 'Find Polling', icon: MapPin },
            ].map(({ path, label, icon: Icon }) => (
              <motion.button
                key={path}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(path)}
                className="cta-btn"
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{label}</span>
                <ArrowRight size={14} className="cta-arrow" />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;
