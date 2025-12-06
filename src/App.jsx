import { useEffect, useRef, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

import AgeCalculator from './components/AgeCalculator';
import BmiCalculator from './components/BmiCalculator';
import Header from './components/Header';
import HomePage from './components/Home';
import RescueDogCounselor from './components/RescueDogCounselor';
import LoginContainer from './containers/LoginContainer';
import './index.css';
import AdminMainPage from './pages/AdminMainPage';
import AnimalImageEditPage from './pages/AnimalImageEditPage';
import BrowseAll from './pages/BrowseAll';
import Mypage from './pages/Mypage';
import RecommendPage from './pages/RecommendPage';
import Report from './pages/Report';
import ReviewPage from './pages/ReviewPage';
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
  }, []);

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
                  <HomePage />
                </>
              }
            />
            <Route
              path="/browse"
              element={<BrowseAll favorites={favorites} setFavorites={setFavorites} />}
            />
            {/* 이미지 편집 테스트 페이지 */}
            <Route path="/admin" element={<AdminMainPage />} />
            <Route path="/admin/image-edit" element={<AnimalImageEditPage />} />
            {/* 후기 페이지 */}
            <Route path="/reviews" element={<ReviewPage />} />

            {/* 마이페이지 */}
            <Route path="/mypage" element={<Mypage user={user} favorites={favorites} />} />
            <Route path="/recommend" element={<RecommendPage />} />

            {/* 기타 기능 페이지 */}
            <Route path="/agecalculator" element={<AgeCalculator />} />
            <Route path="/bmicalculator" element={<BmiCalculator />} />
            <Route path="/report" element={<Report user={user} />} />
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
