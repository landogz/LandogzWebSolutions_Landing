import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminModal from '@/components/admin/AdminModal';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminLoadingState from '@/components/admin/AdminLoadingState';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminImageField from '@/components/admin/AdminImageField';
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

const empty = { company_name: '', website_url: '', sort_order: 0 };

function buildClientFormData(form, logoFile) {
    const fd = new FormData();
    fd.append('company_name', form.company_name);
    fd.append('website_url', form.website_url || '');
    fd.append('sort_order', String(form.sort_order ?? 0));
    if (logoFile) {
        fd.append('logo', logoFile);
    }
    return fd;
}

function buildClientJsonBody(form) {
    return {
        company_name: form.company_name,
        website_url: form.website_url || '',
        sort_order: Number(form.sort_order) || 0,
    };
}

export default function AdminClients() {
    const [rows, setRows] = useState([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [logoFile, setLogoFile] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    function load() {
        setLoading(true);
        setLoadError(false);
        api
            .get('/admin/clients')
            .then((r) => setRows(unwrap(r) || []))
            .catch(() => {
                setLoadError(true);
                toast.error('Failed to load');
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        load();
    }, []);

    function openCreate() {
        setEditing(null);
        setForm(empty);
        setLogoFile(null);
        setModal(true);
    }

    async function openEdit(c) {
        setEditing(c);
        let d = c;
        try {
            const r = await api.get(`/admin/clients/${c.id}`);
            d = unwrap(r) || c;
        } catch {
            /* use row */
        }
        setForm({
            company_name: d.company_name || '',
            website_url: d.website_url || '',
            sort_order: d.sort_order ?? 0,
        });
        setLogoFile(null);
        setModal(true);
    }

    async function save(e) {
        e.preventDefault();
        if (saving) return;
        setSaving(true);
        try {
            if (editing) {
                if (logoFile) {
                    unwrap(await api.post(`/admin/clients/${editing.id}`, buildClientFormData(form, logoFile)));
                } else {
                    unwrap(await api.post(`/admin/clients/${editing.id}`, buildClientJsonBody(form)));
                }
                toast.success('Client updated');
            } else if (logoFile) {
                unwrap(await api.post('/admin/clients', buildClientFormData(form, logoFile)));
                toast.success('Client created');
            } else {
                unwrap(await api.post('/admin/clients', buildClientJsonBody(form)));
                toast.success('Client created');
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
            unwrap(await api.delete(`/admin/clients/${id}`));
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
            <AdminPageHeader title="Clients / partners" description="Logo strip and partner names for social proof on the landing page." />
            <AdminCrudToolbar onReload={load} onCreate={openCreate} />

            {loading ? (
                <AdminLoadingState />
            ) : loadError ? (
                <div className="mt-6">
                    <AdminEmptyState error onRetry={load} />
                </div>
            ) : rows.length === 0 ? (
                <div className="mt-6">
                    <AdminEmptyState
                        title="No clients yet"
                        description="Add partner logos and names for social proof."
                        actionLabel="Add client"
                        onAction={openCreate}
                    />
                </div>
            ) : (
                <ul className="mt-6 space-y-3">
                    {rows.map((c) => (
                        <li key={c.id} className={adminListRow}>
                            <span className="font-medium text-slate-200">{c.company_name}</span>
                            <div className="flex gap-1">
                                <button type="button" className={adminTextLink} onClick={() => openEdit(c)}>
                                    Edit
                                </button>
                                <button type="button" className={adminTextLinkDanger} onClick={() => setDeleteId(c.id)}>
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {modal ? (
                <AdminModal title={editing ? 'Edit client' : 'Add client'} onClose={() => !saving && setModal(false)}>
                    <form onSubmit={save} className="space-y-4">
                        <label className="block">
                            <span className={adminLabel}>Company name</span>
                            <input className={adminInput} value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} required />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Website URL</span>
                            <input className={adminInput} value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} />
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
                        <AdminImageField label="Logo" currentUrl={editing?.logo_url} file={logoFile} onFileChange={setLogoFile} />
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
                    title="Delete client?"
                    onConfirm={() => remove(deleteId)}
                    onCancel={() => !deleting && setDeleteId(null)}
                    busy={deleting}
                    danger
                />
            ) : null}
        </div>
    );
}
