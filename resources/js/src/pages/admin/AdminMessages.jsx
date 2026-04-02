import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminModal from '@/components/admin/AdminModal';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import { toastApiError } from '@/utils/toastApiError';

export default function AdminMessages() {
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState({});
    const [page, setPage] = useState(1);
    const [view, setView] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    function load() {
        api
            .get('/admin/contact-messages', { params: { page, per_page: 15 } })
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

    async function setStatus(id, status) {
        try {
            unwrap(await api.patch(`/admin/contact-messages/${id}`, { status }));
            toast.success('Updated');
            load();
        } catch (e) {
            toastApiError(e, 'Update failed');
        }
    }

    async function openView(m) {
        try {
            const r = await api.get(`/admin/contact-messages/${m.id}`);
            setView(unwrap(r) || m);
        } catch {
            setView(m);
        }
    }

    async function remove(id) {
        try {
            unwrap(await api.delete(`/admin/contact-messages/${id}`));
            toast.success('Message deleted');
            setDeleteId(null);
            load();
        } catch (e) {
            toastApiError(e, 'Delete failed');
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Contact messages</h1>
            <p className="mt-2 text-sm text-slate-400">List (reload), update status, view full message, delete.</p>
            <AdminCrudToolbar onReload={load} />

            <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
                <table className="min-w-full text-sm">
                    <thead className="bg-white/5 text-left text-slate-400">
                        <tr>
                            <th className="p-3">From</th>
                            <th className="p-3">Subject</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((m) => (
                            <tr key={m.id} className="border-t border-white/5 align-top">
                                <td className="p-3">
                                    {m.name}
                                    <br />
                                    <span className="text-slate-500">{m.email}</span>
                                </td>
                                <td className="p-3">{m.subject}</td>
                                <td className="p-3">{m.status}</td>
                                <td className="p-3">
                                    <div className="flex flex-wrap gap-2">
                                        <button type="button" className="text-xs text-landogz-accent" onClick={() => openView(m)}>
                                            View
                                        </button>
                                        <button type="button" className="text-xs" onClick={() => setStatus(m.id, 'read')}>
                                            Read
                                        </button>
                                        <button type="button" className="text-xs" onClick={() => setStatus(m.id, 'archived')}>
                                            Archive
                                        </button>
                                        <button type="button" className="text-xs text-red-400" onClick={() => setDeleteId(m.id)}>
                                            Delete
                                        </button>
                                    </div>
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

            {view ? (
                <AdminModal title="Message" onClose={() => setView(null)} wide>
                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="text-slate-400">From:</span> {view.name} &lt;{view.email}&gt;
                        </p>
                        <p>
                            <span className="text-slate-400">Subject:</span> {view.subject || '—'}
                        </p>
                        <p>
                            <span className="text-slate-400">Status:</span> {view.status}
                        </p>
                        <p className="whitespace-pre-wrap rounded-lg border border-white/10 bg-black/20 p-3">{view.message}</p>
                        <p className="text-xs text-slate-500">{view.created_at}</p>
                    </div>
                </AdminModal>
            ) : null}

            {deleteId ? (
                <AdminConfirmDialog title="Delete this message?" onConfirm={() => remove(deleteId)} onCancel={() => setDeleteId(null)} danger />
            ) : null}
        </div>
    );
}
