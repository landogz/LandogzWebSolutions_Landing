import { adminPrimaryBtn } from '@/components/admin/adminTheme';

export default function AdminEmptyState({
    title = 'Nothing here yet',
    description,
    actionLabel,
    onAction,
    filtered = false,
    error = false,
    onRetry,
}) {
    return (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
            <p className="font-display text-lg font-semibold text-white">
                {error ? 'Could not load data' : filtered ? 'No matches' : title}
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {error
                    ? 'Check your connection and try again.'
                    : filtered
                      ? 'Try a different search or clear filters.'
                      : description || 'Create your first item to get started.'}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {error && onRetry ? (
                    <button type="button" className={adminPrimaryBtn} onClick={onRetry}>
                        Retry
                    </button>
                ) : null}
                {!error && actionLabel && onAction ? (
                    <button type="button" className={adminPrimaryBtn} onClick={onAction}>
                        {actionLabel}
                    </button>
                ) : null}
            </div>
        </div>
    );
}
