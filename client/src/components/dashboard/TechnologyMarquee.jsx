import { motion } from 'framer-motion';
import { InfiniteSlider } from '../ui/infinite-slider';

const technologies = [
    { name: 'React', icon: () => <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" alt="React" className="w-8 h-8 md:w-10 md:h-10" /> },
    { name: 'Supabase', icon: () => <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" alt="Supabase" className="w-8 h-8 md:w-10 md:h-10" /> },
    { name: 'PostgreSQL', icon: () => <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" className="w-8 h-8 md:w-10 md:h-10" /> },
    { name: 'Tailwind CSS', icon: () => <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" className="w-8 h-8 md:w-10 md:h-10" /> },
    { name: 'Node.js', icon: () => <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" alt="Node.js" className="w-8 h-8 md:w-10 md:h-10" /> },
    { name: 'Vercel', icon: () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 md:w-9 md:h-9 fill-slate-900 dark:fill-white"><title>Vercel</title><path d="M24 22.525H0l12-21.05 12 21.05z" /></svg> },
    { name: 'Framer Motion', icon: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 21" role="presentation" className="w-6 h-6 md:w-8 md:h-8 fill-slate-900 dark:fill-white"><path d="M3.79155 13.9113L7.14201 20.25H0V13.9113H3.79155ZM14.284 6.9427L10.5186 10.4283L14.284 13.9139H7.14201V6.9427H14.284ZM7.14201 6.9427V-2.86102e-06H0V6.9427H7.14201Z"></path></svg> },
    { name: 'GitHub', icon: () => <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GitHub" className="w-8 h-8 md:w-10 md:h-10 dark:invert" /> },
    { name: 'TypeScript', icon: () => <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" alt="TypeScript" className="w-8 h-8 md:w-10 md:h-10 rounded-sm" /> },
];

export default function TechnologyMarquee() {
    return (
        <section className="py-16 md:py-24 relative w-screen left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-16 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4"
                >
                    Powered by Modern Technologies
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
                >
                    The cutting-edge stack that drives our high-performance infrastructure.
                </motion.p>
            </div>

            <div
                className="relative w-full overflow-hidden flex items-center"
                style={{
                    maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                }}
            >
                <InfiniteSlider gap={80} duration={40} durationOnHover={80} className="py-4">
                    {technologies.map((tech, i) => {
                        const IconComponent = tech.icon;
                        return (
                            <div
                                key={i}
                                className="flex items-center justify-center gap-4 px-4 py-2 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500 cursor-default"
                            >
                                <div className="flex-shrink-0 flex items-center justify-center">
                                    <IconComponent />
                                </div>
                                <span className="font-display font-semibold text-2xl md:text-3xl tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap">
                                    {tech.name}
                                </span>
                            </div>
                        );
                    })}
                </InfiniteSlider>
            </div>
        </section>
    );
}
