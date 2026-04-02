import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api, unwrap } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

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
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-white/5 p-8">
                <h1 className="text-xl font-bold text-white">Landogz Admin</h1>
                <p className="text-sm text-slate-400">Sign in with your admin account.</p>
                <input
                    type="email"
                    required
                    className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    required
                    className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-landogz-blue py-2 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Signing in…' : 'Sign in'}
                </button>
            </form>
        </div>
    );
}
