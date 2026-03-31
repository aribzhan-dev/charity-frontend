import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminLogin, companyLogin, userLogin } from '../api';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { translateError } from '../utils/errorTranslator';
import Nav from '../components/Nav';
import './LoginPage.css';

const LoginPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState('user'); // 'admin', 'company', 'user'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let response;
      let userRole = role;
      
      if (role === 'admin') {
        response = await adminLogin(credentials);
        // Admin response: { message, token }
        login({ name: 'Admin' }, response.data.token, 'admin');
        navigate('/admin');
      } else if (role === 'company') {
        response = await companyLogin(credentials);
        // Company response: { message, token, company }
        login(response.data.company, response.data.token, 'company');
        navigate('/dashboard');
      } else {
        response = await userLogin(credentials);
        // User response: { message, token, user }
        login(response.data.user, response.data.token, 'user');
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError(translateError(err.response?.data?.message, t));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Nav />
      <div className="container">
        <div className="card login-card">
          <h2>{t('login.title')}</h2>
          
          <div className="role-switcher">
            <button 
              className={`role-btn ${role === 'user' ? 'active' : ''}`}
              onClick={() => setRole('user')}
            >
              {t('login.user')}
            </button>
            <button 
              className={`role-btn ${role === 'company' ? 'active' : ''}`}
              onClick={() => setRole('company')}
            >
              {t('login.company')}
            </button>
            <button 
              className={`role-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >
              {t('login.admin')}
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>{t('login.email')}</label>
              <input 
                type="email" 
                name="email" 
                value={credentials.email} 
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
                value={credentials.password} 
                onChange={handleChange} 
                required 
                placeholder="********"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? t('form.sending') : t('login.submit')}
            </button>
          </form>

          {role === 'user' && (
            <p className="auth-footer">
              {t('login.noAccount')} <Link to="/register">{t('register.submit')}</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
