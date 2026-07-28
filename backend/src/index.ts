import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { env } from './config/env';
import { initializeFirebase } from './config/firebase';
import { authRouter } from './routes/auth';
import { announcementsRouter } from './routes/announcements';
import { scheduleRouter } from './routes/schedule';
import { timelineRouter } from './routes/timeline';
import { contactsRouter } from './routes/contacts';
import { settingsRouter } from './routes/settings';
import { notificationsRouter } from './routes/notifications';
import { healthRouter } from './routes/health';
import { activityRouter } from './routes/activity';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/logger';
import { formsRouter } from './routes/forms';
import { documentsRouter } from './routes/documents';

// Initialize Firebase Admin SDK
initializeFirebase();

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json({ limit: '10kb' }));
app.use(requestLogger);

// Global rate limiting: 200 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/timeline', timelineRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/activity', activityRouter);
app.use('/api/forms', formsRouter);
app.use('/api/documents', documentsRouter);

// Global error handler
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Backend running on port ${env.PORT} (${env.NODE_ENV})`);
});
