import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminModal from '@/components/admin/AdminModal';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import { toastApiError } from '@/utils/toastApiError';

const inp = 'mt-1 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm';

const empty = {
    name: '',
    position: '',
    bio: '',
    sort_order: 0,
    linkedin: '',
    github: '',
    twitter: '',
};

function buildTeamFormData(form, photoFile) {
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('position', form.position || '');
    fd.append('bio', form.bio || '');
    fd.append('sort_order', String(form.sort_order ?? 0));
    fd.append(
        'social_links',
        JSON.stringify({
            linkedin: form.linkedin || '',
            github: form.github || '',
            twitter: form.twitter || '',
        }),
    );
    if (photoFile) {
        fd.append('photo', photoFile);
    }
    return fd;
}

export default function AdminTeam() {
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState({});
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [photoFile, setPhotoFile] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    function load() {
        api
            .get('/admin/team-members', { params: { page, per_page: 15 } })
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
        setPhotoFile(null);
        setModal(true);
    }

    async function openEdit(m) {
        setEditing(m);
        let d = m;
        try {
            const r = await api.get(`/admin/team-members/${m.id}`);
            d = unwrap(r) || m;
        } catch {
            /* use row */
        }
        const sl = d.social_links || {};
        setForm({
            name: d.name || '',
            position: d.position || '',
            bio: d.bio || '',
            sort_order: d.sort_order ?? 0,
            linkedin: sl.linkedin || '',
            github: sl.github || '',
            twitter: sl.twitter || '',
        });
        setPhotoFile(null);
        setModal(true);
    }

    async function save(e) {
        e.preventDefault();
        const fd = buildTeamFormData(form, photoFile);
        try {
            if (editing) {
                unwrap(await api.put(`/admin/team-members/${editing.id}`, fd));
                toast.success('Team member updated');
            } else {
                unwrap(await api.post('/admin/team-members', fd));
                toast.success('Team member created');
            }
            setModal(false);
            load();
        } catch (err) {
            toastApiError(err, 'Save failed');
        }
    }

    async function remove(id) {
        try {
            unwrap(await api.delete(`/admin/team-members/${id}`));
            toast.success('Deleted');
            setDeleteId(null);
            load();
        } catch (err) {
            toastApiError(err, 'Delete failed');
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Team</h1>
            <AdminCrudToolbar onReload={load} onCreate={openCreate} createLabel="Add member" />

            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="min-w-full text-sm">
                    <thead className="bg-white/5 text-left">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Role</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((m) => (
                            <tr key={m.id} className="border-t border-white/5">
                                <td className="p-3">{m.name}</td>
                                <td className="p-3">{m.position}</td>
                                <td className="p-3 text-right">
                                    <button type="button" className="mr-2 text-landogz-accent" onClick={() => openEdit(m)}>
                                        Edit
                                    </button>
                                    <button type="button" className="text-red-400" onClick={() => setDeleteId(m.id)}>
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
                <AdminModal title={editing ? 'Edit team member' : 'Add team member'} onClose={() => setModal(false)} wide>
                    <form onSubmit={save} className="space-y-3">
                        <label className="block text-sm">
                            <span className="text-slate-400">Name</span>
                            <input className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        </label>
                        <label className="block text-sm">
                            <span className="text-slate-400">Position</span>
                            <input className={inp} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
                        </label>
                        <label className="block text-sm">
                            <span className="text-slate-400">Bio</span>
                            <textarea className={inp} rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-3">
                            <label className="block text-sm">
                                <span className="text-slate-400">LinkedIn</span>
                                <input className={inp} value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
                            </label>
                            <label className="block text-sm">
                                <span className="text-slate-400">GitHub</span>
                                <input className={inp} value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
                            </label>
                            <label className="block text-sm">
                                <span className="text-slate-400">Twitter / X</span>
                                <input className={inp} value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} />
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
                            <span className="text-slate-400">Photo {editing ? '(optional)' : '(optional)'}</span>
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
                <AdminConfirmDialog title="Delete team member?" onConfirm={() => remove(deleteId)} onCancel={() => setDeleteId(null)} danger />
            ) : null}
        </div>
    );
}
