import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const SALT_ROUNDS = 12;

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 80 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email is invalid'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [10, 'Password must be at least 10 characters'],
      select: false,
    },
    role: { type: String, enum: ['admin'], default: 'admin' },
    isActive: { type: Boolean, default: true },
    passwordChangedAt: Date,
    lastLoginAt: Date,
  },
  { timestamps: true }
);

adminSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  // Back-date by a second so a token issued right after this save is still valid.
  if (!this.isNew) this.passwordChangedAt = new Date(Date.now() - 1000);
});

adminSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

/** True if the password changed after the token (issued at `iat`, in seconds) was created. */
adminSchema.methods.changedPasswordAfter = function changedPasswordAfter(iat) {
  if (!this.passwordChangedAt) return false;
  return Math.floor(this.passwordChangedAt.getTime() / 1000) > iat;
};

adminSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Admin', adminSchema);
