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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setShowScrollTop(true);
      else setShowScrollTop(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // "맨 위로" 함수
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBrowse = () => {
    if (!browseRef.current) return;
    const top = browseRef.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: 'smooth' });
  };

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
                  <SideService />
                  {user && <SurveyForm user={user} />}
                </>
              }
            />

            {/* 이미지 편집 테스트 페이지 */}
            <Route path="/imageEdit" element={<ImageEditTest />} />

            {/* 후기 페이지 */}
            <Route path="/reviews" element={<ReviewPage />} />
          </Routes>
        </main>

        {/* 로그인 모달 */}
        {showLogin && <LoginContainer onClose={closeLogin} />}

        {/* 오른쪽 하단 고정 버튼들 */}
        <div className="floating-buttons">
          {/* 맨 위로 버튼 */}
          {showScrollTop && (
            <button onClick={scrollToTop} className="scroll-top-button visible">
              ⬆
            </button>
          )}

          {/* 챗봇 버튼 */}
          <button onClick={toggleChat} className="chatbot-button">
            💬
          </button>
        </div>

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
