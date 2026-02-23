import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdSearch, MdTune } from 'react-icons/md';
import { packageAPI } from '../../services/api';
import PackageCard from '../../components/ui/PackageCard';
import { CardSkeleton } from '../../components/ui/SkeletonLoader';
import { staggerContainer, slideUp } from '../../animations/variants';

export default function Packages() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [packages, setPackages] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [maxPrice, setMaxPrice] = useState('');

    const destination_id = searchParams.get('destination_id') || '';

    useEffect(() => {
        setLoading(true);
        packageAPI.getAll({ destination_id: destination_id || undefined, max_price: maxPrice || undefined, page, limit: 9 })
            .then(r => { setPackages(r.data); setTotal(r.pagination?.total || 0); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [destination_id, maxPrice, page]);

    return (
        <div className="min-h-screen pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...slideUp} className="text-center mb-12">
                <p className="text-accent-500 dark:text-accent-400 font-semibold mb-2">Handpicked Experiences</p>
                <h1 className="section-title mb-4">Travel <span className="text-gradient">Packages</span></h1>
                <p className="section-subtitle mx-auto">Choose from {total} curated travel packages for every budget</p>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="relative flex-1">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xl" />
                    <input type="text" placeholder="Search packages by destination..."
                        className="input-field pl-11"
                        onChange={e => { const p = new URLSearchParams(); if (e.target.value) p.set('destination_id', e.target.value); setSearchParams(p); }} />
                </div>
                <div className="relative">
                    <MdTune className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input type="number" placeholder="Max price (USD)" value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        className="input-field pl-11 min-w-48" />
                </div>
            </div>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                    ? Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)
                    : packages.length > 0
                        ? packages.map(p => <PackageCard key={p.id} pkg={p} />)
                        : <div className="col-span-3 text-center py-20 text-[var(--text-muted)]">No packages found.</div>
                }
            </motion.div>

            {Math.ceil(total / 9) > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: Math.ceil(total / 9) }).map((_, i) => (
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
