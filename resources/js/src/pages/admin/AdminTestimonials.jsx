import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminModal from '@/components/admin/AdminModal';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminLoadingState from '@/components/admin/AdminLoadingState';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminImageField from '@/components/admin/AdminImageField';
import {
    adminInput,
    adminLabel,
    adminPrimaryBtn,
    adminSecondaryBtn,
    adminSelect,
    adminTextarea,
    adminTestimonialCard,
    adminTextLink,
    adminTextLinkDanger,
} from '@/components/admin/adminTheme';
import { toastApiError } from '@/utils/toastApiError';

const empty = {
    client_name: '',
    company: '',
    message: '',
    rating: 5,
    status: 'published',
    sort_order: 0,
};

function buildTestimonialFormData(form, photoFile) {
    const fd = new FormData();
    fd.append('client_name', form.client_name);
    fd.append('company', form.company || '');
    fd.append('message', form.message);
    fd.append('rating', String(form.rating));
    fd.append('status', form.status);
    fd.append('sort_order', String(form.sort_order ?? 0));
    if (photoFile) {
        fd.append('photo', photoFile);
    }
    return fd;
}

function buildTestimonialJsonBody(form) {
    return {
        client_name: form.client_name,
        company: form.company || '',
        message: form.message,
        rating: Number(form.rating) || 5,
        status: form.status,
        sort_order: Number(form.sort_order) || 0,
    };
}

export default function AdminTestimonials() {
    const [rows, setRows] = useState([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [photoFile, setPhotoFile] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    function load() {
        setLoading(true);
        setLoadError(false);
        api
            .get('/admin/testimonials')
            .then((r) => setRows(unwrap(r) || []))
            .catch(() => {
                setLoadError(true);
                toast.error('Failed to load');
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        load();
    }, []);

    function openCreate() {
        setEditing(null);
        setForm(empty);
        setPhotoFile(null);
        setModal(true);
    }

    async function openEdit(t) {
        setEditing(t);
        let d = t;
        try {
            const r = await api.get(`/admin/testimonials/${t.id}`);
            d = unwrap(r) || t;
        } catch {
            /* use row */
        }
        setForm({
            client_name: d.client_name || '',
            company: d.company || '',
            message: d.message || '',
            rating: d.rating ?? 5,
            status: d.status || 'published',
            sort_order: d.sort_order ?? 0,
        });
        setPhotoFile(null);
        setModal(true);
    }

    async function save(e) {
        e.preventDefault();
        if (saving) return;
        setSaving(true);
        try {
            if (editing) {
                if (photoFile) {
                    unwrap(await api.post(`/admin/testimonials/${editing.id}`, buildTestimonialFormData(form, photoFile)));
                } else {
                    unwrap(await api.post(`/admin/testimonials/${editing.id}`, buildTestimonialJsonBody(form)));
                }
                toast.success('Testimonial updated');
            } else if (photoFile) {
                unwrap(await api.post('/admin/testimonials', buildTestimonialFormData(form, photoFile)));
                toast.success('Testimonial created');
            } else {
                unwrap(await api.post('/admin/testimonials', buildTestimonialJsonBody(form)));
                toast.success('Testimonial created');
            }
            setModal(false);
            load();
        } catch (err) {
            toastApiError(err, 'Save failed');
        } finally {
            setSaving(false);
        }
    }

    async function remove(id) {
        if (deleting) return;
        setDeleting(true);
        try {
            unwrap(await api.delete(`/admin/testimonials/${id}`));
            toast.success('Deleted');
            setDeleteId(null);
            load();
        } catch (err) {
            toastApiError(err, 'Delete failed');
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div>
            <AdminPageHeader title="Testimonials" description="Social proof quotes — rating, optional photo, and publish state." />
            <AdminCrudToolbar onReload={load} onCreate={openCreate} />

            {loading ? (
                <AdminLoadingState />
            ) : loadError ? (
                <div className="mt-6">
                    <AdminEmptyState error onRetry={load} />
                </div>
            ) : rows.length === 0 ? (
                <div className="mt-6">
                    <AdminEmptyState
                        title="No testimonials yet"
                        description="Add client quotes to build trust on the landing page."
                        actionLabel="Add testimonial"
                        onAction={openCreate}
                    />
                </div>
            ) : (
                <ul className="mt-6 space-y-4">
                    {rows.map((t) => (
                        <li key={t.id} className={adminTestimonialCard}>
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <p className="font-display text-lg font-semibold text-white">{t.client_name}</p>
                                    {t.company ? <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{t.company}</p> : null}
                                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{t.message}</p>
                                </div>
                                <div className="flex shrink-0 gap-1">
                                    <button type="button" className={adminTextLink} onClick={() => openEdit(t)}>
                                        Edit
                                    </button>
                                    <button type="button" className={adminTextLinkDanger} onClick={() => setDeleteId(t.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {modal ? (
                <AdminModal title={editing ? 'Edit testimonial' : 'Create testimonial'} onClose={() => !saving && setModal(false)} wide>
                    <form onSubmit={save} className="space-y-4">
                        <label className="block">
                            <span className={adminLabel}>Client name</span>
                            <input className={adminInput} value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} required />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Company</span>
                            <input className={adminInput} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Message</span>
                            <textarea className={adminTextarea} rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                        </label>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block">
                                <span className={adminLabel}>Rating (1–5)</span>
                                <input
                                    className={adminInput}
                                    type="number"
                                    min={1}
                                    max={5}
                                    value={form.rating}
                                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                                />
                            </label>
                            <label className="block">
                                <span className={adminLabel}>Status</span>
                                <select className={adminSelect} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                    <option value="draft">draft</option>
                                    <option value="published">published</option>
                                </select>
                            </label>
                        </div>
                        <label className="block">
                            <span className={adminLabel}>Sort order</span>
                            <input
                                className={adminInput}
                                type="number"
                                min={0}
                                value={form.sort_order}
                                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })}
                            />
                        </label>
                        <AdminImageField label="Photo" currentUrl={editing?.photo_url} file={photoFile} onFileChange={setPhotoFile} />
                        <div className="flex flex-wrap gap-3 pt-2">
                            <button type="submit" className={adminPrimaryBtn} disabled={saving} aria-busy={saving}>
                                {saving ? 'Saving…' : 'Save'}
                            </button>
                            <button type="button" className={adminSecondaryBtn} onClick={() => setModal(false)} disabled={saving}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </AdminModal>
            ) : null}

            {deleteId ? (
                <AdminConfirmDialog
                    title="Delete testimonial?"
                    onConfirm={() => remove(deleteId)}
                    onCancel={() => !deleting && setDeleteId(null)}
                    busy={deleting}
                    danger
                />
            ) : null}
        </div>
    );
}
