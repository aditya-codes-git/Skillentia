import { LayoutDashboard, FileText, Cpu, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
                    Welcome back
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Here is what's happening with your career overview.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Quick Action Card 1 */}
                <div className="card p-6 flex flex-col items-start group">
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                        Create Resume
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">
                        Build a new resume structured for ATS algorithms and optimal readability.
                    </p>
                    <Link to="/resumes/new" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                        Start building <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                </div>

                {/* Quick Action Card 2 */}
                <div className="card p-6 flex flex-col items-start group">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                        <Cpu className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                        AI Optimizer
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">
                        Run a deterministic skill gap analysis and evaluate formatting logic.
                    </p>
                    <Link to="/analyze" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Analyze now <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                </div>

                {/* Stats Card */}
                <div className="card p-6 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-950 border-none">
                    <h3 className="text-lg font-semibold text-white mb-6">
                        Platform Stats
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-slate-300">
                            <span className="text-sm">Active Resumes</span>
                            <span className="font-mono font-medium text-white">3</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                            <span className="text-sm">Analyses Run</span>
                            <span className="font-mono font-medium text-white">12</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
