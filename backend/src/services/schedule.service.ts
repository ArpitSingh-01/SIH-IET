import { announcementsRepo } from '../repositories/announcements.repo';
import { activityRepo } from '../repositories/activity.repo';
import { CreateAnnouncementInput, UpdateAnnouncementInput } from '../validators/announcements.schema';

export const scheduleService = {
  async getPublished() {
    return announcementsRepo.findPublished('schedule');
  },

  async getAll() {
    return announcementsRepo.findAll('schedule');
  },

  async create(input: CreateAnnouncementInput) {
    const result = await announcementsRepo.create({ ...input, type: 'schedule' });
    await activityRepo.create(input.internal_name, 'posted_schedule', input.message.substring(0, 100));
    return result;
  },

  async update(id: string, input: UpdateAnnouncementInput) {
    const result = await announcementsRepo.update(id, input);
    await activityRepo.create(
      input.internal_name || 'admin',
      'updated_schedule',
      `Updated schedule entry ${id}`
    );
    return result;
  },

  async delete(id: string) {
    const existing = await announcementsRepo.findById(id);
    await announcementsRepo.delete(id);
    await activityRepo.create(
      existing?.internal_name || 'admin',
      'deleted_schedule',
      existing?.message?.substring(0, 100)
    );
  },
};
