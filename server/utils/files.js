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
 * Deletes an uploaded image only if no service, product or gallery item still uses it.
 * Use this after deleting or re-imaging a record: the same photo can be shared,
 * e.g. by a product and its gallery entry.
 */
export async function removeUploadedFileIfUnused(publicPath) {
  if (!publicPath || !publicPath.startsWith('/uploads/')) return;
  const [{ default: Service }, { default: Product }, { default: GalleryImage }] = await Promise.all([
    import('../models/Service.js'),
    import('../models/Product.js'),
    import('../models/GalleryImage.js'),
  ]);
  const counts = await Promise.all([Service, Product, GalleryImage].map((Model) => Model.countDocuments({ image: publicPath })));
  if (counts.every((n) => n === 0)) await removeUploadedFile(publicPath);
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
