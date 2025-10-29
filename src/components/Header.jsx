import headerIcon from '../assets/logo-icon.png';
import '../css/Header.css';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const { user } = useAuthStore();
  const { toggleLogin } = useUIStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="site">
        <div className="site__container">
          {/* 로고 */}
          <a href="/" className="site__brand">
            <img src={headerIcon} alt="마음잇다 로고" className="site__logo" />
            <div className="site__text">
              <strong>첫인상 공작소</strong>
              <span>보호소 동물 입양/추천</span>
            </div>
          </a>

          <div className="site__actions">
            {/* 로그인 */}
            <button className="login_button" onClick={toggleLogin}>
              {user ? `${user}님` : '로그인'}
            </button>

            <button
              className="menu_button"
              onClick={() => setMenuOpen(true)}
              aria-label="메뉴 열기"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* 오른쪽 사이드 메뉴 */}
      <div className={`side_menu right ${menuOpen ? 'open' : ''}`}>
        <button className="close_button" onClick={() => setMenuOpen(false)}>
          ×
        </button>
        <nav className="menu_nav">
          <button
            onClick={() => {
              navigate('/');
              setMenuOpen(false);
            }}
          >
            홈 
          </button>

          <button
            onClick={() => {
              navigate('/mypage');
              setMenuOpen(false);
            }}
          >
            마이페이지
          </button>
          
          <button
            onClick={() => {
              navigate('/');
              setMenuOpen(false);
            }}
          >
            보호소 
          </button>

          <button
            onClick={() => {
              navigate('/favorites');
              setMenuOpen(false);
            }}
          >
            즐겨찾기 
          </button>

          <button
            onClick={() => {
              navigate('/reviews');
              setMenuOpen(false);
            }}
          >
            후기 
          </button>

          <button
            onClick={() => {
              navigate('/surveyform', { state: { user } });
              setMenuOpen(false);
            }}
          >
            입양 설문조사
          </button>

          <button
            onClick={() => {
              navigate('/agecalculator');
              setMenuOpen(false);
            }}
          >
            사람 나이로 보는 동물 나이 
          </button>

          <button
            onClick={() => {
              navigate('/bmicalculator');
              setMenuOpen(false);
            }}
          >
            동물 비만도 계산기
          </button>

          {user ? (
            <button
              onClick={() => {
                alert('로그아웃 기능 연결 예정');
                setMenuOpen(false);
              }}
            >
              로그아웃
            </button>
          ) : (
            <button
              onClick={() => {
                toggleLogin();
                setMenuOpen(false);
              }}
            >
              로그인
            </button>
          )}
        </nav>
      </div>

      {/* 어두운 배경 (배경 클릭 시 닫기) */}
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
}
