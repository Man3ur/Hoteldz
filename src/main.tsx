import { Component, StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import '@fontsource-variable/outfit';
import '@fontsource-variable/fraunces';
import './styles.css';
import App from './App';

declare global {
  interface Window {
    __rihlaBootError?: (msg: unknown) => void;
  }
}

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="empty" style={{ minHeight: '100vh', justifyContent: 'center' }}>
          <p><strong>Oups, une erreur est survenue.</strong></p>
          <p className="muted small">{this.state.error.message}</p>
          <button className="btn" onClick={() => { location.hash = '#/'; location.reload(); }}>Recharger</button>
        </div>
      );
    }
    return this.props.children;
  }
}

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
} catch (e) {
  window.__rihlaBootError?.(e instanceof Error ? e.message : e);
}

if (Capacitor.isNativePlatform()) {
  StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
  if (Capacitor.getPlatform() === 'android') StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});
  SplashScreen.hide().catch(() => {});
}
