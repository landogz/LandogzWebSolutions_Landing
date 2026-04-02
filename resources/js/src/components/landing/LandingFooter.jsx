const NAV = [
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'team', label: 'Team' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
];

function SocialIcon({ href, label, children }) {
    if (!href) return null;
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-sky-500/40 hover:text-sky-600 dark:border-white/10 dark:bg-slate-800/90 dark:text-slate-300 dark:hover:border-sky-400/30 dark:hover:text-sky-400"
            aria-label={label}
        >
            {children}
        </a>
    );
}

export default function LandingFooter({ site, tagline }) {
    const social = site?.social_links || {};
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-200 bg-slate-50/80 pb-safe dark:border-white/10 dark:bg-slate-950/90">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:py-14">
                <div className="grid gap-10 md:grid-cols-12">
                    <div className="md:col-span-5">
                        <p className="font-display text-lg font-bold text-slate-900 dark:text-white">{site?.company_name}</p>
                        <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            {tagline || site?.footer_text || 'API-first Laravel & React — built for teams that ship.'}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <SocialIcon href={social.twitter} label="Twitter">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </SocialIcon>
                            <SocialIcon href={social.linkedin} label="LinkedIn">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </SocialIcon>
                            <SocialIcon href={social.github} label="GitHub">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </SocialIcon>
                        </div>
                    </div>
                    <div className="md:col-span-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Navigate</p>
                        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            {NAV.map(({ id, label }) => (
                                <li key={id}>
                                    <a href={`#${id}`} className="text-slate-700 transition hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400">
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="md:col-span-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Contact</p>
                        <ul className="mt-4 space-y-2 text-sm">
                            {site?.email ? (
                                <li>
                                    <a href={`mailto:${site.email}`} className="text-slate-700 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400">
                                        {site.email}
                                    </a>
                                </li>
                            ) : null}
                            {site?.phone ? <li className="text-slate-700 dark:text-slate-300">{site.phone}</li> : null}
                            <li>
                                <a href="/admin/login" className="text-sky-600 hover:underline dark:text-sky-400">
                                    Client admin
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-slate-200 pt-8 text-center text-xs text-slate-500 dark:border-white/10">
                    <p>{site?.footer_text || `© ${year} ${site?.company_name || 'Landogz'}. All rights reserved.`}</p>
                </div>
            </div>
        </footer>
    );
}
