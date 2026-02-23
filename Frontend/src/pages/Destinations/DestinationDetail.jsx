import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdLocationOn, MdStar, MdFlightTakeoff, MdArrowBack } from 'react-icons/md';
import { destinationAPI, reviewAPI, packageAPI } from '../../services/api';
import PackageCard from '../../components/ui/PackageCard';
import StarRating from '../../components/ui/StarRating';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { slideUp, staggerContainer, staggerItem } from '../../animations/variants';

export default function DestinationDetail() {
    const { id } = useParams();
    const [dest, setDest] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            destinationAPI.getById(id),
            reviewAPI.getByDestination(id),
            packageAPI.getAll({ destination_id: id }),
        ]).then(([dRes, rRes, pRes]) => {
            setDest(dRes.data);
            setReviews(rRes.data);
            setPackages(pRes.data);
        }).catch(() => { }).finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="min-h-screen pt-28 px-4 max-w-6xl mx-auto">
            <SkeletonLoader className="h-80 w-full rounded-3xl mb-8" />
            <SkeletonLoader className="h-8 w-1/3 mb-4" />
            <SkeletonLoader className="h-4 w-full mb-2" />
            <SkeletonLoader className="h-4 w-3/4" />
        </div>
    );

    if (!dest) return <div className="min-h-screen flex items-center justify-center text-slate-400">Destination not found.</div>;

    return (
        <div className="min-h-screen pt-24 pb-20">
            {/* Hero image */}
            <div className="relative h-80 md:h-[450px] overflow-hidden">
                {dest.image_url
                    ? <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gradient-to-br from-primary-800 to-dark-900" />
                }
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent" />
                <div className="absolute bottom-8 left-0 right-0 max-w-6xl mx-auto px-4">
                    <Link to="/destinations" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4 text-sm">
                        <MdArrowBack /> Back to destinations
                    </Link>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white">{dest.name}</h1>
                    <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-slate-300"><MdLocationOn className="text-primary-400" />{dest.country}</span>
                        <span className="flex items-center gap-1 text-amber-400"><MdStar /> {Number(dest.avg_rating).toFixed(1)} ({dest.total_reviews} reviews)</span>
                        {dest.category && <span className="badge-blue capitalize">{dest.category}</span>}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2">
                        {dest.description && (
                            <div className="card p-6 mb-8">
                                <h2 className="font-display font-semibold text-xl text-white mb-4">About {dest.name}</h2>
                                <p className="text-slate-400 leading-relaxed">{dest.description}</p>
                            </div>
                        )}

                        {/* Reviews */}
                        <div className="card p-6">
                            <h2 className="font-display font-semibold text-xl text-white mb-6">
                                Traveler Reviews <span className="text-slate-500 font-normal text-base">({reviews.length})</span>
                            </h2>
                            {reviews.length === 0
                                ? <p className="text-slate-400">No reviews yet. Be the first to review!</p>
                                : <div className="space-y-5">
                                    {reviews.map(r => (
                                        <div key={r.id} className="border-b border-white/10 pb-5 last:border-0 last:pb-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-primary-500/30 rounded-full flex items-center justify-center text-primary-300 text-sm font-bold">
                                                        {r.user_name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <span className="text-white font-medium text-sm">{r.user_name}</span>
                                                </div>
                                                <StarRating rating={r.rating} size={14} />
                                            </div>
                                            {r.title && <p className="text-white text-sm font-semibold mb-1">{r.title}</p>}
                                            {r.body && <p className="text-slate-400 text-sm">{r.body}</p>}
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    </div>

                    {/* Packages Sidebar */}
                    <div>
                        <h2 className="font-display font-semibold text-xl text-white mb-4">Available Packages</h2>
                        {packages.length === 0
                            ? <p className="text-slate-400">No packages available.</p>
                            : <div className="space-y-4">
                                {packages.slice(0, 3).map(p => (
                                    <Link key={p.id} to={`/packages/${p.id}`} className="card p-4 flex items-center gap-4 hover:border-primary-500/50 transition-all cursor-pointer block">
                                        <MdFlightTakeoff className="text-2xl text-primary-400 shrink-0" />
                                        <div>
                                            <p className="text-white text-sm font-semibold">{p.title}</p>
                                            <p className="text-accent-400 font-bold">${Number(p.price_per_person).toLocaleString()}<span className="text-slate-500 text-xs font-normal"> /person</span></p>
                                        </div>
                                    </Link>
                                ))}
                                <Link to={`/packages?destination_id=${id}`} className="btn-outline w-full mt-4 block text-center">
                                    View All Packages
                                </Link>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
