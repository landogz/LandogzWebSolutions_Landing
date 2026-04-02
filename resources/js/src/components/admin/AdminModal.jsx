export default function AdminModal({ title, children, onClose, wide }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-10 backdrop-blur-md sm:items-center sm:pb-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-modal-title"
            onClick={onClose}
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
        >
            <div
                className={`max-h-[min(90dvh,100vh-2rem)] w-full overflow-y-auto overscroll-contain rounded-t-3xl border border-white/[0.10] bg-gradient-to-b from-slate-900 to-slate-950 shadow-[0_-8px_48px_rgba(0,0,0,0.5)] sm:rounded-3xl ${
                    wide ? 'max-w-3xl' : 'max-w-lg'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/[0.08] bg-slate-900/95 px-5 py-4 backdrop-blur-md sm:px-6 sm:py-5">
                    <h2 id="admin-modal-title" className="font-display text-lg font-bold tracking-tight text-white">
                        {title}
                    </h2>
                    <button
                        type="button"
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-xl leading-none text-slate-400 transition hover:bg-white/10 hover:text-white"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
                <div className="p-5 sm:p-6">{children}</div>
            </div>
        </div>
    );
}
