import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { updateSettingSchema } from '../validators/settings.schema';

const router = Router();

router.get('/:key', settingsController.get);
router.put('/:key', requireAuth, validate(updateSettingSchema), settingsController.update);

export const settingsRouter = router;
