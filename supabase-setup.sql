-- Supabase Database Setup for Donezo
-- Run these commands in your Supabase SQL editor

-- Note: auth.users table already has RLS enabled by Supabase automatically

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    notes TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    priority TEXT CHECK (priority IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create task_shares table for sharing tasks between users
CREATE TABLE IF NOT EXISTS public.task_shares (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    shared_with UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    permission TEXT CHECK (permission IN ('read', 'write')) DEFAULT 'read',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_shares ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Tasks policies
CREATE POLICY "Users can view own tasks" ON public.tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view shared tasks" ON public.tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.task_shares
            WHERE task_shares.task_id = tasks.id
            AND task_shares.shared_with = auth.uid()
        )
    );

CREATE POLICY "Users can insert own tasks" ON public.tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON public.tasks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can update shared tasks with write permission" ON public.tasks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.task_shares
            WHERE task_shares.task_id = tasks.id
            AND task_shares.shared_with = auth.uid()
            AND task_shares.permission = 'write'
        )
    );

CREATE POLICY "Users can delete own tasks" ON public.tasks
    FOR DELETE USING (auth.uid() = user_id);

-- Task shares policies
CREATE POLICY "Users can view shares for their tasks" ON public.task_shares
    FOR SELECT USING (
        auth.uid() = shared_by OR auth.uid() = shared_with
    );

CREATE POLICY "Users can create shares for their tasks" ON public.task_shares
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tasks
            WHERE tasks.id = task_shares.task_id
            AND tasks.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete shares for their tasks" ON public.task_shares
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.tasks
            WHERE tasks.id = task_shares.task_id
            AND tasks.user_id = auth.uid()
        )
    );

-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_task_shares_task_id ON public.task_shares(task_id);
CREATE INDEX IF NOT EXISTS idx_task_shares_shared_with ON public.task_shares(shared_with);
