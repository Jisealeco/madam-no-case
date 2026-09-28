import { matchedData } from 'express-validator';
import Inquiry from '../models/Inquiry.js';
import ApiError from '../utils/ApiError.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { notifyNewInquiry } from '../utils/mailer.js';

// POST /api/contact  (public)
export async function createInquiry(req, res) {
  const { name, phone, email, serviceNeeded, eventDate, message } = matchedData(req, { locations: ['body'] });

  const inquiry = await Inquiry.create({ name, phone, email, serviceNeeded, eventDate, message });

  // Email is a convenience; a mail failure must not lose or fail the inquiry.
  notifyNewInquiry(inquiry).catch((err) => console.warn(`[mail] Inquiry notification failed: ${err.message}`));

  sendSuccess(res, {
    status: 201,
    message: 'Thank you! Your message has been received. We will get back to you shortly.',
    data: { id: inquiry.id, createdAt: inquiry.createdAt },
  });
}

// GET /api/contact  (admin)
export async function listInquiries(req, res) {
  const { status, page = 1, limit = 20 } = matchedData(req, { locations: ['query'] });
  const filter = status ? { status } : {};

  const [items, total, unread] = await Promise.all([
    Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Inquiry.countDocuments(filter),
    Inquiry.countDocuments({ status: 'new' }),
  ]);

  sendSuccess(res, {
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) || 1, unread },
  });
}

// GET /api/contact/:id  (admin)
export async function getInquiry(req, res) {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) throw ApiError.notFound('Inquiry not found');
  sendSuccess(res, { data: inquiry });
}

// PATCH /api/contact/:id  (admin) — update status / private note
export async function updateInquiry(req, res) {
  const updates = matchedData(req, { locations: ['body'] });
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, updates, { returnDocument: 'after', runValidators: true });
  if (!inquiry) throw ApiError.notFound('Inquiry not found');
  sendSuccess(res, { message: 'Inquiry updated', data: inquiry });
}

// DELETE /api/contact/:id  (admin)
export async function deleteInquiry(req, res) {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
  if (!inquiry) throw ApiError.notFound('Inquiry not found');
  sendSuccess(res, { message: 'Inquiry deleted', data: { id: inquiry.id } });
}
