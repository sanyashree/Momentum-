import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { useAuth } from "../hooks/useAuth.jsx";
import { StatsAPI } from "../lib/api";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

function formatDayLabel(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export default function WeeklyChart() {
  const { token } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!token) return;
      try {
        const res = await StatsAPI.weekly(token);
        if (mounted && Array.isArray(res?.series)) {
          setData(res.series.map((p) => ({ day: formatDayLabel(p.day), value: p.value })));
        }
      } catch (e) {
        // ignore
      }
    }
    load();
    return () => { mounted = false; };
  }, [token]);

  return (
    <Card className="p-4">
      <div className="mb-2">
        <h2 className="text-lg font-semibold">Weekly Completions</h2>
        <p className="text-xs text-muted-foreground">Across all habits (last 7 days)</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="value" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}


