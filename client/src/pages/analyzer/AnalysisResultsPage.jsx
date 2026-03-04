import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, RotateCw } from 'lucide-react';
import { useAnalyzerStore } from '../../store/useAnalyzerStore';
import ScoreRing from '../../components/analyzer/ScoreRing';
import StrengthsCard from '../../components/analyzer/StrengthsCard';
import WeaknessesCard from '../../components/analyzer/WeaknessesCard';
import SkillGapCard from '../../components/analyzer/SkillGapCard';
import ATSCard from '../../components/analyzer/ATSCard';
import SuggestionsCard from '../../components/analyzer/SuggestionsCard';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function AnalysisResultsPage() {
    const { id } = useParams();
    const { currentAnalysis, fetchAnalysis } = useAnalyzerStore();

    useEffect(() => {
        if (id && id !== 'latest' && !currentAnalysis) {
            fetchAnalysis(id);
        }
    }, [id, currentAnalysis, fetchAnalysis]);

    if (!currentAnalysis) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-12 h-12 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mb-4" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Loading analysis results...</p>
            </div>
        );
    }

    const analysis = currentAnalysis;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto space-y-8"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        to="/analyze"
                        className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-500 hover:text-primary-600 dark:text-slate-400 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl">
                        <Cpu className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">Analysis Results</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{analysis.cached ? 'Cached result' : 'Fresh analysis'} • {analysis.deterministic_analysis?.length_analysis?.word_count || '—'} words analyzed</p>
                    </div>
                </div>
                <Link
                    to="/analyze"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl hover:shadow-glow transition-all"
                >
                    <RotateCw className="w-4 h-4" />
                    Analyze Another
                </Link>
            </motion.div>

            {/* Summary + Score Row */}
            <motion.div variants={itemVariants} className="glass-card p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <ScoreRing score={analysis.overall_score || 0} size={180} strokeWidth={12} />
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-3">Summary</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{analysis.summary || 'No summary available.'}</p>

                        {analysis.recommendations_summary && (
                            <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-200/50 dark:border-indigo-800/30">
                                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Key Recommendation</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{analysis.recommendations_summary}</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                    <StrengthsCard strengths={analysis.strengths} />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <WeaknessesCard weaknesses={analysis.weaknesses} />
                </motion.div>
            </div>

            {/* ATS Analysis */}
            <motion.div variants={itemVariants}>
                <ATSCard atsAnalysis={analysis.ats_analysis} />
            </motion.div>

            {/* Skill Gap */}
            <motion.div variants={itemVariants}>
                <SkillGapCard skillGap={analysis.skill_gap_analysis} />
            </motion.div>

            {/* Rewrite Suggestions */}
            <motion.div variants={itemVariants}>
                <SuggestionsCard suggestions={analysis.rewrite_suggestions} />
            </motion.div>

            {/* Deterministic Breakdown */}
            {analysis.deterministic_analysis && (
                <motion.div variants={itemVariants} className="glass-card p-6">
                    <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-4">Deterministic Pre-Scan Breakdown</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Section Coverage', value: `${analysis.deterministic_analysis.section_completeness?.score || 0}%` },
                            { label: 'Word Count', value: analysis.deterministic_analysis.length_analysis?.word_count || 0 },
                            { label: 'Bullet Quality', value: `${analysis.deterministic_analysis.bullet_quality?.score || 0}%` },
                            { label: 'Metrics Found', value: analysis.deterministic_analysis.metrics_detection?.count || 0 },
                        ].map((stat, i) => (
                            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-center">
                                <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white">{stat.value}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
