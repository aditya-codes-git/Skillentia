-- Log resume exports (PDF/DOCX downloads)
CREATE TABLE resume_exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    format VARCHAR(10) CHECK (format IN ('pdf', 'docx')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE resume_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own exports" ON resume_exports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exports" ON resume_exports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exports" ON resume_exports
    FOR DELETE USING (auth.uid() = user_id);
