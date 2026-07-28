import { timelineRepo } from '../repositories/timeline.repo';
import { activityRepo } from '../repositories/activity.repo';
import { CreateTimelineInput, UpdateTimelineInput } from '../validators/timeline.schema';

export const timelineService = {
  async getVisible() {
    return timelineRepo.findVisible();
  },

  async getAll() {
    return timelineRepo.findAll();
  },

  async create(input: CreateTimelineInput, actor: string) {
    const result = await timelineRepo.create(input);
    await activityRepo.create(actor, 'created_timeline', input.title);
    return result;
  },

  async update(id: string, input: UpdateTimelineInput, actor: string) {
    const result = await timelineRepo.update(id, input);
    await activityRepo.create(actor, 'updated_timeline', input.title || `Entry ${id}`);
    return result;
  },

  async reorder(items: Array<{ id: string; display_order: number }>, actor: string) {
    await timelineRepo.reorder(items);
    await activityRepo.create(actor, 'reordered_timeline', `Reordered ${items.length} items`);
  },

  async delete(id: string, actor: string) {
    const existing = await timelineRepo.findById(id);
    await timelineRepo.delete(id);
    await activityRepo.create(actor, 'deleted_timeline', existing?.title);
  },
};
