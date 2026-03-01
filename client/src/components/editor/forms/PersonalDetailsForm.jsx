import { useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResumeStore } from '../../../store/useResumeStore';
import { User } from 'lucide-react';

const personalDetailsSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    portfolio_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    summary: z.string().optional()
});

export default function PersonalDetailsForm() {
    const { personal_details, updatePersonalDetails } = useResumeStore();

    const { register, watch, formState: { errors } } = useForm({
        resolver: zodResolver(personalDetailsSchema),
        defaultValues: personal_details,
        mode: 'onChange'
    });

    // Create a debounced update function that only fires 500ms after the user stops typing
    // This stops the heavy `BasicPreview` from continuously re-rendering and lagging the input field
    const debouncedUpdate = useMemo(
        () => debounce((value) => updatePersonalDetails(value), 500),
        [updatePersonalDetails]
    );

    useEffect(() => {
        const subscription = watch((value) => {
            debouncedUpdate(value);
        });
        return () => subscription.unsubscribe();
    }, [watch, debouncedUpdate]);

    return (
        <div className="card p-6 mb-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                    <User className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Personal Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="label">First Name</label>
                    <input {...register('first_name')} className="input-field" placeholder="Jane" />
                    {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
                </div>
                <div>
                    <label className="label">Last Name</label>
                    <input {...register('last_name')} className="input-field" placeholder="Doe" />
                    {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
                </div>
                <div>
                    <label className="label">Email Address</label>
                    <input {...register('email')} className="input-field" placeholder="jane@example.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <label className="label">Phone Number</label>
                    <input {...register('phone')} className="input-field" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="md:col-span-2">
                    <label className="label">Location (City, State / Country)</label>
                    <input {...register('location')} className="input-field" placeholder="San Francisco, CA" />
                </div>
                <div>
                    <label className="label">LinkedIn URL</label>
                    <input {...register('linkedin_url')} className="input-field" placeholder="https://linkedin.com/in/janedoe" />
                    {errors.linkedin_url && <p className="text-red-500 text-xs mt-1">{errors.linkedin_url.message}</p>}
                </div>
                <div>
                    <label className="label">Portfolio / GitHub URL</label>
                    <input {...register('portfolio_url')} className="input-field" placeholder="https://github.com/janedoe" />
                    {errors.portfolio_url && <p className="text-red-500 text-xs mt-1">{errors.portfolio_url.message}</p>}
                </div>
            </div>

            <div>
                <label className="label">Professional Summary</label>
                <textarea
                    {...register('summary')}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Briefly describe your professional background, key strengths, and what you are looking for..."
                />
            </div>
        </div>
    );
}
