import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import homeIcon from '../assets/house.png';
import headerIcon from '../assets/logo-icon.png';
import '../css/Header.css';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';

export default function Header() {
  const { user } = useAuthStore();
  const { toggleLogin } = useUIStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // ✅ 버튼 클릭 시: 홈으로 이동
  const handleGoToShelter = () => {
    navigate('/', { state: { scroll: 'shelter' } }); // scroll 신호 전달
    setMenuOpen(false);
  };

  // ✅ 이동이 실제로 끝났을 때 실행
  useEffect(() => {
    if (location.pathname === '/' && location.state?.scroll === 'shelter') {
      setTimeout(() => {
        window.scrollTo({
          top: 840, // 원하는 위치
          behavior: 'smooth',
        });
      }, 200); // 렌더 완료 후 실행
    }
  }, [location]);

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
            {user?.role === 'admin' && (
              <button className="admin_button" onClick={() => navigate('/admin')}>
                관리자
              </button>
            )}
            {/* 로그인 */}
            <button className="login_button" onClick={toggleLogin}>
              {user ? `${user.username}님` : '로그인'}
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
          {/* 상단 고정 */}
          <div className="menu_top_actions">
            <button
              onClick={() => {
                navigate('/');
                setMenuOpen(false);
              }}
            >
              <img src={homeIcon} alt="홈" className="home_icon" />
            </button>

            {!user && (
              <button
                onClick={() => {
                  toggleLogin();
                  setMenuOpen(false);
                }}
              >
                로그인
              </button>
            )}

            {user && (
              <>
                <button
                  onClick={() => {
                    navigate('/mypage');
                    setMenuOpen(false);
                  }}
                >
                  마이페이지
                </button>

                <button
                  onClick={async () => {
                    await useAuthStore.getState().logout();
                    alert('로그아웃 되었습니다.');
                    setMenuOpen(false);
                  }}
                >
                  로그아웃
                </button>
              </>
            )}
          </div>

          {/* 구분선: 입양 전 */}
          <div className="menu_section_title">- 입양 전 -</div>

          <button onClick={handleGoToShelter}>보호소</button>

          <button
            onClick={() => {
              if (!user) {
                alert('로그인이 필요한 서비스입니다.');
                return;
              }
              navigate('/recommend');
              setMenuOpen(false);
            }}
          >
            반려동물 추천
          </button>

          {/* 구분선: 입양 후 */}
          <div className="menu_section_title">- 입양 후 -</div>

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
            동물의 비만도 계산기
          </button>
        </nav>
      </div>

      {/* 어두운 배경 (배경 클릭 시 닫기) */}
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
}
