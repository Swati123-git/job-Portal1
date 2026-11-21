import axios from 'axios';

// Base URL - uses VITE_API_BASE_URL if set, or relative '/api' in production (combined server), or localhost:5000/api in development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ─── REQUEST INTERCEPTOR ────────────────────────────────────────────────────
// Automatically attach JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jobsphere_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR ───────────────────────────────────────────────────
// Handle 401 Unauthorized globally (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid - clear storage but don't redirect
      // Let AuthContext handle the UI state
      localStorage.removeItem('jobsphere_token');
    }
    return Promise.reject(error);
  }
);

// ─── AUTH APIs ──────────────────────────────────────────────────────────────
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
};

// ─── JOB APIs ───────────────────────────────────────────────────────────────
export const jobsAPI = {
  getAll: (params = {}) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (jobData) => api.post('/jobs', jobData),
  update: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  delete: (id) => api.delete(`/jobs/${id}`),
};

// ─── APPLICATION APIs ────────────────────────────────────────────────────────
export const applicationsAPI = {
  apply: (jobId, data) => api.post('/applications', { job_id: jobId, ...data }),
  getMyApplications: () => api.get('/applications/my-applications'),
  getJobApplications: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
};

// ─── SAVED JOBS APIs ─────────────────────────────────────────────────────────
export const savedJobsAPI = {
  getAll: () => api.get('/saved-jobs'),
  save: (jobId) => api.post(`/saved-jobs/${jobId}`),
  remove: (jobId) => api.delete(`/saved-jobs/${jobId}`),
};

// ─── COMPANY APIs ────────────────────────────────────────────────────────────
export const companiesAPI = {
  getAll: (params = {}) => api.get('/companies', { params }),
  getById: (id) => api.get(`/companies/${id}`),
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.put(`/companies/${id}`, data),
  delete: (id) => api.delete(`/companies/${id}`),
};

// ─── RESUME ANALYZER API ─────────────────────────────────────────────────────
export const resumeAPI = {
  // analyzeResume accepts a File object from the browser
  analyzeResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/ai/analyze-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // 60 seconds — AI analysis takes time
    });
  },
};

// ─── JOB RECOMMENDATIONS API ───────────────────────────────────────────────────
export const recommendationsAPI = {
  getRecommendations: () => api.get('/ai/job-recommendations'),
};

export default api;
