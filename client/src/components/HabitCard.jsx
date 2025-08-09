// Displays a single habit with its streak and a "Mark done" toggle.
// This is frontend-only: we update local state in the parent Dashboard.

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function HabitCard({ habit, onToggle, onDelete }) {
  const { name, streak, completedToday, color } = habit;

  return (
    <Card className="p-4 flex items-center justify-between">
      {/* Left: name + streak badge */}
      <div className="flex items-center gap-3">
        <div className={`h-8 w-8 rounded ${color} border`} aria-hidden />
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-muted-foreground">Streak: {streak} day{streak === 1 ? "" : "s"}</p>
        </div>
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={completedToday ? "secondary" : "default"}
          onClick={onToggle}
          title={completedToday ? "Undo today's completion" : "Mark done for today"}
        >
          {completedToday ? "Done ✓" : "Mark done"}
        </Button>
        {onDelete ? (
          <Button size="sm" variant="outline" onClick={onDelete} title="Delete habit">
            Delete
          </Button>
        ) : null}
      </div>
    </Card>
  );
}