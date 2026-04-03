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
    adminFileInput,
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

export default function AdminClients() {
    const [rows, setRows] = useState([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [logoFile, setLogoFile] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    function load() {
        api
            .get('/admin/clients')
            .then((r) => setRows(unwrap(r) || []))
            .catch(() => toast.error('Failed to load'));
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
        const fd = buildClientFormData(form, logoFile);
        try {
            if (editing) {
                unwrap(await api.post(`/admin/clients/${editing.id}`, fd));
                toast.success('Client updated');
            } else {
                unwrap(await api.post('/admin/clients', fd));
                toast.success('Client created');
            }
            setModal(false);
            load();
        } catch (err) {
            toastApiError(err, 'Save failed');
        }
    }

    async function remove(id) {
        try {
            unwrap(await api.delete(`/admin/clients/${id}`));
            toast.success('Deleted');
            setDeleteId(null);
            load();
        } catch (err) {
            toastApiError(err, 'Delete failed');
        }
    }

    return (
        <div>
            <AdminPageHeader title="Clients / partners" description="Logo strip and partner names for social proof on the landing page." />
            <AdminCrudToolbar onReload={load} onCreate={openCreate} />

            <ul className="mt-6 space-y-3">
                {rows.length === 0 ? (
                    <li className="rounded-xl border border-dashed border-white/10 py-12 text-center text-sm text-slate-500">No clients yet.</li>
                ) : (
                    rows.map((c) => (
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
                    ))
                )}
            </ul>

            {modal ? (
                <AdminModal title={editing ? 'Edit client' : 'Add client'} onClose={() => setModal(false)}>
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
                        <label className="block">
                            <span className={adminLabel}>Logo</span>
                            <input type="file" accept="image/*" className={adminFileInput} onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
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
                <AdminConfirmDialog title="Delete client?" onConfirm={() => remove(deleteId)} onCancel={() => setDeleteId(null)} danger />
            ) : null}
        </div>
    );
}
