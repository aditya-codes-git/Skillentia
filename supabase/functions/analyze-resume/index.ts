import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { resume_data, job_description, analysis_type } = await req.json()

        // Create a Supabase client with the user's Auth header to enforce RLS
        const authHeader = req.headers.get('Authorization')!
        const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
            global: { headers: { Authorization: authHeader } },
        })

        // Validate the user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        if (!geminiApiKey) {
            throw new Error('GEMINI_API_KEY is not set')
        }

        // Prepare Prompt for Gemini Based on Strict Schema in gemini.md
        const prompt = `
You are an expert ATS optimizer and career coach operating inside a deterministic SaaS system.
You must analyze the provided resume data and optional job description.

RETURN ONLY VALID JSON FOLLOWING THIS EXACT SCHEMA. No markdown, no explanations.

{
  "overall_score": 0,
  "summary": "",
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
    "ats_score": 0,
    "keyword_density": [{ "keyword": "", "count": 0, "expected_minimum": 0 }],
    "missing_keywords": [],
    "weak_action_verbs": [{ "original": "", "suggested_replacement": "" }],
    "formatting_risk_level": "low | medium | high",
    "formatting_issues": []
  },
  "rewrite_suggestions": [{ "original_text": "", "improved_text": "", "reason": "" }],
  "recommendations_summary": ""
}

Resume Data:
${JSON.stringify(resume_data, null, 2)}

Job Description:
${job_description || 'None provided.'}
`

        // Call Gemini API REST Endpoint
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.1, // Keep deterministic
                    responseMimeType: "application/json"
                }
            })
        })

        const geminiData = await geminiResponse.json();

        if (geminiData.error) {
            throw new Error(geminiData.error.message)
        }

        const aiOutputText = geminiData.candidates[0].content.parts[0].text;
        const structuredResult = JSON.parse(aiOutputText);

        return new Response(JSON.stringify(structuredResult), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
