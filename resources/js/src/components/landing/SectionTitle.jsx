/**
 * Display heading + optional eyebrow for landing sections (typographic hierarchy).
 */
export default function SectionTitle({ eyebrow, title, subtitle, align = 'left' }) {
    return (
        <div className={align === 'center' ? 'text-center' : ''}>
            {eyebrow ? (
                <p className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-sky-600 dark:text-sky-300">{eyebrow}</p>
            ) : null}
            <h2
                className={`font-display mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-[2.75rem] md:leading-tight ${
                    align === 'center' ? 'mx-auto max-w-3xl' : ''
                }`}
            >
                {title}
            </h2>
            {subtitle ? (
                <p
                    className={`mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg ${
                        align === 'center' ? 'mx-auto' : ''
                    }`}
                >
                    {subtitle}
                </p>
            ) : null}
        </div>
    );
}
