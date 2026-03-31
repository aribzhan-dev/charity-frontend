import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import { 
  getAllCompanies, 
  createCompany, 
  getAllUsers, 
  getAllRequests, 
  acceptEventRequest, 
  rejectEventRequest, 
  acceptCharityRequest, 
  rejectCharityRequest 
} from '../api';
import { useLanguage } from '../hooks/useLanguage';
import './AdminPage.css';

const AdminPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('companies');
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState({ eventRequests: [], charityRequests: [] });
  const [loading, setLoading] = useState(false);

  // Company creation form state
  const [showForm, setShowForm] = useState(false);
  const [newCompany, setNewCompany] = useState({
    company_name: '',
    email: '',
    password: '',
    type: 'event'
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'companies') {
        const res = await getAllCompanies();
        setCompanies(res.data.companies || []);
      } else if (activeTab === 'users') {
        const res = await getAllUsers();
        setUsers(res.data.users || []);
      } else if (activeTab === 'requests') {
        const res = await getAllRequests();
        setRequests(res.data || { eventRequests: [], charityRequests: [] });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      await createCompany(newCompany);
      alert('Company created successfully');
      setNewCompany({ company_name: '', email: '', password: '', type: 'event' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating company');
    }
  };

  const handleModerate = async (id, type, action) => {
    try {
      if (type === 'event') {
        if (action === 'accept') await acceptEventRequest(id);
        else await rejectEventRequest(id);
      } else {
        if (action === 'accept') await acceptCharityRequest(id);
        else await rejectCharityRequest(id);
      }
      fetchData();
    } catch (err) {
      alert('Moderation failed');
    }
  };

  return (
    <div className="admin-page">
      <Nav />
      <main className="container">
        <header className="admin-header">
          <h1>{t('admin.title')}</h1>
          <div className="admin-tabs">
            <button className={`tab ${activeTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveTab('companies')}>{t('admin.companies')}</button>
            <button className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>{t('admin.users')}</button>
            <button className={`tab ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>{t('admin.requests')}</button>
          </div>
        </header>

        {activeTab === 'companies' && (
          <section className="admin-section">
            <div className="section-header">
              <h3>{t('admin.companyManagement')}</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
                {showForm ? t('admin.cancel') : '+ ' + t('admin.newCompany')}
              </button>
            </div>

            {showForm && (
              <form className="admin-form card" onSubmit={handleCreateCompany}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>{t('admin.companyName')}</label>
                    <input 
                      type="text" 
                      value={newCompany.company_name} 
                      onChange={(e) => setNewCompany({...newCompany, company_name: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('admin.email')}</label>
                    <input 
                      type="email" 
                      value={newCompany.email} 
                      onChange={(e) => setNewCompany({...newCompany, email: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('admin.password')}</label>
                    <input 
                      type="password" 
                      value={newCompany.password} 
                      onChange={(e) => setNewCompany({...newCompany, password: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('admin.type')}</label>
                    <select 
                      value={newCompany.type} 
                      onChange={(e) => setNewCompany({...newCompany, type: e.target.value})}
                    >
                      <option value="event">{t('admin.events')}</option>
                      <option value="charity">{t('admin.charities')}</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">{t('admin.newCompany')}</button>
              </form>
            )}

            <div className="admin-table card">
              <table>
                <thead>
                  <tr>
                    <th>{t('admin.name')}</th>
                    <th>{t('admin.email')}</th>
                    <th>{t('admin.type')}</th>
                    <th>{t('admin.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map(c => (
                    <tr key={c._id}>
                      <td>{c.company_name}</td>
                      <td>{c.email}</td>
                      <td><span className={`type-badge ${c.type}`}>{t(`admin.${c.type}s`)}</span></td>
                      <td>{c.isActive ? t('admin.status.active') || 'Active' : t('admin.status.inactive') || 'Inactive'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'users' && (
          <section className="admin-section">
            <h3>{t('admin.registeredUsers')}</h3>
            <div className="admin-table card">
              <table>
                <thead>
                  <tr>
                    <th>{t('admin.name')}</th>
                    <th>{t('admin.email')}</th>
                    <th>{t('admin.joined')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'requests' && (
          <section className="admin-section">
            <div className="request-type">
              <h3>{t('admin.events')}</h3>
              <div className="admin-table card">
                <table>
                  <thead>
                    <tr>
                      <th>{t('admin.titleColumn')}</th>
                      <th>{t('admin.company')}</th>
                      <th>{t('admin.status')}</th>
                      <th>{t('admin.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.eventRequests.map(r => (
                      <tr key={r._id}>
                        <td>{r.title}</td>
                        <td>{r.company?.company_name}</td>
                        <td><span className={`status-badge ${r.status}`}>{t(`dashboard.status.${r.status}`)}</span></td>
                        <td>
                          {r.status === 'pending' && (
                            <div className="actions">
                              <button className="btn btn-primary btn-sm" onClick={() => handleModerate(r._id, 'event', 'accept')}>{t('admin.approve')}</button>
                              <button className="btn btn-outline btn-sm" onClick={() => handleModerate(r._id, 'event', 'reject')}>{t('admin.reject')}</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="request-type">
              <h3>{t('admin.charities')}</h3>
              <div className="admin-table card">
                <table>
                  <thead>
                    <tr>
                      <th>{t('admin.titleColumn')}</th>
                      <th>{t('admin.company')}</th>
                      <th>{t('admin.status')}</th>
                      <th>{t('admin.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.charityRequests.map(r => (
                      <tr key={r._id}>
                        <td>{r.title}</td>
                        <td>{r.company?.company_name}</td>
                        <td><span className={`status-badge ${r.status}`}>{t(`dashboard.status.${r.status}`)}</span></td>
                        <td>
                          {r.status === 'pending' && (
                            <div className="actions">
                              <button className="btn btn-primary btn-sm" onClick={() => handleModerate(r._id, 'charity', 'accept')}>{t('admin.approve')}</button>
                              <button className="btn btn-outline btn-sm" onClick={() => handleModerate(r._id, 'charity', 'reject')}>{t('admin.reject')}</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
