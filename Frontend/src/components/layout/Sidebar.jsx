import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  MapPin,
  Briefcase,
  Hotel,
  Users,
  Settings,
  BarChart3,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { title: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { title: 'Destinations', icon: MapPin, path: '/admin/destinations' },
    { title: 'Packages', icon: Briefcase, path: '/admin/packages' },
    { title: 'Hotels', icon: Hotel, path: '/admin/hotels' },
    { title: 'User Roles', icon: Users, path: '/admin/users' },
    { title: 'Statistics', icon: BarChart3, path: '/admin/stats' }, // Dedicated stats page
    { title: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="flex flex-col h-full bg-[var(--card-bg)] border-r border-[var(--card-border)] w-64 fixed left-0 top-0 z-50 transition-colors duration-300">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
          <MapPin className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-display font-bold text-[var(--text-main)] tracking-tight">
          Admin<span className="text-primary-500">Hub</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-primary-500/5 dark:hover:bg-white/5'
                  }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-primary-400'}`} />
                <span className="font-medium">{item.title}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--card-border)]">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Exit Portal</span>
        </button>
      </div>
    </div>
  );
}
