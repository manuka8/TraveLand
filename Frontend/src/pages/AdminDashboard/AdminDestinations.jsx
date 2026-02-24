import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  MapPin,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { destinationAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';
import MultiImagePicker from '../../components/common/MultiImagePicker';

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    category: 'Nature',
    images: [],
    is_featured: 0
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await destinationAPI.getAll();
      setDestinations(res.data);
    } catch (err) {
      toast.error('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      return toast.error('Please add at least one image');
    }
    try {
      if (editingDest) {
        await destinationAPI.update(editingDest.id, formData);
        toast.success('Updated successfully');
      } else {
        await destinationAPI.create(formData);
        toast.success('Created successfully');
      }
      setIsModalOpen(false);
      fetchDestinations();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleEdit = async (dest) => {
    setLoading(true);
    try {
      const res = await destinationAPI.getById(dest.id);
      const fullDest = res.data;
      setEditingDest(fullDest);
      setFormData({
        title: fullDest.title,
        location: fullDest.location,
        description: fullDest.description || '',
        category: fullDest.category,
        images: fullDest.images || [],
        is_featured: fullDest.is_featured
      });
      setIsModalOpen(true);
    } catch (err) {
      toast.error('Failed to load destination details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        await destinationAPI.remove(id);
        toast.success('Destination deleted');
        fetchDestinations();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  const filtered = destinations.filter(d =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Destinations</h1>
          <p className="text-slate-400 text-sm mt-1">Add, explore and manage your travel locations</p>
        </div>
        <button
          onClick={() => {
            setEditingDest(null);
            setFormData({ title: '', location: '', description: '', category: 'Nature', images: [], is_featured: 0 });
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add New Destination
        </button>
      </div>

      <div className="bg-dark-900 border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or location..."
            className="input-field pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-dark-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && !isModalOpen ? (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500">No results.</td></tr>
              ) : (
                filtered.map((dest) => (
                  <tr key={dest.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                          {dest.image_url ? (
                            <img src={dest.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{dest.title}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" /> {dest.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-primary-500/10 text-primary-400 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider border border-primary-500/20">
                        {dest.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${dest.is_featured ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-slate-500/10 text-slate-500 border border-white/5'}`}>
                        {dest.is_featured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(dest)} className="p-2 text-slate-400 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(dest.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDest ? 'Edit Destination' : 'Add New Destination'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Destination Title</label>
              <input
                required
                type="text"
                className="input-field"
                placeholder="e.g. Tropical Bali Paradise"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Location</label>
              <input
                required
                type="text"
                className="input-field"
                placeholder="e.g. Indonesia"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Category</label>
              <select
                className="input-field"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Nature">Nature</option>
                <option value="Mountain">Mountain</option>
                <option value="Beach">Beach</option>
                <option value="City">City</option>
                <option value="Adventure">Adventure</option>
                <option value="Religious">Religious</option>
                <option value="Historical">Historical</option>
              </select>
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
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Description</label>
            <textarea
              rows="3"
              className="input-field resize-none"
              placeholder="Describe this destination..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_featured: formData.is_featured ? 0 : 1 })}
              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.is_featured ? 'bg-primary-500 border-primary-400 text-white' : 'border-white/20'}`}
            >
              {formData.is_featured ? <Check className="w-3.5 h-3.5" /> : null}
            </button>
            <span className="text-sm text-slate-300">Feature this destination on home page</span>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-semibold">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary py-3">
              {editingDest ? 'Save Changes' : 'Create Destination'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
