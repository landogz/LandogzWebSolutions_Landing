import { motion } from 'framer-motion';
import SectionTitle from '@/components/landing/SectionTitle';
import { sectionVariants, staggerContainer, staggerItem } from '@/sections/landing/sectionVariants';

export default function TestimonialsSection({ testimonials = [], clientsWithLogo = [], sectionViewport }) {
    return (
        <>
            <motion.section
                id="testimonials"
                variants={sectionVariants}
                initial="hidden"
                whileInView="show"
                viewport={sectionViewport}
                className="scroll-landing-header border-y border-slate-200/80 bg-gradient-to-b from-slate-100/90 to-slate-50 px-4 py-16 dark:border-white/5 dark:from-black/30 dark:to-landogz-navy sm:py-20"
            >
                <div className="mx-auto max-w-6xl">
                    <SectionTitle eyebrow="Social proof" title="Testimonials" subtitle="Teams we’ve shipped with — in their words." />
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={sectionViewport}
                        className="mt-12 flex flex-wrap justify-center gap-6"
                    >
                        {testimonials.map((t, i) => (
                            <motion.blockquote
                                key={t.id}
                                variants={staggerItem}
                                className={`flex h-full w-full max-w-[22rem] flex-shrink-0 flex-col rounded-2xl border p-6 text-left shadow-md sm:max-w-[20.5rem] ${
                                    i === 0
                                        ? 'border-sky-400/40 bg-white shadow-sky-500/10 ring-1 ring-sky-500/20 dark:border-sky-400/30 dark:bg-slate-900 dark:ring-sky-400/20'
                                        : 'border-slate-200/90 bg-white dark:border-white/10 dark:bg-slate-900/90'
                                }`}
                            >
                                <span className="font-display text-4xl leading-none text-sky-500/50 dark:text-sky-400/50" aria-hidden>
                                    “
                                </span>
                                <div className="mt-1 text-amber-500" aria-hidden>
                                    {'★'.repeat(t.rating || 0)}
                                </div>
                                <p className="mt-4 flex-1 text-base leading-relaxed text-slate-800 dark:text-slate-200">{t.message}</p>
                                <footer className="mt-6 border-t border-slate-200 pt-4 dark:border-white/10">
                                    <p className="font-display text-base font-semibold text-slate-900 dark:text-white">{t.client_name}</p>
                                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                                        {t.company}
                                    </p>
                                </footer>
                            </motion.blockquote>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {clientsWithLogo.length > 0 ? (
                <section className="border-y border-slate-200/80 px-4 py-14 dark:border-white/10">
                    <div className="mx-auto max-w-6xl">
                        <h2 className="text-center font-sans text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                            Trusted by
                        </h2>
                        <div className="mt-8 flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-90">
                            {clientsWithLogo.map((c) => (
                                <div
                                    key={c.id}
                                    className="flex items-center gap-2 grayscale transition duration-300 hover:grayscale-0"
                                >
                                    <img
                                        src={c.logo_url}
                                        alt={c.company_name || 'Client'}
                                        className="h-10 w-auto max-w-[140px] object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}
        </>
    );
}
