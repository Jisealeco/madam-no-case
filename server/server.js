import env from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import app from './app.js';

async function start() {
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(`[server] Madam No Case API running on http://localhost:${env.port} (${env.nodeEnv})`);
  });

  const shutdown = (signal) => {
    console.log(`[server] ${signal} received, shutting down...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

process.on('unhandledRejection', (reason) => {
  console.error('[server] Unhandled promise rejection:', reason);
});

start().catch(() => process.exit(1));
