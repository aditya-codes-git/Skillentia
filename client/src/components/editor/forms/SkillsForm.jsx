import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResumeStore } from '../../../store/useResumeStore';
import { Wrench } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';

// Skills schema expects arrays of strings. 
// We will collect them as comma-separated strings in the UI and split them before hitting the store.
const skillsSchema = z.object({
    technical_skills: z.string(),
    tools: z.string(),
    frameworks: z.string(),
    languages: z.string(),
    soft_skills: z.string(),
});

export default function SkillsForm() {
    const { skills, updateSkills } = useResumeStore();

    const { register, watch, formState: { errors } } = useForm({
        resolver: zodResolver(skillsSchema),
        // Join the arrays from the store to load them into the string inputs
        defaultValues: {
            technical_skills: skills.technical_skills.join(', '),
            tools: skills.tools.join(', '),
            frameworks: skills.frameworks.join(', '),
            languages: skills.languages.join(', '),
            soft_skills: skills.soft_skills.join(', '),
        },
        mode: 'onChange'
    });

    // Create a debounced update function that only fires 500ms after edits
    const debouncedUpdate = useMemo(
        () => debounce((value) => {
            if (!value) return;

            let hasChanges = false;
            const nextSkills = {};

            Object.entries(value).forEach(([category, stringValue]) => {
                if (typeof stringValue !== 'string') return;
                const arr = stringValue.split(',').map(s => s.trim()).filter(Boolean);
                nextSkills[category] = arr;

                // Check if the new array is actually different from the current store array
                const currentArr = skills[category] || [];
                if (arr.length !== currentArr.length || !arr.every((val, index) => val === currentArr[index])) {
                    hasChanges = true;
                }
            });

            // Only update the store if there are actual string changes, preventing infinite loops
            if (hasChanges) {
                Object.entries(nextSkills).forEach(([category, arr]) => {
                    updateSkills(category, arr);
                });
            }
        }, 500),
        [skills, updateSkills]
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
                <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                    <Wrench className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Skills Matrix</h2>
            </div>

            <div className="space-y-4">
                <p className="text-xs text-slate-500 mb-4 tracking-wide uppercase">Separate skills with commas (e.g. JavaScript, Python, C++)</p>

                <div>
                    <label className="label">Technical Skills (Core Competencies)</label>
                    <input {...register('technical_skills')} className="input-field" placeholder="Algorithms, System Design, Data Structures..." />
                </div>
                <div>
                    <label className="label">Programming Languages</label>
                    <input {...register('languages')} className="input-field" placeholder="JavaScript, Python, Rust..." />
                </div>
                <div>
                    <label className="label">Frameworks & Libraries</label>
                    <input {...register('frameworks')} className="input-field" placeholder="React, Node.js, Spring Boot..." />
                </div>
                <div>
                    <label className="label">Tools & Infrastructure</label>
                    <input {...register('tools')} className="input-field" placeholder="Docker, AWS, Git, Figma..." />
                </div>
                <div>
                    <label className="label">Soft Skills</label>
                    <input {...register('soft_skills')} className="input-field" placeholder="Leadership, Mentoring, Agile..." />
                </div>
            </div>
        </div>
    );
}
