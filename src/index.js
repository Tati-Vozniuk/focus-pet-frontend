import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import { initSentry } from './services/sentry';

// Ініціалізувати Sentry ПЕРЕД рендерингом App
initSentry();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
