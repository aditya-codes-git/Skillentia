import { motion } from 'framer-motion';

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50 bg-background-light dark:bg-[#0a0f1a] transition-colors duration-500">
            {/* Base Noise Texture */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>

            {/* Dark Mode Specific Deep Radial Gradient */}
            <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(circle_at_top,_#1e293b_0%,_transparent_100%)] opacity-50"></div>

            {/* Floating Orbs / Blobs */}
            <motion.div
                animate={{
                    x: [0, 30, -20, 0],
                    y: [0, -40, 20, 0],
                    scale: [1, 1.1, 0.9, 1]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-400/20 dark:bg-primary-500/10 blur-[120px]"
            />

            <motion.div
                animate={{
                    x: [0, -40, 30, 0],
                    y: [0, 50, -30, 0],
                    scale: [1, 0.9, 1.1, 1]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 blur-[120px]"
            />

            <motion.div
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, 20, -20, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-purple-400/10 dark:bg-purple-500/5 blur-[100px]"
            />
        </div>
    );
}
