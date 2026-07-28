import { supabase } from '../config/supabase';

export const settingsRepo = {
  async get(key: string) {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error) throw error;
    return data;
  },

  async update(key: string, value: string | null, updatedBy: string) {
    const { data, error } = await supabase
      .from('settings')
      .update({ value, updated_by: updatedBy, updated_at: new Date().toISOString() })
      .eq('key', key)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },
};
