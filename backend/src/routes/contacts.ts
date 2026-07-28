import { Router } from 'express';
import { contactsController } from '../controllers/contacts.controller';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createContactSchema, updateContactSchema } from '../validators/contacts.schema';

const router = Router();

router.get('/', contactsController.getVisible);
router.post('/', requireAuth, validate(createContactSchema), contactsController.create);
router.patch('/:id', requireAuth, validate(updateContactSchema), contactsController.update);
router.delete('/:id', requireAuth, contactsController.delete);

export const contactsRouter = router;
