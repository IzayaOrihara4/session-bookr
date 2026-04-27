-- Migration: Expand profiles table with detailed personal and address fields
-- Description: Adds nullable columns for phone, date of birth, and full address management.
-- Created: 2026-04-26

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS phone_prefix text,
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS address_line_1 text,
ADD COLUMN IF NOT EXISTS address_line_2 text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS postal_code text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS county text;

-- Ensure RLS policies are up to date (already exist but reinforcing)
-- USERS: Can only view and update their own profile
-- ADMINS: Can view all (handled via is_admin() helper in RLS or frontend routes)
