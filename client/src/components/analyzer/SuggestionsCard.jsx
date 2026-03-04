import { Lightbulb, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuggestionsCard({ suggestions = [] }) {
    if (!suggestions.length) return null;

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">Rewrite Suggestions</h3>
            </div>
            <div className="space-y-4">
                {suggestions.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl border border-amber-200/50 dark:border-amber-800/30"
                    >
                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                <span className="text-xs font-bold text-red-500 uppercase tracking-wider shrink-0 mt-0.5">Before:</span>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-through">{item.original_text}</p>
                            </div>
                            <div className="flex items-center justify-center">
                                <ArrowRight className="w-4 h-4 text-amber-500" />
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider shrink-0 mt-0.5">After:</span>
                                <p className="text-sm text-slate-900 dark:text-white font-medium">{item.improved_text}</p>
                            </div>
                            {item.reason && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1 pl-1 border-l-2 border-amber-300 dark:border-amber-700">{item.reason}</p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
