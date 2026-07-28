import { Router } from 'express';
import { FormsController } from '../controllers/forms.controller';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createFormSchema, updateFormSchema } from '../validators/forms.schema';

const router = Router();

// Public read
router.get('/', FormsController.getAll);

// Admin operations
router.post('/', requireAuth, validate(createFormSchema), FormsController.create);
router.patch('/reorder', requireAuth, FormsController.reorder);
router.patch('/:id', requireAuth, validate(updateFormSchema), FormsController.update);
router.delete('/:id', requireAuth, FormsController.delete);

export const formsRouter = router;
