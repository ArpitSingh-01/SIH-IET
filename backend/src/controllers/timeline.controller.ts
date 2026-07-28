import { Request, Response } from 'express';
import { timelineService } from '../services/timeline.service';
import { formatError } from '../utils/errorFormatter';

export const timelineController = {
  async getVisible(_req: Request, res: Response): Promise<void> {
    try {
      const data = await timelineService.getVisible();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { actor, ...input } = req.body;
      const data = await timelineService.create(input, actor || 'admin');
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { actor, ...input } = req.body;
      const data = await timelineService.update(req.params.id, input, actor || 'admin');
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async reorder(req: Request, res: Response): Promise<void> {
    try {
      const { items, actor } = req.body;
      await timelineService.reorder(items, actor || 'admin');
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await timelineService.delete(req.params.id, 'admin');
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },
};
