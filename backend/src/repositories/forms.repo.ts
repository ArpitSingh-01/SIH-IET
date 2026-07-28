import { supabase } from '../config/supabase';

export interface FormRow {
  id?: string;
  title: string;
  description?: string | null;
  url: string;
  visible?: boolean;
  display_order?: number;
  created_at?: string;
}

export class FormsRepository {
  static async findAll(all = false): Promise<FormRow[]> {
    let query = supabase.from('google_forms').select('*');
    if (!all) {
      query = query.eq('visible', true);
    }
    const { data, error } = await query.order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  static async findById(id: string): Promise<FormRow | null> {
    const { data, error } = await supabase
      .from('google_forms')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code === 'PGRST116') return null; // PGRST116 is code for 0 rows returned
    if (error) throw error;
    return data;
  }

  static async create(row: FormRow): Promise<FormRow> {
    const { data, error } = await supabase
      .from('google_forms')
      .insert([row])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async update(id: string, row: Partial<FormRow>): Promise<FormRow> {
    const { data, error } = await supabase
      .from('google_forms')
      .update(row)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('google_forms')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  static async reorder(items: { id: string; display_order: number }[]): Promise<void> {
    const { error } = await supabase
      .from('google_forms')
      .upsert(items, { onConflict: 'id' });
    if (error) throw error;
  }
}
