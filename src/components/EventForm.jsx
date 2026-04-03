import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { submitEventRequest } from '../api';
import { translateError } from '../utils/errorTranslator';
import './CharityForm.css';

const EventForm = ({ onSuccess }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    peopleNeeded: '',
    transferDetails: false,
    files: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      files: [...e.target.files]   
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitEventRequest(formData);
      alert(t('form.success') || 'Request submitted successfully!');
      if (onSuccess) onSuccess();
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        peopleNeeded: '',
        transferDetails: false,
        files: []
      });
    } catch (err) {
      console.error(err);
      alert(translateError(err.response?.data?.message, t));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card form-card">
      <h2>{t('eventForm.title')}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('eventForm.eventTitle')} *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label>{t('eventForm.description')} *</label>
          <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t('eventForm.date')} *</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>{t('eventForm.location')} *</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              name="transferDetails" 
              checked={formData.transferDetails} 
              onChange={handleChange} 
            />
            <span>{t('eventForm.transferDetails')}</span>
          </label>
        </div>

        <div className="form-group">
          <label>{t('eventForm.maxPeople')} *</label>
          <input type="number" name="peopleNeeded" value={formData.peopleNeeded} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>{t('form.files')}</label>
          <input type="file" multiple onChange={handleFileChange} accept="image/*" />
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? t('form.sending') : t('eventForm.submit')}
        </button>
      </form>
    </div>
  );
};

export default EventForm;
