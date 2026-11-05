import { motion } from 'framer-motion';
import SectionTitle from '@/components/landing/SectionTitle';
import { groupSkillsByCategory } from '@/utils/groupSkillsByCategory';
import { sectionVariants, staggerContainer, staggerItem } from '@/sections/landing/sectionVariants';

export default function SkillsSection({ skills = [], sectionViewport }) {
    const skillGroups = groupSkillsByCategory(skills);

    return (
        <motion.section
            id="skills"
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={sectionViewport}
            className="scroll-landing-header border-y border-slate-200/80 bg-slate-100/90 px-4 py-16 dark:border-white/5 dark:bg-black/25 sm:py-20"
        >
            <div className="mx-auto max-w-6xl">
                <SectionTitle
                    eyebrow="Stack"
                    title="Skills & Technologies"
                    subtitle="Grouped by domain — proficiency shown as a compact badge, not a progress bar."
                />
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={sectionViewport}
                    className="mt-12 space-y-12"
                >
                    {skillGroups.map(([category, list]) => (
                        <motion.div key={category} variants={staggerItem} className="border-l-4 border-sky-500 pl-5 dark:border-sky-400">
                            <h3 className="font-display text-base font-bold uppercase tracking-[0.12em] text-slate-800 dark:text-slate-100 sm:text-lg">
                                {category}
                            </h3>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {list.map((sk) => (
                                    <span
                                        key={sk.id}
                                        className="inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-gradient-to-r from-sky-500/10 to-violet-500/5 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm dark:border-sky-400/20 dark:from-sky-500/15 dark:to-violet-500/10 dark:text-slate-100"
                                    >
                                        {sk.name}
                                        <span className="rounded-md bg-white/70 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                            {sk.proficiency}%
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
}
