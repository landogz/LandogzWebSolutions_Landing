import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeroVisual from '@/components/landing/HeroVisual';
import { splitHeadlineToTwoLines } from '@/utils/splitHeadlineToTwoLines';

/** Inline pattern — avoid Tailwind `bg-[url('data:…')]` (nested quotes break @vitejs/plugin-react preamble). */
const HERO_GRID_BG =
    'data:image/svg+xml,' +
    encodeURIComponent(
        '<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h60v60H0z" fill="none"/><path d="M30 0l30 30-30 30L0 30z" fill="#2563eb" fill-opacity="0.08"/></svg>',
    );

export default function HeroSection({ hero }) {
    const [word, setWord] = useState(0);
    const words = hero?.animated_words?.length ? hero.animated_words : ['Build', 'Ship', 'Scale'];
    const headlineLines = splitHeadlineToTwoLines(hero?.headline);

    useEffect(() => {
        const t = setInterval(() => setWord((w) => (w + 1) % words.length), 2200);
        return () => clearInterval(t);
    }, [words.length]);

    return (
        <section className="relative flex min-h-[min(92dvh,680px)] items-center overflow-x-hidden overflow-y-visible px-4 pb-20 pt-[calc(6rem+env(safe-area-inset-top,0px))] sm:min-h-[66vh] sm:pb-24 sm:pt-24 lg:min-h-[70vh] lg:pb-28">
            {/* Mesh + grid signature background */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(56,189,248,0.18),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(56,189,248,0.12),transparent)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(139,92,246,0.12),transparent)] dark:bg-[radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(139,92,246,0.08),transparent)]" />
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-25"
                style={{ backgroundImage: `url("${HERO_GRID_BG}")` }}
            />
            <div className="relative mx-auto grid w-full min-w-0 max-w-6xl items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">
                <div className="mx-auto min-w-0 max-w-xl text-center lg:mx-0 lg:max-w-3xl lg:text-left">
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-sans text-xs font-bold uppercase tracking-[0.35em] text-sky-600 dark:text-sky-400"
                    >
                        {hero?.company_tagline}
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                        className="font-display mt-5 text-[clamp(1.45rem,2.75vw+0.7rem,3.15rem)] font-black leading-[1.08] tracking-tight sm:leading-[1.05] [&_*]:[text-decoration-line:none] [&_*]:[text-decoration-style:none] [&_*]:[text-decoration-thickness:0]"
                    >
                        {headlineLines.map((line, i) => (
                            <span
                                key={i}
                                className={`block max-w-full break-words border-b-0 text-slate-900 [text-decoration-line:none] dark:text-white sm:whitespace-nowrap ${
                                    i > 0 ? 'mt-1 sm:mt-1.5' : ''
                                }`}
                            >
                                {line}
                            </span>
                        ))}
                    </motion.h1>
                    <div
                        className="mx-auto mt-4 h-1.5 w-28 rounded-full bg-gradient-to-r from-sky-500 via-violet-500 to-fuchsia-500 shadow-sm shadow-sky-500/30 lg:mx-0"
                        aria-hidden
                    />

                    <div
                        className="mt-6 flex min-h-[3rem] flex-col items-center gap-2 sm:min-h-0 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-3 lg:justify-start"
                        aria-live="polite"
                        aria-label="Services we deliver"
                    >
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">We build</span>
                        <span className="hidden text-slate-400 sm:inline" aria-hidden>
                            →
                        </span>
                        <motion.span
                            key={words[word]}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className="inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 font-display text-lg font-bold tracking-tight text-sky-700 dark:border-sky-400/35 dark:bg-sky-500/15 dark:text-sky-300 sm:text-xl"
                        >
                            {words[word]}
                        </motion.span>
                    </div>

                    <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 lg:mx-0 lg:max-w-lg">
                        {hero?.subheading}
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                        <a
                            href={hero?.cta_primary_url || '#projects'}
                            className="inline-flex items-center justify-center rounded-xl bg-landogz-blue px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-600 hover:shadow-blue-500/40"
                        >
                            {hero?.cta_primary_text || 'View Our Work'}
                        </a>
                        <a
                            href={hero?.cta_secondary_url || '#contact'}
                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white/60 px-7 py-3.5 text-sm font-semibold text-slate-800 backdrop-blur-sm transition hover:bg-white dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                        >
                            {hero?.cta_secondary_text || 'Get In Touch'}
                        </a>
                    </div>

                </div>

                <div className="min-w-0 w-full max-w-full justify-self-center lg:justify-self-end">
                    <HeroVisual />
                </div>
            </div>

            <motion.a
                href="#about"
                className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] left-1/2 z-10 flex min-h-[48px] min-w-[48px] -translate-x-1/2 flex-col items-center justify-center gap-1.5 text-sky-700 drop-shadow-sm transition active:opacity-80 dark:text-sky-200"
                aria-label="Scroll to About"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-800 dark:text-sky-100">Scroll</span>
                <motion.svg
                    className="h-7 w-7 text-sky-600 dark:text-sky-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.25}
                    aria-hidden
                    animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.06, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
            </motion.a>
        </section>
    );
}
