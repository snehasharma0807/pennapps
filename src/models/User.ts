import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // Authentication fields
  password: { type: String, select: false }, // Never include in queries by default
  
  // Common fields
  email: { type: String, required: true },
  name: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  
  // User settings
  settings: {
    notificationInterval: { type: Number, default: 15 }, // minutes
    notificationsEnabled: { type: Boolean, default: true },
    webcamEnabled: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Index for efficient queries
UserSchema.index({ email: 1 }, { unique: true });

// Validation removed for now to allow custom auth users
// UserSchema.pre('save', function(next) {
//   next();
// });

export default mongoose.models.User || mongoose.model("User", UserSchema);
