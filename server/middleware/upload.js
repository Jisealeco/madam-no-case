import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import env from '../config/env.js';
import { UPLOADS_DIR } from '../config/paths.js';
import ApiError from '../utils/ApiError.js';

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const ALLOWED = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ALLOWED[file.mimetype]}`),
});

const upload = multer({
  storage,
  limits: { fileSize: env.maxUploadMb * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED[file.mimetype]) return cb(null, true);
    cb(ApiError.badRequest('Only JPEG, PNG, WebP or AVIF images are allowed'));
  },
});

/** Accepts an optional single image in the "image" field of a multipart form. */
export const uploadImage = upload.single('image');
