import { Request, Response } from 'express';
import { notificationsService } from '../services/notifications.service';
import { formatError } from '../utils/errorFormatter';

export const notificationsController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      await notificationsService.registerToken(req.body.token);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async send(req: Request, res: Response): Promise<void> {
    try {
      const { title, body, url } = req.body;
      const result = await notificationsService.sendToAll(title, body, url || '/', 'admin');
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async getTokenCount(_req: Request, res: Response): Promise<void> {
    try {
      const count = await notificationsService.getTokenCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },
};
