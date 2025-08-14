import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { useAuth } from "../hooks/useAuth.jsx";
import { StatsAPI } from "../lib/api";

export default function Leaderboard({ refreshKey = 0 }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!token) return;
      try {
        const res = await StatsAPI.leaderboard(token);
        if (mounted && Array.isArray(res?.leaderboard)) {
          setItems(
            res.leaderboard.map((it) => ({
              id: it.userId || it.id,
              name: it.name || "User",
              bestStreak: it.bestStreak ?? 0,
              currentStreak: it.currentStreak ?? 0,
            }))
          );
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [token, refreshKey]); // <— include refreshKey

  return (
    <Card className="p-4">
      <div className="mb-2">
        <h2 className="text-lg font-semibold">Leaderboard</h2>
        <p className="text-xs text-muted-foreground">Top streaks</p>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No data yet.</div>
        ) : (
          items.map((it, idx) => (
            <div key={it.id || idx} className="flex items-center justify-between rounded-md border p-2">
              <div className="flex items-center gap-3">
                <div className="w-6 text-muted-foreground">{idx + 1}.</div>
                <div className="font-medium">{it.name}</div>
              </div>
              <div className="text-muted-foreground">
                Best: {it.bestStreak} • Current: {it.currentStreak}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}