import fs from 'node:fs';
import path from 'node:path';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import env from './config/env.js';
import { SERVER_ROOT, UPLOADS_DIR } from './config/paths.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiters.js';
import apiRoutes from './routes/index.js';
import ApiError from './utils/ApiError.js';

const app = express();

if (env.trustProxy) app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  helmet({
    // Allow the React app (a different origin in development) to display uploaded images.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        'style-src': ["'self'", "'unsafe-inline'"],
        'font-src': ["'self'", 'data:'],
        'img-src': ["'self'", 'data:', 'blob:', 'https:'],
        'frame-src': ["'self'", 'https://maps.google.com', 'https://www.google.com'],
        // HTTPS should be enforced by the host; this directive would break a local http:// production run.
        'upgrade-insecure-requests': null,
      },
    },
  })
);

app.use(
  cors({
    origin(origin, callback) {
      // Requests with no Origin header (curl, server-to-server, same-origin) are allowed.
      if (!origin || env.clientOrigins.includes(origin)) return callback(null, true);
      // In development, any local port is fine (Vite moves to 5174+ when 5173 is busy).
      if (!env.isProduction && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return callback(null, true);
      callback(ApiError.forbidden(`Origin ${origin} is not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
  })
);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
if (!env.isProduction) app.use(morgan('dev'));

app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d', fallthrough: false }));
app.use('/api', apiLimiter, apiRoutes);
app.use('/api', notFound);

// In production the built React app can be served from the same server.
const clientDist = path.resolve(SERVER_ROOT, '..', 'client', 'dist');
if (env.isProduction && fs.existsSync(clientDist)) {
  app.use(express.static(clientDist, { maxAge: '1d', index: false }));
  app.get('/{*splat}', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

// In development, someone opening the API address in a browser gets pointed to the website.
if (!env.isProduction) {
  app.get('/', (req, res) => {
    res.type('html').send(`<!doctype html><meta charset="utf-8"><title>Madam No Case API</title>
<body style="font-family:system-ui;background:#fdfaf4;color:#4a0d27;display:grid;place-items:center;min-height:100vh;margin:0">
<div style="max-width:32rem;padding:2rem;text-align:center"><h1 style="font-family:Georgia,serif">This is the API server</h1>
<p>The website runs on the address shown after <b>WEBSITE READY</b> in your terminal, usually
<a href="http://localhost:5173">localhost:5173</a> or <a href="http://localhost:5174">localhost:5174</a>
(Vite uses 5174 when 5173 is taken by another project).</p>
<p>API status: <a href="/api/health">/api/health</a></p></div></body>`);
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;
