-- Initial Schema for session-bookr

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create roles enum
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'client', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'user' NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Locations Table
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE, -- e.g., 'Precision', 'Essential', 'Full Coverage'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Treatment Types Table
CREATE TABLE IF NOT EXISTS public.treatment_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., 'Upper Lip', 'Half Leg'
    duration_minutes INTEGER DEFAULT 30,
    price_cents INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Bookings Table (for testing)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    treatment_id UUID REFERENCES public.treatment_types(id),
    location_id UUID REFERENCES public.locations(id),
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ROLE PERMISSIONS (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Locations, Categories, Treatment Types (Read by all, Write by Admin only)
CREATE POLICY "Read access for everyone" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Read access for everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Read access for everyone" ON public.treatment_types FOR SELECT USING (true);

-- Admin Write Access (Simulated with check on profiles table role)
CREATE POLICY "Admin write access" ON public.locations FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Bookings Policies
CREATE POLICY "Users view own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users create own bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- FUNCTION: Handle newly registered users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'user');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER: Automatic profile creation on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
