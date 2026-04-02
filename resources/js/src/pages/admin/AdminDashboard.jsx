import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';

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
        return <div className="text-slate-400">Loading…</div>;
    }

    const c = data.counts || {};

    return (
        <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <AdminCrudToolbar onReload={load} />
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    ['Projects', c.projects, '/admin/projects'],
                    ['Skills', c.skills, '/admin/skills'],
                    ['Team', c.team_members, '/admin/team'],
                    ['Messages', c.messages, '/admin/messages'],
                    ['Blog posts', c.blog_posts, '/admin/blog'],
                    ['Services', c.services, '/admin/services'],
                    ['Clients', c.clients, '/admin/clients'],
                ].map(([label, n, href]) => (
                    <Link key={label} to={href} className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
                        <p className="text-sm text-slate-400">{label}</p>
                        <p className="mt-2 text-3xl font-bold">{n ?? 0}</p>
                    </Link>
                ))}
            </div>
            <h2 className="mt-12 text-lg font-semibold">Recent messages</h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
                <table className="min-w-full text-sm">
                    <thead className="bg-white/5 text-left text-slate-400">
                        <tr>
                            <th className="p-3">From</th>
                            <th className="p-3">Subject</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data.recent_messages || []).map((m) => (
                            <tr key={m.id} className="border-t border-white/5">
                                <td className="p-3">
                                    {m.name} — {m.email}
                                </td>
                                <td className="p-3">{m.subject || '—'}</td>
                                <td className="p-3">{m.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
