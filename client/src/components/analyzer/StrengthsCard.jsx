import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StrengthsCard({ strengths = [] }) {
    if (!strengths.length) return null;

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">Strengths</h3>
            </div>
            <div className="space-y-3">
                {strengths.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30"
                    >
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{item.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
