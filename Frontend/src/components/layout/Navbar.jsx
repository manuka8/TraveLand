import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiGrid } from 'react-icons/fi';
import { MdFlightTakeoff } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/destinations', label: 'Destinations' },
    { to: '/packages', label: 'Packages' },
];

export default function Navbar() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => { logout(); navigate('/'); setProfileOpen(false); };

    return (
        <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[var(--card-bg)]/90 backdrop-blur-lg shadow-xl shadow-black/5 dark:shadow-black/30' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group shrink-0">
                        <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg md:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MdFlightTakeoff className="text-white text-base md:text-lg" />
                        </div>
                        <span className="font-display font-bold text-lg md:text-xl text-[var(--text-main)]">Travel<span className="text-gradient">Land</span></span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ to, label }) => (
                            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) =>
                                `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${isActive ? 'text-primary-500 dark:text-primary-400 bg-primary-500/10' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-slate-100 dark:hover:bg-white/10'}`
                            }>{label}</NavLink>
                        ))}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <ThemeToggle />
                        <div className="h-6 w-px bg-[var(--card-border)] mx-1" />
                        {isAuthenticated ? (
                            <div className="relative">
                                <button onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white">
                                        {user?.full_name?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-[var(--text-main)]">{user?.full_name?.split(' ')[0]}</span>
                                </button>
                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                                            className="absolute right-0 top-full mt-2 w-52 glass rounded-2xl shadow-2xl p-2 flex flex-col">
                                            {isAdmin && (
                                                <Link to="/admin" onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm transition-all">
                                                    <FiGrid /> Admin Dashboard
                                                </Link>
                                            )}
                                            <Link to="/dashboard" onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm transition-all">
                                                <FiUser /> My Dashboard
                                            </Link>
                                            <Link to="/profile" onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm transition-all">
                                                <FiSettings /> Profile Settings
                                            </Link>
                                            <hr className="border-[var(--card-border)] my-1" />
                                            <button onClick={handleLogout}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400 text-sm transition-all text-left">
                                                <FiLogOut /> Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                                <Link to="/register" className="btn-primary text-sm py-2">Get Started</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center gap-1 md:hidden">
                        <ThemeToggle />
                        <button className="p-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[var(--card-bg)] backdrop-blur-lg border-t border-[var(--card-border)] overflow-hidden shadow-2xl">
                        <div className="px-4 py-4 flex flex-col gap-2">
                            {navLinks.map(({ to, label }) => (
                                <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)}
                                    className={({ isActive }) => `px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'text-primary-500 dark:text-primary-400 bg-primary-500/10' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                                    {label}
                                </NavLink>
                            ))}
                            <hr className="border-[var(--card-border)] my-2" />
                            {isAuthenticated ? (
                                <>
                                    {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="px-4 py-3 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-xl">Admin Dashboard</Link>}
                                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="px-4 py-3 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-xl">My Dashboard</Link>
                                    <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="px-4 py-3 text-red-500 text-left rounded-xl">Sign Out</button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-ghost !bg-slate-100 dark:!bg-white/5 !text-sm py-3 font-bold">Sign In</Link>
                                    <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary !text-sm py-3 font-bold">Get Started</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
