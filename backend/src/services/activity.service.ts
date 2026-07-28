import { activityRepo } from '../repositories/activity.repo';

export const activityService = {
  async getRecent(limit: number = 50, offset: number = 0) {
    return activityRepo.findRecent(limit, offset);
  },

  async getCount() {
    return activityRepo.count();
  },
};
