import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api, unwrap } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { adminInputLogin, adminPrimaryBtn, adminLabel } from '@/components/admin/adminTheme';

export default function AdminLogin() {
    const nav = useNavigate();
    const location = useLocation();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            const data = unwrap(res);
            setAuth(data.token, data.user);
            toast.success('Welcome back');
            const to = location.state?.from?.pathname || '/admin';
            nav(to, { replace: true });
        } catch (err) {
            toast.error(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative min-h-[100dvh] min-h-[-webkit-fill-available] overflow-hidden bg-slate-950 text-slate-100">
            <div
                className="pointer-events-none absolute inset-0 opacity-90"
                style={{
                    backgroundImage:
                        'radial-gradient(ellipse 100% 80% at 20% -20%, rgba(56, 189, 248, 0.22), transparent 55%), radial-gradient(ellipse 80% 60% at 100% 10%, rgba(139, 92, 246, 0.18), transparent 50%), radial-gradient(ellipse 60% 50% at 50% 100%, rgba(14, 165, 233, 0.08), transparent 45%)',
                }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />

            <div className="relative z-10 mx-auto flex min-h-[100dvh] min-h-[-webkit-fill-available] max-w-6xl flex-col lg:flex-row">
                <div className="flex flex-1 flex-col justify-center px-6 pb-10 pt-[max(3rem,env(safe-area-inset-top))] lg:px-12 lg:pb-16 lg:pr-8 lg:pt-16">
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-sky-400/90">Landogz studio</p>
                    <h1 className="font-display mt-4 max-w-md text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl">
                        Control center for your public site.
                    </h1>
                    <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
                        Manage hero copy, portfolio, team, blog, and inbound messages — all in one calm, focused workspace.
                    </p>
                    <div className="mt-10 hidden gap-3 lg:flex">
                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Stack</p>
                            <p className="mt-1 text-sm font-medium text-slate-200">Laravel · React · API-first</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-center px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 lg:px-10 lg:py-16">
                    <div className="w-full max-w-md">
                        <div className="rounded-3xl border border-white/[0.10] bg-slate-900/40 p-6 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:p-8">
                            <div className="mb-8 text-center lg:text-left">
                                <h2 className="font-display text-2xl font-bold text-white">Sign in</h2>
                                <p className="mt-2 text-sm text-slate-400">Use your administrator credentials.</p>
                            </div>
                            <form onSubmit={onSubmit} className="space-y-5">
                                <div>
                                    <label className={adminLabel} htmlFor="admin-email">
                                        Email
                                    </label>
                                    <input
                                        id="admin-email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className={adminInputLogin}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@company.com"
                                    />
                                </div>
                                <div>
                                    <label className={adminLabel} htmlFor="admin-password">
                                        Password
                                    </label>
                                    <input
                                        id="admin-password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className={adminInputLogin}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>
                                <button type="submit" disabled={loading} className={`${adminPrimaryBtn} w-full`}>
                                    {loading ? 'Signing in…' : 'Enter console'}
                                </button>
                            </form>
                            <p className="mt-8 text-center text-xs text-slate-500">
                                <Link to="/" className="text-sky-400/90 underline-offset-4 transition hover:text-sky-300 hover:underline">
                                    ← Back to public site
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
