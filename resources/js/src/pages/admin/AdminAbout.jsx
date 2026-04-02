import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import { toastApiError } from '@/utils/toastApiError';

export default function AdminAbout() {
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);

    function reload() {
        setLoading(true);
        api
            .get('/admin/about')
            .then((r) => {
                setForm(unwrap(r) || {});
            })
            .catch(() => toast.error('Failed to load'))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        api
            .get('/admin/about')
            .then((r) => setForm(unwrap(r) || {}))
            .finally(() => setLoading(false));
    }, []);

    async function save(e) {
        e.preventDefault();
        try {
            unwrap(await api.put('/admin/about', form));
            toast.success('About section updated');
        } catch (err) {
            toastApiError(err, 'Save failed');
        }
    }

    if (loading) return <p className="text-slate-400">Loading…</p>;

    return (
        <form onSubmit={save} className="max-w-2xl space-y-4">
            <h1 className="text-2xl font-bold">About section</h1>
            <AdminCrudToolbar onReload={reload} />
            {['company_name', 'tagline', 'founding_year', 'description', 'mission', 'vision'].map((key) => (
                <label key={key} className="block text-sm">
                    <span className="text-slate-400">{key}</span>
                    {key === 'description' || key === 'mission' || key === 'vision' ? (
                        <textarea
                            className="mt-1 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2"
                            rows={4}
                            value={form[key] ?? ''}
                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        />
                    ) : (
                        <input
                            className="mt-1 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2"
                            type={key === 'founding_year' ? 'number' : 'text'}
                            value={form[key] ?? ''}
                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        />
                    )}
                </label>
            ))}
            <button type="submit" className="rounded-lg bg-landogz-blue px-4 py-2 font-semibold">
                Save
            </button>
        </form>
    );
}
