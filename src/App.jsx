import { useRef, useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LoginContainer from './containers/LoginContainer';
import './index.css';
import BrowseAll from './pages/BrowseAll';
import { useUIStore } from './store/useUIStore'; // zustand UI 전역 상태

export default function App() {
  const browseRef = useRef(null);
  const [favorites, setFavorites] = useState([]); // 새로고침 시 초기화 (요구사항)

  const { showLogin, closeLogin } = useUIStore();

  const scrollToBrowse = () => browseRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="app">
      <Header />
      <HeroSection
        onScrollToBrowse={scrollToBrowse}
        onRightTile={() => alert('아직 준비 중입니다!')}
      />

      <div ref={browseRef}>
        <BrowseAll favorites={favorites} setFavorites={setFavorites} />
      </div>

      {showLogin && <LoginContainer onClose={closeLogin} />}
    </div>
  );
}
