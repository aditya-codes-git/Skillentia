import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, Cpu, Plus, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'My Resumes', href: '/resumes', icon: FileText },
    { name: 'AI Optimizer', href: '/analyze', icon: Cpu },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function TopNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut();
            toast.success('Signed out successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to sign out');
        }
    };

    const userInitials = user?.user_metadata?.first_name
        ? `${user.user_metadata.first_name[0]}${user.user_metadata.last_name ? user.user_metadata.last_name[0] : ''}`
        : user?.email?.[0]?.toUpperCase() || 'U';

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={clsx(
                'fixed top-0 inset-x-0 z-50 transition-all duration-300',
                scrolled ? 'py-2' : 'py-4'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={clsx(
                    'glass-nav rounded-2xl px-6 flex items-center justify-between transition-all duration-300',
                    scrolled ? 'h-16 shadow-soft' : 'h-20 border-transparent bg-transparent dark:bg-transparent backdrop-blur-none'
                )}>

                    {/* Left: Logo */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
                            <div className="relative p-2 bg-white dark:bg-slate-900 rounded-xl">
                                <Cpu className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                            </div>
                        </div>
                        <span className="text-xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                            Skillentia
                        </span>
                    </div>

                    {/* Center: Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className="relative px-4 py-2 text-sm font-medium transition-colors group"
                                >
                                    <span className={clsx(
                                        'relative z-10 flex items-center gap-2 transition-colors',
                                        isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                                    )}>
                                        {/* Optional Icon for Nav <item.icon className="w-4 h-4" /> */}
                                        {item.name}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute inset-0 bg-slate-100 dark:bg-slate-800/50 rounded-xl -z-0"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right: Actions & Profile */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            to="/resumes/new"
                            className="relative group overflow-hidden rounded-xl p-[1px]"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-primary-500 to-indigo-500 opacity-70 group-hover:opacity-100 transition-opacity animate-gradient-x"></span>
                            <div className="relative flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-950 rounded-xl text-sm font-medium text-slate-900 dark:text-white hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-all">
                                <Plus className="w-4 h-4 text-primary-500" />
                                <span>Create</span>
                            </div>
                        </Link>

                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <div className="relative flex items-center gap-3">
                            <div className="flex flex-col items-end hidden lg:flex">
                                <span className="text-sm font-medium text-slate-900 dark:text-white leading-none mb-1">
                                    {user?.user_metadata?.first_name || 'User'}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 leading-none">
                                    Pro Plan
                                </span>
                            </div>

                            <div className="relative group cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
                                <div className="relative h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-shrink-0 items-center justify-center overflow-hidden">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                        {userInitials}
                                    </span>
                                </div>

                                {/* Dropdown */}
                                <AnimatePresence>
                                    {menuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-3 w-48 glass-card border border-slate-200 dark:border-slate-800 p-2 transform origin-top-right z-50 shadow-xl"
                                        >
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>
        </motion.header>
    );
}
