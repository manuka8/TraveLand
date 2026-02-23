import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT ──────────────────────────────────────────
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('tl_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 ────────────────────────────────────────
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('tl_token');
            localStorage.removeItem('tl_user');
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || { message: 'Network error' });
    }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    upload: (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        return api.post('/auth/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
};

// ── User ──────────────────────────────────────────────────────────────────────
export const userAPI = {
    getProfile: () => api.get('/users/me'),
    updateProfile: (data) => api.patch('/users/me', data),
    getWishlist: () => api.get('/users/me/wishlist'),
    addToWishlist: (destination_id) => api.post('/users/me/wishlist', { destination_id }),
    removeFromWishlist: (id) => api.delete(`/users/me/wishlist/${id}`),
};

// ── Destinations ──────────────────────────────────────────────────────────────
export const destinationAPI = {
    getAll: (params) => api.get('/destinations', { params }),
    getFeatured: (limit = 6) => api.get('/destinations/featured', { params: { limit } }),
    getById: (id) => api.get(`/destinations/${id}`),
    create: (data) => api.post('/destinations', data),
    update: (id, data) => api.put(`/destinations/${id}`, data),
    remove: (id) => api.delete(`/destinations/${id}`),
};

// ── Packages ──────────────────────────────────────────────────────────────────
export const packageAPI = {
    getAll: (params) => api.get('/packages', { params }),
    getById: (id) => api.get(`/packages/${id}`),
    create: (data) => api.post('/packages', data),
    update: (id, data) => api.put(`/packages/${id}`, data),
    remove: (id) => api.delete(`/packages/${id}`),
};

// ── Bookings ──────────────────────────────────────────────────────────────────
export const bookingAPI = {
    create: (data) => api.post('/bookings', data),
    getMyBookings: (params) => api.get('/bookings/my', { params }),
    getById: (id) => api.get(`/bookings/${id}`),
    cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};

// ── Payments ──────────────────────────────────────────────────────────────────
export const paymentAPI = {
    initiate: (data) => api.post('/payments', data),
    getMyPayments: (params) => api.get('/payments/my', { params }),
    getByBooking: (booking_id) => api.get(`/payments/booking/${booking_id}`),
};

// ── Reviews ───────────────────────────────────────────────────────────────────
export const reviewAPI = {
    create: (data) => api.post('/reviews', data),
    getByDestination: (dest_id, params) => api.get(`/reviews/destination/${dest_id}`, { params }),
};

// ── Hotels (New) ──────────────────────────────────────────────────────────────
export const hotelAPI = {
    getAll: (params) => api.get('/hotels', { params }),
    getById: (id) => api.get(`/hotels/${id}`),
    create: (data) => api.post('/hotels', data),
    update: (id, data) => api.put(`/hotels/${id}`, data),
    remove: (id) => api.delete(`/hotels/${id}`),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getUsers: (params) => api.get('/admin/users', { params }),
    toggleUser: (id, is_active) => api.patch(`/admin/users/${id}/toggle`, { is_active }),
    getAllBookings: (params) => api.get('/admin/bookings', { params }),
    updateBookingStatus: (id, status) => api.patch(`/admin/bookings/${id}/status`, { status }),
    getAllReviews: (params) => api.get('/admin/reviews', { params }),
};

export default api;
