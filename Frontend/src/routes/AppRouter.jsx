import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';
import { ProtectedRoute, AdminRoute, GuestRoute } from './guards';

// Pages
import Home from '../pages/Home';
import Destinations from '../pages/Destinations';
import DestinationDetail from '../pages/Destinations/DestinationDetail';
import Packages from '../pages/Packages';
import PackageDetail from '../pages/Packages/PackageDetail';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import UserDashboard from '../pages/UserDashboard';
import Profile from '../pages/Profile';
import BookingPage from '../pages/Booking';
import NotFound from '../pages/NotFound';

// Admin Pages
import AdminDashboard from '../pages/AdminDashboard';
import AdminDestinations from '../pages/AdminDashboard/AdminDestinations';
import AdminPackages from '../pages/AdminDashboard/AdminPackages';
import AdminHotels from '../pages/AdminDashboard/AdminHotels';
import AdminUsers from '../pages/AdminDashboard/AdminUsers';

export default function AppRouter() {
    return (
        <Routes>
            {/* Public/Member Layout */}
            <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="destinations" element={<Destinations />} />
                <Route path="destinations/:id" element={<DestinationDetail />} />
                <Route path="packages" element={<Packages />} />
                <Route path="packages/:id" element={<PackageDetail />} />

                <Route element={<GuestRoute />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="booking/:packageId" element={<BookingPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Portal Layout */}
            <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="destinations" element={<AdminDestinations />} />
                <Route path="packages" element={<AdminPackages />} />
                <Route path="hotels" element={<AdminHotels />} />
                <Route path="users" element={<AdminUsers />} />
            </Route>
        </Routes>
    );
}
