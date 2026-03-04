import { useCallback, useState } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import mammoth from 'mammoth';

export default function ResumeUploader({ onFileProcessed, isProcessing }) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);

    const ACCEPTED_TYPES = {
        'application/pdf': 'pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'text/plain': 'txt'
    };
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    const validateFile = (file) => {
        if (!ACCEPTED_TYPES[file.type]) {
            return 'Invalid file type. Please upload a PDF, DOCX, or TXT file.';
        }
        if (file.size > MAX_SIZE) {
            return 'File too large. Maximum size is 5MB.';
        }
        return null;
    };

    const extractText = async (file) => {
        const fileType = ACCEPTED_TYPES[file.type];

        // TXT — read directly
        if (fileType === 'txt') {
            return await file.text();
        }

        // DOCX — use mammoth.js for proper parsing
        if (fileType === 'docx') {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                return result.value.trim();
            } catch {
                throw new Error('Failed to read DOCX file. The file may be corrupted.');
            }
        }

        // PDF — read as text (basic text-layer extraction)
        if (fileType === 'pdf') {
            try {
                const text = await file.text();
                const cleaned = text
                    .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                if (cleaned.length < 50) {
                    throw new Error('Could not extract text from this PDF. It may be image-based. Try pasting your resume text directly.');
                }
                return cleaned;
            } catch (err) {
                throw new Error(err.message || 'Failed to extract text from PDF.');
            }
        }

        throw new Error('Unsupported file type.');
    };

    const handleFile = useCallback(async (file) => {
        setError(null);
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        setSelectedFile(file);
        try {
            const text = await extractText(file);
            if (text.length < 50) {
                setError('Could not extract meaningful text from this file. Try pasting your resume text directly.');
                setSelectedFile(null);
                return;
            }
            onFileProcessed(text, file.name);
        } catch (err) {
            setError(err.message);
            setSelectedFile(null);
        }
    }, [onFileProcessed]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    }, [handleFile]);

    const handleInputChange = (e) => {
        if (e.target.files?.[0]) handleFile(e.target.files[0]);
    };

    const removeFile = () => {
        setSelectedFile(null);
        setError(null);
    };

    return (
        <div className="space-y-4">
            <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer group
                    ${dragActive
                        ? 'border-primary-500 bg-primary-500/10 scale-[1.02]'
                        : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-500/5'
                    }
                    ${isProcessing ? 'pointer-events-none opacity-60' : ''}
                `}
            >
                <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isProcessing}
                />

                <AnimatePresence mode="wait">
                    {selectedFile ? (
                        <motion.div
                            key="file-selected"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                                <FileText className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedFile.name}</p>
                            <p className="text-xs text-slate-500 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                            {!isProcessing && (
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                    className="mt-3 text-xs text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                                >
                                    <X className="w-3 h-3" /> Remove
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="upload-prompt"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                                <Upload className="w-8 h-8 text-slate-400 group-hover:text-primary-500 transition-colors" />
                            </div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Drop your resume here or <span className="text-primary-600 dark:text-primary-400">browse</span>
                            </p>
                            <p className="text-xs text-slate-400 mt-2">Supports PDF, DOCX, TXT — Max 5MB</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm"
                    >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
