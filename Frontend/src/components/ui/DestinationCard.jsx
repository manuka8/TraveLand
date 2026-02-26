import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdLocationOn, MdStar, MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { staggerItem } from '../../animations/variants';
import StarRating from './StarRating';
import { useState } from 'react';

export default function DestinationCard({ destination }) {
    const { id, name, country, image_url, avg_rating, total_reviews, category, tags, description } = destination;
    const [isWishlisted, setIsWishlisted] = useState(false);

    return (
        <motion.div
            variants={staggerItem}
            className="card-hover group relative"
        >
            <Link to={`/destinations/${id}`} className="block">
                <div className="relative overflow-hidden h-56">
                    {image_url ? (
                        <motion.img
                            src={image_url}
                            alt={name}
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.15 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-primary-800/10 flex items-center justify-center">
                            <MdLocationOn className="text-6xl text-primary-500/30" />
                        </div>
                    )}

                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                    {/* Category badge */}
                    {category && (
                        <motion.span
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="absolute top-3 left-3 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg"
                        >
                            {category}
                        </motion.span>
                    )}

                    {/* Tags */}
                    <div className="absolute bottom-3 left-3 flex gap-1 flex-wrap md:translate-y-8 md:group-hover:translate-y-0 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                        {(tags || ['Nature', 'Culture']).map(tag => (
                            <span key={tag} className="text-[10px] bg-black/40 dark:bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-md border border-white/10 shadow-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="p-5 relative">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-[var(--text-main)] group-hover:text-primary-500 transition-colors duration-200">
                            {name}
                        </h3>
                    </div>

                    <p className="flex items-center gap-1 text-[var(--text-muted)] mb-3 group-hover:text-[var(--text-main)] transition-colors">
                        <motion.span
                            animate={{ y: [0, -2, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <MdLocationOn className="text-primary-500 shrink-0" />
                        </motion.span>
                        <span className="text-sm font-medium">{country}</span>
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                            <StarRating rating={avg_rating || 0} size={14} />
                            <span className="text-[var(--text-muted)] text-xs font-medium">
                                ({total_reviews || 0})
                            </span>
                        </div>

                        <div className="text-primary-600 dark:text-primary-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-x-4 md:group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1 text-[10px] md:text-xs font-bold uppercase tracking-tighter">
                            View Details <span>→</span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Wishlist Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setIsWishlisted(!isWishlisted);
                }}
                className="absolute top-3 right-3 w-9 h-9 bg-black/20 md:bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all duration-300 z-10"
            >
                <motion.div
                    whileTap={{ scale: 1.5 }}
                >
                    {isWishlisted ? <MdFavorite className="text-xl text-red-500" /> : <MdFavoriteBorder className="text-xl" />}
                </motion.div>
            </button>
        </motion.div>
    );
}