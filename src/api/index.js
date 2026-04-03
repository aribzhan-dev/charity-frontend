import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://charity-backend-ghaj.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials) => {
  return api.post('/auth/login', credentials);
};

export const createCompany = async (data) => {
  return api.post('/admin/company', data);
};

export const getAllCompanies = async (type = '') => {
  const url = type ? `/admin/companies?type=${type}` : '/admin/companies';
  return api.get(url);
};

export const getAllUsers = async () => {
  return api.get('/admin/users');
};

export const getAllRequests = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/admin/requests?${query}`);
};

export const acceptEventRequest = async (id) => {
  return api.patch(`/admin/requests/event/${id}/accept`);
};

export const rejectEventRequest = async (id) => {
  return api.patch(`/admin/requests/event/${id}/reject`);
};

export const acceptCharityRequest = async (id) => {
  return api.patch(`/admin/requests/charity/${id}/accept`);
};

export const rejectCharityRequest = async (id) => {
  return api.patch(`/admin/requests/charity/${id}/reject`);
};



export const submitEventRequest = async (data) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('date', data.date);
  formData.append('location', data.location);
  formData.append('peopleNeeded', Number(data.peopleNeeded));
  formData.append('transferDetails', String(data.transferDetails));
  
  if (data.files && data.files.length > 0) {
    Array.from(data.files).forEach((file) => formData.append('files', file));
  }

  return api.post('/company/requests/event', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const submitCharityRequest = async (data) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('targetAmount', Number(data.targetAmount));
  formData.append('payment_link', data.payment_link);

  if (data.files && data.files.length > 0) {
    Array.from(data.files).forEach((file) => formData.append('files', file));
  }

  return api.post('/company/requests/charity', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getMyRequests = async (status = '') => {
  const url = status ? `/company/requests/my?status=${status}` : '/company/requests/my';
  return api.get(url);
};

export const userRegister = async (data) => {
  return api.post('/user/register', data);
};


export const getUserProfile = async () => {
  return api.get('/user/profile');
};

export const getEvents = async () => {
  return api.get('/user/events');
};

export const joinEvent = async (id) => {
  return api.post(`/user/events/${id}/join`);
};

export const getCharities = async () => {
  return api.get('/user/charities');
};

export const donateToCharity = async (id, amount) => {
  return api.post(`/user/charities/${id}/donate`, { amount });
};

export default api;
