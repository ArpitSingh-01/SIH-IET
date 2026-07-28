import { Router } from 'express';
import { notificationsController } from '../controllers/notifications.controller';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { registerTokenSchema, sendNotificationSchema } from '../validators/notifications.schema';

const router = Router();

router.post('/register', validate(registerTokenSchema), notificationsController.register);
router.post('/send', requireAuth, validate(sendNotificationSchema), notificationsController.send);
router.get('/count', requireAuth, notificationsController.getTokenCount);

export const notificationsRouter = router;
