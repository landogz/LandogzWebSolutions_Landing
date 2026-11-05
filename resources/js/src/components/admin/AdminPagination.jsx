import { adminPaginationBtn } from '@/components/admin/adminTheme';

export default function AdminPagination({ meta = {}, page, onPageChange }) {
    const current = Number(meta.current_page || page || 1);
    const last = Number(meta.last_page || 1);
    const total = meta.total;

    if (last <= 1 && total == null) {
        return null;
    }

    return (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
                {total != null ? (
                    <>
                        Page <span className="font-semibold text-slate-300">{current}</span> of{' '}
                        <span className="font-semibold text-slate-300">{last}</span>
                        <span className="text-slate-600"> · </span>
                        <span className="tabular-nums">{total}</span> total
                    </>
                ) : (
                    <>
                        Page <span className="font-semibold text-slate-300">{current}</span> / {last}
                    </>
                )}
            </p>
            <div className="flex gap-2">
                <button
                    type="button"
                    className={adminPaginationBtn}
                    disabled={current <= 1}
                    onClick={() => onPageChange(current - 1)}
                >
                    Prev
                </button>
                <button
                    type="button"
                    className={adminPaginationBtn}
                    disabled={current >= last}
                    onClick={() => onPageChange(current + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
