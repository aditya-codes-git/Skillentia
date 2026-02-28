import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

/**
 * Hook to automatically debouce and save a JSON payload to Supabase
 * @param {Object} data - The current state object (e.g. useResumeStore state)
 * @param {string} resumeId - The UUID of the current resume record
 * @param {number} delay - Debounce delay in ms
 */
export function useAutoSave(data, resumeId, delay = 1000) {
    const { user } = useAuthStore();
    const timeoutRef = useRef(null);
    const isFirstRender = useRef(true);
    const [status, setStatus] = useState('idle'); // idle, saving, saved, error

    // Deep compare by stringifying to prevent infinite dependency loops 
    // from React's state re-renders creating new object references
    const dataString = JSON.stringify(data);

    useEffect(() => {
        // Skip saving on the initial render mount
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (!user || !resumeId) return;

        // Clear previous timeout if data changed again within the delay window
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setStatus('saving');

        timeoutRef.current = setTimeout(async () => {
            try {
                // Upsert the entire logical resume payload into the sections table
                // This leverages the unstructured JSONB 'content' column defined in gemini.md
                const { error } = await supabase
                    .from('resume_sections')
                    .upsert({
                        resume_id: resumeId,
                        section_type: 'full_document',
                        content: JSON.parse(dataString),
                        order_index: 0,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'resume_id, section_type' });

                if (error) throw error;
                setStatus('saved');
            } catch (err) {
                console.error('Auto-save failed:', err.message);
                setStatus('error');
                toast.error('Failed to auto-save resume data.');
            }
        }, delay);

        // Cleanup timeout on unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [dataString, resumeId, user?.id, delay]);

    return status;
}
