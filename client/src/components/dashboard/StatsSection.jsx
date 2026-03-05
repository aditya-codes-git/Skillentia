import { motion, useInView } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { InteractiveRobotSpline } from '../ui/InteractiveRobotSpline';

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

const stats = [
    { label: 'Total Resumes Generated', suffix: '+' },
    { label: 'AI Optimizations Run', gradient: true },
    { label: 'Active Professionals', suffix: '' },
];

const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

export default function StatsSection() {
    const resumesCounter = useCounter(14205, 2500);
    const aiOptimizationsCounter = useCounter(58923, 3000);
    const activeUsersCounter = useCounter(8432, 2000);

    const counters = [resumesCounter, aiOptimizationsCounter, activeUsersCounter];

    return (
        <div className="py-16 md:py-24">
            <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden rounded-3xl">
                {/* Deep indigo gradient background */}
                <div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4338ca 50%, #6366f1 75%, #818cf8 100%)',
                    }}
                />
                {/* Subtle secondary radial glow overlay */}
                <div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                        background: 'radial-gradient(ellipse at bottom center, rgba(129,140,248,0.25) 0%, transparent 60%)',
                    }}
                />

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
                    {/* Section heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center pt-20 mb-4"
                    >
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">
                            The backbone of{'\n'}<br />career acceleration
                        </h2>
                    </motion.div>

                    {/* Stats grid */}
                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0 mb-4">
                        {/* Horizontal gradient divider line */}
                        <div className="absolute left-[10%] right-[10%] top-[60%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent hidden md:block" />

                        {stats.map((stat, idx) => {
                            const counter = counters[idx];
                            return (
                                <div
                                    key={idx}
                                    ref={counter.ref}
                                    className="text-center py-8 px-4"
                                >
                                    <div
                                        className={`text-5xl md:text-6xl font-display font-bold mb-3 tabular-nums ${stat.gradient
                                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white'
                                            : 'text-white'
                                            }`}
                                    >
                                        {counter.count.toLocaleString()}{stat.suffix || ''}
                                    </div>
                                    <p className="text-sm font-medium text-indigo-200/70 uppercase tracking-widest">
                                        {stat.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* 3D Interactive Robot */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative w-full h-[400px] md:h-[500px] lg:h-[550px]"
                    >
                        <InteractiveRobotSpline
                            scene={ROBOT_SCENE_URL}
                            className="absolute inset-0 z-0"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
