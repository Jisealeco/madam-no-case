/**
 * Creates the admin account (or resets its password).
 *
 *   npm run create-admin -- --email owner@example.com --password "a-long-password" --name "Owner"
 *   npm run create-admin -- --email owner@example.com --password "new-password" --reset
 *
 * Values can also come from ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME in server/.env.
 */
import { parseArgs } from 'node:util';
import { connectDB, disconnectDB } from '../config/db.js';
import Admin from '../models/Admin.js';

const { values } = parseArgs({
  options: {
    email: { type: 'string' },
    password: { type: 'string' },
    name: { type: 'string' },
    reset: { type: 'boolean', default: false },
  },
});

const email = (values.email || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = values.password || process.env.ADMIN_PASSWORD || '';
const name = values.name || process.env.ADMIN_NAME || 'Madam No Case Admin';

if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
  console.error('Provide a valid admin email: --email you@example.com (or ADMIN_EMAIL in .env)');
  process.exit(1);
}
if (password.length < 10) {
  console.error('Provide a password of at least 10 characters: --password "..." (or ADMIN_PASSWORD in .env)');
  process.exit(1);
}

try {
  await connectDB();
  const existing = await Admin.findOne({ email });

  if (existing && !values.reset) {
    console.log(`An admin with email ${email} already exists. Re-run with --reset to change the password.`);
  } else if (existing) {
    existing.password = password;
    existing.isActive = true;
    await existing.save();
    console.log(`Password reset for ${email}. Existing sessions have been signed out.`);
  } else {
    await Admin.create({ name, email, password });
    console.log(`Admin created: ${email}. Log in at http://localhost:5173/admin`);
  }
} catch (err) {
  console.error(`Failed: ${err.message}`);
  process.exitCode = 1;
} finally {
  await disconnectDB();
}
