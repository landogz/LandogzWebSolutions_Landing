import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminModal from '@/components/admin/AdminModal';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
    adminInput,
    adminLabel,
    adminPrimaryBtn,
    adminSecondaryBtn,
    adminListRow,
    adminTextLink,
    adminTextLinkDanger,
} from '@/components/admin/adminTheme';
import { toastApiError } from '@/utils/toastApiError';

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
            <AdminPageHeader title="About stats" description="Numeric highlights (years, projects, clients) beside your About narrative." />
            <AdminCrudToolbar onReload={load} onCreate={openCreate} />

            <ul className="mt-6 space-y-3">
                {rows.length === 0 ? (
                    <li className="rounded-xl border border-dashed border-white/10 py-12 text-center text-sm text-slate-500">No stats yet.</li>
                ) : (
                    rows.map((s) => (
                        <li key={s.id} className={adminListRow}>
                            <span className="text-slate-200">
                                <span className="font-medium">{s.label}</span>
                                <span className="mx-2 text-slate-500">·</span>
                                <span className="font-display text-lg font-bold tabular-nums text-sky-300/90">{s.value}</span>
                            </span>
                            <div className="flex gap-1">
                                <button type="button" className={adminTextLink} onClick={() => openEdit(s)}>
                                    Edit
                                </button>
                                <button type="button" className={adminTextLinkDanger} onClick={() => setDeleteId(s.id)}>
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>

            {modal ? (
                <AdminModal title={editing ? 'Edit stat' : 'Create stat'} onClose={() => setModal(false)}>
                    <form onSubmit={save} className="space-y-4">
                        <label className="block">
                            <span className={adminLabel}>Label</span>
                            <input className={adminInput} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Value</span>
                            <input className={adminInput} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
                        </label>
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
                        <div className="flex flex-wrap gap-3 pt-2">
                            <button type="submit" className={adminPrimaryBtn}>
                                Save
                            </button>
                            <button type="button" className={adminSecondaryBtn} onClick={() => setModal(false)}>
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
