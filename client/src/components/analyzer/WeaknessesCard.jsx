import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const impactColors = {
    high: 'bg-red-50 dark:bg-red-900/10 border-red-200/50 dark:border-red-800/30 text-red-600 dark:text-red-400',
    medium: 'bg-amber-50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/30 text-amber-600 dark:text-amber-400',
    low: 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-400'
};

const badgeColors = {
    high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    low: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
};

export default function WeaknessesCard({ weaknesses = [] }) {
    if (!weaknesses.length) return null;

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">Areas for Improvement</h3>
            </div>
            <div className="space-y-3">
                {weaknesses.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-3 rounded-xl border ${impactColors[item.impact_level] || impactColors.medium}`}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${badgeColors[item.impact_level] || badgeColors.medium}`}>
                                {item.impact_level}
                            </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{item.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
