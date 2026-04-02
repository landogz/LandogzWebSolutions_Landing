export default function AdminModal({ title, children, onClose, wide }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className={`max-h-[90vh] overflow-y-auto rounded-xl border border-white/15 bg-slate-900 p-6 shadow-xl ${
                    wide ? 'w-full max-w-3xl' : 'w-full max-w-lg'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                        type="button"
                        className="rounded px-2 py-1 text-xl leading-none text-slate-400 hover:text-white"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
