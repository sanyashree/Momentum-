import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { useAuth } from "../hooks/useAuth.jsx";
import { StatsAPI } from "../lib/api";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

function toDayLabel(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export default function HabitWiseChart() {
  const { token } = useAuth();
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!token) return;
      try {
        const res = await StatsAPI.weeklyByHabit(token);
        if (mounted && Array.isArray(res?.habits)) {
          // categories: last 7 days (from first habit's series)
          const days = res.habits[0]?.series?.map((p) => toDayLabel(p.day)) || [];
          setCategories(days);
          setSeries(res.habits);
        }
      } catch (e) {}
    }
    load();
    return () => { mounted = false; };
  }, [token]);

  // Recharts supports one dataset; we transform categories into x-axis labels and
  // build a dataset where each habit is a separate line via keys.
  const chartData = categories.map((day, idx) => {
    const row = { day };
    for (const h of series) {
      row[h.name] = h.series?.[idx]?.value ?? 0;
    }
    return row;
  });

  return (
    <Card className="p-4">
      <div className="mb-2">
        <h2 className="text-lg font-semibold">Habit-wise Weekly Completions</h2>
        <p className="text-xs text-muted-foreground">Each line is a habit over the last 7 days</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            {series.map((h) => (
              <Line key={h.habitId} type="monotone" dataKey={h.name} strokeWidth={2} dot />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}


