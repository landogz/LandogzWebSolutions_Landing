import '@vitejs/plugin-react-swc/preamble';
import '../css/app.css';
import './bootstrap';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './src/App';
import GoogleAnalytics from './src/components/GoogleAnalytics';

const root = createRoot(document.getElementById('app'));

root.render(
    <HelmetProvider>
        <BrowserRouter>
            <GoogleAnalytics />
            <App />
            <Toaster
                position="top-right"
                toastOptions={{
                    className: 'text-sm',
                    style: {
                        background: '#0f172a',
                        color: '#e2e8f0',
                        border: '1px solid rgba(255,255,255,0.1)',
                    },
                    success: {
                        iconTheme: { primary: '#38bdf8', secondary: '#0f172a' },
                    },
                    error: {
                        iconTheme: { primary: '#fb7185', secondary: '#0f172a' },
                    },
                }}
            />
        </BrowserRouter>
    </HelmetProvider>,
);
