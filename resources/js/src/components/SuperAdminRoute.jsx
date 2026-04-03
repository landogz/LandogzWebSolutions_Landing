import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function SuperAdminRoute({ children }) {
    const user = useAuthStore((s) => s.user);
    const token = useAuthStore((s) => s.token);

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    if (!user) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500/30 border-t-sky-400" />
            </div>
        );
    }

    if (user.role !== 'super_admin') {
        return <Navigate to="/admin" replace />;
    }

    return children;
}
