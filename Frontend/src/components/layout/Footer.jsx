import { Link } from 'react-router-dom';
import { MdFlightTakeoff, MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

const links = {
    Company: [
        { to: '/', label: 'Home' },
        { to: '/destinations', label: 'Destinations' },
        { to: '/packages', label: 'Packages' },
    ],
    Account: [
        { to: '/login', label: 'Sign In' },
        { to: '/register', label: 'Register' },
        { to: '/dashboard', label: 'My Bookings' },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-[var(--card-bg)] border-t border-[var(--card-border)] mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                                <MdFlightTakeoff className="text-white text-lg" />
                            </div>
                            <span className="font-display font-bold text-xl text-[var(--text-main)]">Travel<span className="text-gradient">Land</span></span>
                        </Link>
                        <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">
                            Your trusted partner for extraordinary travel experiences. Explore the world with confidence.
                        </p>
                        <div className="flex gap-3">
                            {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 glass rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-primary-500 hover:border-primary-500/50 transition-all">
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(links).map(([section, items]) => (
                        <div key={section}>
                            <h4 className="font-display font-semibold text-[var(--text-main)] mb-4">{section}</h4>
                            <ul className="space-y-3">
                                {items.map(({ to, label }) => (
                                    <li key={to}>
                                        <Link to={to} className="text-[var(--text-muted)] hover:text-primary-500 text-sm transition-colors">{label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact */}
                    <div>
                        <h4 className="font-display font-semibold text-[var(--text-main)] mb-4">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-[var(--text-muted)] text-sm"><MdEmail className="text-primary-500 shrink-0" /> hello@traveland.com</li>
                            <li className="flex items-center gap-3 text-[var(--text-muted)] text-sm"><MdPhone className="text-primary-500 shrink-0" /> +1 (800) 555-TRAVEL</li>
                            <li className="flex items-center gap-3 text-[var(--text-muted)] text-sm"><MdLocationOn className="text-primary-500 shrink-0" /> 123 Explorer St, San Francisco, CA</li>
                        </ul>
                    </div>
                </div>

                <hr className="border-[var(--card-border)] my-8" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-[var(--text-muted)] text-sm">
                    <span>&copy; {new Date().getFullYear()} TravelLand. All rights reserved.</span>
                    <span>Built with ❤️ for explorers worldwide</span>
                </div>
            </div>
        </footer>
    );
}
