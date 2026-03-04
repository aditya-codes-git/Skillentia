import { create } from 'zustand';

// Initial state matching the Resume Input Schema from gemini.md
const initialResumeState = {
    personal_details: {
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        location: '',
        linkedin_url: '',
        github_url: '',
        portfolio_url: '',
        summary: ''
    },
    education: [], // { id, institution_name, institution_location, degree, field_of_study, start_date, end_date, is_current, gpa, education_description }
    experience: [], // { id, company_name, job_title, location, start_date, end_date, is_current, experience_summary, responsibilities }
    projects: [], // { id, project_name, project_description, project_link, technologies_used (Array), start_date, end_date }
    skills: {
        technical_skills: [],
        tools: [],
        frameworks: [],
        programming_languages: [],
        soft_skills: []
    },
    achievements: [], // { id, achievement_title, achievement_description, achievement_date }
    custom_section: {
        title: 'Custom Section',
        items: [] // { id, title, sub_title, date, description }
    },
    certifications: []
};

export const useResumeStore = create((set, get) => ({
    ...initialResumeState,

    // Load an entire resume payload (useful for fetching from DB)
    setFullResume: (payload) => set((state) => ({ ...state, ...payload })),

    // Personal Details
    updatePersonalDetails: (details) =>
        set((state) => ({
            personal_details: { ...state.personal_details, ...details }
        })),

    // Array Handlers (Generic)
    addItem: (section, item) =>
        set((state) => ({
            [section]: [...state[section], item]
        })),

    updateItem: (section, id, updatedItem) =>
        set((state) => ({
            [section]: state[section].map((item) =>
                item.id === id ? { ...item, ...updatedItem } : item
            )
        })),

    removeItem: (section, id) =>
        set((state) => ({
            [section]: state[section].filter((item) => item.id !== id)
        })),

    // Specific Actions for Convenience
    addEducation: (item) => get().addItem('education', item),
    updateEducation: (id, item) => get().updateItem('education', id, item),
    removeEducation: (id) => get().removeItem('education', id),

    addExperience: (item) => get().addItem('experience', item),
    updateExperience: (id, item) => get().updateItem('experience', id, item),
    removeExperience: (id) => get().removeItem('experience', id),

    addProject: (item) => get().addItem('projects', item),
    updateProject: (id, item) => get().updateItem('projects', id, item),
    removeProject: (id) => get().removeItem('projects', id),

    addAchievement: (item) => get().addItem('achievements', item),
    updateAchievement: (id, item) => get().updateItem('achievements', id, item),
    removeAchievement: (id) => get().removeItem('achievements', id),

    addCertification: (item) => get().addItem('certifications', item),
    updateCertification: (id, item) => get().updateItem('certifications', id, item),
    removeCertification: (id) => get().removeItem('certifications', id),

    // Skills handlers
    updateSkills: (category, skillsArray) =>
        set((state) => ({
            skills: {
                ...state.skills,
                [category]: skillsArray
            }
        })),

    // Reset
    resetResume: () => set(initialResumeState),
}));
