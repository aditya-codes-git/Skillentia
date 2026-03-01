import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
};

export default function ProductIntroSection() {
    return (
        <motion.div variants={itemVariants} className="relative z-10 text-center max-w-4xl mx-auto py-16 lg:py-24 border-t border-slate-200/50 dark:border-slate-800/50 mt-12">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6"
            >
                <Sparkles className="w-3.5 h-3.5" />
                The Ultimate Career Tool
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
                Craft Your Professional Narrative with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-fuchsia-500">Precision.</span>
            </h2>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                Skillentia is the premium resume building platform designed for the modern job market. We combine sleek design templates with AI-powered optimization to ensure your resume stands out to both recruiters and Applicant Tracking Systems (ATS).
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/resumes/new" className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2 group">
                    Create Your Resume
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/analyze" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 flex items-center justify-center gap-2">
                    Try AI Optimizer
                </Link>
            </div>
        </motion.div>
    );
}
