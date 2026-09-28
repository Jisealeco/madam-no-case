import mongoose from 'mongoose';
import env from './env.js';

// Wrap any `$`-prefixed keys in query filters with $eq, blocking operator injection.
mongoose.set('sanitizeFilter', true);
mongoose.set('strictQuery', true);

export async function connectDB() {
  try {
    const conn = await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`[db] Could not connect to MongoDB: ${err.message}`);
    console.error('[db] Check MONGODB_URI in server/.env, or run "npm run db:local" for a local database.');
    throw err;
  }
}

export async function disconnectDB() {
  await mongoose.connection.close();
}
