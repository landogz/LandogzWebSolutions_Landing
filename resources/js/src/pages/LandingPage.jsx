import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { api, unwrap } from '@/services/api';
import { useTheme } from '@/hooks/useTheme';
import HeroSection from '@/sections/landing/HeroSection';
import ContactSection from '@/sections/landing/ContactSection';
import { sectionVariants } from '@/sections/landing/sectionVariants';
import SectionTitle from '@/components/landing/SectionTitle';
import StatCounter from '@/components/landing/StatCounter';
import TeamAvatar from '@/components/landing/TeamAvatar';
import ProjectCardPreview from '@/components/landing/ProjectCardPreview';
import LandingFooter from '@/components/landing/LandingFooter';
import { groupSkillsByCategory } from '@/utils/groupSkillsByCategory';
import { getBlogCardVisual } from '@/utils/blogCardVisual';

const statAccents = ['sky', 'violet', 'amber', 'emerald'];

/** Hide logo strip entries that look like placeholders (even if a logo was uploaded). */
function isPlaceholderClientName(name) {
    const n = String(name || '')
        .trim()
        .toLowerCase();
    if (!n) return true;
    return /^(acme\b|placeholder|lorem ipsum|test company|sample client|foo corp|bar inc)/i.test(n);
}

const serviceShell = [
    'border-sky-500/25 bg-gradient-to-br from-sky-500/[0.08] to-transparent hover:border-sky-400/40 hover:shadow-lg hover:shadow-sky-500/10 dark:from-sky-500/10',
    'border-violet-500/25 bg-gradient-to-br from-violet-500/[0.08] to-transparent hover:border-violet-400/40 hover:shadow-lg hover:shadow-violet-500/10 dark:from-violet-500/10',
    'border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.08] to-transparent hover:border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-500/10 dark:from-emerald-500/10',
];

export default function LandingPage() {
    const { dark, toggle } = useTheme();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [projectModal, setProjectModal] = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [
                    hero,
                    aboutPack,
                    services,
                    categories,
                    projects,
                    skills,
                    team,
                    testimonials,
                    clients,
                    blog,
                    site,
                ] = await Promise.all([
                    api.get('/public/hero').then((r) => unwrap(r)),
                    api.get('/public/about').then((r) => unwrap(r)),
                    api.get('/public/services').then((r) => unwrap(r)),
                    api.get('/public/project-categories').then((r) => unwrap(r)),
                    api.get('/public/projects').then((r) => unwrap(r)),
                    api.get('/public/skills').then((r) => unwrap(r)),
                    api.get('/public/team').then((r) => unwrap(r)),
                    api.get('/public/testimonials').then((r) => unwrap(r)),
                    api.get('/public/clients').then((r) => unwrap(r)),
                    api.get('/public/blog').then((r) => unwrap(r)),
                    api.get('/public/site-settings').then((r) => unwrap(r)),
                ]);
                if (!cancelled) {
                    setData({
                        hero,
                        aboutPack,
                        services,
                        categories,
                        projects,
                        skills,
                        team,
                        testimonials,
                        clients,
                        blog,
                        site,
                    });
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const site = data.site;
    const title = site?.seo_default_title || site?.company_name || 'Landogz Web Solutions';

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
                <div className="h-10 w-10 border-2 border-landogz-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const blogPosts = (data.blog || []).slice(0, 3);
    const showBlogSection = (data.blog || []).length >= 1;
    const skillGroups = groupSkillsByCategory(data.skills || []);
    const footerTagline = data.aboutPack?.about?.tagline;
    const clientsWithLogo = (data.clients || []).filter((c) => Boolean(c.logo_url) && !isPlaceholderClientName(c.company_name));

    const sectionViewport = { once: true, amount: 0.15, margin: '-48px' };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-landogz-navy dark:text-slate-100 transition-colors">
            {/* Subtle page texture */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.4] dark:opacity-[0.25]"
                aria-hidden
                style={{
                    backgroundImage:
                        'radial-gradient(ellipse 120% 80% at 100% -10%, rgba(56,189,248,0.12), transparent 50%), radial-gradient(ellipse 80% 60% at 0% 100%, rgba(139,92,246,0.08), transparent 45%)',
                }}
            />

            <Helmet>
                <title>{title}</title>
                <meta name="description" content={site?.seo_default_description || ''} />
            </Helmet>

            <header className="fixed top-0 inset-x-0 z-50 border-b border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-landogz-navy/85 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
                    <a href="#" className="flex items-center gap-2 font-display font-semibold tracking-tight">
                        {site?.logo_url ? (
                            <img src={site.logo_url} alt="" className="h-9 w-auto" />
                        ) : (
                            <span className="text-lg">{site?.company_name || 'Landogz'}</span>
                        )}
                    </a>
                    <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
                        {['about', 'services', 'projects', 'skills', 'team', 'testimonials', ...(showBlogSection ? ['blog'] : []), 'contact'].map((id) => (
                            <a key={id} href={`#${id}`} className="hover:text-sky-600 dark:hover:text-sky-400 capitalize transition-colors">
                                {id}
                            </a>
                        ))}
                    </nav>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={toggle}
                            className="rounded-lg border border-slate-200 dark:border-white/15 px-3 py-1.5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-white/5"
                        >
                            {dark ? 'Light' : 'Dark'}
                        </button>
                        <a
                            href="/admin/login"
                            className="rounded-lg bg-landogz-blue px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-blue-600"
                        >
                            Admin
                        </a>
                    </div>
                </div>
            </header>

            <HeroSection hero={data.hero} />

            <section id="about" className="scroll-mt-24 px-4 py-8 sm:py-12">
                <div className="mx-auto max-w-6xl">
                    <SectionTitle
                        eyebrow="Who we are"
                        title="About Us"
                        subtitle={data.aboutPack?.about?.description || 'We partner with teams to ship reliable products — API-first backends, polished frontends, and long-term maintainability.'}
                    />
                    <motion.div
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={sectionViewport}
                    >
                        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {(data.aboutPack?.stats || []).map((s, i) => (
                                <StatCounter key={s.id} value={s.value} label={s.label} accent={statAccents[i % statAccents.length]} />
                            ))}
                        </div>
                        <div className="mt-14 grid gap-4 md:grid-cols-3">
                            {(data.aboutPack?.values || []).map((v) => (
                                <div
                                    key={v.id}
                                    className="rounded-2xl border border-slate-200/90 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900/80 dark:hover:bg-slate-900"
                                >
                                    <div className="text-2xl">{v.icon}</div>
                                    <h3 className="font-display mt-3 text-lg font-semibold">{v.label}</h3>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{v.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            <motion.section
                id="services"
                variants={sectionVariants}
                initial="hidden"
                whileInView="show"
                viewport={sectionViewport}
                className="scroll-mt-24 border-y border-slate-200/80 bg-slate-100/90 dark:border-white/5 dark:bg-black/25 px-4 py-16 sm:py-20"
            >
                <div className="mx-auto max-w-6xl">
                    <SectionTitle eyebrow="What we do" title="Services" subtitle="API-first backends, polished SPAs, and dependable delivery." />
                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {(data.services || []).map((s, i) => (
                            <motion.div
                                key={s.id}
                                whileHover={{ y: -6 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className={`group rounded-2xl border bg-white p-7 shadow-sm dark:border-white/10 dark:bg-slate-900/90 ${serviceShell[i % serviceShell.length]}`}
                            >
                                <div className="text-3xl text-sky-600 transition group-hover:scale-110 dark:text-sky-400">{s.icon}</div>
                                <h3 className="font-display mt-4 text-xl font-semibold tracking-tight">{s.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{s.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            <motion.section
                id="projects"
                variants={sectionVariants}
                initial="hidden"
                whileInView="show"
                viewport={sectionViewport}
                className="scroll-mt-24 px-4 py-16 sm:py-20"
            >
                <div className="mx-auto max-w-6xl">
                    <SectionTitle
                        eyebrow="Portfolio"
                        title="Projects"
                        subtitle="Real builds with clear stack tags — tap a card for the full story."
                    />
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {(data.projects || []).map((p) => (
                            <button
                                type="button"
                                key={p.id}
                                onClick={() => setProjectModal(p)}
                                className="group text-left overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 dark:border-white/10 dark:bg-slate-900/85 dark:hover:shadow-black/40"
                            >
                                <div className="relative aspect-[5/4] min-h-[200px] overflow-hidden bg-slate-800 sm:min-h-[220px]">
                                    {p.thumbnail_url ? (
                                        <img
                                            src={p.thumbnail_url}
                                            alt=""
                                            className="h-full w-full object-cover brightness-[1.06] contrast-[1.03] transition duration-500 group-hover:scale-105 dark:brightness-110 dark:contrast-105"
                                        />
                                    ) : (
                                        <ProjectCardPreview title={p.title} />
                                    )}
                                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/65 opacity-0 transition duration-300 group-hover:opacity-100">
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
                            </button>
                        ))}
                    </div>
                </div>
            </motion.section>

            <motion.section
                id="skills"
                variants={sectionVariants}
                initial="hidden"
                whileInView="show"
                viewport={sectionViewport}
                className="scroll-mt-24 border-y border-slate-200/80 bg-slate-100/90 dark:border-white/5 dark:bg-black/25 px-4 py-16 sm:py-20"
            >
                <div className="mx-auto max-w-6xl">
                    <SectionTitle
                        eyebrow="Stack"
                        title="Skills & Technologies"
                        subtitle="Grouped by domain — proficiency shown as a compact badge, not a progress bar."
                    />
                    <div className="mt-12 space-y-12">
                        {skillGroups.map(([category, list]) => (
                            <div key={category} className="border-l-4 border-sky-500 pl-5 dark:border-sky-400">
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
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            <motion.section
                id="team"
                variants={sectionVariants}
                initial="hidden"
                whileInView="show"
                viewport={sectionViewport}
                className="scroll-mt-24 px-4 py-16 sm:py-20"
            >
                <div className="mx-auto max-w-6xl">
                    <SectionTitle eyebrow="People" title="Our Team" subtitle="Engineers who care about architecture, UX, and shipping on time." />
                    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {(data.team || []).map((m, mi) => (
                            <motion.div
                                key={m.id}
                                whileHover={{ y: -4 }}
                                className="rounded-2xl border border-slate-200/90 bg-white/90 p-6 text-center shadow-sm dark:border-white/10 dark:bg-slate-900/85"
                            >
                                <TeamAvatar name={m.name} photoUrl={m.photo_url} size={104} variant={mi} />
                                <h3 className="font-display mt-5 text-lg font-semibold">{m.name}</h3>
                                <p className="text-sm text-sky-700 dark:text-sky-400">{m.position}</p>
                                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{m.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            <motion.section
                id="testimonials"
                variants={sectionVariants}
                initial="hidden"
                whileInView="show"
                viewport={sectionViewport}
                className="scroll-mt-24 border-y border-slate-200/80 bg-gradient-to-b from-slate-100/90 to-slate-50 dark:border-white/5 dark:from-black/30 dark:to-landogz-navy px-4 py-16 sm:py-20"
            >
                <div className="mx-auto max-w-6xl">
                    <SectionTitle eyebrow="Social proof" title="Testimonials" subtitle="Teams we’ve shipped with — in their words." />
                    <div className="mt-12 flex flex-wrap justify-center gap-6">
                        {(data.testimonials || []).map((t) => (
                            <blockquote
                                key={t.id}
                                className="flex h-full w-full max-w-[22rem] flex-shrink-0 flex-col rounded-2xl border border-slate-200/90 bg-white p-6 text-left shadow-md dark:border-white/10 dark:bg-slate-900/90 sm:max-w-[20.5rem]"
                            >
                                <span className="font-display text-4xl leading-none text-sky-500/50 dark:text-sky-400/50" aria-hidden>
                                    “
                                </span>
                                <div className="mt-1 text-amber-500" aria-hidden>
                                    {'★'.repeat(t.rating)}
                                </div>
                                <p className="mt-4 flex-1 text-base leading-relaxed text-slate-800 dark:text-slate-200">{t.message}</p>
                                <footer className="mt-6 border-t border-slate-200 pt-4 dark:border-white/10">
                                    <p className="font-display text-base font-semibold text-slate-900 dark:text-white">{t.client_name}</p>
                                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">{t.company}</p>
                                </footer>
                            </blockquote>
                        ))}
                    </div>
                </div>
            </motion.section>

            {clientsWithLogo.length > 0 ? (
                <section className="border-y border-slate-200/80 px-4 py-14 dark:border-white/10">
                    <div className="mx-auto max-w-6xl">
                        <h2 className="text-center font-sans text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Trusted by</h2>
                        <div className="mt-8 flex flex-wrap justify-center gap-10 opacity-90">
                            {clientsWithLogo.map((c) => (
                                <div key={c.id} className="flex items-center gap-2 grayscale transition hover:grayscale-0">
                                    <img src={c.logo_url} alt={c.company_name || 'Client'} className="h-10 w-auto max-w-[140px] object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            {showBlogSection ? (
                <section id="blog" className="scroll-mt-24 px-4 py-16 sm:py-20">
                    <div className="mx-auto max-w-6xl">
                        <SectionTitle eyebrow="Writing" title="Latest from the blog" subtitle="Notes on Laravel, React, and shipping with confidence." />
                        <motion.div
                            variants={sectionVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={sectionViewport}
                            className={`mt-12 grid gap-6 ${blogPosts.length === 1 ? 'md:max-w-lg md:mx-auto' : blogPosts.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}
                        >
                            {blogPosts.map((b, bi) => {
                                const visual = getBlogCardVisual(bi);
                                return (
                                    <article
                                        key={b.id}
                                        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-900/85"
                                    >
                                        <div
                                            className={`relative aspect-[16/10] overflow-hidden ${b.featured_image_url ? 'bg-slate-200 dark:bg-slate-800' : visual.className}`}
                                        >
                                            {b.featured_image_url ? (
                                                <img
                                                    src={b.featured_image_url}
                                                    alt=""
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <>
                                                    <div
                                                        className="absolute inset-0"
                                                        style={{ backgroundImage: visual.pattern }}
                                                        aria-hidden
                                                    />
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
                                            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">{b.category}</p>
                                            <h3 className="font-display mt-2 flex-1 text-lg font-semibold leading-snug">{b.title}</h3>
                                            <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{b.excerpt}</p>
                                        </div>
                                    </article>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>
            ) : null}

            <ContactSection site={site} />

            <LandingFooter site={site} tagline={footerTagline} />

            {projectModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-white p-6 shadow-2xl dark:border-white/15 dark:bg-slate-950">
                        {projectModal.thumbnail_url ? (
                            <img src={projectModal.thumbnail_url} alt="" className="mb-4 max-h-56 w-full rounded-xl object-cover" />
                        ) : (
                            <div className="mb-4 aspect-video w-full overflow-hidden rounded-xl">
                                <ProjectCardPreview title={projectModal.title} />
                            </div>
                        )}
                        <div className="flex justify-between gap-4">
                            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">{projectModal.title}</h3>
                            <button type="button" className="text-slate-500 hover:text-slate-800 dark:hover:text-white" onClick={() => setProjectModal(null)}>
                                ✕
                            </button>
                        </div>
                        <p className="mt-4 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{projectModal.full_description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {(projectModal.tech_stack || []).map((t) => (
                                <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800">
                                    {t}
                                </span>
                            ))}
                        </div>
                        <div className="mt-6 flex gap-4">
                            {projectModal.project_url && (
                                <a href={projectModal.project_url} className="font-medium text-sky-600 hover:underline dark:text-sky-400" target="_blank" rel="noreferrer">
                                    Live site
                                </a>
                            )}
                            {projectModal.github_url && (
                                <a href={projectModal.github_url} className="font-medium text-sky-600 hover:underline dark:text-sky-400" target="_blank" rel="noreferrer">
                                    GitHub
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
