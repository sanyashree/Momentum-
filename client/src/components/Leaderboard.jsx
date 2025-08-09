import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { useAuth } from "../hooks/useAuth.jsx";
import { StatsAPI } from "../lib/api";

export default function Leaderboard() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!token) return;
      try {
        const res = await StatsAPI.leaderboard(token);
        if (mounted && Array.isArray(res?.leaderboard)) {
          setItems(res.leaderboard);
        }
      } catch (e) {}
    }
    load();
    return () => { mounted = false; };
  }, [token]);

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-2">Best Streaks</h2>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No streaks yet. Complete a habit to get started.</p>
        ) : (
          items.slice(0, 5).map((it, idx) => (
            <div key={it.habitId} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div className="w-6 text-muted-foreground">{idx + 1}.</div>
                <div className="font-medium">{it.name}</div>
              </div>
              <div className="text-muted-foreground">Best: {it.bestStreak} • Current: {it.currentStreak}</div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}


