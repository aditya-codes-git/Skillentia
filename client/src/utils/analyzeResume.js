import { GoogleGenAI } from '@google/genai';
import { supabase } from '../lib/supabase';

// ── Deterministic Analysis Engine ──────────────────────────────────────────

const WEAK_VERBS = [
    'helped', 'worked', 'did', 'made', 'got', 'was', 'had', 'used',
    'tried', 'handled', 'managed', 'responsible for', 'assisted',
    'participated', 'involved in', 'supported', 'contributed'
];

const STRONG_VERB_SUGGESTIONS = {
    'helped': 'facilitated', 'worked': 'engineered', 'did': 'executed',
    'made': 'developed', 'got': 'achieved', 'used': 'leveraged',
    'tried': 'pioneered', 'handled': 'orchestrated', 'managed': 'directed',
    'responsible for': 'spearheaded', 'assisted': 'collaborated',
    'participated': 'contributed', 'involved in': 'drove',
    'supported': 'enabled', 'contributed': 'delivered'
};

const REQUIRED_SECTIONS = ['summary', 'education', 'experience', 'skills', 'projects'];

function runDeterministicAnalysis(resumeText) {
    const text = resumeText.toLowerCase();
    const wordCount = resumeText.split(/\s+/).filter(w => w.length > 0).length;

    // 1. Section Completeness
    const sectionKeywords = {
        summary: ['summary', 'objective', 'profile', 'about'],
        education: ['education', 'university', 'college', 'degree', 'bachelor', 'master', 'gpa'],
        experience: ['experience', 'work', 'employment', 'position', 'role', 'company', 'intern'],
        skills: ['skills', 'technologies', 'tools', 'proficient', 'frameworks', 'languages'],
        projects: ['project', 'portfolio', 'built', 'developed', 'created']
    };

    const sectionPresence = {};
    const missingSections = [];
    for (const section of REQUIRED_SECTIONS) {
        const found = sectionKeywords[section].some(kw => text.includes(kw));
        sectionPresence[section] = found;
        if (!found) missingSections.push(section);
    }
    const completenessScore = Math.round((Object.values(sectionPresence).filter(Boolean).length / REQUIRED_SECTIONS.length) * 100);

    // 2. Resume Length
    let lengthAssessment = 'optimal';
    let lengthScore = 100;
    if (wordCount < 150) { lengthAssessment = 'too_short'; lengthScore = 40; }
    else if (wordCount < 300) { lengthAssessment = 'short'; lengthScore = 70; }
    else if (wordCount > 1200) { lengthAssessment = 'too_long'; lengthScore = 60; }
    else if (wordCount > 800) { lengthAssessment = 'long'; lengthScore = 80; }

    // 3. Bullet / Action Verb Quality
    const weakVerbsFound = [];
    for (const verb of WEAK_VERBS) {
        if (text.includes(verb)) {
            weakVerbsFound.push({
                original: verb,
                suggested: STRONG_VERB_SUGGESTIONS[verb] || 'use a stronger action verb'
            });
        }
    }
    const bulletScore = Math.max(0, 100 - (weakVerbsFound.length * 12));

    // 4. Metrics Detection
    const metricPatterns = [/\d+%/g, /\$[\d,]+/g, /\d+\+/g, /\d+x/gi, /\b\d{2,}\b/g];
    let metricsCount = 0;
    for (const pattern of metricPatterns) {
        const matches = resumeText.match(pattern);
        if (matches) metricsCount += matches.length;
    }
    const metricsScore = Math.min(100, metricsCount * 15);

    // 5. Skill Extraction
    const techSkillPatterns = [
        'javascript', 'typescript', 'python', 'java', 'c\\+\\+', 'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin',
        'react', 'angular', 'vue', 'next\\.js', 'node\\.js', 'express', 'django', 'flask', 'spring',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform',
        'sql', 'postgresql', 'mongodb', 'redis', 'mysql', 'firebase', 'supabase',
        'git', 'linux', 'ci/cd', 'rest api', 'graphql', 'html', 'css', 'tailwind',
        'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'data science',
        'figma', 'agile', 'scrum', 'jira'
    ];
    const extractedSkills = [];
    for (const skill of techSkillPatterns) {
        const regex = new RegExp(`\\b${skill}\\b`, 'gi');
        if (regex.test(resumeText)) {
            extractedSkills.push(skill.replace(/\\\./g, '.').replace(/\\\+/g, '+'));
        }
    }

    // Aggregate deterministic score
    const deterministicScore = Math.round(
        (completenessScore * 0.30) +
        (lengthScore * 0.15) +
        (bulletScore * 0.25) +
        (metricsScore * 0.15) +
        (Math.min(100, extractedSkills.length * 10) * 0.15)
    );

    return {
        deterministic_score: deterministicScore,
        section_completeness: { score: completenessScore, sections: sectionPresence, missing: missingSections },
        length_analysis: { word_count: wordCount, assessment: lengthAssessment, score: lengthScore },
        bullet_quality: { weak_verbs: weakVerbsFound, score: bulletScore },
        metrics_detection: { count: metricsCount, score: metricsScore },
        extracted_skills: extractedSkills
    };
}

// ── Content Hash ───────────────────────────────────────────────────────────

async function hashContent(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Post-Processing ────────────────────────────────────────────────────────

function postProcessAIResponse(aiResult, deterministicResult) {
    const defaults = {
        overall_score: deterministicResult.deterministic_score,
        summary: '',
        strengths: [],
        weaknesses: [],
        skill_gap_analysis: {
            matched_skills: [], partially_matched_skills: [],
            missing_required_skills: [], missing_preferred_skills: [],
            critical_missing_skills: [],
            recommended_learning_skills: []
        },
        ats_analysis: {
            ats_score: 0, keyword_density: [], missing_keywords: [],
            weak_action_verbs: deterministicResult.bullet_quality.weak_verbs,
            formatting_risk_level: 'low', formatting_issues: []
        },
        rewrite_suggestions: [],
        recommendations_summary: ''
    };

    const result = { ...defaults, ...aiResult };

    // Blend deterministic score with AI score (40% deterministic, 60% AI)
    if (aiResult?.overall_score) {
        result.overall_score = Math.round(
            (deterministicResult.deterministic_score * 0.4) +
            (aiResult.overall_score * 0.6)
        );
    }

    // Inject deterministic findings
    if (deterministicResult.section_completeness.missing.length > 0) {
        result.weaknesses.unshift({
            title: 'Missing Resume Sections',
            description: `Your resume is missing: ${deterministicResult.section_completeness.missing.join(', ')}. Adding these sections can significantly improve your ATS score.`,
            impact_level: 'high'
        });
    }

    if (deterministicResult.metrics_detection.count === 0) {
        result.weaknesses.push({
            title: 'No Quantifiable Metrics',
            description: 'Your resume lacks measurable impact statements (percentages, numbers). Recruiters strongly prefer quantified achievements.',
            impact_level: 'high'
        });
    }

    result.categorized_suggestions = {
        critical: result.weaknesses?.filter(w => w.impact_level === 'high') || [],
        important: result.weaknesses?.filter(w => w.impact_level === 'medium') || [],
        optional: result.weaknesses?.filter(w => w.impact_level === 'low') || []
    };

    result.deterministic_analysis = deterministicResult;
    return result;
}

// ── Main Analyze Function ──────────────────────────────────────────────────

export async function analyzeResumeClient(resumeText, jobDescription = null) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error('VITE_GEMINI_API_KEY is not set in your .env file.');

    // Step 1: Run deterministic analysis
    const deterministicResult = runDeterministicAnalysis(resumeText);

    // Step 2: Build Gemini prompt
    const prompt = `
You are an expert ATS optimizer and career coach operating inside a deterministic SaaS system.
Analyze the resume text below. A deterministic pre-scan has already been run with these findings:

DETERMINISTIC PRE-SCAN RESULTS:
- Section completeness: ${JSON.stringify(deterministicResult.section_completeness)}
- Length: ${deterministicResult.length_analysis.word_count} words (${deterministicResult.length_analysis.assessment})
- Weak action verbs found: ${deterministicResult.bullet_quality.weak_verbs.map(v => v.original).join(', ') || 'none'}
- Quantifiable metrics found: ${deterministicResult.metrics_detection.count}
- Skills extracted: ${deterministicResult.extracted_skills.join(', ') || 'none'}

YOUR TASK: Provide deeper analysis that COMPLEMENTS the deterministic findings above. Focus on:
1. Content quality and relevance
2. Career progression storytelling
3. Industry-specific optimization
4. ATS keyword optimization
5. Concrete rewrite suggestions for weak bullet points

${jobDescription ? `TARGET JOB DESCRIPTION:\n${jobDescription}\n\nAnalyze skill alignment against this specific role.` : 'No specific job description provided. Give general optimization advice.'}

RETURN ONLY VALID JSON FOLLOWING THIS EXACT SCHEMA. No markdown, no explanations.
{
  "overall_score": <number 0-100>,
  "summary": "<2-3 sentence analysis summary>",
  "strengths": [{ "title": "", "description": "" }],
  "weaknesses": [{ "title": "", "description": "", "impact_level": "low | medium | high" }],
  "skill_gap_analysis": {
    "matched_skills": [],
    "partially_matched_skills": [],
    "missing_required_skills": [],
    "missing_preferred_skills": [],
    "critical_missing_skills": [],
    "recommended_learning_skills": [{ "skill": "", "reason": "", "priority": "low | medium | high" }]
  },
  "ats_analysis": {
    "ats_score": <number 0-100>,
    "keyword_density": [{ "keyword": "", "count": <number>, "expected_minimum": <number> }],
    "missing_keywords": [],
    "weak_action_verbs": [{ "original": "", "suggested_replacement": "" }],
    "formatting_risk_level": "low | medium | high",
    "formatting_issues": []
  },
  "rewrite_suggestions": [{ "original_text": "", "improved_text": "", "reason": "" }],
  "recommendations_summary": ""
}

RESUME TEXT:
${resumeText}
`;

    // Step 3: Call Gemini via @google/genai
    const genai = new GoogleGenAI({ apiKey });

    const response = await genai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.1,
            responseMimeType: 'application/json'
        }
    });

    const aiText = response.text;
    let aiResult;
    try {
        aiResult = JSON.parse(aiText);
    } catch {
        throw new Error('AI returned invalid JSON. Please try again.');
    }

    // Step 4: Post-process
    const finalResult = postProcessAIResponse(aiResult, deterministicResult);

    // Step 5: Store in DB
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const contentHash = await hashContent(resumeText);
            const { data: inserted } = await supabase
                .from('analysis_results')
                .insert({
                    user_id: session.user.id,
                    overall_score: finalResult.overall_score,
                    result_data: finalResult,
                    job_description: jobDescription || null,
                    resume_text: resumeText,
                })
                .select('id')
                .single();

            if (inserted) {
                finalResult.analysis_id = inserted.id;
            }
        }
    } catch (dbErr) {
        console.warn('Could not save to DB, returning result anyway:', dbErr);
    }

    return finalResult;
}
