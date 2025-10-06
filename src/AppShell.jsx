import { useEffect } from 'react';
import { useFavoriteStore } from './store/useFavoriteStore';

export default function AppShell({ children }) {
  const wireAuth = useFavoriteStore((s) => s.wireAuth);
  useEffect(() => {
    wireAuth();
  }, [wireAuth]);
  return children;
}
