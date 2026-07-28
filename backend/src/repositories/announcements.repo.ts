import { supabase } from '../config/supabase';

// Public columns — internal_name is stripped here, not in the controller
const PUBLIC_COLUMNS = 'id, type, message, pinned, urgent, published, created_at, updated_at';
const ADMIN_COLUMNS = '*, internal_name';

export const announcementsRepo = {
  async findPublished(type: 'announcement' | 'schedule') {
    const order = type === 'announcement'
      ? { column: 'created_at', ascending: false }
      : { column: 'created_at', ascending: true };

    const { data, error } = await supabase
      .from('announcements')
      .select(PUBLIC_COLUMNS)
      .eq('type', type)
      .eq('published', true)
      .order('pinned', { ascending: false })
      .order(order.column, { ascending: order.ascending });

    if (error) throw error;
    return data;
  },

  async findAll(type: 'announcement' | 'schedule') {
    const { data, error } = await supabase
      .from('announcements')
      .select(ADMIN_COLUMNS)
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async findById(id: string) {
    const { data, error } = await supabase
      .from('announcements')
      .select(ADMIN_COLUMNS)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(input: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('announcements')
      .insert(input)
      .select(ADMIN_COLUMNS)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, input: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('announcements')
      .update(input)
      .eq('id', id)
      .select(ADMIN_COLUMNS)
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async countPublished(type?: 'announcement' | 'schedule') {
    let query = supabase
      .from('announcements')
      .select('id', { count: 'exact', head: true })
      .eq('published', true);

    if (type) {
      query = query.eq('type', type);
    }

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  },
};
