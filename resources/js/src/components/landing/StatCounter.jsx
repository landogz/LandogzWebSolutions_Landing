import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function parseStat(raw) {
    const s = String(raw ?? '').trim();
    const m = s.match(/^(\d+)\s*(\+)?$/);
    if (m) {
        return { value: Number(m[1]), suffix: m[2] ? '+' : '', display: undefined };
    }
    return { value: null, suffix: '', display: s };
}

const ACCENT = {
    sky: 'from-sky-500/20 to-cyan-500/5 ring-sky-500/25 dark:from-sky-500/10',
    violet: 'from-violet-500/20 to-fuchsia-500/5 ring-violet-500/25 dark:from-violet-500/10',
    amber: 'from-amber-500/20 to-orange-500/5 ring-amber-500/25 dark:from-amber-500/10',
    emerald: 'from-emerald-500/20 to-teal-500/5 ring-emerald-500/25 dark:from-emerald-500/10',
};

export default function StatCounter({ value: raw, label, accent = 'sky' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const { value, suffix, display } = parseStat(raw);
    const [n, setN] = useState(0);

    useEffect(() => {
        if (display !== undefined || value == null || !inView) return;
        const duration = 1400;
        const start = performance.now();
        const to = value;
        function tick(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - (1 - t) ** 3;
            setN(Math.round(to * eased));
            if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }, [inView, value, display]);

    const numeral = display !== undefined ? display : `${n}${suffix}`;
    const ring = ACCENT[accent] || ACCENT.sky;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 sm:p-8 ring-1 ring-inset ring-slate-200/90 dark:ring-white/10 ${ring}`}
        >
            <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br from-sky-400/20 to-transparent blur-2xl dark:from-sky-400/10" />
            <div className="font-display text-5xl font-black tabular-nums tracking-tighter text-slate-900 drop-shadow-sm dark:text-white sm:text-6xl sm:tracking-tight">
                {numeral}
            </div>
            <div className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">{label}</div>
        </motion.div>
    );
}
