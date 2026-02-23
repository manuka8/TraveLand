import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdSearch, MdFlightTakeoff, MdLocationOn, MdStar, MdArrowForward } from 'react-icons/md';
import { FiShield, FiClock, FiHeadphones } from 'react-icons/fi';
import { destinationAPI, packageAPI } from '../../services/api';
import { staggerContainer, staggerItem, slideUp, fadeIn } from '../../animations/variants';
import DestinationCard from '../../components/ui/DestinationCard';
import PackageCard from '../../components/ui/PackageCard';
import { CardSkeleton } from '../../components/ui/SkeletonLoader';
import HeroCarousel from '../../components/ui/HeroCarousel';

const stats = [
    { label: 'Happy Travelers', value: '50K+' },
    { label: 'Destinations', value: '120+' },
    { label: 'Travel Packages', value: '300+' },
    { label: 'Years Experience', value: '10+' },
];

const features = [
    { icon: FiShield, title: 'Safe & Secure', desc: 'Verified partners and secure payment processing for every booking.' },
    { icon: FiClock, title: 'Best Price Guarantee', desc: 'Find a lower price? We\'ll match it or refund the difference.' },
    { icon: FiHeadphones, title: '24/7 Support', desc: 'Round-the-clock customer support wherever you are in the world.' },
];

export default function Home() {
    const [destinations, setDestinations] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loadingDest, setLoadingDest] = useState(true);
    const [loadingPkg, setLoadingPkg] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        destinationAPI.getFeatured(6)
            .then(r => setDestinations(r.data))
            .catch(() => { })
            .finally(() => setLoadingDest(false));
        packageAPI.getAll({ limit: 6 })
            .then(r => setPackages(r.data))
            .catch(() => { })
            .finally(() => setLoadingPkg(false));
    }, []);

    return (
        <div className="overflow-x-hidden">
            {/* ── Hero ─────────────────────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex items-center justify-center bg-[var(--bg-main)] dark:bg-[#070c17] overflow-hidden pt-20 transition-colors duration-500">
                <HeroCarousel />

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="mb-4">
                        <span className="badge-blue text-sm px-4 py-1.5">✈ Explore the World</span>
                    </motion.div>
                    <motion.h1 {...slideUp} transition={{ delay: 0.2 }}
                        className="font-display text-5xl md:text-7xl font-bold text-white dark:text-white leading-tight mb-6">
                        Travel Beyond<br />
                        <span className="text-gradient">Your Imagination</span>
                    </motion.h1>
                    <motion.p {...slideUp} transition={{ delay: 0.3 }} className="text-white/90 dark:text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 transition-colors duration-300">
                        Discover breathtaking destinations, curated travel packages, and unforgettable experiences tailored just for you.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div {...slideUp} transition={{ delay: 0.4 }} className="max-w-2xl mx-auto">
                        <div className="glass rounded-2xl p-2 flex gap-2 shadow-2xl shadow-primary-500/5">
                            <div className="flex-1 flex items-center gap-3 px-4">
                                <MdSearch className="text-[var(--text-muted)] text-xl shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search destinations, countries..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && window.location.assign(`/destinations?search=${search}`)}
                                    className="bg-transparent flex-1 text-[var(--text-main)] placeholder-slate-400 dark:placeholder-slate-500 outline-none py-2"
                                />
                            </div>
                            <Link to={`/destinations${search ? `?search=${search}` : ''}`} className="btn-primary rounded-xl shrink-0">
                                Explore Now
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div {...staggerContainer} animate="animate" initial="initial"
                        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                        {stats.map(({ label, value }) => (
                            <motion.div key={label} variants={staggerItem} className="glass rounded-2xl p-4 shadow-sm">
                                <div className="font-display font-bold text-2xl text-gradient">{value}</div>
                                <div className="text-[var(--text-muted)] text-sm mt-1">{label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Featured Destinations ─────────────────────────────────────────────── */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div {...slideUp} viewport={{ once: true }} whileInView="animate" initial="initial"
                    className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
                    <div>
                        <p className="text-primary-500 dark:text-primary-400 font-semibold mb-2">Explore Destinations</p>
                        <h2 className="section-title">Popular <span className="text-gradient">Destinations</span></h2>
                    </div>
                    <Link to="/destinations" className="btn-outline self-start md:self-auto">
                        View All <MdArrowForward />
                    </Link>
                </motion.div>
                <motion.div {...staggerContainer} whileInView="animate" initial="initial" viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loadingDest
                        ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                        : destinations.map(d => <DestinationCard key={d.id} destination={d} />)
                    }
                </motion.div>
            </section>

            {/* ── Travel Packages ───────────────────────────────────────────────────── */}
            <section className="py-24 bg-slate-50 dark:bg-dark-900/50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...slideUp} viewport={{ once: true }} whileInView="animate" initial="initial"
                        className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
                        <div>
                            <p className="text-accent-500 dark:text-accent-400 font-semibold mb-2">Handpicked For You</p>
                            <h2 className="section-title">Our Best <span className="text-gradient">Packages</span></h2>
                        </div>
                        <Link to="/packages" className="btn-outline self-start md:self-auto">View All <MdArrowForward /></Link>
                    </motion.div>
                    <motion.div {...staggerContainer} whileInView="animate" initial="initial" viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loadingPkg
                            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                            : packages.map(p => <PackageCard key={p.id} pkg={p} />)
                        }
                    </motion.div>
                </div>
            </section>

            {/* ── Why Choose Us ─────────────────────────────────────────────────────── */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div {...slideUp} viewport={{ once: true }} whileInView="animate" initial="initial" className="text-center mb-14">
                    <p className="text-primary-500 dark:text-primary-400 font-semibold mb-2">Why TravelLand</p>
                    <h2 className="section-title">Travel Smarter, <span className="text-gradient">Not Harder</span></h2>
                </motion.div>
                <motion.div {...staggerContainer} whileInView="animate" initial="initial" viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map(({ icon: Icon, title, desc }) => (
                        <motion.div key={title} variants={staggerItem} className="card-hover p-8 text-center group">
                            <div className="w-14 h-14 bg-primary-500/10 dark:bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-500/20 dark:group-hover:bg-primary-500/30 transition-all">
                                <Icon className="text-primary-500 dark:text-primary-400 text-2xl" />
                            </div>
                            <h3 className="font-display font-semibold text-xl text-[var(--text-main)] mb-3">{title}</h3>
                            <p className="text-[var(--text-muted)] leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ── CTA ──────────────────────────────────────────────────────────────── */}
            <section className="py-24 bg-gradient-to-r from-primary-50/50 to-slate-100/50 dark:from-primary-900/50 dark:to-dark-950 transition-colors duration-500">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div {...slideUp} viewport={{ once: true }} whileInView="animate" initial="initial">
                        <h2 className="section-title mb-4">Ready to Start Your <span className="text-gradient">Adventure?</span></h2>
                        <p className="section-subtitle mx-auto mb-8">Join over 50,000 travelers who have explored the world with TravelLand.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register" className="btn-primary px-8 py-4 text-base">
                                <MdFlightTakeoff /> Get Started Free
                            </Link>
                            <Link to="/destinations" className="btn-outline px-8 py-4 text-base">
                                Browse Destinations
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
