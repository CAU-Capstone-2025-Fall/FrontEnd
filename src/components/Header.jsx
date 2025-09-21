import React from 'react';
import headerIcon from '../assets/logo-icon.png';

export default function Header() {
  return (
    <header className="site">
      <div className="site__container">
        <a href="/" className="site__brand">
          <img src={headerIcon} alt="마음잇다 로고" className="site__logo" />
          <div className="site__text">
            <strong>마음잇다</strong>
            <span>보호소 동물 입양/추천</span>
          </div>
        </a>
      </div>
    </header>
  );
}
