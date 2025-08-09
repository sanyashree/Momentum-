import { HabitEvent } from '../models/HabitEvent.js';
import { Habit } from '../models/Habit.js';

// Returns last 7 days completion counts across all habits for the current user
export async function weeklyCompletion(req, res, next) {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startWindow = new Date(startOfToday);
    startWindow.setDate(startWindow.getDate() - 6); // last 7 days inclusive

    const pipeline = [
      { $match: { userId: req.userId, day: { $gte: startWindow, $lte: startOfToday } } },
      {
        $group: {
          _id: "$day",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const raw = await HabitEvent.aggregate(pipeline);
    // Build a continuous 7-day array
    const days = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(startOfToday);
      d.setDate(d.getDate() - i);
      const match = raw.find((r) => new Date(r._id).getTime() === d.getTime());
      days.push({ day: d.toISOString(), value: match ? match.count : 0 });
    }
    res.json({ series: days });
  } catch (err) {
    next(err);
  }
}

export async function weeklyByHabit(req, res, next) {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startWindow = new Date(startOfToday);
    startWindow.setDate(startWindow.getDate() - 6);

    const [habits, events] = await Promise.all([
      Habit.find({ userId: req.userId }).select('_id name streak').lean(),
      HabitEvent.find({ userId: req.userId, day: { $gte: startWindow, $lte: startOfToday } })
        .select('habitId day')
        .lean(),
    ]);

    const eventSet = new Set(events.map((e) => `${String(e.habitId)}::${new Date(e.day).getTime()}`));

    const days = [];
    const dayList = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(startOfToday);
      d.setDate(d.getDate() - i);
      days.push(d.getTime());
      dayList.push(d.toISOString());
    }

    const series = habits.map((h) => ({
      habitId: String(h._id),
      name: h.name,
      currentStreak: h.streak || 0,
      series: days.map((t, idx) => ({ day: dayList[idx], value: eventSet.has(`${String(h._id)}::${t}`) ? 1 : 0 })),
    }));

    res.json({ habits: series });
  } catch (err) {
    next(err);
  }
}

export async function leaderboard(req, res, next) {
  try {
    // Compute best streak per habit using events
    const habits = await Habit.find({ userId: req.userId }).select('_id name streak').lean();
    const events = await HabitEvent.find({ userId: req.userId }).select('habitId day').sort({ habitId: 1, day: 1 }).lean();

    const byHabit = new Map();
    for (const e of events) {
      const key = String(e.habitId);
      if (!byHabit.has(key)) byHabit.set(key, []);
      byHabit.get(key).push(new Date(e.day));
    }

    function computeBest(dates) {
      if (!dates || dates.length === 0) return 0;
      let best = 1;
      let cur = 1;
      for (let i = 1; i < dates.length; i += 1) {
        const prev = dates[i - 1];
        const curr = dates[i];
        const prevStart = new Date(prev.getFullYear(), prev.getMonth(), prev.getDate()).getTime();
        const currStart = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate()).getTime();
        const diffDays = Math.round((currStart - prevStart) / (24 * 60 * 60 * 1000));
        if (diffDays === 1) {
          cur += 1;
        } else if (diffDays === 0) {
          // same day duplicate shouldn't happen due to unique index, but ignore
        } else {
          if (cur > best) best = cur;
          cur = 1;
        }
      }
      if (cur > best) best = cur;
      return best;
    }

    const items = habits.map((h) => {
      const best = computeBest(byHabit.get(String(h._id)) || []);
      return { habitId: String(h._id), name: h.name, bestStreak: best, currentStreak: h.streak || 0 };
    });

    items.sort((a, b) => (b.bestStreak - a.bestStreak) || (b.currentStreak - a.currentStreak) || a.name.localeCompare(b.name));
    res.json({ leaderboard: items });
  } catch (err) {
    next(err);
  }
}


