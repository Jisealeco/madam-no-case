import mongoose from 'mongoose';
import { GALLERY_CATEGORIES } from '../config/constants.js';

const galleryImageSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 120 },
    caption: { type: String, trim: true, maxlength: 400, default: '' },
    category: {
      type: String,
      enum: { values: GALLERY_CATEGORIES, message: 'Unknown category "{VALUE}"' },
      default: 'Other',
    },
    image: { type: String, required: [true, 'Image is required'], trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

galleryImageSchema.index({ order: 1, createdAt: -1 });

export default mongoose.model('GalleryImage', galleryImageSchema);
