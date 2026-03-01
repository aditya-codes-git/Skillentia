import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Trash2, FileOutput, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function MyResumesPage() {
    const user = useAuthStore((state) => state.user);
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchResumes = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('resume_exports')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setResumes(data || []);
        } catch (error) {
            console.error('Error fetching resumes:', error);
            toast.error('Failed to load your resumes.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchResumes();
        }
    }, [user?.id]);

    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('resume_exports')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setResumes(resumes.filter(exp => exp.id !== id));
            toast.success('Resume record deleted.');
        } catch (error) {
            console.error('Error deleting export:', error);
            toast.error('Failed to delete resume record.');
        }
    };

    const handleDownloadAgain = (record) => {
        // In a full architecture, this might fetch the JSON snapshot and trigger the generator again.
        // For this UI implementation, we advise the user to generate fresh from the editor, or we simulate it.
        toast('To download again, please generate a fresh copy from the Editor.', {
            icon: 'ℹ️',
        });
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">
                        My Exports
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        You have exported <span className="font-semibold text-primary-600 dark:text-primary-400">{resumes.length}</span> resumes.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="glass-card p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                            <FileOutput className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No exports yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                            Head over to the Resume Editor and download your first PDF or DOCX to see it here.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        <AnimatePresence>
                            {resumes.map((record, index) => (
                                <motion.div
                                    key={record.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="glass-card p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:shadow-glow transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${record.format === 'pdf'
                                            ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                                            : 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                            }`}>
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                                                {record.file_name}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${record.format === 'pdf'
                                                    ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                                                    : 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                                    }`}>
                                                    {record.format}
                                                </span>
                                                <span>•</span>
                                                <span>{format(new Date(record.created_at), 'MMM d, yyyy h:mm a')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <button
                                            onClick={() => handleDownloadAgain(record)}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                        >
                                            <Download className="w-4 h-4" /> Download
                                        </button>
                                        <button
                                            onClick={() => handleDelete(record.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete Record"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
