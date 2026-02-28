import { FileText, Cpu, ArrowRight, Sparkles, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
};

export default function DashboardPage() {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
        >
            {/* Hero Section */}
            <motion.div variants={itemVariants} className="relative z-10 text-center max-w-3xl mx-auto mt-8">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-semibold uppercase tracking-wider mb-6"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    Welcome to the Future
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                    Build. Optimize. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500">Dominate.</span>
                </h1>
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Skillentia's deterministic AI engine evaluates your resume against proprietary parsing algorithms.
                    Your career overview, simplified and weaponized.
                </p>
            </motion.div>

            {/* Quick Actions Grid */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {/* Create Resume Card */}
                <motion.div variants={itemVariants}>
                    <Link to="/resumes/new" className="block h-full group">
                        <div className="glass-card relative h-full p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.3)] dark:hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.15)] group-hover:border-primary-500/50">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="p-4 bg-primary-100 dark:bg-primary-900/40 rounded-2xl w-max mb-6 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500">
                                    <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3">
                                    Architect Resume
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 flex-1 leading-relaxed">
                                    Construct a strictly typed, machine-readable resume structured specifically to bypass modern ATS filters.
                                </p>
                                <div className="inline-flex items-center text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 group-hover:text-primary-500 transition-colors">
                                    Launch Editor
                                    <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* AI Optimizer Card */}
                <motion.div variants={itemVariants}>
                    <Link to="/analyze" className="block h-full group">
                        <div className="glass-card relative h-full p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.3)] dark:hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.15)] group-hover:border-indigo-500/50">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="p-4 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl w-max mb-6 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                                    <Cpu className="w-8 h-8 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3">
                                    AI Optimizer
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 flex-1 leading-relaxed">
                                    Deploy our Gemini Flash neural net to run a deterministic skill-gap analysis and syntax validation.
                                </p>
                                <div className="inline-flex items-center text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 transition-colors">
                                    Initialize Scan
                                    <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Resume Insights Card */}
                <motion.div variants={itemVariants}>
                    <Link to="/insights" className="block h-full group">
                        <div className="glass-card relative h-full p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(217,70,239,0.3)] dark:hover:shadow-[0_20px_40px_-15px_rgba(217,70,239,0.15)] group-hover:border-fuchsia-500/50">
                            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="p-4 bg-fuchsia-100 dark:bg-fuchsia-900/40 rounded-2xl w-max mb-6 group-hover:scale-110 group-hover:bg-fuchsia-500 group-hover:text-white transition-all duration-500">
                                    <Activity className="w-8 h-8 text-fuchsia-600 dark:text-fuchsia-400 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3">
                                    Resume Insights
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 flex-1 leading-relaxed">
                                    Unlock actionable tracking and historical impact metrics. View keyword density trends.
                                </p>
                                <div className="inline-flex items-center text-sm font-semibold uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400 group-hover:text-fuchsia-500 transition-colors">
                                    View Metrics
                                    <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                <motion.div variants={itemVariants} className="glass-card p-6 border-l-4 border-l-primary-500 hover:bg-white/80 dark:hover:bg-slate-900/60 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Active Profiles</p>
                            <p className="text-3xl font-mono font-medium text-slate-900 dark:text-white">3</p>
                        </div>
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="glass-card p-6 border-l-4 border-l-indigo-500 hover:bg-white/80 dark:hover:bg-slate-900/60 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Scans Completed</p>
                            <p className="text-3xl font-mono font-medium text-slate-900 dark:text-white">12</p>
                        </div>
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            <Activity className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="glass-card p-6 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-950 border-none relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjwvcmVjdD4KPHBhdGggZD0iTTAgMEw4IDhaTTAgOEw4IDBaIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-20"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl group-hover:bg-primary-500/30 transition-colors duration-500"></div>
                    <div className="relative z-10">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">System Status</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                            </span>
                            <span className="text-sm font-medium text-white">All systems operational</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Background glowing decorations */}
            <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-float"></div>
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-float" style={{ animationDelay: '2s' }}></div>

        </motion.div>
    );
}
