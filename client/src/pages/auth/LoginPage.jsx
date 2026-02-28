import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Cpu } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const signIn = useAuthStore((state) => state.signIn);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await signIn(data.email, data.password);
            toast.success('Welcome back!');
            navigate('/');
        } catch (error) {
            toast.error(error.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="card max-w-md w-full p-8 animate-fade-in">

                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
                        <Cpu className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                        Sign in to Skillentia
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Or {' '}
                        <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                            start your free AI optimization
                        </Link>
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="label" htmlFor="email">Email address</label>
                        <input
                            {...register('email')}
                            id="email"
                            type="email"
                            className="input-field"
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="label" htmlFor="password">Password</label>
                        <input
                            {...register('password')}
                            id="password"
                            type="password"
                            className="input-field"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
}
