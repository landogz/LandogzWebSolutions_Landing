import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const links = [
    ['Dashboard', '/admin'],
    ['Hero', '/admin/hero'],
    ['About', '/admin/about'],
    ['Site settings', '/admin/settings'],
    ['Projects', '/admin/projects'],
    ['Categories', '/admin/categories'],
    ['Services', '/admin/services'],
    ['Skills', '/admin/skills'],
    ['Team', '/admin/team'],
    ['Testimonials', '/admin/testimonials'],
    ['Clients', '/admin/clients'],
    ['Blog', '/admin/blog'],
    ['About stats', '/admin/about-stats'],
    ['Company values', '/admin/company-values'],
    ['Messages', '/admin/messages'],
];

export default function AdminLayout() {
    const nav = useNavigate();
    const logout = useAuthStore((s) => s.logout);

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
        <div className="min-h-screen bg-slate-950 text-slate-100 flex">
            <aside className="w-56 shrink-0 border-r border-white/10 p-4 hidden md:block">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Landogz</p>
                <nav className="space-y-1">
                    {links.map(([label, to]) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/admin'}
                            className={({ isActive }) =>
                                `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>
                <button type="button" onClick={handleLogout} className="mt-8 w-full rounded-lg border border-white/15 py-2 text-sm">
                    Logout
                </button>
            </aside>
            <main className="flex-1 overflow-auto p-6">
                <Outlet />
            </main>
        </div>
    );
}
