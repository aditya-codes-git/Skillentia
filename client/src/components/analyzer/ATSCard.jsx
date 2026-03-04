import { Shield, AlertCircle } from 'lucide-react';
import ScoreRing from './ScoreRing';

const riskColors = {
    low: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30',
    medium: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
    high: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
};

export default function ATSCard({ atsAnalysis = {} }) {
    const {
        ats_score = 0,
        missing_keywords = [],
        weak_action_verbs = [],
        formatting_risk_level = 'low',
        formatting_issues = []
    } = atsAnalysis;

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">ATS Compatibility</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <ScoreRing score={ats_score} size={120} strokeWidth={8} label="ATS Score" />

                <div className="flex-1 space-y-4 w-full">
                    {/* Formatting Risk */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Formatting Risk:</span>
                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${riskColors[formatting_risk_level] || riskColors.low}`}>
                            {formatting_risk_level}
                        </span>
                    </div>

                    {/* Missing Keywords */}
                    {missing_keywords.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Missing Keywords</p>
                            <div className="flex flex-wrap gap-1.5">
                                {missing_keywords.map((kw, i) => (
                                    <span key={i} className="px-2 py-0.5 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md border border-red-200/50 dark:border-red-800/30">{kw}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Weak Verbs */}
                    {weak_action_verbs.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Weak Action Verbs</p>
                            <div className="space-y-1.5">
                                {weak_action_verbs.slice(0, 5).map((v, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs">
                                        <span className="line-through text-slate-400">{v.original || v.suggested_replacement}</span>
                                        <span className="text-slate-300 dark:text-slate-600">→</span>
                                        <span className="font-semibold text-primary-600 dark:text-primary-400">{v.suggested_replacement || v.suggested}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Formatting Issues */}
                    {formatting_issues.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Formatting Issues</p>
                            {formatting_issues.map((issue, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                    {issue}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
