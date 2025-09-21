import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  settings: {
    notificationInterval: { type: Number, default: 15 }, // minutes
    notificationsEnabled: { type: Boolean, default: true },
    webcamEnabled: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
