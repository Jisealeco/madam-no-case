import jwt from 'jsonwebtoken';
import { matchedData } from 'express-validator';
import env from '../config/env.js';
import Admin from '../models/Admin.js';
import ApiError from '../utils/ApiError.js';
import { sendSuccess } from '../utils/apiResponse.js';

const signToken = (admin) => jwt.sign({ sub: admin.id, role: admin.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = matchedData(req, { locations: ['body'] });

  const admin = await Admin.findOne({ email }).select('+password');
  // Same message for unknown email and wrong password, so accounts can't be enumerated.
  if (!admin || !admin.isActive || !(await admin.comparePassword(password))) {
    throw ApiError.unauthorized('Incorrect email or password');
  }

  admin.lastLoginAt = new Date();
  await admin.save({ validateBeforeSave: false });

  sendSuccess(res, {
    message: 'Logged in',
    data: { token: signToken(admin), admin: admin.toJSON() },
  });
}

// GET /api/auth/me
export async function getMe(req, res) {
  sendSuccess(res, { data: { admin: req.admin } });
}

// PUT /api/auth/password
export async function changePassword(req, res) {
  const { currentPassword, newPassword } = matchedData(req, { locations: ['body'] });

  const admin = await Admin.findById(req.admin.id).select('+password');
  if (!(await admin.comparePassword(currentPassword))) {
    throw ApiError.validation([{ field: 'currentPassword', message: 'Current password is incorrect' }]);
  }

  admin.password = newPassword;
  await admin.save();

  sendSuccess(res, {
    message: 'Password updated',
    data: { token: signToken(admin), admin: admin.toJSON() },
  });
}
