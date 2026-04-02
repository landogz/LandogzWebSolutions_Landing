import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminModal from '@/components/admin/AdminModal';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import { toastApiError } from '@/utils/toastApiError';

const inp = 'mt-1 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm';

const empty = { label: '', value: '', sort_order: 0 };

export default function AdminAboutStats() {
    const [rows, setRows] = useState([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [deleteId, setDeleteId] = useState(null);

    function load() {
        api
            .get('/admin/about-stats')
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
        setForm({ label: s.label || '', value: s.value || '', sort_order: s.sort_order ?? 0 });
        setModal(true);
    }

    async function save(e) {
        e.preventDefault();
        try {
            if (editing) {
                unwrap(await api.put(`/admin/about-stats/${editing.id}`, form));
                toast.success('Stat updated');
            } else {
                unwrap(await api.post('/admin/about-stats', form));
                toast.success('Stat created');
            }
            setModal(false);
            load();
        } catch (err) {
            toastApiError(err, 'Save failed');
        }
    }

    async function remove(id) {
        try {
            unwrap(await api.delete(`/admin/about-stats/${id}`));
            toast.success('Deleted');
            setDeleteId(null);
            load();
        } catch (err) {
            toastApiError(err, 'Delete failed');
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">About stats</h1>
            <AdminCrudToolbar onReload={load} onCreate={openCreate} />

            <ul className="space-y-2">
                {rows.map((s) => (
                    <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 px-4 py-3">
                        <span>
                            {s.label}: <strong>{s.value}</strong>
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
                <AdminModal title={editing ? 'Edit stat' : 'Create stat'} onClose={() => setModal(false)}>
                    <form onSubmit={save} className="space-y-3">
                        <label className="block text-sm">
                            <span className="text-slate-400">Label</span>
                            <input className={inp} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
                        </label>
                        <label className="block text-sm">
                            <span className="text-slate-400">Value</span>
                            <input className={inp} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
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
                    title="Delete this stat?"
                    onConfirm={() => remove(deleteId)}
                    onCancel={() => setDeleteId(null)}
                    danger
                />
            ) : null}
        </div>
    );
}
