import { body } from 'express-validator';

export const loginRules = [
  body('email').trim().isEmail().withMessage('Enter a valid email').toLowerCase(),
  body('password').isString().notEmpty().withMessage('Password is required'),
];

export const changePasswordRules = [
  body('currentPassword').isString().notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isString()
    .isLength({ min: 10 })
    .withMessage('New password must be at least 10 characters')
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('New password must be different from the current one'),
];
