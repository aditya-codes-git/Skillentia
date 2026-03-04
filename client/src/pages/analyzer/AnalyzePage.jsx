import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Sparkles, ClipboardList, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResumeUploader from '../../components/analyzer/ResumeUploader';
import { useAnalyzerStore } from '../../store/useAnalyzerStore';
import toast from 'react-hot-toast';

const pipelineSteps = [
    { label: 'Upload Resume', description: 'Drop your file' },
    { label: 'Text Extraction', description: 'Parsing content' },
    { label: 'Deterministic Scan', description: 'Rule-based checks' },
    { label: 'AI Analysis', description: 'Gemini deep scan' },
    { label: 'Results Ready', description: 'View dashboard' }
];

export default function AnalyzePage() {
    const navigate = useNavigate();
    const { uploadState, analyzeResume, reset } = useAnalyzerStore();
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [useTextInput, setUseTextInput] = useState(false);

    const handleFileProcessed = useCallback((text, fileName) => {
        setResumeText(text);
        setActiveStep(1);
        toast.success(`Extracted text from ${fileName}`);
    }, []);

    const handleAnalyze = async () => {
        if (!resumeText.trim()) {
            toast.error('Please upload a resume or paste your resume text first.');
            return;
        }

        setActiveStep(2);

        try {
            setActiveStep(3);
            const result = await analyzeResume(resumeText, jobDescription || null);

            setActiveStep(4);
            toast.success('Analysis complete!');

            // Navigate after a brief delay to show the completed pipeline
            setTimeout(() => {
                navigate('/analyze/results/latest');
            }, 800);
        } catch (error) {
            toast.error(error.message || 'Analysis failed.');
            setActiveStep(1);
        }
    };

    const isAnalyzing = uploadState === 'analyzing';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl">
                            <Cpu className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">AI Resume Analyzer</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Powered by Gemini + deterministic rule engine</p>
                        </div>
                    </div>
                </div>
                <Link
                    to="/analyze/history"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                    <History className="w-4 h-4" />
                    History
                </Link>
            </div>

            {/* Pipeline Progress */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-2">
                    {pipelineSteps.map((step, i) => (
                        <div key={i} className="flex flex-col items-center flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${i <= activeStep
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                                }`}>
                                {i < activeStep ? '✓' : i + 1}
                            </div>
                            <span className={`text-[10px] font-semibold mt-1.5 uppercase tracking-wider text-center ${i <= activeStep ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                                }`}>{step.label}</span>
                        </div>
                    ))}
                </div>
                <div className="flex mt-1">
                    {pipelineSteps.slice(0, -1).map((_, i) => (
                        <div key={i} className="flex-1 h-1 mx-1 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                            <motion.div
                                className="h-full bg-indigo-500"
                                initial={{ width: '0%' }}
                                animate={{ width: i < activeStep ? '100%' : '0%' }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Upload Section */}
            <div className="glass-card p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">Resume Input</h2>
                    <button
                        onClick={() => { setUseTextInput(!useTextInput); setResumeText(''); }}
                        className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
                    >
                        {useTextInput ? 'Switch to File Upload' : 'Paste Text Instead'}
                    </button>
                </div>

                {useTextInput ? (
                    <textarea
                        value={resumeText}
                        onChange={(e) => { setResumeText(e.target.value); if (e.target.value.length > 50) setActiveStep(1); }}
                        rows={12}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none font-mono"
                        placeholder="Paste your full resume text here..."
                        disabled={isAnalyzing}
                    />
                ) : (
                    <ResumeUploader onFileProcessed={handleFileProcessed} isProcessing={isAnalyzing} />
                )}
            </div>

            {/* Job Description (Optional) */}
            <div className="glass-card p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                    <ClipboardList className="w-5 h-5 text-slate-400" />
                    <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">Job Description <span className="text-xs font-normal text-slate-400">(optional)</span></h2>
                </div>
                <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none"
                    placeholder="Paste a target job description to get skill-gap analysis and ATS keyword optimization specific to that role..."
                    disabled={isAnalyzing}
                />
            </div>

            {/* Analyze Button */}
            <motion.button
                onClick={handleAnalyze}
                disabled={!resumeText.trim() || isAnalyzing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-lg font-display font-bold rounded-2xl hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
                {isAnalyzing ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing with Gemini...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5" />
                        Run Full Analysis
                    </>
                )}
            </motion.button>
        </motion.div>
    );
}
