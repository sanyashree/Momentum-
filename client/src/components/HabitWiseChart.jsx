import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { useAuth } from "../hooks/useAuth.jsx";
import { StatsAPI } from "../lib/api";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

function toDayLabel(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export default function HabitWiseChart({ refreshKey = 0 }) {
  const { token } = useAuth();
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) return;
      try {
        const res = await StatsAPI.weeklyByHabit(token);
        if (cancelled || !Array.isArray(res?.items)) return;

        // items: [{ habitId, habitName, points: [{ day, count }, ...] }, ...]
        const habits = res.items;
        const x = Array.from(
          new Set(
            habits.flatMap((h) => (h.points || []).map((p) => toDayLabel(p.day)))
          )
        );

        const rows = habits.map((h) => {
          const map = new Map((h.points || []).map((p) => [toDayLabel(p.day), p.count]));
          return {
            name: h.habitName || "Habit",
            data: x.map((label) => map.get(label) ?? 0),
          };
        });

        if (!cancelled) {
          setCategories(x);
          setSeries(rows);
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, refreshKey]); // <— include refreshKey

  const chartData = categories.map((label, i) => {
    const row = { day: label };
    series.forEach((s) => {
      row[s.name] = s.data[i] ?? 0;
    });
    return row;
  });

  return (
    <Card className="p-4">
      <div className="mb-2">
        <h2 className="text-lg font-semibold">Habit-wise Weekly Completions</h2>
        <p className="text-xs text-muted-foreground">Each line shows a habit over the last 7 days</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            {series.map((s) => (
              <Line key={s.name} type="monotone" dataKey={s.name} strokeWidth={2} dot />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}