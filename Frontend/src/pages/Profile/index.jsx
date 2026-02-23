import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdPerson, MdEmail, MdPhone, MdSave, MdPhotoCamera } from 'react-icons/md';
import { userAPI, authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { staggerContainer, staggerItem, slideUp } from '../../animations/variants';
import toast from 'react-hot-toast';
import ImagePicker from '../../components/common/ImagePicker';

export default function Profile() {
    const { user, setUser } = useAuth();
    const [form, setForm] = useState({
        full_name: user?.full_name || '',
        phone: user?.phone || '',
        avatar_url: user?.avatar_url || '',
    });
    const [saving, setSaving] = useState(false);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    const handleAvatarChange = (url) => setForm(f => ({ ...f, avatar_url: url }));

    const handleSubmit = async e => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await userAPI.updateProfile(form);
            if (res.success) {
                setUser({ ...user, ...form });
                toast.success('Profile updated successfully!');
            }
        } catch (err) {
            toast.error(err.message || 'Update failed.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-20 max-w-2xl mx-auto px-4 sm:px-6">
            <motion.div {...slideUp} className="mb-8">
                <h1 className="section-title">Profile <span className="text-gradient">Settings</span></h1>
                <p className="text-slate-400 mt-1">Update your personal information</p>
            </motion.div>

            <motion.form variants={staggerContainer} animate="animate" initial="initial"
                onSubmit={handleSubmit} className="card p-8 space-y-5">
                {/* Avatar preview */}
                <motion.div variants={staggerItem} className="flex items-center gap-5 mb-2">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg border border-white/10">
                        {form.avatar_url ? (
                            <img src={form.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            user?.full_name?.[0]?.toUpperCase()
                        )}
                    </div>
                    <div>
                        <p className="text-white font-semibold">{user?.full_name}</p>
                        <p className="text-slate-400 text-sm capitalize">{user?.role}</p>
                    </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                    <ImagePicker
                        label="Profile Image"
                        value={form.avatar_url}
                        onChange={handleAvatarChange}
                    />
                </motion.div>

                <motion.div variants={staggerItem}>
                    <label className="text-slate-300 text-sm font-medium block mb-2"><MdPerson className="inline mr-1 text-primary-400" /> Full Name</label>
                    <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required className="input-field" />
                </motion.div>

                <motion.div variants={staggerItem}>
                    <label className="text-slate-300 text-sm font-medium block mb-2"><MdEmail className="inline mr-1 text-slate-400" /> Email Address</label>
                    <input type="email" value={user?.email || ''} disabled className="input-field opacity-50 cursor-not-allowed" />
                    <p className="text-slate-600 text-xs mt-1">Email cannot be changed</p>
                </motion.div>

                <motion.div variants={staggerItem}>
                    <label className="text-slate-300 text-sm font-medium block mb-2"><MdPhone className="inline mr-1 text-primary-400" /> Phone</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555 000 0000" className="input-field" />
                </motion.div>

                <motion.button variants={staggerItem} type="submit" disabled={saving} className="btn-primary w-full py-3.5 gap-2 disabled:opacity-60">
                    <MdSave /> {saving ? 'Saving…' : 'Save Changes'}
                </motion.button>
            </motion.form>
        </div>
    );
}
