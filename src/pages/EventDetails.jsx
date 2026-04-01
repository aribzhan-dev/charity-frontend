import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../components/Nav';
import { getEvents, joinEvent } from '../api';
import { useLanguage } from '../hooks/useLanguage';
import './Details.css';

const EventDetails = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      const res = await getEvents();
      const found = res.data.events.find(e => e._id === id);
      setEvent(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleJoin = async () => {
    try {
      await joinEvent(id);
      alert(t('eventForm.joinedSuccess'));
      fetchEvent(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || t('eventForm.joinError'));
    }
  };

  if (loading) return <div className="loading">{t('main.loading')}</div>;
  if (!event) return <div className="container"><h1>{t('eventForm.notFound')}</h1></div>;

  const joinedCount = event.attendees?.length || 0;
  const isFull = joinedCount >= event.peopleNeeded;

  return (
    <div className="details-page">
      <Nav />
      <main className="container">
        <div className="details-card card">
          <div className="details-img" style={{ 
            backgroundImage: `url(${event.files?.[0] ? `http://localhost:3000/${event.files[0].path}` : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'})` 
          }}></div>
          <div className="details-body">
            <h1>{event.title}</h1>
            <div className="details-meta">
              <span>📅 {new Date(event.date).toLocaleDateString()}</span>
              <span>📍 {event.location}</span>
              {event.transferDetails && <span className="transfer-badge">🚚 {t('eventForm.transferDetails')}</span>}
            </div>
            <p className="details-desc">{event.description}</p>
            <div className="details-specs">
              <div className="spec">
                <label>{t('admin.company')}</label>
                <p>{event.company?.company_name}</p>
              </div>
              <div className="spec">
                <label>{t('eventForm.maxPeople')}</label>
                <p>{joinedCount} / {event.peopleNeeded}</p>
              </div>
            </div>
            <button 
              className="btn btn-primary w-full btn-lg" 
              onClick={handleJoin}
              disabled={isFull}
            >
              {isFull ? t('eventForm.sessionFull') : t('main.join')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;
