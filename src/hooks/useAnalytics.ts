import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, subMonths, eachDayOfInterval, format } from 'date-fns';

export interface TaskStats {
  total: number;
  assignedToMe: number;
  completed: number;
  overdue: number;
  inProgress: number;
  notStarted: number;
}

export interface TeamPerformance {
  userId: string;
  userName: string;
  tasksCompleted: number;
  tasksInProgress: number;
  averageCompletionTime: number;
}

export interface DailyTaskMetrics {
  date: string;
  completed: number;
  created: number;
}

export const useTaskStats = (userId?: string) => {
  return useQuery({
    queryKey: ['taskStats', userId],
    queryFn: async () => {
      const now = new Date();
      
      // Get all tasks
      const { data: allTasks, error: allError } = await supabase
        .from('tasks')
        .select('*');

      if (allError) throw allError;

      // Get tasks assigned to current user
      const myTasks = userId ? allTasks?.filter(t => t.assignee_id === userId) : [];
      
      // Calculate overdue tasks
      const overdueTasks = allTasks?.filter(t => 
        t.due_date && 
        new Date(t.due_date) < now && 
        t.status !== 'completed'
      ) || [];

      const stats: TaskStats = {
        total: allTasks?.length || 0,
        assignedToMe: myTasks?.length || 0,
        completed: allTasks?.filter(t => t.status === 'completed').length || 0,
        overdue: overdueTasks.length,
        inProgress: allTasks?.filter(t => t.status === 'in_progress').length || 0,
        notStarted: allTasks?.filter(t => t.status === 'not_started').length || 0,
      };

      return stats;
    },
  });
};

export const useTeamPerformance = () => {
  return useQuery({
    queryKey: ['teamPerformance'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name');

      if (profilesError) throw profilesError;

      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*');

      if (tasksError) throw tasksError;

      const performance: TeamPerformance[] = profiles?.map(profile => {
        const userTasks = tasks?.filter(t => t.assignee_id === profile.id) || [];
        const completedTasks = userTasks.filter(t => t.status === 'completed');
        
        // Calculate average completion time
        const completionTimes = completedTasks
          .filter(t => t.completed_at && t.created_at)
          .map(t => {
            const created = new Date(t.created_at).getTime();
            const completed = new Date(t.completed_at!).getTime();
            return (completed - created) / (1000 * 60 * 60 * 24); // days
          });

        const avgTime = completionTimes.length > 0
          ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
          : 0;

        return {
          userId: profile.id,
          userName: profile.full_name,
          tasksCompleted: completedTasks.length,
          tasksInProgress: userTasks.filter(t => t.status === 'in_progress').length,
          averageCompletionTime: Math.round(avgTime * 10) / 10,
        };
      }) || [];

      return performance;
    },
  });
};

export const useDailyTaskMetrics = (months: number = 1) => {
  return useQuery({
    queryKey: ['dailyTaskMetrics', months],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = subMonths(startOfMonth(endDate), months - 1);

      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('created_at, completed_at')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      const days = eachDayOfInterval({ start: startDate, end: endDate });
      
      const metrics: DailyTaskMetrics[] = days.map(day => {
        const dayStr = format(day, 'yyyy-MM-dd');
        const dayStart = new Date(day).setHours(0, 0, 0, 0);
        const dayEnd = new Date(day).setHours(23, 59, 59, 999);

        const created = tasks?.filter(t => {
          const createdTime = new Date(t.created_at).getTime();
          return createdTime >= dayStart && createdTime <= dayEnd;
        }).length || 0;

        const completed = tasks?.filter(t => {
          if (!t.completed_at) return false;
          const completedTime = new Date(t.completed_at).getTime();
          return completedTime >= dayStart && completedTime <= dayEnd;
        }).length || 0;

        return {
          date: dayStr,
          created,
          completed,
        };
      });

      return metrics;
    },
  });
};
