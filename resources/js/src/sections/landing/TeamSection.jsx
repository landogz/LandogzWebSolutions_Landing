import { motion } from 'framer-motion';
import SectionTitle from '@/components/landing/SectionTitle';
import TeamAvatar from '@/components/landing/TeamAvatar';
import { sectionVariants, staggerContainer, staggerItem, prefersReducedMotion } from '@/sections/landing/sectionVariants';

export default function TeamSection({ team = [], sectionViewport }) {
    const reduce = prefersReducedMotion();

    return (
        <motion.section
            id="team"
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={sectionViewport}
            className="scroll-landing-header px-4 py-16 sm:py-20"
        >
            <div className="mx-auto max-w-6xl">
                <SectionTitle
                    eyebrow="People"
                    title="Team Composition"
                    subtitle="The people behind Landogz — analysis, engineering, design, and delivery."
                />
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={sectionViewport}
                    className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {team.map((m, mi) => (
                        <motion.div
                            key={m.id}
                            variants={staggerItem}
                            whileHover={reduce ? undefined : { y: -4 }}
                            className="rounded-2xl border border-slate-200/90 bg-white/90 p-6 text-center shadow-sm dark:border-white/10 dark:bg-slate-900/85"
                        >
                            <TeamAvatar name={m.name} photoUrl={m.photo_url} size={104} variant={mi} />
                            <h3 className="font-display mt-5 text-lg font-semibold">{m.name}</h3>
                            {m.position ? (
                                <span className="mt-2 inline-flex rounded-full border border-sky-500/25 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-800 dark:border-sky-400/30 dark:bg-sky-500/15 dark:text-sky-300">
                                    {m.position}
                                </span>
                            ) : null}
                            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{m.bio}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
}
