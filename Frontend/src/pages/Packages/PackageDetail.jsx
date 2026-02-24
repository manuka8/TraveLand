import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdFlightTakeoff, MdSchedule, MdPeople, MdArrowBack, MdAttachMoney, MdHotel, MdMap, MdLabel } from 'react-icons/md';
import { packageAPI } from '../../services/api';
import { slideUp } from '../../animations/variants';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import MediaGallery from '../../components/ui/MediaGallery';
import { useAuth } from '../../context/AuthContext';

export default function PackageDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        packageAPI.getById(id).then(r => setPkg(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="min-h-screen pt-28 max-w-4xl mx-auto px-4">
            <SkeletonLoader className="h-72 w-full rounded-3xl mb-8" />
            <SkeletonLoader className="h-8 w-1/2 mb-4" />
        </div>
    );

    if (!pkg) return <div className="min-h-screen flex items-center justify-center text-slate-400">Package not found.</div>;

    const itinerary = pkg.itinerary ? JSON.parse(pkg.itinerary) : null;

    const handleBook = () => {
        if (!isAuthenticated) { navigate('/login'); return; }
        navigate(`/booking/${id}`);
    };

    return (
        <div className="min-h-screen pt-24 pb-20">
            {/* Hero */}
            <div className="relative h-72 md:h-[400px] overflow-hidden">
                {(pkg.image_url || pkg.destination_image)
                    ? <img src={pkg.image_url || pkg.destination_image} alt={pkg.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gradient-to-br from-accent-500/30 to-primary-800" />
                }
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent" />
                <div className="absolute bottom-8 left-0 right-0 max-w-5xl mx-auto px-4">
                    <Link to="/packages" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-3 text-sm"><MdArrowBack /> All Packages</Link>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-white">{pkg.title}</h1>
                    <p className="text-slate-300 mt-1">{pkg.destination_name}, {pkg.country}</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {(pkg.package_types || []).map(type => (
                                <span key={type} className="px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    {type}
                                </span>
                            ))}
                        </div>

                        {/* Info */}
                        <div className="card p-6">
                            <div className="flex flex-wrap gap-6 mb-6">
                                <div className="flex items-center gap-2 text-slate-300"><MdSchedule className="text-primary-400 text-xl" /><span className="font-semibold">{pkg.duration_days} days</span></div>
                                <div className="flex items-center gap-2 text-slate-300"><MdPeople className="text-primary-400 text-xl" />Capacity: {pkg.max_guests}</div>
                                <div className="flex items-center gap-2"><MdAttachMoney className="text-accent-400 text-xl" /><span className="text-accent-400 font-bold text-lg">${Number(pkg.price_per_person).toLocaleString()}</span><span className="text-slate-400 text-sm">/person</span></div>
                            </div>
                            {pkg.description && <p className="text-slate-400 leading-relaxed mb-6">{pkg.description}</p>}

                            {/* Journey Flow */}
                            {pkg.destinations && pkg.destinations.length > 0 && (
                                <div className="mt-8 border-t border-white/5 pt-6">
                                    <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                                        <MdMap className="text-primary-400" /> Your Journey
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3">
                                        {pkg.destinations.map((dest, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-center">
                                                    <p className="text-white font-medium text-sm">{dest.destination_name}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase">{dest.days_spent} Days</p>
                                                </div>
                                                {idx < pkg.destinations.length - 1 && <div className="w-4 h-[2px] bg-white/10" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Inclusions (Hotels) */}
                        {pkg.hotels && pkg.hotels.length > 0 && (
                            <div className="card p-6">
                                <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                                    <MdHotel className="text-primary-400" /> Stay Included
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pkg.hotels.map((hotel, idx) => (
                                        <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-500">
                                                <MdHotel size={24} />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium text-sm">{hotel.hotel_name}</p>
                                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{hotel.city}</p>
                                                <div className="flex gap-0.5 mt-1">
                                                    {[...Array(Math.floor(hotel.stars || 5))].map((_, i) => (
                                                        <span key={i} className="text-orange-400 text-[10px]">★</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gallery Integration */}
                        {pkg.images && pkg.images.length > 0 && (
                            <div className="card p-6">
                                <MediaGallery images={pkg.images} />
                            </div>
                        )}

                        {/* Itinerary */}
                        {itinerary && Array.isArray(itinerary) && (
                            <div className="card p-6">
                                <h2 className="font-display font-semibold text-xl text-white mb-5">Day-by-Day Itinerary</h2>
                                <div className="space-y-4">
                                    {itinerary.map((day, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center text-primary-400 font-bold text-sm shrink-0">D{i + 1}</div>
                                            <div className="flex-1 pt-2">
                                                {typeof day === 'string' ? <p className="text-slate-300">{day}</p> : (
                                                    <>
                                                        {day.title && <p className="font-semibold text-white mb-1">{day.title}</p>}
                                                        {day.description && <p className="text-slate-400 text-sm">{day.description}</p>}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Booking CTA */}
                    <div>
                        <div className="card p-6 sticky top-24">
                            <div className="text-center mb-6">
                                <div className="text-slate-400 text-sm mb-1">Starting from</div>
                                <div className="font-display font-bold text-4xl text-accent-400">${Number(pkg.price_per_person).toLocaleString()}</div>
                                <div className="text-slate-400 text-sm">per person</div>
                            </div>
                            <button onClick={handleBook} className="btn-primary w-full py-4 text-base">
                                <MdFlightTakeoff /> Book This Package
                            </button>
                            {!isAuthenticated && <p className="text-center text-slate-500 text-xs mt-3">You'll need to log in to book</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
