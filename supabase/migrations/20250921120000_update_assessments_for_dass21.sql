-- Alter assessments table to support DASS-21
ALTER TABLE public.assessments
  ALTER COLUMN score DROP NOT NULL,
  ALTER COLUMN severity_level DROP NOT NULL;

-- It's safer to drop the check constraint and recreate it
ALTER TABLE public.assessments
  DROP CONSTRAINT assessments_type_check,
  ADD CONSTRAINT assessments_type_check CHECK (type IN ('phq9', 'gad7', 'DASS-21'));

ALTER TABLE public.assessments
  ADD COLUMN dass21_scores JSONB;

-- Also, the severity levels for DASS-21 are different.
-- The check constraint for severity_level should be updated or removed.
-- For now, I will remove it to allow more flexibility.
ALTER TABLE public.assessments
  DROP CONSTRAINT assessments_severity_level_check;
