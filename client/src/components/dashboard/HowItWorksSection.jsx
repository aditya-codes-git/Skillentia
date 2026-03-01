import { motion } from 'framer-motion';
import { UserPlus, FileEdit, Cpu, Download } from 'lucide-react';

const steps = [
    {
        id: 1,
        title: "Enter Your Details",
        description: "Input your personal information, experience, education, and skills into our intuitive data-first interface.",
        icon: UserPlus,
        color: "text-blue-500"
    },
    {
        id: 2,
        title: "Build Your Resume",
        description: "Watch your resume generate in real-time as a beautifully formatted document that strictly adheres to structural best practices.",
        icon: FileEdit,
        color: "text-primary-500"
    },
    {
        id: 3,
        title: "Optimize Using AI",
        description: "Run our Gemini-powered AI engine to analyze your resume against job descriptions for critical keyword gaps.",
        icon: Cpu,
        color: "text-indigo-500"
    },
    {
        id: 4,
        title: "Download & Manage",
        description: "Export pixel-perfect PDFs or DOCX files globally, and manage all your historical resume versions from your dashboard.",
        icon: Download,
        color: "text-fuchsia-500"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function HowItWorksSection() {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="py-16 relative z-10"
        >
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">A streamlined four-step architecture to transform your raw career data into a polished, interview-ready document.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 sm:px-6">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <motion.div key={step.id} variants={itemVariants} className="relative group">
                            {/* Connector Line (hidden on mobile, visible on lg) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-800 z-0"></div>
                            )}

                            <div className="glass-card p-6 h-full flex flex-col items-center text-center relative z-10 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                                <div className={`w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6 text-xl font-bold ${step.color} relative`}>
                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-xs font-bold shadow-md">
                                        {step.id}
                                    </div>
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.description}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
