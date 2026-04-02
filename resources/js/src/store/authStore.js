import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    token: typeof localStorage !== 'undefined' ? localStorage.getItem('admin_token') : null,
    setAuth: (token, user) => {
        if (token) {
            localStorage.setItem('admin_token', token);
        } else {
            localStorage.removeItem('admin_token');
        }
        set({ token, user });
    },
    logout: () => {
        localStorage.removeItem('admin_token');
        set({ token: null, user: null });
    },
}));
