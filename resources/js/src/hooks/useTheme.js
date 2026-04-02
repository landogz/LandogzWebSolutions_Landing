import { useEffect, useState } from 'react';

const KEY = 'landogz-theme';

export function useTheme() {
    const [dark, setDark] = useState(() => {
        if (typeof localStorage === 'undefined') return true;
        const s = localStorage.getItem(KEY);
        if (s === 'light') return false;
        if (s === 'dark') return true;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (dark) {
            root.classList.add('dark');
            localStorage.setItem(KEY, 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem(KEY, 'light');
        }
    }, [dark]);

    return { dark, setDark, toggle: () => setDark((d) => !d) };
}
