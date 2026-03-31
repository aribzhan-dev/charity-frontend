import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import './EventCard.css';

const EventCard = ({ event, onJoin }) => {
  const { t } = useLanguage();
  const joinedCount = event.attendees?.length || 0;
  const isFull = joinedCount >= event.peopleNeeded;
  const imageUrl = event.files?.[0] ? `http://localhost:3000/${event.files[0].path}` : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500';

  return (
    <div className="card event-card">
      <div className="event-img" style={{ backgroundImage: `url(${imageUrl})` }}>
        <span className="price-tag">{t('main.events') || 'Event'}</span>
      </div>
      <div className="event-content">
        <h3>{event.title}</h3>
        <p className="event-desc">{event.description?.substring(0, 100)}...</p>
        <div className="event-meta">
          <span>📍 {event.location || event.address}</span>
          <span>👥 {joinedCount}/{event.peopleNeeded}</span>
        </div>
        <div className="event-footer">
          <Link to={`/events/${event._id}`} className="btn btn-outline">{t('main.more')}</Link>
          <button 
            className="btn btn-primary" 
            disabled={isFull} 
            onClick={() => onJoin(event._id)}
          >
            {isFull ? t('main.full') : t('main.join')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
