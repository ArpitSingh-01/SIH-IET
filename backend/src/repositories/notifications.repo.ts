import { supabase } from '../config/supabase';

export const notificationsRepo = {
  async upsertToken(token: string) {
    // Try to update last_seen if token exists, otherwise insert
    const { data: existing } = await supabase
      .from('notification_tokens')
      .select('id')
      .eq('token', token)
      .single();

    if (existing) {
      await supabase
        .from('notification_tokens')
        .update({ last_seen: new Date().toISOString() })
        .eq('token', token);
    } else {
      await supabase
        .from('notification_tokens')
        .insert({ token });
    }
  },

  async getAllTokens() {
    const { data, error } = await supabase
      .from('notification_tokens')
      .select('token');

    if (error) throw error;
    return data || [];
  },

  async deleteTokens(tokens: string[]) {
    if (tokens.length === 0) return;

    const { error } = await supabase
      .from('notification_tokens')
      .delete()
      .in('token', tokens);

    if (error) throw error;
  },

  async count() {
    const { count, error } = await supabase
      .from('notification_tokens')
      .select('id', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  },
};
