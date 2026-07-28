import { getMessaging } from 'firebase-admin/messaging';
import { notificationsRepo } from '../repositories/notifications.repo';
import { activityRepo } from '../repositories/activity.repo';
import { isFirebaseReady } from '../config/firebase';

export const notificationsService = {
  async registerToken(token: string) {
    await notificationsRepo.upsertToken(token);
  },

  async getTokenCount() {
    return notificationsRepo.count();
  },

  async sendToAll(title: string, body: string, url: string, actor: string) {
    if (!isFirebaseReady()) {
      throw new Error('Firebase is not configured. Push notifications are disabled.');
    }

    const tokens = await notificationsRepo.getAllTokens();

    if (tokens.length === 0) {
      await activityRepo.create(actor, 'sent_notification', `${title} (0 devices)`);
      return { sent: 0, failed: 0, cleaned: 0 };
    }

    const results = await Promise.allSettled(
      tokens.map(({ token }) =>
        getMessaging().send({
          token,
          notification: { title, body },
          webpush: {
            fcmOptions: { link: url },
            notification: {
              icon: '/icons/icon-192x192.png',
            },
          },
        })
      )
    );

    // Clean up invalid tokens
    const invalidTokens: string[] = [];
    let sent = 0;
    let failed = 0;

    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        sent++;
      } else {
        failed++;
        const err = (result.reason as any)?.errorInfo?.code;
        if (
          err === 'messaging/registration-token-not-registered' ||
          err === 'messaging/invalid-registration-token'
        ) {
          invalidTokens.push(tokens[i].token);
        }
      }
    });

    if (invalidTokens.length > 0) {
      await notificationsRepo.deleteTokens(invalidTokens);
    }

    await activityRepo.create(
      actor,
      'sent_notification',
      `${title} — sent: ${sent}, failed: ${failed}, cleaned: ${invalidTokens.length}`
    );

    return { sent, failed, cleaned: invalidTokens.length };
  },
};
