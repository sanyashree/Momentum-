import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    color: { type: String, default: 'bg-emerald-100' },
    streak: { type: Number, default: 0 },
    completedToday: { type: Boolean, default: false },
    lastCompletedAt: { type: Date, default: null },
    prevLastCompletedAt: { type: Date, default: null },
    prevStreak: { type: Number, default: null },
  },
  { timestamps: true }
);

export const Habit = mongoose.model('Habit', habitSchema);


