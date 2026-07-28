import { supabase } from '../config/supabase';

export const contactsRepo = {
  async findVisible() {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  },

  async findAll() {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  },

  async create(input: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('contacts')
      .insert(input)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, input: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('contacts')
      .update(input)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async count() {
    const { count, error } = await supabase
      .from('contacts')
      .select('id', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  },
};
