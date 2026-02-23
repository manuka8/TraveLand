import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import sigiriya from '@/assets/sigiriya.png';
import nineArch from '@/assets/nine_arch.jpg';
import beach from '@/assets/mirissa.jpg';
import teaState from '@/assets/tea_state.jpg';
const images = [
    {
        url: sigiriya,
        title: 'Sigiriya Lion Rock',
        location: 'Central Province, Sri Lanka'
    },
    {
        url: nineArch,
        title: 'Ella Nine Arch Bridge',
        location: 'Badulla, Sri Lanka'
    },
    {
        url: beach,
        title: 'Tropical Paradise',
        location: 'Mirissa Beach, Sri Lanka'
    },
    {
        url: teaState,
        title: 'Lush Tea Estates',
        location: 'Nuwara Eliya, Sri Lanka'
    }
];

export default function HeroCarousel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src={images[index].url}
                        alt={images[index].title}
                        className="w-full h-full object-cover"
                    />
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-black/20 to-transparent dark:from-[#070c17]" />

                    {/* Location Badge (Subtle) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="absolute bottom-10 right-10 text-right hidden md:block"
                    >
                        <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Discover</p>
                        <p className="text-white font-medium">{images[index].title}</p>
                        <p className="text-white/80 text-sm">{images[index].location}</p>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Progress Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-primary-500' : 'w-2 bg-white/30 hover:bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
