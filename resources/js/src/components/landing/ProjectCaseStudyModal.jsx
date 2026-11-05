import { useEffect, useId, useRef } from 'react';
import ProjectCardPreview from '@/components/landing/ProjectCardPreview';

export default function ProjectCaseStudyModal({ project, onClose }) {
    const titleId = useId();
    const closeRef = useRef(null);
    const previouslyFocused = useRef(null);

    useEffect(() => {
        previouslyFocused.current = document.activeElement;
        closeRef.current?.focus();
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKey = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', onKey);
            if (previouslyFocused.current instanceof HTMLElement) {
                previouslyFocused.current.focus();
            }
        };
    }, [onClose]);

    if (!project) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 pb-safe backdrop-blur-sm sm:items-center sm:pb-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="max-h-[min(88dvh,100vh-2rem)] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-2xl border border-white/10 bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6 dark:border-white/15 dark:bg-slate-950">
                {project.thumbnail_url ? (
                    <img
                        src={project.thumbnail_url}
                        alt={project.title || 'Project'}
                        className="mb-4 max-h-56 w-full rounded-xl object-cover"
                    />
                ) : (
                    <div className="mb-4 aspect-video w-full overflow-hidden rounded-xl">
                        <ProjectCardPreview title={project.title} />
                    </div>
                )}

                <div className="flex justify-between gap-4">
                    <h3 id={titleId} className="font-display text-xl font-bold text-slate-900 dark:text-white">
                        {project.title}
                    </h3>
                    <button
                        ref={closeRef}
                        type="button"
                        className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg text-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-white/10 dark:hover:text-white"
                        onClick={onClose}
                        aria-label="Close case study"
                    >
                        ✕
                    </button>
                </div>

                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                    {project.client_name ? (
                        <div className="rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2.5 dark:border-white/10 dark:bg-slate-900/80">
                            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Client</dt>
                            <dd className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-100">{project.client_name}</dd>
                        </div>
                    ) : null}
                    {project.duration ? (
                        <div className="rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2.5 dark:border-white/10 dark:bg-slate-900/80">
                            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Duration</dt>
                            <dd className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-100">{project.duration}</dd>
                        </div>
                    ) : null}
                </dl>

                <div className="mt-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Overview</h4>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {project.full_description || project.short_description}
                    </p>
                </div>

                {(project.tech_stack || []).length > 0 ? (
                    <div className="mt-5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Tech stack</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {(project.tech_stack || []).map((t) => (
                                <span key={t} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium dark:bg-slate-800">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3">
                    {project.project_url ? (
                        <a
                            href={project.project_url}
                            className="inline-flex min-h-[44px] items-center rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white hover:bg-sky-500"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Live site
                        </a>
                    ) : null}
                    {project.github_url ? (
                        <a
                            href={project.github_url}
                            className="inline-flex min-h-[44px] items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-white/15 dark:text-slate-100 dark:hover:bg-white/5"
                            target="_blank"
                            rel="noreferrer"
                        >
                            GitHub
                        </a>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
