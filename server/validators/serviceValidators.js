import { body } from 'express-validator';
import { optionalBoolean, optionalImageUrl, optionalInt } from './common.js';

/** `items` may arrive as a JSON array, a JSON string (multipart), or comma/newline separated text. */
const itemsField = body('items')
  .optional()
  .customSanitizer((value) => {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return value;
      }
    }
    return trimmed.split(/[\n,]/);
  })
  .custom((value) => Array.isArray(value) && value.every((item) => typeof item === 'string' && item.length <= 80))
  .withMessage('items must be a list of short text values')
  .customSanitizer((value) => value.map((item) => item.trim()).filter(Boolean));

const shared = [
  body('summary').optional().isString().trim().isLength({ max: 240 }).withMessage('Summary is too long (max 240)'),
  body('description').optional().isString().trim().isLength({ max: 3000 }).withMessage('Description is too long'),
  itemsField,
  optionalImageUrl,
  optionalInt('order'),
  optionalBoolean('isActive'),
];

export const createServiceRules = [
  body('title').isString().trim().isLength({ min: 2, max: 120 }).withMessage('Title is required (2–120 characters)'),
  ...shared,
];

export const updateServiceRules = [
  body('title').optional().isString().trim().isLength({ min: 2, max: 120 }).withMessage('Title must be 2–120 characters'),
  ...shared,
];
