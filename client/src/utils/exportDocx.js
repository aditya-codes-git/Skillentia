import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

export const exportDocx = async (resumeData, userFirstName) => {
    if (!resumeData) {
        throw new Error("No resume data available for Word generation.");
    }

    const sections = [];

    // 1. Personal Details
    if (resumeData.personal_details) {
        const pd = resumeData.personal_details;
        sections.push(
            new Paragraph({
                text: `${pd.first_name || ''} ${pd.last_name || ''}`.trim() || 'Untitled Resume',
                heading: HeadingLevel.TITLE,
            })
        );

        const details = [pd.email, pd.phone, pd.location].filter(Boolean).join(" | ");
        if (details) {
            sections.push(new Paragraph(details));
        }

        const links = [pd.linkedin_url, pd.portfolio_url].filter(Boolean).join(" | ");
        if (links) {
            sections.push(new Paragraph(links));
            sections.push(new Paragraph("")); // Spacer
        }

        if (pd.summary) {
            sections.push(new Paragraph({ text: "Professional Summary", heading: HeadingLevel.HEADING_2 }));
            sections.push(new Paragraph(pd.summary));
            sections.push(new Paragraph("")); // Spacer
        }
    }

    // 2. Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
        sections.push(new Paragraph({ text: "Experience", heading: HeadingLevel.HEADING_2 }));

        resumeData.experience.forEach(exp => {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: exp.position || 'Position', bold: true }),
                        new TextRun(` at ${exp.company || 'Company'}`),
                    ]
                })
            );

            const dates = `${exp.start_date || ''} - ${exp.current ? 'Present' : (exp.end_date || '')}`;
            sections.push(new Paragraph({ text: `${dates} | ${exp.location || ''}`, italics: true }));

            if (exp.description) {
                sections.push(new Paragraph(exp.description));
            }

            if (exp.bullets && exp.bullets.length > 0) {
                exp.bullets.forEach(bullet => {
                    if (bullet.trim()) {
                        sections.push(new Paragraph({ text: bullet, bullet: { level: 0 } }));
                    }
                });
            }
            sections.push(new Paragraph("")); // Spacer
        });
    }

    // 3. Education
    if (resumeData.education && resumeData.education.length > 0) {
        sections.push(new Paragraph({ text: "Education", heading: HeadingLevel.HEADING_2 }));

        resumeData.education.forEach(edu => {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: edu.degree || 'Degree', bold: true }),
                        new TextRun(` in ${edu.field_of_study || 'Field'} from ${edu.institution || 'Institution'}`),
                    ]
                })
            );
            const dates = `${edu.start_date || ''} - ${edu.current ? 'Present' : (edu.end_date || '')}`;
            sections.push(new Paragraph({ text: dates, italics: true }));
            sections.push(new Paragraph("")); // Spacer
        });
    }

    // 4. Skills
    if (resumeData.skills) {
        sections.push(new Paragraph({ text: "Skills", heading: HeadingLevel.HEADING_2 }));
        const skillsObj = resumeData.skills;

        Object.keys(skillsObj).forEach(cat => {
            if (skillsObj[cat] && skillsObj[cat].length > 0) {
                const title = cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: `${title}: `, bold: true }),
                            new TextRun(skillsObj[cat].join(", "))
                        ]
                    })
                );
            }
        });
        sections.push(new Paragraph("")); // Spacer
    }

    // 5. Projects
    if (resumeData.projects && resumeData.projects.length > 0) {
        sections.push(new Paragraph({ text: "Projects", heading: HeadingLevel.HEADING_2 }));

        resumeData.projects.forEach(proj => {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: proj.name || 'Project Name', bold: true }),
                        proj.url ? new TextRun(` | ${proj.url}`) : new TextRun("")
                    ]
                })
            );

            if (proj.description) {
                sections.push(new Paragraph(proj.description));
            }

            if (proj.technologies) {
                const techString = Array.isArray(proj.technologies) ? proj.technologies.join(", ") : proj.technologies;
                if (techString.trim() !== '') {
                    sections.push(new Paragraph({ text: `Technologies: ${techString}`, italics: true }));
                }
            }
            sections.push(new Paragraph("")); // Spacer
        });
    }

    // 6. Achievements & Awards
    if (resumeData.achievements && resumeData.achievements.length > 0) {
        sections.push(new Paragraph({ text: "Achievements & Awards", heading: HeadingLevel.HEADING_2 }));

        resumeData.achievements.forEach(ach => {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: ach.title || 'Achievement Title', bold: true }),
                        ach.year ? new TextRun(` | ${ach.year}`) : new TextRun("")
                    ]
                })
            );

            if (ach.description) {
                sections.push(new Paragraph(ach.description));
            }
            sections.push(new Paragraph("")); // Spacer
        });
    }

    const doc = new Document({
        sections: [{ properties: {}, children: sections }]
    });

    try {
        const blob = await Packer.toBlob(doc);
        const safeName = (userFirstName || 'User').replace(/\s+/g, '').toLowerCase();
        const fileName = `${safeName}_resume.docx`;
        saveAs(blob, fileName);
        return fileName;
    } catch (error) {
        console.error("DOCX generation failed:", error);
        throw new Error("Failed to generate DOCX.");
    }
};
