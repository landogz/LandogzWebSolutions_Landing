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

const empty = { name: '', slug: '', sort_order: 0 };

export default function AdminCategories() {
    const [rows, setRows] = useState([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [deleteId, setDeleteId] = useState(null);

    function load() {
        api
            .get('/admin/project-categories')
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

    function openEdit(c) {
        setEditing(c);
        setForm({ name: c.name || '', slug: c.slug || '', sort_order: c.sort_order ?? 0 });
        setModal(true);
    }

    async function save(e) {
        e.preventDefault();
        const payload = { ...form };
        if (!payload.slug?.trim()) {
            delete payload.slug;
        }
        try {
            if (editing) {
                unwrap(await api.put(`/admin/project-categories/${editing.id}`, payload));
                toast.success('Category updated');
            } else {
                unwrap(await api.post('/admin/project-categories', payload));
                toast.success('Category created');
            }
            setModal(false);
            load();
        } catch (err) {
            toastApiError(err, 'Save failed');
        }
    }

    async function remove(id) {
        try {
            unwrap(await api.delete(`/admin/project-categories/${id}`));
            toast.success('Deleted');
            setDeleteId(null);
            load();
        } catch (err) {
            toastApiError(err, 'Delete failed');
        }
    }

    return (
        <div>
            <AdminPageHeader
                title="Project categories"
                description="Group portfolio work for filters and organization. Deleting a category may affect linked projects."
            />
            <AdminCrudToolbar onReload={load} onCreate={openCreate} />

            <ul className="mt-6 space-y-3">
                {rows.length === 0 ? (
                    <li className="rounded-xl border border-dashed border-white/10 py-12 text-center text-sm text-slate-500">No categories yet.</li>
                ) : (
                    rows.map((c) => (
                        <li key={c.id} className={adminListRow}>
                            <span className="font-medium text-slate-200">
                                {c.name}{' '}
                                <span className="font-normal text-slate-500">({c.slug})</span>
                            </span>
                            <div className="flex gap-1">
                                <button type="button" className={adminTextLink} onClick={() => openEdit(c)}>
                                    Edit
                                </button>
                                <button type="button" className={adminTextLinkDanger} onClick={() => setDeleteId(c.id)}>
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>

            {modal ? (
                <AdminModal title={editing ? 'Edit category' : 'Create category'} onClose={() => setModal(false)}>
                    <form onSubmit={save} className="space-y-4">
                        <label className="block">
                            <span className={adminLabel}>Name</span>
                            <input className={adminInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Slug (optional)</span>
                            <input
                                className={adminInput}
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                placeholder="auto from name"
                            />
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
                    title="Delete category?"
                    message="Projects may lose this category link."
                    onConfirm={() => remove(deleteId)}
                    onCancel={() => setDeleteId(null)}
                    danger
                />
            ) : null}
        </div>
    );
}
