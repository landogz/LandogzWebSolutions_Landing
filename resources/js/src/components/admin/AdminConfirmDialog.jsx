import { adminDangerBtn, adminPrimaryBtn, adminSecondaryBtn } from '@/components/admin/adminTheme';

export default function AdminConfirmDialog({ title, message, confirmLabel = 'Delete', danger, onConfirm, onCancel }) {
    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
        >
            <div className="w-full max-w-md rounded-3xl border border-white/[0.10] bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
                <h3 id="confirm-title" className="font-display text-xl font-bold text-white">
                    {title}
                </h3>
                {message ? <p className="mt-3 text-sm leading-relaxed text-slate-400">{message}</p> : null}
                <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-3">
                    <button type="button" className={`${adminSecondaryBtn} w-full sm:w-auto`} onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={`${danger ? adminDangerBtn : adminPrimaryBtn} w-full sm:w-auto`}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
