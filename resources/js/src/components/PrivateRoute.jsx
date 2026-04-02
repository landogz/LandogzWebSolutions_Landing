import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function PrivateRoute({ children }) {
    const token = useAuthStore((s) => s.token);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
}
