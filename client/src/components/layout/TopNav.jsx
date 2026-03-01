import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, Cpu, Plus, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import logoImgLight from '../../assets/skillentia_logo.png';
import logoImgDark from '../../assets/skillentia_logo_dark.png';

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
    const [isProfileOpen, setIsProfileOpen] = useState(false); // Changed from menuOpen

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

    // userInitials is no longer directly used in the new profile dropdown, but keeping it for potential future use or if other parts of the code still rely on it.
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
                    'glass-nav rounded-2xl px-6 flex items-center justify-between transition-all duration-300 relative',
                    scrolled ? 'h-16 shadow-soft' : 'h-20 border-transparent bg-transparent dark:bg-transparent backdrop-blur-none'
                )}>

                    <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute -inset-2 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                            <img src={logoImgLight} alt="Skillentia Logo" className="h-8 w-auto relative z-10 dark:hidden" />
                            <img src={logoImgDark} alt="Skillentia Logo" className="h-8 w-auto relative z-10 hidden dark:block" />
                        </div>
                    </Link>

                    {/* Center: Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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

                        {/* Profile & CTA */}
                        <div className="flex items-center gap-3">
                            {user ? (
                                <div className="relative">
                                    {/* Profile Dropdown Trigger */}
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all duration-300"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-inner group">
                                            {user.user_metadata?.first_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
                                            {user.user_metadata?.first_name || 'Agent'}
                                        </span>
                                    </button>

                                    {/* Profile Dropdown Menu */}
                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden glass-nav"
                                            >
                                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/60">
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                        {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                <div className="py-1">
                                                    <Link to="/" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <LayoutDashboard className="w-4 h-4 text-slate-400" /> Dashboard
                                                    </Link>
                                                    <Link to="/resumes/new" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <FileText className="w-4 h-4 text-slate-400" /> My Resumes
                                                    </Link>
                                                    <button onClick={() => { setIsProfileOpen(false); handleSignOut(); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                                                        <LogOut className="w-4 h-4 text-red-500" /> Sign out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/login"
                                        className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors hidden sm:block"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="relative group overflow-hidden rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md transition-all duration-300 hover:shadow-glow px-5 py-2"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-center font-semibold text-sm">
                                            Get Started
                                        </div>
                                    </Link>
                                </div>
                            )}
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
        </motion.header >
    );
}
