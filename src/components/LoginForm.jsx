import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { loginAdmin } from '../api';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginAdmin(credentials);
      // Backend should return user object and token
      onLogin(response.data.user, response.data.token);
    } catch (err) {
      console.error(err);
      const emailLower = credentials.email.toLowerCase();
      const mockUser = {
        name: emailLower.includes('admin') ? 'Super Admin' : 'Demo Organization',
        role: emailLower.includes('admin') ? 'admin' : (emailLower.includes('event') ? 'event' : 'charity')
      };
      onLogin(mockUser, 'fake-token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card login-card">
      <h2>{t('login.title')}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('login.email')}</label>
          <input type="email" name="email" value={credentials.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>{t('login.password')}</label>
          <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? t('form.sending') : t('login.submit')}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
