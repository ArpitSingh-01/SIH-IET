import { Request, Response } from 'express';
import { DocumentsService } from '../services/documents.service';
import { StorageService } from '../services/storage.service';
import { formatError, AppError } from '../utils/errorFormatter';

export const DocumentsController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const type = req.params.type as 'notice' | 'resource';
      if (type !== 'notice' && type !== 'resource') {
        throw new AppError(400, 'Invalid document type');
      }
      const all = req.query.all === 'true';
      const data = await DocumentsService.getAll(type, all);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    let uploadedPath: string | null = null;
    try {
      const actor = req.body.actor || 'admin';
      const { actor: _, ...row } = req.body;

      if (row.type !== 'notice' && row.type !== 'resource') {
        throw new AppError(400, 'Invalid document type');
      }

      // Handle file upload if present
      if (req.file) {
        const folder = row.type === 'notice' ? 'notices' : 'resources';
        const { fileUrl, filePath } = await StorageService.uploadFile(req.file, folder);
        uploadedPath = filePath;
        row.file_url = fileUrl;
        row.file_path = filePath;
        row.link_url = null;
      } else if (!row.link_url) {
        throw new AppError(400, 'Either a file upload or link_url is required');
      } else {
        row.file_url = null;
        row.file_path = null;
      }

      const data = await DocumentsService.create(row, actor);
      res.status(201).json(data);
    } catch (error) {
      // Cleanup uploaded file from bucket if db save fails
      if (uploadedPath) {
        try {
          await StorageService.deleteFile(uploadedPath);
        } catch {
          // Ignored
        }
      }
      res.status(500).json({ error: formatError(error) });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    let newUploadedPath: string | null = null;
    try {
      const actor = req.body.actor || 'admin';
      const { actor: _, ...row } = req.body;

      const existing = await DocumentsService.getById(req.params.id);
      if (!existing) {
        throw new AppError(404, 'Document not found');
      }

      // Handle new file upload if present
      if (req.file) {
        const folder = existing.type === 'notice' ? 'notices' : 'resources';
        const { fileUrl, filePath } = await StorageService.uploadFile(req.file, folder);
        newUploadedPath = filePath;
        row.file_url = fileUrl;
        row.file_path = filePath;
        row.link_url = null;

        // Clean up old file from bucket
        if (existing.file_path) {
          try {
            await StorageService.deleteFile(existing.file_path);
          } catch {
            // Ignored
          }
        }
      }

      const data = await DocumentsService.update(req.params.id, row, actor);
      res.json(data);
    } catch (error) {
      // Cleanup newly uploaded file from bucket if update fails
      if (newUploadedPath) {
        try {
          await StorageService.deleteFile(newUploadedPath);
        } catch {
          // Ignored
        }
      }
      res.status(500).json({ error: formatError(error) });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const actor = (req.query.actor as string) || 'admin';
      await DocumentsService.delete(req.params.id, actor);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },

  async reorder(req: Request, res: Response): Promise<void> {
    try {
      const type = req.params.type as 'notice' | 'resource';
      if (type !== 'notice' && type !== 'resource') {
        throw new AppError(400, 'Invalid document type');
      }
      const actor = req.body.actor || 'admin';
      const items = req.body.items || [];
      await DocumentsService.reorder(items, type, actor);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: formatError(error) });
    }
  },
};
