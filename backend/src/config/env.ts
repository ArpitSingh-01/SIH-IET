import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || '*',

  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,

  JWT_SECRET: process.env.JWT_SECRET!,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH!,

  FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '',
};

// Validate required env vars at startup
const required = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD_HASH',
] as const;

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}
