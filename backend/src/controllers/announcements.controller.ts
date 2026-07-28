import { Request, Response } from 'express';
import { announcementsService } from '../services/announcements.service';
import { formatError } from '../utils/errorFormatter';

export const announcementsController = {
  async getPublished(_req: Request, res: Response): Promise<void> {
    try {
      const data = await announcementsService.getPublished();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = await announcementsService.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const data = await announcementsService.update(req.params.id, req.body);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await announcementsService.delete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },
};
