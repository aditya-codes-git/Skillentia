# Architecture SOPs & Data Flows

## 1. System Overview (A.N.T Layer 1)
Skillentia follows a strict 3-layer architecture:
- **Layer 1 (Architecture):** Deterministic routing, predefined JSON structures, and this SOP document.
- **Layer 2 (Navigation):** React frontend managing global state (Zustand) and orchestrating API calls.
- **Layer 3 (Tools/Workers):** Supabase Edge Functions handling secure AI execution and PDF generation.

## 2. Data Flow: Resume Creation & Auto-save
1. User interacts with Resume Builder UI (React Form).
2. Local generic state updates via Zustand.
3. Debounced save trigger fires (every 3 seconds of inactivity).
4. Payload structured according to `gemini.md` (Resume Storage Schema).
5. Frontend calls Supabase `upsert` on `resumes` and `resume_sections` tables.
6. Supabase RLS ensures the user only affects their own records.

## 3. Data Flow: AI Resume Analysis (Skill Gap & ATS)
1. User clicks "Analyze Resume".
2. Frontend gathers current `resume_sections` JSON and optional `job_description`.
3. Frontend triggers Supabase Edge Function `analyze-resume`.
4. Edge Function:
   - Validates auth token (RLS check).
   - Performs **Deterministic Preprocessing** (extracting and normalizing skills).
   - Constructs strict prompt ensuring output matches `gemini.md` (Analysis Response Schema).
   - Calls Gemini API (`gemini-2.5-flash`).
5. Edge Function receives Gemini response, parses JSON.
6. Edge Function inserts record into `analysis_results` table.
7. Edge Function returns JSON payload to frontend.
8. Frontend renders results in the UI.

## 4. Error Handling SOP
- **API Failures:** Caught at the Axios/Fetch level, routed to a global toast notification system (React Hot Toast).
- **Validation Errors:** Handled locally within React Hook Form before any network request.
- **AI Parsing Failures:** Edge functions must wrap Gemini responses in `try/catch`. If JSON parsing fails, return a graceful error payload: `{"error": "AI response format invalid. Please try again."}`.

## 5. Security SOP
- No direct Gemini API calls from the frontend to prevent token leakage.
- All database mutations must go through the Supabase client utilizing RLS policies.
- File uploads restricted by Supabase Storage bucket policies.
