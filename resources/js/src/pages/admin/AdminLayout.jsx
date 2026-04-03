import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { api, unwrap } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

function buildNavGroups(role) {
    const overviewItems = [
        { label: 'Dashboard', to: '/admin', end: true },
        ...(role === 'super_admin' ? [{ label: 'Users', to: '/admin/users' }] : []),
    ];
    return [
    {
        title: 'Overview',
        items: overviewItems,
    },
    {
        title: 'Site & content',
        items: [
            { label: 'Hero', to: '/admin/hero' },
            { label: 'About', to: '/admin/about' },
            { label: 'Site settings', to: '/admin/settings' },
            { label: 'Projects', to: '/admin/projects' },
            { label: 'Categories', to: '/admin/categories' },
            { label: 'Services', to: '/admin/services' },
            { label: 'Skills', to: '/admin/skills' },
            { label: 'Blog', to: '/admin/blog' },
        ],
    },
    {
        title: 'People & proof',
        items: [
            { label: 'Team', to: '/admin/team' },
            { label: 'Testimonials', to: '/admin/testimonials' },
            { label: 'Clients', to: '/admin/clients' },
        ],
    },
    {
        title: 'Data',
        items: [
            { label: 'About stats', to: '/admin/about-stats' },
            { label: 'Company values', to: '/admin/company-values' },
            { label: 'Messages', to: '/admin/messages' },
        ],
    },
];
}


function NavItems({ onNavigate }) {
    const role = useAuthStore((s) => s.user?.role);
    const navGroups = buildNavGroups(role);
    return (
        <>
            {navGroups.map((group) => (
                <div key={group.title} className="mt-6 first:mt-0">
                    <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">{group.title}</p>
                    <div className="space-y-0.5">
                        {group.items.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                onClick={() => onNavigate?.()}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                                        isActive
                                            ? 'bg-gradient-to-r from-sky-500/20 to-violet-500/10 text-white shadow-[inset_0_0_0_1px_rgba(56,189,248,0.25)]'
                                            : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                                    }`
                                }
                            >
                                <span
                                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-40"
                                    aria-hidden
                                />
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
}

export default function AdminLayout() {
    const nav = useNavigate();
    const logout = useAuthStore((s) => s.logout);
    const setAuth = useAuthStore((s) => s.setAuth);
    const user = useAuthStore((s) => s.user);
    const token = useAuthStore((s) => s.token);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (!token || user) {
            return undefined;
        }
        let cancelled = false;
        (async () => {
            try {
                const u = unwrap(await api.get('/auth/me'));
                if (!cancelled) {
                    setAuth(token, u);
                }
            } catch {
                if (!cancelled) {
                    logout();
                    nav('/admin/login');
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [token, user, setAuth, logout, nav]);

    useEffect(() => {
        if (!mobileOpen) return undefined;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [mobileOpen]);

    async function handleLogout() {
        try {
            await api.post('/auth/logout');
        } catch {
            /* ignore */
        }
        logout();
        toast.success('Logged out');
        nav('/admin/login');
    }

    return (
        <div className="flex min-h-[100dvh] min-h-[-webkit-fill-available] bg-slate-950 text-slate-100">
            {/* Desktop sidebar */}
            <aside className="admin-sidebar-bg relative z-20 hidden w-64 shrink-0 flex-col border-r border-white/[0.06] pt-safe md:flex lg:w-72">
                <div className="flex flex-1 flex-col overflow-y-auto px-4 pb-6 pt-6">
                    <div className="px-3">
                        <p className="font-display text-lg font-bold tracking-tight text-white">Landogz</p>
                        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Studio console</p>
                    </div>
                    <nav className="mt-8 flex-1">
                        <NavItems />
                    </nav>
                    <div className="mt-8 border-t border-white/[0.06] pt-6">
                        {user?.name ? (
                            <p className="truncate px-3 text-xs text-slate-500">
                                Signed in as <span className="font-medium text-slate-300">{user.name}</span>
                            </p>
                        ) : null}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="mt-3 w-full rounded-xl border border-white/[0.10] bg-white/[0.03] py-2.5 text-sm font-medium text-slate-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-200"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile header */}
            <div className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between border-b border-white/[0.08] bg-slate-950/90 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl md:hidden">
                <div>
                    <p className="font-display text-base font-bold text-white">Landogz</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Admin</p>
                </div>
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-white/10 text-slate-200"
                    aria-label="Open menu"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {mobileOpen ? (
                <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        aria-label="Close menu"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="admin-sidebar-bg absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-white/[0.08] shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/[0.06] p-4 pt-[max(1rem,env(safe-area-inset-top))]">
                            <span className="text-sm font-semibold text-white">Menu</span>
                            <button
                                type="button"
                                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-2xl text-slate-400"
                                onClick={() => setMobileOpen(false)}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto px-3 py-4">
                            <NavItems onNavigate={() => setMobileOpen(false)} />
                        </nav>
                        <div className="border-t border-white/[0.06] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileOpen(false);
                                    handleLogout();
                                }}
                                className="w-full rounded-xl border border-red-500/25 bg-red-500/10 py-3 text-sm font-medium text-red-200"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            <main className="admin-app-bg relative flex-1 overflow-x-hidden overflow-y-auto px-4 pb-10 pt-[calc(4.25rem+env(safe-area-inset-top,0px))] sm:px-6 md:px-8 md:pb-12 md:pt-8 lg:px-10">
                <div className="mx-auto max-w-6xl">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
