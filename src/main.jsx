import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initFirebaseAnalytics } from './services/firebase';
import './styles/globals.css';

initFirebaseAnalytics();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
