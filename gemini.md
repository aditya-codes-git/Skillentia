# Data Schemas & Business Logic

*A mandatory definition system prior to code implementation. All data, endpoints, and data shapes must be thoroughly defined here.*

## 1. Resume Input Schema
```json
{
  "personal_details": {
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin_url": "string",
    "portfolio_url": "string",
    "summary": "string"
  },
  "education": [
    {
      "id": "string",
      "institution": "string",
      "degree": "string",
      "field_of_study": "string",
      "start_date": "string",
      "end_date": "string",
      "current": "boolean",
      "gpa": "string",
      "description": "string"
    }
  ],
  "experience": [
    {
      "id": "string",
      "company": "string",
      "position": "string",
      "location": "string",
      "start_date": "string",
      "end_date": "string",
      "current": "boolean",
      "description": "string",
      "bullets": ["string"]
    }
  ],
  "skills": {
    "technical_skills": ["string"],
    "tools": ["string"],
    "frameworks": ["string"],
    "languages": ["string"],
    "soft_skills": ["string"]
  },
  "projects": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "url": "string",
      "technologies": ["string"],
      "start_date": "string",
      "end_date": "string"
    }
  ],
  "certifications": [
    {
      "id": "string",
      "name": "string",
      "issuer": "string",
      "date": "string",
      "url": "string"
    }
  ]
}
```

## 2. Resume Storage Schema
The storage representation combines relational data with JSONB for flexible section attributes.
- `resumes` table stores top-level metadata and theme selection.
- `resume_sections` table stores the ordered sections with `content` as JSONB.
- `resume_versions` table stores a complete snapshot of the resume data (JSONB) for historical tracking.

## 3. Analysis Request Schema
```json
{
  "resume_data": { 
     // Data structure matching Resume Input Schema
  },
  "job_description": "string | null",
  "analysis_type": "full | skill_gap | ats"
}
```

## 4. Analysis Response Schema
```json
{
  "overall_score": 0,
  "summary": "",
  "strengths": [
    {
      "title": "",
      "description": ""
    }
  ],
  "weaknesses": [
    {
      "title": "",
      "description": "",
      "impact_level": "low | medium | high"
    }
  ],
  "skill_gap_analysis": {
    "matched_skills": [],
    "partially_matched_skills": [],
    "missing_required_skills": [],
    "missing_preferred_skills": [],
    "critical_missing_skills": [],
    "recommended_learning_skills": [
      {
        "skill": "",
        "reason": "",
        "priority": "low | medium | high"
      }
    ]
  },
  "ats_analysis": {
    "ats_score": 0,
    "keyword_density": [
      {
        "keyword": "",
        "count": 0,
        "expected_minimum": 0
      }
    ],
    "missing_keywords": [],
    "weak_action_verbs": [
      {
        "original": "",
        "suggested_replacement": ""
      }
    ],
    "formatting_risk_level": "low | medium | high",
    "formatting_issues": []
  },
  "rewrite_suggestions": [
    {
      "original_text": "",
      "improved_text": "",
      "reason": ""
    }
  ],
  "recommendations_summary": ""
}
```

## 5. Template Rendering Data
```json
{
  "template_name": "string",
  "layout_variant": "string",
  "theme": {
    "primary_color": "string",
    "secondary_color": "string",
    "accent_color": "string",
    "font_family": "string",
    "font_scale": "small | medium | large",
    "spacing_scale": "compact | comfortable | spacious"
  },
  "resume_data": {
     // Data structure matching Resume Input Schema
  }
}
```

## 6. PostgreSQL Schema & RLS Policies

### Tables

**`users`**
Managed automatically by Supabase Auth (`auth.users`).

**`resumes`**
```sql
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    template_name VARCHAR(50) DEFAULT 'modern',
    layout_variant VARCHAR(50) DEFAULT 'standard',
    theme_config JSONB DEFAULT '{"primary_color": "#000000", "font_family": "inter", "font_scale": "medium", "spacing_scale": "comfortable"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**`resume_sections`**
```sql
CREATE TABLE resume_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    section_type VARCHAR(50) NOT NULL,
    content JSONB NOT NULL,
    order_index INTEGER NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**`resume_versions`**
```sql
CREATE TABLE resume_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    resume_data_snapshot JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**`analysis_results`**
```sql
CREATE TABLE analysis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    result_data JSONB NOT NULL,
    job_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**`templates`**
```sql
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    available_variants JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row-Level Security (RLS) Policies

All tables must have `ENABLE ROW LEVEL SECURITY`.

1. **`resumes`**
   - SELECT, INSERT, UPDATE, DELETE: `auth.uid() = user_id`

2. **`resume_sections`**, **`resume_versions`**, **`analysis_results`**
   - SELECT, INSERT, UPDATE, DELETE: Allowed only if the linked `resume_id` belongs to the authenticated user.
   - Example (for sections): `resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid())`

3. **`templates`**
   - SELECT: `true` (Publicly readable)
   - INSERT, UPDATE, DELETE: Admin role only.

### Storage Bucket Setup
- **`resume_pdfs`** (Private)
  - Security Policy: SELECT/INSERT/UPDATE/DELETE allowed if `auth.uid()::text = (storage.foldername(name))[1]`
- **`uploaded_resumes`** (Private)
  - Security Policy: SELECT/INSERT/UPDATE/DELETE allowed if `auth.uid()::text = (storage.foldername(name))[1]`
- **`template_assets`** (Public Read)
  - Security Policy: SELECT allowed for all.
