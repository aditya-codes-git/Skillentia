import { useResumeStore } from '../../store/useResumeStore';

export default function BasicPreview() {
    const resume = useResumeStore();
    const { personal_details, education, experience, skills } = resume;

    return (
        <div className="w-full h-full bg-white text-black p-12 text-sm leading-relaxed overflow-hidden shadow-2xl font-sans">

            {/* Header */}
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
                    {personal_details.portfolio_url && (
                        <>
                            <span>•</span>
                            <a href={personal_details.portfolio_url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400">Portfolio</a>
                        </>
                    )}
                </div>
            </div>

            {/* Summary */}
            {personal_details.summary && (
                <div className="mb-6">
                    <p className="text-sm text-slate-700">{personal_details.summary}</p>
                </div>
            )}

            <hr className="border-slate-300 my-4" />

            {/* Experience */}
            {experience.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase text-slate-800 border-b border-slate-800 pb-1 mb-3 tracking-widest">Experience</h2>
                    <div className="space-y-4">
                        {experience.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between font-bold text-slate-800">
                                    <span>{exp.position || 'Position'}</span>
                                    <span>
                                        {exp.start_date || 'Start'} – {exp.current ? 'Present' : (exp.end_date || 'End')}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-600 italic text-xs mb-2">
                                    <span>{exp.company || 'Company'}</span>
                                    <span>{exp.location || 'Location'}</span>
                                </div>
                                {exp.description && (
                                    <p className="whitespace-pre-wrap text-slate-700 text-xs">
                                        {exp.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {education.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase text-slate-800 border-b border-slate-800 pb-1 mb-3 tracking-widest">Education</h2>
                    <div className="space-y-4">
                        {education.map(edu => (
                            <div key={edu.id}>
                                <div className="flex justify-between font-bold text-slate-800">
                                    <span>{edu.institution || 'University'}</span>
                                    <span>
                                        {edu.start_date || 'Start'} – {edu.current ? 'Present' : (edu.end_date || 'End')}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-600 italic text-xs mb-1">
                                    <span>{edu.degree} {edu.field_of_study ? `in ${edu.field_of_study}` : ''}</span>
                                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                                </div>
                                {edu.description && (
                                    <p className="text-slate-700 text-xs mt-1">{edu.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills Matrix */}
            {(skills.technical_skills?.length > 0 || skills.frameworks?.length > 0 || skills.languages?.length > 0 || skills.tools?.length > 0 || skills.soft_skills?.length > 0) && (
                <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase text-slate-800 border-b border-slate-800 pb-1 mb-3 tracking-widest">Skills</h2>
                    <div className="text-xs space-y-1">
                        {skills.technical_skills?.length > 0 && (
                            <p><span className="font-bold">Core:</span> {skills.technical_skills.join(', ')}</p>
                        )}
                        {skills.languages?.length > 0 && (
                            <p><span className="font-bold">Languages:</span> {skills.languages.join(', ')}</p>
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
            )}

        </div>
    );
}
