import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResumeStore } from '../../../store/useResumeStore';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const educationSchema = z.object({
    id: z.string(),
    institution: z.string().min(1, 'Institution is required'),
    degree: z.string().min(1, 'Degree is required'),
    field_of_study: z.string().optional(),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().optional(),
    current: z.boolean(),
    gpa: z.string().optional(),
    description: z.string().optional()
});

const schema = z.object({
    educations: z.array(educationSchema)
});

export default function EducationForm() {
    const { education, setFullResume } = useResumeStore();

    const { register, control, watch, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { educations: education },
        mode: 'onChange'
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'educations'
    });

    useEffect(() => {
        const subscription = watch((value) => {
            setFullResume({ education: value.educations || [] });
        });
        return () => subscription.unsubscribe();
    }, [watch, setFullResume]);

    const handleAddNew = () => {
        const newEntry = {
            id: uuidv4(),
            institution: '',
            degree: '',
            field_of_study: '',
            start_date: '',
            end_date: '',
            current: false,
            gpa: '',
            description: ''
        };
        append(newEntry);
    };

    const handleRemove = (index) => {
        remove(index);
    };

    return (
        <div className="card p-6 mb-6">
            <div className="flex items-center justify-between gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Education</h2>
                </div>
                <button
                    type="button"
                    onClick={handleAddNew}
                    className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
                >
                    <Plus className="w-4 h-4" /> Add New
                </button>
            </div>

            <div className="space-y-6">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl relative group">
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <input type="hidden" {...register(`educations.${index}.id`)} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-10">
                            <div className="md:col-span-2">
                                <label className="label">Institution / University</label>
                                <input {...register(`educations.${index}.institution`)} className="input-field" placeholder="University of Technology" />
                                {errors?.educations?.[index]?.institution && <p className="text-red-500 text-xs mt-1">{errors.educations[index].institution.message}</p>}
                            </div>
                            <div>
                                <label className="label">Degree / Certificate</label>
                                <input {...register(`educations.${index}.degree`)} className="input-field" placeholder="Bachelor of Science" />
                                {errors?.educations?.[index]?.degree && <p className="text-red-500 text-xs mt-1">{errors.educations[index].degree.message}</p>}
                            </div>
                            <div>
                                <label className="label">Field of Study</label>
                                <input {...register(`educations.${index}.field_of_study`)} className="input-field" placeholder="Computer Science" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Start Date</label>
                                    <input {...register(`educations.${index}.start_date`)} type="month" className="input-field text-sm" />
                                </div>
                                <div>
                                    <label className="label">End Date</label>
                                    <input
                                        {...register(`educations.${index}.end_date`)}
                                        type="month"
                                        className="input-field text-sm disabled:opacity-50"
                                        disabled={watch(`educations.${index}.current`)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">GPA / Grade (Optional)</label>
                                <input {...register(`educations.${index}.gpa`)} className="input-field" placeholder="3.8 / 4.0" />
                            </div>
                        </div>

                        <div className="mb-4 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`edu-current-${field.id}`}
                                {...register(`educations.${index}.current`)}
                                className="rounded text-emerald-600 focus:ring-emerald-500 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                            />
                            <label htmlFor={`edu-current-${field.id}`} className="text-sm font-medium text-slate-700 dark:text-slate-300">I currently study here</label>
                        </div>

                        <div>
                            <label className="label">Description / Related Coursework</label>
                            <textarea
                                {...register(`educations.${index}.description`)}
                                rows={2}
                                className="input-field resize-none"
                                placeholder="List key courses, honors, or activities..."
                            />
                        </div>
                    </div>
                ))}

                {fields.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">
                        No education added yet. Click "Add New" to begin.
                    </div>
                )}
            </div>
        </div>
    );
}
