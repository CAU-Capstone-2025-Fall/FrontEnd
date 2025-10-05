import headerIcon from '../assets/logo-icon.png';
import '../css/Header.css';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';

export default function Header() {
  const { user } = useAuthStore(); // 로그인 여부 확인
  const { toggleLogin } = useUIStore(); // 로그인 모달 열기/닫기

  return (
    <header className="site">
      <div className="site__container">
        <a href="/" className="site__brand">
          <img src={headerIcon} alt="마음잇다 로고" className="site__logo" />
          <div className="site__text">
            <strong>첫인상 공작소</strong>
            <span>보호소 동물 입양/추천</span>
          </div>
        </a>

        {/* 로그인/로그아웃 버튼 */}
        <button className="login_button" onClick={toggleLogin}>
          {user ? `${user}님` : '로그인'}
        </button>
      </div>
    </header>
  );
}
