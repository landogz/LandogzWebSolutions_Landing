export default function AdminCrudToolbar({ onReload, onCreate, createLabel = 'Create' }) {
    return (
        <div className="mb-4 flex flex-wrap items-center gap-2">
            <button
                type="button"
                className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/5"
                onClick={onReload}
            >
                Reload
            </button>
            {onCreate ? (
                <button type="button" className="rounded-lg bg-landogz-blue px-3 py-1.5 text-sm font-medium" onClick={onCreate}>
                    {createLabel}
                </button>
            ) : null}
        </div>
    );
}
