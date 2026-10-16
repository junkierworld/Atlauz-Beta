import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import App from './App.tsx';
import './index.css';
import { applyThemeToDocument } from './themes';
import { loadStoredData, STORAGE_KEYS } from './utils/storage';
import { initialSettings } from './data';

// Initialize theme from localStorage BEFORE React renders
// This prevents theme flash on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    try {
      const storedSettings = loadStoredData(STORAGE_KEYS.SETTINGS, initialSettings);
      const themeId = storedSettings?.theme || 'dark';
      const intensityMode = storedSettings?.themeIntensity || 'focus';
      applyThemeToDocument(themeId as any, intensityMode as any);
    } catch (err) {
      console.warn('Theme initialization failed:', err);
    }
  });
} else {
  try {
    const storedSettings = loadStoredData(STORAGE_KEYS.SETTINGS, initialSettings);
    const themeId = storedSettings?.theme || 'dark';
    const intensityMode = storedSettings?.themeIntensity || 'focus';
    applyThemeToDocument(themeId as any, intensityMode as any);
  } catch (err) {
    console.warn('Theme initialization failed:', err);
  }
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  </StrictMode>,
);
