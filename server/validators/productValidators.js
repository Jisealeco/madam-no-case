import { body, query } from 'express-validator';
import { PRODUCT_AVAILABILITY, PRODUCT_CATEGORIES } from '../config/constants.js';
import { optionalBoolean, optionalImageUrl } from './common.js';

// Empty string or null clears the price ("price on request").
const priceField = body('price')
  .optional()
  .customSanitizer((value) => (value === '' || value === null || value === 'null' ? null : value))
  .custom((value) => value === null || (!Number.isNaN(Number(value)) && Number(value) >= 0))
  .withMessage('Price must be a positive number or left empty')
  .customSanitizer((value) => (value === null ? null : Number(value)));

const shared = [
  body('description').optional().isString().trim().isLength({ max: 2000 }).withMessage('Description is too long'),
  priceField,
  body('availability')
    .optional()
    .isIn(PRODUCT_AVAILABILITY)
    .withMessage(`Availability must be one of: ${PRODUCT_AVAILABILITY.join(', ')}`),
  optionalBoolean('featured'),
  optionalImageUrl,
];

export const createProductRules = [
  body('name').isString().trim().isLength({ min: 2, max: 120 }).withMessage('Product name is required (2–120 characters)'),
  body('category').isIn(PRODUCT_CATEGORIES).withMessage('Choose a valid category'),
  ...shared,
];

export const updateProductRules = [
  body('name').optional().isString().trim().isLength({ min: 2, max: 120 }).withMessage('Product name must be 2–120 characters'),
  body('category').optional().isIn(PRODUCT_CATEGORIES).withMessage('Choose a valid category'),
  ...shared,
];

export const listProductRules = [
  query('category').optional().isIn(PRODUCT_CATEGORIES).withMessage('Unknown category'),
  query('availability').optional().isIn(PRODUCT_AVAILABILITY).withMessage('Unknown availability'),
  query('featured').optional().isBoolean().toBoolean(true),
  query('search').optional().isString().trim().isLength({ max: 80 }),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];
