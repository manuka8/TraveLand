import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdSearch, MdFilterList } from 'react-icons/md';
import { destinationAPI } from '../../services/api';
import DestinationCard from '../../components/ui/DestinationCard';
import { CardSkeleton } from '../../components/ui/SkeletonLoader';
import { staggerContainer, staggerItem, slideUp } from '../../animations/variants';

const CATEGORIES = ['', 'beach', 'mountain', 'city', 'nature', 'adventure', 'cultural'];

export default function Destinations() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [destinations, setDestinations] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    useEffect(() => {
        setLoading(true);
        setPage(1);
    }, [search, category]);

    useEffect(() => {
        setLoading(true);
        console.log('Fetching destinations with:', { search, category, page });
        destinationAPI.getAll({ search, category, page, limit: 9 })
            .then(r => {
                console.log('Destinations API response:', r);
                setDestinations(r.data);
                setTotal(r.pagination?.total || 0);
            })
            .catch((err) => { console.error('Destinations fetch error:', err); })
            .finally(() => setLoading(false));
    }, [search, category, page]);

    const totalPages = Math.ceil(total / 9);


    return (
        <div className="min-h-screen pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div {...slideUp} className="text-center mb-12">
                <p className="text-primary-500 dark:text-primary-400 font-semibold mb-2">Explore the World</p>
                <h1 className="section-title mb-4">Discover <span className="text-gradient">Destinations</span></h1>
                <p className="section-subtitle mx-auto">Browse {total} breathtaking destinations across the globe</p>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="relative flex-1">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xl" />
                    <input type="text" placeholder="Search destinations..." defaultValue={search}
                        onKeyDown={e => { if (e.key === 'Enter') { const p = new URLSearchParams(searchParams); p.set('search', e.target.value); setSearchParams(p); } }}
                        className="input-field pl-11" />
                </div>
                <div className="relative">
                    <MdFilterList className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <select value={category}
                        onChange={e => { const p = new URLSearchParams(searchParams); e.target.value ? p.set('category', e.target.value) : p.delete('category'); setSearchParams(p); }}
                        className="input-field pl-11 pr-8 min-w-48 appearance-none cursor-pointer">
                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-[var(--card-bg)] text-[var(--text-main)] capitalize">{c || 'All Categories'}</option>)}
                    </select>
                </div>
            </div>

            {/* Grid */}
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading

                    ? Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)
                    : destinations.length > 0
                        ? destinations.map(d => <DestinationCard key={d.id} destination={d} />)
                        : <div className="col-span-3 text-center py-20 text-[var(--text-muted)]">No destinations found.</div>
                }
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button key={i} onClick={() => setPage(i + 1)}
                            className={`w-10 h-10 rounded-xl font-semibold transition-all ${page === i + 1 ? 'bg-primary-500 text-white shadow-lg' : 'glass text-[var(--text-muted)] hover:border-primary-500/50'}`}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
