import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
    baseURL,
    headers: {
        Accept: 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export function unwrap(response) {
    const d = response.data;
    if (d && typeof d.status === 'boolean') {
        if (!d.status) {
            const err = new Error(d.message || 'Request failed');
            err.errors = d.errors;
            throw err;
        }
        return d.data;
    }
    return d;
}
