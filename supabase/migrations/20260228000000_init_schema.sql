-- Create templates table
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    available_variants JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resumes table
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

-- Create resume sections table
CREATE TABLE resume_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    section_type VARCHAR(50) NOT NULL,
    content JSONB NOT NULL,
    order_index INTEGER NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(resume_id, section_type)
);

-- Create resume versions table for historical tracking
CREATE TABLE resume_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    resume_data_snapshot JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analysis results table
CREATE TABLE analysis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    result_data JSONB NOT NULL,
    job_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Establish Row Level Security (RLS)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Templates Policies (Public Read, Admin Write)
CREATE POLICY "Templates are viewable by everyone" ON templates FOR SELECT USING (true);
CREATE POLICY "Templates are insertable by admins only" ON templates FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));
CREATE POLICY "Templates are updatable by admins only" ON templates FOR UPDATE USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));
CREATE POLICY "Templates are deletable by admins only" ON templates FOR DELETE USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));

-- Resumes Policies (Owner restricted)
CREATE POLICY "Users can view own resumes" ON resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own resumes" ON resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resumes" ON resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own resumes" ON resumes FOR DELETE USING (auth.uid() = user_id);

-- Resume Sections Policies (Restricted to Resume owner)
CREATE POLICY "Users can view sections of own resumes" ON resume_sections FOR SELECT USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert sections for own resumes" ON resume_sections FOR INSERT WITH CHECK (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));
CREATE POLICY "Users can update sections of own resumes" ON resume_sections FOR UPDATE USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete sections of own resumes" ON resume_sections FOR DELETE USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));

-- Resume Versions Policies (Restricted to Resume owner)
CREATE POLICY "Users can view versions of own resumes" ON resume_versions FOR SELECT USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert versions for own resumes" ON resume_versions FOR INSERT WITH CHECK (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));
CREATE POLICY "Users can update versions of own resumes" ON resume_versions FOR UPDATE USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete versions of own resumes" ON resume_versions FOR DELETE USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));

-- Analysis Results Policies (Restricted to Resume owner)
CREATE POLICY "Users can view analysis of own resumes" ON analysis_results FOR SELECT USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert analysis for own resumes" ON analysis_results FOR INSERT WITH CHECK (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));
CREATE POLICY "Users can update analysis of own resumes" ON analysis_results FOR UPDATE USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete analysis of own resumes" ON analysis_results FOR DELETE USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));

-- Set up Storage Buckets
insert into storage.buckets (id, name, public) values ('resume_pdfs', 'resume_pdfs', false);
insert into storage.buckets (id, name, public) values ('uploaded_resumes', 'uploaded_resumes', false);
insert into storage.buckets (id, name, public) values ('template_assets', 'template_assets', true);

-- Storage bucket access policies
CREATE POLICY "Users can access own PDFs" ON storage.objects FOR ALL USING (bucket_id = 'resume_pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can access own uploads" ON storage.objects FOR ALL USING (bucket_id = 'uploaded_resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Public can view template assets" ON storage.objects FOR SELECT USING (bucket_id = 'template_assets');
