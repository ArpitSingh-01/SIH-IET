import { Router } from 'express';
import { scheduleController } from '../controllers/schedule.controller';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createAnnouncementSchema, updateAnnouncementSchema } from '../validators/announcements.schema';

const router = Router();

router.get('/', scheduleController.getPublished);
router.post('/', requireAuth, validate(createAnnouncementSchema), scheduleController.create);
router.patch('/:id', requireAuth, validate(updateAnnouncementSchema), scheduleController.update);
router.delete('/:id', requireAuth, scheduleController.delete);

export const scheduleRouter = router;
