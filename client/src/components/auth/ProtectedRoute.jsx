import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function ProtectedRoute() {
    const { user, loading } = useAuthStore();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-primary-200 dark:bg-primary-900 rounded-full mb-4"></div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Authenticating...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
