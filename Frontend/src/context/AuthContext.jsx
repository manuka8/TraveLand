import { createContext, useContext, useState, useCallback } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const getStoredUser = () => {
    try {
        const raw = localStorage.getItem('tl_user');
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getStoredUser);
    const [token, setToken] = useState(() => localStorage.getItem('tl_token'));
    const [loading, setLoading] = useState(false);

    const saveAuth = useCallback((userData, jwt) => {
        setUser(userData);
        setToken(jwt);
        localStorage.setItem('tl_user', JSON.stringify(userData));
        localStorage.setItem('tl_token', jwt);
    }, []);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        try {
            const res = await authAPI.login({ email, password });
            saveAuth(res.data.user, res.data.token);
            toast.success(`Welcome back, ${res.data.user.full_name}!`);
            return res.data.user;
        } catch (err) {
            toast.error(err.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [saveAuth]);

    const register = useCallback(async (formData) => {
        setLoading(true);
        try {
            const res = await authAPI.register(formData);
            saveAuth(res.data.user, res.data.token);
            toast.success('Account created successfully!');
            return res.data.user;
        } catch (err) {
            toast.error(err.message || 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [saveAuth]);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('tl_token');
        localStorage.removeItem('tl_user');
        toast.success('Logged out successfully.');
    }, []);

    const isAdmin = user?.role === 'admin';
    const isAuthenticated = !!token && !!user;

    return (
        <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isAdmin, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
    return ctx;
}
