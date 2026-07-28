import { Router } from 'express';
import { timelineController } from '../controllers/timeline.controller';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createTimelineSchema, updateTimelineSchema, reorderTimelineSchema } from '../validators/timeline.schema';

const router = Router();

router.get('/', timelineController.getVisible);
router.post('/', requireAuth, validate(createTimelineSchema), timelineController.create);
router.patch('/reorder', requireAuth, validate(reorderTimelineSchema), timelineController.reorder);
router.patch('/:id', requireAuth, validate(updateTimelineSchema), timelineController.update);
router.delete('/:id', requireAuth, timelineController.delete);

export const timelineRouter = router;
