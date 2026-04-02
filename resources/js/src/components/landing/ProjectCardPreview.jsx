/**
 * Stylized browser-frame preview when no project thumbnail exists.
 */
export default function ProjectCardPreview({ title }) {
    const safe = (title || 'Project').slice(0, 32);

    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-br from-slate-500 via-slate-600 to-indigo-800 saturate-[1.15]">
            <div className="absolute inset-0 opacity-100">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 20% 30%, rgba(56,189,248,0.65), transparent 50%), radial-gradient(circle at 80% 70%, rgba(167,139,250,0.55), transparent 45%), radial-gradient(circle at 50% 100%, rgba(255,255,255,0.18), transparent 58%)',
                    }}
                />
                <div
                    className="absolute inset-0 opacity-[0.28]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                    }}
                />
            </div>
            <div className="relative flex items-center gap-2 border-b border-white/25 bg-white/10 px-3 py-2 backdrop-blur-sm">
                <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/90 shadow-sm" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90 shadow-sm" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/90 shadow-sm" />
                </div>
                <span className="truncate font-mono text-[10px] text-sky-200 sm:text-[11px]">/{safe.toLowerCase().replace(/\s+/g, '-')}</span>
            </div>
            <div className="relative flex flex-1 flex-col gap-3 p-3 sm:p-4">
                <div className="flex min-h-[6.5rem] gap-2 sm:min-h-[7.5rem] sm:gap-3">
                    <div className="flex-[1.4] rounded-lg bg-gradient-to-br from-sky-300/50 via-violet-300/40 to-fuchsia-400/35 ring-1 ring-white/40 shadow-inner" />
                    <div className="flex w-[32%] flex-col justify-center gap-2">
                        <div className="h-2 rounded bg-white/40" />
                        <div className="h-2 w-4/5 rounded bg-white/32" />
                        <div className="h-2 w-3/5 rounded bg-white/22" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="h-10 flex-1 rounded-md bg-white/22 ring-1 ring-white/25" />
                    <div className="h-10 flex-1 rounded-md bg-white/22 ring-1 ring-white/25" />
                    <div className="hidden h-10 w-14 rounded-md bg-sky-300/50 ring-1 ring-sky-200/50 sm:block" />
                </div>
            </div>
        </div>
    );
}
