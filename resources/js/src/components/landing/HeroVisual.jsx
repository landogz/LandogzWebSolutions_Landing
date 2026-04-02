import { motion } from 'framer-motion';

const codeLines = [
    { text: 'Route::prefix(\'api/v1\')->group(function () {', className: 'text-slate-500' },
    { text: '  return ProjectResource::collection(', className: 'text-sky-400/90' },
    { text: '    $projects->load(\'category\')', className: 'text-emerald-400/90' },
    { text: '  );', className: 'text-slate-500' },
    { text: '});', className: 'text-slate-500' },
];

export default function HeroVisual() {
    return (
        <div className="relative mx-auto w-full max-w-lg pr-2 sm:pr-5 lg:max-w-none lg:pr-8">
            <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-sky-500/20 via-violet-600/10 to-transparent blur-3xl dark:from-sky-400/15" />
            <motion.div
                initial={{ opacity: 0, y: 24, rotateX: 8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative origin-center scale-[0.94] sm:scale-[0.96] lg:scale-[0.95] lg:origin-top"
            >
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/5 dark:border-white/10 dark:bg-landogz-navy/90 dark:shadow-black/40 dark:ring-white/5">
                    <div className="flex items-center gap-2 border-b border-slate-200/80 bg-slate-100/90 px-4 py-3 dark:border-white/10 dark:bg-black/40">
                        <div className="flex gap-1.5">
                            <span className="h-3 w-3 rounded-full bg-red-400/90" />
                            <span className="h-3 w-3 rounded-full bg-amber-400/90" />
                            <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
                        </div>
                        <span className="ml-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">app/Http/routes/api.php</span>
                    </div>
                    <div className="space-y-1.5 p-4 font-mono text-[11px] leading-relaxed sm:text-xs sm:leading-relaxed">
                        {codeLines.map((line, i) => (
                            <motion.div
                                key={line.text}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.35 + i * 0.08 }}
                                className={line.className}
                            >
                                {line.text}
                            </motion.div>
                        ))}
                        <motion.span
                            className="inline-block h-4 w-1.5 animate-pulse bg-sky-500 align-middle"
                            aria-hidden
                        />
                    </div>
                </div>
                <div className="absolute -bottom-3 -right-2 hidden sm:block">
                    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-3 text-left text-white shadow-xl dark:from-slate-800 dark:to-slate-950">
                        <p className="font-display text-2xl font-bold text-sky-400">99.9%</p>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">uptime mindset</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
