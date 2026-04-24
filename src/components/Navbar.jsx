import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import UiIcon from './UiIcon';
import '../styles/navbar.css';

function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/chat', label: 'Chat', icon: 'chat' },
    { path: '/timeline', label: 'Timeline', icon: 'timeline' },
    { path: '/quiz', label: 'Quiz', icon: 'quiz' },
    { path: '/map', label: 'Polling', icon: 'map' },
    { path: '/settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <UiIcon name="shield" size={22} className="logo-icon" title="ElectionIQ" />
          <span className="logo-text">ElectionIQ</span>
        </Link>

        <button
          className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <motion.div
              key={link.path}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <UiIcon name={link.icon} size={18} className="nav-icon" />
                <span className="nav-label">{link.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
