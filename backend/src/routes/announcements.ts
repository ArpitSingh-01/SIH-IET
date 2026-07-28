import { Router } from 'express';
import { announcementsController } from '../controllers/announcements.controller';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createAnnouncementSchema, updateAnnouncementSchema } from '../validators/announcements.schema';

const router = Router();

router.get('/', announcementsController.getPublished);
router.post('/', requireAuth, validate(createAnnouncementSchema), announcementsController.create);
router.patch('/:id', requireAuth, validate(updateAnnouncementSchema), announcementsController.update);
router.delete('/:id', requireAuth, announcementsController.delete);

export const announcementsRouter = router;
