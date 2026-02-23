import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export default function AdminLayout() {
    const { user, isAuthenticated } = useAuth();

    // Guard: Admin only
    if (!isAuthenticated || user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-[var(--bg-main)] flex transition-colors duration-300">
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Main Content Scrollable Area */}
            <main className="ml-64 flex-1 h-screen overflow-y-auto custom-scrollbar">
                <header className="h-20 bg-[var(--bg-main)]/50 backdrop-blur-md border-b border-[var(--card-border)] flex items-center justify-between px-8 sticky top-0 z-40">
                    <div>
                        <h2 className="text-xl font-semibold text-[var(--text-main)]">System Control</h2>
                        <p className="text-xs text-[var(--text-muted)]">Welcome back, {user.full_name}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Profile mini */}
                        <div className="flex items-center gap-3 bg-primary-500/5 dark:bg-white/5 px-3 py-1.5 rounded-full border border-primary-500/10 dark:border-white/10">
                            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold ring-2 ring-primary-500/30">
                                {user.full_name.charAt(0)}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-xs font-medium text-[var(--text-main)]">{user.full_name}</p>
                                <p className="text-[10px] text-primary-500 dark:text-primary-400 capitalize font-bold">{user.role}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Outlet />
                    </motion.div>
                </section>
            </main>
        </div>
    );
}
