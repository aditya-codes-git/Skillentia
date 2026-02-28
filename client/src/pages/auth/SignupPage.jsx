import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Cpu, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const signupSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const signUp = useAuthStore((state) => state.signUp);
    const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle);
    const navigate = useNavigate();
    const location = useLocation();

    // Default to resolving the root if no state is intercepted
    const from = location.state?.from?.pathname || '/';

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(signupSchema)
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await signUp(data.email, data.password, data.firstName, data.lastName);
            toast.success('Account created! You can now log in.');
            navigate('/login', { state: { from: location.state?.from } });
        } catch (error) {
            toast.error(error.message || 'Failed to sign up');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10 w-full overflow-hidden">

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                className="glass-card max-w-lg w-full p-8 md:p-10 relative z-10"
            >

                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mx-auto w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-indigo-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <Cpu className="w-7 h-7 text-indigo-600 dark:text-indigo-400 relative z-10" />
                    </motion.div>
                    <h2 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Create Account
                    </h2>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                        Already registered? {' '}
                        <Link to="/login" state={{ from: location.state?.from }} className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-80 transition-opacity">
                            Sign in to your dashboard
                        </Link>
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="firstName">First name</label>
                            <input
                                {...register('firstName')}
                                id="firstName"
                                type="text"
                                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                            />
                            {errors.firstName && (
                                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-1 text-xs text-red-500">{errors.firstName.message}</motion.p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="lastName">Last name</label>
                            <input
                                {...register('lastName')}
                                id="lastName"
                                type="text"
                                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                            />
                            {errors.lastName && (
                                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-1 text-xs text-red-500">{errors.lastName.message}</motion.p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="email">Email address</label>
                        <input
                            {...register('email')}
                            id="email"
                            type="email"
                            className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                            placeholder="agent@skillentia.ai"
                        />
                        {errors.email && (
                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-1 text-xs text-red-500">{errors.email.message}</motion.p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" htmlFor="password">Security Protocol</label>
                        <input
                            {...register('password')}
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none tracking-widest"
                        />
                        {errors.password && (
                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-1 text-xs text-red-500">{errors.password.message}</motion.p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full relative group overflow-hidden rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md transition-all duration-300 hover:shadow-glow disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative px-4 py-3 flex items-center justify-center gap-2 font-semibold text-sm">
                            {isLoading ? 'Encrypting...' : 'Initialize Profile'}
                            {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </div>
                    </button>
                </form>

                <div className="mt-8 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-800/60"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest font-semibold">
                        <span className="px-4 bg-white dark:bg-[#0f1524] text-slate-400 rounded-full">Automated Registration</span>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        type="button"
                        onClick={async () => {
                            try {
                                await signInWithGoogle();
                            } catch (error) {
                                toast.error(error.message || 'Failed to sign up with Google');
                            }
                        }}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/30 text-sm font-medium hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>
                </div>

            </motion.div>
        </div>
    );
}
