-- Drop and recreate foreign keys to point to profiles table instead of auth.users

-- Drop existing foreign keys
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_assignee_id_fkey;
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_assigner_id_fkey;
ALTER TABLE public.activity_logs DROP CONSTRAINT IF EXISTS activity_logs_user_id_fkey;

-- Add new foreign keys pointing to profiles
ALTER TABLE public.tasks
ADD CONSTRAINT tasks_assignee_id_fkey 
FOREIGN KEY (assignee_id) 
REFERENCES public.profiles(id) 
ON DELETE SET NULL;

ALTER TABLE public.tasks
ADD CONSTRAINT tasks_assigner_id_fkey 
FOREIGN KEY (assigner_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

ALTER TABLE public.activity_logs
ADD CONSTRAINT activity_logs_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;