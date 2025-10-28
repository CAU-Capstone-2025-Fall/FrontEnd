import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useAuthStore } from './store/useAuthStore';
import { useFavoriteStore } from './store/useFavoriteStore';
import AppShell from './AppShell';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

async function bootstrap() {
  // 전역 스토어 사이드이펙트
  useFavoriteStore.getState().wireAuth();
  try {
    await useAuthStore.getState().checkAuth();
  } catch (e) {
    console.warn('checkAuth failed:', e);
  }
  root.render(
    <React.StrictMode>
      <AppShell>
        <App />
      </AppShell>
    </React.StrictMode>
  );
}

bootstrap();
