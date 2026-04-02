import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { adminInput, adminLabel, adminPrimaryBtn, adminTextarea, adminPanel, adminFileInput } from '@/components/admin/adminTheme';
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
        reload();
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
            unwrap(await api.post('/admin/site-settings', fd));
            toast.success('Settings updated');
        } catch (err) {
            toastApiError(err, 'Save failed');
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[30vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500/30 border-t-sky-400" />
            </div>
        );
    }

    return (
        <div>
            <AdminPageHeader
                title="Site settings"
                description="Brand, contact, SEO defaults, and assets used across the landing experience."
            />
            <form onSubmit={save} className={`${adminPanel} max-w-2xl space-y-5`}>
                <AdminCrudToolbar onReload={reload} />
                {['company_name', 'email', 'phone', 'address', 'maps_embed_url', 'footer_text', 'seo_default_title', 'seo_default_description', 'seo_default_keywords'].map((key) => (
                    <label key={key} className="block">
                        <span className={adminLabel}>{key.replace(/_/g, ' ')}</span>
                        {key.includes('description') || key === 'address' || key === 'footer_text' ? (
                            <textarea
                                className={adminTextarea}
                                rows={key === 'address' ? 3 : 4}
                                value={form[key] || ''}
                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                            />
                        ) : (
                            <input className={adminInput} value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                        )}
                    </label>
                ))}
                <label className="block">
                    <span className={adminLabel}>Logo</span>
                    <input name="logo" type="file" accept="image/*" className={adminFileInput} />
                </label>
                <label className="block">
                    <span className={adminLabel}>Favicon</span>
                    <input name="favicon" type="file" accept="image/*" className={adminFileInput} />
                </label>
                <div className="pt-2">
                    <button type="submit" className={adminPrimaryBtn}>
                        Save settings
                    </button>
                </div>
            </form>
        </div>
    );
}
