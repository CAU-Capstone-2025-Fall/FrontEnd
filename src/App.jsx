import React, { useRef, useState } from 'react';
import HeroSection from './components/HeroSection';
import BrowseAll from './pages/BrowseAll';
import Header from './components/Header';
import './index.css';

export default function App() {
  const browseRef = useRef(null);
  const [favorites, setFavorites] = useState([]); // 새로고침 시 초기화(요구사항)

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
    </div>
  );
}
