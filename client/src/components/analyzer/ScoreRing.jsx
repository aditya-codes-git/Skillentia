import { motion } from 'framer-motion';

export default function ScoreRing({ score = 0, size = 160, strokeWidth = 10, label = "Overall Score" }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const getColor = (s) => {
        if (s >= 80) return { stroke: '#10b981', bg: 'bg-emerald-500/10', text: 'text-emerald-500' };
        if (s >= 60) return { stroke: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-500' };
        if (s >= 40) return { stroke: '#f97316', bg: 'bg-orange-500/10', text: 'text-orange-500' };
        return { stroke: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-500' };
    };

    const colors = getColor(score);

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    {/* Background ring */}
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-slate-200 dark:text-slate-800"
                    />
                    {/* Animated progress ring */}
                    <motion.circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none"
                        stroke={colors.stroke}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                    />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        className={`text-4xl font-mono font-bold ${colors.text}`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                    >
                        {score}
                    </motion.span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mt-1">/100</span>
                </div>
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{label}</p>
        </div>
    );
}
