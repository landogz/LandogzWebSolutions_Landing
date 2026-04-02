import toast from 'react-hot-toast';

/**
 * Show Laravel validation / API error in a toast.
 */
export function toastApiError(err, fallback = 'Request failed') {
    const res = err.response?.data;
    const validation = res?.errors;
    const detail = validation
        ? Object.values(validation)
              .flat()
              .filter(Boolean)
              .join(' ')
        : res?.message;
    toast.error(detail || err.message || fallback);
}
