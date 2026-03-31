import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { submitCharityRequest } from '../api';
import { translateError } from '../utils/errorTranslator';
import './CharityForm.css';

const CharityForm = ({ onSuccess }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    payment_link: '',
    files: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, files: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitCharityRequest(formData);
      alert(t('form.success') || 'Charity request submitted successfully!');
      if (onSuccess) onSuccess();
      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        payment_link: '',
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
      <h2>{t('form.title')}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('form.fullName')} *</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>{t('form.description')} *</label>
          <textarea 
            name="description" 
            rows="4" 
            value={formData.description} 
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>{t('main.goal')} (₸) *</label>
          <input 
            type="number" 
            name="targetAmount" 
            value={formData.targetAmount} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>{t('form.paymentLink')} *</label>
          <input 
            type="url" 
            name="payment_link" 
            value={formData.payment_link} 
            onChange={handleChange} 
            required 
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label>{t('form.files')}</label>
          <input 
            type="file" 
            multiple 
            onChange={handleFileChange} 
            accept="image/*,.pdf"
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-full" 
          disabled={loading}
        >
          {loading ? t('form.sending') : t('form.submit')}
        </button>
      </form>
    </div>
  );
};

export default CharityForm;
