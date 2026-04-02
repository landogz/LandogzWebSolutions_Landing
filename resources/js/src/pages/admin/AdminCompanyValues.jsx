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
    adminTextarea,
    adminListRow,
    adminTextLink,
    adminTextLinkDanger,
} from '@/components/admin/adminTheme';
import { toastApiError } from '@/utils/toastApiError';

const empty = { icon: '', label: '', description: '', sort_order: 0 };

export default function AdminCompanyValues() {
    const [rows, setRows] = useState([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [deleteId, setDeleteId] = useState(null);

    function load() {
        api
            .get('/admin/company-values')
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

    function openEdit(v) {
        setEditing(v);
        setForm({
            icon: v.icon || '',
            label: v.label || '',
            description: v.description || '',
            sort_order: v.sort_order ?? 0,
        });
        setModal(true);
    }

    async function save(e) {
        e.preventDefault();
        try {
            if (editing) {
                unwrap(await api.put(`/admin/company-values/${editing.id}`, form));
                toast.success('Value updated');
            } else {
                unwrap(await api.post('/admin/company-values', form));
                toast.success('Value created');
            }
            setModal(false);
            load();
        } catch (err) {
            toastApiError(err, 'Save failed');
        }
    }

    async function remove(id) {
        try {
            unwrap(await api.delete(`/admin/company-values/${id}`));
            toast.success('Deleted');
            setDeleteId(null);
            load();
        } catch (err) {
            toastApiError(err, 'Delete failed');
        }
    }

    return (
        <div>
            <AdminPageHeader title="Company values" description="Principles and culture bullets shown alongside your About story." />
            <AdminCrudToolbar onReload={load} onCreate={openCreate} />

            <ul className="mt-6 space-y-3">
                {rows.length === 0 ? (
                    <li className="rounded-xl border border-dashed border-white/10 py-12 text-center text-sm text-slate-500">No values yet.</li>
                ) : (
                    rows.map((v) => (
                        <li key={v.id} className={adminListRow}>
                            <span className="text-slate-200">
                                <span className="mr-2" aria-hidden>
                                    {v.icon}
                                </span>
                                <span className="font-medium">{v.label}</span>
                            </span>
                            <div className="flex gap-1">
                                <button type="button" className={adminTextLink} onClick={() => openEdit(v)}>
                                    Edit
                                </button>
                                <button type="button" className={adminTextLinkDanger} onClick={() => setDeleteId(v.id)}>
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>

            {modal ? (
                <AdminModal title={editing ? 'Edit value' : 'Create value'} onClose={() => setModal(false)}>
                    <form onSubmit={save} className="space-y-4">
                        <label className="block">
                            <span className={adminLabel}>Icon</span>
                            <input className={adminInput} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Label</span>
                            <input className={adminInput} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Description</span>
                            <textarea className={adminTextarea} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
                    title="Delete this value?"
                    onConfirm={() => remove(deleteId)}
                    onCancel={() => setDeleteId(null)}
                    danger
                />
            ) : null}
        </div>
    );
}
