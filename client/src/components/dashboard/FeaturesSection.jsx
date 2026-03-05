import { motion } from 'framer-motion';
import { LayoutTemplate, Lightbulb, LineChart, Layers } from 'lucide-react';
import { GlowingEffect } from '../ui/glowing-effect';

const features = [
    {
        title: "Deterministic Builder",
        description: "No drag-and-drop chaos. Input your strictly structured data and we generate pixel-perfect SVG/PDFs programmatically.",
        icon: LayoutTemplate,
        color: "text-rose-500"
    },
    {
        title: "Neural Net Optimizer",
        description: "Powered by Gemini, our AI scans the gap between your capabilities and specific job descriptions for intelligent injection.",
        icon: Lightbulb,
        color: "text-amber-500"
    },
    {
        title: "ATS Density Insights",
        description: "Visualize keyword frequency across your historical versions to continuously tune your ATS match scores.",
        icon: LineChart,
        color: "text-emerald-500"
    },
    {
        title: "Historical Versioning",
        description: "Save a complete, independent snapshot every time you export. Easily rollback or fork an old resume for a new sector.",
        icon: Layers,
        color: "text-sky-500"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function FeaturesSection() {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="py-16 md:py-24 relative z-10"
        >
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">Core Tooling</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Not just a rich text editor. A complete platform designed specifically to win against algorithmic recruiters.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto px-4 sm:px-6">
                {features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                        <motion.div key={idx} variants={itemVariants} className="relative group flex-1">
                            <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-slate-200 dark:border-white/[0.06] p-2 md:rounded-[1.5rem] md:p-3">
                                <GlowingEffect
                                    spread={40}
                                    glow={true}
                                    disabled={false}
                                    proximity={64}
                                    inactiveZone={0.01}
                                    borderWidth={3}
                                />
                                <div className="relative flex h-full items-start gap-5 overflow-hidden rounded-xl border-[0.75px] border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 p-6 md:p-8 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] backdrop-blur-sm transition-colors hover:border-slate-300 dark:hover:border-slate-600">
                                    <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 flex-shrink-0 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
