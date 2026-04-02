export default function AdminConfirmDialog({ title, message, confirmLabel = 'Delete', danger, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-sm rounded-xl border border-white/15 bg-slate-900 p-6">
                <h3 className="font-semibold">{title}</h3>
                {message ? <p className="mt-2 text-sm text-slate-400">{message}</p> : null}
                <div className="mt-4 flex flex-wrap gap-3">
                    <button
                        type="button"
                        className={`rounded-lg px-4 py-2 text-sm font-medium ${danger ? 'bg-red-600 text-white' : 'bg-landogz-blue text-white'}`}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                    <button type="button" className="rounded-lg border border-white/15 px-4 py-2 text-sm" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
