import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Palette, Lock, AlertTriangle, Save, Sun, Moon, Monitor, Eye, EyeOff, LogOut, Check } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function SettingsPage() {
    const navigate = useNavigate();
    const { user, updateProfile, updatePassword, deleteAccount, signOut } = useAuthStore();
    const { theme, setTheme } = useThemeStore();

    // Profile state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);

    // Password state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Delete account state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Auth provider detection
    const isOAuthUser = user?.app_metadata?.provider === 'google' || user?.app_metadata?.providers?.includes('google');

    useEffect(() => {
        if (user) {
            const meta = user.user_metadata || {};
            setFirstName(meta.first_name || meta.full_name?.split(' ')[0] || meta.name?.split(' ')[0] || '');
            setLastName(meta.last_name || meta.full_name?.split(' ').slice(1).join(' ') || meta.name?.split(' ').slice(1).join(' ') || '');
        }
    }, [user]);

    const handleSaveProfile = async () => {
        if (!firstName.trim()) {
            toast.error('First name is required');
            return;
        }
        setIsSavingProfile(true);
        try {
            await updateProfile({
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                full_name: `${firstName.trim()} ${lastName.trim()}`.trim()
            });
            toast.success('Profile updated successfully');
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 2000);
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setIsChangingPassword(true);
        try {
            await updatePassword(newPassword);
            toast.success('Password updated successfully');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(error.message || 'Failed to update password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            toast.success('Signed out successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to sign out');
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') return;
        setIsDeleting(true);
        try {
            await deleteAccount();
            toast.success('Account deleted successfully. Goodbye!');
            navigate('/login');
        } catch (error) {
            toast.error(error.message || 'Failed to delete account. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const themeOptions = [
        { value: 'light', label: 'Light', icon: Sun, description: 'Clean & bright interface' },
        { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto space-y-8 pb-20"
        >
            {/* Page Header */}
            <motion.div variants={itemVariants}>
                <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Settings
                </h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Manage your profile, appearance, and account preferences.
                </p>
            </motion.div>

            {/* Profile Section */}
            <motion.div variants={itemVariants} className="glass-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-primary-100 dark:bg-primary-900/40 rounded-xl">
                        <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">Profile</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Your personal information</p>
                    </div>
                </div>

                <div className="space-y-5">
                    {/* Avatar Display */}
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {(firstName || user?.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {firstName} {lastName}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                            {isOAuthUser && (
                                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                    <svg className="w-3 h-3" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google Account
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all outline-none"
                                placeholder="John"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all outline-none"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            readOnly
                            className="w-full bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-500 dark:text-slate-500 cursor-not-allowed outline-none"
                        />
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">Email cannot be changed</p>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleSaveProfile}
                            disabled={isSavingProfile}
                            className="relative group overflow-hidden rounded-xl p-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-primary-500 to-indigo-500 opacity-70 group-hover:opacity-100 transition-opacity"></span>
                            <div className="relative flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-950 rounded-xl text-sm font-semibold text-slate-900 dark:text-white hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-all">
                                {profileSaved ? (
                                    <><Check className="w-4 h-4 text-emerald-500" /> Saved</>
                                ) : isSavingProfile ? (
                                    <><div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div> Saving...</>
                                ) : (
                                    <><Save className="w-4 h-4 text-primary-500" /> Save Changes</>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Appearance Section */}
            <motion.div variants={itemVariants} className="glass-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
                        <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">Appearance</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Customize your visual experience</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {themeOptions.map((option) => {
                        const isSelected = theme === option.value;
                        return (
                            <button
                                key={option.value}
                                onClick={() => setTheme(option.value)}
                                className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 text-left group ${isSelected
                                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 shadow-md shadow-primary-500/10'
                                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/30 dark:bg-slate-900/30'
                                    }`}
                            >
                                <div className={`p-3 rounded-xl transition-colors ${isSelected
                                    ? 'bg-primary-100 dark:bg-primary-900/40'
                                    : 'bg-slate-100 dark:bg-slate-800'
                                    }`}>
                                    <option.icon className={`w-5 h-5 transition-colors ${isSelected
                                        ? 'text-primary-600 dark:text-primary-400'
                                        : 'text-slate-500 dark:text-slate-400'
                                        }`} />
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-semibold transition-colors ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300'
                                        }`}>
                                        {option.label}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{option.description}</p>
                                </div>
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0"
                                    >
                                        <Check className="w-3.5 h-3.5 text-white" />
                                    </motion.div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Security Section */}
            <motion.div variants={itemVariants} className="glass-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-amber-100 dark:bg-amber-900/40 rounded-xl">
                        <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">Security</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Manage your account security</p>
                    </div>
                </div>

                {isOAuthUser ? (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50">
                        <Monitor className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Password managed by Google</p>
                            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                                Your account uses Google authentication. Password management is handled through your Google account settings.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 pr-12 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all outline-none tracking-widest"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 pr-12 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all outline-none tracking-widest"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-500">
                                Passwords do not match
                            </motion.p>
                        )}

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleChangePassword}
                                disabled={isChangingPassword || !newPassword || !confirmPassword}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isChangingPassword ? (
                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Updating...</>
                                ) : (
                                    <><Lock className="w-4 h-4" /> Update Password</>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Session / Sign Out */}
            <motion.div variants={itemVariants} className="glass-card p-6 md:p-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            <LogOut className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">Session</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Sign out of your account on this device</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div variants={itemVariants} className="glass-card p-6 md:p-8 border-red-200/50 dark:border-red-900/30">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-red-100 dark:bg-red-900/40 rounded-xl">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-display font-bold text-red-700 dark:text-red-400">Danger Zone</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Irreversible account actions</p>
                    </div>
                </div>

                {!showDeleteConfirm ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/5">
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">Delete Account</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Permanently delete your account, resumes, and all associated data.</p>
                        </div>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                        >
                            Delete Account
                        </button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-4 rounded-xl border border-red-300 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 space-y-4"
                    >
                        <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                            This action is permanent. Type <span className="font-mono font-bold">DELETE</span> to confirm.
                        </p>
                        <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900/50 border border-red-300 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all outline-none font-mono"
                            placeholder="Type DELETE to confirm"
                        />
                        <div className="flex items-center gap-3 justify-end">
                            <button
                                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
                                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? (
                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Deleting...</>
                                ) : (
                                    <><AlertTriangle className="w-4 h-4" /> Permanently Delete</>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
}
