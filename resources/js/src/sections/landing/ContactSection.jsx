import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { api, unwrap } from '@/services/api';
import { sectionVariants } from '@/sections/landing/sectionVariants';
import SectionTitle from '@/components/landing/SectionTitle';

function ContactDetailRow({ icon, label, children }) {
    return (
        <div className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white/60 px-4 py-4 dark:border-white/10 dark:bg-slate-800/40">
            <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"
                aria-hidden
            >
                {icon}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">{label}</p>
                <div className="mt-1 text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">{children}</div>
            </div>
        </div>
    );
}

function SocialLink({ href, label, children }) {
    if (!href) return null;
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-sky-500/50 hover:text-sky-600 dark:border-white/15 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:border-sky-400/40 dark:hover:text-sky-300"
            aria-label={label}
        >
            {children}
        </a>
    );
}

export default function ContactSection({ site }) {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);
    const social = site?.social_links || {};

    async function submit(e) {
        e.preventDefault();
        setSending(true);
        try {
            await api.post('/public/contact', form).then((r) => unwrap(r));
            toast.success('Thanks! We will get back to you soon.');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            toast.error(err.message || 'Failed to send');
        } finally {
            setSending(false);
        }
    }

    const mapsQuery = site?.address ? encodeURIComponent(site.address.replace(/\n/g, ' ')) : '';

    return (
        <section id="contact" className="scroll-mt-24 px-4 py-20">
            <div className="mx-auto max-w-6xl">
                <SectionTitle
                    eyebrow="Get in touch"
                    title="Let’s build something solid"
                    subtitle="Tell us about your product, timeline, and stack — we’ll respond with next steps."
                />

                <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.15, margin: '-48px' }}
                    className="mt-12 grid gap-8 lg:grid-cols-5 lg:gap-10 lg:items-start"
                >
                    <div className="flex flex-col lg:col-span-2">
                        <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 dark:shadow-none sm:p-8">
                            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Studio</h3>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Reach us directly — we reply within one business day.</p>
                            <div className="mt-8 space-y-4">
                                {site?.address ? (
                                    <ContactDetailRow
                                        label="Address"
                                        icon={
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        }
                                    >
                                        <p className="whitespace-pre-line">{site.address}</p>
                                        {mapsQuery ? (
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:underline dark:text-sky-400"
                                            >
                                                Open in Google Maps
                                                <span aria-hidden>→</span>
                                            </a>
                                        ) : null}
                                    </ContactDetailRow>
                                ) : null}
                                {site?.email ? (
                                    <ContactDetailRow
                                        label="Email"
                                        icon={
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                        }
                                    >
                                        <a className="text-sky-600 hover:underline dark:text-sky-400" href={`mailto:${site.email}`}>
                                            {site.email}
                                        </a>
                                    </ContactDetailRow>
                                ) : null}
                                {site?.phone ? (
                                    <ContactDetailRow
                                        label="Phone"
                                        icon={
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                        }
                                    >
                                        <a className="text-sky-600 hover:underline dark:text-sky-400" href={`tel:${site.phone.replace(/\s/g, '')}`}>
                                            {site.phone}
                                        </a>
                                    </ContactDetailRow>
                                ) : null}
                            </div>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <SocialLink href={social.twitter} label="Twitter">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </SocialLink>
                                <SocialLink href={social.linkedin} label="LinkedIn">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </SocialLink>
                                <SocialLink href={social.github} label="GitHub">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                        <path
                                            fillRule="evenodd"
                                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </SocialLink>
                            </div>
                        </div>
                        {site?.maps_embed_url ? (
                            <details className="mt-6 w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 dark:bg-slate-900/50">
                                <summary className="cursor-pointer list-none bg-slate-50/50 px-4 py-3 text-center text-sm font-semibold text-slate-800 dark:bg-slate-900/80 dark:text-slate-200 [&::-webkit-details-marker]:hidden">
                                    Show map embed
                                </summary>
                                <div className="aspect-video w-full overflow-hidden border-t border-slate-200 dark:border-white/10 dark:bg-slate-950">
                                    <iframe title="map" src={site.maps_embed_url} className="h-full w-full border-0" loading="lazy" />
                                </div>
                            </details>
                        ) : null}
                    </div>

                    <div className="lg:col-span-3">
                        <form
                            onSubmit={submit}
                            className="space-y-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-lg shadow-slate-900/5 ring-1 ring-slate-900/[0.06] dark:border-white/10 dark:bg-slate-950 dark:shadow-black/40 dark:ring-white/10 sm:p-8"
                        >
                            <p className="text-base font-semibold text-slate-900 dark:text-white">Send a message</p>
                            <input
                                required
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                                placeholder="Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                            <input
                                required
                                type="email"
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                            <input
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                                placeholder="Subject"
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            />
                            <textarea
                                required
                                rows={5}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                                placeholder="Tell us about your project…"
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                            />
                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full rounded-xl bg-gradient-to-r from-landogz-blue to-sky-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-600 hover:to-sky-500 disabled:opacity-60"
                            >
                                {sending ? 'Sending…' : 'Send message'}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
