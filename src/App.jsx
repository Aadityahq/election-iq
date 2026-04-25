import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function RouteLoader() {
  return (
    <div className="route-loader" role="status" aria-live="polite">
      <p>Loading page...</p>
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  const isChat = location.pathname === '/chat';

  return (
    <div className="app">
      <Navbar />
      <main className={`main-content${isChat ? ' main-content--chat' : ''}`}>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
