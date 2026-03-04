import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── Deterministic Analysis Engine ──────────────────────────────────────────

const WEAK_VERBS = [
    'helped', 'worked', 'did', 'made', 'got', 'was', 'had', 'used',
    'tried', 'handled', 'managed', 'responsible for', 'assisted',
    'participated', 'involved in', 'supported', 'contributed'
]

const STRONG_VERB_SUGGESTIONS: Record<string, string> = {
    'helped': 'facilitated', 'worked': 'engineered', 'did': 'executed',
    'made': 'developed', 'got': 'achieved', 'used': 'leveraged',
    'tried': 'pioneered', 'handled': 'orchestrated', 'managed': 'directed',
    'responsible for': 'spearheaded', 'assisted': 'collaborated',
    'participated': 'contributed', 'involved in': 'drove',
    'supported': 'enabled', 'contributed': 'delivered'
}

const REQUIRED_SECTIONS = ['summary', 'education', 'experience', 'skills', 'projects']

function runDeterministicAnalysis(resumeText: string) {
    const text = resumeText.toLowerCase()
    const lines = resumeText.split('\n').filter(l => l.trim().length > 0)
    const wordCount = resumeText.split(/\s+/).filter(w => w.length > 0).length

    // 1. Section Completeness
    const sectionKeywords: Record<string, string[]> = {
        summary: ['summary', 'objective', 'profile', 'about'],
        education: ['education', 'university', 'college', 'degree', 'bachelor', 'master', 'gpa'],
        experience: ['experience', 'work', 'employment', 'position', 'role', 'company', 'intern'],
        skills: ['skills', 'technologies', 'tools', 'proficient', 'frameworks', 'languages'],
        projects: ['project', 'portfolio', 'built', 'developed', 'created']
    }

    const sectionPresence: Record<string, boolean> = {}
    const missingSections: string[] = []
    for (const section of REQUIRED_SECTIONS) {
        const found = sectionKeywords[section].some(kw => text.includes(kw))
        sectionPresence[section] = found
        if (!found) missingSections.push(section)
    }
    const completenessScore = Math.round((Object.values(sectionPresence).filter(Boolean).length / REQUIRED_SECTIONS.length) * 100)

    // 2. Resume Length
    let lengthAssessment = 'optimal'
    let lengthScore = 100
    if (wordCount < 150) { lengthAssessment = 'too_short'; lengthScore = 40 }
    else if (wordCount < 300) { lengthAssessment = 'short'; lengthScore = 70 }
    else if (wordCount > 1200) { lengthAssessment = 'too_long'; lengthScore = 60 }
    else if (wordCount > 800) { lengthAssessment = 'long'; lengthScore = 80 }

    // 3. Bullet / Action Verb Quality
    const weakVerbsFound: { original: string; suggested: string }[] = []
    for (const verb of WEAK_VERBS) {
        if (text.includes(verb)) {
            weakVerbsFound.push({
                original: verb,
                suggested: STRONG_VERB_SUGGESTIONS[verb] || 'use a stronger action verb'
            })
        }
    }
    const bulletScore = Math.max(0, 100 - (weakVerbsFound.length * 12))

    // 4. Metrics Detection
    const metricPatterns = [
        /\d+%/g, /\$[\d,]+/g, /\d+\+/g, /\d+x/gi,
        /\b\d{2,}\b/g  // numbers with 2+ digits
    ]
    let metricsCount = 0
    for (const pattern of metricPatterns) {
        const matches = resumeText.match(pattern)
        if (matches) metricsCount += matches.length
    }
    const metricsScore = Math.min(100, metricsCount * 15)

    // 5. Skill Extraction
    const techSkillPatterns = [
        'javascript', 'typescript', 'python', 'java', 'c\\+\\+', 'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin',
        'react', 'angular', 'vue', 'next\\.js', 'node\\.js', 'express', 'django', 'flask', 'spring',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform',
        'sql', 'postgresql', 'mongodb', 'redis', 'mysql', 'firebase', 'supabase',
        'git', 'linux', 'ci/cd', 'rest api', 'graphql', 'html', 'css', 'tailwind',
        'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'data science',
        'figma', 'agile', 'scrum', 'jira'
    ]
    const extractedSkills: string[] = []
    for (const skill of techSkillPatterns) {
        const regex = new RegExp(`\\b${skill}\\b`, 'gi')
        if (regex.test(resumeText)) {
            extractedSkills.push(skill.replace(/\\\./g, '.').replace(/\\\+/g, '+'))
        }
    }

    // Aggregate deterministic score
    const deterministicScore = Math.round(
        (completenessScore * 0.30) +
        (lengthScore * 0.15) +
        (bulletScore * 0.25) +
        (metricsScore * 0.15) +
        (Math.min(100, extractedSkills.length * 10) * 0.15)
    )

    return {
        deterministic_score: deterministicScore,
        section_completeness: { score: completenessScore, sections: sectionPresence, missing: missingSections },
        length_analysis: { word_count: wordCount, assessment: lengthAssessment, score: lengthScore },
        bullet_quality: { weak_verbs: weakVerbsFound, score: bulletScore },
        metrics_detection: { count: metricsCount, score: metricsScore },
        extracted_skills: extractedSkills
    }
}

// ── Content Hash ───────────────────────────────────────────────────────────

async function hashContent(text: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// ── Post-Processing ────────────────────────────────────────────────────────

function postProcessAIResponse(aiResult: any, deterministicResult: any) {
    // Validate required fields exist
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
    }

    const result = { ...defaults, ...aiResult }

    // Blend deterministic score with AI score (40% deterministic, 60% AI)
    if (aiResult?.overall_score) {
        result.overall_score = Math.round(
            (deterministicResult.deterministic_score * 0.4) +
            (aiResult.overall_score * 0.6)
        )
    }

    // Inject deterministic findings into weaknesses if missing sections
    if (deterministicResult.section_completeness.missing.length > 0) {
        result.weaknesses.unshift({
            title: 'Missing Resume Sections',
            description: `Your resume is missing: ${deterministicResult.section_completeness.missing.join(', ')}. Adding these sections can significantly improve your ATS score.`,
            impact_level: 'high'
        })
    }

    if (deterministicResult.metrics_detection.count === 0) {
        result.weaknesses.push({
            title: 'No Quantifiable Metrics',
            description: 'Your resume lacks measurable impact statements (percentages, numbers). Recruiters strongly prefer quantified achievements.',
            impact_level: 'high'
        })
    }

    // Categorize suggestions
    result.categorized_suggestions = {
        critical: result.weaknesses?.filter((w: any) => w.impact_level === 'high') || [],
        important: result.weaknesses?.filter((w: any) => w.impact_level === 'medium') || [],
        optional: result.weaknesses?.filter((w: any) => w.impact_level === 'low') || []
    }

    // Attach raw deterministic data
    result.deterministic_analysis = deterministicResult

    return result
}

// ── Main Handler ───────────────────────────────────────────────────────────

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { resume_text, job_description, analysis_type } = await req.json()

        // Authenticate user
        const authHeader = req.headers.get('Authorization')!
        const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
            global: { headers: { Authorization: authHeader } },
        })

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        if (!resume_text || resume_text.trim().length === 0) {
            return new Response(JSON.stringify({ error: 'No resume text provided' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        if (!geminiApiKey) {
            throw new Error('GEMINI_API_KEY is not set')
        }

        // Check for duplicate via content hash
        const contentHash = await hashContent(resume_text)
        const { data: existingAnalysis } = await supabase
            .from('analysis_results')
            .select('*')
            .eq('user_id', user.id)
            .eq('content_hash', contentHash)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (existingAnalysis) {
            return new Response(JSON.stringify({
                ...existingAnalysis.result_data,
                cached: true,
                analysis_id: existingAnalysis.id
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // Step 1: Run deterministic analysis
        const deterministicResult = runDeterministicAnalysis(resume_text)

        // Step 2: Build enhanced Gemini prompt
        const prompt = `
You are an expert ATS optimizer and career coach operating inside a deterministic SaaS system.
Analyze the resume text below. A deterministic pre-scan has already been run with these findings:

DETERMINISTIC PRE-SCAN RESULTS:
- Section completeness: ${JSON.stringify(deterministicResult.section_completeness)}
- Length: ${deterministicResult.length_analysis.word_count} words (${deterministicResult.length_analysis.assessment})
- Weak action verbs found: ${deterministicResult.bullet_quality.weak_verbs.map((v: any) => v.original).join(', ') || 'none'}
- Quantifiable metrics found: ${deterministicResult.metrics_detection.count}
- Skills extracted: ${deterministicResult.extracted_skills.join(', ') || 'none'}

YOUR TASK: Provide deeper analysis that COMPLEMENTS the deterministic findings above. Focus on:
1. Content quality and relevance
2. Career progression storytelling
3. Industry-specific optimization
4. ATS keyword optimization
5. Concrete rewrite suggestions for weak bullet points

${job_description ? `TARGET JOB DESCRIPTION:\n${job_description}\n\nAnalyze skill alignment against this specific role.` : 'No specific job description provided. Give general optimization advice.'}

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
${resume_text}
`

        // Step 3: Call Gemini
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.1,
                        responseMimeType: "application/json"
                    }
                })
            }
        )

        const geminiData = await geminiResponse.json()
        if (geminiData.error) {
            throw new Error(geminiData.error.message)
        }

        const aiOutputText = geminiData.candidates[0].content.parts[0].text
        let aiResult
        try {
            aiResult = JSON.parse(aiOutputText)
        } catch {
            throw new Error('AI returned invalid JSON')
        }

        // Step 4: Post-process & blend scores
        const finalResult = postProcessAIResponse(aiResult, deterministicResult)

        // Step 5: Store in DB
        const { data: insertedAnalysis, error: dbError } = await supabase
            .from('analysis_results')
            .insert({
                user_id: user.id,
                overall_score: finalResult.overall_score,
                result_data: finalResult,
                job_description: job_description || null,
                resume_text: resume_text,
                content_hash: contentHash
            })
            .select('id')
            .single()

        if (dbError) {
            console.error('DB insert error:', dbError)
            // Still return the result even if DB save fails
        }

        return new Response(JSON.stringify({
            ...finalResult,
            cached: false,
            analysis_id: insertedAnalysis?.id || null
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
