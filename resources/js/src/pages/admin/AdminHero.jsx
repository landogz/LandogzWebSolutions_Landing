import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminLoadingState from '@/components/admin/AdminLoadingState';
import {
    adminInput,
    adminLabel,
    adminPrimaryBtn,
    adminSelect,
    adminTextarea,
    adminPanel,
} from '@/components/admin/adminTheme';
import { toastApiError } from '@/utils/toastApiError';

const empty = {
    headline: '',
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
    const [saving, setSaving] = useState(false);

    function reload() {
        setLoading(true);
        api
            .get('/admin/hero')
            .then((r) => {
                const d = unwrap(r);
                if (d) {
                    setForm({
                        headline: d.headline || '',
                        subheading: d.subheading || '',
                        cta_primary_text: d.cta_primary_text || '',
                        cta_primary_url: d.cta_primary_url || '',
                        cta_secondary_text: d.cta_secondary_text || '',
                        cta_secondary_url: d.cta_secondary_url || '',
                        background_type: d.background_type || 'gradient',
                        company_tagline: d.company_tagline || '',
                    });
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
        if (saving) return;
        setSaving(true);
        const animated_words = words
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        try {
            unwrap(await api.put('/admin/hero', { ...form, animated_words }));
            toast.success('Hero updated');
        } catch (err) {
            toastApiError(err, 'Save failed');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <AdminLoadingState label="Loading hero…" />;
    }

    return (
        <div>
            <AdminPageHeader
                title="Hero"
                description="Landing hero headline, rotating words, CTAs, and tagline — synced with the public site."
            />
            <form onSubmit={save} className={`${adminPanel} max-w-2xl space-y-5`}>
                <AdminCrudToolbar onReload={reload} />

                <label className="block">
                    <span className={adminLabel}>Company tagline</span>
                    <input
                        className={adminInput}
                        value={form.company_tagline}
                        onChange={(e) => setForm({ ...form, company_tagline: e.target.value })}
                    />
                </label>

                <label className="block">
                    <span className={adminLabel}>Headline</span>
                    <textarea
                        rows={3}
                        placeholder={'Line 1\nLine 2 — optional second line for display'}
                        className={adminTextarea}
                        value={form.headline}
                        onChange={(e) => setForm({ ...form, headline: e.target.value })}
                    />
                </label>

                <label className="block">
                    <span className={adminLabel}>Animated words (comma-separated)</span>
                    <input className={adminInput} value={words} onChange={(e) => setWords(e.target.value)} />
                    <p className="mt-1.5 text-[11px] text-slate-500">Shown in the “We build …” rotator on the hero.</p>
                </label>

                <label className="block">
                    <span className={adminLabel}>Subheading</span>
                    <textarea
                        rows={3}
                        className={adminTextarea}
                        value={form.subheading}
                        onChange={(e) => setForm({ ...form, subheading: e.target.value })}
                    />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                        <span className={adminLabel}>Primary CTA text</span>
                        <input
                            className={adminInput}
                            value={form.cta_primary_text}
                            onChange={(e) => setForm({ ...form, cta_primary_text: e.target.value })}
                        />
                    </label>
                    <label className="block">
                        <span className={adminLabel}>Primary CTA URL</span>
                        <input
                            className={adminInput}
                            value={form.cta_primary_url}
                            onChange={(e) => setForm({ ...form, cta_primary_url: e.target.value })}
                        />
                    </label>
                    <label className="block">
                        <span className={adminLabel}>Secondary CTA text</span>
                        <input
                            className={adminInput}
                            value={form.cta_secondary_text}
                            onChange={(e) => setForm({ ...form, cta_secondary_text: e.target.value })}
                        />
                    </label>
                    <label className="block">
                        <span className={adminLabel}>Secondary CTA URL</span>
                        <input
                            className={adminInput}
                            value={form.cta_secondary_url}
                            onChange={(e) => setForm({ ...form, cta_secondary_url: e.target.value })}
                        />
                    </label>
                </div>

                <label className="block">
                    <span className={adminLabel}>Background type</span>
                    <select
                        className={adminSelect}
                        value={form.background_type}
                        onChange={(e) => setForm({ ...form, background_type: e.target.value })}
                    >
                        <option value="gradient">Gradient</option>
                        <option value="image">Image</option>
                        <option value="solid">Solid</option>
                    </select>
                </label>

                <div className="pt-2">
                    <button type="submit" className={adminPrimaryBtn} disabled={saving} aria-busy={saving}>
                        {saving ? 'Saving…' : 'Save hero'}
                    </button>
                </div>
            </form>
        </div>
    );
}
