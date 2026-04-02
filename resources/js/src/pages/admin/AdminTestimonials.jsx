import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminModal from '@/components/admin/AdminModal';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import { toastApiError } from '@/utils/toastApiError';

const inp = 'mt-1 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm';

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

export default function AdminTestimonials() {
    const [rows, setRows] = useState([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [photoFile, setPhotoFile] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    function load() {
        api
            .get('/admin/testimonials')
            .then((r) => setRows(unwrap(r) || []))
            .catch(() => toast.error('Failed to load'));
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
        const fd = buildTestimonialFormData(form, photoFile);
        try {
            if (editing) {
                unwrap(await api.put(`/admin/testimonials/${editing.id}`, fd));
                toast.success('Testimonial updated');
            } else {
                unwrap(await api.post('/admin/testimonials', fd));
                toast.success('Testimonial created');
            }
            setModal(false);
            load();
        } catch (err) {
            toastApiError(err, 'Save failed');
        }
    }

    async function remove(id) {
        try {
            unwrap(await api.delete(`/admin/testimonials/${id}`));
            toast.success('Deleted');
            setDeleteId(null);
            load();
        } catch (err) {
            toastApiError(err, 'Delete failed');
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Testimonials</h1>
            <AdminCrudToolbar onReload={load} onCreate={openCreate} />

            <ul className="space-y-3">
                {rows.map((t) => (
                    <li key={t.id} className="rounded-lg border border-white/10 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <p className="font-medium">{t.client_name}</p>
                                <p className="text-sm text-slate-400">{t.message}</p>
                            </div>
                            <div className="flex shrink-0 gap-2">
                                <button type="button" className="text-sm text-landogz-accent" onClick={() => openEdit(t)}>
                                    Edit
                                </button>
                                <button type="button" className="text-sm text-red-400" onClick={() => setDeleteId(t.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {modal ? (
                <AdminModal title={editing ? 'Edit testimonial' : 'Create testimonial'} onClose={() => setModal(false)} wide>
                    <form onSubmit={save} className="space-y-3">
                        <label className="block text-sm">
                            <span className="text-slate-400">Client name</span>
                            <input className={inp} value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} required />
                        </label>
                        <label className="block text-sm">
                            <span className="text-slate-400">Company</span>
                            <input className={inp} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                        </label>
                        <label className="block text-sm">
                            <span className="text-slate-400">Message</span>
                            <textarea className={inp} rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block text-sm">
                                <span className="text-slate-400">Rating (1–5)</span>
                                <input
                                    className={inp}
                                    type="number"
                                    min={1}
                                    max={5}
                                    value={form.rating}
                                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                                />
                            </label>
                            <label className="block text-sm">
                                <span className="text-slate-400">Status</span>
                                <select className={inp} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                    <option value="draft">draft</option>
                                    <option value="published">published</option>
                                </select>
                            </label>
                        </div>
                        <label className="block text-sm">
                            <span className="text-slate-400">Sort order</span>
                            <input
                                className={inp}
                                type="number"
                                min={0}
                                value={form.sort_order}
                                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })}
                            />
                        </label>
                        <label className="block text-sm">
                            <span className="text-slate-400">Photo</span>
                            <input type="file" accept="image/*" className="mt-1 text-sm" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
                        </label>
                        <div className="flex gap-2 pt-2">
                            <button type="submit" className="rounded-lg bg-landogz-blue px-4 py-2 text-sm font-medium">
                                Save
                            </button>
                            <button type="button" className="rounded-lg border border-white/15 px-4 py-2 text-sm" onClick={() => setModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </AdminModal>
            ) : null}

            {deleteId ? (
                <AdminConfirmDialog title="Delete testimonial?" onConfirm={() => remove(deleteId)} onCancel={() => setDeleteId(null)} danger />
            ) : null}
        </div>
    );
}
