import { body, query } from 'express-validator';
import { INQUIRY_STATUSES } from '../config/constants.js';

export const createInquiryRules = [
  body('name').isString().trim().isLength({ min: 2, max: 100 }).withMessage('Please enter your name'),
  body('phone')
    .isString()
    .trim()
    .matches(/^\+?[0-9\s\-()]{7,20}$/)
    .withMessage('Please enter a valid phone number'),
  body('email')
    .optional({ values: 'falsy' })
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .toLowerCase(),
  body('serviceNeeded').optional({ values: 'falsy' }).isString().trim().isLength({ max: 120 }),
  body('eventDate')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Event date must be a valid date')
    .toDate(),
  body('message')
    .isString()
    .trim()
    .isLength({ min: 5, max: 2000 })
    .withMessage('Message should be between 5 and 2000 characters'),
  // Honeypot: real visitors never see or fill this field.
  body('website').optional().isEmpty().withMessage('Spam detected'),
];

export const listInquiryRules = [
  query('status').optional().isIn(INQUIRY_STATUSES).withMessage('Unknown status'),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

export const updateInquiryRules = [
  body('status').optional().isIn(INQUIRY_STATUSES).withMessage(`Status must be one of: ${INQUIRY_STATUSES.join(', ')}`),
  body('adminNote').optional().isString().trim().isLength({ max: 1000 }),
];
