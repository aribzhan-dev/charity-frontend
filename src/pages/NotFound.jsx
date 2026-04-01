import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import { useLanguage } from '../hooks/useLanguage';

const NotFound = () => {
  const { t } = useLanguage();
  return (
    <div>
      <Nav />
      <div className="container" style={{ textAlign: 'center', marginTop: '10rem' }}>
        <h1 style={{ fontSize: '4rem', color: '#ccc' }}>404</h1>
        <p>{t('notFound.message')}</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
          {t('notFound.home')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
