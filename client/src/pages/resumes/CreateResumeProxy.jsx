import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export default function CreateResumeProxy() {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const createNewDraft = async () => {
            if (!user) return;

            try {
                // 1. Create top-level Resume object deterministically
                const { data: resumeData, error: resumeError } = await supabase
                    .from('resumes')
                    .insert({
                        user_id: user.id,
                        title: 'Untitled Document',
                        template_name: 'modern',
                        theme_config: { primary_color: '#000000', font_family: 'inter', font_scale: 'medium', spacing_scale: 'comfortable' }
                    })
                    .select('id')
                    .single();

                if (resumeError) throw resumeError;

                // 2. We don't need to create sections yet because `useAutoSave` will UPSERT them on the first stroke!
                // 3. Immediately redirect the user to the generic Dynamic Editor route.
                navigate(`/editor/${resumeData.id}`);

            } catch (error) {
                console.error("Failed to create draft:", error);
                toast.error("Failed to initialize resume. Please try again.");
                navigate('/'); // Fallback
            }
        };

        createNewDraft();
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
            <div className="animate-pulse flex flex-col items-center text-primary-600">
                <svg className="w-12 h-12 mb-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-slate-500 font-medium">Initializing workspace...</p>
            </div>
        </div>
    );
}
