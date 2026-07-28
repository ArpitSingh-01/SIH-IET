import { FormsRepository, FormRow } from '../repositories/forms.repo';
import { activityRepo } from '../repositories/activity.repo';

export const FormsService = {
  async getAll(all = false) {
    return FormsRepository.findAll(all);
  },

  async getById(id: string) {
    return FormsRepository.findById(id);
  },

  async create(input: FormRow, actor: string) {
    const result = await FormsRepository.create(input);
    await activityRepo.create(actor, 'created_form', `Form: ${input.title}`);
    return result;
  },

  async update(id: string, input: Partial<FormRow>, actor: string) {
    const result = await FormsRepository.update(id, input);
    await activityRepo.create(actor, 'updated_form', `Updated form: ${input.title || id}`);
    return result;
  },

  async delete(id: string, actor: string) {
    const existing = await FormsRepository.findById(id);
    await FormsRepository.delete(id);
    await activityRepo.create(actor, 'deleted_form', existing?.title || id);
  },

  async reorder(items: { id: string; display_order: number }[], actor: string) {
    await FormsRepository.reorder(items);
    await activityRepo.create(actor, 'reordered_forms', `${items.length} forms reordered`);
  },
};
