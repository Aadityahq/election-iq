import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UiIcon from '../components/UiIcon';
import '../styles/home.css';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'registration',
      title: 'Registration',
      description: 'Know eligibility, documents, and deadlines quickly.',
    },
    {
      icon: 'timeline',
      title: 'Election Timeline',
      description: 'Understand every phase from nomination to results.',
    },
    {
      icon: 'quiz',
      title: 'Quiz & Feedback',
      description: 'Test your understanding with explanations per answer.',
    },
    {
      icon: 'map',
      title: 'Polling Finder',
      description: 'Locate nearby polling booths with one-tap directions.',
    },
    {
      icon: 'sparkle',
      title: 'AI Guidance',
      description: 'Get civic topics explained in clear, simple steps.',
    },
    {
      icon: 'voice',
      title: 'Voice Input',
      description: 'Ask questions hands-free for better accessibility.',
    },
  ];

  return (
    <div className="home-page">
      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-3" aria-hidden="true"></div>

      <motion.section
        className="hero-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="hero-content">
          <span className="hero-badge">AI-Powered Civic Learning</span>
          <h1 className="hero-title">ElectionIQ</h1>
          <p className="hero-subtitle">Understand elections in minutes with AI clarity.</p>
          <p className="hero-description">
            Learn registration, voting day, counting, and results using guided chat,
            timeline visuals, and interactive quizzes.
          </p>

          <div className="hero-buttons">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/chat')}
              className="btn btn-primary"
            >
              Start Learning
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/quiz')}
              className="btn btn-secondary"
            >
              Take Quiz
            </motion.button>
          </div>

          <div className="hero-stats">
            <div className="stat-chip">5+ Google Services</div>
            <div className="stat-chip">Realtime Quiz Tracking</div>
            <div className="stat-chip">Voice + Multilingual</div>
          </div>
        </div>

        <motion.aside
          className="chat-preview"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          aria-label="Chat preview"
        >
          <div className="preview-header">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
            <p>ElectionIQ Assistant</p>
          </div>
          <div className="preview-body">
            <div className="bubble bubble-user">How do I register to vote?</div>
            <div className="bubble bubble-bot">1. Check eligibility<br />2. Submit ID + address proof<br />3. Verify in voter list</div>
            <div className="typing-row">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </motion.aside>
      </motion.section>

      <motion.section
        className="features-section"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2>Product Features</h2>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="feature-card"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">
                <UiIcon name={feature.icon} size={22} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="cta-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>Ready to Learn About Elections?</h2>
        <p>Choose how you want to get started:</p>
        <div className="cta-buttons">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/chat')}
            className="cta-btn"
          >
            <UiIcon name="chat" size={18} />
            <span>Chat with AI</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/timeline')}
            className="cta-btn"
          >
            <UiIcon name="timeline" size={18} />
            <span>View Timeline</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/map')}
            className="cta-btn"
          >
            <UiIcon name="map" size={18} />
            <span>Find Polling</span>
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;
