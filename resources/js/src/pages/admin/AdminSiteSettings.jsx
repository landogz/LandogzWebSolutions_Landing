import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { adminInput, adminLabel, adminPrimaryBtn, adminTextarea, adminPanel, adminFileInput } from '@/components/admin/adminTheme';
import { toastApiError } from '@/utils/toastApiError';

const sectionTitle = 'mt-8 border-t border-white/10 pt-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 first:mt-0 first:border-t-0 first:pt-0';

function Field({ label, children }) {
    return (
        <label className="block">
            <span className={adminLabel}>{label}</span>
            {children}
        </label>
    );
}

export default function AdminSiteSettings() {
    const [form, setForm] = useState({});
    const [seoPerPageText, setSeoPerPageText] = useState('{}');
    const [loading, setLoading] = useState(true);

    function reload() {
        setLoading(true);
        api
            .get('/admin/site-settings')
            .then((r) => {
                const d = unwrap(r);
                if (d) {
                    setForm(d);
                    setSeoPerPageText(JSON.stringify(d.seo_per_page || {}, null, 2));
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
        let perPage = {};
        try {
            perPage = JSON.parse(seoPerPageText || '{}');
            if (Object.prototype.toString.call(perPage) !== '[object Object]') {
                throw new Error('Must be a JSON object');
            }
        } catch {
            toast.error('Per-page SEO must be valid JSON (object).');
            return;
        }
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
        fd.append('seo_robots', form.seo_robots || '');
        fd.append('seo_twitter_handle', (form.seo_twitter_handle || '').replace(/^@/, ''));
        fd.append('seo_canonical_base_url', (form.seo_canonical_base_url || '').trim());
        fd.append('social_links', JSON.stringify(form.social_links || {}));
        fd.append('seo_per_page', JSON.stringify(perPage));
        const logo = e.target.logo?.files?.[0];
        const fav = e.target.favicon?.files?.[0];
        const og = e.target.seo_og_image?.files?.[0];
        if (logo) fd.append('logo', logo);
        if (fav) fd.append('favicon', fav);
        if (og) fd.append('seo_og_image', og);
        try {
            unwrap(await api.post('/admin/site-settings', fd));
            toast.success('Settings updated');
            reload();
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
                description="Brand, contact, SEO (meta, Open Graph, Twitter), and assets for the landing site."
            />
            <form onSubmit={save} className={`${adminPanel} max-w-3xl space-y-4`}>
                <AdminCrudToolbar onReload={reload} />

                <h2 className={sectionTitle}>Brand & contact</h2>
                <Field label="Company name">
                    <input className={adminInput} value={form.company_name || ''} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
                </Field>
                <Field label="Email">
                    <input className={adminInput} type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </Field>
                <Field label="Phone">
                    <input className={adminInput} value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </Field>
                <Field label="Address">
                    <textarea className={adminTextarea} rows={3} value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </Field>
                <Field label="Google Maps embed URL">
                    <input className={adminInput} value={form.maps_embed_url || ''} onChange={(e) => setForm({ ...form, maps_embed_url: e.target.value })} />
                </Field>
                <Field label="Footer text">
                    <textarea className={adminTextarea} rows={2} value={form.footer_text || ''} onChange={(e) => setForm({ ...form, footer_text: e.target.value })} />
                </Field>

                <h2 className={sectionTitle}>SEO</h2>
                <p className="text-sm text-slate-500">
                    Defaults apply to the home page. Use <strong className="text-slate-400">Public site URL</strong> for canonical and Open Graph URLs (e.g.{' '}
                    <code className="text-sky-400/90">https://yoursite.com</code>).
                </p>
                <Field label="Default page title">
                    <input className={adminInput} value={form.seo_default_title || ''} onChange={(e) => setForm({ ...form, seo_default_title: e.target.value })} />
                </Field>
                <Field label="Meta description">
                    <textarea className={adminTextarea} rows={4} value={form.seo_default_description || ''} onChange={(e) => setForm({ ...form, seo_default_description: e.target.value })} />
                </Field>
                <Field label="Meta keywords (comma-separated)">
                    <textarea className={adminTextarea} rows={2} value={form.seo_default_keywords || ''} onChange={(e) => setForm({ ...form, seo_default_keywords: e.target.value })} />
                </Field>
                <Field label="Robots">
                    <input
                        className={adminInput}
                        placeholder="index, follow"
                        value={form.seo_robots || ''}
                        onChange={(e) => setForm({ ...form, seo_robots: e.target.value })}
                    />
                </Field>
                <Field label="Twitter / X handle (without @)">
                    <input
                        className={adminInput}
                        placeholder="yourbrand"
                        value={form.seo_twitter_handle || ''}
                        onChange={(e) => setForm({ ...form, seo_twitter_handle: e.target.value })}
                    />
                </Field>
                <Field label="Public site URL (canonical & Open Graph)">
                    <input
                        className={adminInput}
                        placeholder="https://example.com"
                        value={form.seo_canonical_base_url || ''}
                        onChange={(e) => setForm({ ...form, seo_canonical_base_url: e.target.value })}
                    />
                </Field>
                <Field label="Open Graph share image">
                    {form.seo_og_image_url ? (
                        <div className="mb-3">
                            <img src={form.seo_og_image_url} alt="" className="max-h-32 rounded-lg border border-white/10 object-contain" />
                        </div>
                    ) : null}
                    <input name="seo_og_image" type="file" accept="image/*" className={adminFileInput} />
                    <p className="mt-1 text-xs text-slate-500">Recommended ~1200×630px. Used for social previews when shared.</p>
                </Field>
                <Field label="Per-page SEO (JSON, advanced)">
                    <textarea
                        className={adminTextarea}
                        rows={6}
                        spellCheck={false}
                        value={seoPerPageText}
                        onChange={(e) => setSeoPerPageText(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-slate-500">Optional map of paths or keys to &#123; title, description &#125; for future routes.</p>
                </Field>

                <h2 className={sectionTitle}>Assets</h2>
                <Field label="Logo">
                    {form.logo_url ? (
                        <div className="mb-3">
                            <img src={form.logo_url} alt="" className="max-h-16 rounded-lg border border-white/10 object-contain" />
                        </div>
                    ) : null}
                    <input name="logo" type="file" accept="image/*" className={adminFileInput} />
                </Field>
                <Field label="Favicon">
                    {form.favicon_url ? (
                        <div className="mb-3">
                            <img src={form.favicon_url} alt="" className="h-12 w-12 rounded border border-white/10 object-contain" />
                        </div>
                    ) : null}
                    <input name="favicon" type="file" accept="image/*" className={adminFileInput} />
                </Field>

                <div className="pt-4">
                    <button type="submit" className={adminPrimaryBtn}>
                        Save settings
                    </button>
                </div>
            </form>
        </div>
    );
}
