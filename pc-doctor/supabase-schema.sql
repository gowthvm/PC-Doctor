-- Create diagnoses table for storing diagnosis history in Supabase
-- Run this in your Supabase SQL Editor if you want to enable database storage

CREATE TABLE IF NOT EXISTS diagnoses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  system_specs JSONB NOT NULL,
  problem_description TEXT NOT NULL,
  diagnosis_result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_diagnoses_user_id ON diagnoses(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_created_at ON diagnoses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own diagnoses
CREATE POLICY "Users can view their own diagnoses"
  ON diagnoses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own diagnoses
CREATE POLICY "Users can insert their own diagnoses"
  ON diagnoses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own diagnoses
CREATE POLICY "Users can update their own diagnoses"
  ON diagnoses
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy: Users can delete their own diagnoses
CREATE POLICY "Users can delete their own diagnoses"
  ON diagnoses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_diagnoses_updated_at
  BEFORE UPDATE ON diagnoses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for easier querying
CREATE OR REPLACE VIEW user_diagnoses AS
SELECT 
  d.id,
  d.user_id,
  d.system_specs,
  d.problem_description,
  d.diagnosis_result,
  d.created_at,
  d.updated_at,
  u.email as user_email
FROM diagnoses d
JOIN auth.users u ON d.user_id = u.id;

COMMENT ON TABLE diagnoses IS 'Stores AI-generated computer diagnoses for users';
COMMENT ON COLUMN diagnoses.system_specs IS 'JSON object containing CPU, GPU, RAM, OS, and Storage information';
COMMENT ON COLUMN diagnoses.diagnosis_result IS 'JSON object containing the full AI diagnosis response';
