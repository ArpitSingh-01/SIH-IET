import { supabase } from '../config/supabase';

export const activityRepo = {
  async create(actor: string, action: string, detail?: string) {
    const { error } = await supabase
      .from('activity_logs')
      .insert({ actor, action, detail });

    if (error) {
      console.error('Failed to write activity log:', error.message);
      // Activity log failures should not break the main operation
    }
  },

  async findRecent(limit: number = 50, offset: number = 0) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  },

  async count() {
    const { count, error } = await supabase
      .from('activity_logs')
      .select('id', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  },
};
