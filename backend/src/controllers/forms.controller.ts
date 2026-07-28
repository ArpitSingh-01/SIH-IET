import { Request, Response } from 'express';
import { FormsService } from '../services/forms.service';
import { formatError } from '../utils/errorFormatter';

export const FormsController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const all = req.query.all === 'true';
      const data = await FormsService.getAll(all);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const actor = req.body.actor || 'admin';
      // Remove actor field before inserting into database
      const { actor: _, ...row } = req.body;
      const data = await FormsService.create(row, actor);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const actor = req.body.actor || 'admin';
      const { actor: _, ...row } = req.body;
      const data = await FormsService.update(req.params.id, row, actor);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const actor = (req.query.actor as string) || 'admin';
      await FormsService.delete(req.params.id, actor);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async reorder(req: Request, res: Response): Promise<void> {
    try {
      const actor = req.body.actor || 'admin';
      const items = req.body.items || [];
      await FormsService.reorder(items, actor);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },
};
