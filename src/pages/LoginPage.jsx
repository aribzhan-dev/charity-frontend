import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../hooks/useAuth.jsx';
import { useLanguage } from '../hooks/useLanguage';
import { translateError } from '../utils/errorTranslator';
import Nav from '../components/Nav';
import './LoginPage.css';

const LoginPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { login: loginAuth } = useAuth();
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
      const response = await login(credentials);
      const { user: userData, token, role } = response.data;

      if (role === 'admin') {
        loginAuth({ name: 'Admin' }, token, 'admin');
        navigate('/admin');
      } else if (role === 'company') {
        loginAuth(userData || response.data.company, token, 'company');
        navigate('/dashboard');
      } else {
        loginAuth(userData || response.data.user, token, 'user');
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError(t('login.invalidCredentials'));
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
                placeholder="••••••••"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? t('login.checking') : t('login.submit')}
            </button>
          </form>

          <p className="auth-footer">
            {t('login.noAccount')} <Link to="/register">{t('register.submit')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
