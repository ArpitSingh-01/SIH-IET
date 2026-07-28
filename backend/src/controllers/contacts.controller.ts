import { Request, Response } from 'express';
import { contactsService } from '../services/contacts.service';
import { formatError } from '../utils/errorFormatter';

export const contactsController = {
  async getVisible(_req: Request, res: Response): Promise<void> {
    try {
      const data = await contactsService.getVisible();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { actor, ...input } = req.body;
      const data = await contactsService.create(input, actor || 'admin');
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { actor, ...input } = req.body;
      const data = await contactsService.update(req.params.id, input, actor || 'admin');
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await contactsService.delete(req.params.id, 'admin');
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },
};
