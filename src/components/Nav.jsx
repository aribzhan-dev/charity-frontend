import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth.jsx';
import './Nav.css';

const Nav = () => {
  const { locale, setLocale, t } = useLanguage();
  const { isAuthenticated, user, logout, isAdmin, isCompany, isUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">CharityApp</Link>
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              {isAdmin && <Link to="/admin" className="nav-link">{t('nav.admin')}</Link>}
              {isCompany && <Link to="/dashboard" className="nav-link">{t('nav.dashboard')}</Link>}
              {isUser && <span className="nav-user">{user?.name}</span>}
              <button className="nav-link logout-btn" onClick={handleLogout}>
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">{t('nav.login')}</Link>
              <Link to="/register" className="nav-link">{t('nav.register')}</Link>
            </>
          )}
          
          <div className="lang-switcher">
            <button className={`lang-btn ${locale === 'ru' ? 'active' : ''}`} onClick={() => setLocale('ru')}>RU</button>
            <button className={`lang-btn ${locale === 'kz' ? 'active' : ''}`} onClick={() => setLocale('kz')}>KZ</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
