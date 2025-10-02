import { useRef, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import RescueDogCounselor from './components/RescueDogCounselor';
import LoginContainer from './containers/LoginContainer';
import './index.css'; // CSS 포함
import BrowseAll from './pages/BrowseAll';
import ImageEditTest from './pages/ImageEditTest';
import { useUIStore } from './store/useUIStore';

export default function App() {
  const browseRef = useRef(null);
  const [favorites, setFavorites] = useState([]);
  const { showLogin, closeLogin, showChat, toggleChat } = useUIStore();

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

          {/* 이미지 편집 테스트 페이지 */}
          <Route path="/imageEdit" element={<ImageEditTest />} />
        </Routes>

        {/* 로그인 모달 */}
        {showLogin && <LoginContainer onClose={closeLogin} />}

        {/* 오른쪽 하단 고정 챗봇 버튼 */}
        <button onClick={toggleChat} className="chatbot-button">
          💬
        </button>

        {/* 챗봇 팝업 */}
        {showChat && (
          <div className="chatbot-popup">
            <RescueDogCounselor />
          </div>
        )}
      </div>
    </Router>
  );
}
