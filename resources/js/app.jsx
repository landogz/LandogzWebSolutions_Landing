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
            <Toaster position="top-right" />
        </BrowserRouter>
    </HelmetProvider>,
);
