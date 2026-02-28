import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Cpu } from 'lucide-react';

const signupSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const signUp = useAuthStore((state) => state.signUp);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(signupSchema)
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await signUp(data.email, data.password, data.firstName, data.lastName);
            toast.success('Account created! You can now log in.');
            navigate('/login');
        } catch (error) {
            toast.error(error.message || 'Failed to sign up');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="card max-w-md w-full p-8 animate-slide-up">

                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
                        <Cpu className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                        Create an account
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Already have an account? {' '}
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label" htmlFor="firstName">First name</label>
                            <input
                                {...register('firstName')}
                                id="firstName"
                                type="text"
                                className="input-field"
                            />
                            {errors.firstName && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="label" htmlFor="lastName">Last name</label>
                            <input
                                {...register('lastName')}
                                id="lastName"
                                type="text"
                                className="input-field"
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

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
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
