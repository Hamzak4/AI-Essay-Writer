// Thin axios wrapper. The JWT is read from localStorage on every request
// so a fresh tab always picks up the current token.

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '', // empty = use the proxy in package.json
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const essayAPI = {
  generate: (data) => api.post('/api/essay/generate', data).then((r) => r.data),
  history: () => api.get('/api/essay/history').then((r) => r.data),
  remove: (id) => api.delete(`/api/essay/${id}`).then((r) => r.data),
};

export const toolsAPI = {
  paraphrase: (data) => api.post('/api/tools/paraphrase', data).then((r) => r.data),
  grammarCheck: (data) => api.post('/api/tools/grammar-check', data).then((r) => r.data),
  summarize: (data) => api.post('/api/tools/summarize', data).then((r) => r.data),
  citation: (data) => api.post('/api/tools/citation', data).then((r) => r.data),
  outline: (data) => api.post('/api/tools/outline', data).then((r) => r.data),
  titleGenerator: (data) => api.post('/api/tools/title-generator', data).then((r) => r.data),
};

export default api;
