import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdChevronLeft, MdChevronRight, MdZoomIn } from 'react-icons/md';

/**
 * MediaGallery Component
 * Displays an attractive grid of images with a lightbox feature.
 * @param {Array} images - Array of image objects { id, image_url, is_main }
 */
export default function MediaGallery({ images = [] }) {
    const [selectedIdx, setSelectedIdx] = useState(null);

    // Filter out missing images and limit to reasonable count for the grid
    const galleryImages = images.filter(img => img.image_url);
    if (galleryImages.length === 0) return null;

    const openLightbox = (idx) => setSelectedIdx(idx);
    const closeLightbox = () => setSelectedIdx(null);
    const prevImage = (e) => { e.stopPropagation(); setSelectedIdx(prev => (prev > 0 ? prev - 1 : galleryImages.length - 1)); };
    const nextImage = (e) => { e.stopPropagation(); setSelectedIdx(prev => (prev < galleryImages.length - 1 ? prev + 1 : 0)); };

    return (
        <div className="space-y-6">
            <h2 className="font-display font-semibold text-xl text-white flex items-center gap-2">
                Gallery <span className="text-slate-500 font-normal text-base">({galleryImages.length})</span>
            </h2>

            {/* Grid Layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages.map((img, idx) => (
                    <motion.div
                        key={img.id || idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => openLightbox(idx)}
                        className={`relative group cursor-zoom-in overflow-hidden rounded-2xl aspect-square border border-white/5 ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''
                            }`}
                    >
                        <img
                            src={img.image_url}
                            alt={`Gallery image ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-dark-950/20 group-hover:bg-dark-950/0 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
                                <MdZoomIn size={20} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedIdx !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeLightbox}
                        className="fixed inset-0 z-[100] bg-dark-950/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
                    >
                        {/* Controls */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 w-12 h-12 bg-white/5 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-colors border border-white/10 z-[110]"
                        >
                            <MdClose size={24} />
                        </button>

                        <button
                            onClick={prevImage}
                            className="absolute left-4 md:left-10 w-12 h-12 bg-white/5 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-colors border border-white/10 z-[110]"
                        >
                            <MdChevronLeft size={32} />
                        </button>

                        <button
                            onClick={nextImage}
                            className="absolute right-4 md:right-10 w-12 h-12 bg-white/5 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-colors border border-white/10 z-[110]"
                        >
                            <MdChevronRight size={32} />
                        </button>

                        {/* Image Container */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-5xl w-full h-full flex items-center justify-center"
                        >
                            <img
                                src={galleryImages[selectedIdx].image_url}
                                alt="Shared Gallery"
                                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl shadow-black/50"
                            />

                            {/* Caption/Counter */}
                            <div className="absolute bottom-[-40px] left-0 right-0 text-center">
                                <p className="text-slate-400 text-sm font-medium">
                                    Image {selectedIdx + 1} of {galleryImages.length}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
