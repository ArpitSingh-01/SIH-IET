import { Router } from 'express';
import { DocumentsController } from '../controllers/documents.controller';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { upload } from '../middlewares/multer';
import { createDocumentSchema, updateDocumentSchema } from '../validators/documents.schema';

const router = Router();

// Public reads
router.get('/:type', DocumentsController.getAll);

// Admin operations
router.post(
  '/',
  requireAuth,
  upload.single('file'),
  validate(createDocumentSchema),
  DocumentsController.create
);

router.patch(
  '/reorder/:type',
  requireAuth,
  DocumentsController.reorder
);

router.patch(
  '/:id',
  requireAuth,
  upload.single('file'),
  validate(updateDocumentSchema),
  DocumentsController.update
);

router.delete(
  '/:id',
  requireAuth,
  DocumentsController.delete
);

export const documentsRouter = router;
