import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: "What exactly is Skillentia?",
        answer: "Skillentia is a next-generation resume generating platform that enforces strict structured data input over freeform editing to guarantee your resume successfully parses through Applicant Tracking Systems (ATS)."
    },
    {
        question: "Is this platform free to use?",
        answer: "Our core structural resume builder and PDF/DOCX exporting capabilities are completely free. Some advanced neural net features may be limited depending on volume."
    },
    {
        question: "How do I create my first resume?",
        answer: "Navigate to the built-in Editor, fill out the form fields with your raw career details, and our determinist layout engine will physically render your document in real-time."
    },
    {
        question: "Can I edit my resume later after generating?",
        answer: "Yes. All your input structured data is saved automatically in your account. You can return at any time to revise bullets and instantly export a new version."
    },
    {
        question: "Is my personal data secure?",
        answer: "We use Supabase Postgres with aggressive Row Level Security (RLS) policies. Only authenticated accounts have cryptographic clearance to view their corresponding rows."
    },
    {
        question: "Can I download my resume as a PDF?",
        answer: "Absolutely. We offer high-fidelity client-side PDF rendering that ensures your fonts, margins, and layouts are frozen perfectly, exactly how you see them."
    },
    {
        question: "Can I store multiple resume variations?",
        answer: "Yes. Whenever you finalize an export, we create an immutable historical snapshot. You can have unlimited snapshots optimized for entirely different job sectors."
    },
    {
        question: "How does the AI Optimizer work?",
        answer: "You paste the Job Description you are targeting, and our Gemini engine calculates keyword density gaps, suggesting tactical sentence rewrites to boost your ATS viability."
    },
    {
        question: "Do I need to sign up for an account to use it?",
        answer: "Yes, an account is automatically generated for you via minimal friction authentication. This is required because your resume data is deeply tied to a secure user session."
    },
    {
        question: "How do I contact support if I run into issues?",
        answer: "You can reach our engineering team directly through the feedback terminal, or ping us on GitHub if you encounter strictly reproducible bugs."
    }
];

function FaqItem({ item, isOpen, onClick }) {
    return (
        <div className="border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm rounded-2xl overflow-hidden mb-4 transition-colors hover:border-slate-300 dark:hover:border-slate-700">
            <button
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                onClick={onClick}
            >
                <span className="font-semibold text-slate-900 dark:text-white px-2">
                    {item.question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-slate-500 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-8 pb-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-4">
                            {item.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="py-16 relative z-10"
        >
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Everything you need to know about the product and billing.</p>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                {faqs.map((faq, index) => (
                    <FaqItem
                        key={index}
                        item={faq}
                        isOpen={openIndex === index}
                        onClick={() => setOpenIndex(index === openIndex ? null : index)}
                    />
                ))}
            </div>
        </motion.div>
    );
}
