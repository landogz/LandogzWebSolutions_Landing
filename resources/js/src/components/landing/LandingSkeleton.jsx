export default function LandingSkeleton() {
    return (
        <div className="min-h-[100dvh] bg-slate-50 dark:bg-landogz-navy" aria-busy="true" aria-label="Loading portfolio">
            <div className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/85 pt-safe backdrop-blur-md dark:border-white/10 dark:bg-landogz-navy/85">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
                    <div className="h-9 w-36 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
                    <div className="hidden gap-3 md:flex">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-4 w-14 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                        ))}
                    </div>
                    <div className="h-10 w-20 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
                </div>
            </div>

            <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-28 lg:grid-cols-2 lg:items-center">
                <div className="space-y-4">
                    <div className="h-3 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-12 w-full max-w-md animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
                    <div className="h-12 w-4/5 max-w-sm animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
                    <div className="h-20 w-full max-w-lg animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
                    <div className="flex gap-3 pt-2">
                        <div className="h-11 w-32 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
                        <div className="h-11 w-32 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>
                <div className="hidden aspect-[4/3] animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800 lg:block" />
            </div>

            <div className="mx-auto max-w-6xl px-4 pb-16">
                <div className="mx-auto mb-10 h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10">
                            <div className="aspect-[5/4] animate-pulse bg-slate-200 dark:bg-slate-800" />
                            <div className="space-y-3 p-4">
                                <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                                <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
