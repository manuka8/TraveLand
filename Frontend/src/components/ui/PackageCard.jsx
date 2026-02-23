import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdFlightTakeoff, MdSchedule, MdHotel, MdRestaurant, MdDirectionsBus } from 'react-icons/md';
import { staggerItem } from '../../animations/variants';
import StarRating from './StarRating';

export default function PackageCard({ pkg }) {
    const { id, title, destination_name, country, image_url, price_per_person, duration_days, destination_image, avg_rating, description } = pkg;
    const coverImage = image_url || destination_image;

    const inclusions = [
        { icon: MdHotel, label: 'Hotel' },
        { icon: MdRestaurant, label: 'Meals' },
        { icon: MdDirectionsBus, label: 'Transfers' }
    ];

    return (
        <motion.div variants={staggerItem} className="card-hover group">
            <Link to={`/packages/${id}`} className="block">
                <div className="relative overflow-hidden h-52">
                    {coverImage ? (
                        <motion.img
                            src={coverImage}
                            alt={title}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.8 }}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent-500/20 to-primary-800/10 flex items-center justify-center">
                            <MdFlightTakeoff className="text-5xl text-accent-400 opacity-40" />
                        </div>
                    )}

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-dark-950/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className="badge-orange text-[10px] font-bold uppercase tracking-wider py-1 px-3 shadow-lg">
                            {country}
                        </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <div>
                            <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest leading-none mb-1">Destination</p>
                            <h4 className="text-white font-bold text-sm">{destination_name}</h4>
                        </div>
                        <div className="flex gap-1.5">
                            {inclusions.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    className="w-7 h-7 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white border border-white/10"
                                    title={item.label}
                                >
                                    <item.icon size={14} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={avg_rating || 4.5} size={12} />
                        <span className="text-[var(--text-muted)] text-[10px] font-bold">FEASTURED</span>
                    </div>

                    <h3 className="font-display font-bold text-[var(--text-main)] mb-2 line-clamp-1 group-hover:text-primary-500 transition-colors duration-200">
                        {title}
                    </h3>

                    {description && (
                        <p className="text-[var(--text-muted)] text-xs line-clamp-2 mb-4 leading-relaxed">
                            {description}
                        </p>
                    )}

                    <div className="flex items-center justify-between border-t border-[var(--card-border)] pt-4">
                        <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs font-semibold">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                            >
                                <MdSchedule className="text-primary-500" size={16} />
                            </motion.div>
                            {duration_days} Days
                        </div>

                        <div className="text-right">
                            <p className="text-[var(--text-muted)] text-[10px] uppercase font-bold tracking-tighter leading-none">Starting from</p>
                            <span className="text-accent-500 dark:text-accent-400 font-extrabold text-xl">
                                ${Number(price_per_person).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        whileHover={{ height: 'auto', opacity: 1 }}
                        className="overflow-hidden mt-4"
                    >
                        <button className="btn-primary w-full py-2.5 rounded-xl text-sm font-bold shadow-none">
                            Book Adventure
                        </button>
                    </motion.div>
                </div>
            </Link>
        </motion.div>
    );
}
