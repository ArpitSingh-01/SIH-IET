import { Request, Response } from 'express';
import { settingsService } from '../services/settings.service';
import { formatError } from '../utils/errorFormatter';

export const settingsController = {
  async get(req: Request, res: Response): Promise<void> {
    try {
      const data = await settingsService.get(req.params.key);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { value, updated_by } = req.body;
      const data = await settingsService.update(req.params.key, value, updated_by);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },
};
