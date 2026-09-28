import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Runs an array of express-validator chains and responds with 422 and a
 * field-by-field error list if any fail. (Any file uploaded with an invalid
 * request is removed by the error handler.)
 */
export default function validate(chains) {
  return async (req, res, next) => {
    for (const chain of chains) {
      await chain.run(req);
    }
    const result = validationResult(req);
    if (result.isEmpty()) return next();

    const errors = result.array({ onlyFirstError: true }).map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    throw ApiError.validation(errors);
  };
}
