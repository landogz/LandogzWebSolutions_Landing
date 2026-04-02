/** Category-tinted placeholder shells when a post has no featured image. */
const SHELLS = [
    {
        className:
            'bg-gradient-to-br from-sky-400/35 via-sky-600/20 to-indigo-900/50 dark:from-sky-500/25 dark:via-indigo-600/30 dark:to-slate-950',
        pattern:
            'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.35), transparent 42%), radial-gradient(circle at 85% 80%, rgba(56,189,248,0.35), transparent 45%)',
    },
    {
        className:
            'bg-gradient-to-br from-violet-400/30 via-fuchsia-500/20 to-slate-900/55 dark:from-violet-500/20 dark:via-fuchsia-600/25 dark:to-slate-950',
        pattern:
            'radial-gradient(circle at 80% 15%, rgba(255,255,255,0.3), transparent 40%), radial-gradient(circle at 20% 90%, rgba(167,139,250,0.4), transparent 48%)',
    },
    {
        className:
            'bg-gradient-to-br from-emerald-400/30 via-teal-600/20 to-slate-900/50 dark:from-emerald-500/20 dark:via-teal-600/30 dark:to-slate-950',
        pattern:
            'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.25), transparent 50%), radial-gradient(circle at 0% 100%, rgba(45,212,191,0.35), transparent 45%)',
    },
];

export function getBlogCardVisual(index) {
    return SHELLS[index % SHELLS.length];
}
