import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { analyzeResumeClient } from '../utils/analyzeResume';

export const useAnalyzerStore = create((set, get) => ({
    // State
    uploadState: 'idle', // idle | uploading | parsing | analyzing | complete | error
    currentAnalysis: null,
    analysisHistory: [],
    errorMessage: null,
    uploadProgress: 0,

    // Reset
    reset: () => set({ uploadState: 'idle', currentAnalysis: null, errorMessage: null, uploadProgress: 0 }),

    // Upload & Analyze (Client-side — no edge function needed)
    analyzeResume: async (resumeText, jobDescription = null) => {
        set({ uploadState: 'analyzing', errorMessage: null, uploadProgress: 60 });

        try {
            set({ uploadProgress: 75 });

            const result = await analyzeResumeClient(resumeText, jobDescription);

            set({ uploadState: 'complete', currentAnalysis: result, uploadProgress: 100 });
            return result;
        } catch (error) {
            set({ uploadState: 'error', errorMessage: error.message, uploadProgress: 0 });
            throw error;
        }
    },

    // Fetch History
    fetchHistory: async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { data, error } = await supabase
                .from('analysis_results')
                .select('id, overall_score, created_at, job_description')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            set({ analysisHistory: data || [] });
        } catch (error) {
            console.error('Failed to fetch analysis history:', error);
        }
    },

    // Fetch single analysis
    fetchAnalysis: async (analysisId) => {
        try {
            const { data, error } = await supabase
                .from('analysis_results')
                .select('*')
                .eq('id', analysisId)
                .single();

            if (error) throw error;
            set({ currentAnalysis: data?.result_data || null });
            return data?.result_data;
        } catch (error) {
            console.error('Failed to fetch analysis:', error);
            return null;
        }
    },

    setUploadState: (state) => set({ uploadState: state }),
    setUploadProgress: (progress) => set({ uploadProgress: progress }),
}));
