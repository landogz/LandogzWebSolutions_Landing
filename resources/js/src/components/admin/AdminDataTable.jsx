import { adminTableShell, adminTableHead, adminTh, adminTd } from '@/components/admin/adminTheme';
import AdminLoadingState from '@/components/admin/AdminLoadingState';
import AdminEmptyState from '@/components/admin/AdminEmptyState';

/**
 * Thin table shell with optional media column and right-aligned actions.
 * columns: [{ key, label, className?, render?(row) }]
 * actions: (row) => ReactNode
 */
export default function AdminDataTable({
    columns = [],
    rows = [],
    loading = false,
    error = false,
    onRetry,
    emptyTitle,
    emptyDescription,
    emptyActionLabel,
    onEmptyAction,
    filtered = false,
    actions,
    media,
}) {
    const colCount = columns.length + (media ? 1 : 0) + (actions ? 1 : 0);

    if (loading) {
        return (
            <div className={`${adminTableShell} mt-6`}>
                <AdminLoadingState />
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-6">
                <AdminEmptyState error onRetry={onRetry} />
            </div>
        );
    }

    if (!rows.length) {
        return (
            <div className="mt-6">
                <AdminEmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    actionLabel={emptyActionLabel}
                    onAction={onEmptyAction}
                    filtered={filtered}
                />
            </div>
        );
    }

    return (
        <div className={`${adminTableShell} mt-6`}>
            <table className="min-w-full text-sm">
                <thead className={adminTableHead}>
                    <tr>
                        {media ? <th className={adminTh}>Media</th> : null}
                        {columns.map((c) => (
                            <th key={c.key} className={`${adminTh} ${c.className || ''}`}>
                                {c.label}
                            </th>
                        ))}
                        {actions ? <th className={`${adminTh} text-right`}>Actions</th> : null}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id} className="hover:bg-white/[0.02]">
                            {media ? (
                                <td className={adminTd}>
                                    {media(row) || (
                                        <div className="h-10 w-10 rounded-lg bg-white/5 ring-1 ring-white/10" />
                                    )}
                                </td>
                            ) : null}
                            {columns.map((c) => (
                                <td key={c.key} className={`${adminTd} ${c.className || ''}`}>
                                    {c.render ? c.render(row) : row[c.key]}
                                </td>
                            ))}
                            {actions ? <td className={`${adminTd} text-right`}>{actions(row)}</td> : null}
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* keep colCount referenced for future empty-row colspan helpers */}
            <span className="sr-only">{colCount} columns</span>
        </div>
    );
}
