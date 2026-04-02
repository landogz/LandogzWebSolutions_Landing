import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import { toastApiError } from '@/utils/toastApiError';

const empty = {
    headline: '',
    animated_words: [],
    subheading: '',
    cta_primary_text: '',
    cta_primary_url: '',
    cta_secondary_text: '',
    cta_secondary_url: '',
    background_type: 'gradient',
    company_tagline: '',
};

export default function AdminHero() {
    const [form, setForm] = useState(empty);
    const [words, setWords] = useState('');
    const [loading, setLoading] = useState(true);

    function reload() {
        setLoading(true);
        api
            .get('/admin/hero')
            .then((r) => {
                const d = unwrap(r);
                if (d) {
                    setForm({ ...empty, ...d });
                    setWords((d.animated_words || []).join(', '));
                }
            })
            .catch(() => toast.error('Failed to load'))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        setLoading(true);
        api
            .get('/admin/hero')
            .then((r) => {
                const d = unwrap(r);
                if (d) {
                    setForm({ ...empty, ...d });
                    setWords((d.animated_words || []).join(', '));
                }
            })
            .finally(() => setLoading(false));
    }, []);

    async function save(e) {
        e.preventDefault();
        const animated_words = words
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        try {
            unwrap(await api.put('/admin/hero', { ...form, animated_words }));
            toast.success('Hero updated');
        } catch (err) {
            toastApiError(err, 'Save failed');
        }
    }

    if (loading) return <p className="text-slate-400">Loading…</p>;

    return (
        <form onSubmit={save} className="max-w-2xl space-y-4">
            <h1 className="text-2xl font-bold">Hero settings</h1>
            <AdminCrudToolbar onReload={reload} />
            {Object.keys(empty).map((key) => (
                <label key={key} className="block text-sm">
                    <span className="text-slate-400">{key}</span>
                    {key === 'headline' ? (
                        <textarea
                            rows={3}
                            placeholder={'Line 1\nLine 2 — optional second line for display'}
                            className="mt-1 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 font-sans text-sm"
                            value={form[key] ?? ''}
                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        />
                    ) : (
                        <input
                            className="mt-1 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2"
                            value={form[key] ?? ''}
                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        />
                    )}
                </label>
            ))}
            <label className="block text-sm">
                <span className="text-slate-400">Animated words (comma-separated)</span>
                <input className="mt-1 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2" value={words} onChange={(e) => setWords(e.target.value)} />
            </label>
            <button type="submit" className="rounded-lg bg-landogz-blue px-4 py-2 font-semibold">
                Save
            </button>
        </form>
    );
}
