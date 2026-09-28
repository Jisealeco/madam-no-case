import mongoose from 'mongoose';
import { PRODUCT_AVAILABILITY, PRODUCT_CATEGORIES } from '../config/constants.js';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 2000, default: '' },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: { values: PRODUCT_CATEGORIES, message: 'Unknown category "{VALUE}"' },
    },
    // Optional: many items are priced on enquiry.
    price: { type: Number, min: [0, 'Price cannot be negative'], default: null },
    image: { type: String, trim: true, default: '' },
    availability: {
      type: String,
      enum: { values: PRODUCT_AVAILABILITY, message: 'Unknown availability "{VALUE}"' },
      default: 'available',
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
