import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import { toastApiError } from '@/utils/toastApiError';

export default function AdminSiteSettings() {
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);

    function reload() {
        setLoading(true);
        api
            .get('/admin/site-settings')
            .then((r) => {
                const d = unwrap(r);
                if (d) setForm(d);
            })
            .catch(() => toast.error('Failed to load'))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        api
            .get('/admin/site-settings')
            .then((r) => {
                const d = unwrap(r);
                if (d) setForm(d);
            })
            .finally(() => setLoading(false));
    }, []);

    async function save(e) {
        e.preventDefault();
        const fd = new FormData();
        fd.append('company_name', form.company_name || '');
        fd.append('email', form.email || '');
        fd.append('phone', form.phone || '');
        fd.append('address', form.address || '');
        fd.append('maps_embed_url', form.maps_embed_url || '');
        fd.append('footer_text', form.footer_text || '');
        fd.append('seo_default_title', form.seo_default_title || '');
        fd.append('seo_default_description', form.seo_default_description || '');
        fd.append('seo_default_keywords', form.seo_default_keywords || '');
        fd.append('social_links', JSON.stringify(form.social_links || {}));
        fd.append('seo_per_page', JSON.stringify(form.seo_per_page || {}));
        const logo = e.target.logo?.files?.[0];
        const fav = e.target.favicon?.files?.[0];
        if (logo) fd.append('logo', logo);
        if (fav) fd.append('favicon', fav);
        try {
            // POST + multipart: do not set Content-Type manually (boundary is required).
            // PUT + multipart is unreliable in PHP; POST is registered for the same action.
            unwrap(await api.post('/admin/site-settings', fd));
            toast.success('Settings updated');
        } catch (err) {
            toastApiError(err, 'Save failed');
        }
    }

    if (loading) return <p className="text-slate-400">Loading…</p>;

    return (
        <form onSubmit={save} className="max-w-2xl space-y-4">
            <h1 className="text-2xl font-bold">Site settings</h1>
            <AdminCrudToolbar onReload={reload} />
            {['company_name', 'email', 'phone', 'address', 'maps_embed_url', 'footer_text', 'seo_default_title', 'seo_default_description', 'seo_default_keywords'].map((key) => (
                <label key={key} className="block text-sm">
                    <span className="text-slate-400">{key}</span>
                    {key.includes('description') || key === 'address' || key === 'footer_text' ? (
                        <textarea
                            className="mt-1 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2"
                            rows={key === 'address' ? 3 : 4}
                            value={form[key] || ''}
                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        />
                    ) : (
                        <input
                            className="mt-1 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2"
                            value={form[key] || ''}
                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        />
                    )}
                </label>
            ))}
            <label className="block text-sm">
                <span className="text-slate-400">Logo</span>
                <input name="logo" type="file" accept="image/*" className="mt-1 text-sm" />
            </label>
            <label className="block text-sm">
                <span className="text-slate-400">Favicon</span>
                <input name="favicon" type="file" accept="image/*" className="mt-1 text-sm" />
            </label>
            <button type="submit" className="rounded-lg bg-landogz-blue px-4 py-2 font-semibold">
                Save
            </button>
        </form>
    );
}
