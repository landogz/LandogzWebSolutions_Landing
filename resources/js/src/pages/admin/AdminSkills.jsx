import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminModal from '@/components/admin/AdminModal';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import { toastApiError } from '@/utils/toastApiError';

const inp = 'mt-1 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm';

const empty = { name: '', category: '', proficiency: 80, sort_order: 0 };

function buildSkillFormData(form, iconFile) {
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('category', form.category);
    if (form.proficiency != null && form.proficiency !== '') {
        fd.append('proficiency', String(form.proficiency));
    }
    if (form.sort_order != null && form.sort_order !== '') {
        fd.append('sort_order', String(form.sort_order));
    }
    if (iconFile) {
        fd.append('icon', iconFile);
    }
    return fd;
}

export default function AdminSkills() {
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState({});
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [iconFile, setIconFile] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    function load() {
        api
            .get('/admin/skills', { params: { page, per_page: 20 } })
            .then((r) => {
                const d = unwrap(r);
                setRows(d.items || []);
                setMeta(d.pagination || {});
            })
            .catch(() => toast.error('Failed to load'));
    }

    useEffect(() => {
        load();
    }, [page]);

    function openCreate() {
        setEditing(null);
        setForm(empty);
        setIconFile(null);
        setModal(true);
    }

    function openEdit(s) {
        setEditing(s);
        setForm({
            name: s.name || '',
            category: s.category || '',
            proficiency: s.proficiency ?? 80,
            sort_order: s.sort_order ?? 0,
        });
        setIconFile(null);
        setModal(true);
    }

    async function save(e) {
        e.preventDefault();
        const fd = buildSkillFormData(form, iconFile);
        try {
            if (editing) {
                unwrap(await api.put(`/admin/skills/${editing.id}`, fd));
                toast.success('Skill updated');
            } else {
                unwrap(await api.post('/admin/skills', fd));
                toast.success('Skill created');
            }
            setModal(false);
            load();
        } catch (err) {
            toastApiError(err, 'Save failed');
        }
    }

    async function remove(id) {
        try {
            unwrap(await api.delete(`/admin/skills/${id}`));
            toast.success('Deleted');
            setDeleteId(null);
            load();
        } catch (err) {
            toastApiError(err, 'Delete failed');
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Skills</h1>
            <AdminCrudToolbar onReload={load} onCreate={openCreate} />

            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="min-w-full text-sm">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Category</th>
                            <th className="p-3 text-left">%</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((s) => (
                            <tr key={s.id} className="border-t border-white/5">
                                <td className="p-3">{s.name}</td>
                                <td className="p-3">{s.category}</td>
                                <td className="p-3">{s.proficiency}</td>
                                <td className="p-3 text-right">
                                    <button type="button" className="mr-2 text-landogz-accent" onClick={() => openEdit(s)}>
                                        Edit
                                    </button>
                                    <button type="button" className="text-red-400" onClick={() => setDeleteId(s.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex gap-2">
                <button type="button" disabled={page <= 1} className="rounded border border-white/15 px-3 py-1" onClick={() => setPage((p) => p - 1)}>
                    Prev
                </button>
                <span className="text-slate-400">
                    {meta.current_page || page} / {meta.last_page || 1}
                </span>
                <button
                    type="button"
                    disabled={(meta.current_page || page) >= (meta.last_page || 1)}
                    className="rounded border border-white/15 px-3 py-1"
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </button>
            </div>

            {modal ? (
                <AdminModal title={editing ? 'Edit skill' : 'Create skill'} onClose={() => setModal(false)} wide>
                    <form onSubmit={save} className="space-y-3">
                        <label className="block text-sm">
                            <span className="text-slate-400">Name</span>
                            <input className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        </label>
                        <label className="block text-sm">
                            <span className="text-slate-400">Category</span>
                            <input className={inp} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
                        </label>
                        <label className="block text-sm">
                            <span className="text-slate-400">Proficiency (0–100)</span>
                            <input
                                className={inp}
                                type="number"
                                min={0}
                                max={100}
                                value={form.proficiency}
                                onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })}
                            />
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
                        <label className="block text-sm">
                            <span className="text-slate-400">Icon {editing ? '(optional new file)' : '(optional)'}</span>
                            <input type="file" accept="image/*" className="mt-1 text-sm" onChange={(e) => setIconFile(e.target.files?.[0] || null)} />
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
                <AdminConfirmDialog title="Delete skill?" onConfirm={() => remove(deleteId)} onCancel={() => setDeleteId(null)} danger />
            ) : null}
        </div>
    );
}
