import { body, query } from 'express-validator';
import { GALLERY_CATEGORIES } from '../config/constants.js';
import { optionalImageUrl, optionalInt } from './common.js';

const shared = [
  body('caption').optional().isString().trim().isLength({ max: 400 }).withMessage('Caption is too long (max 400)'),
  body('category').optional().isIn(GALLERY_CATEGORIES).withMessage('Choose a valid category'),
  optionalInt('order'),
  optionalImageUrl,
];

export const createGalleryRules = [
  body('title').isString().trim().isLength({ min: 2, max: 120 }).withMessage('Title is required (2–120 characters)'),
  ...shared,
  body('imageUrl')
    .custom((value, { req }) => Boolean(req.file || value))
    .withMessage('Upload an image or provide an imageUrl'),
];

export const updateGalleryRules = [
  body('title').optional().isString().trim().isLength({ min: 2, max: 120 }).withMessage('Title must be 2–120 characters'),
  ...shared,
];

export const listGalleryRules = [query('category').optional().isIn(GALLERY_CATEGORIES).withMessage('Unknown category')];
