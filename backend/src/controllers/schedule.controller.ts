import { Request, Response } from 'express';
import { scheduleService } from '../services/schedule.service';
import { formatError } from '../utils/errorFormatter';

export const scheduleController = {
  async getPublished(_req: Request, res: Response): Promise<void> {
    try {
      const data = await scheduleService.getPublished();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = await scheduleService.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const data = await scheduleService.update(req.params.id, req.body);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await scheduleService.delete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },
};
