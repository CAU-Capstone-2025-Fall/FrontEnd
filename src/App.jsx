import { useRef, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LoginContainer from './containers/LoginContainer';
import './index.css';

import BrowseAll from './pages/BrowseAll';
import TestChat from './pages/TestChat';
import { useUIStore } from './store/useUIStore'; // zustand UI 전역 상태

export default function App() {
  const browseRef = useRef(null);
  const [favorites, setFavorites] = useState([]);
  const { showLogin, closeLogin } = useUIStore();

  const scrollToBrowse = () => browseRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* 메인 페이지 */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <HeroSection
                  onScrollToBrowse={scrollToBrowse}
                  onRightTile={() => alert('아직 준비 중입니다!')}
                />
                <div ref={browseRef}>
                  <BrowseAll favorites={favorites} setFavorites={setFavorites} />
                </div>
              </>
            }
          />

          {/* 테스트 챗봇 페이지 */}
          <Route path="/testchat" element={<TestChat />} />
        </Routes>

        {showLogin && <LoginContainer onClose={closeLogin} />}
      </div>
    </Router>
  );
}
