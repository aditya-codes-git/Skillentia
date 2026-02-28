import { Eye, Edit3, ArrowLeft } from 'lucide-react';
import { Outlet, Link } from 'react-router-dom';
import BasicPreview from './BasicPreview';

export default function EditorLayout() {
    return (
        <div className="flex h-screen w-full bg-background-light dark:bg-background-dark overflow-hidden transition-colors duration-300">

            {/* Left Pane: Form Editor (Scrollable) */}
            <div className="flex-1 w-1/2 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative z-10">
                <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 gap-2 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Editor Panel</span>
                    </div>
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Dashboard
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                    <Outlet /> {/* This will render the actual form components linearly */}
                </div>
            </div>

            {/* Right Pane: Live Document Preview (Scrollable container holding generic A4 canvas) */}
            <div className="flex-1 w-1/2 flex flex-col bg-slate-100 dark:bg-[#0a0f1a]">
                <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center px-6 gap-2 bg-white dark:bg-surface-dark shadow-sm">
                    <Eye className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Live Preview</span>
                </div>

                <div className="flex-1 overflow-y-auto p-8 flex justify-center custom-scrollbar">
                    {/* A4 Proportion Canvas Wrapper */}
                    <div className="w-[800px] min-h-[1131px] scale-90 origin-top bg-white select-none">
                        <BasicPreview />
                    </div>
                </div>
            </div>

        </div>
    );
}
