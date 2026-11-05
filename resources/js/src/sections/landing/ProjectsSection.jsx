import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '@/components/landing/SectionTitle';
import ProjectCardPreview from '@/components/landing/ProjectCardPreview';
import { sectionVariants, staggerContainer, staggerItem } from '@/sections/landing/sectionVariants';

export default function ProjectsSection({ projects = [], categories = [], onOpenProject, sectionViewport }) {
    const [activeCategory, setActiveCategory] = useState('all');

    const filtered = useMemo(() => {
        if (activeCategory === 'all') {
            return projects;
        }
        const id = Number(activeCategory);
        return projects.filter((p) => Number(p.project_category_id) === id);
    }, [projects, activeCategory]);

    return (
        <motion.section
            id="projects"
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={sectionViewport}
            className="scroll-landing-header px-4 py-16 sm:py-20"
        >
            <div className="mx-auto max-w-6xl">
                <SectionTitle
                    eyebrow="Portfolio"
                    title="Projects"
                    subtitle="Real builds with clear stack tags — tap a card for the full story."
                />

                {categories.length > 0 ? (
                    <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Project categories">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeCategory === 'all'}
                            onClick={() => setActiveCategory('all')}
                            className={`min-h-[40px] rounded-full border px-4 text-sm font-semibold transition ${
                                activeCategory === 'all'
                                    ? 'border-sky-500 bg-sky-500/15 text-sky-800 dark:border-sky-400 dark:text-sky-200'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300'
                            }`}
                        >
                            All
                        </button>
                        {categories.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                role="tab"
                                aria-selected={activeCategory === String(c.id)}
                                onClick={() => setActiveCategory(String(c.id))}
                                className={`min-h-[40px] rounded-full border px-4 text-sm font-semibold transition ${
                                    activeCategory === String(c.id)
                                        ? 'border-sky-500 bg-sky-500/15 text-sky-800 dark:border-sky-400 dark:text-sky-200'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300'
                                }`}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>
                ) : null}

                {filtered.length === 0 ? (
                    <p className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">No projects in this category yet.</p>
                ) : (
                    <motion.div
                        key={activeCategory}
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {filtered.map((p) => (
                            <motion.button
                                type="button"
                                key={p.id}
                                variants={staggerItem}
                                onClick={() => onOpenProject(p)}
                                className="group text-left overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 dark:border-white/10 dark:bg-slate-900/85 dark:hover:shadow-black/40"
                            >
                                <div className="relative aspect-[5/4] min-h-[200px] overflow-hidden bg-slate-800 sm:min-h-[220px]">
                                    {p.thumbnail_url ? (
                                        <img
                                            src={p.thumbnail_url}
                                            alt={p.title || 'Project'}
                                            className="h-full w-full object-cover brightness-[1.06] contrast-[1.03] transition duration-500 group-hover:scale-105 dark:brightness-110 dark:contrast-105"
                                        />
                                    ) : (
                                        <ProjectCardPreview title={p.title} />
                                    )}
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent px-4 pb-4 pt-12 opacity-100 sm:opacity-0 sm:transition sm:duration-300 sm:group-hover:opacity-100">
                                        <span className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg ring-1 ring-white/20 dark:bg-slate-100">
                                            View project
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 sm:p-5">
                                    <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                                    <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{p.short_description}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {(p.tech_stack || []).slice(0, 4).map((t) => (
                                            <span
                                                key={t}
                                                className="rounded-full border border-slate-200/80 bg-slate-50 px-2.5 py-0.5 text-xs font-medium dark:border-white/10 dark:bg-slate-800/90"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.section>
    );
}
