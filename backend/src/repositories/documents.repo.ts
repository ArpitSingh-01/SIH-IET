import { supabase } from '../config/supabase';

export interface DocumentRow {
  id?: string;
  title: string;
  description?: string | null;
  type: 'notice' | 'resource';
  file_url?: string | null;
  file_path?: string | null;
  link_url?: string | null;
  visible?: boolean;
  display_order?: number;
  created_at?: string;
}

export class DocumentsRepository {
  static async findAll(type: 'notice' | 'resource', all = false): Promise<DocumentRow[]> {
    let query = supabase.from('documents').select('*').eq('type', type);
    if (!all) {
      query = query.eq('visible', true);
    }
    const { data, error } = await query.order('display_order', { ascending: true }).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  static async findById(id: string): Promise<DocumentRow | null> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  }

  static async create(row: DocumentRow): Promise<DocumentRow> {
    const { data, error } = await supabase
      .from('documents')
      .insert([row])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async update(id: string, row: Partial<DocumentRow>): Promise<DocumentRow> {
    const { data, error } = await supabase
      .from('documents')
      .update(row)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  static async reorder(items: { id: string; display_order: number }[]): Promise<void> {
    const { error } = await supabase
      .from('documents')
      .upsert(items, { onConflict: 'id' });
    if (error) throw error;
  }
}
