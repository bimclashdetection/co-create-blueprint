import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityLog {
  id: string;
  user_id: string;
  action_type: string;
  task_id: string | null;
  details: any;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    email: string;
  };
  task?: {
    id: string;
    task_id: string;
    title: string;
  };
}

export const useActivityLogs = (limit: number = 50) => {
  return useQuery({
    queryKey: ['activityLogs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          *,
          user:profiles!activity_logs_user_id_fkey(id, full_name, email),
          task:tasks!activity_logs_task_id_fkey(id, task_id, title)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as any;
    },
  });
};

export const useTaskActivityLogs = (taskId: string) => {
  return useQuery({
    queryKey: ['taskActivityLogs', taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          *,
          user:profiles!activity_logs_user_id_fkey(id, full_name, email)
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as any;
    },
    enabled: !!taskId,
  });
};
