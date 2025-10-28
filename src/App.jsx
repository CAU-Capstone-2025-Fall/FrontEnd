import { useRef, useState, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import RescueDogCounselor from './components/RescueDogCounselor';
import LoginContainer from './containers/LoginContainer';
import './index.css';
import BrowseAll from './pages/BrowseAll';
import ReviewPage from './pages/ReviewPage';
import ImageEditTest from './pages/ImageEditTest';
import SideService from './pages/SideService';
import SurveyForm from './components/SurveyForm';
import { useUIStore } from './store/useUIStore';

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const browseRef = useRef(null);
  const [favorites, setFavorites] = useState([]);
  const { showLogin, closeLogin, showChat, toggleChat } = useUIStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  const user = useAuthStore((s) => s.user);

  const scrollToBrowse = () =>
    browseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            {/* 메인 페이지 */}
            <Route
              path="/"
              element={
                <>
                  <HeroSection
                    onScrollToBrowse={scrollToBrowse}
                    onRightTile={() => alert('아직 준비 중입니다!')}
                  />
                  <div ref={browseRef} style={{ scrollMarginTop: '80px' }}>
                    <BrowseAll favorites={favorites} setFavorites={setFavorites} />
                  </div>
                </>
              }
            />

            {/* 이미지 편집 테스트 페이지 */}
            <Route path="/imageEdit" element={<ImageEditTest />} />

            {/* 후기 페이지 */}
            <Route path="/reviews" element={<ReviewPage />} />

            {/* 기타 기능 페이지 */}
            <Route path="/sideservice" element={<SideService />} />
          </Routes>
        </main>

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
