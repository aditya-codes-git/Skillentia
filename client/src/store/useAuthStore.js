import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set, get) => ({
    user: null,
    session: null,
    loading: true,

    initialize: async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            set({ session, user: session?.user ?? null, loading: false });

            // Listen for auth changes
            supabase.auth.onAuthStateChange((_event, session) => {
                set({ session, user: session?.user ?? null });
            });
        } catch (error) {
            console.error('Error fetching session:', error.message);
            set({ loading: false });
        }
    },

    signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    signInWithGoogle: async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`
            }
        });
        if (error) throw error;
        return data;
    },

    signUp: async (email, password, firstName, lastName) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                }
            }
        });
        if (error) throw error;
        return data;
    },

    updateProfile: async (metadata) => {
        const { data, error } = await supabase.auth.updateUser({
            data: metadata
        });
        if (error) throw error;
        set({ user: data.user });
        return data;
    },

    updatePassword: async (newPassword) => {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) throw error;
        return data;
    },

    deleteAccount: async () => {
        const user = get().user;
        if (!user) throw new Error('No user logged in');

        // Delete all user-owned resumes (cascade deletes sections, versions, analysis_results)
        const { error: resumeError } = await supabase
            .from('resumes')
            .delete()
            .eq('user_id', user.id);
        if (resumeError) throw resumeError;

        // Delete export logs if table exists
        try {
            await supabase.from('resume_exports').delete().eq('user_id', user.id);
        } catch (_) { /* table may not exist */ }

        // Call the server-side RPC to delete the auth user
        const { error: rpcError } = await supabase.rpc('delete_user_account');
        if (rpcError) throw rpcError;

        set({ user: null, session: null });
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set({ user: null, session: null });
    }
}));
