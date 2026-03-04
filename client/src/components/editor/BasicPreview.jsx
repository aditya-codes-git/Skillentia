import { memo } from 'react';
import { useResumeStore } from '../../store/useResumeStore';

const HeaderPreview = memo(function HeaderPreview() {
    const personal_details = useResumeStore(state => state.personal_details);
    return (
        <div className="text-center mb-6">
            <h1 className="text-3xl font-bold uppercase tracking-widest text-slate-800">
                {personal_details.first_name || 'First Name'} {personal_details.last_name || 'Last Name'}
            </h1>
            <div className="text-slate-600 mt-2 text-xs flex justify-center gap-3 flex-wrap">
                <span>{personal_details.email || 'email@example.com'}</span>
                <span>•</span>
                <span>{personal_details.phone || '(555) 000-0000'}</span>
                {personal_details.location && (
                    <>
                        <span>•</span>
                        <span>{personal_details.location}</span>
                    </>
                )}
                {personal_details.linkedin_url && (
                    <>
                        <span>•</span>
                        <a href={personal_details.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400">LinkedIn</a>
                    </>
                )}
                {personal_details.github_url && (
                    <>
                        <span>•</span>
                        <a href={personal_details.github_url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400">GitHub</a>
                    </>
                )}
                {personal_details.portfolio_url && (
                    <>
                        <span>•</span>
                        <a href={personal_details.portfolio_url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400">Portfolio</a>
                    </>
                )}
            </div>
        </div>
    );
});

const SummaryPreview = memo(function SummaryPreview() {
    const personal_details = useResumeStore(state => state.personal_details);
    if (!personal_details.summary) return null;
    return (
        <div className="mb-6">
            <p className="text-sm text-slate-700">{personal_details.summary}</p>
        </div>
    );
});

const ExperiencePreview = memo(function ExperiencePreview() {
    const experience = useResumeStore(state => state.experience);
    if (experience.length === 0) return null;
    return (
        <div className="mb-6">
            <h2 className="text-sm font-bold uppercase text-slate-800 border-b border-slate-800 pb-1 mb-3 tracking-widest">Experience</h2>
            <div className="space-y-4">
                {experience.map(exp => (
                    <div key={exp.id}>
                        <div className="flex justify-between font-bold text-slate-800">
                            <span>{exp.job_title || 'Job Title'}</span>
                            <span>
                                {exp.start_date || 'Start'} – {exp.is_current ? 'Present' : (exp.end_date || 'End')}
                            </span>
                        </div>
                        <div className="flex justify-between text-slate-600 italic text-xs mb-2">
                            <span>{exp.company_name || 'Company Name'}</span>
                            <span>{exp.location || 'Location'}</span>
                        </div>
                        {exp.experience_summary && (
                            <p className="whitespace-pre-wrap text-slate-700 text-xs">
                                {exp.experience_summary}
                            </p>
                        )}
                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                            <ul className="list-disc list-inside text-slate-700 text-xs mt-1 space-y-1">
                                {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});

const EducationPreview = memo(function EducationPreview() {
    const education = useResumeStore(state => state.education);
    if (education.length === 0) return null;
    return (
        <div className="mb-6">
            <h2 className="text-sm font-bold uppercase text-slate-800 border-b border-slate-800 pb-1 mb-3 tracking-widest">Education</h2>
            <div className="space-y-4">
                {education.map(edu => (
                    <div key={edu.id}>
                        <div className="flex justify-between font-bold text-slate-800">
                            <span>{edu.institution_name || 'Institution Name'}</span>
                            <span>
                                {edu.start_date || 'Start'} – {edu.is_current ? 'Present' : (edu.end_date || 'End')}
                            </span>
                        </div>
                        <div className="flex justify-between text-slate-600 italic text-xs mb-1">
                            <span>{edu.degree} {edu.field_of_study ? `in ${edu.field_of_study}` : ''}</span>
                            {edu.gpa && <span>GPA: {edu.gpa}</span>}
                        </div>
                        {edu.education_description && (
                            <p className="text-slate-700 text-xs mt-1">{edu.education_description}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});

const SkillsPreview = memo(function SkillsPreview() {
    const skills = useResumeStore(state => state.skills);
    if (!(skills.technical_skills?.length > 0 || skills.frameworks?.length > 0 || skills.languages?.length > 0 || skills.tools?.length > 0 || skills.soft_skills?.length > 0)) {
        return null;
    }
    return (
        <div className="mb-6">
            <h2 className="text-sm font-bold uppercase text-slate-800 border-b border-slate-800 pb-1 mb-3 tracking-widest">Skills</h2>
            <div className="text-xs space-y-1">
                {skills.technical_skills?.length > 0 && (
                    <p><span className="font-bold">Core:</span> {skills.technical_skills.join(', ')}</p>
                )}
                {skills.programming_languages?.length > 0 && (
                    <p><span className="font-bold">Languages:</span> {skills.programming_languages.join(', ')}</p>
                )}
                {skills.frameworks?.length > 0 && (
                    <p><span className="font-bold">Frameworks:</span> {skills.frameworks.join(', ')}</p>
                )}
                {skills.tools?.length > 0 && (
                    <p><span className="font-bold">Tools:</span> {skills.tools.join(', ')}</p>
                )}
                {skills.soft_skills?.length > 0 && (
                    <p><span className="font-bold">Soft Skills:</span> {skills.soft_skills.join(', ')}</p>
                )}
            </div>
        </div>
    );
});

const ProjectsPreview = memo(function ProjectsPreview() {
    const projects = useResumeStore(state => state.projects);
    if (!projects || projects.length === 0) return null;
    return (
        <div className="mb-6">
            <h2 className="text-sm font-bold uppercase text-slate-800 border-b border-slate-800 pb-1 mb-3 tracking-widest">Projects</h2>
            <div className="space-y-4">
                {projects.map(proj => (
                    <div key={proj.id}>
                        <div className="flex justify-between font-bold text-slate-800">
                            <span>
                                {proj.project_name || 'Project Name'}
                                {proj.project_link && <a href={proj.project_link} target="_blank" rel="noreferrer" className="ml-2 text-blue-600 font-normal italic text-xs">[Link]</a>}
                            </span>
                            <span>{proj.start_date || 'Start'} – {proj.end_date || 'End'}</span>
                        </div>
                        {proj.technologies_used && proj.technologies_used.length > 0 && (
                            <div className="text-xs text-slate-600 italic">Core Tech: {proj.technologies_used.join(', ')}</div>
                        )}
                        {proj.project_description && (
                            <p className="whitespace-pre-wrap text-slate-700 text-xs mt-1">
                                {proj.project_description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});

const AchievementsPreview = memo(function AchievementsPreview() {
    const achievements = useResumeStore(state => state.achievements);
    if (!achievements || achievements.length === 0) return null;
    return (
        <div className="mb-6">
            <h2 className="text-sm font-bold uppercase text-slate-800 border-b border-slate-800 pb-1 mb-3 tracking-widest">Achievements & Awards</h2>
            <div className="space-y-3">
                {achievements.map(ach => (
                    <div key={ach.id}>
                        <div className="flex justify-between font-bold text-slate-800 text-sm">
                            <span>{ach.achievement_title || 'Award Title'}</span>
                            <span>{ach.achievement_date || 'Date'}</span>
                        </div>
                        {ach.achievement_description && (
                            <p className="text-slate-700 text-xs mt-0.5">{ach.achievement_description}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});

const CustomSectionPreview = memo(function CustomSectionPreview() {
    const custom_section = useResumeStore(state => state.custom_section);
    if (!custom_section || !custom_section.items || custom_section.items.length === 0) return null;
    return (
        <div className="mb-6">
            <h2 className="text-sm font-bold uppercase text-slate-800 border-b border-slate-800 pb-1 mb-3 tracking-widest">{custom_section.section_title || 'Custom Section'}</h2>
            <div className="space-y-4">
                {custom_section.items.map(item => (
                    <div key={item.id}>
                        <div className="flex justify-between font-bold text-slate-800">
                            <span>{item.title || 'Title'}</span>
                            <span>{item.date_range}</span>
                        </div>
                        {item.subtitle && (
                            <div className="text-slate-600 italic text-xs mb-1">{item.subtitle}</div>
                        )}
                        {item.description && (
                            <p className="whitespace-pre-wrap text-slate-700 text-xs mt-1">
                                {item.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});

const BasicPreview = memo(function BasicPreview() {
    return (
        <div className="w-full h-full bg-white text-black p-12 text-sm leading-relaxed overflow-hidden shadow-2xl font-sans">
            <HeaderPreview />
            <SummaryPreview />
            <hr className="border-slate-300 my-4" />
            <ExperiencePreview />
            <EducationPreview />
            <ProjectsPreview />
            <SkillsPreview />
            <AchievementsPreview />
            <CustomSectionPreview />
        </div>
    );
});

export default BasicPreview;
