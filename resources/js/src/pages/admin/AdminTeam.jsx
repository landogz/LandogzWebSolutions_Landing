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
    adminFileInput,
    adminTableShell,
    adminTableHead,
    adminTh,
    adminTd,
    adminPaginationBtn,
    adminTextLink,
    adminTextLinkDanger,
} from '@/components/admin/adminTheme';
import { toastApiError } from '@/utils/toastApiError';

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

/** JSON body for create/update when no new photo — avoids empty multipart bodies on some PHP hosts. */
function buildTeamJsonBody(form) {
    return {
        name: form.name,
        position: form.position || '',
        bio: form.bio || '',
        sort_order: Number(form.sort_order) || 0,
        social_links: {
            linkedin: form.linkedin || '',
            github: form.github || '',
            twitter: form.twitter || '',
        },
    };
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
        try {
            if (editing) {
                if (photoFile) {
                    unwrap(await api.post(`/admin/team-members/${editing.id}`, buildTeamFormData(form, photoFile)));
                } else {
                    unwrap(await api.put(`/admin/team-members/${editing.id}`, buildTeamJsonBody(form)));
                }
                toast.success('Team member updated');
            } else if (photoFile) {
                unwrap(await api.post('/admin/team-members', buildTeamFormData(form, photoFile)));
                toast.success('Team member created');
            } else {
                unwrap(await api.post('/admin/team-members', buildTeamJsonBody(form)));
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
            <AdminPageHeader title="Team" description="People cards on the landing page — photo, role, bio, and social links." />
            <AdminCrudToolbar onReload={load} onCreate={openCreate} createLabel="Add member" />

            <div className={`${adminTableShell} mt-6`}>
                <table className="min-w-full text-sm">
                    <thead className={adminTableHead}>
                        <tr>
                            <th className={adminTh}>Name</th>
                            <th className={adminTh}>Role</th>
                            <th className={`${adminTh} text-right`}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={3} className={`${adminTd} py-12 text-center text-slate-500`}>
                                    No team members yet.
                                </td>
                            </tr>
                        ) : (
                            rows.map((m) => (
                                <tr key={m.id} className="transition hover:bg-white/[0.02]">
                                    <td className={`${adminTd} font-medium text-slate-200`}>{m.name}</td>
                                    <td className={adminTd}>{m.position || '—'}</td>
                                    <td className={`${adminTd} text-right`}>
                                        <button type="button" className={`${adminTextLink} mr-1`} onClick={() => openEdit(m)}>
                                            Edit
                                        </button>
                                        <button type="button" className={adminTextLinkDanger} onClick={() => setDeleteId(m.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
                <button type="button" disabled={page <= 1} className={adminPaginationBtn} onClick={() => setPage((p) => p - 1)}>
                    Prev
                </button>
                <span className="text-sm text-slate-500">
                    <span className="tabular-nums text-slate-300">{meta.current_page || page}</span> /{' '}
                    <span className="tabular-nums">{meta.last_page || 1}</span>
                </span>
                <button
                    type="button"
                    disabled={(meta.current_page || page) >= (meta.last_page || 1)}
                    className={adminPaginationBtn}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </button>
            </div>

            {modal ? (
                <AdminModal title={editing ? 'Edit team member' : 'Add team member'} onClose={() => setModal(false)} wide>
                    <form onSubmit={save} className="space-y-4">
                        <label className="block">
                            <span className={adminLabel}>Name</span>
                            <input className={adminInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Position</span>
                            <input className={adminInput} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Bio</span>
                            <textarea className={adminTextarea} rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                        </label>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <label className="block">
                                <span className={adminLabel}>LinkedIn</span>
                                <input className={adminInput} value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
                            </label>
                            <label className="block">
                                <span className={adminLabel}>GitHub</span>
                                <input className={adminInput} value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
                            </label>
                            <label className="block">
                                <span className={adminLabel}>Twitter / X</span>
                                <input className={adminInput} value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} />
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
                        <label className="block">
                            <span className={adminLabel}>Photo</span>
                            <input type="file" accept="image/*" className={adminFileInput} onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
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
                <AdminConfirmDialog title="Delete team member?" onConfirm={() => remove(deleteId)} onCancel={() => setDeleteId(null)} danger />
            ) : null}
        </div>
    );
}
