import { z } from 'zod';
import { Habit } from '../models/Habit.js';
import { HabitEvent } from '../models/HabitEvent.js';
import StreakService from '../services/streakService.js';

const createSchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().optional(),
  completedToday: z.boolean().optional(),
  streak: z.number().int().min(0).optional(),
});

export async function listHabits(req, res, next) {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ habits });
  } catch (err) {
    next(err);
  }
}

export async function createHabit(req, res, next) {
  try {
    const { name, color } = createSchema.parse(req.body);
    const habit = await Habit.create({ userId: req.userId, name, color });
    res.status(201).json({ habit });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors?.[0]?.message || 'Invalid input' });
    }
    next(err);
  }
}

export async function updateHabit(req, res, next) {
  try {
    const payload = updateSchema.parse(req.body);
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: payload },
      { new: true }
    );
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    res.json({ habit });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors?.[0]?.message || 'Invalid input' });
    }
    next(err);
  }
}

export async function deleteHabit(req, res, next) {
  try {
    const result = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!result) return res.status(404).json({ error: 'Habit not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function toggleHabit(req, res, next) {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (habit.completedToday) {
      // Undo today's completion
      habit.completedToday = false;
      habit.prevLastCompletedAt = habit.lastCompletedAt;
      habit.lastCompletedAt = null;
      
      // Remove today's event if exists
      await HabitEvent.deleteOne({ userId: req.userId, habitId: habit.id, day: startOfToday });
    } else {
      // Mark as completed today
      habit.completedToday = true;
      habit.prevLastCompletedAt = habit.lastCompletedAt;
      habit.lastCompletedAt = now;
      
      // Upsert today's completion event
      await HabitEvent.updateOne(
        { userId: req.userId, habitId: habit.id, day: startOfToday },
        { $set: { userId: req.userId, habitId: habit.id, day: startOfToday } },
        { upsert: true }
      );
    }
    
    await habit.save();
    
    // Update streaks using the streak service for accurate calculation
    await StreakService.updateUserStreaks(req.userId);
    
    // Get the updated habit with correct streak
    const updatedHabit = await Habit.findById(habit._id);
    res.json({ habit: updatedHabit });
  } catch (err) {
    next(err);
  }
}


