import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopPosition, TabStopType, BorderStyle } from "docx";
import { saveAs } from "file-saver";

export const exportDocx = async (resumeData, userFirstName) => {
    if (!resumeData) {
        throw new Error("No resume data available for Word generation.");
    }

    const sections = [];

    // Helper: Left/Right split using Tab Stops
    const createSplitParagraph = (leftText, rightText, isBold = false, isItalic = false, size = 22) => {
        return new Paragraph({
            tabStops: [
                {
                    type: TabStopType.RIGHT,
                    position: TabStopPosition.MAX,
                },
            ],
            children: [
                new TextRun({ text: leftText, bold: isBold, italics: isItalic, size }),
                new TextRun({ text: `\t${rightText}`, bold: isBold, italics: isItalic, size }),
            ],
        });
    };

    // Helper: Section Headings
    const createHeading = (text) => {
        return new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_2,
            border: {
                bottom: {
                    color: "auto",
                    space: 1,
                    value: BorderStyle.SINGLE,
                    size: 6,
                },
            },
            spacing: { before: 200, after: 120 },
        });
    };

    // 1. Personal Details
    if (resumeData.personal_details) {
        const pd = resumeData.personal_details;
        sections.push(
            new Paragraph({
                text: `${pd.first_name || ''} ${pd.last_name || ''}`.trim() || 'Untitled Resume',
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
            })
        );

        const details = [pd.email, pd.phone, pd.location].filter(Boolean).join("  |  ");
        if (details) {
            sections.push(new Paragraph({ text: details, alignment: AlignmentType.CENTER, spacing: { after: 120 } }));
        }

        const links = [pd.linkedin_url, pd.portfolio_url, pd.github_url].filter(Boolean).join("  |  ");
        if (links) {
            sections.push(new Paragraph({
                children: [
                    new TextRun({ text: links, color: "0563C1" })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 }
            }));
        }

        if (pd.summary) {
            sections.push(createHeading("PROFESSIONAL SUMMARY"));
            sections.push(new Paragraph({ text: pd.summary, spacing: { after: 100 } }));
        }
    }

    // 2. Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
        sections.push(createHeading("EXPERIENCE"));

        resumeData.experience.forEach(exp => {
            const dates = `${exp.start_date || ''} - ${exp.is_current ? 'Present' : (exp.end_date || '')}`;
            sections.push(createSplitParagraph(`${exp.job_title || 'Position'}`, dates, true, false, 24));
            sections.push(createSplitParagraph(`${exp.company_name || 'Company'}`, `${exp.location || ''}`, false, true, 22));

            if (exp.experience_summary) {
                sections.push(new Paragraph({ text: exp.experience_summary, spacing: { before: 100 } }));
            }

            if (exp.responsibilities && exp.responsibilities.length > 0) {
                exp.responsibilities.forEach(bullet => {
                    if (bullet.trim()) {
                        sections.push(new Paragraph({ text: bullet, bullet: { level: 0 }, spacing: { before: 40 } }));
                    }
                });
            }
            sections.push(new Paragraph({ text: "", spacing: { after: 100 } }));
        });
    }

    // 3. Projects
    if (resumeData.projects && resumeData.projects.length > 0) {
        sections.push(createHeading("PROJECTS"));

        resumeData.projects.forEach(proj => {
            const dates = `${proj.start_date || ''} - ${proj.end_date || ''}`;
            const linkText = proj.project_link ? ` | ${proj.project_link}` : '';

            sections.push(
                new Paragraph({
                    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                    children: [
                        new TextRun({ text: proj.project_name || 'Project Name', bold: true, size: 24 }),
                        new TextRun({ text: linkText, size: 20, color: "0563C1", italics: true }),
                        new TextRun({ text: `\t${dates !== ' - ' ? dates : ''}`, bold: true, size: 22 })
                    ]
                })
            );

            if (proj.technologies_used) {
                const techString = Array.isArray(proj.technologies_used) ? proj.technologies_used.join(", ") : proj.technologies_used;
                if (techString.trim() !== '') {
                    sections.push(new Paragraph({ text: `Technologies: ${techString}`, italics: true, size: 20 }));
                }
            }

            if (proj.project_description) {
                sections.push(new Paragraph({ text: proj.project_description, spacing: { before: 60 } }));
            }
            sections.push(new Paragraph({ text: "", spacing: { after: 100 } })); // Spacer
        });
    }

    // 4. Education
    if (resumeData.education && resumeData.education.length > 0) {
        sections.push(createHeading("EDUCATION"));

        resumeData.education.forEach(edu => {
            const dates = `${edu.start_date || ''} - ${edu.is_current ? 'Present' : (edu.end_date || '')}`;
            sections.push(createSplitParagraph(`${edu.institution_name || 'Institution'}`, dates, true, false, 24));

            const fieldText = edu.field_of_study ? ` in ${edu.field_of_study}` : '';
            const gpaText = edu.gpa ? ` | GPA: ${edu.gpa}` : '';
            sections.push(createSplitParagraph(`${edu.degree || 'Degree'}${fieldText}${gpaText}`, `${edu.institution_location || ''}`, false, true, 22));

            if (edu.education_description) {
                sections.push(new Paragraph({ text: edu.education_description, spacing: { before: 60 } }));
            }
            sections.push(new Paragraph({ text: "", spacing: { after: 80 } }));
        });
    }

    // 5. Skills
    if (resumeData.skills) {
        sections.push(createHeading("SKILLS"));
        const skillsObj = resumeData.skills;

        Object.keys(skillsObj).forEach(cat => {
            if (skillsObj[cat] && skillsObj[cat].length > 0) {
                const title = cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: `${title}: `, bold: true, size: 22 }),
                            new TextRun({ text: skillsObj[cat].join(", "), size: 22 })
                        ],
                        spacing: { before: 60 }
                    })
                );
            }
        });
        sections.push(new Paragraph({ text: "", spacing: { after: 100 } }));
    }

    // 6. Achievements & Awards
    if (resumeData.achievements && resumeData.achievements.length > 0) {
        sections.push(createHeading("ACHIEVEMENTS"));

        resumeData.achievements.forEach(ach => {
            sections.push(createSplitParagraph(ach.achievement_title || 'Achievement Title', ach.achievement_date || '', true, false, 24));

            if (ach.achievement_description) {
                sections.push(new Paragraph({ text: ach.achievement_description, spacing: { before: 60 } }));
            }
            sections.push(new Paragraph({ text: "", spacing: { after: 80 } }));
        });
    }

    // 7. Custom Section
    if (resumeData.custom_section && resumeData.custom_section.items && resumeData.custom_section.items.length > 0) {
        sections.push(createHeading((resumeData.custom_section.title || "CUSTOM SECTION").toUpperCase()));

        resumeData.custom_section.items.forEach(item => {
            sections.push(createSplitParagraph(item.title || 'Title', item.date || '', true, false, 24));

            if (item.sub_title) {
                sections.push(new Paragraph({ text: item.sub_title, italics: true, size: 22 }));
            }

            if (item.description) {
                sections.push(new Paragraph({ text: item.description, spacing: { before: 60 } }));
            }
            sections.push(new Paragraph({ text: "", spacing: { after: 80 } }));
        });
    }

    const doc = new Document({
        styles: {
            default: {
                heading1: {
                    run: { font: "Calibri", size: 48, bold: true, color: "000000" },
                    paragraph: { spacing: { after: 120 } }
                },
                heading2: {
                    run: { font: "Calibri", size: 28, bold: true, color: "000000" },
                    paragraph: { spacing: { before: 240, after: 120 } }
                },
                document: {
                    run: { font: "Calibri", size: 22, color: "000000" },
                },
            },
        },
        sections: [{
            properties: {
                page: {
                    margin: { top: 720, right: 720, bottom: 720, left: 720 } // 0.5 inch margins
                }
            },
            children: sections
        }]
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
