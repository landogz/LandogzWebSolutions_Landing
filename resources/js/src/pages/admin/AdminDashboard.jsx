import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { adminTableShell, adminTableHead, adminTh, adminTd, adminBadge } from '@/components/admin/adminTheme';

const statCards = [
    { label: 'Projects', key: 'projects', href: '/admin/projects', accent: 'from-sky-500/20 to-cyan-500/5', dot: 'bg-sky-400' },
    { label: 'Skills', key: 'skills', href: '/admin/skills', accent: 'from-violet-500/20 to-fuchsia-500/5', dot: 'bg-violet-400' },
    { label: 'Team', key: 'team_members', href: '/admin/team', accent: 'from-emerald-500/20 to-teal-500/5', dot: 'bg-emerald-400' },
    { label: 'Messages', key: 'messages', href: '/admin/messages', accent: 'from-amber-500/20 to-orange-500/5', dot: 'bg-amber-400' },
    { label: 'Blog posts', key: 'blog_posts', href: '/admin/blog', accent: 'from-rose-500/20 to-pink-500/5', dot: 'bg-rose-400' },
    { label: 'Services', key: 'services', href: '/admin/services', accent: 'from-blue-500/20 to-indigo-500/5', dot: 'bg-blue-400' },
    { label: 'Clients', key: 'clients', href: '/admin/clients', accent: 'from-cyan-500/20 to-sky-500/5', dot: 'bg-cyan-400' },
];

export default function AdminDashboard() {
    const [data, setData] = useState(null);

    function load() {
        api
            .get('/dashboard')
            .then((r) => setData(unwrap(r)))
            .catch(() => toast.error('Failed to load dashboard'));
    }

    useEffect(() => {
        load();
    }, []);

    if (!data) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-500/30 border-t-sky-400" />
                    <p className="text-sm text-slate-500">Loading dashboard…</p>
                </div>
            </div>
        );
    }

    const c = data.counts || {};

    return (
        <div>
            <AdminPageHeader
                title="Dashboard"
                description="Snapshot of your content library and the latest inbound messages."
            />
            <AdminCrudToolbar onReload={load} />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {statCards.map(({ label, key, href, accent, dot }) => (
                    <Link
                        key={key}
                        to={href}
                        className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br ${accent} p-5 shadow-lg transition hover:border-white/[0.14] hover:shadow-sky-900/20`}
                    >
                        <span className={`absolute right-4 top-4 h-2 w-2 rounded-full ${dot} opacity-80`} aria-hidden />
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
                        <p className="font-display mt-3 text-4xl font-bold tabular-nums text-white">{c[key] ?? 0}</p>
                        <p className="mt-3 text-xs font-medium text-sky-400/80 opacity-0 transition group-hover:opacity-100">Open →</p>
                    </Link>
                ))}
            </div>

            <h2 className="font-display mt-14 text-xl font-bold text-white">Recent messages</h2>
            <p className="mt-1 text-sm text-slate-500">Latest contact form submissions.</p>
            <div className={`${adminTableShell} mt-5`}>
                <table className="min-w-full text-sm">
                    <thead className={adminTableHead}>
                        <tr>
                            <th className={adminTh}>From</th>
                            <th className={adminTh}>Subject</th>
                            <th className={adminTh}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data.recent_messages || []).length === 0 ? (
                            <tr>
                                <td colSpan={3} className={`${adminTd} py-10 text-center text-slate-500`}>
                                    No messages yet.
                                </td>
                            </tr>
                        ) : (
                            (data.recent_messages || []).map((m) => (
                                <tr key={m.id} className="transition hover:bg-white/[0.02]">
                                    <td className={adminTd}>
                                        <span className="font-medium text-slate-200">{m.name}</span>
                                        <span className="mt-0.5 block text-xs text-slate-500">{m.email}</span>
                                    </td>
                                    <td className={adminTd}>{m.subject || '—'}</td>
                                    <td className={adminTd}>
                                        <span className={adminBadge}>{m.status}</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
