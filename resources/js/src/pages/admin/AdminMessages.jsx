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

            <AdminDataTable
                loading={loading}
                error={loadError}
                onRetry={load}
                rows={rows}
                emptyTitle="No messages yet"
                emptyDescription="Contact form submissions will appear here."
                columns={[
                    {
                        key: 'from',
                        label: 'From',
                        render: (m) => (
                            <>
                                <span className="font-medium text-slate-200">{m.name}</span>
                                <span className="mt-0.5 block text-xs text-slate-500">{m.email}</span>
                            </>
                        ),
                    },
                    { key: 'subject', label: 'Subject', render: (m) => m.subject || '—' },
                    {
                        key: 'status',
                        label: 'Status',
                        render: (m) => <span className={adminBadge}>{m.status}</span>,
                    },
                ]}
                actions={(m) => (
                    <div className="flex flex-wrap justify-end gap-1">
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
                )}
            />
            <AdminPagination meta={meta} page={page} onPageChange={setPage} />

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
