import { settingsRepo } from '../repositories/settings.repo';
import { activityRepo } from '../repositories/activity.repo';

export const settingsService = {
  async get(key: string) {
    return settingsRepo.get(key);
  },

  async update(key: string, value: string | null, updatedBy: string) {
    const result = await settingsRepo.update(key, value, updatedBy);
    await activityRepo.create(updatedBy, 'updated_setting', `Updated ${key}`);
    return result;
  },
};
