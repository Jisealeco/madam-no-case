/**
 * Starts a real MongoDB server on this machine for local development, with no
 * separate MongoDB install. The first run downloads the official mongod binary
 * (several hundred MB, cached in ~/.cache/mongodb-binaries afterwards). Data is saved in server/.mongo-data, so it is
 * kept between restarts.
 *
 *   npm run db:local            -> mongodb://127.0.0.1:27017/madam-no-case
 *
 * If you already have a mongod executable (e.g. from a MongoDB zip), skip the
 * download by setting MONGOD_BINARY=C:\path\to\mongod.exe in server/.env.
 *
 * For production use MongoDB Atlas or a managed MongoDB server instead.
 */
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { SERVER_ROOT } from '../config/paths.js';

dotenv.config({ path: path.join(SERVER_ROOT, '.env'), quiet: true });

const port = Number(process.env.LOCAL_MONGO_PORT) || 27017;
const systemBinary = process.env.MONGOD_BINARY || undefined;
const dbPath = path.join(SERVER_ROOT, '.mongo-data');
fs.mkdirSync(dbPath, { recursive: true });

console.log(
  systemBinary
    ? `[db:local] Starting MongoDB from ${systemBinary}...`
    : '[db:local] Starting MongoDB (the first run downloads the binary, please wait)...'
);

const mongod = await MongoMemoryServer.create({
  instance: { port, ip: '127.0.0.1', dbPath, storageEngine: 'wiredTiger' },
  ...(systemBinary ? { binary: { systemBinary } } : {}),
});

console.log(`[db:local] MongoDB is running at mongodb://127.0.0.1:${port}/madam-no-case`);
console.log(`[db:local] Data directory: ${dbPath}`);
console.log('[db:local] Keep this terminal open. Press Ctrl+C to stop.');

const stop = async () => {
  await mongod.stop({ doCleanup: false });
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
