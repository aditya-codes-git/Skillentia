import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, History, Activity, Clock, ChevronRight } from 'lucide-react';
import { useAnalyzerStore } from '../../store/useAnalyzerStore';

const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
    return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
};

export default function AnalysisHistoryPage() {
    const { analysisHistory, fetchHistory } = useAnalyzerStore();

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        to="/analyze"
                        className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-500 hover:text-primary-600 dark:text-slate-400 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="p-3 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-2xl">
                        <History className="w-6 h-6 text-fuchsia-600 dark:text-fuchsia-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">Analysis History</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{analysisHistory.length} analysis {analysisHistory.length === 1 ? 'record' : 'records'}</p>
                    </div>
                </div>
                <Link
                    to="/analyze"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl hover:shadow-glow transition-all"
                >
                    <Activity className="w-4 h-4" />
                    New Analysis
                </Link>
            </div>

            {/* History List */}
            {analysisHistory.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <History className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-display font-bold text-slate-700 dark:text-slate-300 mb-2">No Analyses Yet</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Run your first resume analysis to start tracking your progress.</p>
                    <Link
                        to="/analyze"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl hover:shadow-glow transition-all"
                    >
                        <Activity className="w-4 h-4" />
                        Start Analyzing
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {analysisHistory.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                to={`/analyze/results/${item.id}`}
                                className="glass-card p-5 flex items-center justify-between group hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg ${getScoreColor(item.overall_score)}`}>
                                        {item.overall_score}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                            Analysis #{analysisHistory.length - i}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <Clock className="w-3 h-3 text-slate-400" />
                                            <span className="text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        {item.job_description && (
                                            <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/30 px-2 py-0.5 rounded-full">
                                                Job-specific scan
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
