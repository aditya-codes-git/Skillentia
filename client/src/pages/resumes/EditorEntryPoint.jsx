import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useResumeStore } from '../../store/useResumeStore';
import { useAutoSave } from '../../hooks/useAutoSave';
import PersonalDetailsForm from '../../components/editor/forms/PersonalDetailsForm';
import ExperienceForm from '../../components/editor/forms/ExperienceForm';
import EducationForm from '../../components/editor/forms/EducationForm';
import SkillsForm from '../../components/editor/forms/SkillsForm';

export default function EditorEntryPoint() {
    const { id } = useParams();
    const resumeState = useResumeStore();
    const [isLoading, setIsLoading] = useState(true);

    // Activate the AutoSave Hook bound to this deterministic UUID.
    // We pass the subset of state that mirrors "Resume Input Schema".
    const saveStatus = useAutoSave({
        personal_details: resumeState.personal_details,
        education: resumeState.education,
        experience: resumeState.experience,
        skills: resumeState.skills,
        projects: resumeState.projects,
        certifications: resumeState.certifications
    }, id, 3000);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const { data, error } = await supabase
                    .from('resume_sections')
                    .select('content')
                    .eq('resume_id', id)
                    .eq('section_type', 'full_document')
                    .maybeSingle();

                if (error) {
                    console.error('Failed to load resume:', error);
                    return;
                }

                if (data && data.content) {
                    // Push the loaded DB state perfectly into the generic Zustand mapping
                    resumeState.setFullResume(data.content);
                }
            } catch (err) {
                console.error('Error fetching resume:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResume();
    }, [id, resumeState.setFullResume]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in pb-32 max-w-3xl mx-auto">
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">Resume Configuration</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Fill out the modules below. Changes are saved automatically.</p>
                </div>

                {/* Auto-Save Status Indicator */}
                <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {saveStatus === 'saving' && (
                        <>
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                            <span className="text-amber-700 dark:text-amber-400">Saving...</span>
                        </>
                    )}
                    {saveStatus === 'saved' && (
                        <>
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-emerald-700 dark:text-emerald-400">Saved</span>
                        </>
                    )}
                    {saveStatus === 'error' && (
                        <>
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-red-700 dark:text-red-400">Save Failed</span>
                        </>
                    )}
                    {saveStatus === 'idle' && (
                        <>
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                            <span className="text-slate-500 dark:text-slate-400">No pending changes</span>
                        </>
                    )}
                </div>
            </div>

            {/* Form Render Flow matching gemini.md schema hierarchy */}
            <PersonalDetailsForm />
            <ExperienceForm />
            <EducationForm />
            <SkillsForm />

        </div>
    );
}
