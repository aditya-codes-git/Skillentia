import { Target, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const priorityColors = {
    high: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
    medium: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
    low: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
};

export default function SkillGapCard({ skillGap = {} }) {
    const { matched_skills = [], missing_required_skills = [], critical_missing_skills = [], recommended_learning_skills = [] } = skillGap;

    const hasContent = matched_skills.length || missing_required_skills.length || critical_missing_skills.length || recommended_learning_skills.length;
    if (!hasContent) return null;

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                    <Target className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">Skill Gap Analysis</h3>
            </div>

            <div className="space-y-5">
                {matched_skills.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5" /> Matched Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {matched_skills.map((skill, i) => (
                                <span key={i} className="px-2.5 py-1 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-200/50 dark:border-emerald-800/30">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}

                {critical_missing_skills.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <XCircle className="w-3.5 h-3.5" /> Critical Missing Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {critical_missing_skills.map((skill, i) => (
                                <span key={i} className="px-2.5 py-1 text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200/50 dark:border-red-800/30">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}

                {missing_required_skills.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <XCircle className="w-3.5 h-3.5" /> Missing Required Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {missing_required_skills.map((skill, i) => (
                                <span key={i} className="px-2.5 py-1 text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-200/50 dark:border-amber-800/30">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}

                {recommended_learning_skills.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5" /> Recommended to Learn
                        </p>
                        <div className="space-y-2">
                            {recommended_learning_skills.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-start gap-2 p-2.5 bg-violet-50 dark:bg-violet-900/10 rounded-lg border border-violet-200/50 dark:border-violet-800/30"
                                >
                                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${priorityColors[item.priority] || priorityColors.medium}`}>{item.priority}</span>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.skill}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.reason}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
