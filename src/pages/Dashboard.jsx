import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import { useAuth } from '../hooks/useAuth.jsx';
import { useLanguage } from '../hooks/useLanguage';
import { getMyRequests } from '../api';
import CharityForm from '../components/CharityForm';
import EventForm from '../components/EventForm';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getMyRequests();
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="dashboard-page">
      <Nav />
      <main className="container">
        <header className="dashboard-header">
          <div className="welcome-section">
            <h1>{t('dashboard.welcome')} {user?.company_name || user?.name}!</h1>
            <p className="subtitle">{t('main.subtitle')}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? t('dashboard.close') : '+ ' + t('dashboard.createNew')}
          </button>
        </header>

        {showForm && (
          <div className="form-overlay animate-fade-in">
            <div className="form-container">
              {user?.type === 'charity' ? (
                <CharityForm onSuccess={() => { setShowForm(false); fetchRequests(); }} />
              ) : (
                <EventForm onSuccess={() => { setShowForm(false); fetchRequests(); }} />
              )}
            </div>
          </div>
        )}

        <section className="my-posts">
          <h2>{t('dashboard.myPosts')}</h2>
          {loading ? (
            <p>{t('main.loading')}</p>
          ) : (
            <div className="post-list">
              {requests.length === 0 ? (
                <p className="no-data">{t('dashboard.noRequests')}</p>
              ) : (
                requests.map(req => (
                  <div key={req._id} className="post-item card">
                    <div className="post-info">
                      <h3>{req.title}</h3>
                      <div className="post-meta">
                        <span className={`type-badge ${user?.type}`}>{t(`admin.${user?.type}s`)}</span>
                        <span className="post-date">{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`status-badge ${req.status}`}>
                      {t(`dashboard.status.${req.status}`)}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
