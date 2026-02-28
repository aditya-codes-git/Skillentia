import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, Cpu } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'My Resumes', href: '/resumes', icon: FileText },
    { name: 'AI Optimizer', href: '/analyze', icon: Cpu },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const signOut = useAuthStore((state) => state.signOut);

    const handleSignOut = async () => {
        try {
            await signOut();
            toast.success('Signed out successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to sign out');
        }
    };

    return (
        <div className="flex h-full w-64 flex-col bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="flex h-16 items-center px-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                    <Cpu className="h-6 w-6" />
                    <span className="text-xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                        Skillentia
                    </span>
                </div>
            </div>

            <nav className="flex-1 space-y-1 px-4 py-6">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={clsx(
                                isActive
                                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white',
                                'group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200'
                            )}
                        >
                            <item.icon
                                className={clsx(
                                    isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-300',
                                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200'
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-slate-200 dark:border-slate-800 p-4">
                <button
                    onClick={handleSignOut}
                    className="group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all duration-200"
                >
                    <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-red-500 dark:text-slate-500 dark:group-hover:text-red-400 transition-colors duration-200" aria-hidden="true" />
                    Sign out
                </button>
            </div>
        </div>
    );
}
