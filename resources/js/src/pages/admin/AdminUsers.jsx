import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminModal from '@/components/admin/AdminModal';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import {
    adminInput,
    adminLabel,
    adminPrimaryBtn,
    adminSecondaryBtn,
    adminSelect,
    adminBadge,
    adminTextLink,
    adminTextLinkDanger,
} from '@/components/admin/adminTheme';
import { toastApiError } from '@/utils/toastApiError';

const empty = { name: '', email: '', password: '', password_confirmation: '', role: 'editor' };
const emptyEdit = { name: '', email: '', password: '', password_confirmation: '', role: 'editor' };

function roleBadgeClass(role) {
    return role === 'super_admin'
        ? 'border-violet-500/30 bg-violet-500/10 text-violet-200'
        : 'border-sky-500/25 bg-sky-500/10 text-sky-200';
}

export default function AdminUsers() {
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState({});
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [editForm, setEditForm] = useState(emptyEdit);
    const [deleteId, setDeleteId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    function load() {
        setLoading(true);
        setLoadError(false);
        api
            .get('/admin/users', { params: { page, search, per_page: 15 } })
            .then((r) => {
                const d = unwrap(r);
                setRows(d.items || []);
                setMeta(d.pagination || {});
            })
            .catch((e) => {
                setLoadError(true);
                toastApiError(e, 'Failed to load users');
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {
        load();
    }, [page, search]);

    function openCreate() {
        setEditing(null);
        setForm(empty);
        setModal(true);
    }

    function openEdit(u) {
        setEditing(u);
        setEditForm({
            name: u.name || '',
            email: u.email || '',
            password: '',
            password_confirmation: '',
            role: u.role || 'editor',
        });
        setModal(true);
    }

    async function saveCreate(e) {
        e.preventDefault();
        try {
            unwrap(await api.post('/admin/users', form));
            toast.success('User created');
            setModal(false);
            load();
        } catch (err) {
            toastApiError(err, 'Save failed');
        }
    }

    async function saveEdit(e) {
        e.preventDefault();
        const payload = { name: editForm.name, email: editForm.email, role: editForm.role };
        if (editForm.password?.trim()) {
            payload.password = editForm.password;
            payload.password_confirmation = editForm.password_confirmation;
        }
        try {
            unwrap(await api.put(`/admin/users/${editing.id}`, payload));
            toast.success('User updated');
            setModal(false);
            load();
        } catch (err) {
            toastApiError(err, 'Update failed');
        }
    }

    async function remove(id) {
        try {
            unwrap(await api.delete(`/admin/users/${id}`));
            toast.success('User removed');
            setDeleteId(null);
            load();
        } catch (err) {
            toastApiError(err, 'Delete failed');
        }
    }

    return (
        <div>
            <AdminPageHeader
                title="Users"
                description="Administrator accounts — super admins can create editors and other super admins."
            />
            <AdminCrudToolbar onReload={load} onCreate={openCreate} createLabel="Add user" />

            <input
                className={`${adminInput} mt-4 max-w-md`}
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <AdminDataTable
                loading={loading}
                error={loadError}
                onRetry={load}
                rows={rows}
                filtered={Boolean(search)}
                emptyTitle="No users found"
                emptyDescription="Add an administrator account to get started."
                emptyActionLabel="Add user"
                onEmptyAction={openCreate}
                columns={[
                    {
                        key: 'name',
                        label: 'Name',
                        render: (u) => <span className="font-medium text-slate-200">{u.name}</span>,
                    },
                    { key: 'email', label: 'Email' },
                    {
                        key: 'role',
                        label: 'Role',
                        render: (u) => (
                            <span className={`inline-flex rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${roleBadgeClass(u.role)}`}>
                                {u.role === 'super_admin' ? 'Super admin' : 'Editor'}
                            </span>
                        ),
                    },
                    {
                        key: 'created_at',
                        label: 'Added',
                        className: 'text-xs text-slate-500',
                        render: (u) => (u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'),
                    },
                ]}
                actions={(u) => (
                    <>
                        <button type="button" className={`${adminTextLink} mr-1`} onClick={() => openEdit(u)}>
                            Edit
                        </button>
                        <button type="button" className={adminTextLinkDanger} onClick={() => setDeleteId(u.id)}>
                            Delete
                        </button>
                    </>
                )}
            />
            <AdminPagination meta={meta} page={page} onPageChange={setPage} />

            {modal ? (
                <AdminModal title={editing ? 'Edit user' : 'Create user'} onClose={() => setModal(false)} wide>
                    {!editing ? (
                        <form onSubmit={saveCreate} className="space-y-4">
                            <label className="block">
                                <span className={adminLabel}>Name</span>
                                <input className={adminInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                            </label>
                            <label className="block">
                                <span className={adminLabel}>Email</span>
                                <input
                                    className={adminInput}
                                    type="email"
                                    autoComplete="off"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </label>
                            <label className="block">
                                <span className={adminLabel}>Password</span>
                                <input
                                    className={adminInput}
                                    type="password"
                                    autoComplete="new-password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                            </label>
                            <label className="block">
                                <span className={adminLabel}>Confirm password</span>
                                <input
                                    className={adminInput}
                                    type="password"
                                    value={form.password_confirmation}
                                    onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                                    required
                                />
                            </label>
                            <label className="block">
                                <span className={adminLabel}>Role</span>
                                <select className={adminSelect} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                                    <option value="editor">Editor</option>
                                    <option value="super_admin">Super admin</option>
                                </select>
                            </label>
                            <div className="flex flex-wrap gap-3 pt-2">
                                <button type="submit" className={adminPrimaryBtn}>
                                    Create
                                </button>
                                <button type="button" className={adminSecondaryBtn} onClick={() => setModal(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={saveEdit} className="space-y-4">
                            <label className="block">
                                <span className={adminLabel}>Name</span>
                                <input className={adminInput} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
                            </label>
                            <label className="block">
                                <span className={adminLabel}>Email</span>
                                <input className={adminInput} type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
                            </label>
                            <label className="block">
                                <span className={adminLabel}>New password (optional)</span>
                                <input
                                    className={adminInput}
                                    type="password"
                                    autoComplete="new-password"
                                    value={editForm.password}
                                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                />
                            </label>
                            <label className="block">
                                <span className={adminLabel}>Confirm new password</span>
                                <input
                                    className={adminInput}
                                    type="password"
                                    value={editForm.password_confirmation}
                                    onChange={(e) => setEditForm({ ...editForm, password_confirmation: e.target.value })}
                                />
                            </label>
                            <label className="block">
                                <span className={adminLabel}>Role</span>
                                <select className={adminSelect} value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
                                    <option value="editor">Editor</option>
                                    <option value="super_admin">Super admin</option>
                                </select>
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
                    )}
                </AdminModal>
            ) : null}

            {deleteId ? (
                <AdminConfirmDialog
                    title="Delete this user?"
                    message="They will lose access immediately."
                    onConfirm={() => remove(deleteId)}
                    onCancel={() => setDeleteId(null)}
                    danger
                />
            ) : null}
        </div>
    );
}
