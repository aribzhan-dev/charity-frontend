import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../components/Nav';
import { getCharities, donateToCharity } from '../api';
import { useLanguage } from '../hooks/useLanguage';
import './Details.css';

const CharityDetails = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [charity, setCharity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState('');

  const fetchCharity = async () => {
    try {
      const res = await getCharities();
      const found = res.data.charities.find(c => c._id === id);
      setCharity(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharity();
  }, [id]);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!donationAmount || donationAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const res = await donateToCharity(id, Number(donationAmount));
      alert(res.data.message);
      // Redirect to payment link
      window.open(res.data.payment_link, '_blank');
      fetchCharity(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing donation');
    }
  };

  if (loading) return <div className="loading">{t('form.sending')}</div>;
  if (!charity) return <div className="container"><h1>{t('eventForm.notFound')}</h1></div>;

  const progress = (charity.collectedAmount / charity.targetAmount) * 100;

  return (
    <div className="details-page">
      <Nav />
      <main className="container">
        <div className="details-card card">
          <div className="details-img" style={{ 
            backgroundImage: `url(${charity.files?.[0] ? `http://localhost:3000/${charity.files[0].path}` : 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800'})` 
          }}></div>
          <div className="details-body">
            <h1>{charity.title}</h1>
            <p className="details-desc">{charity.description}</p>
            
            <div className="progress-section">
              <div className="progress-bar lg">
                <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
              </div>
              <div className="progress-stats">
                <div>
                  <label>{t('main.raised')}</label>
                  <p className="amount">{charity.collectedAmount} ₸</p>
                </div>
                <div>
                  <label>{t('main.goal')}</label>
                  <p className="amount">{charity.targetAmount} ₸</p>
                </div>
              </div>
            </div>

            <div className="details-specs">
              <div className="spec">
                <label>{t('admin.company')}</label>
                <p>{charity.company?.company_name}</p>
              </div>
            </div>

            <form className="donation-form" onSubmit={handleDonate}>
              <div className="form-group">
                <label>{t('form.targetAmount') || t('main.goal')}</label>
                <input 
                  type="number" 
                  value={donationAmount} 
                  onChange={(e) => setDonationAmount(e.target.value)} 
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-full btn-lg">
                {t('main.donate')}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CharityDetails;
