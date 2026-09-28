import mongoose from 'mongoose';
import multer from 'multer';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import { removeUploadedFile, toPublicPath } from '../utils/files.js';

export function notFound(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

function normalise(err) {
  if (err instanceof ApiError) return err;

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return ApiError.validation(errors);
  }

  if (err instanceof mongoose.Error.CastError) {
    return ApiError.badRequest(`Invalid value for ${err.path}`);
  }

  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return new ApiError(409, `A record with this ${field} already exists`, [
      { field, message: 'Must be unique' },
    ]);
  }

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? `Image must be ${env.maxUploadMb}MB or smaller` : err.message;
    return ApiError.badRequest(message, [{ field: err.field || 'image', message }]);
  }

  if (err?.type === 'entity.parse.failed') return ApiError.badRequest('Malformed JSON in request body');
  if (err?.type === 'entity.too.large') return new ApiError(413, 'Request body is too large');

  return new ApiError(err?.statusCode || err?.status || 500, err?.message || 'Internal server error');
}

// Express recognises error handlers by their four arguments.
// eslint-disable-next-line no-unused-vars
export async function errorHandler(err, req, res, next) {
  const apiError = normalise(err);
  const status = apiError.statusCode >= 400 && apiError.statusCode < 600 ? apiError.statusCode : 500;

  if (req.file) await removeUploadedFile(toPublicPath(req.file));

  if (status >= 500) console.error('[error]', err);

  const body = {
    success: false,
    message: status >= 500 && env.isProduction ? 'Something went wrong on our side' : apiError.message,
  };
  if (apiError.errors) body.errors = apiError.errors;
  if (!env.isProduction && status >= 500 && err?.stack) body.stack = err.stack;

  res.status(status).json(body);
}
