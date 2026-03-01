import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResumeStore } from '../../../store/useResumeStore';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import debounce from 'lodash.debounce';

const experienceSchema = z.object({
    id: z.string(),
    company: z.string().min(1, 'Company name is required'),
    position: z.string().min(1, 'Position is required'),
    location: z.string().optional(),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().optional(),
    current: z.boolean(),
    description: z.string().optional(),
    bullets: z.array(z.string()).optional() // Storing strictly as array per schema
});

// Since the store holds an array of experiences, we wrap the schema
const schema = z.object({
    experiences: z.array(experienceSchema)
});

export default function ExperienceForm() {
    const { experience } = useResumeStore();

    const { register, control, watch, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { experiences: experience },
        mode: 'onChange'
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'experiences'
    });

    // Debounce the array updates to prevent UI stutter while typing
    const debouncedUpdate = useMemo(
        () => debounce((value) => {
            if (value && value.experiences) {
                // Sync the entire experience array to the store
                const currentStore = useResumeStore.getState().experience;
                if (JSON.stringify(currentStore) !== JSON.stringify(value.experiences)) {
                    useResumeStore.setState({ experience: value.experiences });
                }
            }
        }, 500),
        []
    );

    useEffect(() => {
        const subscription = watch((value) => {
            debouncedUpdate(value);
        });
        return () => subscription.unsubscribe();
    }, [watch, debouncedUpdate]);

    const handleAddNew = () => {
        const newEntry = {
            id: uuidv4(),
            company: '',
            position: '',
            location: '',
            start_date: '',
            end_date: '',
            current: false,
            description: '',
            bullets: []
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
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Work Experience</h2>
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

                        <input type="hidden" {...register(`experiences.${index}.id`)} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-10">
                            <div>
                                <label className="label">Position / Job Title</label>
                                <input {...register(`experiences.${index}.position`)} className="input-field" placeholder="Software Engineer" />
                                {errors?.experiences?.[index]?.position && <p className="text-red-500 text-xs mt-1">{errors.experiences[index].position.message}</p>}
                            </div>
                            <div>
                                <label className="label">Company Name</label>
                                <input {...register(`experiences.${index}.company`)} className="input-field" placeholder="Acme Corp" />
                                {errors?.experiences?.[index]?.company && <p className="text-red-500 text-xs mt-1">{errors.experiences[index].company.message}</p>}
                            </div>
                            <div>
                                <label className="label">Location</label>
                                <input {...register(`experiences.${index}.location`)} className="input-field" placeholder="Remote" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Start Date</label>
                                    <input {...register(`experiences.${index}.start_date`)} type="month" className="input-field text-sm" />
                                </div>
                                <div>
                                    <label className="label">End Date</label>
                                    <input
                                        {...register(`experiences.${index}.end_date`)}
                                        type="month"
                                        className="input-field text-sm disabled:opacity-50"
                                        disabled={watch(`experiences.${index}.current`)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`current - ${field.id} `}
                                {...register(`experiences.${index}.current`)}
                                className="rounded text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                            />
                            <label htmlFor={`current - ${field.id} `} className="text-sm font-medium text-slate-700 dark:text-slate-300">I currently work here</label>
                        </div>

                        <div>
                            <label className="label">Description & Achievements</label>
                            <textarea
                                {...register(`experiences.${index}.description`)}
                                rows={4}
                                className="input-field resize-none"
                                placeholder="Describe your responsibilities and achievements. Use bullet points for ATS optimization (- Built architecture...)"
                            />
                            <p className="text-xs text-slate-500 mt-1">Hint: Use hyphen (-) at the start of a line to create bullets. This ensures ATS parsers map your skills correctly.</p>
                        </div>
                    </div>
                ))}

                {fields.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">
                        No experience added yet. Click "Add New" to begin.
                    </div>
                )}
            </div>
        </div>
    );
}
