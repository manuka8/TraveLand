import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdFlightTakeoff, MdSchedule, MdPeople, MdArrowBack, MdAttachMoney } from 'react-icons/md';
import { packageAPI } from '../../services/api';
import { slideUp } from '../../animations/variants';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
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
                        {/* Info */}
                        <div className="card p-6">
                            <div className="flex flex-wrap gap-6 mb-6">
                                <div className="flex items-center gap-2 text-slate-300"><MdSchedule className="text-primary-400 text-xl" /><span className="font-semibold">{pkg.duration_days} days</span></div>
                                <div className="flex items-center gap-2 text-slate-300"><MdPeople className="text-primary-400 text-xl" />Max {pkg.max_guests} guests</div>
                                <div className="flex items-center gap-2"><MdAttachMoney className="text-accent-400 text-xl" /><span className="text-accent-400 font-bold text-lg">${Number(pkg.price_per_person).toLocaleString()}</span><span className="text-slate-400 text-sm">/person</span></div>
                            </div>
                            {pkg.description && <p className="text-slate-400 leading-relaxed">{pkg.description}</p>}
                        </div>

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
