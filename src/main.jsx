import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useAuthStore } from './store/useAuthStore';
import { useFavoriteStore } from './store/useFavoriteStore';

async function bootstrap() {
  useFavoriteStore.getState().wireAuth();
  try {
    await useAuthStore.getState().checkAuth();
  } catch {}

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
bootstrap();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppShell>
      <App />
    </AppShell>
  </React.StrictMode>
);
