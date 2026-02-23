import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdEmail, MdLock, MdFlightTakeoff } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { slideUp, staggerContainer, staggerItem } from '../../animations/variants';

export default function Login() {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(form.email, form.password);
            navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-[var(--bg-main)] dark:bg-hero-gradient">
            <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary-600/10 dark:bg-primary-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-accent-500/10 dark:bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

            <motion.div variants={staggerContainer} animate="animate" initial="initial"
                className="w-full max-w-md glass rounded-3xl p-8 relative z-10">
                <motion.div variants={staggerItem} className="text-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                        <MdFlightTakeoff className="text-2xl" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">Welcome back</h1>
                    <p className="text-[var(--text-muted)] mt-1">Sign in to your TravelLand account</p>
                </motion.div>

                {error && <motion.div {...slideUp} className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">{error}</motion.div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <motion.div variants={staggerItem}>
                        <label className="text-[var(--text-main)] text-sm font-medium block mb-2 opacity-80">Email Address</label>
                        <div className="relative">
                            <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg" />
                            <input type="email" name="email" value={form.email} onChange={handleChange} required
                                placeholder="you@example.com"
                                className="input-field pl-11" />
                        </div>
                    </motion.div>

                    <motion.div variants={staggerItem}>
                        <label className="text-[var(--text-main)] text-sm font-medium block mb-2 opacity-80">Password</label>
                        <div className="relative">
                            <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg" />
                            <input type="password" name="password" value={form.password} onChange={handleChange} required
                                placeholder="••••••••"
                                className="input-field pl-11" />
                        </div>
                    </motion.div>

                    <motion.button variants={staggerItem} type="submit" disabled={loading}
                        className="btn-primary w-full py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
                        {loading ? 'Signing in…' : 'Sign In'}
                    </motion.button>
                </form>

                <motion.p variants={staggerItem} className="text-center text-[var(--text-muted)] text-sm mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-500 hover:text-primary-600 font-semibold transition-colors">Create one</Link>
                </motion.p>
            </motion.div>
        </div>
    );
}
