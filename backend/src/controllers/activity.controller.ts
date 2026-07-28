import { Request, Response } from 'express';
import { activityService } from '../services/activity.service';
import { announcementsRepo } from '../repositories/announcements.repo';
import { timelineRepo } from '../repositories/timeline.repo';
import { contactsRepo } from '../repositories/contacts.repo';
import { formatError } from '../utils/errorFormatter';

export const activityController = {
  async getRecent(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const data = await activityService.getRecent(limit, offset);
      const total = await activityService.getCount();
      res.json({ data, total });
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const [announcements, schedule, timeline, contacts] = await Promise.all([
        announcementsRepo.countPublished('announcement'),
        announcementsRepo.countPublished('schedule'),
        timelineRepo.count(),
        contactsRepo.count(),
      ]);

      res.json({ announcements, schedule, timeline, contacts });
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },
};
