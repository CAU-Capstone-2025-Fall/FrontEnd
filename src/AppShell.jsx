import { useEffect, useRef } from 'react';
import { useFavoriteStore } from './store/useFavoriteStore';

export default function AppShell({ children }) {
  const wireAuth = useFavoriteStore((s) => s.wireAuth);
  const wiredRef = useRef(false);

  useEffect(() => {
    if (!wiredRef.current) {
      wireAuth(); // ⭐ 딱 한번만 실행됨
      wiredRef.current = true;
    }
  }, []); // ✔ 의존성 없음!

  return children;
}
