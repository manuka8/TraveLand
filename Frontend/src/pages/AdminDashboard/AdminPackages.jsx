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
import { packageAPI, destinationAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';
import MultiImagePicker from '../../components/common/MultiImagePicker';

export default function AdminPackages() {
    const [packages, setPackages] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPkg, setEditingPkg] = useState(null);
    const [formData, setFormData] = useState({
        destination_id: '',
        title: '',
        description: '',
        price: '',
        duration: '',
        images: [],
        is_active: 1
    });

    useEffect(() => {
        fetchPackages();
        fetchDestinations();
    }, []);

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
        if (!formData.destination_id) {
            return toast.error('Please select a destination');
        }
        try {
            if (editingPkg) {
                await packageAPI.update(editingPkg.id, formData);
                toast.success('Package updated');
            } else {
                await packageAPI.create(formData);
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
                destination_id: fullPkg.destination_id,
                title: fullPkg.title,
                description: fullPkg.description || '',
                price: fullPkg.price_per_person || fullPkg.price,
                duration: fullPkg.duration_days || fullPkg.duration,
                images: fullPkg.images || [],
                is_active: fullPkg.is_active
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
                        setFormData({ destination_id: '', title: '', description: '', price: '', duration: '', images: [], is_active: 1 });
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
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Destination</label>
                        <select
                            required
                            className="input-field"
                            value={formData.destination_id}
                            onChange={(e) => setFormData({ ...formData, destination_id: e.target.value })}
                        >
                            <option value="">Select a Destination</option>
                            {destinations.map(d => (
                                <option key={d.id} value={d.id}>{d.title}</option>
                            ))}
                        </select>
                    </div>

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
                        <MultiImagePicker
                            label="Gallery Images"
                            images={formData.images}
                            onChange={(images) => setFormData({ ...formData, images })}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Full Description</label>
                        <textarea
                            rows="3"
                            className="input-field resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, is_active: formData.is_active ? 0 : 1 })}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.is_active ? 'bg-primary-500 border-primary-400 text-white' : 'border-white/20'}`}
                        >
                            {formData.is_active ? <Check className="w-3.5 h-3.5" /> : null}
                        </button>
                        <span className="text-sm text-slate-300">Set this package as active on market</span>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-semibold">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 btn-primary py-3">
                            {editingPkg ? 'Update Package' : 'Create Package'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
