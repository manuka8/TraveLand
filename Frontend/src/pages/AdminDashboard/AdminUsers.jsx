import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Shield, 
  ShieldAlert, 
  Search, 
  MoreVertical,
  UserCheck,
  UserX
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await adminAPI.toggleUser(id, !currentStatus);
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const filtered = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-slate-400 text-sm mt-1">Manage system access and modify user roles</p>
      </div>

      <div className="bg-dark-900 border border-white/5 p-4 rounded-2xl flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            className="input-field pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-dark-900 border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Contact</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">Loading user database...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">No users found.</td></tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-9 h-9 rounded-full bg-primary-900/50 flex items-center justify-center text-primary-400 font-bold border border-primary-500/20">
                        {user.full_name.charAt(0)}
                      </div>
                      <span className="font-medium">{user.full_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        {user.role === 'admin' ? (
                            <ShieldAlert className="w-4 h-4 text-orange-400" />
                        ) : (
                            <Shield className="w-4 h-4 text-slate-500" />
                        )}
                        <span className={`text-xs font-bold uppercase tracking-wider ${user.role === 'admin' ? 'text-orange-400' : 'text-slate-400'}`}>
                            {user.role}
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span className={`text-xs ${user.is_active ? 'text-emerald-400' : 'text-red-400'}`}>
                            {user.is_active ? 'Active' : 'Locked'}
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => toggleStatus(user.id, user.is_active)}
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                      title={user.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
