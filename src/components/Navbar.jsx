import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  MessageCircle,
  Clock,
  HelpCircle,
  MapPin,
  Search,
  Settings,
  Shield,
} from 'lucide-react';
import '../styles/navbar.css';

const NAV_ICONS = {
  '/': Home,
  '/chat': MessageCircle,
  '/timeline': Clock,
  '/quiz': HelpCircle,
  '/map': MapPin,
  '/fact-checker': Search,
  '/settings': Settings,
};

function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/chat', label: 'Chat' },
    { path: '/timeline', label: 'Timeline' },
    { path: '/quiz', label: 'Quiz' },
    { path: '/map', label: 'Polling' },
    { path: '/fact-checker', label: 'Fact Check' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Shield size={22} className="logo-icon" strokeWidth={2.2} />
          <span className="logo-text">ElectionIQ</span>
        </Link>

        <button
          className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => {
            const Icon = NAV_ICONS[link.path];
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={17} strokeWidth={1.8} className="nav-icon" />
                <span className="nav-label">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
