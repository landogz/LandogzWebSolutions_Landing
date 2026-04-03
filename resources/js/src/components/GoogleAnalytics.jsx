import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api, unwrap } from '@/services/api';

const GA_MEASUREMENT_KEY = '__LANDOGZ_GA_MEASUREMENT_ID';

/**
 * Loads GA4 (gtag.js) when `google_analytics_measurement_id` is set in site settings,
 * and sends `page_view` on SPA navigations.
 */
export default function GoogleAnalytics() {
    const location = useLocation();
    const [ready, setReady] = useState(() => typeof window !== 'undefined' && !!window[GA_MEASUREMENT_KEY] && typeof window.gtag === 'function');
    const [measurementId, setMeasurementId] = useState(() =>
        typeof window !== 'undefined' ? window[GA_MEASUREMENT_KEY] || null : null,
    );

    useEffect(() => {
        const existingId = typeof window !== 'undefined' ? window[GA_MEASUREMENT_KEY] : null;
        if (existingId && typeof window.gtag === 'function') {
            setMeasurementId(existingId);
            setReady(true);
            return;
        }

        let cancelled = false;
        api.get('/public/site-settings')
            .then((r) => {
                const d = unwrap(r);
                const id = d?.google_analytics_measurement_id?.trim();
                if (cancelled || !id || !id.startsWith('G-')) {
                    return;
                }
                if (typeof window !== 'undefined') {
                    window[GA_MEASUREMENT_KEY] = id;
                }
                if (document.querySelector(`script[src*="gtag/js?id=${encodeURIComponent(id)}"]`)) {
                    setMeasurementId(id);
                    setReady(true);
                    return;
                }
                setMeasurementId(id);
                window.dataLayer = window.dataLayer || [];
                window.gtag = function gtag() {
                    window.dataLayer.push(arguments);
                };
                window.gtag('js', new Date());
                const s = document.createElement('script');
                s.async = true;
                s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
                s.onload = () => {
                    window.gtag('config', id, { send_page_view: false });
                    if (!cancelled) {
                        setReady(true);
                    }
                };
                document.head.appendChild(s);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!measurementId || !ready || typeof window.gtag !== 'function') {
            return;
        }
        const path = location.pathname + location.search;
        window.gtag('event', 'page_view', {
            page_path: path,
            page_title: document.title,
            page_location: window.location.href,
        });
    }, [location, measurementId, ready]);

    return null;
}
