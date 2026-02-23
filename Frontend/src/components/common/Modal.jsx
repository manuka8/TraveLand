import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
                />

                {/* Modal content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-dark-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar relative z-10 shadow-2xl"
                >
                    <div className="sticky top-0 bg-dark-900/80 backdrop-blur-md px-8 py-6 border-b border-white/5 flex items-center justify-between z-20">
                        <h3 className="text-xl font-bold text-white">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="p-8">
                        {children}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
