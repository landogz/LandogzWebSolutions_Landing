import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminModal from '@/components/admin/AdminModal';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import { toastApiError } from '@/utils/toastApiError';

const inp = 'mt-1 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm';

const empty = { icon: '', title: '', description: '', sort_order: 0 };

export default function AdminServices() {
    const [rows, setRows] = useState([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [deleteId, setDeleteId] = useState(null);

    function load() {
        api
            .get('/admin/services')
            .then((r) => setRows(unwrap(r) || []))
            .catch(() => toast.error('Failed to load'));
    }

    useEffect(() => {
        load();
    }, []);

    function openCreate() {
        setEditing(null);
        setForm(empty);
        setModal(true);
    }

    function openEdit(s) {
        setEditing(s);
        setForm({
            icon: s.icon || '',
            title: s.title || '',
            description: s.description || '',
            sort_order: s.sort_order ?? 0,
        });
        setModal(true);
    }

    async function save(e) {
        e.preventDefault();
        try {
            if (editing) {
                const r = await api.put(`/admin/services/${editing.id}`, form);
                unwrap(r);
                toast.success('Service updated');
            } else {
                const r = await api.post('/admin/services', form);
                unwrap(r);
                toast.success('Service created');
            }
            setModal(false);
            load();
        } catch (err) {
            toastApiError(err, 'Save failed');
        }
    }

    async function remove(id) {
        try {
            const r = await api.delete(`/admin/services/${id}`);
            unwrap(r);
            toast.success('Deleted');
            setDeleteId(null);
            load();
        } catch (err) {
            toastApiError(err, 'Delete failed');
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Services</h1>
            <p className="mt-2 text-sm text-slate-400">Manage service cards for the landing page.</p>
            <AdminCrudToolbar onReload={load} onCreate={openCreate} />

            <ul className="space-y-2">
                {rows.map((s) => (
                    <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 px-4 py-3">
                        <span>
                            {s.icon} {s.title}
                        </span>
                        <div className="flex gap-2">
                            <button type="button" className="text-sm text-landogz-accent" onClick={() => openEdit(s)}>
                                Edit
                            </button>
                            <button type="button" className="text-sm text-red-400" onClick={() => setDeleteId(s.id)}>
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {modal ? (
                <AdminModal title={editing ? 'Edit service' : 'Create service'} onClose={() => setModal(false)}>
                    <form onSubmit={save} className="space-y-3">
                        <label className="block text-sm">
                            <span className="text-slate-400">Icon (emoji or short text)</span>
                            <input className={inp} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
                        </label>
                        <label className="block text-sm">
                            <span className="text-slate-400">Title</span>
                            <input className={inp} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        </label>
                        <label className="block text-sm">
                            <span className="text-slate-400">Description</span>
                            <textarea className={inp} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        </label>
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
                <AdminConfirmDialog
                    title="Delete service?"
                    message="This cannot be undone."
                    onConfirm={() => remove(deleteId)}
                    onCancel={() => setDeleteId(null)}
                    danger
                />
            ) : null}
        </div>
    );
}
