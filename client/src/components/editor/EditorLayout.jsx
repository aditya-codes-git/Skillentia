import { Eye, Edit3, ArrowLeft, Search, Command } from 'lucide-react';
import { Outlet, Link } from 'react-router-dom';
import BasicPreview from './BasicPreview';
import { motion } from 'framer-motion';

export default function EditorLayout() {
    return (
        <div className="flex h-screen w-full overflow-hidden relative z-10">
            {/* The global AnimatedBackground sits behind this */}

            {/* Left Pane: Form Editor */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex-1 w-1/2 flex flex-col border-r border-slate-200/50 dark:border-slate-800/50 glass-card rounded-none shadow-none z-20"
            >
                <div className="h-14 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-6 gap-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
                        <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-slate-100/50 dark:bg-slate-800/50">
                            <Edit3 className="w-3.5 h-3.5 text-primary-500" />
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Editor Panel</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                            <Command className="w-3 h-3" /> S
                        </span>
                        Auto-saving
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                    <div className="max-w-2xl mx-auto pb-32">
                        <Outlet />
                    </div>
                </div>
            </motion.div>

            {/* Right Pane: Live Document Preview */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex-1 w-1/2 flex flex-col bg-slate-50/50 dark:bg-[#0a0f1a]/50 backdrop-blur-sm relative z-10"
            >
                <div className="h-14 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Live Preview</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-500 transition-colors">
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center custom-scrollbar">
                    {/* A4 Proportion Canvas Wrapper with float animation */}
                    <div className="w-[800px] min-h-[1131px] scale-[0.6] sm:scale-75 md:scale-90 origin-top bg-white dark:bg-slate-50 shadow-2xl ring-1 ring-slate-900/5 select-none transition-transform duration-300">
                        <BasicPreview />
                    </div>
                </div>
            </motion.div>

        </div>
    );
}
