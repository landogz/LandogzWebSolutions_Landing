import { motion } from 'framer-motion';
import SectionTitle from '@/components/landing/SectionTitle';
import StatCounter from '@/components/landing/StatCounter';
import { sectionVariants, staggerContainer, staggerItem } from '@/sections/landing/sectionVariants';

const statAccents = ['sky', 'violet', 'amber', 'emerald'];

export default function AboutSection({ aboutPack, sectionViewport }) {
    return (
        <section id="about" className="scroll-landing-header px-4 py-8 sm:py-12">
            <div className="mx-auto max-w-6xl">
                <SectionTitle
                    eyebrow="Who we are"
                    title="About Us"
                    subtitle={
                        aboutPack?.about?.description ||
                        'We partner with teams to ship reliable products — API-first backends, polished frontends, and long-term maintainability.'
                    }
                />
                <motion.div variants={sectionVariants} initial="hidden" whileInView="show" viewport={sectionViewport}>
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={sectionViewport}
                        className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {(aboutPack?.stats || []).map((s, i) => (
                            <motion.div key={s.id} variants={staggerItem}>
                                <StatCounter value={s.value} label={s.label} accent={statAccents[i % statAccents.length]} />
                            </motion.div>
                        ))}
                    </motion.div>
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={sectionViewport}
                        className="mt-14 grid gap-4 md:grid-cols-3"
                    >
                        {(aboutPack?.values || []).map((v) => (
                            <motion.div
                                key={v.id}
                                variants={staggerItem}
                                className="rounded-2xl border border-slate-200/90 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900/80 dark:hover:bg-slate-900"
                            >
                                <div className="text-2xl">{v.icon}</div>
                                <h3 className="font-display mt-3 text-lg font-semibold">{v.label}</h3>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{v.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
