import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { adminInput, adminLabel, adminPrimaryBtn, adminTextarea, adminPanel } from '@/components/admin/adminTheme';
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
        reload();
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

    if (loading) {
        return (
            <div className="flex min-h-[30vh] items-center justify-center text-slate-500">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500/30 border-t-sky-400" />
            </div>
        );
    }

    return (
        <div>
            <AdminPageHeader
                title="Hero"
                description="Landing hero headline, rotating words, CTAs, and tagline — synced with the public site."
            />
            <form onSubmit={save} className={`${adminPanel} max-w-2xl space-y-5`}>
                <AdminCrudToolbar onReload={reload} />
                {Object.keys(empty).map((key) => (
                    <label key={key} className="block">
                        <span className={adminLabel}>{key.replace(/_/g, ' ')}</span>
                        {key === 'headline' ? (
                            <textarea
                                rows={3}
                                placeholder={'Line 1\nLine 2 — optional second line for display'}
                                className={adminTextarea}
                                value={form[key] ?? ''}
                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                            />
                        ) : (
                            <input
                                className={adminInput}
                                value={form[key] ?? ''}
                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                            />
                        )}
                    </label>
                ))}
                <label className="block">
                    <span className={adminLabel}>Animated words (comma-separated)</span>
                    <input className={adminInput} value={words} onChange={(e) => setWords(e.target.value)} />
                </label>
                <div className="pt-2">
                    <button type="submit" className={adminPrimaryBtn}>
                        Save hero
                    </button>
                </div>
            </form>
        </div>
    );
}
