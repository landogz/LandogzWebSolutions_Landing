import { motion } from 'framer-motion';
import SectionTitle from '@/components/landing/SectionTitle';
import { sectionVariants, staggerContainer, staggerItem, prefersReducedMotion } from '@/sections/landing/sectionVariants';

const serviceShell = [
    'border-sky-500/25 bg-gradient-to-br from-sky-500/[0.08] to-transparent transition-[box-shadow,border-color] duration-300 hover:border-sky-400/60 hover:shadow-[0_0_32px_-8px_rgba(56,189,248,0.45)] dark:from-sky-500/10 dark:hover:shadow-[0_0_36px_-6px_rgba(56,189,248,0.35)]',
    'border-violet-500/25 bg-gradient-to-br from-violet-500/[0.08] to-transparent transition-[box-shadow,border-color] duration-300 hover:border-violet-400/60 hover:shadow-[0_0_32px_-8px_rgba(167,139,250,0.45)] dark:from-violet-500/10 dark:hover:shadow-[0_0_36px_-6px_rgba(167,139,250,0.35)]',
    'border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.08] to-transparent transition-[box-shadow,border-color] duration-300 hover:border-emerald-400/60 hover:shadow-[0_0_32px_-8px_rgba(52,211,153,0.45)] dark:from-emerald-500/10 dark:hover:shadow-[0_0_36px_-6px_rgba(52,211,153,0.35)]',
];

export default function ServicesSection({ services = [], sectionViewport }) {
    const reduce = prefersReducedMotion();

    return (
        <motion.section
            id="services"
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={sectionViewport}
            className="scroll-landing-header border-y border-slate-200/80 bg-slate-100/90 px-4 py-16 dark:border-white/5 dark:bg-black/25 sm:py-20"
        >
            <div className="mx-auto max-w-6xl">
                <SectionTitle eyebrow="What we do" title="Services" subtitle="API-first backends, polished SPAs, and dependable delivery." />
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={sectionViewport}
                    className="mt-12 grid gap-6 md:grid-cols-3"
                >
                    {services.map((s, i) => (
                        <motion.div
                            key={s.id}
                            variants={staggerItem}
                            whileHover={reduce ? undefined : { y: -4 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                            className={`group rounded-2xl border bg-white p-7 shadow-sm dark:border-white/10 dark:bg-slate-900/90 ${serviceShell[i % serviceShell.length]}`}
                        >
                            <div className="text-3xl text-sky-600 transition group-hover:scale-110 dark:text-sky-400">{s.icon}</div>
                            <h3 className="font-display mt-4 text-xl font-semibold tracking-tight">{s.title}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{s.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
}
