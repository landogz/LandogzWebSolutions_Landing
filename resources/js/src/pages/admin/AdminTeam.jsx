import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminModal from '@/components/admin/AdminModal';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminImageField from '@/components/admin/AdminImageField';
import {
    adminInput,
    adminLabel,
    adminPrimaryBtn,
    adminSecondaryBtn,
    adminTextarea,
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
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    function load() {
        setLoading(true);
        setLoadError(false);
        api
            .get('/admin/team-members', { params: { page, per_page: 15 } })
            .then((r) => {
                const d = unwrap(r);
                setRows(d.items || []);
                setMeta(d.pagination || {});
            })
            .catch(() => {
                setLoadError(true);
                toast.error('Failed to load');
            })
            .finally(() => setLoading(false));
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
        if (saving) return;
        setSaving(true);
        try {
            if (editing) {
                if (photoFile) {
                    unwrap(await api.post(`/admin/team-members/${editing.id}`, buildTeamFormData(form, photoFile)));
                } else {
                    unwrap(await api.post(`/admin/team-members/${editing.id}`, buildTeamJsonBody(form)));
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
        } finally {
            setSaving(false);
        }
    }

    async function remove(id) {
        if (deleting) return;
        setDeleting(true);
        try {
            unwrap(await api.delete(`/admin/team-members/${id}`));
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
            <AdminPageHeader title="Team" description="People cards on the landing page — photo, role, bio, and social links." />
            <AdminCrudToolbar onReload={load} onCreate={openCreate} createLabel="Add member" />

            <AdminDataTable
                loading={loading}
                error={loadError}
                onRetry={load}
                rows={rows}
                emptyTitle="No team members yet"
                emptyDescription="Add the people who appear in Team Composition."
                emptyActionLabel="Add member"
                onEmptyAction={openCreate}
                media={(m) =>
                    m.photo_url ? (
                        <img src={m.photo_url} alt="" className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10" />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/15 text-xs font-bold text-sky-300 ring-1 ring-sky-500/20">
                            {(m.name || '?').slice(0, 1)}
                        </div>
                    )
                }
                columns={[
                    {
                        key: 'name',
                        label: 'Name',
                        render: (m) => <span className="font-medium text-slate-200">{m.name}</span>,
                    },
                    {
                        key: 'position',
                        label: 'Role',
                        render: (m) => m.position || '—',
                    },
                ]}
                actions={(m) => (
                    <>
                        <button type="button" className={`${adminTextLink} mr-1`} onClick={() => openEdit(m)}>
                            Edit
                        </button>
                        <button type="button" className={adminTextLinkDanger} onClick={() => setDeleteId(m.id)}>
                            Delete
                        </button>
                    </>
                )}
            />
            <AdminPagination meta={meta} page={page} onPageChange={setPage} />

            {modal ? (
                <AdminModal title={editing ? 'Edit team member' : 'Add team member'} onClose={() => !saving && setModal(false)} wide>
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
                    title="Delete team member?"
                    onConfirm={() => remove(deleteId)}
                    onCancel={() => !deleting && setDeleteId(null)}
                    busy={deleting}
                    danger
                />
            ) : null}
        </div>
    );
}
