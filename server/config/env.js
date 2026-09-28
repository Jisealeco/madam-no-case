import path from 'node:path';
import dotenv from 'dotenv';
import { SERVER_ROOT } from './paths.js';

dotenv.config({ path: path.join(SERVER_ROOT, '.env'), quiet: true });

const required = ['MONGODB_URI', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key] || !process.env[key].trim());

if (missing.length) {
  console.error(
    `\n[config] Missing required environment variable(s): ${missing.join(', ')}\n` +
      '[config] Copy server/.env.example to server/.env and fill in the values.\n'
  );
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === 'production';

if (process.env.JWT_SECRET.length < 32) {
  const msg = '[config] JWT_SECRET should be at least 32 characters long.';
  if (isProduction) {
    console.error(msg);
    process.exit(1);
  }
  console.warn(`${msg} (allowed in development only)`);
}

const splitList = (value) =>
  (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigins: splitList(process.env.CLIENT_ORIGIN || 'http://localhost:5173'),
  trustProxy: process.env.TRUST_PROXY === 'true',
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB) || 5,
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.MAIL_FROM || '',
  },
  notifyEmail: process.env.NOTIFY_EMAIL || '',
};

export default env;
