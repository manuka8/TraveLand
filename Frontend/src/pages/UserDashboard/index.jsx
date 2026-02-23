import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdFlight, MdFavorite, MdPayment, MdCancel, MdCheck, MdHourglassEmpty } from 'react-icons/md';
import { bookingAPI, userAPI, paymentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/ui/StarRating';
import { staggerContainer, staggerItem, slideUp } from '../../animations/variants';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const STATUS_ICONS = {
    pending: <MdHourglassEmpty className="text-amber-400" />,
    confirmed: <MdCheck className="text-emerald-400" />,
    cancelled: <MdCancel className="text-red-400" />,
    completed: <MdCheck className="text-primary-400" />,
};
const STATUS_CLASSES = {
    pending: 'badge-orange', confirmed: 'badge-green', cancelled: 'badge-red', completed: 'badge-blue',
};

function TabButton({ active, onClick, children }) {
    return (
        <button onClick={onClick}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${active ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-primary-500/10 dark:hover:bg-white/10'}`}>
            {children}
        </button>
    );
}

export default function UserDashboard() {
    const { user } = useAuth();
    const [tab, setTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchers = {
            bookings: () => bookingAPI.getMyBookings().then(r => setBookings(r.data)),
            wishlist: () => userAPI.getWishlist().then(r => setWishlist(r.data)),
            payments: () => paymentAPI.getMyPayments().then(r => setPayments(r.data)),
        };
        fetchers[tab]?.().catch(() => { }).finally(() => setLoading(false));
    }, [tab]);

    const cancelBooking = async (id) => {
        try {
            await bookingAPI.cancel(id);
            toast.success('Booking cancelled.');
            setBookings(b => b.map(x => x.id === id ? { ...x, status: 'cancelled' } : x));
        } catch { toast.error('Failed to cancel.'); }
    };

    const removeWishlist = async (dest_id) => {
        try {
            await userAPI.removeFromWishlist(dest_id);
            setWishlist(w => w.filter(d => d.id !== dest_id));
            toast.success('Removed from wishlist.');
        } catch { }
    };

    return (
        <div className="min-h-screen pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div {...slideUp} className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="section-title">My <span className="text-gradient">Dashboard</span></h1>
                    <p className="text-[var(--text-muted)] mt-1">Welcome back, {user?.full_name}!</p>
                </div>
                <div className="flex gap-2">
                    <TabButton active={tab === 'bookings'} onClick={() => setTab('bookings')}><MdFlight className="inline mr-1" />Bookings</TabButton>
                    <TabButton active={tab === 'wishlist'} onClick={() => setTab('wishlist')}><MdFavorite className="inline mr-1" />Wishlist</TabButton>
                    <TabButton active={tab === 'payments'} onClick={() => setTab('payments')}><MdPayment className="inline mr-1" />Payments</TabButton>
                </div>
            </motion.div>

            {/* Bookings Tab */}
            {tab === 'bookings' && (
                <motion.div {...staggerContainer} animate="animate" initial="initial" className="space-y-4">
                    {loading ? <div className="text-[var(--text-muted)]">Loading…</div>
                        : bookings.length === 0 ? <div className="card p-12 text-center text-[var(--text-muted)]">No bookings yet. <Link to="/packages" className="text-primary-500 dark:text-primary-400">Browse packages →</Link></div>
                            : bookings.map(b => (
                                <motion.div key={b.id} variants={staggerItem} className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary-500/10 dark:bg-primary-500/20 rounded-xl flex items-center justify-center text-2xl">{STATUS_ICONS[b.status]}</div>
                                        <div>
                                            <p className="font-semibold text-[var(--text-main)]">{b.package_title}</p>
                                            <p className="text-[var(--text-muted)] text-sm">{b.destination_name}, {b.country || ''} • {b.travel_date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={STATUS_CLASSES[b.status] + ' capitalize'}>{b.status}</span>
                                        <span className="text-accent-500 dark:text-accent-400 font-bold">${Number(b.total_price).toLocaleString()}</span>
                                        {b.status === 'pending' && (
                                            <button onClick={() => cancelBooking(b.id)} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm border border-red-500/30 rounded-lg px-3 py-1 hover:bg-red-500/5 transition-all">Cancel</button>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                    }
                </motion.div>
            )}

            {/* Wishlist Tab */}
            {tab === 'wishlist' && (
                <motion.div {...staggerContainer} animate="animate" initial="initial"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {loading ? <div className="text-[var(--text-muted)]">Loading…</div>
                        : wishlist.length === 0 ? <div className="col-span-3 card p-12 text-center text-[var(--text-muted)]">Your wishlist is empty.</div>
                            : wishlist.map(d => (
                                <motion.div key={d.id} variants={staggerItem} className="card-hover group relative">
                                    {d.image_url && <img src={d.image_url} alt={d.name} className="w-full h-36 object-cover" />}
                                    <div className="p-4">
                                        <p className="font-semibold text-[var(--text-main)]">{d.name}</p>
                                        <p className="text-[var(--text-muted)] text-sm">{d.country}</p>
                                    </div>
                                    <button onClick={() => removeWishlist(d.id)}
                                        className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 rounded-lg flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-all">
                                        ✕
                                    </button>
                                </motion.div>
                            ))
                    }
                </motion.div>
            )}

            {/* Payments Tab */}
            {tab === 'payments' && (
                <motion.div {...staggerContainer} animate="animate" initial="initial" className="space-y-4">
                    {loading ? <div className="text-[var(--text-muted)]">Loading…</div>
                        : payments.length === 0 ? <div className="card p-12 text-center text-[var(--text-muted)]">No payment records.</div>
                            : payments.map(p => (
                                <motion.div key={p.id} variants={staggerItem} className="card p-5 flex items-center justify-between">
                                    <div>
                                        <p className="text-[var(--text-main)] font-semibold">{p.package_title || 'Payment'}</p>
                                        <p className="text-[var(--text-muted)] text-sm">TXN: {p.transaction_id || '—'} • {p.created_at?.slice(0, 10)}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={p.status === 'completed' ? 'badge-green' : p.status === 'failed' ? 'badge-red' : 'badge-orange'}>{p.status}</span>
                                        <span className="text-[var(--text-main)] font-bold">${Number(p.amount).toLocaleString()} <span className="text-[var(--text-muted)] text-xs">{p.currency}</span></span>
                                    </div>
                                </motion.div>
                            ))
                    }
                </motion.div>
            )}
        </div>
    );
}
