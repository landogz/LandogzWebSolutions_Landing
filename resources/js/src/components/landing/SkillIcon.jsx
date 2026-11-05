const iconClass = 'h-4 w-4 shrink-0';

const FALLBACKS = {
    laravel: (props) => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M22.2 7.1 14.4 2.6a1.5 1.5 0 0 0-1.5 0L5 7.1a1.5 1.5 0 0 0-.7 1.3v9.1c0 .5.3 1 .7 1.3l7.9 4.5c.5.3 1 .3 1.5 0l7.8-4.5c.5-.3.7-.8.7-1.3V8.4c0-.5-.3-1-.7-1.3ZM12.4 19.3l-6.6-3.8V9.2l6.6 3.8v6.3Zm.7-7.3L6.5 8.2l5.9-3.4 5.9 3.4-5.2 3.8Zm7.3 3.5-6.6 3.8v-6.3l6.6-3.8v6.3Z" />
        </svg>
    ),
    php: (props) => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M12 5C6.5 5 2 7.7 2 11s4.5 6 10 6 10-2.7 10-6-4.5-6-10-6Zm-3.3 8.5H7.5l.5-2.5H6.7l-.3 1.4H5.1l1-4.8h4.1l-.3 1.4H8.6l-.3 1.4h1.3l-.9 4.5Zm5.6-3.1c-.3 1.4-.8 2.6-2.2 2.6-1.1 0-1.4-.8-1.2-2.1.3-1.4.8-2.6 2.2-2.6 1.1 0 1.4.8 1.2 2.1Zm-1.6.1c.1-.4 0-.7-.4-.7s-.7.4-.8.8c-.1.4 0 .7.4.7s.7-.4.8-.8Zm6.4 3H17.9l.5-2.5h-1.3l-.3 1.4h-1.3l1-4.8h4.1l-.3 1.4h-1.3l-.3 1.4h1.3l-.9 4.5Z" />
        </svg>
    ),
    react: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden {...props}>
            <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
            <ellipse cx="12" cy="12" rx="10" ry="4" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        </svg>
    ),
    javascript: (props) => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M3 3h18v18H3V3Zm9.4 14.2c0 1.9-1.1 2.8-2.8 2.8-1.4 0-2.3-.7-2.8-1.6l1.5-.9c.3.5.6.9 1.2.9.6 0 1-.2 1-.1.2V11h1.9v6.2Zm4.7 2.8c-1.7 0-2.8-.8-3.3-1.9l1.5-.9c.3.6.8 1 1.6 1 .7 0 1.1-.3 1.1-.9 0-.6-.4-.9-1.5-1.3l-.5-.2c-1.5-.6-2.5-1.4-2.5-3.1 0-1.5 1.2-2.7 3-2.7 1.3 0 2.2.4 2.9 1.6l-1.5.9c-.3-.5-.7-.8-1.4-.8-.6 0-1 .4-1 .8 0 .6.4.8 1.4 1.2l.5.2c1.8.8 2.7 1.6 2.7 3.3 0 1.8-1.4 2.8-3.3 2.8Z" />
        </svg>
    ),
    html: (props) => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M4.1 2.1h15.8l-1.4 16.1L12 21.9l-6.5-3.7L4.1 2.1Zm12.5 4.7H7.6l.2 2.3h6.7l-.2 2.1H8l.3 3.2 3.7 1 3.7-1 .3-2.9h-2.2l-.1 1.1-1.7.5-1.7-.5-.1-1.6h5.8l-.5 5.3L12 18.4l-3.4-1-0.4-4.1H7l.5 5.3L12 20.4l4.5-1.3.6-6.9.2-2.4.2-2.3Z" />
        </svg>
    ),
    css: (props) => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M4.1 2.1h15.8l-1.4 16.1L12 21.9l-6.5-3.7L4.1 2.1Zm12.4 4.8H7.7l.2 2.2h6.6l-.3 2.5H9.9l.2 1.8h4.1l-.3 2.6L12 17l-2.2-.6-.1-1.5H7.5l.2 2.9L12 19.1l4.3-1.2.8-8.5.2-2.5Z" />
        </svg>
    ),
    wordpress: (props) => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-1.1 16.8c-3.2-.5-5.6-3.2-5.6-6.5 0-.5.1-1 .2-1.5l3.1 8Zm1.1.5c-.3 0-.6 0-.9-.1l3.3-9.1c.6.1 1.2.2 1.4.2.6 0 .7-.1.7-.1l-1.1 10.7c-.4.2-.9.4-1.4.4Zm7.1-9.6c0 .5-.2 1.1-.5 1.9l-2 5.8-2.8-8.4c.5-.1.9-.1 1.2-.1.8 0 2.1.2 2.1.8 0 .1 0 .2 0 .3l1.9-.3Zm-13.8.3C6.6 7.5 9.1 5.7 12 5.7c1.3 0 2.5.4 3.5 1.1-.1 0-.3-.1-.5-.1-1.2 0-2 .9-2 1.8 0 .8.4 1.5.9 2.3.3.6.7 1.3.7 2.3 0 .7-.3 1.5-1.1 1.5-.1 0-.1 0-.2 0l-3.8-10.4c.3-.1.7-.1 1-.1-2.6 0-4.8 1.6-5.7 3.9Z" />
        </svg>
    ),
    shopify: (props) => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M15.3 4.3c0-.1-.1-.1-.1-.2-.1 0-.2-.1-.3-.1h-.1c-.2-.4-.5-.8-.9-1.1-.7-.5-1.5-.6-2.1-.5l-.3-1c0-.1-.1-.2-.2-.2l-1.3.3c-.1 0-.2.1-.2.2l-.2.8c-.5.2-1 .4-1.2.9-.1 0-.3.1-.5.2-.6.2-1.4.4-1.5 1.4 0 .1-1.7 13.1-1.7 13.1l10.1 1.9 2.8-1.1S15.3 4.4 15.3 4.3Zm-3.4-.8c.3 0 .6.1.8.2l-.6 2.3c-.5-.1-1.1-.2-1.6-.1l.4-1.7c.3-.4.6-.7 1-.7Zm-1.5.2.4 1.7c-1.1.3-1.7.9-1.7.9l-.4-1.5c.3-.5.9-.9 1.7-1.1Zm.4 4.1s.7-.4 1.7-.2c0 0-.5-2.4-.5-2.5-.5-.1-1 0-1.4.1l.2 2.6Zm7.5 8.6-9.1 1.9.8-12.1c.3-.1.8-.3 1.5-.4l.4 2.8c.1.3.3.3.5.2.1-.1.5-.4 1.4-.4.7 0 1.2.2 1.5.5.1-1.1.4-2.7.4-2.7.4.1.7.2.9.3l1.7 10Z" />
        </svg>
    ),
    api: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
            <path d="M8 9H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h3" />
            <path d="M16 9h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-3" />
            <path d="M8 12h8" />
            <circle cx="8" cy="12" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="16" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </svg>
    ),
    codeigniter: (props) => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M12 2.2c-1.6 2.5-3.8 4.3-5.7 6.5C3.7 11.6 2.5 14.4 3.2 17c.8 3 3.6 4.8 6.7 4.8 1.4 0 2.7-.4 3.9-1.1-.9.2-1.8.2-2.7 0 2.8-.4 5.1-2.5 5.6-5.3.4-2.2-.4-4.3-1.8-5.9.7 1.8.6 3.9-.5 5.5 1.9-2.4 2.2-5.6.7-8.3C14.1 4.6 13.1 3.3 12 2.2Z" />
        </svg>
    ),
    csharp: (props) => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M11.5 2.1 3.4 6.7v10.6l8.1 4.6 8.1-4.6V6.7l-8.1-4.6Zm0 2.2 6.1 3.5v1.3l-2.3 1.3-2-.8v1.6l2 .8-1.8 1v1.6l1.8 1-2 1.2v1.6l2-1.1 2.3 1.3v1.3l-6.1 3.5-6.1-3.5V7.8l6.1-3.5Zm1.6 7.4h1.3v1.1h-1.3v1.3h-1.1v-1.3H10.9v-1.1h1.1V9.6h1.1v1.1Zm3.3 0h1.3v1.1h-1.3v1.3h-1.1v-1.3h-1.1v-1.1h1.1V9.6h1.1v1.1Z" />
        </svg>
    ),
    mysql: (props) => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M16.6 4.2c-.6 0-1.1.1-1.5.3-.1 0-.1.1-.1.2v.1c.1.1.2.2.3.2.4.1.7.2 1.1.2 1.1 0 2-.5 2.5-1.4 0-.1 0-.1-.1-.1-.9-.2-1.6-.3-2.2-.3Zm-5.4 1.5c-1.6 0-3 .7-3.8 1.9-.1.1 0 .2.1.2h.1c1.1-.5 2.2-.8 3.4-.8 1 0 1.9.2 2.8.6.1 0 .2 0 .2-.1.5-.7 1.2-1.2 2-1.5.1 0 .1-.1.1-.2-.1 0-.2-.1-.3-.1-1.4-.1-2.9 0-4.6 0Zm-6.9 3c-.2 0-.3.2-.3.4v.1c1.1 1.5 2.6 2.4 4.4 2.8.1 0 .2 0 .2-.1.3-.7.8-1.3 1.4-1.7.1-.1.1-.2 0-.3-.1 0-.1-.1-.2-.1-1.8-.3-3.6-.8-5.5-1.1Zm14.9.2c-.2 0-.3.1-.4.3-.8 1.5-2 2.6-3.6 3.3-.1 0-.1.1-.1.2 0 .1.1.2.2.2 1.9.5 3.4 1.4 4.5 2.9.1.1.2.1.3 0 .1-.1.1-.2 0-.3-1.1-1.8-2.7-3-4.6-3.5 1.3-.7 2.3-1.7 3-3 .1-.1.1-.2 0-.3-.1-.1-.2-.1-.3-.1v.3Zm-8.9 2.6c-.1 0-.2.1-.2.2 0 1.5.5 2.9 1.4 4.1.1.1.2.1.3 0 .1-.1.1-.2 0-.3-.8-1.1-1.2-2.3-1.2-3.7 0-.1-.1-.3-.3-.3Zm3.1 0c-.2 0-.3.1-.3.3 0 1.4-.4 2.6-1.2 3.7-.1.1 0 .2.1.3.1.1.2 0 .3-.1.9-1.2 1.4-2.6 1.4-4.1 0-.1-.1-.2-.3-.2Z" />
        </svg>
    ),
    figma: (props) => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M8.5 2.5A3.5 3.5 0 0 0 5 6v.5A3.5 3.5 0 0 0 8.5 10H12V2.5H8.5Zm3.5 7.5H8.5A3.5 3.5 0 1 0 12 14.5V10Zm0 4.5H8.5A3.5 3.5 0 1 0 12 21.5V14.5Zm.5-4.5H16a3.5 3.5 0 1 0 0-7H12.5V10Zm3.5 0a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
        </svg>
    ),
    default: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
            <path d="M8 4H6a2 2 0 0 0-2 2v3.5a2 2 0 0 1-1 1.7 2 2 0 0 1 1 1.7V17a2 2 0 0 0 2 2h2" />
            <path d="M16 4h2a2 2 0 0 1 2 2v3.5a2 2 0 0 0 1 1.7 2 2 0 0 0-1 1.7V17a2 2 0 0 1-2 2h-2" />
        </svg>
    ),
};

function resolveKey(name = '') {
    const n = String(name).toLowerCase();
    if (n.includes('laravel')) return 'laravel';
    if (n.includes('php')) return 'php';
    if (n.includes('react')) return 'react';
    if (n.includes('javascript') || n === 'js') return 'javascript';
    if (n.includes('html') || n.includes('css')) return 'html';
    if (n.includes('wordpress')) return 'wordpress';
    if (n.includes('shopify') || n.includes('liquid')) return 'shopify';
    if (n.includes('api')) return 'api';
    if (n.includes('codeigniter')) return 'codeigniter';
    if (n.includes('c#') || n.includes('vb.net') || n.includes('dotnet') || n.includes('.net')) return 'csharp';
    if (n.includes('mysql') || n.includes('sql')) return 'mysql';
    if (n.includes('figma') || n.includes('adobe') || n.includes('xd')) return 'figma';
    return 'default';
}

/**
 * Renders an uploaded skill icon when present, otherwise a tech SVG fallback.
 */
export default function SkillIcon({ name, iconUrl, className = iconClass }) {
    if (iconUrl) {
        return (
            <img
                src={iconUrl}
                alt=""
                className={`${className} rounded-sm object-contain`}
                loading="lazy"
                decoding="async"
            />
        );
    }

    const Icon = FALLBACKS[resolveKey(name)] || FALLBACKS.default;
    return <Icon className={`${className} text-sky-600 dark:text-sky-400`} />;
}
