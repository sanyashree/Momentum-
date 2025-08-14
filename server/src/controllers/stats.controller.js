// Aggregations for charts. Timezone normalized to Asia/Kolkata.
// Works even if HabitEvent only has createdAt; if you also store `date` (YYYY-MM-DD), the pipeline still works.

import mongoose from 'mongoose';
import { HabitEvent } from '../models/HabitEvent.js'; // { userId, habitId, createdAt, ... }
import { Habit } from '../models/Habit.js';
import StreakService from '../services/streakService.js';

const TZ = "Asia/Kolkata";

// helper: get Date range for last 7 days [start, end)
function last7DaysRange() {
  const now = new Date();
  // end = tomorrow 00:00:00 in IST
  const end = new Date(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now) + "T00:00:00"
  );
  // shift end to IST midnight of today, then add 24h to make [start, end) easy
  const endMs = end.getTime() + 24 * 60 * 60 * 1000; // tomorrow 00:00 IST in UTC clock
  const startMs = endMs - 7 * 24 * 60 * 60 * 1000;
  return { start: new Date(startMs), end: new Date(endMs) };
}

// GET /api/stats/weekly
export async function getWeeklyStats(req, res) {
  try {
    const userId = req.userId;
    const { start, end } = last7DaysRange();

    const rows = await HabitEvent.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: {
            day: {
              $dateToString: { date: "$createdAt", timezone: TZ, format: "%Y-%m-%d" },
            },
          },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, day: "$_id.day", count: 1 } },
    ]);

    // ensure all 7 labels exist (Sun..Sat or last 7 calendar days)
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(end.getTime() - i * 24 * 60 * 60 * 1000);
      const iso = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" })
        .format(d);
      labels.push(iso);
    }

    const map = new Map(rows.map((r) => [r.day, r.count]));
    const days = labels.map((day) => ({ day, count: map.get(day) ?? 0 }));

    return res.json({ days });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to compute weekly stats" });
  }
};

// GET /api/stats/weekly
export async function getWeeklyByHabit(req, res) {
  try {
    const userId = req.userId;
    const { start, end } = last7DaysRange();

    const rows = await HabitEvent.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: {
            habitId: "$habitId",
            day: { $dateToString: { date: "$createdAt", timezone: TZ, format: "%Y-%m-%d" } },
          },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, habitId: "$_id.habitId", day: "$_id.day", count: 1 } },
      { $sort: { habitId: 1, day: 1 } },
    ]);

    const habitIds = [...new Set(rows.map((r) => String(r.habitId)))].map((id) => new mongoose.Types.ObjectId(id));
    const habits = await Habit.find({ _id: { $in: habitIds } }, { name: 1 });

    const nameById = new Map(habits.map((h) => [String(h._id), h.name]));
    const grouped = new Map(); // habitId -> [{day,count}]

    for (const r of rows) {
      const key = String(r.habitId);
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push({ day: r.day, count: r.count });
    }

    // response shape expected by the front-end
    const items = [...grouped.entries()].map(([hid, points]) => ({
      habitId: hid,
      habitName: nameById.get(hid) || "Habit",
      points,
    }));

    return res.json({ items });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to compute weekly-by-habit stats" });
  }
};

// GET /api/stats/leaderboard
export async function getLeaderboard(req, res) {
  try {
    const userId = req.userId;

    // Update user streaks before calculating leaderboard
    await StreakService.updateUserStreaks(userId);

    // Get current user summary with updated streaks
    const myHabits = await Habit.find({ userId }, { name: 1, streak: 1, prevStreak: 1 });
    const myBest = myHabits.reduce((m, h) => Math.max(m, h.streak || 0, h.prevStreak || 0), 0);
    const currentTotal = myHabits.reduce((sum, h) => sum + (h.streak || 0), 0);
    
    const me = { 
      id: userId, 
      name: "You", 
      bestStreak: myBest, 
      currentStreak: currentTotal,
      activeHabits: myHabits.filter(h => h.streak > 0).length,
      totalHabits: myHabits.length
    };

    // NOTE: Replace this with a real multi-user aggregation if you have multi-user data.
    return res.json({ leaderboard: [me] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to compute leaderboard" });
  }
};