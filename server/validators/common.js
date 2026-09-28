import { body, param } from 'express-validator';

export const mongoIdParam = [param('id').isMongoId().withMessage('Invalid id')];

/** Accepts booleans sent as JSON booleans or multipart strings ("true"/"false"). */
export const optionalBoolean = (field) =>
  body(field)
    .optional()
    .isBoolean()
    .withMessage(`${field} must be true or false`)
    .toBoolean(true);

/** Image can be an uploaded file or a URL/path in `imageUrl`. */
export const optionalImageUrl = body('imageUrl')
  .optional({ values: 'falsy' })
  .isString()
  .trim()
  .custom((value) => value.startsWith('/uploads/') || /^https?:\/\/\S+$/i.test(value))
  .withMessage('imageUrl must be an http(s) URL or an /uploads/ path');

export const optionalInt = (field, { min = 0, max = 100000 } = {}) =>
  body(field)
    .optional({ values: 'falsy' })
    .isInt({ min, max })
    .withMessage(`${field} must be a whole number`)
    .toInt();
