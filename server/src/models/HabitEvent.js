import mongoose from 'mongoose';

const habitEventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true, index: true },
    day: { type: Date, required: true, index: true }, // Truncated to start of day (00:00)
  },
  { timestamps: true }
);

habitEventSchema.index({ userId: 1, habitId: 1, day: 1 }, { unique: true });

export const HabitEvent = mongoose.model('HabitEvent', habitEventSchema);


