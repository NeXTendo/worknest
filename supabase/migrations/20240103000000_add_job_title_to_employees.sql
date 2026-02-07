-- Migration to add job_title text column to employees table
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS job_title text;
