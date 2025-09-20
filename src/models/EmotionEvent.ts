import mongoose from 'mongoose';

const EmotionEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
  emotion: { 
    type: String, 
    enum: ["focused", "tired", "stressed"], 
    required: true 
  },
  confidence: { type: Number, default: 0 }, // 0-1 confidence score
  timeOfDay: {
    type: String,
    enum: ["morning", "afternoon", "evening", "late_night"],
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
EmotionEventSchema.index({ userId: 1, timestamp: -1 });
EmotionEventSchema.index({ userId: 1, timeOfDay: 1, timestamp: -1 });

export default mongoose.models.EmotionEvent || mongoose.model("EmotionEvent", EmotionEventSchema);
