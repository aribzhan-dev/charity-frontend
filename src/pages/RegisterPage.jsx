import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userRegister } from '../api';
import { useLanguage } from '../hooks/useLanguage';
import { translateError } from '../utils/errorTranslator';
import Nav from '../components/Nav';
import './RegisterPage.css';

const RegisterPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await userRegister(formData);
      alert(t('form.success'));
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(translateError(err.response?.data?.message, t));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Nav />
      <div className="container">
        <div className="card register-card">
          <h2>{t('register.title')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t('register.name')}</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>{t('login.email')}</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="email@example.com"
              />
            </div>
            <div className="form-group">
              <label>{t('login.password')}</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                placeholder="********"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? t('form.sending') : t('register.submit')}
            </button>
          </form>
          <p className="auth-footer">
            {t('register.hasAccount')} <Link to="/login">{t('login.submit')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
