import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1 className="header__title">Moja Strona</h1>
      <nav className="header__nav">
        <ul className="header__nav-list">
          <li className="header__nav-item"><a href="/" className="header__nav-link">Strona główna</a></li>
          <li className="header__nav-item"><a href="/o-nas" className="header__nav-link">O nas</a></li>
          <li className="header__nav-item"><a href="/kontakt" className="header__nav-link">Kontakt</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;