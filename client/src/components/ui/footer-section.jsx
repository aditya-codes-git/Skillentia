import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImgLight from '../../assets/skillentia_logo.png';
import logoImgDark from '../../assets/skillentia_logo_dark.png';

const footerLinks = [
    {
        label: 'Product',
        links: [
            { title: 'Resume Builder', href: '/resumes/new' },
            { title: 'AI Optimizer', href: '/analyze' },
            { title: 'ATS Insights', href: '/' },
            { title: 'Integrations', href: '/' },
        ],
    },
    {
        label: 'Resources',
        links: [
            { title: 'Best Practices', href: '/' },
            { title: 'Resume Templates', href: '/' },
            { title: 'Blog', href: '/' },
            { title: 'FAQ', href: '/' },
        ],
    },
    {
        label: 'Company',
        links: [
            { title: 'About Skillentia', href: '/' },
            { title: 'Privacy Policy', href: '/' },
            { title: 'Terms of Service', href: '/' },
            { title: 'Contact Support', href: '/' },
        ],
    },
    {
        label: 'Social',
        links: [
            { title: 'Twitter', href: '#', icon: Twitter },
            { title: 'GitHub', href: '#', icon: Github },
            { title: 'LinkedIn', href: '#', icon: Linkedin },
            { title: 'Email', href: 'mailto:hello@skillentia.test', icon: Mail },
        ],
    },
];

export function Footer() {
    return (
        <footer className="relative w-screen left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] border-t border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950 px-6 py-12 lg:py-16 mt-32 z-10 -mb-1">
            {/* Aesthetic radial gradient background matching Skillentia Stats Section */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent rounded-full blur-[2px]" />
                <div className="absolute top-0 right-1/2 left-1/2 h-[200px] w-full max-w-[800px] -translate-x-1/2 -translate-y-1/2 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[80px]" />
            </div>

            <div className="grid w-full gap-12 max-w-7xl mx-auto xl:grid-cols-4 xl:gap-8 relative z-10 pt-8">
                <AnimatedContainer className="space-y-6 xl:col-span-1">
                    <div className="flex items-center gap-3">
                        <img src={logoImgLight} alt="Skillentia" className="h-8 w-auto dark:hidden" />
                        <img src={logoImgDark} alt="Skillentia" className="h-8 w-auto hidden dark:block" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                        Deterministic AI resume generation.
                        Build, optimize, and dominate the applicant tracking system.
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs pt-4">
                        © {new Date().getFullYear()} Skillentia. All rights reserved.
                    </p>
                </AnimatedContainer>

                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-3">
                    {footerLinks.map((section, index) => (
                        <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
                            <div className="mb-10 md:mb-0">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase mb-5">
                                    {section.label}
                                </h3>
                                <ul className="text-slate-500 dark:text-slate-400 space-y-3 text-sm">
                                    {section.links.map((link) => (
                                        <li key={link.title}>
                                            {link.href.startsWith('/') && link.href !== '#' ? (
                                                <Link
                                                    to={link.href}
                                                    className="hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center transition-colors duration-300 group"
                                                >
                                                    {link.icon && <link.icon className="me-2 w-4 h-4 transition-transform group-hover:-translate-y-0.5" />}
                                                    {link.title}
                                                </Link>
                                            ) : (
                                                <a
                                                    href={link.href}
                                                    className="hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center transition-colors duration-300 group"
                                                >
                                                    {link.icon && <link.icon className="me-2 w-4 h-4 transition-transform group-hover:-translate-y-0.5" />}
                                                    {link.title}
                                                </a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </AnimatedContainer>
                    ))}
                </div>
            </div>
        </footer>
    );
}

function AnimatedContainer({ className, delay = 0.1, children }) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
            whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
