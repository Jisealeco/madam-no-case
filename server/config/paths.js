import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

export const SERVER_ROOT = path.resolve(here, '..');
export const UPLOADS_DIR = path.join(SERVER_ROOT, 'uploads');
export const SEED_IMAGES_DIR = path.join(SERVER_ROOT, 'seed', 'images');
