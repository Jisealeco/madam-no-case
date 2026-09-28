import mongoose from 'mongoose';
import slugify from '../utils/slugify.js';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 120 },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    summary: { type: String, trim: true, maxlength: 240, default: '' },
    description: { type: String, trim: true, maxlength: 3000, default: '' },
    // Named items offered under the service, e.g. the attire types available for rent.
    items: { type: [{ type: String, trim: true, maxlength: 80 }], default: [] },
    image: { type: String, trim: true, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

serviceSchema.pre('validate', function setSlug() {
  if (this.isModified('title') || !this.slug) this.slug = slugify(this.title || '');
});

serviceSchema.index({ order: 1, createdAt: 1 });

export default mongoose.model('Service', serviceSchema);
