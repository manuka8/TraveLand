import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    MapPin,
    Briefcase,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    Layers
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ReTooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { adminAPI } from '../../services/api';
import { staggerContainer, slideUp } from '../../animations/variants';

const COLORS = ['#2a9df4', '#f97316', '#10b981', '#f43f5e'];

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await adminAPI.getStats();
            if (res.success) {
                setStats(res.data);
            } else {
                setStats(null);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
            setStats(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-[var(--text-muted)]">Loading metrics...</div>;
    if (!stats) return <div className="p-8 text-red-500 font-medium">Error loading dashboard.</div>;

    const counts = stats?.counts || {};
    const revenueTrend = stats?.revenueTrend || [];
    const bookingStatus = stats?.bookingStatus || [];
    const categoryDistribution = stats?.categoryDistribution || [];
    const destinationsCount = counts.destinations || 0;

    const statCards = [
        { title: 'Total Revenue', value: `$${(counts.revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: '+12.5%', isUp: true },
        { title: 'Total Bookings', value: counts.bookings || 0, icon: Calendar, color: 'text-primary-400', bg: 'bg-primary-500/10', trend: '+5.2%', isUp: true },
        { title: 'Active Users', value: counts.users || 0, icon: Users, color: 'text-orange-400', bg: 'bg-orange-500/10', trend: '-2.1%', isUp: false },
        { title: 'Destinations', value: destinationsCount, icon: MapPin, color: 'text-purple-400', bg: 'bg-purple-500/10', trend: '+3', isUp: true },
    ];

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, i) => (
                    <motion.div
                        key={i}
                        variants={slideUp}
                        className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl relative overflow-hidden group hover:border-primary-500/20 transition-all shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${card.bg}`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${card.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                                {card.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {card.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-[var(--text-muted)] text-sm font-medium">{card.title}</p>
                            <h3 className="text-2xl font-bold text-[var(--text-main)] mt-1">{card.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Trend Chart */}
                <motion.div variants={slideUp} className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-3xl shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
                            <TrendingUp className="text-primary-500 w-5 h-5" /> Revenue Analytics
                        </h3>
                        <select className="bg-[var(--bg-main)] border border-[var(--card-border)] rounded-lg px-3 py-1 text-xs text-[var(--text-muted)] focus:outline-none focus:border-primary-500">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueTrend}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2a9df4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2a9df4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-white/10" />
                                <XAxis dataKey="month" stroke="currentColor" className="text-slate-400 dark:text-slate-500" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="currentColor" className="text-slate-400 dark:text-slate-500" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                                <ReTooltip
                                    contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px' }}
                                    itemStyle={{ color: 'var(--text-main)' }}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#2a9df4" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Category Distribution Chart */}
                <motion.div variants={slideUp} className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-3xl shadow-sm">
                    <h3 className="text-lg font-bold text-[var(--text-main)] mb-8 flex items-center gap-2">
                        <Layers className="text-orange-500 dark:text-orange-400 w-5 h-5" /> Popular Categories
                    </h3>
                    <div className="h-80 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="count"
                                >
                                    {categoryDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <ReTooltip
                                    contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Legend Overlay */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <p className="text-2xl font-bold text-[var(--text-main)] leading-tight">{destinationsCount}</p>
                            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Destinations</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {categoryDistribution.slice(0, 4).map((cat, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                <span className="text-xs text-[var(--text-muted)] capitalize">{cat.category}</span>
                                <span className="text-xs text-[var(--text-main)] font-medium ml-auto">{cat.count}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
