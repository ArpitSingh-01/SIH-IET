import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { authController } from '../controllers/auth.controller';

const router = Router();

// Stricter rate limit for login: 5 attempts per 15 minutes
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again later.' },
});

router.post('/login', loginRateLimit, authController.login);

export const authRouter = router;
