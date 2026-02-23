import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdFlightTakeoff } from 'react-icons/md';
import { slideUp } from '../animations/variants';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-hero-gradient">
            <motion.div {...slideUp} className="text-center">
                <MdFlightTakeoff className="text-7xl text-primary-500/40 mx-auto mb-6 animate-float" />
                <h1 className="font-display text-8xl font-bold text-white/10 mb-2">404</h1>
                <h2 className="font-display text-3xl font-bold text-white mb-4">Page Not Found</h2>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    Looks like this destination doesn't exist. Let's get you back on track.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link to="/" className="btn-primary">Go Home</Link>
                    <Link to="/destinations" className="btn-outline">Browse Destinations</Link>
                </div>
            </motion.div>
        </div>
    );
}
