import { supabase } from '../config/supabase';

export const timelineRepo = {
  async findVisible() {
    const { data, error } = await supabase
      .from('timeline')
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  },

  async findAll() {
    const { data, error } = await supabase
      .from('timeline')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  },

  async findById(id: string) {
    const { data, error } = await supabase
      .from('timeline')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(input: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('timeline')
      .insert(input)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, input: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('timeline')
      .update(input)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async reorder(items: Array<{ id: string; display_order: number }>) {
    // Update each item's display_order
    for (const item of items) {
      const { error } = await supabase
        .from('timeline')
        .update({ display_order: item.display_order })
        .eq('id', item.id);

      if (error) throw error;
    }
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('timeline')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async count() {
    const { count, error } = await supabase
      .from('timeline')
      .select('id', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  },
};
