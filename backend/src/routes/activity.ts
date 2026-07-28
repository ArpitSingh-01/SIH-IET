import { Router } from 'express';
import { activityController } from '../controllers/activity.controller';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/', requireAuth, activityController.getRecent);
router.get('/stats', requireAuth, activityController.getStats);

export const activityRouter = router;
