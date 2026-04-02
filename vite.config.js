import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js/src'),
        },
    },
    server: {
        proxy: {
            '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true },
            '/storage': { target: 'http://127.0.0.1:8000', changeOrigin: true },
        },
    },
});
