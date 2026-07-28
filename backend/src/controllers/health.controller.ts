import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { isFirebaseReady } from '../config/firebase';

export const healthController = {
  async check(_req: Request, res: Response): Promise<void> {
    const start = Date.now();
    try {
      const { error } = await supabase.from('settings').select('key').limit(1);
      const dbOk = !error;
      const responseTime = Date.now() - start;

      res.json({
        status: dbOk ? 'ok' : 'degraded',
        backend: true,
        database: dbOk,
        fcm: isFirebaseReady(),
        responseTime,
        timestamp: new Date().toISOString(),
      });
    } catch {
      res.status(503).json({
        status: 'error',
        backend: true,
        database: false,
        fcm: isFirebaseReady(),
        responseTime: Date.now() - start,
        timestamp: new Date().toISOString(),
      });
    }
  },
};
