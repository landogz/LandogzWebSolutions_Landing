import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminModal from '@/components/admin/AdminModal';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import { toastApiError } from '@/utils/toastApiError';

const inp = 'mt-1 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm';

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
                unwrap(await api.put(`/admin/clients/${editing.id}`, fd));
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
            <h1 className="text-2xl font-bold">Clients / partners</h1>
            <AdminCrudToolbar onReload={load} onCreate={openCreate} />

            <ul className="space-y-2">
                {rows.map((c) => (
                    <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 px-4 py-3">
                        <span>{c.company_name}</span>
                        <div className="flex gap-2">
                            <button type="button" className="text-sm text-landogz-accent" onClick={() => openEdit(c)}>
                                Edit
                            </button>
                            <button type="button" className="text-sm text-red-400" onClick={() => setDeleteId(c.id)}>
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {modal ? (
                <AdminModal title={editing ? 'Edit client' : 'Add client'} onClose={() => setModal(false)}>
                    <form onSubmit={save} className="space-y-3">
                        <label className="block text-sm">
                            <span className="text-slate-400">Company name</span>
                            <input className={inp} value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} required />
                        </label>
                        <label className="block text-sm">
                            <span className="text-slate-400">Website URL</span>
                            <input className={inp} value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} />
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
                            <span className="text-slate-400">Logo</span>
                            <input type="file" accept="image/*" className="mt-1 text-sm" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
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
                <AdminConfirmDialog title="Delete client?" onConfirm={() => remove(deleteId)} onCancel={() => setDeleteId(null)} danger />
            ) : null}
        </div>
    );
}
