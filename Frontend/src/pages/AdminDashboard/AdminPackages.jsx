import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Trash2,
    Edit3,
    Package,
    Clock,
    DollarSign,
    Check,
    ImageIcon
} from 'lucide-react';
import { packageAPI, destinationAPI, hotelAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';
import MultiImagePicker from '../../components/common/MultiImagePicker';
import { Calendar, Building, MapPin as MapIcon, X } from 'lucide-react';

export default function AdminPackages() {
    const [packages, setPackages] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPkg, setEditingPkg] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        duration: '',
        images: [],
        is_active: 1,
        destination_id: '', // Added for primary destination mapping
        destinations: [],
        package_types: [],
        hotels: [],
        availability: [],
        max_booking_limit: 5,
        is_group_package: 0
    });

    const PACKAGE_TYPES = ['Luxury', 'Budget', 'Adventure', 'Honeymoon', 'Family/Group'];

    useEffect(() => {
        fetchPackages();
        fetchDestinations();
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const res = await hotelAPI.getAll();
            setHotels(res.data);
        } catch (err) {
            console.error('Failed to load hotels', err);
        }
    };

    const fetchDestinations = async () => {
        try {
            const res = await destinationAPI.getAll();
            setDestinations(res.data);
        } catch (err) {
            console.error('Failed to load destinations', err);
            toast.error('Failed to load destination list');
        }
    };

    const fetchPackages = async () => {
        try {
            const res = await packageAPI.getAll();
            setPackages(res.data);
        } catch (err) {
            toast.error('Failed to load packages');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.images.length === 0) {
            return toast.error('Please add at least one image');
        }
        if (formData.destinations.length === 0) {
            return toast.error('Please add at least one destination to the itinerary');
        }

        // Prepare data for submission - set primary destination_id from first stop
        const submissionData = {
            ...formData,
            destination_id: formData.destinations[0].destination_id
        };

        try {
            if (editingPkg) {
                await packageAPI.update(editingPkg.id, submissionData);
                toast.success('Package updated');
            } else {
                await packageAPI.create(submissionData);
                toast.success('Package created');
            }
            setIsModalOpen(false);
            fetchPackages();
        } catch (err) {
            toast.error(err.message || 'Operation failed');
        }
    };

    const handleEdit = async (pkg) => {
        setLoading(true);
        try {
            const res = await packageAPI.getById(pkg.id);
            const fullPkg = res.data;
            setEditingPkg(fullPkg);
            setFormData({
                title: fullPkg.title,
                description: fullPkg.description || '',
                price: fullPkg.price_per_person || fullPkg.price,
                duration: fullPkg.duration_days || fullPkg.duration,
                images: fullPkg.images || [],
                is_active: fullPkg.is_active,
                destinations: fullPkg.destinations || [],
                destination_id: fullPkg.destination_id || '',
                package_types: fullPkg.package_types || [],
                hotels: (fullPkg.hotels || []).map(h => h.hotel_id),
                availability: fullPkg.availability || [],
                max_booking_limit: fullPkg.max_booking_limit || 5,
                is_group_package: fullPkg.is_group_package || 0
            });
            setIsModalOpen(true);
        } catch (err) {
            toast.error('Failed to load package details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await packageAPI.remove(id);
                toast.success('Package removed');
                fetchPackages();
            } catch (err) {
                toast.error('Delete failed');
            }
        }
    };

    const filtered = packages.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manage Packages</h1>
                    <p className="text-slate-400 text-sm mt-1">Configure and manage travel tour packages</p>
                </div>
                <button
                    onClick={() => {
                        setEditingPkg(null);
                        setFormData({
                            title: '',
                            description: '',
                            price: '',
                            duration: '',
                            images: [],
                            is_active: 1,
                            destination_id: '',
                            destinations: [],
                            package_types: [],
                            hotels: [],
                            availability: [],
                            max_booking_limit: 5,
                            is_group_package: 0
                        });
                        setIsModalOpen(true);
                    }}
                    className="btn-primary"
                >
                    <Plus className="w-5 h-5" />
                    Create New Package
                </button>
            </div>

            <div className="bg-dark-900 border border-white/5 p-4 rounded-2xl flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search packages..."
                        className="input-field pl-10 h-11"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {loading ? (
                    <div className="text-slate-500 col-span-2 py-12 text-center">Loading packages...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-slate-500 col-span-2 py-12 text-center">No packages found.</div>
                ) : (
                    filtered.map((pkg) => (
                        <div key={pkg.id} className="bg-dark-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors flex gap-6">
                            <div className="w-24 h-24 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                                {pkg.image_url ? (
                                    <img src={pkg.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-700 bg-white/5">
                                        <ImageIcon className="w-8 h-8" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{pkg.title}</h3>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-primary-400" /> {pkg.duration}
                                            </span>
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <DollarSign className="w-3 h-3 text-emerald-400" /> ${pkg.price}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(pkg)} className="p-2 bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pkg.id)}
                                            className="p-2 bg-white/5 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${pkg.is_active ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : 'text-slate-500 border-white/5 bg-white/5'}`}>
                                        {pkg.is_active ? 'Marketplace Active' : 'Hidden'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPkg ? 'Edit Package' : 'Create New Package'}
            >
                <form onSubmit={handleSubmit} className="space-y-8 max-h-[80vh] overflow-y-auto pr-2 pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Package Title</label>
                                <input
                                    required
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. 7-Day Swiss Alps Tour"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Base Price ($)</label>
                                    <input
                                        required
                                        type="number"
                                        className="input-field"
                                        placeholder="999"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Duration</label>
                                    <input
                                        required
                                        type="text"
                                        className="input-field"
                                        placeholder="e.g. 5 Days / 4 Nights"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Package Types</label>
                                <div className="flex flex-wrap gap-2">
                                    {PACKAGE_TYPES.map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => {
                                                const exists = formData.package_types.includes(type);
                                                setFormData({
                                                    ...formData,
                                                    package_types: exists
                                                        ? formData.package_types.filter(t => t !== type)
                                                        : [...formData.package_types, type]
                                                });
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${formData.package_types.includes(type)
                                                ? 'bg-primary-500 border-primary-400 text-white shadow-lg shadow-primary-500/20'
                                                : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Itinerary Destinations</label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({
                                            ...formData,
                                            destinations: [...formData.destinations, { destination_id: '', days_spent: 1, sequence_order: formData.destinations.length }]
                                        })}
                                        className="text-[10px] font-bold text-primary-400 hover:text-primary-300 uppercase tracking-wider"
                                    >
                                        + Add Stop
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {formData.destinations.map((dest, idx) => (
                                        <div key={idx} className="flex gap-2 items-end bg-white/5 p-3 rounded-xl border border-white/5 relative group/dest">
                                            <div className="flex-1">
                                                <select
                                                    required
                                                    className="input-field h-9 text-sm"
                                                    value={dest.destination_id}
                                                    onChange={(e) => {
                                                        const newDestinals = [...formData.destinations];
                                                        newDestinals[idx].destination_id = e.target.value;
                                                        setFormData({ ...formData, destinations: newDestinals });
                                                    }}
                                                >
                                                    <option value="">Select Destination</option>
                                                    {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="w-20">
                                                <input
                                                    type="number"
                                                    placeholder="Days"
                                                    className="input-field h-9 text-sm"
                                                    value={dest.days_spent}
                                                    onChange={(e) => {
                                                        const newDestinals = [...formData.destinations];
                                                        newDestinals[idx].days_spent = e.target.value;
                                                        setFormData({ ...formData, destinations: newDestinals });
                                                    }}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({
                                                    ...formData,
                                                    destinations: formData.destinations.filter((_, i) => i !== idx)
                                                })}
                                                className="absolute -right-2 -top-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover/dest:opacity-100 transition-opacity shadow-lg"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {formData.destinations.length === 0 && <p className="text-center text-slate-600 text-[10px] py-2 border border-dashed border-white/10 rounded-xl">No destinations added yet</p>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Included Hotels</label>
                                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                    {hotels.map(hotel => (
                                        <label key={hotel.id} className={`flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer ${formData.hotels.includes(hotel.id)
                                            ? 'bg-primary-500/10 border-primary-500/30'
                                            : 'bg-white/5 border-white/5 hover:border-white/10'
                                            }`}>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={formData.hotels.includes(hotel.id)}
                                                onChange={() => {
                                                    const exists = formData.hotels.includes(hotel.id);
                                                    setFormData({
                                                        ...formData,
                                                        hotels: exists
                                                            ? formData.hotels.filter(id => id !== hotel.id)
                                                            : [...formData.hotels, hotel.id]
                                                    });
                                                }}
                                            />
                                            <Building className={`w-4 h-4 ${formData.hotels.includes(hotel.id) ? 'text-primary-400' : 'text-slate-600'}`} />
                                            <span className={`text-sm ${formData.hotels.includes(hotel.id) ? 'text-white font-medium' : 'text-slate-400'}`}>{hotel.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Travel Dates & Slots</label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({
                                            ...formData,
                                            availability: [...formData.availability, { available_date: '', available_slots: 10 }]
                                        })}
                                        className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider"
                                    >
                                        + Add Date
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.availability.map((slot, idx) => (
                                        <div key={idx} className="flex gap-2 items-center group/slot bg-white/5 p-2 rounded-xl border border-white/5">
                                            <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                                            <input
                                                type="date"
                                                required
                                                className="bg-transparent border-none text-slate-300 text-sm focus:ring-0 p-0 flex-1 min-w-0"
                                                value={slot.available_date}
                                                onChange={(e) => {
                                                    const newAvail = [...formData.availability];
                                                    newAvail[idx].available_date = e.target.value;
                                                    setFormData({ ...formData, availability: newAvail });
                                                }}
                                            />
                                            <div className="flex items-center gap-1 bg-dark-800 px-2 py-1 rounded-lg border border-white/5">
                                                <span className="text-[10px] font-bold text-slate-500">SLOTS</span>
                                                <input
                                                    type="number"
                                                    className="bg-transparent border-none text-white text-sm focus:ring-0 p-0 w-8 text-center font-bold"
                                                    value={slot.available_slots}
                                                    onChange={(e) => {
                                                        const newAvail = [...formData.availability];
                                                        newAvail[idx].available_slots = e.target.value;
                                                        setFormData({ ...formData, availability: newAvail });
                                                    }}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({
                                                    ...formData,
                                                    availability: formData.availability.filter((_, i) => i !== idx)
                                                })}
                                                className="p-1.5 text-slate-600 hover:text-red-400 opacity-0 group-hover/slot:opacity-100 transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {formData.availability.length === 0 && <p className="text-center text-slate-600 text-[10px] py-2 border border-dashed border-white/10 rounded-xl">No dates defined yet</p>}
                                </div>
                            </div>

                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-white">Group Package</p>
                                        <p className="text-[10px] text-slate-500">Allows larger group bookings</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, is_group_package: formData.is_group_package ? 0 : 1 })}
                                        className={`w-10 h-5 rounded-full relative transition-colors ${formData.is_group_package ? 'bg-primary-500' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${formData.is_group_package ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Max Slots Per Booking</label>
                                    <input
                                        type="number"
                                        className="input-field h-9 text-sm"
                                        value={formData.max_booking_limit}
                                        onChange={(e) => setFormData({ ...formData, max_booking_limit: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <MultiImagePicker
                            label="Gallery Images"
                            images={formData.images}
                            onChange={(images) => setFormData({ ...formData, images })}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Full Description</label>
                        <textarea
                            rows="4"
                            className="input-field resize-none"
                            placeholder="Tell more about this amazing adventure..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, is_active: formData.is_active ? 0 : 1 })}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.is_active ? 'bg-primary-500 border-primary-400 text-white' : 'border-white/20'}`}
                        >
                            {formData.is_active ? <Check className="w-3.5 h-3.5" /> : null}
                        </button>
                        <span className="text-sm text-slate-300">Publish this package to the public marketplace</span>
                    </div>

                    <div className="pt-4 flex gap-4 sticky bottom-0 bg-dark-900/80 backdrop-blur-md pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-4 rounded-2xl border border-white/10 text-white hover:bg-white/5 transition-colors font-bold text-sm">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 btn-primary py-4 rounded-2xl text-sm font-bold shadow-xl shadow-primary-500/20">
                            {editingPkg ? 'Update Design' : 'Launch Package'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
