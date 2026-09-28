import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import Admin from '../models/Admin.js';
import ApiError from '../utils/ApiError.js';

function readBearerToken(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  return scheme === 'Bearer' && token ? token : null;
}

async function resolveAdmin(token) {
  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch (err) {
    throw ApiError.unauthorized(
      err.name === 'TokenExpiredError' ? 'Session expired, please log in again' : 'Invalid token'
    );
  }

  const admin = await Admin.findById(payload.sub);
  if (!admin || !admin.isActive) throw ApiError.unauthorized('Account no longer exists or is disabled');
  if (admin.changedPasswordAfter(payload.iat)) {
    throw ApiError.unauthorized('Password was changed, please log in again');
  }
  return admin;
}

/** Requires a valid admin JWT in the Authorization header. */
export async function protect(req, res, next) {
  const token = readBearerToken(req);
  if (!token) throw ApiError.unauthorized('Authentication required');
  req.admin = await resolveAdmin(token);
  next();
}

/** Attaches req.admin when a valid token is sent, but never blocks the request. */
export async function optionalAuth(req, res, next) {
  const token = readBearerToken(req);
  if (token) {
    try {
      req.admin = await resolveAdmin(token);
    } catch {
      req.admin = undefined;
    }
  }
  next();
}
