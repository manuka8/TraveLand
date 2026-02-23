import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  Star,
  Hotel as HotelIcon,
  MapPin,
  Check,
  ImageIcon
} from 'lucide-react';
import { hotelAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';
import MultiImagePicker from '../../components/common/MultiImagePicker';

export default function AdminHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    rating: 0,
    amenities: '',
    price_per_night: '',
    images: [],
    is_active: 1
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await hotelAPI.getAll();
      setHotels(res.data);
    } catch (err) {
      toast.error('Failed to load hotels');
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
      if (editingHotel) {
        await hotelAPI.update(editingHotel.id, formData);
        toast.success('Hotel updated');
      } else {
        await hotelAPI.create(formData);
        toast.success('Hotel added');
      }
      setIsModalOpen(false);
      fetchHotels();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleEdit = async (hotel) => {
    setLoading(true);
    try {
      const res = await hotelAPI.getById(hotel.id);
      const fullHotel = res.data;
      setEditingHotel(fullHotel);
      setFormData({
        name: fullHotel.name,
        description: fullHotel.description || '',
        address: fullHotel.address,
        city: fullHotel.city,
        rating: fullHotel.rating,
        amenities: fullHotel.amenities || '',
        price_per_night: fullHotel.price_per_night,
        images: fullHotel.images || [],
        is_active: fullHotel.is_active
      });
      setIsModalOpen(true);
    } catch (err) {
      toast.error('Failed to load hotel details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this hotel?')) {
      try {
        await hotelAPI.remove(id);
        toast.success('Hotel removed');
        fetchHotels();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const filtered = hotels.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Hotels</h1>
          <p className="text-slate-400 text-sm mt-1">Manage partner hotels and accommodations</p>
        </div>
        <button
          onClick={() => {
            setEditingHotel(null);
            setFormData({ name: '', description: '', address: '', city: '', rating: 0, amenities: '', price_per_night: '', images: [], is_active: 1 });
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add New Hotel
        </button>
      </div>

      <div className="bg-dark-900 border border-white/5 p-4 rounded-2xl flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or city..."
            className="input-field pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-dark-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Hotel</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Location</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Price/Night</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500">Loading hotels...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500">No hotels added yet.</td></tr>
            ) : (
              filtered.map((hotel) => (
                <tr key={hotel.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 text-white font-medium">
                    <div className="flex items-center gap-3">
                      <HotelIcon className="w-5 h-5 text-primary-400" />
                      <div>
                        <p>{hotel.name}</p>
                        <div className="flex items-center gap-1 text-orange-400 text-[10px] font-bold mt-1">
                          <Star className="w-3 h-3 fill-current" /> {hotel.rating}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {hotel.city}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-emerald-400 font-semibold">${hotel.price_per_night}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-500">
                      <button onClick={() => handleEdit(hotel)} className="p-2 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(hotel.id)} className="p-2 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHotel ? 'Edit Hotel' : 'Add Partner Hotel'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Hotel Name</label>
              <input
                required
                type="text"
                className="input-field"
                placeholder="e.g. Grand Luxury Resort"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">City</label>
              <input
                required
                type="text"
                className="input-field"
                placeholder="e.g. Malé"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Base Rating (0-5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                className="input-field"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Price Per Night ($)</label>
            <input
              required
              type="number"
              className="input-field"
              placeholder="250"
              value={formData.price_per_night}
              onChange={(e) => setFormData({ ...formData, price_per_night: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Address</label>
            <input
              required
              type="text"
              className="input-field"
              placeholder="123 Ocean Drive"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Amenities (Comma separated)</label>
            <input
              type="text"
              className="input-field"
              placeholder="Wifi, Pool, Gym, Spa"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
            />
          </div>

          <div>
            <MultiImagePicker
              label="Gallery Images"
              images={formData.images}
              onChange={(images) => setFormData({ ...formData, images })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-semibold">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary py-3">
              {editingHotel ? 'Update Hotel' : 'Add Hotel'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
