import { motion, useInView } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

// Animated counter hook
function useCounter(end, duration = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        let startTime = null;
        if (!inView) return;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(end * easeOut));

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration, inView]);

    return { count, ref };
}

export default function StatsSection() {
    const resumesCounter = useCounter(14205, 2500);
    const aiOptimizationsCounter = useCounter(58923, 3000);
    const activeUsersCounter = useCounter(8432, 2000);

    return (
        <div className="py-16 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">

                    <div className="py-6 md:py-0 px-4" ref={resumesCounter.ref}>
                        <div className="text-5xl md:text-6xl font-display font-extrabold text-slate-900 dark:text-white mb-2 tabular-nums">
                            {resumesCounter.count.toLocaleString()}+
                        </div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Total Resumes Generated</p>
                    </div>

                    <div className="py-6 md:py-0 px-4" ref={aiOptimizationsCounter.ref}>
                        <div className="text-5xl md:text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500 mb-2 tabular-nums">
                            {aiOptimizationsCounter.count.toLocaleString()}
                        </div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">AI Optimizations Run</p>
                    </div>

                    <div className="py-6 md:py-0 px-4" ref={activeUsersCounter.ref}>
                        <div className="text-5xl md:text-6xl font-display font-extrabold text-slate-900 dark:text-white mb-2 tabular-nums">
                            {activeUsersCounter.count.toLocaleString()}
                        </div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Active Professionals</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
