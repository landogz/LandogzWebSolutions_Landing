import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionTitle from '@/components/landing/SectionTitle';
import { getBlogCardVisual } from '@/utils/blogCardVisual';
import { staggerContainer, staggerItem } from '@/sections/landing/sectionVariants';

export default function BlogSection({ posts = [], sectionViewport }) {
    if (!posts.length) {
        return null;
    }

    return (
        <section id="blog" className="scroll-landing-header px-4 py-16 sm:py-20">
            <div className="mx-auto max-w-6xl">
                <SectionTitle eyebrow="Writing" title="Latest from the blog" subtitle="Notes on Laravel, React, and shipping with confidence." />
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={sectionViewport}
                    className={`mt-12 grid gap-6 ${
                        posts.length === 1
                            ? 'md:mx-auto md:max-w-lg'
                            : posts.length === 2
                              ? 'md:grid-cols-2'
                              : 'md:grid-cols-2 lg:grid-cols-3'
                    }`}
                >
                    {posts.map((b, bi) => {
                        const visual = getBlogCardVisual(bi);
                        return (
                            <motion.article
                                key={b.id}
                                variants={staggerItem}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-900/85"
                            >
                                <Link
                                    to={`/blog/${b.slug}`}
                                    className="flex min-h-0 flex-1 flex-col text-inherit no-underline outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
                                >
                                    <div
                                        className={`relative aspect-[16/10] overflow-hidden ${
                                            b.featured_image_url ? 'bg-slate-200 dark:bg-slate-800' : visual.className
                                        }`}
                                    >
                                        {b.featured_image_url ? (
                                            <img
                                                src={b.featured_image_url}
                                                alt={b.title || 'Blog post'}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <>
                                                <div className="absolute inset-0" style={{ backgroundImage: visual.pattern }} aria-hidden />
                                                <div
                                                    className="absolute inset-0 opacity-[0.12] dark:opacity-[0.18]"
                                                    style={{
                                                        backgroundImage:
                                                            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)',
                                                        backgroundSize: '18px 18px',
                                                    }}
                                                    aria-hidden
                                                />
                                                <div className="relative flex h-full flex-col items-start justify-end p-5">
                                                    <span className="rounded-full bg-white/25 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white ring-1 ring-white/30 backdrop-blur-sm dark:bg-black/20">
                                                        {b.category}
                                                    </span>
                                                    <p className="mt-3 line-clamp-2 font-display text-lg font-bold leading-snug text-white drop-shadow-sm">
                                                        {b.title}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col p-5">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                                            {b.category}
                                        </p>
                                        <h3 className="font-display mt-2 flex-1 text-lg font-semibold leading-snug">{b.title}</h3>
                                        <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{b.excerpt}</p>
                                    </div>
                                </Link>
                            </motion.article>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
