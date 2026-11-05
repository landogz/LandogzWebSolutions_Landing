export default function AdminLoadingState({ label = 'Loading…' }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-16" role="status" aria-live="polite">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-sky-400/30 border-t-sky-400" />
            <p className="text-sm text-slate-500">{label}</p>
        </div>
    );
}
