import { DocumentsRepository, DocumentRow } from '../repositories/documents.repo';
import { StorageService } from './storage.service';
import { activityRepo } from '../repositories/activity.repo';

export const DocumentsService = {
  async getAll(type: 'notice' | 'resource', all = false) {
    return DocumentsRepository.findAll(type, all);
  },

  async getById(id: string) {
    return DocumentsRepository.findById(id);
  },

  async create(input: DocumentRow, actor: string) {
    const result = await DocumentsRepository.create(input);
    await activityRepo.create(actor, `created_${input.type}`, `Doc: ${input.title}`);
    return result;
  },

  async update(id: string, input: Partial<DocumentRow>, actor: string) {
    const result = await DocumentsRepository.update(id, input);
    await activityRepo.create(actor, `updated_${result.type}`, `Updated doc: ${input.title || id}`);
    return result;
  },

  async delete(id: string, actor: string) {
    const existing = await DocumentsRepository.findById(id);
    if (!existing) return;

    // Clean up associated file in Supabase Storage bucket if present
    if (existing.file_path) {
      try {
        await StorageService.deleteFile(existing.file_path);
      } catch {
        // Silent catch to ensure database row is deleted even if file is missing/stale
      }
    }

    await DocumentsRepository.delete(id);
    await activityRepo.create(actor, `deleted_${existing.type}`, existing.title);
  },

  async reorder(items: { id: string; display_order: number }[], type: 'notice' | 'resource', actor: string) {
    await DocumentsRepository.reorder(items);
    await activityRepo.create(actor, `reordered_${type}s`, `${items.length} ${type}s reordered`);
  },
};
