import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api, unwrap } from '@/services/api';
import { useTheme } from '@/hooks/useTheme';
import HeroSection from '@/sections/landing/HeroSection';
import AboutSection from '@/sections/landing/AboutSection';
import ServicesSection from '@/sections/landing/ServicesSection';
import ProjectsSection from '@/sections/landing/ProjectsSection';
import SkillsSection from '@/sections/landing/SkillsSection';
import TeamSection from '@/sections/landing/TeamSection';
import TestimonialsSection from '@/sections/landing/TestimonialsSection';
import BlogSection from '@/sections/landing/BlogSection';
import ContactSection from '@/sections/landing/ContactSection';
import LandingFooter from '@/components/landing/LandingFooter';
import LandingSkeleton from '@/components/landing/LandingSkeleton';
import ProjectCaseStudyModal from '@/components/landing/ProjectCaseStudyModal';
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd';

/** Hide logo strip entries that look like placeholders (even if a logo was uploaded). */
function isPlaceholderClientName(name) {
    const n = String(name || '')
        .trim()
        .toLowerCase();
    if (!n) return true;
    return /^(acme\b|placeholder|lorem ipsum|test company|sample client|foo corp|bar inc)/i.test(n);
}

const navIds = ['about', 'services', 'projects', 'skills', 'team', 'testimonials', 'blog', 'contact'];

export default function LandingPage() {
    const { slug: blogSlug } = useParams();
    const { dark, toggle } = useTheme();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [blogPostBySlug, setBlogPostBySlug] = useState(null);
    const [projectModal, setProjectModal] = useState(null);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [hero, aboutPack, services, categories, projects, skills, team, testimonials, clients, blog, site] =
                    await Promise.all([
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

    useEffect(() => {
        setBlogPostBySlug(null);
    }, [blogSlug]);

    useEffect(() => {
        if (!blogSlug || loading) {
            return;
        }
        const list = data.blog || [];
        const found = list.find((p) => p.slug === blogSlug);
        if (found) {
            setBlogPostBySlug(found);
            return;
        }
        let cancelled = false;
        api.get(`/public/blog/${encodeURIComponent(blogSlug)}`)
            .then((r) => {
                if (!cancelled) {
                    setBlogPostBySlug(unwrap(r));
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setBlogPostBySlug(null);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [blogSlug, loading, data.blog]);

    useEffect(() => {
        if (!blogSlug || loading) {
            return undefined;
        }
        const t = window.setTimeout(() => {
            document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 450);
        return () => clearTimeout(t);
    }, [blogSlug, loading, blogPostBySlug]);

    useEffect(() => {
        if (!mobileNavOpen) {
            return undefined;
        }
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [mobileNavOpen]);

    const site = data.site;
    const title = site?.seo_default_title || site?.company_name || 'Landogz Web Solutions';
    const desc = site?.seo_default_description || '';
    const pageTitle = blogPostBySlug?.title
        ? `${blogPostBySlug.title} | ${site?.company_name || 'Landogz Web Solutions'}`
        : title;
    const pageDesc = blogPostBySlug?.excerpt || desc || '';
    const baseUrl = (site?.seo_canonical_base_url || '').replace(/\/$/, '');
    const pathname = typeof window !== 'undefined' ? window.location.pathname || '/' : '/';
    const canonicalHref = baseUrl ? `${baseUrl}${pathname === '/' ? '/' : pathname}` : undefined;
    const ogImage = site?.seo_og_image_url || site?.logo_url || '';

    if (loading) {
        return <LandingSkeleton />;
    }

    const blogPosts = (data.blog || []).slice(0, 3);
    const showBlogSection = (data.blog || []).length >= 1;
    const footerTagline = data.aboutPack?.about?.tagline;
    const clientsWithLogo = (data.clients || []).filter(
        (c) => Boolean(c.logo_url) && !isPlaceholderClientName(c.company_name),
    );
    const sectionViewport = { once: true, amount: 0.15, margin: '-48px' };

    return (
        <div className="min-h-[100dvh] min-h-[-webkit-fill-available] overflow-x-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-landogz-navy dark:text-slate-100">
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.4] dark:opacity-[0.25]"
                aria-hidden
                style={{
                    backgroundImage:
                        'radial-gradient(ellipse 120% 80% at 100% -10%, rgba(56,189,248,0.12), transparent 50%), radial-gradient(ellipse 80% 60% at 0% 100%, rgba(139,92,246,0.08), transparent 45%)',
                }}
            />

            {baseUrl ? <OrganizationJsonLd site={site} canonicalOrigin={baseUrl} /> : null}

            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDesc} />
                {site?.seo_robots ? <meta name="robots" content={site.seo_robots} /> : null}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDesc} />
                {site?.company_name ? <meta property="og:site_name" content={site.company_name} /> : null}
                {canonicalHref ? <meta property="og:url" content={canonicalHref} /> : null}
                {ogImage ? <meta property="og:image" content={ogImage} /> : null}
                <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDesc} />
                {site?.seo_twitter_handle ? (
                    <meta name="twitter:site" content={`@${String(site.seo_twitter_handle).replace(/^@/, '')}`} />
                ) : null}
                {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}
                {site?.favicon_url ? (
                    <link rel="icon" href={site.favicon_url} sizes="any" />
                ) : (
                    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                )}
                {site?.logo_url ? <link rel="apple-touch-icon" href={site.logo_url} /> : null}
            </Helmet>

            <a
                href="#about"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow"
            >
                Skip to content
            </a>

            <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/85 pt-safe backdrop-blur-md dark:border-white/10 dark:bg-landogz-navy/85">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:gap-4 sm:py-3">
                    <a
                        href="#"
                        className="flex min-h-[44px] min-w-0 flex-1 items-center gap-2 py-2 font-display font-semibold tracking-tight"
                    >
                        {site?.logo_url ? (
                            <img
                                src={site.logo_url}
                                alt={site?.company_name || 'Landogz'}
                                className="h-9 max-h-9 w-auto max-w-[140px] object-contain object-left sm:max-w-none"
                            />
                        ) : (
                            <span className="truncate text-base sm:text-lg">{site?.company_name || 'Landogz'}</span>
                        )}
                    </a>
                    <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex lg:gap-5">
                        {navIds
                            .filter((id) => id !== 'blog' || showBlogSection)
                            .map((id) => (
                                <a
                                    key={id}
                                    href={`#${id}`}
                                    className="rounded-md px-1 py-2 capitalize transition-colors hover:text-sky-600 dark:hover:text-sky-400"
                                >
                                    {id}
                                </a>
                            ))}
                    </nav>
                    <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
                        <button
                            type="button"
                            onClick={() => setMobileNavOpen(true)}
                            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden dark:border-white/15 dark:text-slate-200"
                            aria-expanded={mobileNavOpen}
                            aria-controls="landing-mobile-nav"
                            aria-label="Open menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={toggle}
                            className="hidden min-h-[44px] items-center rounded-lg border border-slate-200 px-3 text-xs font-medium hover:bg-slate-100 sm:inline-flex dark:border-white/15 dark:hover:bg-white/5"
                        >
                            {dark ? 'Light' : 'Dark'}
                        </button>
                        <button
                            type="button"
                            onClick={toggle}
                            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 text-xs font-medium sm:hidden dark:border-white/15"
                            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {dark ? '☀' : '☾'}
                        </button>
                        <a
                            href="#contact"
                            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-landogz-blue px-3 text-[11px] font-semibold text-white shadow hover:bg-blue-600 sm:text-xs"
                        >
                            Contact
                        </a>
                    </div>
                </div>
            </header>

            {mobileNavOpen ? (
                <div className="fixed inset-0 z-[60] md:hidden" id="landing-mobile-nav" role="dialog" aria-modal="true" aria-label="Site sections">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                        aria-label="Close menu"
                        onClick={() => setMobileNavOpen(false)}
                    />
                    <nav className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col gap-1 border-l border-slate-200 bg-white p-4 pt-[calc(1rem+env(safe-area-inset-top))] shadow-xl dark:border-white/10 dark:bg-landogz-navy">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Menu</span>
                            <button
                                type="button"
                                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-600 dark:text-slate-300"
                                onClick={() => setMobileNavOpen(false)}
                                aria-label="Close menu"
                            >
                                <span className="text-2xl leading-none">×</span>
                            </button>
                        </div>
                        {navIds
                            .filter((id) => id !== 'blog' || showBlogSection)
                            .map((id) => (
                                <a
                                    key={id}
                                    href={`#${id}`}
                                    className="rounded-xl px-3 py-3 text-base font-medium capitalize text-slate-800 active:bg-slate-100 dark:text-slate-100 dark:active:bg-white/10"
                                    onClick={() => setMobileNavOpen(false)}
                                >
                                    {id}
                                </a>
                            ))}
                    </nav>
                </div>
            ) : null}

            <HeroSection hero={data.hero} />
            <AboutSection aboutPack={data.aboutPack} sectionViewport={sectionViewport} />
            <ServicesSection services={data.services} sectionViewport={sectionViewport} />
            <ProjectsSection
                projects={data.projects}
                categories={data.categories}
                onOpenProject={setProjectModal}
                sectionViewport={sectionViewport}
            />
            <SkillsSection skills={data.skills} sectionViewport={sectionViewport} />
            <TeamSection team={data.team} sectionViewport={sectionViewport} />
            <TestimonialsSection
                testimonials={data.testimonials}
                clientsWithLogo={clientsWithLogo}
                sectionViewport={sectionViewport}
            />
            {showBlogSection ? <BlogSection posts={blogPosts} sectionViewport={sectionViewport} /> : null}
            <ContactSection site={site} />
            <LandingFooter site={site} tagline={footerTagline} />

            {projectModal ? <ProjectCaseStudyModal project={projectModal} onClose={() => setProjectModal(null)} /> : null}
        </div>
    );
}
