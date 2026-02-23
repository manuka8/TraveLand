import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdFlightTakeoff, MdCalendarToday, MdPeople, MdNote } from 'react-icons/md';
import { packageAPI, bookingAPI } from '../../services/api';
import { slideUp, staggerContainer, staggerItem } from '../../animations/variants';
import toast from 'react-hot-toast';

export default function BookingPage() {
    const { packageId } = useParams();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState(null);
    const [form, setForm] = useState({ guests: 1, travel_date: '', return_date: '', notes: '' });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setLoading(true);
        packageAPI.getById(packageId).then(r => setPkg(r.data)).catch(() => navigate('/packages')).finally(() => setLoading(false));
    }, [packageId]);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const totalPrice = pkg ? pkg.price_per_person * Number(form.guests) : 0;

    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.travel_date) { toast.error('Please select a travel date.'); return; }
        setSubmitting(true);
        try {
            const res = await bookingAPI.create({
                package_id: Number(packageId),
                guests: Number(form.guests),
                travel_date: form.travel_date,
                return_date: form.return_date || undefined,
                notes: form.notes || undefined,
            });
            toast.success('Booking created successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.message || 'Booking failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !pkg) return (
        <div className="min-h-screen pt-28 flex items-center justify-center">
            <div className="text-slate-400">Loading package details…</div>
        </div>
    );

    return (
        <div className="min-h-screen pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div {...slideUp} className="mb-8 text-center">
                <h1 className="section-title">Complete Your <span className="text-gradient">Booking</span></h1>
                <p className="text-slate-400 mt-2">{pkg.title} — {pkg.destination_name}, {pkg.country}</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Form */}
                <motion.form variants={staggerContainer} animate="animate" initial="initial"
                    onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
                    <motion.div variants={staggerItem}>
                        <label className="text-slate-300 text-sm font-medium block mb-2"><MdPeople className="inline mr-1 text-primary-400" /> Number of Guests</label>
                        <input type="number" name="guests" min={1} max={pkg.max_guests} value={form.guests} onChange={handleChange}
                            className="input-field" />
                        <p className="text-slate-500 text-xs mt-1">Max {pkg.max_guests} guests allowed</p>
                    </motion.div>

                    <motion.div variants={staggerItem}>
                        <label className="text-slate-300 text-sm font-medium block mb-2"><MdCalendarToday className="inline mr-1 text-primary-400" /> Travel Date</label>
                        <input type="date" name="travel_date" value={form.travel_date} onChange={handleChange} required
                            min={new Date().toISOString().split('T')[0]}
                            className="input-field" />
                    </motion.div>

                    <motion.div variants={staggerItem}>
                        <label className="text-slate-300 text-sm font-medium block mb-2"><MdCalendarToday className="inline mr-1 text-slate-400" /> Return Date (optional)</label>
                        <input type="date" name="return_date" value={form.return_date} onChange={handleChange}
                            min={form.travel_date || new Date().toISOString().split('T')[0]}
                            className="input-field" />
                    </motion.div>

                    <motion.div variants={staggerItem}>
                        <label className="text-slate-300 text-sm font-medium block mb-2"><MdNote className="inline mr-1 text-slate-400" /> Special Requests (optional)</label>
                        <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Any dietary requirements, accessibility needs…"
                            className="input-field resize-none" />
                    </motion.div>

                    <motion.button variants={staggerItem} type="submit" disabled={submitting}
                        className="btn-primary w-full py-4 text-base disabled:opacity-60">
                        <MdFlightTakeoff /> {submitting ? 'Creating booking…' : 'Confirm Booking'}
                    </motion.button>
                </motion.form>

                {/* Summary */}
                <div className="lg:col-span-2">
                    <div className="card p-6 sticky top-24">
                        <h3 className="font-display font-semibold text-white text-lg mb-5">Booking Summary</h3>
                        {pkg.image_url && <img src={pkg.image_url} alt={pkg.title} className="w-full h-32 object-cover rounded-xl mb-4" />}
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-slate-400">Package</span><span className="text-white font-medium">{pkg.title}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Duration</span><span className="text-white">{pkg.duration_days} days</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Price/person</span><span className="text-white">${Number(pkg.price_per_person).toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Guests</span><span className="text-white">{form.guests}</span></div>
                            <hr className="border-white/10" />
                            <div className="flex justify-between text-base font-semibold">
                                <span className="text-slate-300">Total</span>
                                <span className="text-accent-400 text-lg">${totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
