import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.js',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
                display: ['Syne', 'Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                landogz: {
                    navy: '#0a1628',
                    blue: '#2563eb',
                    accent: '#38bdf8',
                },
            },
        },
    },

    plugins: [forms],
};
