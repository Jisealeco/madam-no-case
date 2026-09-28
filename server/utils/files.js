import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOADS_DIR } from '../config/paths.js';

/** Public URL path for a file saved by multer into the uploads folder. */
export const toPublicPath = (file) => `/uploads/${file.filename}`;

/**
 * Deletes a previously uploaded file. Only paths under /uploads/ are touched,
 * so external image URLs are left alone.
 */
export async function removeUploadedFile(publicPath) {
  if (!publicPath || !publicPath.startsWith('/uploads/')) return;
  const filename = path.basename(publicPath);
  try {
    await fs.unlink(path.join(UPLOADS_DIR, filename));
  } catch (err) {
    if (err.code !== 'ENOENT') console.warn(`[files] Could not remove ${filename}: ${err.message}`);
  }
}

/**
 * Picks the image value for a create/update request: an uploaded file wins,
 * then an explicit imageUrl field. Returns undefined when neither was sent.
 */
export function resolveImage(req) {
  if (req.file) return toPublicPath(req.file);
  if (typeof req.body.imageUrl === 'string') return req.body.imageUrl.trim();
  return undefined;
}
