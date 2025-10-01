import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
  role?: 'manager' | 'team_member';
}

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles(role)
        `)
        .order('full_name');

      if (error) throw error;
      
      return data.map((profile: any) => ({
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        avatar_url: profile.avatar_url,
        timezone: profile.timezone,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        role: profile.user_roles?.[0]?.role || 'team_member',
      })) as Profile[];
    },
  });
};

export const useProfile = (userId: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles(role)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      const profile: any = data;
      return {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        avatar_url: profile.avatar_url,
        timezone: profile.timezone,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        role: profile.user_roles?.[0]?.role || 'team_member',
      } as Profile;
    },
    enabled: !!userId,
  });
};

export const useCurrentUserRole = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userRole', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data.role as 'manager' | 'team_member';
    },
    enabled: !!userId,
  });
};
