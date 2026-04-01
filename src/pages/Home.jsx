import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import EventCard from '../components/EventCard';
import CharityCard from '../components/CharityCard';
import { getEvents, getCharities, joinEvent } from '../api';
import { useLanguage } from '../hooks/useLanguage';
import './Home.css';

const Home = () => {
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [charities, setCharities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, charitiesRes] = await Promise.all([
        getEvents(),
        getCharities()
      ]);
      setEvents(eventsRes.data.events || []);
      setCharities(charitiesRes.data.charities || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleJoin = async (id) => {
    try {
      await joinEvent(id);
      alert(t('eventForm.joinedSuccess'));
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || t('form.error'));
    }
  };

  const allPosts = [
    ...events.map(e => ({ ...e, type: 'event' })),
    ...charities.map(c => ({ ...c, type: 'charity' }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredPosts = allPosts.filter(p => filter === 'all' || p.type === filter);

  return (
    <div className="home-page">
      <Nav />
      <main className="container">
        <section className="discovery-header">
          <div className="header-content">
            <h1>{t('nav.home') || 'Discover'}</h1>
            <p>{t('main.subtitle') || 'Find events and charities near you'}</p>
          </div>
          <div className="filter-tabs">
            <button className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>{t('main.all')}</button>
            <button className={`tab ${filter === 'event' ? 'active' : ''}`} onClick={() => setFilter('event')}>{t('main.events')}</button>
            <button className={`tab ${filter === 'charity' ? 'active' : ''}`} onClick={() => setFilter('charity')}>{t('main.charity')}</button>
          </div>
        </section>

        {loading ? (
          <p className="loading">{t('main.loading')}</p>
        ) : (
          <div className="discovery-grid">
            {filteredPosts.length === 0 ? (
              <p className="no-data">{t('main.noItems')}</p>
            ) : (
              filteredPosts.map(post => (
                post.type === 'event' ? 
                <EventCard key={post._id} event={post} onJoin={handleJoin} /> :
                <CharityCard key={post._id} charity={post} onDonate={() => {}} />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
