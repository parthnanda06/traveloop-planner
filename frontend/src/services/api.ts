import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('traveloop_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('traveloop_token');
      localStorage.removeItem('traveloop_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth services
export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: FormData) =>
    api.put('/auth/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteAccount: () => api.delete('/auth/account'),
};

// Trip services
export const tripService = {
  getDashboard: () => api.get('/trips/dashboard'),
  getAll: (params?: { status?: string; search?: string }) => api.get('/trips', { params }),
  getById: (id: string) => api.get(`/trips/${id}`),
  create: (data: FormData) =>
    api.post('/trips', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData | any) =>
    api.put(`/trips/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/trips/${id}`),
  share: (id: string) => api.post(`/trips/${id}/share`),
  getShared: (token: string) => api.get(`/trips/shared/${token}`),

  // Stops
  addStop: (tripId: string, data: any) => api.post(`/trips/${tripId}/stops`, data),
  updateStop: (tripId: string, stopId: string, data: any) =>
    api.put(`/trips/${tripId}/stops/${stopId}`, data),
  deleteStop: (tripId: string, stopId: string) => api.delete(`/trips/${tripId}/stops/${stopId}`),
  reorderStops: (tripId: string, orderedIds: string[]) =>
    api.put(`/trips/${tripId}/stops/reorder`, { orderedIds }),

  // Activities
  addActivity: (tripId: string, stopId: string, data: any) =>
    api.post(`/trips/${tripId}/stops/${stopId}/activities`, data),
  updateActivity: (tripId: string, stopId: string, activityId: string, data: any) =>
    api.put(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`, data),
  deleteActivity: (tripId: string, stopId: string, activityId: string) =>
    api.delete(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`),

  // Packing
  getPackingItems: (tripId: string) => api.get(`/trips/${tripId}/packing`),
  addPackingItem: (tripId: string, data: any) => api.post(`/trips/${tripId}/packing`, data),
  updatePackingItem: (tripId: string, itemId: string, data: any) =>
    api.put(`/trips/${tripId}/packing/${itemId}`, data),
  deletePackingItem: (tripId: string, itemId: string) =>
    api.delete(`/trips/${tripId}/packing/${itemId}`),

  // Notes
  getNotes: (tripId: string) => api.get(`/trips/${tripId}/notes`),
  addNote: (tripId: string, data: any) => api.post(`/trips/${tripId}/notes`, data),
  updateNote: (tripId: string, noteId: string, data: any) =>
    api.put(`/trips/${tripId}/notes/${noteId}`, data),
  deleteNote: (tripId: string, noteId: string) => api.delete(`/trips/${tripId}/notes/${noteId}`),
};

// AI services
export const aiService = {
  generate: (data: {
    destination: string;
    days: number;
    budget: string;
    travelStyle: string;
    interests: string;
  }) => api.post('/ai/generate', data),
  save: (itinerary: any) => api.post('/ai/save', { itinerary }),
};
