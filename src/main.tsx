import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';
import { registerServiceWorker } from './utils/pwaServiceWorker.ts';

// Register PWA Service Worker for offline capabilities & Push Notifications
registerServiceWorker();

// Suppress harmless Vite HMR WebSocket disconnection errors in sandboxed containers
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason &&
    (event.reason.message?.includes('WebSocket') ||
     event.reason?.message?.includes('vite') ||
     String(event.reason).includes('WebSocket'))
  ) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  if (
    event.message?.includes('WebSocket') ||
    event.message?.includes('vite')
  ) {
    event.preventDefault();
  }
});

// Catch malformed URIs before React Router initialization to prevent crashing
try {
  decodeURIComponent(window.location.pathname);
  decodeURIComponent(window.location.search);
} catch (e) {
  console.error("Malformed URI detected, resetting to root path.");
  window.history.replaceState(null, '', '/');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);


