import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { adminInput, adminLabel, adminPrimaryBtn, adminTextarea, adminPanel } from '@/components/admin/adminTheme';
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
        reload();
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
                title="About"
                description="Company profile copy shown on the public About section."
            />
            <form onSubmit={save} className={`${adminPanel} max-w-2xl space-y-5`}>
                <AdminCrudToolbar onReload={reload} />
                {['company_name', 'tagline', 'founding_year', 'description', 'mission', 'vision'].map((key) => (
                    <label key={key} className="block">
                        <span className={adminLabel}>{key.replace(/_/g, ' ')}</span>
                        {key === 'description' || key === 'mission' || key === 'vision' ? (
                            <textarea
                                className={adminTextarea}
                                rows={4}
                                value={form[key] ?? ''}
                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                            />
                        ) : (
                            <input
                                className={adminInput}
                                type={key === 'founding_year' ? 'number' : 'text'}
                                value={form[key] ?? ''}
                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                            />
                        )}
                    </label>
                ))}
                <div className="pt-2">
                    <button type="submit" className={adminPrimaryBtn}>
                        Save about
                    </button>
                </div>
            </form>
        </div>
    );
}
