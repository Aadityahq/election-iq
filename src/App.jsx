import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import './App.css';

import Home from './pages/Home';
const ChatPage = lazy(() => import('./pages/ChatPage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const FactCheckerPage = lazy(() => import('./pages/FactCheckerPage'));

/* ── Gemini-style skeleton loader ─────────────────────────── */
function RouteLoader() {
  return (
    <div className="route-loader" role="status" aria-live="polite">
      <div className="loader-pulse">
        <div className="loader-dot" />
        <div className="loader-dot" />
        <div className="loader-dot" />
      </div>
      <p className="loader-text">Loading…</p>
    </div>
  );
}

/* ── Page transition wrapper (Gemini-style) ───────────────── */
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

function AnimatedRoutes() {
  const location = useLocation();
  const isChat = location.pathname === '/chat';

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        className={`main-content${isChat ? ' main-content--chat' : ''}`}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Suspense fallback={<RouteLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/fact-checker" element={<FactCheckerPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Suspense>
      </motion.main>
    </AnimatePresence>
  );
}

function AppLayout() {
  return (
    <div className="app">
      {/* Animated dot grid background (Lovable.dev style) */}
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-gradient-blob bg-blob-1" aria-hidden="true" />
      <div className="bg-gradient-blob bg-blob-2" aria-hidden="true" />
      <Navbar />
      <AnimatedRoutes />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
