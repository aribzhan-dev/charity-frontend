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

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

const AdminPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('companies');
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState({ eventRequests: [], charityRequests: [] });
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalType, setModalType] = useState(null);

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
      alert(t('admin.companyCreated'));
      setNewCompany({ company_name: '', email: '', password: '', type: 'event' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || t('form.error'));
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
      setSelectedRequest(null);
      fetchData();
    } catch (err) {
      alert(t('admin.moderationFailed'));
    }
  };

  const openModal = (req, type) => {
    setSelectedRequest(req);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setModalType(null);
  };

  const isImageFile = (path) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(path);

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

        {loading && <p className="loading">{t('main.loading')}</p>}

        {activeTab === 'companies' && !loading && (
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
                      <td>{c.isActive ? t('admin.active') : t('admin.inactive')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'users' && !loading && (
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

        {activeTab === 'requests' && !loading && (
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
                          <div className="actions">
                            <button className="btn btn-outline btn-sm" onClick={() => openModal(r, 'event')}>{t('admin.view')}</button>
                            {r.status === 'pending' && (
                              <>
                                <button className="btn btn-primary btn-sm" onClick={() => handleModerate(r._id, 'event', 'accept')}>{t('admin.approve')}</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleModerate(r._id, 'event', 'reject')}>{t('admin.reject')}</button>
                              </>
                            )}
                          </div>
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
                          <div className="actions">
                            <button className="btn btn-outline btn-sm" onClick={() => openModal(r, 'charity')}>{t('admin.view')}</button>
                            {r.status === 'pending' && (
                              <>
                                <button className="btn btn-primary btn-sm" onClick={() => handleModerate(r._id, 'charity', 'accept')}>{t('admin.approve')}</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleModerate(r._id, 'charity', 'reject')}>{t('admin.reject')}</button>
                              </>
                            )}
                          </div>
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

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedRequest.title}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-info-grid">
                <div className="modal-field">
                  <span className="modal-label">{t('admin.company')}</span>
                  <span>{selectedRequest.company?.company_name || '—'}</span>
                </div>
                <div className="modal-field">
                  <span className="modal-label">{t('admin.status')}</span>
                  <span className={`status-badge ${selectedRequest.status}`}>{t(`dashboard.status.${selectedRequest.status}`)}</span>
                </div>
                <div className="modal-field">
                  <span className="modal-label">{t('admin.type')}</span>
                  <span className={`type-badge ${modalType}`}>{t(`admin.${modalType}s`)}</span>
                </div>
                {selectedRequest.description && (
                  <div className="modal-field full-width">
                    <span className="modal-label">{t('form.description')}</span>
                    <p className="modal-desc">{selectedRequest.description}</p>
                  </div>
                )}
                {modalType === 'event' && (
                  <>
                    {selectedRequest.date && (
                      <div className="modal-field">
                        <span className="modal-label">{t('eventForm.date')}</span>
                        <span>{new Date(selectedRequest.date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {selectedRequest.location && (
                      <div className="modal-field">
                        <span className="modal-label">{t('eventForm.location')}</span>
                        <span>{selectedRequest.location}</span>
                      </div>
                    )}
                    {selectedRequest.peopleNeeded && (
                      <div className="modal-field">
                        <span className="modal-label">{t('eventForm.maxPeople')}</span>
                        <span>{selectedRequest.peopleNeeded}</span>
                      </div>
                    )}
                    {selectedRequest.transferDetails && (
                      <div className="modal-field full-width">
                        <span className="modal-label">{t('eventForm.transferDetails')}</span>
                        <span>{selectedRequest.transferDetails}</span>
                      </div>
                    )}
                  </>
                )}
                {modalType === 'charity' && (
                  <>
                    {selectedRequest.targetAmount && (
                      <div className="modal-field">
                        <span className="modal-label">{t('main.goal')}</span>
                        <span>{selectedRequest.targetAmount} ₸</span>
                      </div>
                    )}
                    {selectedRequest.collectedAmount !== undefined && (
                      <div className="modal-field">
                        <span className="modal-label">{t('main.raised')}</span>
                        <span>{selectedRequest.collectedAmount} ₸</span>
                      </div>
                    )}
                    {selectedRequest.payment_link && (
                      <div className="modal-field full-width">
                        <span className="modal-label">{t('form.paymentLink')}</span>
                        <a href={selectedRequest.payment_link} target="_blank" rel="noreferrer">{selectedRequest.payment_link}</a>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Files Section */}
              {selectedRequest.files && selectedRequest.files.length > 0 && (
                <div className="modal-files">
                  <h4>{t('form.files')}</h4>
                  <div className="files-grid">
                    {selectedRequest.files.map((file, idx) => {
                      const filePath = file.path || file;
                      const fileUrl = `${BASE_URL}/${filePath}`;
                      return (
                        <div key={idx} className="file-item">
                          {isImageFile(filePath) ? (
                            <a href={fileUrl} target="_blank" rel="noreferrer">
                              <img src={fileUrl} alt={`file-${idx}`} className="file-preview-img" />
                            </a>
                          ) : (
                            <a href={fileUrl} target="_blank" rel="noreferrer" className="file-download-link">
                              📄 {filePath.split('/').pop()}
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedRequest.status === 'pending' && (
                <div className="modal-actions">
                  <button className="btn btn-primary" onClick={() => handleModerate(selectedRequest._id, modalType, 'accept')}>
                    {t('admin.approve')}
                  </button>
                  <button className="btn btn-danger" onClick={() => handleModerate(selectedRequest._id, modalType, 'reject')}>
                    {t('admin.reject')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
