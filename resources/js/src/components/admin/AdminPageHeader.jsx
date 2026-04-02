/**
 * Consistent page title block for admin modules.
 */
export default function AdminPageHeader({ kicker = 'Console', title, description, children }) {
    return (
        <div className="mb-8 flex flex-col gap-5 border-b border-white/[0.06] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-400/90">{kicker}</p>
                <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-white sm:text-[2rem] sm:leading-tight">{title}</h1>
                {description ? <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">{description}</p> : null}
            </div>
            {children ? <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div> : null}
        </div>
    );
}
