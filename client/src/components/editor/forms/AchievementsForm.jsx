import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResumeStore } from '../../../store/useResumeStore';
import { Trophy, Plus, Trash2, Calendar } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Match "Achievements" structure in Schema
const achievementSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    year: z.string().optional()
});

const achievementsSchema = z.object({
    achievements: z.array(achievementSchema)
});

export default function AchievementsForm() {
    const { achievements, setFullResume } = useResumeStore();

    const { register, control, watch, formState: { errors } } = useForm({
        resolver: zodResolver(achievementsSchema),
        defaultValues: {
            achievements: achievements || []
        },
        mode: 'onChange'
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'achievements'
    });

    const formValues = watch('achievements');

    useEffect(() => {
        if (!formValues) return;
        setFullResume({ achievements: formValues });
    }, [formValues, setFullResume]);

    const handleAddAchievement = () => {
        append({
            id: uuidv4(),
            title: '',
            description: '',
            year: ''
        });
    };

    const inputClasses = "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all";

    return (
        <div className="glass-card p-6 md:p-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Achievements & Awards</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Add competitions, scholarships, or awards</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleAddAchievement}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Award</span>
                </button>
            </div>

            <div className="space-y-6">
                {fields.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        <Trophy className="w-8 h-8 text-slate-400 mx-auto mb-3 opacity-50" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">No achievements added yet.</p>
                        <button
                            type="button"
                            onClick={handleAddAchievement}
                            className="mt-4 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                        >
                            + Add your first achievement
                        </button>
                    </div>
                ) : (
                    fields.map((field, index) => (
                        <div key={field.id} className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl relative group transition-all hover:border-slate-300 dark:hover:border-slate-700">

                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Remove Achievement"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 pr-10">
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Title <span className="text-red-500">*</span></label>
                                    <input
                                        {...register(`achievements.${index}.title`)}
                                        className={inputClasses}
                                        placeholder="1st Place - National Hackathon"
                                    />
                                    {errors.achievements?.[index]?.title && <p className="text-red-500 text-xs mt-1">{errors.achievements[index].title.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Year</label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Calendar className="h-4 w-4 text-slate-400 group-focus-within/input:text-primary-500 transition-colors" />
                                        </div>
                                        <input
                                            {...register(`achievements.${index}.year`)}
                                            className={`${inputClasses} pl-10`}
                                            placeholder="2024"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Description</label>
                                <textarea
                                    {...register(`achievements.${index}.description`)}
                                    rows={3}
                                    className={`${inputClasses} resize-none`}
                                    placeholder="Briefly describe the significance or criteria of the award..."
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
