/**
 * Every successful response has the shape:
 *   { success: true, message?: string, data: any, meta?: object }
 * Errors (see middleware/errorHandler.js) have the shape:
 *   { success: false, message: string, errors?: [{ field, message }] }
 */
export function sendSuccess(res, { status = 200, message, data = null, meta } = {}) {
  const body = { success: true };
  if (message) body.message = message;
  body.data = data;
  if (meta) body.meta = meta;
  return res.status(status).json(body);
}
