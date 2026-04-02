import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminModal from '@/components/admin/AdminModal';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
    adminTableShell,
    adminTableHead,
    adminTh,
    adminTd,
    adminBadge,
    adminPaginationBtn,
    adminTextLink,
    adminTextLinkDanger,
} from '@/components/admin/adminTheme';
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
            <AdminPageHeader
                title="Contact messages"
                description="Inbound form submissions — mark read, archive, or remove after you have followed up."
            />
            <AdminCrudToolbar onReload={load} />

            <div className={`${adminTableShell} mt-6`}>
                <table className="min-w-full text-sm">
                    <thead className={adminTableHead}>
                        <tr>
                            <th className={adminTh}>From</th>
                            <th className={adminTh}>Subject</th>
                            <th className={adminTh}>Status</th>
                            <th className={adminTh}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={4} className={`${adminTd} py-12 text-center text-slate-500`}>
                                    No messages yet.
                                </td>
                            </tr>
                        ) : (
                            rows.map((m) => (
                                <tr key={m.id} className="transition hover:bg-white/[0.02]">
                                    <td className={adminTd}>
                                        <span className="font-medium text-slate-200">{m.name}</span>
                                        <span className="mt-0.5 block text-xs text-slate-500">{m.email}</span>
                                    </td>
                                    <td className={adminTd}>{m.subject || '—'}</td>
                                    <td className={adminTd}>
                                        <span className={adminBadge}>{m.status}</span>
                                    </td>
                                    <td className={adminTd}>
                                        <div className="flex flex-wrap gap-1">
                                            <button type="button" className={adminTextLink} onClick={() => openView(m)}>
                                                View
                                            </button>
                                            <button type="button" className={adminTextLink} onClick={() => setStatus(m.id, 'read')}>
                                                Read
                                            </button>
                                            <button type="button" className={adminTextLink} onClick={() => setStatus(m.id, 'archived')}>
                                                Archive
                                            </button>
                                            <button type="button" className={adminTextLinkDanger} onClick={() => setDeleteId(m.id)}>
                                                Delete
                                            </button>
                                        </div>
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

            {view ? (
                <AdminModal title="Message" onClose={() => setView(null)} wide>
                    <div className="space-y-3 text-sm text-slate-300">
                        <p>
                            <span className="text-slate-500">From:</span> {view.name} &lt;{view.email}&gt;
                        </p>
                        <p>
                            <span className="text-slate-500">Subject:</span> {view.subject || '—'}
                        </p>
                        <p>
                            <span className="text-slate-500">Status:</span> <span className={adminBadge}>{view.status}</span>
                        </p>
                        <p className="whitespace-pre-wrap rounded-xl border border-white/[0.08] bg-black/25 p-4 text-slate-200">{view.message}</p>
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
