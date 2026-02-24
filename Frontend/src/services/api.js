import axios from 'axios';
import {
    dummyDestinations,
    dummyPackages,
    dummyHotels,
    dummyReviews,
} from '../data/dummyData';

// ── Config ────────────────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Set VITE_USE_DUMMY_DATA=true in .env to always use dummy data.
 * Otherwise, dummy data is used automatically when the backend is unreachable.
 */
const FORCE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

// ── Axios instance ─────────────────────────────────────────────────────────────
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 6000,
    headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT ────────────────────────────────────────────
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('tl_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 ──────────────────────────────────────────
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

// ── Smart fetch helper ─────────────────────────────────────────────────────────
/**
 * Try the backend API first; if it fails (offline/error) fall back to dummy data.
 * @param {Function} apiFn  - () => axios promise
 * @param {*}        dummy  - dummy value to return on failure
 */
async function withFallback(apiFn, dummy) {
    if (FORCE_DUMMY) return dummy;
    try {
        return await apiFn();
    } catch {
        console.warn('[TraveLand] Backend unavailable — using dummy data.');
        return dummy;
    }
}

// ── Auth ───────────────────────────────────────────────────────────────────────
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    upload: (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        return api.post('/auth/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

// ── User ───────────────────────────────────────────────────────────────────────
export const userAPI = {
    getProfile: () => api.get('/users/me'),
    updateProfile: (data) => api.patch('/users/me', data),
    getWishlist: () => api.get('/users/me/wishlist'),
    addToWishlist: (destination_id) => api.post('/users/me/wishlist', { destination_id }),
    removeFromWishlist: (id) => api.delete(`/users/me/wishlist/${id}`),
};

// ── Destinations (with fallback) ───────────────────────────────────────────────
export const destinationAPI = {
    // Destinations page expects: { data: [...], pagination: { total } }
    getAll: (params) =>
        withFallback(
            () => api.get('/destinations', { params }),
            {
                data: dummyDestinations,
                pagination: { total: dummyDestinations.length, page: 1, limit: 9 },
            }
        ),

    // Home page expects: { data: [...] }
    getFeatured: (limit = 6) =>
        withFallback(
            () => api.get('/destinations/featured', { params: { limit } }),
            { data: dummyDestinations.filter(d => d.is_featured).slice(0, limit) }
        ),

    // Detail page expects: { data: { ...destination } }
    getById: (id) =>
        withFallback(
            () => api.get(`/destinations/${id}`),
            { data: dummyDestinations.find(d => d.id === Number(id)) || dummyDestinations[0] }
        ),

    create: (data) => api.post('/destinations', data),
    update: (id, data) => api.put(`/destinations/${id}`, data),
    remove: (id) => api.delete(`/destinations/${id}`),
};

// ── Packages (with fallback) ────────────────────────────────────────────────────
export const packageAPI = {
    // Packages/Home page expects: { data: [...] }
    getAll: (params) =>
        withFallback(
            () => api.get('/packages', { params }),
            { data: dummyPackages, pagination: { total: dummyPackages.length } }
        ),

    // Detail page expects: { data: { ...package } }
    getById: (id) =>
        withFallback(
            () => api.get(`/packages/${id}`),
            { data: dummyPackages.find(p => p.id === Number(id)) || dummyPackages[0] }
        ),

    create: (data) => api.post('/packages', data),
    update: (id, data) => api.put(`/packages/${id}`, data),
    remove: (id) => api.delete(`/packages/${id}`),
};

// ── Bookings ────────────────────────────────────────────────────────────────────
export const bookingAPI = {
    create: (data) => api.post('/bookings', data),
    getMyBookings: (params) => api.get('/bookings/my', { params }),
    getById: (id) => api.get(`/bookings/${id}`),
    cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};

// ── Payments ────────────────────────────────────────────────────────────────────
export const paymentAPI = {
    initiate: (data) => api.post('/payments', data),
    getMyPayments: (params) => api.get('/payments/my', { params }),
    getByBooking: (booking_id) => api.get(`/payments/booking/${booking_id}`),
};

// ── Reviews (with fallback) ─────────────────────────────────────────────────────
export const reviewAPI = {
    create: (data) => api.post('/reviews', data),
    getByDestination: (dest_id, params) =>
        withFallback(
            () => api.get(`/reviews/destination/${dest_id}`, { params }),
            { data: dummyReviews }
        ),
};

// ── Hotels (with fallback) ──────────────────────────────────────────────────────
export const hotelAPI = {
    // Hotels page expects: { data: [...] }
    getAll: (params) =>
        withFallback(
            () => api.get('/hotels', { params }),
            { data: dummyHotels, pagination: { total: dummyHotels.length } }
        ),

    // Detail page expects: { data: { ...hotel } }
    getById: (id) =>
        withFallback(
            () => api.get(`/hotels/${id}`),
            { data: dummyHotels.find(h => h.id === Number(id)) || dummyHotels[0] }
        ),

    create: (data) => api.post('/hotels', data),
    update: (id, data) => api.put(`/hotels/${id}`, data),
    remove: (id) => api.delete(`/hotels/${id}`),
};

// ── Admin ───────────────────────────────────────────────────────────────────────
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getUsers: (params) => api.get('/admin/users', { params }),
    toggleUser: (id, is_active) => api.patch(`/admin/users/${id}/toggle`, { is_active }),
    getAllBookings: (params) => api.get('/admin/bookings', { params }),
    updateBookingStatus: (id, status) => api.patch(`/admin/bookings/${id}/status`, { status }),
    getAllReviews: (params) => api.get('/admin/reviews', { params }),
};

export default api;
