-- Resume Uploads table for tracking uploaded files
CREATE TABLE IF NOT EXISTS resume_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(10) NOT NULL CHECK (file_type IN ('pdf', 'docx')),
    content_hash VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add user_id to analysis_results so analyses can exist without a builder resume
ALTER TABLE analysis_results ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE analysis_results ADD COLUMN IF NOT EXISTS resume_text TEXT;
ALTER TABLE analysis_results ADD COLUMN IF NOT EXISTS upload_id UUID REFERENCES resume_uploads(id) ON DELETE SET NULL;
ALTER TABLE analysis_results ALTER COLUMN resume_id DROP NOT NULL;

-- Enable RLS on resume_uploads
ALTER TABLE resume_uploads ENABLE ROW LEVEL SECURITY;

-- RLS policies for resume_uploads
CREATE POLICY "Users can view own uploads" ON resume_uploads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own uploads" ON resume_uploads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own uploads" ON resume_uploads FOR DELETE USING (auth.uid() = user_id);

-- Update analysis_results RLS to also allow direct user_id access
CREATE POLICY "Users can view own analysis by user_id" ON analysis_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analysis by user_id" ON analysis_results FOR INSERT WITH CHECK (auth.uid() = user_id);
