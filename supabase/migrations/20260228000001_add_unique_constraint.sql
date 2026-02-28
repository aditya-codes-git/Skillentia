-- Add unique constraint for upsert operations on resume sections
ALTER TABLE resume_sections
ADD CONSTRAINT resume_sections_resume_id_section_type_key UNIQUE (resume_id, section_type);
