import mongoose from 'mongoose';
import { INQUIRY_STATUSES } from '../config/constants.js';

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 100 },
    phone: { type: String, required: [true, 'Phone number is required'], trim: true, maxlength: 30 },
    email: { type: String, trim: true, lowercase: true, maxlength: 120, default: '' },
    serviceNeeded: { type: String, trim: true, maxlength: 120, default: '' },
    eventDate: { type: Date },
    message: { type: String, required: [true, 'Message is required'], trim: true, maxlength: 2000 },
    status: { type: String, enum: INQUIRY_STATUSES, default: 'new', index: true },
    adminNote: { type: String, trim: true, maxlength: 1000, default: '' },
  },
  // `createdAt` is the submission date.
  { timestamps: true, versionKey: false }
);

inquirySchema.index({ createdAt: -1 });

export default mongoose.model('Inquiry', inquirySchema);
