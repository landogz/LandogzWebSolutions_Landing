function prefersReducedMotion() {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const reduced = prefersReducedMotion();

/** Fade-up on scroll (Framer whileInView) */
export const sectionVariants = {
    hidden: { opacity: 0, y: reduced ? 0 : 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: reduced ? 0.01 : 0.65, ease: [0.22, 1, 0.36, 1] },
    },
};

export const staggerContainer = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: reduced ? 0 : 0.08,
            delayChildren: reduced ? 0 : 0.05,
        },
    },
};

export const staggerItem = {
    hidden: { opacity: 0, y: reduced ? 0 : 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: reduced ? 0.01 : 0.4, ease: [0.22, 1, 0.36, 1] },
    },
};

export { prefersReducedMotion };
