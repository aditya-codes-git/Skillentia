import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResumeStore } from '../../../store/useResumeStore';
import { Component, Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const customItemSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Item title is required'),
    subtitle: z.string().optional(),
    date_range: z.string().optional(),
    description: z.string().optional()
});

const customSectionSchema = z.object({
    section_title: z.string().min(1, 'Section title is required'),
    items: z.array(customItemSchema)
});

const schema = z.object({
    custom_section: customSectionSchema.optional()
});

export default function CustomSectionForm() {
    const custom_section = useResumeStore(state => state.custom_section);

    const { register, control, watch, getValues, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            custom_section: custom_section || {
                section_title: 'Custom Section',
                items: []
            }
        },
        mode: 'onChange'
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'custom_section.items'
    });

    useEffect(() => {
        const subscription = watch((value) => {
            if (value && value.custom_section) {
                useResumeStore.setState({ custom_section: JSON.parse(JSON.stringify(value.custom_section)) });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const handleAddNew = () => {
        append({
            id: uuidv4(),
            title: '',
            subtitle: '',
            date_range: '',
            description: ''
        });
    };

    const inputClasses = "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all";

    return (
        <div className="card p-6 mb-6">
            <div className="flex items-center justify-between gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                        <Component className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <input
                            {...register('custom_section.section_title')}
                            className="bg-transparent border-none text-lg font-semibold text-slate-900 dark:text-white focus:ring-0 p-0 placeholder-slate-300"
                            placeholder="Custom Section Title"
                        />
                        {errors?.custom_section?.section_title && <p className="text-red-500 text-xs mt-1">{errors.custom_section.section_title.message}</p>}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleAddNew}
                    className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 shrink-0"
                >
                    <Plus className="w-4 h-4" /> Add Item
                </button>
            </div>

            <div className="space-y-6">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl relative group border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-10">
                            <div>
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Title <span className="text-red-500">*</span></label>
                                <input {...register(`custom_section.items.${index}.title`)} className={inputClasses} placeholder="Item Title (e.g. Activity Name)" />
                                {errors?.custom_section?.items?.[index]?.title && <p className="text-red-500 text-xs mt-1">{errors.custom_section.items[index].title.message}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Subtitle / Role</label>
                                <input {...register(`custom_section.items.${index}.subtitle`)} className={inputClasses} placeholder="Optional Subtitle" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Date Range / Info</label>
                                <input {...register(`custom_section.items.${index}.date_range`)} className={inputClasses} placeholder="e.g. 2020 - 2022" />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Description</label>
                            <textarea
                                {...register(`custom_section.items.${index}.description`)}
                                rows={3}
                                className={`${inputClasses} resize-none`}
                                placeholder="Describe the details of this item..."
                            />
                        </div>
                    </div>
                ))}

                {fields.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">
                        No items added to this section yet. Click "Add Item" to begin building your custom section.
                    </div>
                )}
            </div>
        </div>
    );
}
