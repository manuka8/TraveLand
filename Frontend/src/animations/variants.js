// Framer Motion animation variants for page transitions and elements

export const pageTransition = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
    transition: { duration: 0.35, ease: 'easeInOut' },
};

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
};

export const slideUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
};

export const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
};

export const staggerItem = {
    initial: { y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
};

export const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: 'easeOut' },
};
