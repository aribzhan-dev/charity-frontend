import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import './CharityCard.css';

const CharityCard = ({ charity }) => {
  const { t } = useLanguage();
  const progress = Math.min(((charity.collectedAmount || 0) / (charity.targetAmount || 1)) * 100, 100);
  const imageUrl = charity.files?.[0] ? `http://localhost:3000/${charity.files[0].path}` : 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500';

  return (
    <div className="card charity-card">
      <div className="charity-img" style={{ backgroundImage: `url(${imageUrl})` }}></div>
      <div className="charity-content">
        <h3>{charity.title}</h3>
        <p className="charity-desc">{charity.description?.substring(0, 100)}...</p>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-labels">
            <span>{t('main.raised')}: {charity.collectedAmount} ₸</span>
            <span>{t('main.goal')}: {charity.targetAmount} ₸</span>
          </div>
        </div>

        <div className="charity-footer">
          <Link to={`/charity/${charity._id}`} className="btn btn-outline w-full">{t('main.more')}</Link>
          <Link to={`/charity/${charity._id}`} className="btn btn-primary w-full">
            {t('main.donate')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CharityCard;
